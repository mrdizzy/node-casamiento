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
  initialize: function() {
      this.selectedColours()
  },
  attachment_types: ["thumb","display","medium","large"],
  selectedColours: function() {
    var that = this;
    if (this.get("selected_colours")) {
      return this.get("selected_colours")
    } else {
      var selected_colours = _.map(colourList, function(colour) {
        var matchingColour = _.any(that.get("colours"), function(selectedColour) {
         return selectedColour == colour;
        })
        if (matchingColour) {
          return {
            colour: colour,
              selected: "selected"
          }
        }
        else {
          return {
            colour: colour,
            selected: ""
          }
        }
      })
      this.set("selected_colours", selected_colours)
    }
  }
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
