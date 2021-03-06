  // Takes care of rendering the sub views
  // It is important to make the divs that will contain the html 
  // of rendered views visible first, then add the html to them
  // as the widths of certain elements must be visible in order
  // to calculate dynamic widths (for the colour picker, for example)
  
  // #inner_page_container wraps everything including the header

var CoordinatorView = Backbone.View.extend({
  el: '#background_container',
  initialize: function() {
    this.first_render = true;
    this.step_view = new StepView(); 
    this.slides_view = new ProductSlideView();    
    this.flat_preview_view = new FlatPreviewView();
    this.print_ui_view = new PrintControlPanelView(); 
  },
  events: {
   "click #print_button": "renderPrintView",
    "fontpicker:selected": "changeFont",
    "fontpicker:fontloaded": "loadFont",
  },
  renderHome: function() {  
    this.listenToOnce(thisProduct, 'change:colours', this.renderFlatPreview)   
    this.listenToOnce(thisProduct, 'change:font', this.renderFlatPreview)
    var that = this;
    if(this.first_render) $('#loading_main_page_spinner').hide();
    if(this.current_view == "printui") {
      this.print_ui_view.$el.fadeOut(function() {
        $('#background_container').fadeIn();
      })
    }
    else if (this.current_view == "preview") {
      this.flat_preview_view.$el.fadeOut(function() {
        that.slides_view.render().$el.fadeIn();  
      });
    } else {
      this.step_view.render();
      that.slides_view.render().$el.fadeIn();  
      this.first_render = false;  
    }  
    this.current_view = "home"
    app_router.navigate("")
  },
  renderFlatPreview: function() {  
    var that = this; 
    if(this.current_view == "home") {
      that.slides_view.$el.fadeOut(function() {        
        that.flat_preview_view.render().$el.fadeIn()
      })      
    } else if (this.current_view == "printui") {
      that.print_ui_view.$el.fadeOut(function() {
        $('#background_container').fadeIn();
      })
    } else {
      this.step_view.render();
      $('#loading_main_page_spinner').hide();      
      that.flat_preview_view.render().$el.fadeIn()
    }
    this.current_view = "preview"
    app_router.navigate("preview_place_card")
  },
  renderPrintView: function() {
    var that = this;
    this.stopListening(thisProduct, 'change:colours');
    this.stopListening(thisProduct, 'change:font')
    if(!that.print_view_already_rendered) that.print_ui_view.render()
    $('#background_container').fadeOut(function() {    
      that.print_ui_view.$el.fadeIn(1000);                
      $('body').animate({
        scrollTop: $('body').offset().top
      }, 0);
    })    
    this.print_view_already_rendered = true;
    
    this.current_view = "printui"
    app_router.navigate("print")
  },
  loadFont: function(e, font) {
    this.$('.font_spinner').hide();
    this.$('.guest_name').show();
  },
  changeFont: function(e, font) {
    this.$('.font_spinner').show();
    this.$('.guest_name').hide()    
    thisProduct.set("font", font)
  }
})      