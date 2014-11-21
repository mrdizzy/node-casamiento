// GUEST VIEW
////////////////////////////////////////////////////////////////////////////// 
var GuestView = BackboneRelativeView.extend({  
  className: 'input_container',
  initialize: function() {
    BackboneRelativeView.prototype.initialize.apply(this)
    this.listenTo(this.model, "change:name", this._renderName);
  },
  events: {
    "blur input": 'updateGuest',
    'focus input': 'clearGuest',
    'click .trash': 'deleteGuest'
  },
  deleteGuest: function() {
    this.model.destroy();
    var that = this;
    thisProduct.set("quantity", thisProduct.get("quantity") -1)  
    this.$el.fadeOut(function() {
        that.remove();
    });
  },
  clearGuest: function() {
    thisProduct.trigger("editing:guest")
    if(this.model.get("name") == "Guest Name") this.$('input').val("")     
  },
  updateGuest: function() {
   thisProduct.trigger("finishediting:guest")
   var name = this.$('input').val()
   this.model.set("name", name)
  },
  _renderName: function() {
    this.$('input').val(this.model.get("name"))            
  },
  render: function() { 
    var html = '<input type="text" name="guest" value="' + 
      this.model.get("name") + 
      '"></input> <img src="/gfx/trash/delete96.svg" class="trash deselected" style="display:inline-block;width:13px;"/>'
    this.$el.html(html)
    return this;
  }
})

/* 
  Each font has a size value such as 0.12 or 0.08 and this value
  is the size of the font as a percentage of the container width. 
  This allows us to make sure that when the font size is changed
  it remains consistent relative to its container 
*/
var PlaceCardView = GuestView.extend({
  className: 'place_card_view',
  initialize: function() {      
    GuestView.prototype.initialize.apply(this)
    $(window).bind("resize", _.bind(this.resizeWindow, this));
    
    this.listenTo(thisProduct, 'change:font', this._renderFontFamily);   
    this.listenTo(this.model, "change:font_size", this._renderFontSize);
    this.listenTo(this.model, "change:baseline", this._renderBaseline)
  },  
  events: {
    'click .plus_font': 'increaseFont',
    'click .minus_font': 'decreaseFont',
    'click .up_baseline': 'upBaseline',
    'click .down_baseline': 'downBaseline',   
    'click .delete_guest': 'deleteGuest', // see parent view for implementation
    "blur input": 'updateGuest', // see parent view for implementation
    'focus input': 'clearGuest' // see parent view for implementation
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
  // getWidth() will report 16 pixels more for some reason -- it is something
  // to do with scrollbars during the transition. This does not happen when the 
  // window resizes, only when changing from another view
  calculateBaselineOffset: function() { 
    var height = (70.714285714285714285714285714286/100) * this.relativeToViewport();     
    var baseline = (this.model.get("baseline") /100) * height;
    this.top_half_height = (height / 2) + baseline;
    this.bottom_half_height = (height / 2)  - baseline;
  },  
  _renderFontFamily: function() {
    this.$('input').css('font-family', thisProduct.get("font"));  
  },
  _renderFontSize: function() {
    var new_size = this.relativeToViewport() * this.model.get("font_size");
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
      font_size: this.relativeToViewport() * this.model.get("font_size"),
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
    this.listenTo(this.collection, 'add', this.addGuest)
  },
  addGuest: function(guest) {
    var place_card = this._newPlaceCardView(guest).render().el        
    this.$el.append(place_card)
  },
  render: function() {
    var place_cards = this.collection.map(function(guest) {   
      return this._newPlaceCardView(guest).render().el
    }, this)
    this.$el.html(place_cards)
    return this;
  },
  _newPlaceCardView: function(guest) {
    return new PlaceCardView(_.extend({
      model: guest,
      widths_relative_to_viewport: {
        desktop: 47.5,
        mobile: 95
      }
    }))
  }
}) 
