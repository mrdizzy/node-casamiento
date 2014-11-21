var BackboneRelativeView = Backbone.View.extend({
  initialize: function() {
    $(window).on("resize", this.testForMobile.bind(this)); 
    this.testForMobile();
 },
  relativeToViewport: function() {
    var widths_relative_to_viewport = this.options.widths_relative_to_viewport;
    var viewport = $('body').width();
    if(viewport < 501) return (widths_relative_to_viewport.mobile/100) * viewport;
    return (widths_relative_to_viewport.desktop/100) * viewport;
  },  
  testForMobile: function() {
    var viewport = $('body').width();
    if(viewport < 501) {
      this.mobile = true
    } else {
      this.mobile = false;
    }
  },
  
})

// STEP VIEW
////////////////////////////////////////////////////////////////////////////// 
var StepView = Backbone.View.extend({ 
  el: '.right_column',
  initialize: function() {
    this.listenTo(thisProduct, 'change:quantity', this._renderGuests)
    this.current_step = 1;
  },
  events: {     
    "click #buy": "checkout",        
    "mouseenter .spc": "hoverOver",
    "mouseleave .spc": "hoverOut",     
    "click .texture": "updateTexture",  
    "blur #qty": "setQuantity",
    "focus #qty": "clearQuantity",
    "click .weight": "updateWeight",  
    "click #plus_qty": "plusQty",
    "click #minus_qty": "minusQty"
  },
  plusQty: function(e) {
    thisProduct.set("quantity", thisProduct.get("quantity") + 1)
  },
  minusQty: function(e) { 
    thisProduct.get("guests").pop()
    thisProduct.set("quantity", thisProduct.get("quantity") -1)
  },
  clearQuantity: function(e) {
    $(e.currentTarget).val("")
  },
  setQuantity: function(e) {
    $field = $(e.currentTarget)
    var value = $field.val();
    value = parseInt(value)
    if(isNaN(value) || value == false || value < 8) {
      $field.val(thisProduct.get("quantity"))
    } else {
       thisProduct.set("quantity",value)
    }    
  },  
  updateTexture: function(e) {
    var texture_selected = $(e.currentTarget)
    this.model.set("texture", texture_selected.index());
    this.$('.texture').removeClass("deselected");
    texture_selected.addClass("selected");
  },
  // We use the index of the div to toggle it (index is its place within the hierarchy of other siblings obtained by the jquery.index() function), this breaks easily if other divs are added between or before steps. The first sibling
  // element is actually the img of the name place icon so this counts as index 0, then the first step is index 1. 
  // If we were to move the img then the first step would be index 0 so this would break things. 
  hoverOver: function(e) {
    var step_index = $(e.currentTarget).index();
    this.$('#step_' + step_index + " .step").css("background-color", thisProduct.get("colours")[0])      
    this.$('#step_' + step_index).toggleClass('highlight')
  },
  hoverOut: function(e) {
    var step_index = $(e.currentTarget).index();
    if(step_index != this.current_step) {
      this.$('#step_' + step_index + " .step").css("background-color", "#BBB") 
    }
  },
  checkout: function() {
    $.form('/payments', { 
      "L_PAYMENTREQUEST_0_AMT0": thisProduct.get("unit"), 
      "PAYMENTREQUEST_0_AMT": thisProduct.get("total"), 
      "L_PAYMENTREQUEST_0_QTY0": thisProduct.get("quantity"), 
      "L_PAYMENTREQUEST_0_NAME0": thisProduct.get("name"), 
      "L_PAYMENTREQUEST_0_DESC0": "Some description" 
    }).submit();
  },
  render: function() {    
    var $result = $(Handlebars.template(templates["products_show_step_through"])(thisProduct.toJSON()));         
    
    this.$el.html($result)
    this._renderGuests($result.find('#guests'));  // Input fields for guests
    var colours = thisProduct.get("colours");
    for(var i=0; i < colours.length; i++) {
      var $div = $('<div></div>')
      $result.find('#colour_section_render').append($div)
      
      $div.colorPicker({
        default_color: colours[i], 
        listen_to: thisProduct,
        index: i
      });
    }
    this.$el.find('#fonts').fontPicker({
      fonts: casamiento_fonts, 
      selected_font: thisProduct.get("font")
    });  
    return this;
  },  
  renderQtyAndPrice: function() { 
    this.$('#qty').val(thisProduct.get("quantity"))   
    this.$('#pound').text(thisProduct.get("pounds"));
    this.$('#decimal').text("." + thisProduct.get("pence"));  
  },
  _renderGuests: function($element) {
    if ($element.set) $element = undefined;
    var $element = $element || this.$('#guests')
    var guests_html = thisProduct.get("guests").map(function(guest) {    
      return new GuestView({model:guest}).render().el;
    })
    $element.html(guests_html);    
    this.renderQtyAndPrice();
  }
})
