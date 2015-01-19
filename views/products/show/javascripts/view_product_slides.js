var ProductSlideView = Backbone.View.extend({
  el: '#product_container',
  render: function() {   
  var string = Handlebars.template(templates["product_slides"])(thisProduct.toJSON())

    var $result = $(string);         
    var colours = thisProduct.get("colours");
    for(var i=0; i < colours.length; i++) {
      $result.find('.colour_' + i).css("background-color", colours[i])
    }
console.log(thisProduct.get("background-4"))
    
    this.$el.html($result)
    return this;
  },  
})