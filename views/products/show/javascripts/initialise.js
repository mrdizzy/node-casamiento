$(function() {   
   var casamiento_test_for_mobile,
     casamiento_test_for_phablet;
  
  var testForPhablet = _.debounce(function () {
    var viewport = $('body').width();
    if(viewport < 801) {
      casamiento_test_for_phablet = true
    } else {
      casamiento_test_for_phablet = false;
    }
  }, 500)
  
  var testForMobile = _.debounce(function testForMobile() {
    var viewport = $('body').width();
    if(viewport < 501) {
     casamiento_test_for_mobile = true
    } else {
      casamiento_test_for_mobile = false;
    }
  }, 500)
  
  $(window).on("resize", testForPhablet())
  $(window).on("resize", testForMobile())
  Backbone.Collection.prototype.save = function (options) {
    Backbone.sync("create", this, options);
  };
  
  var casamiento_fonts = <%- JSON.stringify(fonts) %>;
  console.log(casamiento_fonts)
  
  <%= include models_guest.js %> 
  <%= include models_product.js %>    
  <%= include view_product_steps.js %>
  <%= include view_place_card.js %> 
  <%= include view_product_slides.js %>
  <%= include view_print_place_card_collection.js %>
  <%= include view_print_alert_box.js %>
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
    thisProduct.calculatePrice();
    }, error: function(model,resp) {
      var guests = localStorage.getItem("guests")
      if(guests) thisProduct.get("guests").reset(JSON.parse(guests))
    }
  })
  
  Backbone.history.start();      

})