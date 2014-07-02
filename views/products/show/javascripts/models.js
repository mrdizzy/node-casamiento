// 
// GUESTS MODEL
// 
var Guest = Backbone.Model.extend({})
 
var Guests = Backbone.Collection.extend({
    defaults: {
        name: "Guest Name"
    },
  model: Guest
})

//
// PRODUCT MODEL
// 
var Product = Backbone.Model.extend({
  defaults: {
    quantity: 8,
    guests: new Guests([{name: "..."},{name: "..."},{name: "..."},{name: "..."},{name: "..."},{name: "..."},{name: "..."},{name: "..."}]),
    total: 2.99
  },
  initialize: function() {  
    this.textures = ["plain", "hammered", "linen"]
    this.on("change:quantity", this.calculatePrice)
    this.on("change:texture", this.calculatePrice)
    this.on("change:weight", this.calculatePrice)
    this.on("change:colour_1", this.updateColour1)
    this.on("change:colour_2", this.updateColour2)
  },
  updateColour1: function() {
    var colours = this.get("colours");
    colours[0] = this.get("colour_1");
    this.set("colours", colours)
    $('.colour_1').css("background-color", colours[0]) // global colour change
  },
  updateColour2: function() {
    var colours = this.get("colours");
    colours[1] = this.get("colour_2");
    this.set("colours", colours);    
    $('.colour_2').css("background-color", colours[1]) // global colour change
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
  }
});
