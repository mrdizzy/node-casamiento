// 
// GUEST VIEW
// 
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

// 
// 2D Bitmap View
// 
var DownloadView = Backbone.View.extend({
  initialize: function() {
    this.listenTo(thisProduct, 'change:colour_1', this.render)
    this.listenTo(thisProduct, 'change:colour_2', this.render)
  },
  events: {
      'click #print_button': 'printView',
  },
  printView: function() {
    var $template = $(Handlebars.template(templates["user_interface_for_print"])());    
    $('body').html($template)         
    $('#ui_font_picker').fontPicker({fonts:casamiento_fonts, selected_font: thisProduct.get("font")})
    var print_view = new UIPrintView({}).render().el;
    $('#actual_cards').html(print_view)
    
    location.hash = "top_of_page"
  },
  render: function() { 
    if(!this.first_time) {
      var width = $('#ruler').width();
      var place_card_el = new PlaceCardView({width:width}).render().el;
      $('#image_container').fadeOut(function() { // hide 3D slides 
        $('#preview').html(place_card_el) 
        $('#preview').fadeIn()// display 2D customise image 
        location.hash = "preview"// jumps to <div id=foo> or <a name="foo">
      }); 
      this.first_time = true;
    }
    return this;
  }
})

// 
// STEP VIEW
// 
var StepView = Backbone.View.extend({ 
  el: '#steps',
  initialize: function() {
    _.bindAll(this, 'render')
  },
  events: {     
    "click #buy": "checkout",        
    "mouseenter .spc": "hoverStep",
    "mouseleave .spc": "hoverStep",     
    "click .texture": "updateTexture",  
    "click .weight": "updateWeight",  
    "fontpicker:selected": "changeFont",
    "dizzy-cp:hoverColor #picker_1": "updateColour1",
    "dizzy-cp:hoverColor #picker_2": "updateColour2",
    "dizzy-cp:click #picker_1": "selectColour1",    
    "dizzy-cp:click #picker_2": "selectColour2",
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
  selectColour1: function(e, colour) {
  },
  updateColour1: function(e, colour) {
    thisProduct.set("colour_1", colour)
  },
  updateColour2: function(e, colour) {    
    thisProduct.set("colour_2", colour)
  },
  plusQty: function(e) {
    this.updateQty(8)
  },
  minusQty: function(e) {
    if(thisProduct.get("quantity") > 8) 
      this.updateQty(-8)
  },
  updateQty: function(number) {
    var quantity = thisProduct.get("quantity") + number;
    thisProduct.set("quantity", quantity);
    var guests = thisProduct.get("guests")
    if(number > 0) {
      guests.add([{},{},{},{},{},{},{},{}]) 
    } else {
      var silent = false;  
      for(var i =0;  i < 8; i++) {  
        if(i > 6) { silent = true; } 
        guests.pop({silent: silent});
      }
    }
    thisProduct.set("guests", guests);
    this.$('#qty').val(thisProduct.get("quantity"))
    this.$('span#pound').text(that.presenter().pounds());
    this.$('span#decimal').text("." + that.presenter().dec());
    this._renderGuests()
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
    this.$('#step_' + step_index + " .chat-bubble").slideToggle()
    this.$('#step_' + step_index).toggleClass('highlight')
  },
  
  //
  // RENDER METHODS
  //
  render: function() {
    // Compile the steps template
    var $result = $(Handlebars.template(templates["products_show_step_through"])(this.presenter()));     
      
    // Create colour pickers and font pickers
    var colours_1 = $result.find("#picker_1").colorPicker({colours_per_page:12, default_color: thisProduct.get("colours")[0]});
    if(thisProduct.get("colours")[1]) {
      var colours_2 =$result.find('#picker_2').colorPicker({colours_per_page:12, default_color: thisProduct.get("colours")[1]});
    }
    
    // Create font picker
    $result.find('#fonts').fontPicker({fonts: casamiento_fonts, selected_font: thisProduct.get("font")});
    
    // Input fields for guests
    this._renderGuests($result.find('#guests'));
    
    $('.step').css("background-color", thisProduct.get("colours")[0]) // move to template
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
  }, 
    
  presenter: function() {
    var productJSON = thisProduct.toJSON();
    var presented = _.extend(productJSON, {
      guests: function() {
        return(productJSON.guests.pluck("name"))
      },
      pounds: function() {
        return productJSON.total.toString().split(".")[0]
      },
      dec: function() {
        return productJSON.total.toString().split(".")[1]
      }
    });
    return presented;
  }
})
