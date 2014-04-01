var Product = Backbone.Model.extend({
  initialize: function() {
      this.on("change:quantity", this.calculatePrice)
      this.on("change:texture", this.calculatePrice)
      this.on("change:weight", this.calculatePrice)
  },
  calculatePrice: function() {    
  
      console.log(this.get("quantity"))
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
    this.model.set("quantity", 5)
    this.model.set("guests", ["...", "...", "...", "...", "..."])
    this.quantity = 5
  this.currentStep = 1;
  this.hoveringStep = 0;
  this.changeTexture = false;
  this.textures = ["plain", "hammered", "linen"]
  this.renderPrice();
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
  renderPrice: function() {
    var total = thisProduct.get("total"),
        ary = total.toString().split(".");
        this.pounds = ary[0];
        this.dec = ary[1];
  },
  updateQty: function(number) {
    this.quantity = this.quantity + number;
    this.model.set("quantity", this.quantity)
    this.changeQty = true;
    var guests = this.model.get("guests")
    if(number > 0) {
      guests.push("...", "...", "...", "...", "...") }
    else {
      guests.splice(guests.length-5, 5)
    }
    this.model.set("guests", guests)
    this.renderPrice();
    this.view.render();
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
      "dizzy-cp:hoverColor #picker_1": "updateColour1",
      "dizzy-cp:hoverColor #picker_2": "updateColour2",
      "click #plus_qty": "plusQty",
      "click #minus_qty": "minusQty"
    },
    plusQty: function(e) {
      this.presenter.updateQty(5)
    },
    minusQty: function(e) {
      this.presenter.updateQty(-5)
    },
    updateTexture: function(e) {
        this.presenter.updateTexture($(e.currentTarget).index())
    },
    hoverStep: function(e) {
      this.presenter.hoverStep($(e.currentTarget).index());
    },
    updateColour1: function(e, colour) {
      $('.colour_1').css("background-color", colour)
      $('.slide').css("background-color", colour)
    },
    updateColour2: function(e, colour) {    
      $('.slide > div > div:not(.nocolor)').css("background-color", colour);
      thisProduct.set("colour_2", colour)
    },
  render: function() {
    if(this.presenter.toggleStep) {
      this.$('#step_' + this.presenter.toggleStep + " .step").fadeToggle()      
      this.$('#step_' + this.presenter.toggleStep + " .chat-bubble").slideToggle()
      this.$('#step_' + this.presenter.toggleStep).toggleClass('highlight')
      this.presenter.toggleStep = false;
    } else if (this.presenter.changeTexture) { 
      this.$('.texture').removeClass("selected")
      var texture_changed = this.$('.texture').get(this.presenter.changeTexture) ;
      $(texture_changed).toggleClass("selected"); 
      this.presenter.changeTexture = false;
    } else if (this.presenter.changeQty) {      
        this.$('#qty').text(thisProduct.get("quantity"))
      this.$('span#pound').text(this.presenter.pounds);
      this.$('span#decimal').text("." + this.presenter.dec);
      var input_fields = []
      thisProduct.get("guests").forEach(function(guest) {
        input_fields.push($('<input type="text" name="guest" value="' + guest + '"></input>'))
      })
      this.$('#guests').html(input_fields)
    }else {
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
})