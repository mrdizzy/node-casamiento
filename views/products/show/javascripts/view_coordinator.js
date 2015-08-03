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
  renderHome: function() {  
    this.listenToOnce(thisProduct, 'change:colours', this.renderFlatPreview)   
    this.listenToOnce(thisProduct, 'change:font', this.renderFlatPreview)
    var that = this;
    if(this.first_render) $('#loading_main_page_spinner').hide();
    if(this.current_view == "printui") {
      this.print_ui_view.$el.fadeOut(function() {
        that.slides_view.$el.fadeIn();
      })
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
    
    this.stopListening(thisProduct, 'change:colours');
    this.stopListening(thisProduct, 'change:font')
    if(this.current_view == "home") { // If we are on the products slides page
      that.slides_view.$el.fadeOut(function() {        
        that.print_ui_view.render().$el.fadeIn(1000);   
        that.current_view = "printui"        
        $('body').addClass("printui_view")
        if (that.print_ui_view.mobile) {       
          var mobile_split_div_height = $('.place_card_view').height() + $('#control_panel').height();
          $('.left_column').height(mobile_split_div_height)
          $('#mobile_spacer').height(mobile_split_div_height)
        } else {
          var header_height = $('#header_wrapper').height();
          var viewport_height = $(window).height()

      $('#preview').height(viewport_height-header_height)
        }
     window.scrollTo(0,0);
    })      
    } else if (that.current_view == "printui") {    
      that.print_ui_view.$el.fadeOut(function() {
      that.slides_view.$el.fadeIn();
      })
    } else {
    $('body').addClass("printui_view")
      that.step_view.render();
      $('#loading_main_page_spinner').hide();
      that.print_ui_view.render().$el.show()
      if (that.print_ui_view.mobile) {
      
        var mobile_split_div_height = $('.place_card_view').height() + $('#control_panel').height();
        $('.left_column').height(mobile_split_div_height)
        $('#mobile_spacer').height(mobile_split_div_height)
       
    }
    else {
       var header_height = $('#header_wrapper').height();
      var viewport_height = $(window).height()
      $('#preview').height(viewport_height-header_height)     
    }
    
    $(window).trigger("resize")
    }
    $(window).on("resize", function() {
      if(that.current_view == "printui") {
         var header_height = $('#header_wrapper').height();
          var viewport_height = $(window).height()

      $('#preview').height(viewport_height-header_height)
      }
    }); 
    $('#print_now').click(function() {
      that.print_ui_view.printNow();
    })
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