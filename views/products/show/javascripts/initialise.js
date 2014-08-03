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
        
  var CoordinatorView = Backbone.View.extend({
  el:  '#inner_page_container',
    initialize: function() {
      this.listenTo(thisProduct, 'change:colours', this._renderPreview)
      this.listenTo(thisProduct, 'change:font', this._renderPreview)
    },
    events: 
    { 
      "fontpicker:selected": "changeFont"
    },
    changeFont: function(e, font) {   
      thisProduct.set("font_size", font.font_size)
      thisProduct.set("font", font.font)
    },
    render: function() {
      var step_view = new StepView().render().el;
      this.$('.right_column').html(step_view)
      
       // Create colour pickers
      var colours = thisProduct.get("colours");
      var $colour_wrapper = $('.right_column').find("#colour_section_render")
      for(var i=0; i < colours.length; i++) {
        $colour_wrapper.append(new ColourView({colour_index: i, width:$('.right_column').width()}).render().el)
      }
      // Create font picker
      this.$('.right_column').find('#fonts').fontPicker({
        fonts: casamiento_fonts, 
        selected_font: thisProduct.get("font")
      });
    },
    _renderPreview: function() {
      var viewport_width = viewportSize.getWidth();
      //if(viewport_width < 501) {
      //  var height = that.place_card_el.$el.height();
      //  $('.left_column').height(height)
      //}
      var preview_view = new PreviewView().render().el
      $('.left_column').fadeOut(function() {
        $('.left_column').html(preview_view).show();      
          thisProduct.trigger("render:font")
      })
    }
  })      
        
  var coordinator_view = new CoordinatorView();
  
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
      coordinator_view.render();
    })
    
    app_router.on('route:previewRoute', function() {

      coordinator_view._renderPreview();
    })
    
    app_router.on('route:print', function() {
      preview_view._renderPrintView();
    })

    // Start Backbone history a necessary step for bookmarkable URL's
    Backbone.history.start();      
 

})