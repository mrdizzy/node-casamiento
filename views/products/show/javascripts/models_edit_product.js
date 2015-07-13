var Product = Backbone.Model.extend({
////////////////////////////////////////////////////////////////
  urlRoot: '/admin/orders',
  idAttribute: "_id",
  initialize: function() {  
    this.guests = this.get("guests")
    this.on("change:font", this.saveFont)
    this.on("change:colours", this.saveProduct)   
    this.listenTo(this.guests, "change", this.saveGuests)
  },
  updateColour: function(index, colour) {
    var colours = this.get("colours");
    colours[index] = colour;
    this.set("colours", colours).trigger("change:colours")    
    $('.colour_0').css("background-color", this.get("colours")[0])   
    $('.colour_1').css("background-color", this.get("colours")[1])  
  },
  saveFont: function() {
     this.save({font: this.get("font"), order_id: this.get("order_id")}, { patch:true}); 
  },
  saveProduct: function() {
  console.log("Saving")
    var that = this;
    if(!this.currently_saving) {
      that.currently_saving = true;
      setTimeout(function(){
        that.save({colours: that.get("colours"), order_id: that.get("order_id")}, { patch:true}); 
        that.currently_saving = false;
      }, 500);
    } 
  },
  saveGuests: function() {
    this.save({guests: this.guests, order_id: this.get("order_id")}, { patch:true })  
  },
  parse: function(response) {
    if(response.guests && this.guests) {
      this.guests.reset(response.guests)
      delete response.guests;
    } else if (response.guests){
      response.guests = new Guests(response.guests, {silent:true})
    }
    return response;
  }
});
