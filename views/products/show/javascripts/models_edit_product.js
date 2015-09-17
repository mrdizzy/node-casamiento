var EditProduct = Product.extend({
////////////////////////////////////////////////////////////////
  urlRoot: '/admin/orders',
  idAttribute: "_id",
  localStorage: 0,
  initialize: function() {  
    this.guests = this.get("guests")
    this.on("change:font", this.saveFont)
    this.on("change:colours", this.saveProduct)   
    this.on("adjustBaseline", this._adjustBaseline)
    this.on("adjustFontSize", this._adjustFontSize)
    this.listenTo(this.guests, "change", this.saveGuests)
  },
  saveFont: _.debounce(function() {
     this.save({font: this.get("font"), order_id: this.get("order_id")}, { patch:true}); 
  },1000),
  saveProduct: _.debounce(function() {
    var that = this;
    that.save({colours: that.get("colours"), order_id: that.get("order_id")}, { patch:true}); 
  }, 1000),
  saveGuests: _.debounce(function() {
    console.log("Saving guests")
    this.save({guests: this.guests, order_id: this.get("order_id")}, { patch:true })  
  },1000)
});
