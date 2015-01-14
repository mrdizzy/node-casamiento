var ProductSlideView = Backbone.View.extend({
  el: '#product_container',
  render: function() {    
    var $result = $(Handlebars.template(templates["product_slides"])(thisProduct.toJSON()));         
    var colours = thisProduct.get("colours");
    for(var i=0; i < colours.length; i++) {
      $result.find('.colour_' + i).css("background-color", colours[i])
    }
    this.$el.html($result)
    return this;
  },  
})