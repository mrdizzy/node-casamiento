$(function() {

  var casamiento_fonts = <%- JSON.stringify(fonts) %>;
  
  <%= include models.js %>  
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