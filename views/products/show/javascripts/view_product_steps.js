// STEP VIEW
////////////////////////////////////////////////////////////////////////////// 
var StepView = Backbone.View.extend({ 
  el: '.right_column',
  initialize: function() {
    this.listenTo(thisProduct, 'change:quantity', this._renderGuests)
    this.current_step = 1;
  },
  events: {     
    "click .buy": "checkout",        
    "mouseenter .spc": "hoverOver",
    "mouseleave .spc": "hoverOut",     
    "click .texture": "updateTexture",  
    "blur #qty": "setQuantity",  
    "click #plus_qty": "plusQty",
    "click #minus_qty": "minusQty",
    "focus #qty": "clearQuantity",
    "click .weight": "updateWeight",
    "blur #quick_guests": "quickGuests"
  },
  quickGuests: function() {
    var guests = ($('#quick_guests').val());
    if (!($.trim(guests ) == '')) {
    if(guests.indexOf(',') === -1) { // Check how the names are delimited (comma or newline)
      guests = guests.split("\n")
    } else {
      guests = guests.split(",")
    }
   
    var names = _.map(guests, function(name) {
      name = $.trim(name);
      return {name: name}
    })   
    thisProduct.get("guests").reset(names)
    }
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
    if(isNaN(value) || value == false || value < 1) {
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
    var step_index = $(e.currentTarget).index() - 1;
    this.$('#step_' + step_index + " .step").css("background-color", thisProduct.get("colours")[0])      
    this.$('#step_' + step_index).toggleClass('highlight')
  },
  hoverOut: function(e) {
    var step_index = $(e.currentTarget).index() - 1;
    if(step_index != this.current_step) this.$('#step_' + step_index + " .step").css("background-color", "#BBB") 
  },
  checkout: function() {
    $('.paypal_spinner').show();
    $('.buy').hide();
    thisProduct.makePurchase();
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
    this.$('#fonts').fontPicker({
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
