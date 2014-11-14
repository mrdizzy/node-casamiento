
  var CoordinatorView = Backbone.View.extend({
    el: '#inner_page_container',
    initialize: function() {
      this.current_view = "main";
      this.step_view = new StepView().render();      
      this.product_container_view = this.$('#product_container')      
      this.flat_preview_view = new FlatPreviewView().render().$el.hide();      
      this.print_control_panel_view_backbone = new PrintControlPanelView({})        
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
        //this.print_control_panel_view.hide();
        if(viewportSize.getWidth() < 501) {
          $('body').hide()
          $('body').animate({
            scrollTop: $('body').offset().top
          }, 0); 
          $('body').fadeIn(1000);   
        }
        $('#print_button').show();
        app_router.navigate("preview_place_card")
      }    
    },
    _renderPrintView: function() {        
      if(this.current_view != "print") {
        this.current_view = "print"  
        $('#inner_page_container').hide();
        var $el = this.print_control_panel_view_backbone.render().$el;
        $el.hide().fadeIn(1000);               
        this.flat_preview_view.hide();        
        $('body').animate({
            scrollTop: $('body').offset().top
          }, 0);        
          
      }      
      app_router.navigate("print")
    }
  })      