var ControlPanel = Backbone.Model.extend({
  defaults: {
    cutting_marks: true,
    per_page: 3
  },
  initialize:function() {
    this.calculateUserAgent()
    this.calculatePlaceCardPrintSize();
  },
  calculateUserAgent: function() {
    if(navigator.userAgent.match(/Chrome/i) != null) {
      this.set("chrome", true)
    } else if (navigator.userAgent.match(/iPad/i) != null) {
      this.set("ipad", true)
    }      
  },
  calculatePlaceCardPrintSize: function() {
    if(this.get("ipad")) {
      this.set("width",120.75);
      this.set("height", 85.3875);
    } else {
      this.set("width",105);
      this.set("height", 74.25);
    }
  }
})

// Used by control panel for fast editing of guests
var GuestCollectionView = Backbone.View.extend({
  render: function() {
    var guests_html = this.collection.map(function(guest) {  
      return(new GuestView({model:guest}).render().el);
    })
    this.$el.html(guests_html)
    return this;
  }
})

// This view loops through each guest and creates an SVG place card for printing. 
var PrintPlaceCardCollectionView = Backbone.View.extend({
  initialize: function() {
    this.listenTo(this.model, 'change:cutting_marks', this._renderCuttingMarks) 
    this.listenTo(this.model, 'change:per_page', this._changeOrientation) 
  },
  _changeOrientation: function() {
    if(this.model.get("per_page") == 4) {
      this.model.set("group_class","group_landscape")       
      $('head').append("<style type='text/css'>@page { size: A4 landscape }</style>");
    } 
    else {        
      this.model.set("group_class","group")       
      $('head').append("<style type='text/css'>@page { size: A4 portrait }</style>");
    }    
  },
  render: function() {      
    if(this.model.get("ipad")) $('#printsvg').addClass('ipad')
    
    var per_page = this.model.get("per_page")
    
    this.$el.removeClass().addClass('up' + per_page);    
    
    var result = this.collection.map(function(guest) {
      guest.calculateBaselineOffset(this.model.get("height"));
      return { 
        font: thisProduct.get("font"),  
        name: guest.get("name"),
        height: this.model.get("height"),
        width: this.model.get("width"),
        font_size: (this.model.get("width") * guest.get("font_size")),
        margin_top: guest.top_half_height,
        guest_height: guest.bottom_half_height
      }
    }, this)
    var groups = inGroupsOf(result, per_page);
    var $template = $(Handlebars.template(templates["print_place_card_view_collection"])({
      ipad: this.model.get("ipad"),
      group_class: this.model.get("group_class"),
      per_page: per_page,
      groups: groups
    })); 
    
    this.$el.html($template)
    this._renderCuttingMarks();
    return this;
  },
  _renderCuttingMarks: function() {
    this.model.get("cutting_marks") ? this.$('.svg_left_crop').show() : this.$('.svg_left_crop').hide();
  }
})

var PrintControlPanelView = BackboneRelativeView.extend({
  el: '#print_ui',
  initialize: function() {
    BackboneRelativeView.prototype.initialize.apply(this)
    //if(isiPad) {
    //  this.listenTo(thisProduct, 'editing:guest', this.toggleControlPanel)
    //  this.listenTo(thisProduct, 'finishediting:guest', this.toggleControlPanel)
    //}
    //this.testForMobile();
  },
  events: {
    "click #add_another": "addGuest",
    "click #cutting_marks": "toggleCuttingMarks",
    "fontpicker:selected": "changeFont",
    "fontpicker:fontloaded": "loadFont",
    "dizzy-cp:click": "togglePanel",
    "click #close_mobile": "togglePanel",
    "click .layout_icon_container": "changeLayout",
    "click #ui_printer_icon": "printPage",
    'click #print_now': "printNow",
    "click #menu_lines": "togglePanel",
    "click .global_baseline_up": "baselineUp",
    "click .global_baseline_down": "baselineDown",
    "click .global_font_increase": "fontIncrease",
    "click .global_font_decrease": "fontDecrease",
    "click .global_font_reset": "fontReset",
    "click #ui_print_alert .close": "closeAlert"
  },
  addGuest: function() {
    thisProduct.get("guests").add({})
  },
  closeAlert: function() {
    $('#ui_print_alert').fadeOut();
  },
  togglePanel: function() {
    if(this.mobile) $('#mobile_panel_section').toggle();
  },
  fontReset: function() {
   var font_size = thisProduct.get("font_size");
   var baseline = thisProduct.get("baseline");
   thisProduct.get("guests").invoke('set', {font_size: font_size, baseline: baseline})
  },
  fontIncrease: function() {
    thisProduct.get("guests").invoke('adjustFontSize',1.05)
  },
  fontDecrease: function() {    
    thisProduct.get("guests").invoke('adjustFontSize',0.95)
  },
  baselineUp: function() {   
    thisProduct.get("guests").invoke('adjustBaseline', -1)
  },
  baselineDown: function() {
    thisProduct.get("guests").invoke('adjustBaseline', 1)
  },
  changeLayout: function(e) {
    var per_page = [8,3,4][$(e.currentTarget).index()]
    $('.layout_icon_container').removeClass('layout_selected');
    $(e.currentTarget).addClass('layout_selected')
    $("input[type=radio]").prop("checked", false)
    $("#radio_" + per_page).prop("checked", true)
    this.model.set("per_page", per_page)
    this.printPage();
  },  
  toggleCuttingMarks: function() {
    var cutting_marks = this.model.get("cutting_marks") ? false : true;
    this.model.set("cutting_marks", cutting_marks)
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
      model: this.model,
      collection: thisProduct.get("guests").toArray()
    }).render().el;
    $('#printsvg').html(result);    
    
    $('#ui_printer_icon img').attr('src', "/gfx/spinner.gif");
    
    // Wait for SVG images to be loaded before printing
    var images  = $('#printsvg img.place_card_image'),
      counter = images.length;
      
    images.attr('src', thisProduct.svgURL()).load(function() {
      counter--;
      if(counter == 0) {   
        $('#ui_print_alert').fadeIn();
        $('#ui_printer_icon img').attr('src', "/gfx/printer_icon.svg")
      }
    })
  },
  printNow: function() {
    $('#ui_print_alert').hide();
    if(this.mobile) { this.togglePanel() }
    window.print()     
  },
  render: function() {
    var $template = $(Handlebars.template(templates["user_interface_for_print"])({
      ipad: this.model.get("ipad"),
      pounds: thisProduct.get("pounds"),
      pence: thisProduct.get("pence")
    })); 
    this.$el.html($template)
    var $colour_picker_container = $template.find('#ui_print_colour_picker_container');
    
    var place_cards = new PlaceCardCollectionView({
      collection: thisProduct.get("guests")
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

