Backbone.Collection.prototype.save = function (options) {
  Backbone.sync("create", this, options);
};
 
var Guest = Backbone.Model.extend({
////////////////////////////////////////////////////////////////
  defaults: {
    name: "Guest Name",
    baseline: (<%= product.baseline %> || 0),
    font_size: "<%= product.font_size %>"
  },
  adjustBaseline: function(amount) {
    this.set("baseline", this.get("baseline") + amount)
  },
  adjustFontSize: function(amount) {
    this.set("font_size", this.get("font_size") * amount)
  },
  calculateBaselineOffset: function(absolute_width) { 
    var height = (70.714285714285714285714285714286/100) * absolute_width;     
    var baseline = (this.get("baseline") /100) * height;
    var top_half_height = (height / 2) + baseline;
    var bottom_half_height = height - top_half_height - 1;
    return { top_half: top_half_height, bottom_half: bottom_half_height }
  },  
  presenter: function(absolute_width) {
    var baselines = this.calculateBaselineOffset(absolute_width)
    return {
      font_family: thisProduct.get("font"),   
      baseline_top: baselines.top_half,
      baseline_bottom: baselines.bottom_half,
      font_size: absolute_width * this.get("font_size"),
      background: thisProduct.get("background-5"),  
      product: thisProduct.get("_id"),
      name: this.get("name")
    } 
  },
  printPresenter: function() {
    if(navigator.userAgent.match(/Chrome/i) != null) var result = { width: 105, height: 74.25 }
    if (navigator.userAgent.match(/iPad/i) != null) var result = { width:120.75, height: 85.3875 }
    
    var baseline = (this.get("baseline") /100) * result.height;
    result.name = this.get("name");
    result.font = thisProduct.get("font");
    result.font_size = result.width * this.get("font_size");
    result.margin_top = (result.height /2) + baseline;
    result.guest_height = result.height - result.margin_top - 1
    return result;
  }
})

var Guests = Backbone.Collection.extend({
  initialize: function() {
    this.on("change", this.saveGuests)
  },
  saveGuests: function() {
    var guests = this.map(function(guest) {
      return { name: guest.get("name") }
    })
    localStorage.setItem("guests", JSON.stringify(guests));
  },
  printPresenter: function() {
    var result = this.invoke('printPresenter');
    return {
      ipad: thisProduct.get("ipad"),
      group_class: thisProduct.get("group_class"),
      per_page: thisProduct.get("per_page"),
      groups: inGroupsOf(result, thisProduct.get("per_page"))
    }
  },
  resetFont: function() {
    this.invoke('set', {
      font_size: thisProduct.get("font_size"), 
      baseline: thisProduct.get("baseline")
    })
  },
  model: Guest,
  url: '/guests'
})

