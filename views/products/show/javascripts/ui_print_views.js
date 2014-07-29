// Each font has a size value such as 0.12 or 0.08 and this value
// is the size of the font as a percentage of the container width. 
// This allows us to make sure that when the font size is changed
// it remains consistent relative to its container 
var PlaceCardView = GuestView.extend({
  className: 'place_card_view',
  initialize: function() {
    this.listenTo(thisProduct, 'render:font', this._renderFontSize);
    this.listenTo(thisProduct, 'change:font', this._renderFontFamily);
    this.listenTo(this.model, 'change:font_size', this._renderFontSize);
    this.listenTo(this.model, 'change:baseline', this._renderBaseline);
    $(window).bind("resize", _.bind(this._renderFontSize, this));
  },  
  events: {
    'click .plus_font': 'increaseFont',
    'click .minus_font': 'decreaseFont',
    'click .up_baseline': 'upBaseline',
    'click .down_baseline': 'downBaseline',    
    "blur input": 'updateGuest',
    'focus input': 'clearGuest',
   'panright': 'increaseFont',
   'panleft': 'decreaseFont',
   'panup': 'upBaseline',
   'pandown': 'downBaseline'
  }, 
  increaseFont: function() {
    this.model.adjustFontSize(1.05) // percentage increase
  },
  decreaseFont: function() {
   this.model.adjustFontSize(0.95) // percentage decrease
  },
  upBaseline: function() {
    this.model.upBaseline();
  },
  downBaseline: function() {
    this.model.downBaseline();
  },  
  calculateFontSize: function() {
    var width = this.options.svg ? 105 : this.$el.width();
    this.font_size = width * this.model.get("font_size");
  },  
  calculateBaselineOffset: function() {
    var height = this.options.svg ? 74.25 : this.$el.height();
    var baseline = (this.model.get("baseline") /100) * height;
    this.top_half_height = (height / 2) + baseline;
    this.bottom_half_height = (height / 2)  - baseline;
  },
  render: function() {     
    var compiled_template = Handlebars.template(templates["place_card"]);
    var $template = $(compiled_template({
      font_family: thisProduct.get("font"),   
      background: thisProduct.get("background-5"),  
      svg: this.options.svg,
      product: thisProduct.get("_id"),
      name: this.model.get("name"),
    }));
  
    var colours = thisProduct.get("colours");
  
    for(var i=0; i < colours.length; i++) {
      $template.find('.colour_' + i).css("background-color", colours[i])
    }
    this.$el.html($template)
    this.$el.hammer()
    this.$el.data("hammer").get('pan').set({ direction: Hammer.DIRECTION_ALL });
    return this;
  },
  _renderFontFamily: function() {    
    this.$('input').css('font-family', thisProduct.get("font"));
  },
  _renderBaseline: function() {
  var units = this.options.svg ? "mm" : "px"
    this.calculateBaselineOffset();
    this.$('.spacer').css("height", this.top_half_height + units)
    this.$('input').css("height", this.bottom_half_height + units)
  },
  _renderFontSize: function() {
  var units = this.options.svg ? "mm" : "px"
    this.calculateFontSize();
    this._renderBaseline();
    this.$('input').css('font-size', this.font_size + units);
  }
})

var PlaceCardCollectionView = Backbone.View.extend({
  render: function() {
    var options = this.options;
    var grouped_place_cards = inGroupsOf(thisProduct.get("guests").toArray(), options.per_page)
    
    grouped_place_cards.forEach(function(group) {
      var $container = $('<div class="up_' + options.per_page + '"></div>"');
      group.forEach(function(guest) {
        var place_card = new PlaceCardView(_.extend({
          model: guest,
          svg: options.svg
        }, 
        options)).render().el
        $container.append(place_card)
      })
      $container.append("<div class='break'></div>")
      this.$el.append($container)
    }, this)
      
    return this;
  }
}) 

var PrintControlPanelView = Backbone.View.extend({
  initialize: function() {
    this.layout = 8
  },
  events: {
    "fontpicker:selected": "changeFont",
    "click input[type=radio]": "changeLayout",
    "click #ui_printer_icon": "printPage"
  },
  changeLayout: function(e) {
    var val = $(e.currentTarget).val()
    this.$('#actual_cards').attr("class", "up_" + val)
    this.layout = val;
  },
  changeFont: function(e, font) { 
    thisProduct.set("font", font.font)
  },  
  // Create the SVG print view
  printPage: function(e) {
    var result = new PlaceCardCollectionView({
      per_page: this.layout,
      svg: true
    }).render().el;
    $('#printsvg').html(result);    
    
    thisProduct.trigger("render:font")
    $('#ui_printer_icon img').attr('src', "/gfx/spinner.gif");
    
    // Wait for SVG images to be loaded before printing
    var images  = this.$('#printsvg img'),
      counter = images.length,
      svg_url = thisProduct.get("_id") + "/" + thisProduct.hex();
      
    images.attr('src', "/svg/" + svg_url).load(function() {
      counter--;
      if(counter == 0) {      
        window.print()        
        $('#ui_printer_icon img').attr('src', "/gfx/printer_icon.svg")
      }
    })
  },
  render: function() {
    var $template = $(Handlebars.template(templates["user_interface_for_print"])());         
    $template.find('#ui_font_picker').fontPicker({
      fonts: casamiento_fonts, 
      selected_font: thisProduct.get("font")
    })
    
    var place_cards = new PlaceCardCollectionView({
      per_page: this.layout,
    }).render().el
    
    $template.find('#actual_cards').append(place_cards)
    this.$el.html($template)
    return this;
  }
})
