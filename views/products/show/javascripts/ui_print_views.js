/* 
  This view takes svg as an option. When svg is set to true, 
  it uses absolute measurements rather than relative measurements
  Each font has a size value such as 0.12 or 0.08 and this value
  is the size of the font as a percentage of the container width. 
  This allows us to make sure that when the font size is changed
  it remains consistent relative to its container 
*/
var PlaceCardView = GuestView.extend({
  className: 'place_card_view',
  initialize: function() {      
    this.listenTo(thisProduct, 'global:rerenderfont', this._renderFontSize); 
    this.listenTo(thisProduct, 'change:font', this._renderFontFamily);   
    this.listenTo(this.model, "change:name", this._renderName)
    this.listenTo(this.model, 'change:font_size', this._renderFontSize);
    this.listenTo(this.model, 'change:baseline', this._renderBaseline);
    this.units = this.options.svg ? "mm" : "px"
    $(window).bind("resize", _.bind(this._renderFontSize, this));
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
  calculateFontSize: function() { // Element must be visible for width() to work
    var width = this.options.svg ? 105 : this.$el.width();
   
    this.font_size = width * this.model.get("font_size");
    
  },    
  calculateBaselineOffset: function() { // Element must be visible for height() to work
    var height = this.options.svg ? 74.25 : this.$el.height();
    var baseline = (this.model.get("baseline") /100) * height;
    this.top_half_height = (height / 2) + baseline;
    this.bottom_half_height = (height / 2)  - baseline;
  },  
  _renderBaseline: function() {
    this.calculateBaselineOffset();
    this.$('.spacer').css("height", this.top_half_height + this.units)
    this.$('input').css("height", this.bottom_half_height + this.units)
  },  
  _renderFontSize: function() {
    this.calculateFontSize();
    this._renderBaseline();
    console.log(this.model.get("font_size"), this.font_size, this.units)
    this.$('input').css('font-size', this.font_size + this.units);
    
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
    return this;
  },
  _renderFontFamily: function() {    
    this.$('input').css('font-family', thisProduct.get("font"));
  },
  _renderName: function() {
    this.$('input').val(this.model.get("name"))  
  }
})

// Used to render collections of place cards for both print view and 
// UI preview view
var PlaceCardCollectionView = Backbone.View.extend({
  render: function() {
    var options = this.options;
    var grouped_place_cards = inGroupsOf(thisProduct.get("guests").toArray(), options.per_page)
    
    grouped_place_cards.forEach(function(group) {
    
    // Add crop marks
      var $container = $('<div class="up_' + options.per_page + '"></div>"');
      if (options.per_page == 3) {
       $container.html('<div class="crop_marks up_' + options.per_page + '_crop_marks"><div class="horizontal_crop_mark crop_top_bottom_left"></div><div class="horizontal_crop_mark crop_top_bottom_right"></div><div class="crop_top_top_left vertical_crop_mark"></div><div class="crop_top_top_right vertical_crop_mark"></div></div>')
       
       $container.append('<div class="crop_horizontal_left horizontal_crop_mark" style="top:52.125mm;"></div><div class="crop_horizontal_left horizontal_crop_mark" style="top:89.25mm;"></div><div class="crop_horizontal_left horizontal_crop_mark" style="top:126.375mm;"></div><div class="crop_horizontal_left horizontal_crop_mark" style="top:163.5mm;"></div><div class="crop_horizontal_left horizontal_crop_mark" style="top:200.625mm;"></div>')
       
       $container.append('<div class="crop_horizontal_right horizontal_crop_mark" style="top:52.125mm;"></div><div class="crop_horizontal_right horizontal_crop_mark" style="top:89.25mm;"></div><div class="crop_horizontal_right horizontal_crop_mark" style="top:126.375mm;"></div><div class="crop_horizontal_right horizontal_crop_mark" style="top:163.5mm;"></div><div class="crop_horizontal_right horizontal_crop_mark" style="top:200.625mm;"></div>')
       
       $container.append('<div class="crop_bottom_top_left horizontal_crop_mark"></div><div class="crop_bottom_top_right horizontal_crop_mark"></div><div class="crop_bottom_bottom_left vertical_crop_mark"></div><div class="crop_bottom_bottom_right vertical_crop_mark"></div>')
       }
       else if (options.per_page == 4) {
           $container.html('<div class="crop_marks up_' + options.per_page + '_crop_marks"><div class="horizontal_crop_mark crop_top_bottom_left"></div><div class="horizontal_crop_mark crop_top_bottom_right"></div><div class="crop_top_top_left vertical_crop_mark"></div><div class="crop_top_top_right vertical_crop_mark"></div></div>')
       
       
       $container.append('<div class="crop_bottom_top_left horizontal_crop_mark"></div><div class="crop_bottom_top_right horizontal_crop_mark"></div><div class="crop_bottom_bottom_left vertical_crop_mark"></div><div class="crop_bottom_bottom_right vertical_crop_mark"></div>')
       }
       group.forEach(function(guest) {
        var place_card = new PlaceCardView(_.extend({
          model: guest,
          svg: options.svg
        }, 
        options)).render().el
        $container.append(place_card)
      })
     
      this.$el.append($container)
     this.$el.append("<div class='break'></div>")
    }, this)
      
    return this;
  }
}) 

var PrintControlPanelView = Backbone.View.extend({
  el: '#print_ui',
  initialize: function() {
    this.layout = 8
    $(window).on("resize", this.testForMobile.bind(this));
    this.testForMobile();
  },
  testForMobile: function() {
    if(viewportSize.getWidth() < 501) {
      this.mobile = true      
      $('#mobile_panel_section').hide();
    } else {
      this.mobile = false;
      $('#mobile_panel_section').show();
    }
  },
  events: {
    "fontpicker:selected": "changeFont",
    "fontpicker:fontloaded": "loadFont",
    "dizzy-cp:click": "togglePanel",
    "click input[type=radio]": "changeLayout",
    "click #ui_printer_icon": "printPage",
    "click #menu_lines": "togglePanel",
    "click .global_baseline_up": "baselineUp",
    "click .global_baseline_down": "baselineDown",
    "click .global_font_increase": "fontIncrease",
    "click .global_font_decrease": "fontDecrease"
  },
  togglePanel: function() {
    if(this.mobile) {
        $('#mobile_panel_section').toggle();
        thisProduct.trigger("rerender")
    }
  },
  fontIncrease: function() {
    thisProduct.get("guests").invoke('adjustFontSize',1.05)
  },
  fontDecrease: function() {    
    thisProduct.get("guests").invoke('adjustFontSize',0.95)
  },
  baselineUp: function() {   
    thisProduct.get("guests").invoke('upBaseline')
  },
  baselineDown: function() {
    thisProduct.get("guests").invoke('downBaseline')
  },
  changeLayout: function(e) {
    var val = $(e.currentTarget).val()
    this.$('#actual_cards').attr("class", "up_" + val)
    this.layout = val;
  },
  loadFont: function(e, font) {
    $('.font_spinner').hide();
    $('.guest_name').show()  
  },
  changeFont: function(e, font) { 
    thisProduct.set("font", font)
    $('.font_spinner').show();
    $('.guest_name').hide()  
    this.togglePanel();
    thisProduct.save();
  },  
  // Create the SVG print view
  printPage: function(e) {    
    var result = new PlaceCardCollectionView({
      per_page: this.layout,
      svg: true
    }).render().el;
    $('#printsvg').html(result);    
    
    thisProduct.trigger("global:rerenderfont")
    $('#ui_printer_icon img').attr('src', "/gfx/spinner.gif");
    
    // Wait for SVG images to be loaded before printing
    var images  = $('#printsvg img.place_card_image'),
      counter = images.length,
      svg_url = thisProduct.get("_id") + "/" + thisProduct.hex();
      
    images.attr('src', "/svg/" + svg_url).load(function() {
      counter--;
      if(counter == 0) {   
      console.log("printing!")
        window.print()        
        $('#ui_printer_icon img').attr('src', "/gfx/printer_icon.svg")
      }
    })
  },
  render: function() {
    var $template = $(Handlebars.template(templates["user_interface_for_print"])()); 
    this.$el.html($template)
    var $colour_picker_container = $template.find('#ui_print_colour_picker_container');
    
    var place_cards = new PlaceCardCollectionView({
      per_page: this.layout,
    }).render().el
    
    var colours = thisProduct.get("colours") 
    for(var i=0; i < colours.length; i++) {
      var $div = $('<div class="colour_picker_wrapper"></div>');
      $colour_picker_container.append($div);
      $div.colorPicker({
        default_color: colours[i], 
        listen_to: thisProduct,
        index: i
      });
    }       
    $template.find('#ui_font_picker').fontPicker({
      fonts: casamiento_fonts, 
      selected_font: thisProduct.get("font")
    })
    $template.find('#actual_cards').append(place_cards)
    return this;
  }
})
