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
  var thisProduct = new Product();   
  
  thisProduct.fetch({success:function(resp) {
    console.log("succcess")
  }, error: function(resp) {
    console.log("Error")
  }})    
        
  var CoordinatorView = Backbone.View.extend({
    el: '#inner_page_container',
    initialize: function() {
      this.listenTo(thisProduct, 'change:colours', this._renderPreview)
      this.listenTo(thisProduct, 'change:font', this._renderPreview)
    },
    events: { 
      "click #print_button": "_renderPrintView",
      "fontpicker:selected": "changeFont"
    },
    _renderPreview: function() {  
      if (Backbone.history.fragment != "print") {
        if(!this.preview_rendered) {
          this.place_card_view = new PlaceCardView({
            model: thisProduct.get("guests").first()
          }).render()
           
          this.$('#preview').html(this.place_card_view.el).append('<div class="place_card_wrapper" id="mobile_spacer"></div>'); // Mobile responsive spacer      
          this.$('#preview').append("<a id='print_button'>Print</a>")  
          thisProduct.trigger("render:font");

          this.preview_rendered = true;
        }
        app_router.navigate("flat_preview")
        $('#inner_page_container').show();
        $('#print_ui').hide();  
        
        thisProduct.trigger("render:font").trigger("rerender") 
      }
    },
    _renderPrintView: function() {
      if(!this.print_view_rendered) {
        var print_control_panel_view = new PrintControlPanelView({}).render().$el
      }         
      $('#inner_page_container').hide();
      $('#print_ui').show();  
      thisProduct.trigger("render:font").trigger("rerender")      
      app_router.navigate("print")
    },
    changeFont: function(e, font) {   
      thisProduct.set("font_size", font.font_size)
      thisProduct.set("font", font.font)
      thisProduct.save();
    }
  })      
        
  var coordinator_view = new CoordinatorView();
  var step_view = new StepView().render()
  
  // Router
  var AppRouter = Backbone.Router.extend({
    routes: {
      "flat_preview": function() {
        coordinator_view._renderPreview();
        thisProduct.trigger("rerender") 
      },    
      "flat_preview/colour0/:colour0": function(colour_0) {
        coordinator_view._renderPreview();
        thisProduct.updateColour(0, "#" + colour_0)
        app_router.navigate("flat_preview/colour0/" + colour_0)
      },  
      "print": function() {
        coordinator_view._renderPrintView();
      }, 
      "": function(actions) {       
        coordinator_view._renderStepView();
      }
    }
  });
    
  // Initiate the router
  var app_router = new AppRouter;
  Backbone.history.start();      
})