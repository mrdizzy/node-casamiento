var PrintControlPanelView = BackboneRelativeView.extend({
  el: '#print_ui',
  initialize: function() {
  
    console.log(thisProduct.get("browser"))
    if(thisProduct.get("browser")) {
    $('body').addClass(thisProduct.get("browser"))
    }
    BackboneRelativeView.prototype.initialize.apply(this)
    this.listenTo(thisProduct, "change:quantity", this.renderPrice)
    this.listenTo(thisProduct.get("guests"), 'add', this.appendPlaceCard)
    this.ui_alert_box_view = new PrintAlertBoxView();
    this._place_card_print_collection = new PrintPlaceCardCollectionView({
      collection: thisProduct.get("guests")
    })
     this.listenTo(thisProduct.get("guests"), 'reset', this.render)     
  },
  events: {
    "click #add_another": "addGuest",
    "click #menu_lines": "toggleMainMenu",
    "click .global_baseline_up": "baselineUp",
    "click .global_baseline_down": "baselineDown",
    "click .global_font_increase": "fontIncrease",
    "click .global_font_decrease": "fontDecrease",
    "click .global_font_reset": "fontReset",
    "click .buy": "checkout",
    "click #ui_printer_icon": "printPage"
  },
  addGuest:     function() {            thisProduct.get("guests").add({}) },
  fontReset:    function() {           thisProduct.get("guests").resetFont(); },
  fontIncrease: function() {        thisProduct.get("guests").invoke('adjustFontSize',1.05) },
  fontDecrease: function() {        thisProduct.get("guests").invoke('adjustFontSize',0.95) },
  baselineUp:   function() {          thisProduct.get("guests").invoke('adjustBaseline', -1) },
  baselineDown: function() {        thisProduct.get("guests").invoke('adjustBaseline', 1) },
  toggleMainMenu: function() { $('#left_menu').fadeToggle(); },
  
  checkout: function() {
      this.$('.buy').hide();
      this.$('.paypal_spinner').show()
      thisProduct.makePurchase();
  },
  appendPlaceCard: function(guest) {
    var place_card = this._newPlaceCardView(guest, "appended_place_card").render().el   
    var place_card = $(place_card);
    this.$( ".add_another" ).before(place_card)    
    place_card.fadeIn(2000);
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
        desktop: 32.646875,
        tablet: 61.746742671,
        mobile: 88.65156576200418
      },
      className:"place_card_view " + (appended ? appended : "")
    }))
  }
})