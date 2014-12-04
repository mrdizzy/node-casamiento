$(function() {

  var casamiento_fonts = <%- JSON.stringify(fonts) %>;

  <%= include models.js %>  
  <%= include view_product_steps.js %>
  <%= include view_place_card.js %>
  <%= include view_print_ui.js %>
  <%= include view_coordinator.js %>  
  <%= include router.js %>
  
  // Initialize templates
  var templates = {}
  <% templates.forEach(function(template) { %>
    templates["<%= template.name %>"] = <%- template.template %>;
  <% }) %>
  
  var thisProduct = new Product();   
  var guestList = new Guests();   
   
  var short_products = new ShortProducts();
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