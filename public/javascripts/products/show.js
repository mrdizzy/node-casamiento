var Guest = Backbone.Model.extend({})
 
var Guests = Backbone.Collection.extend({
  model: Guest
})

var Product = Backbone.Model.extend({
  initialize: function() {
      this.on("change:quantity", this.calculatePrice)
      this.on("change:texture", this.calculatePrice)
      this.on("change:weight", this.calculatePrice)
  },
  applyDiscounts: function(total) {
    var qty = this.get("quantity"),
    discount = 0;
    if((qty > 32) && (qty < 96)) {
      discount = (10/100) * total
    }
    if((qty >95) && (qty < 152)) {
      discount = (15/100) * total
    }
    return discount;
  },
  calculatePrice: function() {   
    var qty = this.get("quantity"),
   total = this.get("price") * qty,
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
    var discount = this.applyDiscounts(total)
    total = total - discount;
    var unit_cost = (total/qty).toFixed(2);
    this.set("unit", unit_cost);
    total = unit_cost * qty;
    total = total.toFixed(2)
    this.set("total", total)
  }
});

var StepsPresenter = function(model, view) {
  this.view = view;
  this.model = model; 
  this.model.set("quantity", 8)
  this.model.set("guests", new Guests([{name: "David Pettifer"},{name: "Alicia Barnes"},{name: "Martin Visor"},{name: "Tania Smith"},{name: "Dr Alan McCarthy"},{name: "..."},{name: "..."},{name: "..."}]))
  this.quantity = 8
  this.currentStep = 1;
  this.hoveringStep = 0;
  this.name = this.model.get("name")
  this.changeTexture = false;
  this.textures = ["plain", "hammered", "linen"]
  this.renderPrice();
}

