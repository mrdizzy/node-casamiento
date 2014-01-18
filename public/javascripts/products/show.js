// A generic presenter object for Backbone.Model
// =============================================

// presenter = new ModelPresenter({model: model});
var ProductPresenter = function(model, view) {
this.view = view;
  this.model = model; 
  this.chosenColour = ProductPresenter.chosenColour + 1;
  ProductPresenter.chosenColour = ProductPresenter.chosenColour + 1;
  this.pointer = 0;
  this.selectColour = false;
}
ProductPresenter.chosenColour = 0;
ProductPresenter.prototype = {
  hex: function() {
    return this.model.get("colour_" + this.chosenColour)
  },
  moveForward: function() {
    this.pointer = this.pointer + 1;
  },
  hoverColour: function() {
    this.fadeToggle = true;
    this.view.render();
  },  
  hoverOut: function() {
    this.fadeToggle = true;
    this.selectColour = true;
    this.view.render();
    this.fadeToggle = false;
    this.selectColour = false;
  },
  moveBackward: function() {
    this.pointer = this.pointer - 1;
  },
  currentGrid: function() {
    return coloursInGroupsOf16[this.pointer]
  }
};

var ColourView = Backbone.View.extend({
  initialize: function() {
    _.bindAll(this, 'render')
    this.presenter = new ProductPresenter(this.model, this)
  },
  events: {
    'mouseenter .visible_colours.big_colour_square_frame': function() {
      this.presenter.hoverColour();
    },
    'mouseleave .colour_alert_box': function() {
      this.presenter.hoverOut();
    },
    'mouseover .small_solid_colour_square': 'changeColour',    
    'click .small_solid_colour_square': 'fadeColour',
    'click .colour_index_right': 'moveRight',
    'click .colour_index_left': 'moveLeft',
  },
  changeColour: function(e) {
    var element = $(e.currentTarget);
    this.model.set("colour_1", element.css("background-color"))
  },
  moveLeft: function() {
    this.presenter.moveBackward();
    this.render();
  },
  moveRight: function() {
    this.presenter.moveForward();
    this.render();
  },
  render: function() {
    var template = $('#colour_label_view').html();
    var result = $(Handlebars.compile(template)(this.presenter));
    this.$el.html(result);
    if(this.presenter.fadeToggle) {
      this.$('.colour_alert_box').fadeToggle()
    }
    return this;
  }
})


// Models to hold colour palettes
var Colour = Backbone.Model.extend({});
var Colours = Backbone.Collection.extend({});

var Product = Backbone.Model.extend({
  initialize: function() {
      this.on("change:quantity", this.calculatePrice)
      this.on("change:texture", this.calculatePrice)
      this.on("change:weight", this.calculatePrice)
  },
  calculatePrice: function() {    
    var total = this.get("price") * this.get("quantity"),
      texture = this.get("texture"),
      weight = this.get("weight");
    if(weight == "300") {
      total = ((25/100) * total) + total 
    }
    if(texture == "hammered") {
      total = ((25/100) * total) + total
    } else if (texture == "linen") {
      total = ((25/100) * total) + total
    }
    var total = (total).toFixed(2)
    this.set("total", total)
  }
});

$(function(){
  // Positioning of fixed price/alert boxes
  var top = Math.max($(window).height() / 2 - $("#total_price")[0].offsetHeight / 2, 0);
  var left = Math.max($(window).width() / 2 - $("#total_price")[0].offsetWidth / 2, 0);
  $("#total_price").css('top', top + "px");
  $("#total_price").css('position', 'fixed');
        
  var ProductPageView = Backbone.View.extend({
    initialize: function() {
      this.step = 1;
      this.attribute_steps = { texture: 2, weight: 3, format: 4}
      _.bindAll(this, 'renderQuantity','renderTotal', 'changeAttribute','changeColour2', 'changeColour')
      this.model.on("change:quantity", this.renderQuantity) 
      this.model.on("change:colour_1", this.changeColour)
      
      this.model.on("change:colour_2", this.changeColour2)
      this.model.on("change:total", this.renderTotal)         
    },
    el: $('#product_page'),
    events: {     
      "mouseenter .spc": "showTooltip",
      "mouseleave .spc": "closeTooltip",
      
      "click .selectable": "changeAttribute",  
    },
    showTooltip: function(e) { 
      $(e.currentTarget).find('.step').fadeIn()
      $(e.currentTarget).find('.chat-bubble').slideDown()
    },
    closeTooltip: function(e) { 
      var id = $(e.currentTarget).attr('id')  
      var number = id.split("_")[1]
      if (number != this.step) {
        $(e.currentTarget).find('.step').fadeOut()
        $(e.currentTarget).find('.chat-bubble').slideUp()
      }
    },
    renderQuantity: function() {
      $('#qty').html(this.model.get("quantity"))
    },
    renderTotal: function() {
      var total = this.model.get("total"),
        ary = total.toString().split("."),
        pounds = ary[0],
        dec = ary[1];
      $('span#pound').text(pounds);
      $('span#decimal').text("." + dec);
    },    
    changeAttribute: function(e) {
      var currentTarget = $(e.currentTarget),
      attribute = currentTarget.data("attribute"),
      value = currentTarget.data("value")
      $(' .' + attribute).removeClass("selected")
      currentTarget.toggleClass("selected");  
      this.model.set(attribute, value)
      if(this.step == this.attribute_steps[attribute]) {
         this.$('#step_' + this.step + ' .chat-bubble').slideUp();
         
        this.$('#step_' + this.step + ' .step').fadeOut()
         this.step = this.step + 1;
        this.$('#step_' + this.step + ' .step').fadeIn()
        this.$('#step_'  + this.step + ' .chat-bubble').slideDown();
      }
    },
    renderPalette: function(e) {
      var which = $(e.currentTarget).data("colour")
      this.$('.palette').hide();          
      this.$('.' + which).show();
    },  
    changeColour: function() {
        this.$('.colour_1').css("background-color", this.model.get("colour_1"))
        this.$('.colour_label_1').css("background-color", this.model.get("colour_1"))
    },
    changeColour2: function() {
      this.$('.slide_background_container div').css("background-color", this.model.get("colour_2"))
        
        this.$('.colour_label_2').css("background-color", this.model.get("colour_2"))
        this.$('#color_label_2').text(this.model.get("colour_2"))
    }
  })
  
  var ppv= new ProductPageView({model: thisProduct})
  
// Calculate quantity
  $('#plus_qty').click(function(e) {
    var qty = thisProduct.get("quantity")
      thisProduct.set("quantity", qty + 5)
  })
    
  $('#minus_qty').click(function(e) {
    var qty = thisProduct.get("quantity")
    if(qty > 5) {
        thisProduct.set("quantity", qty - 5)
    }
  })
});
