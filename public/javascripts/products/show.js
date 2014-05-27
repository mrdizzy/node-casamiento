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
  this.model.set("guests", ["...", "...", "...", "...", "...", "...", "...", "..."])
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
    this.svgDownloaded = false;
    this.toggleStepOff = this.currentStep;
    this.view.render();
    this.toggleStepOn = this.currentStep + 1;
    this.view.render();
    this.currentStep = this.currentStep + 1;
  },
  toggleDownloadView: function() {
   
    var that = this;
    this.toggleDownload = true;
    if(!this.svgDownloaded) {
    
    $('.spinner').show();  
    
   $('#image_container').fadeToggle();
      this.svgDownloaded = true;
      this.svgNewlyDownloaded = true;
      $.get("/svg/" + thisProduct.get("_id"), function(data) {
      console.log("Downloaded SVG")
        thisProduct.set("svg", data)
        that.view.render();
      })
    } else {
      this.toggleDownload = true;
      that.view.render();
    }
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
      guests.push("...", "...", "...", "...", "...", "...", "...", "...") }
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
    return(this.model.get("guests"))
  }
}

var DownloadView = Backbone.View.extend({
  initialize: function() {
    this.toggleDownloadView = false;
    this.loadSVG = false;
  }
})

var StepView = Backbone.View.extend({ 
  el: '#steps',
  initialize: function() {
  this.effectChanging =0;
    this.currentStep = 0;
    _.bindAll(this, 'render')
    this.presenter = new StepsPresenter(thisProduct, this)
    this.listenTo(thisProduct, 'change:colour_1', this.changeColour)	
    this.listenTo(thisProduct, 'change:colour_2', this.changeColour2)
    var that = this;
    $('#add_another').click(function() {
      that.addAnother();
      })
       },
  events: {     
    "click #buy": "checkout",    
    'click #you_print': 'downloadView',
    'click #we_print': 'downloadView',
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
  addAnother: function() {
  console.log("add another")
    $( ".svg_parent").clone().appendTo( "#svgs" );
  },
    downloadView: function() {
    this.presenter.toggleDownloadView();
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
    $('.colour_1').css("background-color", colour)
    $('.slide').css("background-color", colour)
    $('[fill][class="colour0"]').attr('fill', colour)
         $('[stroke][class="colour0"]').attr('stroke', colour)
  },
  updateColour2: function(e, colour) {    
    $('.slide > div > div:not(.nocolor)').css("background-color", colour);
    
    $('[fill][class="colour1"]').attr('fill', colour)
         $('[stroke][class="colour1"]').attr('stroke', colour)
    thisProduct.set("colour_2", colour)
  },
  render: function() {
  
    if(this.presenter.svgNewlyDownloaded) {  
      this.presenter.toggleDownload = false; 
      $('.spinner').hide();      
      $('.svg-container').html(thisProduct.get("svg"))
      
      $('.svg_parent').fadeIn();
      $('[fill=#FF0000]').attr('fill', thisProduct.get("colours")[0]).attr('class', 'colour0')
      $('[stroke=#FF0000]').attr('stroke', thisProduct.get("colours")[0]).attr('class', 'colour0')
      $('[fill=#0000FF]').attr('fill', thisProduct.get("colours")[1]).attr('class', 'colour1')
      $('[stroke=#0000FF]').attr('stroke', thisProduct.get("colours")[1]).attr('class', 'colour1')
      this.presenter.svgNewlyDownloaded = false;
    } else if (this.presenter.toggleDownload){
    console.log("Fade svg")
      $('.svg_parent').fadeToggle()
      $('#image_container').fadeToggle();
      this.presenter.toggleDownload = false;
    
    }
    if(this.presenter.toggleStepOn) {
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
        input_fields.push($('<input type="text" name="guest" value="' + guest + '"></input>'))
      })
      this.$('#guests').html(input_fields)
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
})