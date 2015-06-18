/* 
  Each font has a size value such as 0.12 or 0.08 and this value
  is the size of the font as a percentage of the container width. 
  This allows us to make sure that when the font size is changed
  it remains consistent relative to its container 
  
  This view inherits from GuestView. It takes a Guest as a model.
  We start by binding the window resize events to two private render methods, _renderFontSize and
  _renderBaseline, which will rerender the font and baseline when
  the window is resized
*/
var PlaceCardView = GuestView.extend({
  className: 'place_card_view',
  initialize: function() {      
    GuestView.prototype.initialize.apply(this)
    $(window).bind("resize", _.bind(this._renderFontSize, this));
    $(window).bind("resize", _.bind(this._renderBaseline, this));
    this.listenTo(thisProduct, 'change:font', this._renderFontFamily);   
    this.listenTo(this.model, "change:font_size", this._renderFontSize);
    this.listenTo(this.model, "change:baseline", this._renderBaseline)
  },  
  events: {
    'click .plus_font': 'increaseFont',    
    "blur .guest_name": 'updateGuestFromDiv',
    'click .minus_font': 'decreaseFont',
    'click .up_baseline': 'upBaseline',
    'click .down_baseline': 'downBaseline',   
    'click .delete_guest': 'deleteGuest', // see parent GuestView for implementation
    "blur input": 'updateGuest', // see parent GuestView for implementation
    'focus input': 'clearGuest' // see parent GuestView for implementation
  }, 
  increaseFont: function() {
    this.model.adjustFontSize(1.03) // percentage increase
  },
  decreaseFont: function() {
   this.model.adjustFontSize(0.97) // percentage decrease
  },
  upBaseline: function() {
    this.model.adjustBaseline(-0.5);
  },
  downBaseline: function() {
    this.model.adjustBaseline(0.5);
  },  
  updateGuestFromDiv: function() {
    this.model.set("name", this.$('.guest_name').text()).trigger("change:name")
  },
  _renderName: function() {
    this.$('.guest_name').text(this.model.get("name"))            
  },
  _renderFontFamily: function() {
    this.$('.guest_name').css('font-family', thisProduct.get("font"));  
  },
  _renderFontSize: function() {
    var font_size = this.calculatedWidth * this.model.get("font_size");
    this.$('.guest_name').css('font-size', font_size + "px");   
  },
  _renderBaseline: function() {
    var baseline = this.model.calculateBaselineOffset(this.calculatedWidth);
    this.$('.guest_name').css({
      "margin-top": baseline.top_half + "px", 
      "height":baseline.bottom_half + "px", 
      "line-height": baseline.bottom_half + "px"});
  },
  render: function() {     
    var compiled_template = Handlebars.template(templates["place_card"]),
      $template = $(compiled_template(this.model.presenter(this.calculatedWidth))),
      colours = thisProduct.get("colours");
    for(var i=0; i < colours.length; i++) {
      $template.find('.colour_' + i).css("background-color", colours[i])
    }
    this.$el.html($template)
    
    return this;
  }
})