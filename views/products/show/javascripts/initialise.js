$(function() {
  var casamiento_fonts = <%- JSON.stringify(fonts) %>;
  
  /* Test for iPad */
var isWindowsChrome = navigator.userAgent.match(/Chrome/i) != null;
var isiPad = navigator.userAgent.match(/iPad/i) != null;

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
    
    // Globally change colours according to those saved in localStorage
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
      this.listenTo(thisProduct, 'change:colours', this._renderPreviewAfterMain)
      this.listenTo(thisProduct, 'change:font', this._renderPreviewAfterMain)
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
    _renderPreviewAfterMain: function() {
      if(this.current_view != "print") {  
        this._renderPreview()
      }  
    },
    _renderPreview: function() {
      if(this.current_view != "preview") {   
     
        this.current_view = "preview"    
        $('#inner_page_container').show();
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
        app_router.navigate("preview_place_card")
      }    
    },
    _renderPrintView: function() {        
      if(this.current_view != "print") {
        $('#inner_page_container').hide();
        this.print_control_panel_view.fadeIn(1000);               
        this.flat_preview_view.hide();        
        $('body').animate({
            scrollTop: $('body').offset().top
          }, 0);      
        thisProduct.trigger("global:rerenderfont")     
        this.current_view = "print"    
      }      
      app_router.navigate("print")
    }
  })      
        
  var coordinator_view = new CoordinatorView();
  
  // Router
  var AppRouter = Backbone.Router.extend({
    routes: {
      "preview_place_card": function() {
        coordinator_view._renderPreview();
      },    
      "preview_place_card/colour0/:colour0": function(colour_0) {      
        thisProduct.updateColour(0, "#" + colour_0)
        coordinator_view._renderPreview();
      },  
      "preview_place_card/c0/:colour0/c1/:colour1": function(colour_0, colour_1) {      
        thisProduct.updateColour(0, "#" + colour_0);
        thisProduct.updateColour(1, "#" + colour_1)
        coordinator_view._renderPreview();
      },  
      "preview_place_card/c0/:colour0/c1/:colour1/f/:font": function(colour_0, colour_1, font) {      
        thisProduct.updateColour(0, "#" + colour_0);
        thisProduct.updateColour(1, "#" + colour_1)
        thisProduct.set("font", font)
        $.updateFont(font, {trigger: function(){}})
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