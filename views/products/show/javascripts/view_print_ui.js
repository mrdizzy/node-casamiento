var PrintControlPanelView = Backbone.View.extend({
  el: '#print_ui',
  initialize: function() {
    this.guests = thisProduct.get("guests");
    this.ui_alert_box_view = new PrintAlertBoxView();

    if (thisProduct.get("browser")) $('body').addClass(thisProduct.get("browser"))
    this.listenTo(thisProduct, "change:quantity", this.renderPrice)
    this.listenTo(this.guests, 'add', this.appendPlaceCard)
    this.listenTo(this.guests, 'addMultiple', this.appendMultiplePlaceCards)
    this.listenTo(this.guests, 'reset', this.render) // Render method is called as soon as the guests are reset
    this.listenTo(this.guests, 'waypoint', this._createMainWaypoint)
    this.listenTo(this.guests, 'removeMultiple', this.removeMultiple)
    this.listenTo(thisProduct, "addAnotherAfterReturn", this.addGuest)
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
    "click #ui_printer_icon": "printPage",
    "click #mobile_ui_printer_icon": "printPage"
  },
  addGuest: function() {
    thisProduct.get("guests").add({
      font_size: thisProduct.get("global_font_size") || thisProduct.get("font_size"),
      baseline: thisProduct.globalBaseline()
    })
  },
  fontReset: function() {
    thisProduct.resetFont();
  },
  fontIncrease: function() {
    thisProduct.trigger('adjustFontSize', 1.05).saveGuests()
  },
  fontDecrease: function() {
    thisProduct.trigger('adjustFontSize', 0.95).saveGuests()
  },
  baselineUp: function() {
    thisProduct.trigger('adjustBaseline', -1)
  },
  baselineDown: function() {
    thisProduct.trigger('adjustBaseline', 1)
  },
  toggleMainMenu: function() {
    $('#left_menu').fadeToggle();
  },
  checkout: function() {
    this.$('.buy').hide();
    this.$('.paypal_spinner').show()
    thisProduct.makePurchase();
  },
  removeMultiple: function(number_removed) { // number_removed is a minus figure

 //  if (this.place_view_counter > 12) {
    //this.place_view_counter = this.place_view_counter + number_removed
  // } 
   if((thisProduct.get("guests").length < this.place_view_counter) && (this.place_view_counter > 12)) {
     this.place_view_counter = this.place_view_counter + number_removed;
   }

    console.log("Removing multiple: Guests length:" + thisProduct.get("guests").length + "Place view counter: " + this.place_view_counter + "number_removed:" +number_removed)
    this._createMainWaypoint();
  },
  appendPlaceCard: function(guest) {
    var place_card_view = this._newPlaceCardView(guest, "appended_place_card")
    var render = place_card_view.render().el
    var place_card = $(render);
    this.$(".add_another").before(place_card)
    place_card.fadeIn(2000);
    place_card_view.$('.guest_name').text("").focus();
    place_card_view._renderFontAndBaseline();
  },
  appendMultiplePlaceCards: function(counter) {
    var html = []

    if (counter < 12) {
      for (counter; counter < 12; counter++) {
        this.place_view_counter = counter;
        if (!thisProduct.get("guests").at(counter)) break
        html.push(this._newPlaceCardView(thisProduct.get("guests").at(counter)).render().el)
      }
      this.$(".add_another").before(html)
      thisProduct.trigger("redraw")

      this.place_view_counter = this.place_view_counter + 1;
    }
    this._createMainWaypoint();
  },
  renderAndCreateWaypoint: function() {
    console.log("rendering and creating waypoint")
    Waypoint.destroyAll();
    this.render();
    thisProduct.trigger("redraw")
    this._createMainWaypoint();
  },
  _createMainWaypoint: function() {
    Waypoint.destroyAll();
    if (thisProduct.get("guests").length > 12) {
      var that = this;
      var waypoint = new Waypoint({
        element: $('#add_another')[0],
        handler: function(direction) {
          if (direction == "down") that.renderMore(waypoint);
        },
        offset: '140%'
      })
    }
  },
  render: function() {
    var place_cards = [];
    var $template = $(Handlebars.template(templates["user_interface_for_print"])({
      pounds: thisProduct.get("pounds"),
      pence: thisProduct.get("pence"),
      quantity: thisProduct.quantity()
    }));
    this.$el.html($template)

    this.place_view_counter = 0;
    for (var i = 0; i < 12; i++) { // Only render the first 12 place cards (0 to 11 is equivalent to 12!)
      var guest = this.guests.at(i);
      if (guest) {
        place_cards.push(this._newPlaceCardView(guest).render().el)
        this.place_view_counter = this.place_view_counter + 1;
      }
    }

    this.$('#actual_cards').prepend(place_cards)
    return this;
  },
  // Increments place_view_counter each time a render occurs
  renderMore: function(waypoint) {
    console.log("Rendering more. Place view counter: " + this.place_view_counter)
    waypoint.destroy();
    var that = this;
    var place_cards = []
    for (var i = 0; i < 12; i++) {
      var guest = thisProduct.get("guests").at(this.place_view_counter);
      if (guest) {
        place_cards.push(this._newPlaceCardView(guest, "appended_place_card").render().$el)
        this.place_view_counter = this.place_view_counter + 1;
        console.log(this.place_view_counter)
      }
    }

    this.$('.add_another').before(place_cards);
    place_cards.forEach(function(card) {
      card.fadeIn(1500)
    })
    thisProduct.trigger("redraw")
    if (this.place_view_counter < thisProduct.get("guests").length - 1) {
      var new_waypoint = new Waypoint({
        element: $('#add_another')[0],
        handler: function(direction) {
          if (direction == "down") that.renderMore(new_waypoint);
        },
        offset: '140%'
      })
    }
  },
  // Create the SVG print view
  printPage: function(e) {
    this._place_card_print_collection = this._place_card_print_collection || new PrintPlaceCardCollectionView({
      collection: thisProduct.get("guests")
    })
    this._place_card_print_collection.render()
    $('#ui_printer_icon').attr('src', "/gfx/spinners/360.gif");
    $('#mobile_ui_printer_icon').attr('src', "/gfx/spinners/360.gif");
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
      className: "place_card_view " + (appended ? appended : "")
    }))
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
  }
})