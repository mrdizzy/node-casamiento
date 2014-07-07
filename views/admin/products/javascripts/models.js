var Product = Backbone.Model.CouchDB.extend({
  urlRoot: "/products",
  defaults: { "type": "product" },
  attachment_types: ["thumb", "display","medium","large","transparent_display", "transparent_medium", "transparent_large"]
});

var Products = Backbone.Collection.extend({
    model: Product,
    url: "/products"
});