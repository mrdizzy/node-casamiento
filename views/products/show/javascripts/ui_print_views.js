var ControlPanel = Backbone.Model.extend({
  defaults: {
    cutting_marks: true,
    per_page: 3
  },
  initialize:function() {
    this.calculateUserAgent()
    this.calculatePlaceCardPrintSize();
  },
  toggleCuttingMarks: function() {
    var cutting_marks = this.get("cutting_marks") ? false : true;
    this.set("cutting_marks", cutting_marks)
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
  el: '#printsvg',
  initialize: function() {  
    if(this.model.get("ipad")) this.$el.addClass('ipad')
    this.listenTo(this.model, 'change:cutting_marks', this._renderCuttingMarks) 
    this.listenTo(this.model, 'change:per_page', this._changeOrientation) 
    this.listenTo(this.model, 'change:per_page', this.render)
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
    var per_page = this.model.get("per_page")   
    
    var result = this.collection.invoke('presenter');
    var $template = $(Handlebars.template(templates["print_place_card_view_collection"]) ({
      ipad: this.model.get("ipad"),
      group_class: this.model.get("group_class"),
      per_page: per_page,
      groups: inGroupsOf(result, per_page)
    })); 
    
    this.$el.html($template)
     // Wait for SVG images to be loaded before printing
    var images  = $('#printsvg img.place_card_image'),
      counter = images.length;
      var that = this;
    
    images.attr('src', thisProduct.svgURL()).load(function() {
      counter--;
      if(counter == 0) {   
        that.model.trigger("readyforprint")
      }
    })
    
    this._renderCuttingMarks();
    return this;
  },
  // display cutting marks based on class of #printsvg to avoid the need for showing and hiding
  _renderCuttingMarks: function() {
    this.model.get("cutting_marks") ? this.$el.addClass('show_crop_marks') : this.$el.removeClass('show_crop_marks');
  }
})

//PRINT CONTROL PANEL VIEW
////////////////////////////////////////////////////////////////////////////////
var PrintControlPanelView = BackboneRelativeView.extend({
  el: '#print_ui',
  initialize: function() {
    BackboneRelativeView.prototype.initialize.apply(this)
    this.listenTo(thisProduct, "change:quantity", this.updatePrice)
    this.listenTo(this.model, "readyforprint", this.showPrintDialog)
    this._place_card_print_collection = new PrintPlaceCardCollectionView({
      model: this.model,
      collection: thisProduct.get("guests")
    })
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
    "click #ui_print_alert .close": "closePrintAlert"
  },
  addGuest: function() {    
    thisProduct.set("quantity", thisProduct.get("quantity") + 1)
  },
  togglePanel: function() {
    if(this.mobile) {
      $('#mobile_panel_section').toggle();
      thisProduct.trigger("rerender")
    }
  },
  fontReset: function() {
    thisProduct.get("guests").invoke('set', {
      font_size: thisProduct.get("font_size"), 
      baseline: thisProduct.get("baseline")
    })
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
  },  
  toggleCuttingMarks: function() {
    this.model.toggleCuttingMarks();
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
    this._place_card_print_collection.render()
    $('#ui_printer_icon img').attr('src', "/gfx/spinner.gif");
  },
  closePrintAlert: function() {
    $('#ui_print_alert').fadeOut();
  },
  showPrintDialog: function() {
    $('#ui_print_alert').fadeIn();
    $('#ui_printer_icon img').attr('src', "/gfx/printer_icon.svg")
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
  },
  updatePrice: function() {
    this.$('#pound').text(thisProduct.get("pounds"));
    this.$('#decimal').text("." + thisProduct.get("pence"))
  }
})

