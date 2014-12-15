var FlatPreviewView = Backbone.View.extend({
  el: '#flat_preview',
  initialize: function() {
    this.listenTo(view_coordinator, "change:view", this.changeView)
  },
  changeView: function() {
    alert(view_coordinator.previous("view"))  
    alert(view_coordinator.previous)
  },
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
    this.listenTo(thisProduct, "sync", this._renderColours)
    this.listenTo(thisProduct, 'change:font', this._renderPreviewAfterMain)
    this.listenTo(short_products, 'sync', this._renderBrowse)
    this.listenTo(thisProduct, 'reset', this.rerender)
  },
  rerender: function() {
    this.flat_preview_view.$el.hide()
    this.step_view.$el.hide();
    this.flat_preview_view.render().$el.fadeIn(1000);
    this.step_view.render().$el.fadeIn(1000);
  },
  events: {
    "click #print_button": "_renderPrintView",
    "click #browse": "browseDesigns",
    "fontpicker:selected": "changeFont",
    "fontpicker:fontloaded": "loadFont",
    "click #browse_designs .related": "selectModel"
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
  _renderColours: function() {      
  // Globally change colours according to those saved in localStorage
    $('.colour_0').css("background-color", thisProduct.get("colours")[0])   
    $('.colour_1').css("background-color", thisProduct.get("colours")[1])  
  },
  _renderPreviewAfterMain: function() {   
    this._renderColours();
    if(this.current_view == "home") this._renderPreview();
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
      
      if(this.current_view != "home") this.step_view.render();
      
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
      thisProduct.trigger("rerender")
    app_router.navigate("print")
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