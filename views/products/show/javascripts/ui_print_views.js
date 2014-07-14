// Each font has a size value such as 0.12 or 0.08 and this value
// is the size of the font as a percentage of the container width. 
// This allows us to make sure that when the font size is changed
// it remains consistent relative to its container 
var PlaceCardView = GuestView.extend({
  className: 'place_card_wrapper',
  initialize: function() {
    this.listenTo(thisProduct, 'change:font', this._renderFontFamily) 
    this.listenTo(this.model, 'change:font_size', this._renderFontSize) 
    this.listenTo(this.model, 'change:baseline', this._renderBaseline)
  },  
  events: {
    'click .plus_font': 'increaseFont',
    'click .minus_font': 'decreaseFont',
    'click .up_baseline': 'upBaseline',
    'click .down_baseline': 'downBaseline',    
    "blur input": 'updateGuest',
    'focus input': 'clearGuest'
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
    this.presenter.font_size = this.presenter.width * this.model.get("font_size");
  },  
  calculateBaselineOffset: function() {
    var baseline = (this.model.get("baseline") /100) * this.presenter.height;
    this.presenter.top_half_height = (this.presenter.height / 2) + baseline;
    this.presenter.bottom_half_height = (this.presenter.height / 2)  - baseline;
  },
  render: function() {   
    this.presenter = {
      font_family: thisProduct.get("font"),   
      background: thisProduct.get("background-5"),    
      hex: thisProduct.hex(),
      product: thisProduct.get("_id"),
      name: this.model.get("name"),
      height: (0.7071428571 * this.options.width) // 0.70714... is the ratio of 74.25mm to 105mm
    }
    // Copy options over to presenter
    this.presenter = _.extend(this.presenter, this.options)
    this.calculateBaselineOffset();
    this.calculateFontSize();
  
    var compiled_template = Handlebars.template(templates["place_card"]);
    var $template = $(compiled_template(this.presenter));
  
    var colours = thisProduct.get("colours");
  
    for(var i=0; i < colours.length; i++) {
      $template.find('.colour_' + i).css("background-color", colours[i])
    }
    this.$el.html($template)
    return this;
  },
  _renderFontFamily: function() {    
    this.$('input').css('font-family', thisProduct.get("font"));
  },
  _renderBaseline: function() {
    this.calculateBaselineOffset();
    this.$('.half').css("padding-top", this.presenter.top_half_height)
    this.$('.half').css("height", this.presenter.bottom_half_height)
  },
  _renderFontSize: function() {
    this.calculateFontSize();
    this.$('input').css('font-size', this.presenter.font_size + "px");
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
          model: guest
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
      svg: true,
      width:(105 * 3.779527559) // convert 105mm to pixels
    }).render().el;
    $('#printsvg').html(result)
    $('#ui_printer_icon img').attr('src', "/gfx/spinner.gif")
    window.print();
  },
  render: function() {
    var $template = $(Handlebars.template(templates["user_interface_for_print"])());         
    $template.find('#ui_font_picker').fontPicker({
      fonts: casamiento_fonts, 
      selected_font: thisProduct.get("font")
    })
    
    var place_cards = new PlaceCardCollectionView({
      per_page: this.layout,
      width: ($(document).width() / 2.3),
    }).render().el
    
    var width = ($(document).width() / 2.3)*2.01;
    
    $template.find('#actual_cards').append(place_cards).width(width);
    this.$el.html($template)
    return this;
  }
})