StepsPresenter.prototype = {
  moveStep: function() {
    this.show2D = false;
    this.toggleStepOff = this.currentStep;
    this.view.render();
    this.toggleStepOn = this.currentStep + 1;
    this.view.render();
    this.currentStep = this.currentStep + 1;
  },
  show2DView: function() {   
    this.show2D = true;
    this.view.render();
  },
  hoverStepOn: function(step_number) {
    if(this.currentStep == step_number) {
      return false
      } else {
        this.toggleStepOn = step_number;
        this.view.render();
      }
  },  
  hoverStepOff: function(step_number) {
      if(this.currentStep == step_number) {
      return false
      } else {
        this.toggleStepOff = step_number;
        this.view.render();
      }
  },
  renderPrice: function() {
    var total = thisProduct.get("total"),
    ary = total.toString()  .split(".");
    this.pounds = ary[0];
    this.dec = ary[1];
  },
  updateQty: function(number) {
    this.quantity = this.quantity + number;
    this.model.set("quantity", this.quantity)
    this.changeQty = true;
    var guests = this.model.get("guests")
    if(number > 0) {
      guests.add([{name: "..."}, {name: "..."},{name: "..."},{name: "..."},{name: "..."},{name: "..."},{name: "..."},{name: "..."}]) 
      }
    else {
      guests.splice(guests.length-8, 8)
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
  updateWeight: function(index) {
    this.model.set("weight", 200)
    this.changeWeight = index;
    this.view.render();
  },
  display_step_1: function() {
   if(this.currentStep == 1) {
     return("display:block;")
   }
  },
  guests: function() {
    return(this.model.get("guests").pluck("name"))
  }
}

var DownloadView = Backbone.View.extend({
  initialize: function() {
    this.toggleDownloadView = false;
    this.loadSVG = false;
  }
})

var GuestView = Backbone.View.extend({  
  events: {
    "blur input": 'updateGuest'
  },
  updateGuest: function() {
    this.model.set("name", this.$('input').val())
  },
  render: function() {
 
  this.$el.html('<input type="text" name="guest" value="' + this.model.get("name") + 'View"></input>')
  return this;
  }
})

var StepView = Backbone.View.extend({ 
  el: '#steps',
  initialize: function() {
    this.effectChanging = 0;
    this.currentStep = 0;
    _.bindAll(this, 'render')
    this.presenter = new StepsPresenter(thisProduct, this)
    this.listenTo(thisProduct, 'change:colour_1', this.changeColour)	
    this.listenTo(thisProduct, 'change:colour_2', this.changeColour2)
    var that = this;
    $('#add_another').click(function() {
      that.print();
    })
  },
  events: {     
    "click #buy": "checkout",        
    "mouseenter .spc": "hoverStepOn",
    "mouseleave .spc": "hoverStepOff",      
    "click .texture": "updateTexture",  
    "click .weight": "updateWeight",  
    "dizzy-cp:hoverColor #picker_1": "updateColour1",
    "dizzy-cp:hoverColor #picker_2": "updateColour2",
    "dizzy-cp:click #picker_1": "selectColour1",    
    "dizzy-cp:click #picker_2": "selectColour2",
    "click #plus_qty": "plusQty",
    "click #minus_qty": "minusQty"
  },
  print: function() {
    $('#print_spinner').fadeIn();
    $('#add_another').fadeOut();
    var images = $('img.place_card_image'),
      counter = images.length,
      i = 0,
      hex = thisProduct.get("colour_1").substring(1); // remove # from hexcode
    $('img.place_card_image').attr("src", "/svg/" + hex); // url to pull new svg image
    $('img.place_card_image').load(function() {
      i++;
      if(counter == i) {
        $('#print_box').fadeIn();        
        $('#print_spinner').fadeOut();
      }
    })
  },
  downloadView: function() {
    if(!this.show2DView) {
      this.presenter.show2DView();
      this.show2DView = true;
    }
  },
  checkout: function() {
    $.form('/payments', { 
      "L_PAYMENTREQUEST_0_AMT0": thisProduct.get("unit"), 
      "PAYMENTREQUEST_0_AMT": thisProduct.get("total"), 
      "L_PAYMENTREQUEST_0_QTY0": thisProduct.get("quantity"), 
      "L_PAYMENTREQUEST_0_NAME0": thisProduct.get("name"), 
      "L_PAYMENTREQUEST_0_DESC0": "Some description" 
    }).submit();
  },
  selectColour1: function(e, colour) {
    if(thisProduct.get("colours").length == 1) {
      this.presenter.moveStep()
    }
  },
  plusQty: function(e) {
    this.presenter.updateQty(8)
  },
  minusQty: function(e) {
    if(thisProduct.get("quantity") > 8) {
    this.presenter.updateQty(-8)
    }
  },
  updateTexture: function(e) {
      this.presenter.updateTexture($(e.currentTarget).index())
      if(this.presenter.currentStep < 3) {
        this.presenter.moveStep();
      }
  },
  updateWeight: function(e) {
    this.presenter.updateWeight($(e.currentTarget).index())
    if(this.presenter.currentStep < 4) {
      this.presenter.moveStep();
    }
  },
  hoverStepOn: function(e) {
    this.presenter.hoverStepOn($(e.currentTarget).index());  
  },
  hoverStepOff: function(e) {
    this.presenter.hoverStepOff($(e.currentTarget).index());   
  },
  updateColour1: function(e, colour) {
    this.downloadView();
    $('.colour_1').css("background-color", colour)
    $('.slide').css("background-color", colour)
     thisProduct.set("colour_1", colour)
  },
  updateColour2: function(e, colour) {    
    this.downloadView();
    $('.slide > div > div:not(.nocolor)').css("background-color", colour);
    thisProduct.set("colour_2", colour)
  },
  render: function() {
    if (this.presenter.show2D){
      $(document.body).animate({
        'scrollTop': $('#2Dview').offset().top
        }, 1, function() {  
          $('#image_container').hide(); // hide 3D slides  
          $('#svgs').show() // display 2D customise image 
      });
    } 
    else if(this.presenter.toggleStepOn) {
      this.$('#step_' + this.presenter.toggleStepOn + " .step").fadeIn()      
      this.$('#step_' + this.presenter.toggleStepOn + " .chat-bubble").slideDown()
      this.$('#step_' + this.presenter.toggleStepOn).addClass('highlight')
      this.presenter.toggleStepOn = false;
    } else if(this.presenter.toggleStepOff) {
      this.$('#step_' + this.presenter.toggleStepOff + " .step").fadeOut()      
      this.$('#step_' + this.presenter.toggleStepOff + " .chat-bubble").slideUp()
      this.$('#step_' + this.presenter.toggleStepOff).removeClass('highlight')
      this.presenter.toggleStepOff = false;
    } else if (this.presenter.changeTexture) { 
      this.$('.texture').removeClass("selected")
      var texture_changed = this.$('.texture').get(this.presenter.changeTexture) ;
      $(texture_changed).toggleClass("selected"); 
      this.presenter.changeTexture = false;
    } else if (this.presenter.changeQty) {      
      this.$('#qty').val(thisProduct.get("quantity"))
      this.$('span#pound').text(this.presenter.pounds);
      this.$('span#decimal').text("." + this.presenter.dec);
      var input_fields = []
      thisProduct.get("guests").forEach(function(guest) {
        input_fields.push(new GuestView({model:guest}).render().el)
      })
      this.$('#guests').html(input_fields)
    } else {
      var result = $(Handlebars.template(templates["products_show_step_through"])(this.presenter));
      var colours_1 = $("<div id='picker_1'></div>").colorPicker({colours_per_page:12, default_color: thisProduct.get("colours")[0]});
      if(thisProduct.get("colours")[1]) {
        var colours_2 =$("<div id='picker_2'></div>").colorPicker({colours_per_page:12, default_color: thisProduct.get("colours")[1]});
      }
      
      this.$el.html(result)
      
      thisProduct.get("guests").forEach(function(guest) {
        this.$('#guests').append(new GuestView({model:guest}).render().el);
      }, this)
      this.$('#colour_section_render').append(colours_1).append(colours_2);
    }
    return this;
  },
})