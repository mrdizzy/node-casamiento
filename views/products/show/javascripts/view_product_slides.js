var ProductSlideView = Backbone.View.extend({
  el: '#product_container',
  render: function() {   
  var string = Handlebars.template(templates["product_slides"])(thisProduct.toJSON())

    var $result = $(string);         
    var colours = thisProduct.get("colours");
    for(var i=0; i < colours.length; i++) {
      $result.find('.colour_' + i).css("background-color", colours[i])
    }
    this.$el.html($result)
    
  $("#product_slideshow").slidesjs({
    width: 500,
    height: 320,
 effect: {
   fade: {
        speed: 750,
      }
 },
    pagination: {
      active: false
    },
    navigation: {
      active: false
    },
    play: {
      active: false,
      auto: true,
      effect: "fade"
    },
   
    callback: {
      loaded: function(n) {
        $('#slides_spinner').hide();
      }
    }
  })
    return this;
  },  
})