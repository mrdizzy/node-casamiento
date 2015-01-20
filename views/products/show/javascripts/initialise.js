$(function() {

  Backbone.Collection.prototype.save = function (options) {
    Backbone.sync("create", this, options);
  };
  
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
  
  var templates = {}
  <% templates.forEach(function(template) { %>
    templates["<%= template.name %>"] = <%- template.template %>;
  <% }) %>
  
  var thisProduct = new Product(<%- JSON.stringify(product) %>),
    guestList = new Guests(),
    coordinator_view = new CoordinatorView(),   
    app_router = new AppRouter;
  
  // thisProduct.fetch looks in localstorage for the product. If we find
  // it, then we first update the current font. If we don't find it, 
  // then we check to see if there is an existing guest list and add
  // that to the product
  thisProduct.fetch({silent: true, success: function(model, resp) {
    $.updateFont(thisProduct.get("font"), {trigger: function(){}}) 
    }, error: function(model,resp) {
      var guests = localStorage.getItem("guests")
      if(guests) thisProduct.get("guests").reset(JSON.parse(guests))
    }
  })
  
  Backbone.history.start();      

})