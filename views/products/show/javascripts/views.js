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

// 2D Bitmap View
////////////////////////////////////////////////////////////////////////////// 
var DownloadView = Backbone.View.extend({
  events: {
    'click #print_button': 'printView',
  },
  printView: function() {
    var print_user_interface_view = new PrintUserInterfaceView({}).render().el
    $('body').html(print_user_interface_view)
    location.hash = "scroll_point"
  },  
  render: function() { 
    if(!this.first_time) {
    var that = this;
      var place_card_el = new PlaceCardView({
        width: ($('#image_container').width() / 1.1125), 
        model: thisProduct.get("guests").first(),
        font_adjust_buttons: true
      }).render().el;
      
      $('#image_container').fadeOut(function() { // hide 3D slides 
        $('#preview').html(place_card_el).fadeIn(function() {
          that.$('.colour_0').css("background-color", thisProduct.get("colours")[0]);
          that.$('.colour_1').css("background-color", thisProduct.get("colours")[1]);
        })
        $('#preview').append('<div id="print_button" style="text-align:center;" class="grey_button"><img src="/gfx/printer_flame.svg" style="width:45px;" /><p>PRINT YOURSELF  </p></div>')
      }); 
      this.first_time = true;
    }
    return this;
  }
})

// COLOUR VIEW
////////////////////////////////////////////////////////////////////////////// 
var DOWNLOAD_VIEW_INACTIVE = true;
var ColourView = Backbone.View.extend({ 
  initialize: function() {
    this.width = $('#steps').width();  
  },
  events: {
    "dizzy-cp:hoverColor": "updateColour",
    "dizzy-cp:click": "changeColour"
  },
  updateColour: function(e, colour) {
    if(DOWNLOAD_VIEW_INACTIVE) {      
      new DownloadView({el: '#product_container', model: thisProduct}).render();
      DOWNLOAD_VIEW_INACTIVE = false;
    }
    this.changeColour(e, colour)
  },
  changeColour: function(e, colour) {  
    $('.colour_' + this.options.colour_index).css("background-color", colour)
    var colours = thisProduct.get("colours")
    colours[this.options.colour_index] = colour
    thisProduct.set("colours", colours)
  },
  render: function() {
  var that = this;
    this.$el.colorPicker({colours_per_page:12, default_color: thisProduct.get("colours")[this.options.colour_index], width:that.width});
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
    "fontpicker:selected": "changeFont",
    "click #plus_qty": "plusQty",
    "click #minus_qty": "minusQty"
  },
  changeFont: function(e, font) {   
    thisProduct.set("font_size", font.font_size)
    thisProduct.set("font", font.font)
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
  
  // RENDER METHODS
  ////////////////////////////////////////////////////////////////////////////// 
  render: function() {
    // Compile the steps template
    var $result = $(Handlebars.template(templates["products_show_step_through"])(thisProduct.toJSON()));     
      
    // Create colour pickers
    var colours = thisProduct.get("colours");
    var $colour_wrapper = $result.find("#colour_section_render")
    for(var i=0; i < colours.length; i++) {
      $colour_wrapper.append(new ColourView({colour_index: i}).render().el)
    }
    
    // Create font picker
    $result.find('#fonts').fontPicker({fonts: casamiento_fonts, selected_font: thisProduct.get("font")});
    
    // Input fields for guests
    this._renderGuests($result.find('#guests'));
    
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
