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
    
    $(window).bind("scroll", _.bind(this._bindScroll, this));
  },

 _loadMore: function() {
   this.print_ui_view.renderMore();
     $(window).bind("scroll", _.bind(this._bindScroll, this));
 },

 _bindScroll: function(){
   
    if(this.current_view == "printui") {
     if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
       $(window).unbind('scroll');
     this. _loadMore();
     }
   }
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
  renderHome: function() {  
    this.listenToOnce(thisProduct, 'change:colours', this.renderFlatPreview)   
    this.listenToOnce(thisProduct, 'change:font', this.renderFlatPreview)
    var that = this;
    if(this.first_render) $('#loading_main_page_spinner').hide();
    if(this.current_view == "printui") {
      this.print_ui_view.$el.fadeOut(function() { that.slides_view.$el.fadeIn(); })      
    } else {
      this.step_view.render();
      that.slides_view.render().$el.fadeIn();  
      this.first_render = false;       
      
   this.print_ui_view.render();
    }  
    this.current_view = "home"
    app_router.navigate("")    
    window.scrollTo(0,0);
  },
  
  _calculateSpaceForFixedPosition: function() {
    if(casamiento_test_for_mobile) { 
      var upper_place_card_space = ((70.714285714285714285714285714286/100) * ((95/100) * $('body').width()))
      var header_space = 35;
      var window_height = $(window).height();
      //$('.right_column').css("height", (window_height - header_space - upper_place_card_space))
    }
  },
  renderFlatPreview: function() {
    var that = this;   
    
    this.stopListening(thisProduct, 'change:colours');
    this.stopListening(thisProduct, 'change:font')
    if(this.current_view == "home") { // If we are on the products slides page
      that.slides_view.$el.fadeOut(function() {        
        that.print_ui_view.$el.show();
        $(window).trigger("resize")
        that.current_view = "printui"        
        $('body').addClass("printui_view")       
        that._calculateSpaceForFixedPosition()
        window.scrollTo(0,0);
      })      
    } 
    this._calculateSpaceForFixedPosition()
    that.step_view.render();
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