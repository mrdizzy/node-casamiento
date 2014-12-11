var ProductSlideView = Backbone.View.extend({
  el: '#product_container',
 render: function() {    
    var $result = $(Handlebars.template(templates["product_slides"])(thisProduct.toJSON()));         
    
    this.$el.html($result)
    this.$el.fadeIn();
    return this;
  },  
})