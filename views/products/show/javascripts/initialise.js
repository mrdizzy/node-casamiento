$(function() {

  var casamiento_fonts = <%- JSON.stringify(fonts) %>;

  <%= include models.js %>  
  
  var thisProduct = new Product();   
  
var ViewCoordinator = Backbone.Model.extend({
  initialize:function() {
    this.on("change:view", this.updateRouter)
  },
  updateRouter: function() {
        app_router.navigate(this.get("view"))
  }
    
})
var view_coordinator = new ViewCoordinator()
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
  
  var guestList = new Guests();   
   
var flat_preview_view = new FlatPreviewView();
var print_ui = new PrintControlPanelView();

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