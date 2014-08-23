var Guest = Backbone.Model.extend({
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
  }
})
 
var Guests = Backbone.Collection.extend({
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
  stale: ['attachments_order', 'divs'],
  toJSON: function() {
    return _.omit(this.attributes, this.stale);
  },
  initialize: function() {  
    this.textures = ["plain", "hammered", "linen"]
    this.on("change:quantity", this.calculatePrice)
    this.on("change:texture", this.calculatePrice)
    this.on("change:weight", this.calculatePrice)
    this.updatePounds();
    this.updatePence();
  },
  hex: function() {
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
    thisProduct.save();  
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
  applyDiscounts: function(total) {
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
    var discount = this.applyDiscounts(total)
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
  }
});
