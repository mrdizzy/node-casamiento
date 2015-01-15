$(function() {

  Backbone.Collection.prototype.save = function (options) {
    Backbone.sync("create", this, options);
  };
   
  String.prototype.toTitleCase = function () {
    var A = this.split(' '), B = [];
    for (var i = 0; A[i] !== undefined; i++) {
      B[B.length] = A[i].substr(0, 1).toUpperCase() + A[i].substr(1);
    }
    return B.join(' ');
  }
  
  var casamiento_fonts = <%- JSON.stringify(fonts) %>;
  
  <%= include models_guest.js %> 
  <%= include models_product.js %>   
  <%= include view_backbone_relative.js %>
  <%= include view_product_steps.js %>
  <%= include view_place_card.js %>
  <%= include view_flat_preview.js %>  
  <%= include view_product_slides.js %>
  <%= include view_print_place_card_collection.js %>
  <%= include view_print_ui.js %>
  <%= include view_coordinator.js %>  
  <%= include router.js %>
  
  var thisProduct = new Product();   
  
  var templates = {}
  <% templates.forEach(function(template) { %>
    templates["<%= template.name %>"] = <%- template.template %>;
  <% }) %>
  
  var guestList = new Guests();   
  var coordinator_view = new CoordinatorView();  
  
  thisProduct.fetch({silent: true, success: function(model, resp) {
    $.updateFont(thisProduct.get("font"), {trigger: function(){}}) 
    }, error: function(model,resp) {
      var guests = localStorage.getItem("guests")
      if(guests) thisProduct.get("guests").reset(JSON.parse(guests))
    }
  })
  
  var app_router = new AppRouter;
  Backbone.history.start();      

})