function screenType(relative_to_viewport) {
  var viewport = $('body').width();
  if(viewport < 501) {
    return (relative_to_viewport.mobile/100) * viewport;
  } 
  return (relative_to_viewport.desktop/100) * viewport;
}


if(isiPad) 
  $('#printsvg').addClass('ipad')
  
var GuestCollectionView = Backbone.View.extend({
  render: function() {
    var guests_html = []
    this.collection.forEach(function(guest) {  
        guests_html.push(new GuestView({model:guest}).render().el);
    })
    this.$el.html(guests_html)
    return this;
  }
})

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
    this.relative_to_viewport = this.options.widths_relative_to_viewport;
    this.listenTo(thisProduct, 'change:font', this._renderFontFamily);   
    this.listenTo(this.model, "change", this.render)
    $(window).bind("resize", _.bind(this.resizeWindow, this));
  },  
  events: {
    'click .plus_font': 'increaseFont',
    'click .minus_font': 'decreaseFont',
    'click .up_baseline': 'upBaseline',
    'click .down_baseline': 'downBaseline',    
    "blur input": 'updateGuest',
    'focus input': 'clearGuest'
  }, 
  resizeWindow: function() {
  console.log("reisizingf", $(document).width())
    this._renderFontSize();
    this._renderBaseline();
  },
  _getWidth: function() {
    return screenType(this.relative_to_viewport)
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
  
  // get Width will report 16 pixels more for some reason -- it is something
  // to do with scrollbars during the transition. This does not happen when the 
  // window resizes, only when changing from another view
  calculateBaselineOffset: function() { 
    var height = (70.714285714285714285714285714286/100) * this._getWidth();     
    var baseline = (this.model.get("baseline") /100) * height;
    this.top_half_height = (height / 2) + baseline;
    this.bottom_half_height = (height / 2)  - baseline;
  },  
  _renderFontFamily: function() {
    this.$('input').css('font-family', thisProduct.get("font"));  
  },
  _renderFontSize: function() {
    var new_size = this._getWidth() * this.model.get("font_size");
    this.$('input').css('font-size', new_size + "px");   
  },
  _renderBaseline: function() {
    this.calculateBaselineOffset();
    this.$('.spacer').css("height", this.top_half_height + "px")
    this.$('input').css("height", this.bottom_half_height + "px")
  },
  render: function() {     
  console.log("rendering")
    if(this.model.hasChanged('font_size')) {
      this._renderFontSize();      
    } else if (this.model.hasChanged('baseline')){
       this._renderBaseline();      
    } else if (this.model.hasChanged('name')) {
        this.$('input').val(this.model.get("name"))  
          
    } else { 
      this.calculateBaselineOffset();
      var compiled_template = Handlebars.template(templates["place_card"]);
      var $template = $(compiled_template({
      font_family: thisProduct.get("font"),   
      baseline_top: this.top_half_height,
      baseline_bottom: this.bottom_half_height,
      font_size: this._getWidth() * this.model.get("font_size"),
      background: thisProduct.get("background-5"),  
      product: thisProduct.get("_id"),
      name: this.model.get("name")
    }));
    var colours = thisProduct.get("colours");
  
    for(var i=0; i < colours.length; i++) {
      $template.find('.colour_' + i).css("background-color", colours[i])
    }
    this.$el.html($template)
    }
    return this;
  }
})

// Used to render collections of place cards for UI preview view
var PlaceCardCollectionView = Backbone.View.extend({
  initialize: function() {
    this.listenTo(thisProduct.get("guests"), 'add', this.addGuest)
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
    this.$el.append(place_cards)
    return this;
  }
}) 

