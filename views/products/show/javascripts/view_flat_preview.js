var FlatPreviewView = Backbone.View.extend({
  el: '#flat_preview',
  initialize: function() {
   // this.listenTo(view_coordinator, "change:view", this.changeView)
   // this.listenTo(thisProduct, "change:colours", this.renderViewOnColourOrFontChange)
   // this.listenTo(thisProduct, "change:font", this.renderViewOnColourOrFontChange)
  },
// renderViewOnColourOrFontChange: function() {
//   if(view_coordinator.previous("view") != "preview") {
//     view_coordinator.set("view", "preview")
//     this.render();
//     this.$el.fadeIn(2000)
//   }
// },
  render: function() {
    var place_card_view = new PlaceCardView({
      model: thisProduct.get("guests").first(),
      widths_relative_to_viewport: {
        desktop: 64.505,
        mobile: 95
      }
    }).render()
    this.$el.html(place_card_view.el).append('<div class="place_card_wrapper" id="mobile_spacer"></div>')
    return this;
  }
})