  // Takes care of rendering the sub views
  // It is important to make the divs that will contain the html 
  // of rendered views visible first, then add the html to them
  // as the widths of certain elements must be visible in order
  // to calculate dynamic widths (for the colour picker, for example)
  
  // #inner_page_container wraps everything including the header

var CoordinatorView = Backbone.View.extend({
  el: '#background_container',
  initialize: function() {
    this.current_view = "";
    this.first_render = true;
    this.step_view = new StepView(); 

    this.slides_view = new ProductSlideView();    
    this.flat_preview_view = new FlatPreviewView();
    this.print_ui_view = new PrintControlPanelView(); 
 //   this.listenTo(thisProduct, "sync", this._renderColours)
 
 //   this.listenTo(short_products, 'sync', this._renderBrowse)
 //   this.listenTo(thisProduct, 'reset', this.rerender)
  },
  events: {
   "click #print_button": "renderPrintView",
    "click #browse_designs .related": "selectModel",
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
    
    this.current_view = "printui"
    $('#background_container').fadeOut(function() {        
      that.print_ui_view.render().$el.fadeIn(1000);                
      $('body').animate({
        scrollTop: $('body').offset().top
      }, 0);
    })    
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
  },
  selectModel: function(e) {
    var id = $(e.currentTarget).attr('id');
    var model = short_products.get(id);
    $.updateFont(model.get("font"))
    thisProduct.unset("background-1").unset("background-2").unset("background-3").unset("background-4").unset("background-5")
    thisProduct.set(model.toJSON()).trigger("reset")
    thisProduct.get("guests").resetFont();
    this.$('#browse_designs').hide();
        $('body').animate({
        scrollTop: $('body').offset().top
      }, 0); 
      thisProduct.trigger("rerender")
  }
})      