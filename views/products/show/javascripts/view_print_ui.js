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
    if(thisProduct.get("ipad")) this.$el.addClass('ipad')
    this.listenTo(thisProduct, 'change:cutting_marks', this._renderCuttingMarks) 
    this.listenTo(thisProduct, 'change:per_page', this._changeOrientation) 
    this.listenTo(thisProduct, 'change:per_page', this.render)
  },
  _changeOrientation: function() {
    if(thisProduct.get("per_page") == 4) {
      thisProduct.set("group_class","group_landscape")       
      $('head').append("<style type='text/css'>@page { size: A4 landscape }</style>");
    } 
    else {        
      thisProduct.set("group_class","group")       
      $('head').append("<style type='text/css'>@page { size: A4 portrait }</style>");
    }    
  },
  render: function() {  
    var $template = $(Handlebars.template(templates["print_place_card_view_collection"]) (thisProduct.get("guests").printPresenter())); 
    
    this.$el.html($template)
  
    var images  = $('#printsvg img.place_card_image'),  // Wait for SVG images to be loaded before printing
      counter = images.length;
    
    this._renderCuttingMarks();
    images.attr('src', thisProduct.svgURL()).load(function() {
      counter--;
      if(counter == 0) thisProduct.trigger("readyforprint")
    })
    
    return this;
  },
  // display cutting marks based on class of #printsvg to avoid the need for showing and hiding
  _renderCuttingMarks: function() {
    thisProduct.get("cutting_marks") ? this.$el.addClass('show_crop_marks') : this.$el.removeClass('show_crop_marks');
  }
})

//PRINT CONTROL PANEL VIEW
////////////////////////////////////////////////////////////////////////////////
var PrintControlPanelView = BackboneRelativeView.extend({
  el: '#print_ui',
  initialize: function() {
  console.log("intilized")
    BackboneRelativeView.prototype.initialize.apply(this)
    this.listenTo(thisProduct, "change:quantity", this.renderPrice)
    this.listenTo(thisProduct, "readyforprint", this.renderPrintDialog)
    this.listenTo(thisProduct.get("guests"), 'add', this.appendPlaceCard)
    this._place_card_print_collection = new PrintPlaceCardCollectionView({
      collection: thisProduct.get("guests")
    })
  },
  events: {
    "click #add_another": "addGuest",
    "click .global_baseline_up": "baselineUp",
    "click .global_baseline_down": "baselineDown",
    "click .global_font_increase": "fontIncrease",
    "click .global_font_decrease": "fontDecrease",
    "click .global_font_reset": "fontReset",
    "fontpicker:selected": "changeFont",
    "fontpicker:fontloaded": "loadFont",
    "dizzy-cp:click": "togglePanel",
    "click #menu_lines": "togglePanel",
    "click #close_mobile": "togglePanel",
    "click #ui_printer_icon": "printPage",    
    "click #cutting_marks": "toggleCuttingMarks",
    "click .layout_icon_container": "changeLayout",
    'click #print_now': "printNow",
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
    thisProduct.get("guests").resetFont();
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
  appendPlaceCard: function(guest) {
    var place_card = this._newPlaceCardView(guest).render().el        
    this.$('#actual_cards').append(place_card)
  },
  changeLayout: function(e) {
    var per_page = [8,3,4][$(e.currentTarget).index()]
    $('.layout_icon_container').removeClass('layout_selected');
    $(e.currentTarget).addClass('layout_selected')
    $("input[type=radio]").prop("checked", false)
    $("#radio_" + per_page).prop("checked", true)
    thisProduct.set("per_page", per_page)
  },  
  toggleCuttingMarks: function() {
    thisProduct.toggleCuttingMarks();
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
    console.log("rendering")
    $('#ui_printer_icon img').attr('src', "/gfx/spinner.gif");
  },
  closePrintAlert: function() {
    $('#ui_print_alert').fadeOut();
  },
  renderPrintDialog: function() {
    $('#ui_print_alert').fadeIn();
    $('#ui_printer_icon img').attr('src', "/gfx/printer_icon.svg")
  },
  printNow: function() {
    $('#ui_print_alert').hide();
    if(this.mobile) { this.togglePanel() }
    window.print()     
  },
  render: function() {
  console.log("rendering ")
    var $template = $(Handlebars.template(templates["user_interface_for_print"])({
      ipad: thisProduct.get("ipad"),
      pounds: thisProduct.get("pounds"),
      pence: thisProduct.get("pence")
    })); 
    this.$el.html($template)
    
    // Render place cards
    var place_cards = thisProduct.get("guests").map(function(guest) {   
      return this._newPlaceCardView(guest).render().el
    }, this)
    
    var colours = thisProduct.get("colours") 
    for(var i=0; i < colours.length; i++) {
      var $div = $('<div class="colour_picker_wrapper"></div>');
     $('#ui_print_colour_picker_container').append($div);
      $div.colorPicker({
        default_color: colours[i], 
        listen_to: thisProduct,
        index: i
      });
    }       
    this.$('#ui_font_picker').fontPicker({
      fonts: casamiento_fonts, 
      selected_font: thisProduct.get("font")
    }) 
    
    var guests_collection_view = new GuestCollectionView({collection:thisProduct.get("guests")}).render().el
    this.$('#ui_guests_quick').append(guests_collection_view)
    
    this.$('#actual_cards').prepend(place_cards)
    return this;
  },
  renderPrice: function() {
    this.$('#pound').text(thisProduct.get("pounds"));
    this.$('#decimal').text("." + thisProduct.get("pence"))
  },
  // convenience method for rendering a new place card view
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