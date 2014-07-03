// Each font has a size value such as 0.12 or 0.08 and this value
// is the size of the font as a percentage of the container width. 
// This allows us to make sure that when the font size is changed
// it remains consistent relative to its container 
//  
var PlaceCardView = GuestView.extend({
  initialize: function() {
    this.listenTo(thisProduct, 'change:font', this.renderFontFamily) 
    this.listenTo(this.model, 'change:font_size', this.renderFontSize) 
    
    // the width of this container is always passed to the view
    // this is usually based on the value of some element already displayed 
    // in the DOM that can be accessed using jQuery.width()
    this.width = this.options.width;
    this.height = 0.70714285714 * this.width; // 0.70714... is the ratio of 74.25mm to 105mm
    this.half_height = this.height / 2;
  },
  events: {
    'click .plus_font': 'increaseFont',
    'click .minus_font': 'decreaseFont'
  },  
  renderFontFamily: function() {    
    this.$('input').css('font-family', thisProduct.get("font"));
  },
  renderFontSize: function() {
    this.$('input').css('font-size', this.calculateFontSize()+"px");
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
      
      product: thisProduct.get("_id"),
      name: this.model ? this.model.get("name") : "Mr Guest Name",
      units:"px"
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
    this.klass = "up_8";        
    this.width = $(document).width() / 2.3;
    this.guests = thisProduct.get("guests");
    this.listenTo(thisProduct, 'change:font', this._renderFont)
   // this.listenTo(thisProduct.get("guests"), 'add', this.render)    
    //this.listenTo(thisProduct.get("guests"), 'remove', this.render)
  },
  events: {    
    "click input[type=radio]": "changeLayout"
  },
  changeLayout: function(e) {
    var val = $(e.currentTarget).val()
    this.$('#user_interface_print_view').attr("class", "up_" + val)
  },
  _renderFont: function() {
    var font = thisProduct.get("font");
    this.$('.ui_half_container_guest input').css("font-family", font);
  },
  render: function() {
    var place_cards = [],
      counter = 1
      
    this.guests.forEach(function(guest) {
      var place_card = new PlaceCardView({model: guest, width: this.width}).render().el
      place_cards.push(place_card)
     if(counter == 3) {
       place_cards.push('<div style="border-top:1px dashed grey;clear:both" class="page_break_3"></div>')          
     } else if (counter == 4) {          
       place_cards.push('<div style="border-top:1px dashed grey;clear:both" class="page_break_4"></div>')
     } else if (counter == 8) {
       place_cards.push('<div style="border-top:1px dashed grey;clear:both" class="page_break_8"></div>')
       counter = 0;
     }        
      counter = counter + 1;
    }, this)
    
    this.$el.html(place_cards)
    return this;          
  } 
})
