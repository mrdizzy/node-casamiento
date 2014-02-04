var ProductPresenter = function(model, view) {
  this.view = view;
  this.model = model; 
  this.chosenColour = ProductPresenter.chosenColour + 1;
  
  var currentColour = this.model.get("colour_" + this.chosenColour)
  ProductPresenter.chosenColour = ProductPresenter.chosenColour + 1;
  // Make sure the current grid shown is relative to the current hue
  for(var i = 0; i < coloursInGroupsOf16.length; i++) {
	var result = _.find(coloursInGroupsOf16[i], function(item) {
		return item == currentColour;
	})
	if(result) {
		this.pointer = i;
		break;
	}
  }
  this.selectColour = false;
}

// PRODUCT PRESENTER

ProductPresenter.chosenColour = 0;
ProductPresenter.prototype = {
  hex: function() {
    return this.model.get("colour_" + this.chosenColour)
  },
  movePointer: function(i) {
    this.pointer = this.pointer + i;
    this.selectColour = true;
    this.view.render();
  },
  hoverColour: function() {
    this.fadeToggle = true;
    this.view.render();
  },  
  currentGrid: function() {
    return coloursInGroupsOf16[this.pointer]
  },
  english_description: function() {
      return(hex_colours[this.model.get("colour_" + this.chosenColour)])
  },
  changeColour: function(index) {
  console.log(this.chosenColour)
    this.model.set("colour_" + this.chosenColour, coloursInGroupsOf16[this.pointer][index])
    this.colourChanged = true;
    this.view.render();
  }
};


// COLOUR VIEW

var ColourView = Backbone.View.extend({
  initialize: function() {
    _.bindAll(this, 'render')
    this.presenter = new ProductPresenter(this.model, this)
  },
  events: {
    'mouseenter .visible_colours.big_colour_square_frame': 'hoverColour',
    'mouseleave .colour_alert_box': 'hoverColour',
    'mouseenter .small_solid_square_frame': 'changeColour',    
    'click .small_solid_square_frame': 'selectColour',
    'click .colour_index_right': function() {
      this.presenter.movePointer(1)
    },
    'click .colour_index_left': function() {
      this.presenter.movePointer(-1)
    },
  },
  selectColour: function() {
  this.presenter.fadeToggle = false;
  this.render()
  },
  hoverColour: function() {
      this.presenter.hoverColour();
    },
  changeColour: function(e) {
    var element = $(e.currentTarget);
    var index = this.$('td.colour_grid_container div.small_solid_square_frame').index(element)
    this.presenter.changeColour(index)
  },
  render: function() {
    if(this.presenter.fadeToggle) {
      this.$('.colour_alert_box').fadeToggle()
      this.presenter.fadeToggle = false;
    } else if (this.presenter.colourChanged) {
      this.$('.big_colour_square').css("background-color", this.presenter.hex())
      this.$('.text_label_for_colour').html(this.presenter.english_description())
      this.presenter.colourChanged = false;
    }else {
      var result = $(Handlebars.template(templates["products_show"])(this.presenter));
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

var StepView = Backbone.View.extend({
  el: '#product_section0',
   initialize: function() {
    _.bindAll(this, 'render')
    this.presenter = new StepsPresenter(thisProduct, this)
    this.listenTo(thisProduct, 'change:colour_1', this.changeColour)
	
    this.listenTo(thisProduct, 'change:colour_2', this.changeColour2)
  },
  events: {     
      "mouseenter .spc": "hoverStep",
      "mouseleave .spc": "hoverStep",      
      "click .texture": "updateTexture",  
    },
    updateTexture: function(e) {
        this.presenter.updateTexture($(e.currentTarget).index())
    },
    hoverStep: function(e) {
      this.presenter.hoverStep($(e.currentTarget).index());
    },
  render: function() {
    if(this.presenter.toggleStep) {
      this.$('#step_' + this.presenter.toggleStep + " .step").fadeToggle()      
      this.$('#step_' + this.presenter.toggleStep + " .chat-bubble").slideToggle()
      this.presenter.toggleStep = false;
    } else if (this.presenter.changeTexture) { 
      this.$('.texture').removeClass("selected")
      var texture_changed = this.$('.texture').get(this.presenter.changeTexture) ;
      $(texture_changed).toggleClass("selected"); 
      this.presenter.changeTexture = false;
    } else {
      var result = $(Handlebars.template(templates["products_show_step_through"])(this.presenter));
      this.$el.html(result)
    }
    return this;
  },
  changeColour: function() {
      this.$('.colour_label_1').css("background-color", thisProduct.get("colour_1"))
      $('.colour_1').css("background-color", thisProduct.get("colour_1"))
  },
  changeColour2: function() {
    $('.slide_background_container div').css("background-color", thisProduct.get("colour_2"))
      $('.colour_label_2').css("background-color", thisProduct.get("colour_2"))
  }
})
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


var QuantityView = Backbone.View.extend({  
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
    }
})