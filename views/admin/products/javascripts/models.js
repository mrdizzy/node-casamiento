var Product = Backbone.Model.CouchDB.extend({
  urlRoot: "/products",
  defaults: { "type": "product", font_size: "0.08", baseline: 0, "font": "Metroscript" },
  attachment_types: ["tiny", "small", "thumb", "display","medium","large"],
  updateColour: function(index, colour) {
    var colours = this.get("colours");
    colours[index] = colour;
    this.set("colours", colours)
    this.trigger("change:colours")
  },
  upBaseline: function() {
    this.set("baseline", (this.get("baseline") - 1))
  },
  downBaseline: function() {
    this.set("baseline", (this.get("baseline") + 1))
  },
  adjustFontSize: function(amount) {
    this.set("font_size", this.get("font_size") * amount)
  }
});

var Products = Backbone.Collection.extend({
    model: Product,
    url: "/products"
});