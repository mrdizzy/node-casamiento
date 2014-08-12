// STEP VIEW
////////////////////////////////////////////////////////////////////////////// 
var StepView = Backbone.View.extend({ 
  el: '.right_column',
  initialize: function() {
    this.listenTo(thisProduct, 'change:quantity', this.renderQtyAndPrice)
    this.listenTo(thisProduct, 'change:guests', this._renderGuests)
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
  checkout: function() {
    $.form('/payments', { 
      "L_PAYMENTREQUEST_0_AMT0": thisProduct.get("unit"), 
      "PAYMENTREQUEST_0_AMT": thisProduct.get("total"), 
      "L_PAYMENTREQUEST_0_QTY0": thisProduct.get("quantity"), 
      "L_PAYMENTREQUEST_0_NAME0": thisProduct.get("name"), 
      "L_PAYMENTREQUEST_0_DESC0": "Some description" 
    }).submit();
  },
  plusQty: function(e) {
    this.updateQty(8)
  },
  minusQty: function(e) {
    if(thisProduct.get("quantity") > 8) 
      this.updateQty(-8)
  },
  clearQuantity: function(e) {
    $(e.currentTarget).val("")
  },
  setQuantity: function(e) {
    $field = $(e.currentTarget)
    var value = $field.val();
    if(isNaN(value) || value == false || value < 1) {
      $field.val(thisProduct.get("quantity"))
    } else {
      var remainder = value % 8;
      if(remainder > 0) {
        var new_quantity = 8- remainder + parseInt(value);
      } else if (remainder ==0) {
          new_quantity = value;
      }
      thisProduct.set("quantity", new_quantity)
      $field.val(new_quantity)
      thisProduct.save()
    }
  },
  updateQty: function(number) {
    thisProduct.adjustQuantity(number)
    thisProduct.save()
  },
  renderQtyAndPrice: function() {    
    this.$('#qty').val(thisProduct.get("quantity"))       
    this.$('span#pound').text(thisProduct.get("pounds"));
    this.$('span#decimal').text("." + thisProduct.get("pence"));  
  },
  updateTexture: function(e) {
    var texture_selected = $(e.currentTarget)
    this.model.set("texture", texture_selected.index());
    this.$('.texture').removeClass("deselected");
    texture_selected.addClass("selected");
  },
  updateWeight: function(e) {
  },
  
  // We use the index of the div to toggle it (index is its place within the hierarchy of other siblings obtained by the jquery.index() function), this breaks easily if other divs are added between or before steps. The first sibling
  // element is actually the img of the name place icon so this counts as index 0, then the first step is index 1. 
  // If we were to move the img then the first step would be index 0 so this would break things. 
  hoverOver: function(e) {
    var step_index = $(e.currentTarget).index();
    this.$('#step_' + step_index + " .step").css("background-color", thisProduct.get("colours")[0])      
    this.$('#step_' + step_index + " .tooltip-bubble").fadeToggle()
    this.$('#step_' + step_index).toggleClass('highlight')
  },
  hoverOut: function(e) {
    var step_index = $(e.currentTarget).index();
    if(step_index != this.current_step) {
      this.$('#step_' + step_index + " .step").css("background-color", "#BBB") 
    }
    
    this.$('#step_' + step_index + " .tooltip-bubble").fadeToggle()
  },
  render: function() {
    var $result = $(Handlebars.template(templates["products_show_step_through"])(thisProduct.toJSON()));     
    
    this._renderGuests($result.find('#guests'));  // Input fields for guests
    
    this.$el.html($result)
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
    $result.find('#fonts').fontPicker({
      fonts: casamiento_fonts, 
      selected_font: thisProduct.get("font")
    });
    return this;
  },  
  _renderGuests: function($element) {
    var $element = $element || this.$('#guests')
    var guests_html = []
    thisProduct.get("guests").forEach(function(guest) {    
      guests_html.push(new GuestView({model:guest}).render().el);
    })
    $element.html(guests_html);
  }
})

// GUEST VIEW
////////////////////////////////////////////////////////////////////////////// 
var GuestView = Backbone.View.extend({  
  initialize: function() {
    this.listenTo(this.model, "change:name", this.render)  
  },
  events: {
    "blur input": 'updateGuest',
    'focus input': 'clearGuest'
  },
  clearGuest: function() {
    if(this.model.get("name") == "Guest Name") 
      this.$('input').val("")     
  },
  updateGuest: function() {
   var name = this.$('input').val()
    this.model.set("name", name)
  },
  render: function() { 
    this.$el.html('<input type="text" name="guest" value="' + this.model.get("name") + '"></input>')
    return this;
  }
})

