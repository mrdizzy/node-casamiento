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
    if(this.model.get("name") == "Guest Name") this.$('input').val("")     
  },
  updateGuest: function() {
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
    this.model.adjustFontSize(1.05) // percentage increase
  },
  decreaseFont: function() {
   this.model.adjustFontSize(0.95) // percentage decrease
  },
  upBaseline: function() {
    this.model.adjustBaseline(-0.5);
  },
  downBaseline: function() {
    this.model.adjustBaseline(0.5);
  },  
  updateGuestFromDiv: function() {
    var name = this.$('.guest_name').text()
   this.model.set("name", name)
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
    this.$('.guest_name').css("margin-top", baseline.top_half + "px")
    this.$('.guest_name').css("height", baseline.bottom_half + "px")
        this.$('.guest_name').css("line-height", baseline.bottom_half + "px")
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