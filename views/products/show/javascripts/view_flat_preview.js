var FlatPreviewView = Backbone.View.extend({
  el: '#flat_preview',
  render: function() {
    var place_card_view = new PlaceCardView({
      model: thisProduct.get("guests").first(),
      widths_relative_to_viewport: {
        desktop: 64.505,
        tablet: 53.35,
        mobile: 95
      }
    }).render()
    this.$el.html(place_card_view.el).append('<div class="place_card_wrapper" id="mobile_spacer"></div>')
    return this;
  }
})