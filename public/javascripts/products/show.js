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
      "hover_colour #picker_1": "updateColour1",
      "hover_colour #picker_2": "updateColour2"
    },
    updateTexture: function(e) {
        this.presenter.updateTexture($(e.currentTarget).index())
    },
    hoverStep: function(e) {
      this.presenter.hoverStep($(e.currentTarget).index());
    },
    updateColour1: function(e, colour) {
      thisProduct.set("colour_1", colour)
    },
    updateColour2: function(e, colour) {
      thisProduct.set("colour_2", colour)
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
      var colours_1 = $("<div id='picker_1'></div>").colorPicker({colours_per_page:12, default_color: thisProduct.get("colours")[0]});
      if(thisProduct.get("colours")[1]) {
        var colours_2 =$("<div id='picker_2'></div>").colorPicker({colours_per_page:12, default_color: thisProduct.get("colours")[1]});
      }
      this.$el.html(result)
      this.$('#colour_section_render').append(colours_1).append(colours_2);
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