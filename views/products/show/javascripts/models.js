var Guest = Backbone.Model.extend({
////////////////////////////////////////////////////////////////
  defaults: {
    name: "Guest Name",
    baseline: (<%= product.baseline %> || 0),
    font_size: "<%= product.font_size %>"
  },
  // TODO: upBaseline and downBaseline should be consolidated into one adjustBaseline function
  upBaseline: function() {
    this.set("baseline", (this.get("baseline") - 1))
  },
  downBaseline: function() {
    this.set("baseline", (this.get("baseline") + 1))
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
 
var Guests = Backbone.Collection.extend({
////////////////////////////////////////////////////////////////
  model: Guest
})

var Product = Backbone.Model.extend({
////////////////////////////////////////////////////////////////
  urlRoot: '/products',
  idAttribute: "_id",
  localStorage: new Backbone.LocalStorage("CasamientoProducts"),
  defaults: function() {
    var defaults = <%- JSON.stringify(product) %>
    defaults.quantity = 8;
    defaults.font_size = 1;
    defaults.guests = new Guests([{},{},{},{},{},{},{},{}]);
    defaults.total = 3.97;
    defaults.price = 0.10;
    return defaults;
  },
  stale: ['attachments_order', 'divs', 'background-1', 'background-2', 'background-3', 'background-4', 'background-5'],
  toJSON: function() {
    return _.omit(this.attributes, this.stale);
  },
  initialize: function() {  
    this.textures = ["plain", "hammered", "linen"]
    this.on("change:quantity", this.calculatePrice)
    this.on("change:texture", this.calculatePrice)
    this.on("change:weight", this.calculatePrice)
    this.on("change:font", this.saveProduct)
    this.on("change:colours", this.saveProduct)    
    this.on("change:quantity", this.saveProduct)
    this.on("change:guests", this.saveProduct)
    this.listenTo(this.get("guests"), "change", this.saveProduct)
    this.updatePounds();
    this.updatePence();
  },
  saveProduct: function() {
    this.save();  
  },
  shareURL: function() {
    if (this.get("colours")[1]) {
      return ("http://www.casamiento.co.uk/products/" + 
        this.id + "/#preview_place_card/c0/" + this.get("colours")[0].substr(1) + 
        "/c1/" + this.get("colours")[1].substr(1) + 
        "/font/" + this.get("font"))  
    } else {
      return ("http://www.casamiento.co.uk/products/" + 
        this.id + "/#preview_place_card/c0/" + this.get("colours")[0].substr(1) + 
        "/font/" + this.get("font"))  
    }
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
  updatePounds: function() {  
    this.set("pounds", this.get("total").toString().split(".")[0])
  },
  updatePence: function() {
   this.set("pence", this.get("total").toString().split(".")[1])
  },
  updateColour: function(index, colour) {
    var colours = this.get("colours");
    colours[index] = colour;
    this.set("colours", colours)
    this.trigger("change:colours")
    $('.colour_' + index).css("background-color", colour) // global colour change  
  },
  adjustGuests: function() {
    var adjustment = this.get("quantity") - this.previous("quantity"),
      guests = this.get("guests");
    if(adjustment > 0) {
      for(var i =0;  i < adjustment; i++) {
        guests.add({}, {silent:true});
      }
    } else if(adjustment < 0) {
      adjustment = adjustment * -1;
      for(var i =0;  i < adjustment; i++) {
        guests.pop({silent:true});
      }
    }
    this.trigger("change:guests")
  },
  adjustQuantity: function(adjust_by) {      
    var quantity = this.get("quantity") + adjust_by;
    this.set("quantity", quantity)
    this.adjustGuests();
  },
  _applyDiscounts: function(total) {
    var qty = this.get("quantity"),
      discount = 0;
    if((qty > 32) && (qty < 96)) {
      discount = (10/100) * total
    }
    if((qty >95) && (qty < 152)) {
      discount = (15/100) * total
    }
    return discount;
  },
  calculatePrice: function() {   
    var qty = this.get("quantity"),
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
    var discount = this._applyDiscounts(total)
    total = total - discount;
    var unit_cost = (total/qty).toFixed(2);
    this.set("unit", unit_cost);
    total = unit_cost * qty;
    total = total.toFixed(2)
    this.set("total", total)    
    this.updatePounds();
    this.updatePence();
  },
  parse: function(response) {
    response.guests = new Guests(response.guests)
    return response;
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
  }
});
