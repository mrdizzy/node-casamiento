/* 
  Each font has a size value such as 0.12 or 0.08 and this value
  is the size of the font as a percentage of the container width. 
  This allows us to make sure that when the font size is changed
  it remains consistent relative to its container 
*/
var PlaceCardView = GuestView.extend({
  className: 'place_card_view',
  initialize: function() {      
    this.relative_to_viewport = this.options.widths_relative_to_viewport;
    this.listenTo(thisProduct, 'change:font', this._renderFontFamily);   
    this.listenTo(this.model, "change:name", this._renderName);
    this.listenTo(this.model, "change:font_size", this._renderFontSize);
    this.listenTo(this.model, "change:baseline", this._renderBaseline)
    $(window).bind("resize", _.bind(this.resizeWindow, this));
  },  
  events: {
    'click .plus_font': 'increaseFont',
    'click .minus_font': 'decreaseFont',
    'click .up_baseline': 'upBaseline',
    'click .down_baseline': 'downBaseline',   
    'click .delete_guest': 'deleteGuest', 
    "blur input": 'updateGuest',
    'focus input': 'clearGuest'
  }, 
  resizeWindow: function() {
    this._renderFontSize();
    this._renderBaseline();
  },
  increaseFont: function() {
    this.model.adjustFontSize(1.05) // percentage increase
  },
  decreaseFont: function() {
   this.model.adjustFontSize(0.95) // percentage decrease
  },
  upBaseline: function() {
    this.model.adjustBaseline(-1);
  },
  downBaseline: function() {
    this.model.adjustBaseline(1);
  },  
  _renderName: function() {
    this.$('input').val(this.model.get("name"))            
  },
  // getWidth() will report 16 pixels more for some reason -- it is something
  // to do with scrollbars during the transition. This does not happen when the 
  // window resizes, only when changing from another view
  calculateBaselineOffset: function() { 
    var height = (70.714285714285714285714285714286/100) * screenType(this.relative_to_viewport);     
    var baseline = (this.model.get("baseline") /100) * height;
    this.top_half_height = (height / 2) + baseline;
    this.bottom_half_height = (height / 2)  - baseline;
  },  
  _renderFontFamily: function() {
    this.$('input').css('font-family', thisProduct.get("font"));  
  },
  _renderFontSize: function() {
    var new_size = screenType(this.relative_to_viewport) * this.model.get("font_size");
    this.$('input').css('font-size', new_size + "px");   
  },
  _renderBaseline: function() {
    this.calculateBaselineOffset();
    this.$('.spacer').css("height", this.top_half_height + "px")
    this.$('input').css("height", this.bottom_half_height + "px")
  },
  render: function() {     
    this.calculateBaselineOffset();
    var compiled_template = Handlebars.template(templates["place_card"]);
    var $template = $(compiled_template({
      font_family: thisProduct.get("font"),   
      baseline_top: this.top_half_height,
      baseline_bottom: this.bottom_half_height,
      font_size: screenType(this.relative_to_viewport) * this.model.get("font_size"),
      background: thisProduct.get("background-5"),  
      product: thisProduct.get("_id"),
      name: this.model.get("name"),
    }))
    var colours = thisProduct.get("colours");
  
    for(var i=0; i < colours.length; i++) {
      $template.find('.colour_' + i).css("background-color", colours[i])
    }
    this.$el.html($template)
    
    return this;
  }
})


// Used to render collections of place cards for UI preview view
var PlaceCardCollectionView = Backbone.View.extend({
  initialize: function() {
    var guests = thisProduct.get("guests")
    this.listenTo(guests, 'add', this.addGuest)
   // this.listenTo(guests, 'change', this.render)
  },
  _newPlaceCardView: function(guest) {
    return new PlaceCardView(_.extend({
      model: guest,
      widths_relative_to_viewport: {
        desktop: 47.5,
        mobile: 95
      }
    }, this.options))
  },
  addGuest: function(guest) {
    var place_card = this._newPlaceCardView(guest).render().el        
    this.$el.append(place_card)
  },
  render: function() {
    var that = this;
    var place_cards = [];
    thisProduct.get("guests").toArray().forEach(function(guest) {   

      var place_card = that._newPlaceCardView(guest).render().el
      place_cards.push(place_card)
    })
    this.$el.html(place_cards)
    return this;
  }
}) 