var Product = Backbone.Model.extend({
////////////////////////////////////////////////////////////////
  urlRoot: '/products',
  idAttribute: "_id",
  localStorage: new Backbone.LocalStorage("CasamientoProducts"),
  defaults: function() {
    var defaults = <%- JSON.stringify(product) %>
    defaults.quantity = defaults.quantity || 8;
    defaults.font_size = defaults.font_size || 1;
    defaults.guests = defaults.guests || new Guests([{},{},{},{},{},{},{},{}]);
    defaults.total = defaults.total || 3.97;
    defaults.pence = defaults.pence || 90;
    defaults.pounds = defaults.pounds || 3;
    defaults.price = defaults.price || 0.10;
    defaults.cutting_marks = true;
    defaults.per_page = 3;
    return defaults;
  },
  initialize: function() {  
    this.guests = this.get("guests")
    this.textures = ["plain", "hammered", "linen"]
    this.on("change:texture", this.calculatePrice)
    this.on("change:weight", this.calculatePrice)
    this.on("change:font", this.saveProduct)
    this.on("change:colours", this.saveProduct)   
    this.on("change:quantity", this.calculatePrice) // must come before adjust guests
    this.on("change:quantity", this.adjustGuests)
    this.on("change:quantity", this.saveProduct)
    this.listenTo(this.guests, "change", this.saveGuests)
    this.listenTo(this.guests, "reset", this.updateQuantityFromGuests)
  },
  renderColours: function() {    
    // Globally change colours according to those saved in localStorage
    $('.colour_0').css("background-color", this.get("colours")[0])   
    $('.colour_1').css("background-color", this.get("colours")[1])  
  },
  updateQuantityFromGuests: function() {
    this.set("quantity", this.guests.length)
  },
  updateColour: function(index, colour) {
    var colours = this.get("colours");
    colours[index] = colour;
    this.set("colours", colours).trigger("change:colours")
  },
  adjustGuests: function() {
    var adjustment = this.get("quantity") - this.guests.length
    if (adjustment > 0) {
      for(var i =0;  i < adjustment; i++) {
        (i == adjustment - 1) ? this.guests.add({}) : this.guests.add({}, {silent:true})
      }
    } else if (adjustment < 0) {
      adjustment = adjustment * -1;
      for(var i =0;  i < adjustment; i++) {
        (i == adjustment - 1) ? this.guests.pop() : this.guests.pop({silent:true})
      }
    }
  },
  calculatePrice: function() {     
    var total = this.get("price") * this.get("quantity");      
    total = total.toFixed(2).toString().split(".")    
    this.set("pounds", total[0]).set("pence", total[1])
  },
  toggleCuttingMarks: function() {
    var cutting_marks = this.get("cutting_marks") ? false : true;
    this.set("cutting_marks", cutting_marks)
  },
  calculateUserAgent: function() {
    if(navigator.userAgent.match(/Chrome/i) != null) {
      this.set("chrome", true)
    } else if (navigator.userAgent.match(/iPad/i) != null) {
      this.set("ipad", true)
    }      
  },
  shareURL: function() {
    var url = "http://www.casamiento.co.uk/products/" +
      this.id + "/#preview_place_card/c0/" + this.get("colours")[0].substr(1);
    if (this.get("colours")[1]) {
      return (url + "/c1/" + this.get("colours")[1].substr(1) + "/font/" + this.get("font"))  
    } else {
      return (url + "/font/" + this.get("font"))  
    }
  },
  saveProduct: function() {
    var that = this;
    if(!this.currently_saving) {
      that.currently_saving = true;
      setTimeout(function(){
        that.save(); 
        that.currently_saving = false;
      }, 2000);
    } 
  },
  saveGuests: function() {
    this.save({guests: this.guests})  
  },
  parse: function(response) {
    if(response.guests) this.guests.reset(response.guests, {silent:true})
    delete response.guests
    return response;
  },
  svgURL: function() {
    return "/svg/" + this.get("_id") + "/" + this.hex();
  },
  hex: function() { // This provides a URL for calling the /svg function with the appropriate hex values
    var monochromatic = this.get("monochromatic"),
      colour_0 = this.get("colours")[0].substring(1) // remove hash from #000000
    if(monochromatic) { // Handle shades of grey
      var first_shade = monochromatic[0]
      var rgb = $('.colour_0').css("background-color");
      var hex = this._rgb_to_hex(rgb, first_shade/100)
      return(colour_0 + "_" + hex.substring(1));
    } 
    if(this.get("colours").length == 2) {
      return(colour_0 + "_" + thisProduct.get("colours")[1].substring(1));
    }
    return(colour_0)
  },
  // Designs can have colours that are a darker shade of a main colour. This is implemented
  // using a transparent PNG that has a black tint (100% pure black that has an opacity of between
  // 1% and 99%). In order to translate the colour to an RBG value so that we can process the SVG
  // file, we must dim the R, G and B value in the RGB colour by the percentage of the tint.
  // We then convert it back to hex so that the svg URL can be called and the file processed
  _rgb_to_hex: function(rgb, percentage){
    rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    rgb[1] = rgb[1] - (percentage * rgb[1]);
    rgb[2] = rgb[2] - (percentage * rgb[2]);
    rgb[3] = rgb[3] - (percentage * rgb[3]);

    return (rgb && rgb.length === 4) ? "#" +
      ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
      ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
      ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
  },
  stale: ['attachments_order', 'background-1', 'background-2', 'background-3', 'background-4', 'background-5', 'tags', 'description','baseline', 'pence', 'pounds', 'font_size', 'name', 'per_page', 'cutting_marks'],
  toJSON: function() {
    return _.omit(this.attributes, this.stale);
  }
});

var ShortProduct = Backbone.Model.extend({
  idAttribute: '_id'
})
String.prototype.toTitleCase = function () {
  var A = this.split(' '), B = [];
  for (var i = 0; A[i] !== undefined; i++) {
    B[B.length] = A[i].substr(0, 1).toUpperCase() + A[i].substr(1);
  }
  return B.join(' ');
}
var ShortProducts = Backbone.Collection.extend({
  url: '/products',
  model: ShortProduct,

  browsePresenter: function() {
    
    var result = this.map(function(product) {
      var product = product.attributes;
      if(product["background-1"]) {
        var name = product._id.split("-");
        product.name = name[0].replace(/_/g, ' ')
        product.name = product.name.toTitleCase();
        product["background-3"] = product["background-3"].replace(/style="/g, 'style="background-color:' + product.colours[1] + ";");
        
        product["background-4"] = product["background-4"].replace(/style="/g, 'style="background-color:' + product.colours[1] + ";");
        product["background-1"] = product["background-1"].replace(/style="/g, 'style="background-color:' + product.colours[1] + ";");
        
        product["background-2"] = product["background-2"].replace(/style="/g, 'style="background-color:' + product.colours[1] + ";");
      }
      return product
    })
   return result
  }
})