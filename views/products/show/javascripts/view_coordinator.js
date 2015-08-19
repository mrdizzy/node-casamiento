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
    this.print_ui_view = new PrintControlPanelView(); 
    this.first_print_render = true;    
  },
  events: {
    "fontpicker:selected": "changeFont",
    "fontpicker:fontloaded": "loadFont",
    "click #print_button": "printing"
  },
  printing: function() {
    $('#step_print_spinner').show();
    $('#print_button').hide()
    this.print_ui_view.printPage();
  },
  // This is the default home view that is always rendered when the URL has no hashtags appended
  // the print UI view is automatically rendered by resetting the guests, even though it 
  // is not displayed
  renderHome: function() {  

    this.listenToOnce(thisProduct, 'change:colours', this.renderFlatPreview)   
    this.listenToOnce(thisProduct, 'change:font', this.renderFlatPreview)
    var that = this;
    if(this.first_render) $('#loading_main_page_spinner').hide();
    if(this.current_view == "printui") {
      this.print_ui_view.$el.fadeOut(function() { that.slides_view.$el.fadeIn(); })      
    } else {
      that.slides_view.render().$el.fadeIn();  
      this.step_view.render();
      this.first_render = false; 
    }  
    this.current_view = "home"
    app_router.navigate("")    
    window.scrollTo(0,0);
  },  
  renderFlatPreview: function() {
    var that = this,
      previous_body_width = $('body').width();

    this.stopListening(thisProduct, 'change:colours');
    this.stopListening(thisProduct, 'change:font')
    if(this.current_view == "home") { // If we are on the products slides page
      that.slides_view.$el.fadeOut(function() {       
        that.print_ui_view.$el.show(); 
        
        if(that.print_ui_view.$el.is(':empty')) that.print_ui_view.render();
        thisProduct.trigger("redraw").trigger("change:font")
        that.print_ui_view._createMainWaypoint();
        that.current_view = "printui"        
        $('body').addClass("printui_view")       
        window.scrollTo(0,0);
        $(window).on("resize", _.bind(function() {
          if(previous_body_width != $('body').width()) {
            window.scrollTo(0,0);
            that.print_ui_view.renderAndCreateWaypoint();
            previous_body_width = $('body').width();
          }
        }))
        
      })
    } 
    $('#loading_main_page_spinner').hide(); 
 
    $('#print_now').click(function()  { that.print_ui_view.printNow(); })
   
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