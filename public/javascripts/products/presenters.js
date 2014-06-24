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
