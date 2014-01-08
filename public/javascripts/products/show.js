// Prevent the JavaScript template delimiters interfering with the node express delimiters
_.templateSettings = {
  interpolate : /\%\%(.+?)\%\%/g,
  evaluate: /\%\-(.+?)\-\%/g
};

var ColourListView = Backbone.View.extend({
  initialize: function(options) {
    this.current_colour = options.current_colour
    this.grouped = inGroupsOf(json_colours, 16)
    this.pointer = 0;
    _.bindAll(this, 'render')
  },
  events: {
  'mouseover .small_solid_colour_square': 'changeColour',
    'click .colour_index_right': 'moveRight',
    'click .colour_index_left': 'moveLeft',
  },
  selectColour: function() {
    
  },
  changeColour:function(e) {
  var background = $(e.currentTarget).css("background-color")
    thisProduct.set("colour_" + this.current_colour, background);
  },
  moveRight: function() {
    this.pointer = this.pointer + 1;
    this.render();
  },
  moveLeft: function() {
    this.pointer = this.pointer - 1;
    this.render();
  },
  renderGrid: function() {
    var template = $('#actual_grid').html();
    var grid = $(Handlebars.compile(template)({colours: this.grouped[this.pointer]}));
    return grid;
  },
  render: function() {
    var template = $('#colour_grid').html();
    var result = $(Handlebars.compile(template)());
    this.$el.html(result)   
    this.$('.colour_grid_container').append(this.renderGrid())
    return this;
  }
})

var ColourLabelView = Backbone.View.extend({
  initialize: function(options) {
    this.collection = new Colours(json_colours)
    this.current_colour = options.current_colour;
    _.bindAll(this, 'render')
  },
  events: {
    'mouseenter .visible_colours.big_colour_square_frame': 'selectColour',    
    'mouseleave .colour_alert_box': 'fadeColour',
    
    'click .small_solid_colour_square': 'fadeColour'
          },
  selectColour: function() {
    this.$('.colour_alert_box').fadeIn()
  },
  fadeColour: function() {
    this.$('.colour_alert_box').fadeOut()
  },
  render: function() {
    var template = $('#colour_label_view').html();
    var result = $(Handlebars.compile(template)({colour: this.current_colour, hex: thisProduct.get("colour_" + this.current_colour)}));
    this.$el.html(result);
    
    var colour_grid = new ColourListView({collection: this.collection, current_colour: this.current_colour})
    var r = colour_grid.render().el;
    this.$('.colour_alert_box').append(r)
    return this;
  }
})
// The main container for the colour labels, is bound to the 
// #colour_section_render element
var ColourView = Backbone.View.extend({
  // colour_label_view
  initialize: function() {
    _.bindAll(this, 'render')
  },
  render: function() {
    var number_of_colours = this.model.get("number_of_colours");
    for(var i=0; i < number_of_colours; i++) {
      var colour_label_view = new ColourLabelView({current_colour: (i + 1), tagName: 'td', attributes: { style: "vertical-align:top;text-align:left;"}})
      
      this.$('#row').append(colour_label_view.render().el)
    }
  }
});

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
