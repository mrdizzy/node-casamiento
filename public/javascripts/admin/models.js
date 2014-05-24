var ProductTypes = Backbone.Collection.extend({
  url: "/product_types"
})

var Product = Backbone.Model.CouchDB.extend({
  urlRoot: "/products",
  defaults: { "type": "product", colour_1: "", colour_2: "" },
  toJSON: function() {
    var json = Backbone.Model.CouchDB.prototype.toJSON.apply(this, arguments)
    if(!json._id && this.get("theme")) {
      json._id = this.get("theme") + "-" + this.get("product_type")
    }
    return json;
  },
  attachment_types: ["thumb","small", "display","medium","large"]
});

var Products = Backbone.Collection.extend({
    model: Product,
    url: "/products"
});
  