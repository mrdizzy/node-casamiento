/*! viewportSize | Author: Tyson Matanich, 2013 | License: MIT */
(function(n){n.viewportSize={},n.viewportSize.getHeight=function(){return t("Height")},n.viewportSize.getWidth=function(){return t("Width")};var t=function(t){var f,o=t.toLowerCase(),e=n.document,i=e.documentElement,r,u;return n["inner"+t]===undefined?f=i["client"+t]:n["inner"+t]!=i["client"+t]?(r=e.createElement("body"),r.id="vpw-test-b",r.style.cssText="overflow:scroll",u=e.createElement("div"),u.id="vpw-test-d",u.style.cssText="position:absolute;top:-1000px",u.innerHTML="<style>@media("+o+":"+i["client"+t]+"px){body#vpw-test-b div#vpw-test-d{"+o+":7px!important}}<\/style>",r.appendChild(u),i.insertBefore(r,e.head),f=u["offset"+t]==7?i["client"+t]:n["inner"+t],i.removeChild(r)):f=n["inner"+t],f}})(this);

$(function() {
  FastClick.attach(document.body);
  
  var casamiento_fonts = <%- JSON.stringify(fonts) %>;
  var object_fonts = {};
  casamiento_fonts.forEach(function(obj) {
    object_fonts[obj[0]] = obj[1];
  })
  // Render javascripts
  <%= include models.js %>  
  <%= include views.js %>
  <%= include ui_print_views.js %>

  // Initialize templates
  var templates = {}
  <% templates.forEach(function(template) { %>
    templates["<%= template.name %>"] = <%- template.template %>;
  <% }) %>

  // Setup and initialization
  var thisProduct = new Product(<%- JSON.stringify(product) %>);
    
  thisProduct.set("font_size", object_fonts[thisProduct.get("font")])
        
  var step_view = new StepView();
  var preview_view = new PreviewView({el: '#product_container', model: thisProduct})
  // Router
  var AppRouter = Backbone.Router.extend({
        routes: {
            "preview": "previewRoute", 
            "print": "print",
            "": "defaultRoute"
        }
    });
    
    // Initiate the router
    var app_router = new AppRouter;

    app_router.on('route:defaultRoute', function(actions) {       
      step_view.render();
    })
    
    app_router.on('route:previewRoute', function() {
    step_view.render();
      step_view._renderPreview();
    })
    
    app_router.on('route:print', function() {
      preview_view._renderPrintView();
    })

    // Start Backbone history a necessary step for bookmarkable URL's
    Backbone.history.start();      
 

})