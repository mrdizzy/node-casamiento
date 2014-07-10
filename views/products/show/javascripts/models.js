////////////////////////////////////////////////////////////////
var Guest = Backbone.Model.extend({
  defaults: {
    name: "Guest Name",
    baseline: 0,
    font_size: object_fonts["<%= product.font %>"]
  },
  adjustFontSize: function(amount) {
    var new_size = amount * this.get("font_size");
    this.set("font_size", new_size)
  }
})
 
var Guests = Backbone.Collection.extend({
  model: Guest
})

////////////////////////////////////////////////////////////////
var Product = Backbone.Model.extend({
  defaults: {
    quantity: 8,
    guests: new Guests([{},{},{},{},{},{},{},{}]),
    total: 3.97,
    price: 0.10 
  },
  initialize: function() {  
    this.textures = ["plain", "hammered", "linen"]
    this.on("change:quantity", this.calculatePrice)
    this.on("change:quantity", this.adjustGuests)
    this.on("change:texture", this.calculatePrice)
    this.on("change:weight", this.calculatePrice)
    this.on("change:colour_1", this.updateColour1)
    this.on("change:colour_2", this.updateColour2)
    this.updateGuestNames();
    this.updatePounds();
    this.updatePence();
  },
  hex: function() {
    if(this.get("colours").length == 2) {
        return(this.get("colours")[0].substring(1) + "_" + thisProduct.get("colours")[1].substring(1));
    }
    return(this.get("colours")[0].substring(1))
  },
  updateGuestNames: function() {
    this.set("guest_names", this.get("guests").pluck("name"))
  },
  updatePounds: function() {  
    this.set("pounds", this.get("total").toString().split(".")[0])
  },
  updatePence: function() {
   this.set("pence", this.get("total").toString().split(".")[1])
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
  }
});
