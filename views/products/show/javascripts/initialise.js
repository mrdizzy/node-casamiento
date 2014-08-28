$(function() {
  var casamiento_fonts = <%- JSON.stringify(fonts) %>;
  
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
   $.updateFont(thisProduct.get("font"), {trigger: function(){}})
   $('.colour_0').css("background-color", thisProduct.get("colours")[0])   
   $('.colour_1').css("background-color", thisProduct.get("colours")[1])
  }, error: function(resp) {
    console.log("Error")
  }})    
  
  var FlatPreviewView = Backbone.View.extend({
    el: '#flat_preview',
    render: function() {
      var place_card_view = new PlaceCardView({
        model: thisProduct.get("guests").first()
      }).render()
      this.$el.html(place_card_view.el).append('<div class="place_card_wrapper" id="mobile_spacer"></div>')
      return this;
    }
  })
  
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
      this.product_container_view = this.$('#product_container')      
      this.flat_preview_view = new FlatPreviewView().render().$el.hide();      
      this.print_control_panel_view = new PrintControlPanelView({}).render().$el.hide();         
      this.listenTo(thisProduct, 'change:colours', this._renderPreview)
      this.listenTo(thisProduct, 'change:font', this._renderPreview)
    },
    events: {
      "click #print_button": "_renderPrintView",
      "fontpicker:selected": "changeFont",
      "fontpicker:fontloaded": "loadFont"
    },
    loadFont: function(e, font) {
      this.$('.font_spinner').hide();
      this.$('.guest_name').show();
    },
    changeFont: function(e, font) {
      this.$('.font_spinner').show();
      this.$('.guest_name').hide()    
      thisProduct.set("font", font)
    },
    _renderPreview: function() {
      if(this.current_view != "preview") {     
        this.current_view = "preview"    
        
        this.product_container_view.hide();  
        this.flat_preview_view.fadeIn(1000);
        this.print_control_panel_view.hide();
        if(viewportSize.getWidth() < 501) {
          $('body').hide()
          $('body').animate({
            scrollTop: $('body').offset().top
          }, 0); 
          $('body').fadeIn(1000);   
        }
        $('#print_button').show();
        thisProduct.trigger("global:rerenderfont")
      }    
    },
    _renderPrintView: function() {    
      if(this.current_view != "print") {
        $('#inner_page_container').hide();
        this.print_control_panel_view.show();               
        this.flat_preview_view.hide();             
        thisProduct.trigger("global:rerenderfont")         
      }      
      app_router.navigate("print")
    }
  })      
        
  var coordinator_view = new CoordinatorView();
  
  // Router
  var AppRouter = Backbone.Router.extend({
    routes: {
      "flat_preview": function() {
        coordinator_view._renderPreview();
      },    
      "flat_preview/colour0/:colour0": function(colour_0) {      
        thisProduct.updateColour(0, "#" + colour_0)
        coordinator_view._renderPreview();
      },  
      "print": function() {
        coordinator_view._renderPrintView();
      }, 
      "": function(actions) {       
      }
    }
  });
    
  // Initiate the router
  var app_router = new AppRouter;
  Backbone.history.start();      
  
})