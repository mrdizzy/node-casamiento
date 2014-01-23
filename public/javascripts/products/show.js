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
  movePointer: function(i) {
    this.pointer = this.pointer + i;
    this.view.render();
  },
  hoverColour: function() {
    this.fadeToggle = true;
    this.view.render();
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
    'mouseenter .visible_colours.big_colour_square_frame': 'hoverColour',
    'mouseleave .colour_alert_box': 'hoverColour',
    'mouseover .small_solid_colour_square': 'changeColour',    
    'click .small_solid_colour_square': 'hoverColour',
    'click .colour_index_right': function() {
      this.presenter.movePointer(1)
    },
    'click .colour_index_left': function() {
      this.presenter.movePointer(-1)
    },
  },
  hoverColour: function() {
      this.presenter.hoverColour();
    },
  changeColour: function(e) {
    var element = $(e.currentTarget);
    this.model.set("colour_1", element.css("background-color"))
  },
  render: function() {
    if(this.presenter.fadeToggle) {
      this.$('.colour_alert_box').fadeToggle()
      this.presenter.fadeToggle = false;
    } else {
      var template = $('#colour_label_view').html();
      var result = $(Handlebars.compile(template)(this.presenter));
      this.$el.html(result);
    }
    return this;
  }
})

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

var StepsPresenter = function(model, view) {
  this.view = view;
  this.model = model; 
  this.currentStep = 1;
  this.hoveringStep = 0;
  this.changeTexture = false;
  this.textures = ["plain", "hammered", "linen"]
}

StepsPresenter.prototype = {
  hoverStep: function(step_number) {
    if(this.currentStep == step_number) {
      return false
      } else {
        this.toggleStep = step_number;
        this.view.render();
      }
  },
  updateTexture: function(index) {
    this.model.set("texture", this.textures[index])
    this.changeTexture = index;
    this.view.render();
  },
  display_step_1: function() {
   if(this.currentStep == 1) {
     return("display:block;")
   }
  },
  guests: function() {
    return(this.model.get("guests"))
  }
}

$(function(){
  // Positioning of fixed price/alert boxes
  var top = Math.max($(window).height() / 2 - $("#total_price")[0].offsetHeight / 2, 0);
  var left = Math.max($(window).width() / 2 - $("#total_price")[0].offsetWidth / 2, 0);
  $("#total_price").css('top', top + "px");
  $("#total_price").css('position', 'fixed');
  
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
