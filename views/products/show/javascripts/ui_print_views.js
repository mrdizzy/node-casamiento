// Each font has a size value such as 0.12 or 0.08 and this value
// is the size of the font as a percentage of the container width. 
// This allows us to make sure that when the font size is changed
// it remains consistent relative to its container 
//  
var PlaceCardView = GuestView.extend({
  className: 'place_card_wrapper',
  initialize: function() {
    this.listenTo(thisProduct, 'change:font', this.renderFontFamily) 
    this.listenTo(this.model, 'change:font_size', this.renderFontSize) 
    
    // the width of this container is always passed to the view
    // this is usually based on the value of some element already displayed 
    // in the DOM that can be accessed using jQuery.width()
    this.width = this.options.width;
    this.units = this.options.units || "px"
    this.font_adjust_buttons = this.options.font_adjust_buttons
    this.svg = this.options.svg
    this.height = this.options.height || 0.70714285714 * this.width; // 0.70714... is the ratio of 74.25mm to 105mm
    this.half_height = this.options.half_height || (this.height / 2);
  },
  events: {
    'click .plus_font': 'increaseFont',
    'click .minus_font': 'decreaseFont'
  },  
  renderFontFamily: function() {    
    this.$('input').css('font-family', thisProduct.get("font"));
  },
  renderFontSize: function() {
    this.$('input').css('font-size', this.calculateFontSize()+ this.units);
  },
  calculateFontSize: function() {
    return this.width * this.model.get("font_size");    
  },
  increaseFont: function() {
    this.model.adjustFontSize(1.05) // percentage increase
  },
  decreaseFont: function() {
   this.model.adjustFontSize(0.95) // percentage decrease
  },
  render: function() {   
    var compiled_template = Handlebars.template(templates["place_card"]);
    var $template = $(compiled_template({
      
      font_family: thisProduct.get("font"),   
      font_size: this.calculateFontSize(),
      background: thisProduct.get("background-5"),
      
      width: this.width, 
      height: this.height, 
      half_height: this.half_height, 
      
      svg: this.svg,           
      hex: thisProduct.get("colours")[0].substring(1),
      
      font_adjust_buttons: this.font_adjust_buttons, 
      product: thisProduct.get("_id"),
      name: this.model ? this.model.get("name") : "Mr Guest Name",
      units: this.units
    }));
    
    var colours = thisProduct.get("colours");
    
    for(var i=0; i < colours.length; i++) {
      $template.find('.colour_' + i).css("background-color", colours[i])
    }
    
    this.$el.html($template)
    return this;
  }
})

// This view is the user interface view for customising the place
// cards and uses the bitmap representations
var UIPrintView = Backbone.View.extend({
  initialize: function() {
    this.guests = thisProduct.get("guests");
   // this.listenTo(thisProduct.get("guests"), 'add', this.render)    
    //this.listenTo(thisProduct.get("guests"), 'remove', this.render)
  },
  render: function() {
    var place_cards = [],
      counter = 1;
      
    this.guests.forEach(function(guest) {
      var place_card = new PlaceCardView({
          model: guest, 
          width: ($(document).width() / 2.3),
          font_adjust_buttons: true
      }).render().el
      place_cards.push(place_card)
      
      if(counter == 3) {
        place_cards.push('<div class="page_break_3"></div>')          
      } else if (counter == 4) {          
        place_cards.push('<div class="page_break_4"></div>')
      } else if (counter == 8) {
        place_cards.push('<div class="page_break_8"></div>')
       counter = 0;
      }        
      counter = counter + 1;
    }, this)
    
    this.$el.html(place_cards)
    return this;          
  } 
})


var SVGPrintView = Backbone.View.extend({
  id: "svg_print_wrapper",
  className: "up_8",
  render: function() {
    var place_cards = [];
    var counter = 0;
    this.collection.forEach(function(guest) {
        
      var place_card = new PlaceCardView({
        model: guest, 
        width: 105, 
        height: 74.25, 
        font_adjust_buttons: false,
        half_height: 37.125,
        units: "mm",
        svg: true, 
      }).render().el
      place_cards.push(place_card)
      if (counter == 3) {
          place_cards.push("<div class='page_break'></div>")
          counter = 0;
      }
      counter = counter + 1;
    }, this)
    this.$el.html(place_cards)
    return this;
  }
  
})
var PrintUserInterfaceView = Backbone.View.extend({
  events: {
    "fontpicker:selected": "changeFont",
    "click input[type=radio]": "changeLayout",
    "click #ui_printer_icon": "printPage"
  },
  printPage: function(e) {
    var result = new SVGPrintView({collection: thisProduct.get("guests")}).render().el;
    $('body').html(result)
  },
  changeLayout: function(e) {
    var val = $(e.currentTarget).val()
    this.$('#actual_cards').attr("class", "up_" + val)
  },
  changeFont: function(e, font) { 
    thisProduct.set("font", font.font)
  },
  render: function() {
    var $template = $(Handlebars.template(templates["user_interface_for_print"])());         
    $template.find('#ui_font_picker').fontPicker({fonts:casamiento_fonts, selected_font: thisProduct.get("font")})
    
    var print_view = new UIPrintView({}).render().el;
    $template.find('#actual_cards').append(print_view)
    var width = ($(document).width() / 2.3)*2.01;
    $template.find('#actual_cards').width(width);
    this.$el.html($template)
    return this;
  }
})
