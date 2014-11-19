$(function() {

  var casamiento_fonts = <%- JSON.stringify(fonts) %>;
  
  /* Test for user agent */
var isWindowsChrome = navigator.userAgent.match(/Chrome/i) != null;
var isiPad = navigator.userAgent.match(/iPad/i) != null;

  <%= include models.js %>  
  <%= include views.js %>
  <%= include place_card_view.js %>
  <%= include ui_print_views.js %>

  // Initialize templates
  var templates = {}
  <% templates.forEach(function(template) { %>
    templates["<%= template.name %>"] = <%- template.template %>;
  <% }) %>
  
  // Setup and initialization
  var thisProduct = new Product();   
  var guestList = new Guests();
   
  thisProduct.fetch({silent:true, success:function(model, resp) {
    $.updateFont(thisProduct.get("font"), {trigger: function(){}}) 
   
  }, error: function(model,resp) {
    var guests = localStorage.getItem("guests")
   if(guests) {
   guests =JSON.parse(guests)
   
    thisProduct.get("guests").reset(guests)
   }
   
  }})    
  
  var FlatPreviewView = Backbone.View.extend({
    el: '#flat_preview',
    render: function() {
      var place_card_view = new PlaceCardView({
        model: thisProduct.get("guests").first(),
        widths_relative_to_viewport: {
          desktop: 64.505,
          mobile: 95
        }
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
  
  // #inner_page_container wraps everything including the header

  var CoordinatorView = Backbone.View.extend({
    el: '#inner_page_container',
    initialize: function() {
      this.step_view = new StepView(); 
      this.product_container_view = this.$('#product_container')      
      this.flat_preview_view = new FlatPreviewView();
      this.print_control_panel_view_backbone = new PrintControlPanelView()        
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
      if(this.current_view == "home") 
        this._renderPreview();
    },
    _renderHome: function() {
      this.current_view = "home"
      this.print_control_panel_view_backbone.$el.hide(); 
      $('#inner_page_container').show();
      this.product_container_view.fadeIn(1000);
      this.flat_preview_view.$el.hide();
      this.step_view.render()
      app_router.navigate("")
    },
    _renderPreview: function() {
      if (this.current_view != "preview") {     
         
        if(this.current_view == "print") {
          $('#print_ui').hide();
          $('#inner_page_container').fadeIn(1000);  
        }       
        
        this.product_container_view.hide();  
        
        if(this.current_view != "home") 
          this.step_view.render();
        
        this.flat_preview_view.render().$el.fadeIn(1000);
        
         if(viewportSize.getWidth() < 501) {
           $('body').hide()
           $('body').animate({
             scrollTop: $('body').offset().top
           }, 0); 
           $('body').fadeIn(1000);   
         
         $('#print_button').show();
        }   
        app_router.navigate("preview_place_card")
        this.current_view = "preview"
      }
    },
    _renderPrintView: function() {     
      this.current_view = "print"          
      $('#inner_page_container').hide();
      $('body').css('background-image', "none")
      var $el = this.print_control_panel_view_backbone.render().$el;
      $el.fadeIn(1000);                    
      $('body').animate({
          scrollTop: $('body').offset().top
        }, 0);     
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
        coordinator_view._renderHome();     
      }
    }
  });
    
  // Initiate the router
  var app_router = new AppRouter;
  Backbone.history.start();      
  
})