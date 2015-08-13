/* 
  Each font has a size value such as 0.12 or 0.08 and this value
  is the size of the font as a percentage of the container width. 
  This allows us to make sure that when the font size is changed
  it remains consistent relative to its container 
  
  This view takes a Guest as a model.
  We start by binding the window resize events to two private render methods, _renderFontSize and
  _renderBaseline, which will rerender the font and baseline when
  the window is resized
*/
var PlaceCardView = BackboneRelativeView.extend({
  className: 'place_card_view',
  initialize: function() {      
    this.percentage_font_size = this.model.get("font_size")
    this.display_font_size = this.calculatedWidth * this.percentage_font_size;
    BackboneRelativeView.prototype.initialize.apply(this)
    $(window).bind("resize", _.bind(this._renderFontSize, this));
    $(window).bind("resize", _.bind(this._renderBaseline, this));
    this.listenTo(thisProduct, 'change:font', this._renderFontFamily); 
    this.listenTo(thisProduct, 'adjustFontSize', this._adjustFontSize)
    this.listenTo(this.model, "change:baseline", this._renderBaseline)
    this.listenTo(this.model, "change:name", this._renderName)
    this.listenTo(this.model, "remove", this.deleteGuest)
  },  
  events: {  
    "blur .guest_name": 'updateGuestFromDiv',
    'focus .guest_name': 'focusGuest',
    'click .delete_guest': 'deleteGuest',
    'click .plus_font': 'increaseFont',  
    'click .minus_font': 'decreaseFont',
    'click .up_baseline': 'upBaseline',
    'click .down_baseline': 'downBaseline',
     "keyup .guest_name": "resetFocus"
  },   
  focusGuest: function() {
    app_router.navigate("editing_place_cards")
    var that = this;
    $('body').addClass("guest_focused")
     this.timeout_id = setTimeout(function(){
        that.$('.guest_name').blur();
      }, 5000);  
  },
  resetFocus: function() {
      var that = this;
 
    clearTimeout(this.timeout_id)
    this.timeout_id = setTimeout(function(){
       that.$('.guest_name').blur();
      }, 3000);   
  },
 blurGuest: function() {
   clearTimeout(this.timeout_id)
    $('body').removeClass("guest_focused")
  },
  deleteGuest: function() {
    //thisProduct.get("guests").remove(this.model);
      this.$el.addClass("hide")
      
    //});
  },
  updateGuestFromDiv: function() {
    this.updated_from_div = true;
   this.model.set("name", $.trim(this.$('.guest_name').text()))
   
   clearTimeout(this.timeout_id)
    $('body').removeClass("guest_focused")
  },
  increaseFont:   function() { this._adjustFontSize(1.03); thisProduct.saveGuests(); }, // percentage increase
  decreaseFont:   function() { this._adjustFontSize(0.97); thisProduct.saveGuests(); }, // percentage decrease
  upBaseline:     function() { this.model.adjustBaseline(-0.5); },
  downBaseline:   function() { this.model.adjustBaseline(0.5); },  
  
  _renderBaseline: function() {
    var baseline = this.model.calculateBaselineOffset(this.calculatedWidth);
    this.guest_name_element.css({
      "margin-top": baseline.top_half + "px", 
      "height":baseline.bottom_half + "px", 
      "line-height": baseline.bottom_half + "px"});
  },
  _renderFontFamily: function() { this.$('.guest_name').css('font-family', thisProduct.get("font")); },
  _renderFontSize: function() {
    this.guest_name_element = this.guest_name_element || this.$('.guest_name') 
    this.guest_name_element.css('font-size', this.display_font_size + "px");   
  },
  _adjustFontSize: function(amount) {
    this.percentage_font_size = this.percentage_font_size * amount;
    this.display_font_size = this.calculatedWidth * this.percentage_font_size;
    this._renderFontSize();
    this.model.set("font_size", this.percentage_font_size, {silent:true})
  },
  _renderName: function() {  
    if (!this.updated_from_div) this.$('.guest_name').text(this.model.get("name"))
    this.updated_from_div = false;
  },
  render: function() {     
    var compiled_template = Handlebars.template(templates["place_card"]),
      $template = $(compiled_template(this.model.presenter(this.calculatedWidth))),
      colours = thisProduct.get("colours");
    for(var i=0; i < colours.length; i++) {
      $template.find('.colour_' + i).css("background-color", colours[i])
    }
    this.$el.html($template)
    this.guest_name_element = this.$('.guest_name');
    return this;
  }
});