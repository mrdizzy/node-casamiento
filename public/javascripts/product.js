// Prevent the JavaScript template delimiters interfering with the node express delimiters
_.templateSettings = {
  interpolate : /\%\%(.+?)\%\%/g,
  evaluate: /\%\-(.+?)\-\%/g
};

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
      _.bindAll(this, 'renderQuantity','renderTotal', 'changeAttribute')
      this.model.on("change:quantity", this.renderQuantity) 
      this.model.on("change:total", this.renderTotal)         
    },
    el: $('#product_page'),
    events: {     
      "mouseenter .spc": "showTooltip",
      "mouseleave .spc": "closeTooltip",
     
      "mouseover .a_colour": "renderColour",
      "click .a_colour": "saveColour",
      
      "click .colour_index": "renderPalette",
      "click .colour_change": "changeColour",
      
      "click .selectable": "changeAttribute",  
    },
    showTooltip: function(e) {
      $(e.currentTarget).find('.step').fadeIn()
      $(e.currentTarget).find('.chat-bubble').slideDown()
    },
    closeTooltip: function(e) {  
      var step_container = $(e.currentTarget),
      id = step_container.attr('id').split("_")[1];
      if (id != this.step) {
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
    saveColour: function(e) {
      var colours = this.model.get("colours");
      colours[0] = $(e.currentTarget).data("colour");
      this.model.set("colours", colours);
      this.model.trigger("change:colour");
      this.$('.colour_selector').slideUp();
      if(this.step == 1) {
        this.step = 2;
        this.$('#step_1 .chat-bubble').slideUp();
        this.$('#step_2 .step').fadeIn()
        this.$('#step_2 .chat-bubble').slideDown();
      }
    },
    changeAttribute: function(e) {
      var currentTarget = $(e.currentTarget),
      attribute = currentTarget.data("attribute"),
      value = currentTarget.data("value")
      $(' .' + attribute).removeClass("selected")
      currentTarget.toggleClass("selected");  
      this.model.set(attribute, value)
      if(this.step == this.attribute_steps[attribute]) {
        console.log("yes")
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
    renderColour: function(e) {
      var currentTarget = $(e.currentTarget);
      var hex = currentTarget.data("colour");
      if(this.colourContext == 0) {
        this.$('.colour_0').css("background-color", hex)
      } else { 
        this.$('.colour_0 div div').css("background-color", hex)
        this.$('.colour_1').css("background-color", hex)
      }
    },
    changeColour: function(e) {
      var which = $(e.currentTarget).data("colour")
      this.colourContext = which;
      this.$('#colour_frame_' + which).fadeTo(0.2)
      this.$('.colour_selector').slideDown();         
    },
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