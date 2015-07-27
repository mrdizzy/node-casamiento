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

var PrintControlPanelView = BackboneRelativeView.extend({
  el: '#print_ui',
  initialize: function() {
    if(thisProduct.get("browser")) this.$el.addClass(thisProduct.get("browser"))
    BackboneRelativeView.prototype.initialize.apply(this)
    this.listenTo(thisProduct, "change:quantity", this.renderPrice)
    this.listenTo(thisProduct, "readyforprint", this.renderPrintDialog)
    this.listenTo(thisProduct.get("guests"), 'add', this.appendPlaceCard)
    this._place_card_print_collection = new PrintPlaceCardCollectionView({
      collection: thisProduct.get("guests")
    })
     this.listenTo(thisProduct.get("guests"), 'reset', this.render)     
  },
  events: {
    "click #add_another": "addGuest",
    "click .global_baseline_up": "baselineUp",
    "click .global_baseline_down": "baselineDown",
    "click .global_font_increase": "fontIncrease",
    "click .global_font_decrease": "fontDecrease",
    "click .global_font_reset": "fontReset",
    "click .buy": "checkout",
    "click #ui_printer_icon": "printPage",    
    "click #cutting_marks": "toggleCuttingMarks",
    "click .layout_icon_container": "changeLayout",
    'click #print_now': "printNow",
    "click #ui_print_alert .close": "closePrintAlert"
  },
  checkout: function() {
      this.$('.buy').hide();
      this.$('.paypal_spinner').show()
      thisProduct.makePurchase();
  },
  addGuest:     function() {            thisProduct.set("quantity", thisProduct.get("quantity") + 1) },
  fontReset:    function() {           thisProduct.get("guests").resetFont(); },
  fontIncrease: function() {        thisProduct.get("guests").invoke('adjustFontSize',1.05) },
  fontDecrease: function() {        thisProduct.get("guests").invoke('adjustFontSize',0.95) },
  baselineUp:   function() {          thisProduct.get("guests").invoke('adjustBaseline', -1) },
  baselineDown: function() {        thisProduct.get("guests").invoke('adjustBaseline', 1) },
  toggleCuttingMarks: function() {  thisProduct.toggleCuttingMarks(); },
  
  appendPlaceCard: function(guest) {
    var place_card = this._newPlaceCardView(guest, "appended_place_card").render().el   
    var place_card = $(place_card);
    this.$( ".add_another" ).before(place_card)    
    place_card.fadeIn(2000);
  },
  changeLayout: function(e) {
    var per_page = [8,3,4][$(e.currentTarget).index()]
    $('.layout_icon_container').removeClass('layout_selected');
    $(e.currentTarget).addClass('layout_selected')
    $("input[type=radio]").prop("checked", false)
    $("#radio_" + per_page).prop("checked", true)
    thisProduct.set("per_page", per_page)
  },  
  loadFont: function(e, font) {
    $('.font_spinner').hide();
    $('.guest_name').show()  
  },
  changeFont: function(e, font) { 
    thisProduct.set("font", font)
    $('.font_spinner').show();
    $('.guest_name').hide()  
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
  renderPrintDialog: function() {
    $('#ui_print_alert').fadeIn();
    $('#ui_printer_icon img').attr('src', "/gfx/printer_icon.svg")
  },
  printNow: function() {
    $('#ui_print_alert').hide();
    window.print()     
  },
  render: function() {
    var $template = $(Handlebars.template(templates["user_interface_for_print"])({
      pounds: thisProduct.get("pounds"),
      pence: thisProduct.get("pence")
    })); 
    this.$el.html($template)
    
    // Render place cards
    var place_cards = thisProduct.get("guests").map(function(guest) {   
      return this._newPlaceCardView(guest).render().el
    }, this)
    
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
  _newPlaceCardView: function(guest, appended) {
    return new PlaceCardView(_.extend({
      model: guest,      
      widths_relative_to_viewport: {
        netbook: 37.04890873,
        desktop: 32.251265822,
        tablet: 61.746742671,
        mobile: 95
      },
      className:"place_card_view " + (appended ? appended : "")
    }))
  }
})