var FlatPreviewView = Backbone.View.extend({
  el: '#flat_preview',
  initialize: function() {
    this.listenTo(view_coordinator, "change:view", this.changeView)
    this.listenTo(thisProduct, "change:colours", this.renderViewOnColourOrFontChange)
        this.listenTo(thisProduct, "change:font", this.renderViewOnColourOrFontChange)
  },
  renderViewOnColourOrFontChange: function() {
    if(view_coordinator.previous("view") != "preview") {
      view_coordinator.set("view", "preview")
      this.render();
      this.$el.fadeIn(2000)
    }
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
    this.listenTo(view_coordinator, "change:view", this.changeView) 
//    this.listenTo(thisProduct, 'change:colours', this._renderPreviewAfterMain)    
 //   this.listenTo(thisProduct, "sync", thioms._renderColours)
 //   this.listenTo(thisProduct, 'change:font', this._renderPreviewAfterMain)
 //   this.listenTo(short_products, 'sync', this._renderBrowse)
 //   this.listenTo(thisProduct, 'reset', this.rerender)
  },
  changeView: function() {
    if(view_coordinator.get("view") == "print") {           
       $('#inner_page_container').hide();
    } else if(view_coordinator.get("view") == "home") {
       $('#inner_page_container').fadeIn(1000);
    }
  },
  events: {
    "click #print_button": "renderPrintView",
    "click #browse": "browseDesigns",
    "fontpicker:selected": "changeFont",
    "fontpicker:fontloaded": "loadFont",
    "click #browse_designs .related": "selectModel"
  },
  renderPrintView: function() {
    view_coordinator.set("view", "print")  
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