var Guest = Backbone.Model.extend({
////////////////////////////////////////////////////////////////
  defaults: {
    name: "Guest Name",
    baseline: (<%= product.baseline %> || 0),
    font_size: "<%= product.font_size %>"
  },
  adjustBaseline: function(amount) {
    this.set("baseline", (this.get("baseline") + amount))
  },
  adjustFontSize: function(amount) {
    this.set("font_size", this.get("font_size") * amount)
  },
  calculateBaselineOffset: function(height) {
    var baseline = (this.get("baseline") /100) * height;
    this.top_half_height = (height / 2) + baseline;
    this.bottom_half_height = height - this.top_half_height - 1;
  }
})

Backbone.Collection.prototype.save = function (options) {
    Backbone.sync("create", this, options);
};
 
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
    return defaults;
  },
  initialize: function() {  
    this.guests = this.get("guests")
    this.textures = ["plain", "hammered", "linen"]
    this.on("change:texture", this.calculatePrice)
    this.on("change:weight", this.calculatePrice)
    this.on("change:font", this.saveProduct)
    this.on("change:colours", this.saveProduct)   
    this.on("change:colours", this.renderColours)
    this.once("sync", this.renderColours)
    this.listenTo(this.guests, "add", this.saveGuests)
    this.listenTo(this.guests, "remove", this.saveGuests)
    this.listenTo(this.guests, "change", this.saveGuests)

  },
  renderColours: function() {    
    // Globally change colours according to those saved in localStorage
    $('.colour_0').css("background-color", this.get("colours")[0])   
    $('.colour_1').css("background-color", this.get("colours")[1])  
  },
  saveProduct: function() {
    var that = this;
    if(!this.currently_saving) {
      console.log("not saving")
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
  updateColour: function(index, colour) {
    var colours = this.get("colours");
    colours[index] = colour;
    this.set("colours", colours).trigger("change:colours")
  },
  quantity: function() {
    return this.guests.length  
  },
  adjustGuests: function(new_amount) {
    var adjustment = new_amount - this.guests.length
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
    this.calculatePrice();
  },
  calculatePrice: function() {   
  console.log("calcuating price", this.quantity())
    var qty = this.quantity();
      total = this.get("price") * qty,
      texture = this.get("texture"),
      weight = this.get("weight");
    if(weight == "300") {
      total = ((25/100) * total) + total 
    }
    if(texture == "hammered") {
      total = ((25/100) * total) + total
    } else if (texture == "linen") {
      total = ((25/100) * total) + total
    }
   // var discount = this._applyDiscounts(total)
    total = total //- discount;
    var unit_cost = (total/qty).toFixed(2);
    this.set("unit", unit_cost);
    total = unit_cost * qty;
    total = total.toFixed(2)    
    this.set("pounds", this.get("total").toString().split(".")[0])  
    this.set("pence", this.get("total").toString().split(".")[1])
    this.set("total", total)    
  },
  //_applyDiscounts: function(total) {
  //  var qty = this.quantity(),
  //    discount = 0;
  //  if((qty > 32) && (qty < 96)) {
  //    discount = (10/100) * total
  //  }
  //  if((qty >95) && (qty < 152)) {
  //    discount = (15/100) * total
  //  }
  //  return discount;
  //},
  shareURL: function() {
    var url = "http://www.casamiento.co.uk/products/" +
      this.id + "/#preview_place_card/c0/" + this.get("colours")[0].substr(1);
    if (this.get("colours")[1]) {
      return (url + "/c1/" + this.get("colours")[1].substr(1) + "/font/" + this.get("font"))  
    } else {
      return (url + "/font/" + this.get("font"))  
    }
  },
  parse: function(response) {
    if(response.guests) this.guests.reset(response.guests, {silent:true})
    delete response.guests
    return response;
  },
  hex: function() { // This provides a URL for calling the /svg function with the appropriate hex values
    var monochromatic = this.get("monochromatic")
    if(monochromatic) { // Handle shades of grey
      var first_shade = monochromatic[0]
      var rgb = $('.colour_0').css("background-color");
      var hex = this._rgb_to_hex(rgb, first_shade/100)
      return(this.get("colours")[0].substring(1) + "_" + hex.substring(1));
    } 
    if(this.get("colours").length == 2) {
      return(this.get("colours")[0].substring(1) + "_" + thisProduct.get("colours")[1].substring(1));
    }
    return(this.get("colours")[0].substring(1))
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
  stale: ['attachments_order', 'background-1', 'background-2', 'background-3', 'background-4', 'background-5', 'tags', 'description','baseline', 'pence', 'pounds', 'font_size', 'name'],
  toJSON: function() {
    this.attributes.quantity = this.quantity();
    return _.omit(this.attributes, this.stale);
  }
});
