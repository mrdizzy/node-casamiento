var ProductTypes = Backbone.Collection.extend({
  url: "/product_types"
})

var Product = Backbone.Model.CouchDB.extend({
  urlRoot: "/products",
  defaults: { "type": "product" },
  toJSON: function() {
    var json = Backbone.Model.CouchDB.prototype.toJSON.apply(this, arguments)
    if(!json._id && this.get("theme")) {
      json._id = this.get("theme") + "-" + this.get("product_type")
    }
    return json;
  },
  attachment_types: ["thumb","display","medium","large"]
});

var Products = Backbone.Collection.extend({
    model: Product,
    url: "/products"
});
  
var Theme = Backbone.Model.CouchDB.extend({
  toJSON: function() {
    var json = Backbone.Model.CouchDB.prototype.toJSON.apply(this, arguments)
    
    // Set the id to the value of theme_name with spaces replaced by underscores and all in lower case if not already been set
    // e.g. Birds of Paradise -> birds_of_paradise
    json._id = json._id || this.get("name").replace(/\s+/g, '_').toLowerCase();
    return json;
  }
})

var Themes = Backbone.Collection.extend({
  model: Theme,
  url: "/themes"
})
