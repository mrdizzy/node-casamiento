$(function() {
  FastClick.attach(document.body);
  
  var casamiento_fonts = <%- JSON.stringify(fonts) %>;
  
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
      this.current_view = "main";
      this.step_view = new StepView().render();
      this.place_card_view = new PlaceCardView({
        model: thisProduct.get("guests").first()
      }).render()
      this.product_container_view = this.$('#product_container')
      this.flat_preview_view = this.$('#flat_preview')
      this.flat_preview_view.html(this.place_card_view.el).append('<div class="place_card_wrapper" id="mobile_spacer"></div>').append("<div style='text-align:center'><div class='grey_button' id='print_button' style='margin:0 auto;padding:0;padding-bottom:1em;padding-left:3em;padding-right:3em;border-top-left-radius:30px;border-bottom-right-radius:30px;text-align:center'><img src='/gfx/printers/file19.svg' style='line-height:0.5em;width:55px;margin:0;padding:0;' /><p style='margin:0;padding:0;line-height:0.5em;font-size:1.4em'>PRINT YOURSELF</p></div></div>").hide();
      
      this.print_control_panel_view = new PrintControlPanelView({}).render().$el.hide(); 
        
      this.listenTo(thisProduct, 'change:colours', this._renderPreview)
      this.listenTo(thisProduct, 'change:font', this._renderPreview)
    },
    events: { 
      "click #print_button": "_renderPrintView",
      "fontpicker:selected": "changeFont"
    },
    _renderPreview: function() {
      if(this.current_view != "preview") {         
        app_router.navigate("flat_preview")
        this.current_view = "preview"
        this.product_container_view.hide();        
        this.flat_preview_view.show();
        this.print_control_panel_view.hide();
      }
    },
    _renderPrintView: function() {    
      if(this.current_view != "print") {
        $('#inner_page_container').hide();
        this.print_control_panel_view.show();               
        this.flat_preview_view.hide();              
      }      
      app_router.navigate("print")
    },
    changeFont: function(e, font) {   
      thisProduct.set("font_size", font.font_size)
      thisProduct.set("font", font.font)
      thisProduct.save();
    }
  })      
        
  var coordinator_view = new CoordinatorView();
  
  // Router
  var AppRouter = Backbone.Router.extend({
    routes: {
      "flat_preview": function() {
        coordinator_view._renderPreview();
        $.appendFont(thisProduct.get("font"))
      },    
      "flat_preview/colour0/:colour0": function(colour_0) {
        coordinator_view._renderPreview();
        thisProduct.updateColour(0, "#" + colour_0)
        $.appendFont(thisProduct.get("font"))
      },  
      "print": function() {
        coordinator_view._renderPrintView();
        $.appendFont(thisProduct.get("font"))
      }, 
      "": function(actions) {       
      }
    }
  });
    
  // Initiate the router
  new AppRouter;
  Backbone.history.start();      
  
})