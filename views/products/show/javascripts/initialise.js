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
    el: '#inner_page_container',
    initialize: function() {
      this.context = 0; // 0 = Main page, 1 = PreviewPage, 2 = PrintUI
      this.listenTo(thisProduct, 'change:colours', this._renderPreviewOnColourOrFontChange)
      this.listenTo(thisProduct, 'change:font', this._renderPreviewOnColourOrFontChange)
    },
    events: { 
      "click #print_button": "_renderPrintView",
      "fontpicker:selected": "changeFont"
    },
    _renderPreviewOnColourOrFontChange: function() {
       if(this.context != 2) {
         app_router.navigate('preview');
         this._renderPreview();
       }
    },
    render: function() {
      this.steps_rendered = true;
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
      if(!this.steps_rendered) 
        this.render();
      
      if (!this.preview_rendered) {
        this.place_card_view = new PlaceCardView({
          model: thisProduct.get("guests").first(), 
        }).render()
        
        var viewport_width = viewportSize.getWidth();
        //if(viewport_width < 501) {
        //  var height = that.place_card_el.$el.height();
        //  $('.left_column').height(height)
        //
        this.$('#preview').html(this.place_card_view.el);        
        this.$('#preview').append("<a id='print_button'>Print</a>")     
        this.preview_rendered = true;
      }
      
      if (this.context == 2) { // Print UI
        $('#print_ui').hide()
        $('#inner_page_container').show()
      }
      if (this.context == 0) {
        this.$('#product_container').hide()        
        this.$('#preview').show(); 
      }         
      this.context = 1;
      thisProduct.trigger("render:font")     
    },
    _renderPrintView: function() {
      if(!this.printview_rendered) {
        var print_control_panel_view = new PrintControlPanelView({}).render().el
        $('#print_ui').html(print_control_panel_view)        
        $('#print_ui').show();
        thisProduct.trigger("render:font")
        var $colour_pickers = $('#colour_swatches')
        
        // Create colour pickers
        var colours = thisProduct.get("colours");
        for(var i=0; i < colours.length; i++) {
          $colour_pickers.append(new ColourView({
            colour_index: i, 
            width: $colour_pickers.width()
          }).render().el)
        }
        this.printview_rendered = true;
      } else if(this.context == 1) {
        $('#inner_page_container').hide();        
        $('#print_ui').show();
      }
      this.context = 2;      
      app_router.navigate('print');
    },
    changeFont: function(e, font) {   
      thisProduct.set("font_size", font.font_size)
      thisProduct.set("font", font.font)
    }
  })      
        
  var coordinator_view = new CoordinatorView();
  
  // Router
  var AppRouter = Backbone.Router.extend({
    routes: {
      "preview": function() {
        coordinator_view._renderPreview();
      },
      "print": function() {
        coordinator_view._renderPrintView();
      }, 
      "": function(actions) {       
        coordinator_view.render();
      }
    }
  });
    
  // Initiate the router
  var app_router = new AppRouter;
  Backbone.history.start();      
})