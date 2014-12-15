  // Takes care of rendering the sub views
  // It is important to make the divs that will contain the html 
  // of rendered views visible first, then add the html to them
  // as the widths of certain elements must be visible in order
  // to calculate dynamic widths (for the colour picker, for example)
  
  // #inner_page_container wraps everything including the header

var CoordinatorView = Backbone.View.extend({
  el: '#inner_page_container',
  initialize: function() {
    this.first_render = true;
    this.step_view = new StepView(); 

    this.slides_view = new ProductSlideView();    
    this.flat_preview_view = new FlatPreviewView();
    this.print_ui_view = new PrintControlPanelView();
    this.listenToOnce(thisProduct, 'change:colours', this.renderFlatPreview)    
 //   this.listenTo(thisProduct, "sync", this._renderColours)
    this.listenTo(thisProduct, 'change:font', this.renderFlatPreview)
 //   this.listenTo(short_products, 'sync', this._renderBrowse)
 //   this.listenTo(thisProduct, 'reset', this.rerender)
  },
  events: {
   "click #print_button": "renderPrintView",
    "click #browse": "browseDesigns",
    "click #browse_designs .related": "selectModel",
    "fontpicker:selected": "changeFont",
    "fontpicker:fontloaded": "loadFont",
  },
  renderHome: function() {
  var that = this;
    if(this.first_render) $('#loading_main_page_spinner').hide();
    this.flat_preview_view.$el.fadeOut(function() {
        
    that.slides_view.render().$el.fadeIn();  
    });
    this.step_view.render();
    this.first_render = false;
  },
  renderFlatPreviewFromScratch: function() {    
    if(!this.first_render) {
        $('#print_ui').fadeOut();
    }
    this.flat_preview_view.render()
    $('#inner_page_container').fadeIn();
    
  },
  renderFlatPreview: function() {   
    var that = this;
    this.slides_view.$el.fadeOut(function() {
        
    that.flat_preview_view.render().$el.fadeIn();
    });  
    app_router.navigate("preview_place_card")
  },
  renderPrintView: function() {
    var that = this;
    $('#inner_page_container').fadeOut(function() {
        
    that.print_ui_view.render().$el.fadeIn(1000);                
      $('body').animate({
        scrollTop: $('body').offset().top
      }, 0);
     // app_router.navigate("print")
    })
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
  },
  browseDesigns: function() {
    short_products.fetch();
  },
  _renderBrowse: function() {   
    var groups = inGroupsOf(short_products.browsePresenter(), 11);
    groups = _.map(groups, function(group) {
      return inGroupsOf(group, 6);
    });
    var $template = $(Handlebars.template(templates["browse"])({
      groups: groups
    })); 
       
    this.$('#browse_designs').html($template)  
    this.$('.place_square').mouseover(function() {
      $(".inner_place_square", this).hide();
      $(".inner_place_square_hidden",this).show();
    })

    this.$('.place_square').mouseout(function() {
      $(".inner_place_square", this).show();
      $(".inner_place_square_hidden",this).hide();
    })
      
    this.flat_preview_view.$el.hide()
    this.$('#product_container').hide()
    this.step_view.$el.hide();
    this.$('#browse_designs').fadeIn(750);    
  }
})      