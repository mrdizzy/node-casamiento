$(function() {

  Backbone.Collection.prototype.save = function (options) {
    Backbone.sync("create", this, options);
  };
  
  var casamiento_fonts = <%- JSON.stringify(fonts) %>;

  <%= include ./../show/javascripts/models_guest.js %> 
  <%= include ./../show/javascripts/models_product.js %> 
  <%= include ./../show/javascripts/models_edit_product.js %>   
  <%= include ./../show/javascripts/view_place_card.js %>
  <%= include ./../show/javascripts/view_print_alert_box.js %>
  <%= include ./../show/javascripts/view_print_place_card_collection.js %>
  <%= include ./../show/javascripts/view_print_ui.js %>
  
  var templates = {}
  <% templates.forEach(function(template) { %>
    templates["<%= template.name %>"] = <%- template.template %>;
  <% }) %>
  
  var thisProduct = new EditProduct(<%- JSON.stringify(product) %>, {parse:true});
  
  var print_ui_view = new PrintControlPanelView(); 
  print_ui_view.$el.show()
  print_ui_view.renderAndCreateWaypoint();
  $('body').addClass("printui_view")       
        window.scrollTo(0,0);
})