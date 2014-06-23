// 
// PRODUCT MODEL
// 

var Product = Backbone.Model.extend({
  initialize: function() {
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
  },
  updateColour2: function() {
    var colours = this.get("colours");
    colours[1] = this.get("colour_2");
    this.set("colours", colours)
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

// 
// STEPS PRESENTER
// 

var StepsPresenter = function(model, view) {
  this.view = view;
  this.model = model; 
  this.model.set("quantity", 8)
  this.model.set("guests", new Guests([{name: "..."},{name: "..."},{name: "..."},{name: "..."},{name: "..."},{name: "..."},{name: "..."},{name: "..."}]))
  this.quantity = 8
  this.currentStep = 1; // The current step that is highlighted, starts with 1 as this is the first step 
  this.hoveringStep = 0;
  this.name = this.model.get("name")
  this.changeTexture = false;
  this.textures = ["plain", "hammered", "linen"]
  this.renderPrice();
}

StepsPresenter.prototype = {
  moveStep: function() {
    this.toggleStepOff = this.currentStep;
    this.view.render();
    this.toggleStepOn = this.currentStep + 1;
    this.view.render();
    this.currentStep = this.currentStep + 1;
  },
  hoverStepOn: function(step_number) { // takes the new step_number to fade in
    if(this.currentStep == step_number) {
      return false
    } else {
      this.toggleStepOn = step_number;
      this.view.render();
    }
  },  
  hoverStepOff: function(step_number) {
    if(this.currentStep == step_number) {
    return false
    } else {
      this.toggleStepOff = step_number;
      this.view.render();
    }
  },
  renderPrice: function() {
    var total = thisProduct.get("total"),
    ary = total.toString()  .split(".");
    this.pounds = ary[0];
    this.dec = ary[1];
  },
  updateQty: function(number) {
    this.quantity = this.quantity + number;
    this.model.set("quantity", this.quantity)
    this.changeQty = true;
    var guests = this.model.get("guests")
    if(number > 0) {
      guests.add([{name: "..."}, {name: "..."},{name: "..."},{name: "..."},{name: "..."},{name: "..."},{name: "..."},{name: "..."}]) 
      }
    else {
      var silent = false;  
      for(var i =0;  i < 8; i++) {  
        if(i > 6) { silent = true;} 
        guests.pop({silent: silent});
      }
    }
    this.model.set("guests", guests)
    this.renderPrice();
    this.view.render();
  },
  updateTexture: function(index) {
    this.model.set("texture", this.textures[index])
    this.changeTexture = index;
    this.view.render();
  },
  updateWeight: function(index) {
    this.model.set("weight", 200)
    this.changeWeight = index;
    this.view.render();
  },
  display_step_1: function() {
   if(this.currentStep == 1) {
     return("display:block;")
   }
  },
  guests: function() {
    return(this.model.get("guests").pluck("name"))
  }
}
