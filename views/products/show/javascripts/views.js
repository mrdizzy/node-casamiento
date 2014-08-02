// 2D Bitmap Preview View
////////////////////////////////////////////////////////////////////////////// 
var PreviewView = Backbone.View.extend({
  events: {
    'click #print_button': '_renderPrintView',
  },
  _renderPrintView: function() {
    var print_control_panel_view = new PrintControlPanelView({}).render().el
    $('body').html(print_control_panel_view)
    var $colour_pickers = $('#colour_swatches')
      
    // Create colour pickers
    var colours = thisProduct.get("colours");
    for(var i=0; i < colours.length; i++) {
      $colour_pickers.append(new ColourView({colour_index: i, width: $colour_pickers.width()}).render().el)
    }

    thisProduct.trigger("render:font")
    //location.hash = "top_of_page" // Positions us at the top of the page
  },  
  render: function() { 
    var place_card_view = new PlaceCardView({
      model: thisProduct.get("guests").first(), 
    }).render().el
    
    this.$el.html(place_card_view)
    this.$('.colour_0').css("background-color", thisProduct.get("colours")[0]);
    this.$('.colour_1').css("background-color", thisProduct.get("colours")[1]);
    return this;
  }
})

// STEP VIEW
////////////////////////////////////////////////////////////////////////////// 
var StepView = Backbone.View.extend({ 
  el: '#steps',
  initialize: function() {
    this.listenTo(thisProduct, 'change:quantity', this.renderQtyAndPrice)
    this.listenTo(thisProduct, 'change:guests', this._renderGuests)
  },
  events: {     
    "click #buy": "checkout",        
    "mouseenter .spc": "hoverStep",
    "mouseleave .spc": "hoverStep",     
    "click .texture": "updateTexture",  
    "blur #qty": "setQuantity",
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
  setQuantity: function(e) {
    $field = $(e.currentTarget)
    var value = $field.val();
    var remainder = value % 8;
    if(remainder > 0) {
      var new_quantity = 8- remainder + parseInt(value);
    } else if (remainder ==0) {
        new_quantity = value;
    }
    thisProduct.set("quantity", new_quantity)
    $field.val(new_quantity)
  },
  updateQty: function(number) {
    thisProduct.adjustQuantity(number)
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
  hoverStep: function(e) {
    var step_index = $(e.currentTarget).index();
    this.$('#step_' + step_index + " .step").fadeToggle()      
    this.$('#step_' + step_index + " .tooltip-bubble").fadeToggle()
    this.$('#step_' + step_index).toggleClass('highlight')
  },
  render: function() {
    // Compile the steps template
    var $result = $(Handlebars.template(templates["products_show_step_through"])(thisProduct.toJSON()));     
    
    this._renderGuests($result.find('#guests'));  // Input fields for guests
    
    this.$el.html($result)
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

// COLOUR VIEW
////////////////////////////////////////////////////////////////////////////// 
var ColourView = Backbone.View.extend({ 
  events: {
    "dizzy-cp:hoverColor": "changeColour",
    "dizzy-cp:click": "changeColour"
  },
  changeColour: function(e, colour) {  
  console.log("changing")
    $('.colour_' + this.options.colour_index).css("background-color", colour)
    var colours = thisProduct.get("colours")
    colours[this.options.colour_index] = colour
    thisProduct.set("colours", colours).trigger("change:colours")
  },
  render: function() {
    var that = this;
    this.$el.colorPicker({
      default_color: thisProduct.get("colours")[this.options.colour_index], 
      width:that.options.width
    });
    return this;
  }
})

// GUEST VIEW
////////////////////////////////////////////////////////////////////////////// 
var GuestView = Backbone.View.extend({  
  events: {
    "blur input": 'updateGuest',
    'focus input': 'clearGuest'
  },
  clearGuest: function() {
    if(!this.model.hasChanged("name")) 
      this.$('input').val("")      
  },
  updateGuest: function() {
    this.model.set("name", this.$('input').val())
  },
  render: function() { 
    this.$el.html('<input type="text" name="guest" value="' + this.model.get("name") + '"></input>')
    return this;
  }
})

