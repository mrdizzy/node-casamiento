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
  
  // Takes care of rendering the sub views
  // It is important to make the divs that will contain the html 
  // of rendered views visible first, then add the html to them
  // as the widths of certain elements must be visible in order
  // to calculate dynamic widths (for the colour picker, for example)
  
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
          this.$('#preview').append("<div style='text-align:center'><div class='grey_button' id='print_button' style='margin:0 auto;padding:0;padding-bottom:1em;padding-left:3em;padding-right:3em;border-top-left-radius:30px;border-bottom-right-radius:30px;text-align:center'><img src='/gfx/printers/file19.svg' style='line-height:0.5em;width:55px;margin:0;padding:0;' /><p style='margin:0;padding:0;line-height:0.5em;font-size:1.4em'>PRINT YOURSELF</p></div></div>")  
          this.preview_rendered = true;
        }
        app_router.navigate("flat_preview")
        $('#inner_page_container').show();
        $('#print_ui').hide();                
      }
      
        thisProduct.trigger("global:rerenderfont");
    },
    _renderPrintView: function() {    
      $('#inner_page_container').hide();
      $('#print_ui').show();  
      if(!this.print_view_rendered) {
        var print_control_panel_view = new PrintControlPanelView({}).render().$el    
        this.print_view_rendered = true;
      }          
          
      thisProduct.trigger("render:rerenderfont");
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
        appendFont(thisProduct.get("font"))
      },    
      "flat_preview/colour0/:colour0": function(colour_0) {
        coordinator_view._renderPreview();
        thisProduct.updateColour(0, "#" + colour_0)
        app_router.navigate("flat_preview/colour0/" + colour_0)
        appendFont(thisProduct.get("font"))
      },  
      "print": function() {
        coordinator_view._renderPrintView();
        appendFont(thisProduct.get("font"))
      }, 
      "": function(actions) {       
      }
    }
  });
    
  // Initiate the router
  new AppRouter;
  Backbone.history.start();      
  
  function appendFont(font) {
  $('head').append("<style type='text/css'> @font-face { font-family:'" + font + "'; src: url('/fonts/"+ font + ".eot?') format('eot'), url('/fonts/" + font + ".woff') format('woff'); }</style>");
  }
  
})