// This view loops through each guest and creates an SVG place 
// card for printing. 
var PrintPlaceCardCollectionView = Backbone.View.extend({
  render: function() {
    if(isiPad) {
      var width = 120.75;        
      var height = 85.3875;
    } else {
      var width = 105;
      var height = 74.25;
    }
    var options = this.options;
    this.$el.removeClass().addClass('up' + options.per_page);
    var groups = inGroupsOf(this.collection, options.per_page);
    var html = "";
    var group_class = "group"    
    
    if(options.per_page == 4) {
      group_class = "group_landscape"        
      $('head').append("<style type='text/css'>@page { size: A4 landscape }</style>");
    } 
    else {        
     $('head').append("<style type='text/css'>@page { size: A4 portrait }</style>");
    }
    groups.forEach(function(guests) {		            	
        // page breaks for ipad which can only print 3 per page anyway
        if (isiPad) {
          html = html + '<div class="' + group_class + '" style="page-break-before:always;">'
        }
        // only apply page breaks when there are less than 8 per page, OR if the browser is Chrome
        // for Windows
        else {
          if(options.per_page != 8 || isWindowsChrome) {			 	
            html = html + '<div class="' + group_class + '" style="page-break-after:always;">'
          } else {
            html = html + '<div class="' + group_class + '">'
          }
        }
    
      guests.forEach(function(guest) {
        guest.calculateBaselineOffset(height);
        var compiled_template = Handlebars.template(templates["print_place_card"]) 
        var $template = $(compiled_template({
          font: thisProduct.get("font"),  
          name: guest.get("name"),
          height:height,
          width: width,
          font_size: (width * guest.get("font_size")),
          margin_top: guest.top_half_height,
          guest_height: guest.bottom_half_height
        }));  
        html = html + $template.html(); // /html() only returns INNER html so we have added a wrapping div in template
      })
      html = html + '<img src="/gfx/logo/casamiento_black.svg" class="cas_print_logo" />'
      html = html + "</div>"			
    })
    this.$el.html(html);
    return this;
  }
})

var PrintControlPanelView = Backbone.View.extend({
  el: '#print_ui',
  initialize: function() {
    this.layout = 3
    $(window).on("resize", this.testForMobile.bind(this));
    if(isiPad) {
      this.listenTo(thisProduct, 'editing:guest', this.toggleControlPanel)
      this.listenTo(thisProduct, 'finishediting:guest', this.toggleControlPanel)
    }
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
    "click #add_another": "addGuest",
    "fontpicker:selected": "changeFont",
    "fontpicker:fontloaded": "loadFont",
    "dizzy-cp:click": "togglePanel",
    "click .layout_icon_container": "changeLayout",
    "click #ui_printer_icon": "printPage",
    "click #menu_lines": "togglePanel",
    "click .global_baseline_up": "baselineUp",
    "click .global_baseline_down": "baselineDown",
    "click .global_font_increase": "fontIncrease",
    "click .global_font_decrease": "fontDecrease"
  },
  addGuest: function() {
    var guests = thisProduct.get("guests").add({name:"Alice"})
  },
  toggleControlPanel: function() {
    this.$('#control_panel').fadeToggle();  
  },
  togglePanel: function() {
    if(this.mobile) {
      $('#mobile_panel_section').toggle();
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
    var per_page = [8,3,4][$(e.currentTarget).index()]
    $('.layout_icon_container').removeClass('layout_selected');
    $(e.currentTarget).addClass('layout_selected')
    this.layout = per_page;
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
    var result = new PrintPlaceCardCollectionView({
      per_page: this.layout,
      collection: thisProduct.get("guests").toArray()
    }).render().el;
    $('#printsvg').html(result);    
    
    $('#ui_printer_icon img').attr('src', "/gfx/spinner.gif");
    
    // Wait for SVG images to be loaded before printing
    var images  = $('#printsvg img.place_card_image'),
      counter = images.length,
      svg_url = thisProduct.get("_id") + "/" + thisProduct.hex();
      
    images.attr('src', "/svg/" + svg_url).load(function() {
      counter--;
      if(counter == 0) {   
      $('#ui_print_alert').fadeIn();
        //window.print()        
        $('#ui_printer_icon img').attr('src', "/gfx/printer_icon.svg")
      }
    })
  },
  render: function() {
    var $template = $(Handlebars.template(templates["user_interface_for_print"])({
        hide_layout_icons: isiPad,
        pounds: thisProduct.get("pounds"),
        pence: thisProduct.get("pence")
    })); 
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
    
    var $ui_guests = $template.find('#ui_guests_quick');
    
    var guests_collection_view = new GuestCollectionView({collection:thisProduct.get("guests")}).render().el
    $ui_guests.append(guests_collection_view)
    
    $template.find('#actual_cards').prepend(place_cards)
    return this;
  }
})

