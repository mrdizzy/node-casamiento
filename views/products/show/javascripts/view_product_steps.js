// STEP VIEW
////////////////////////////////////////////////////////////////////////////// 
var StepView = Backbone.View.extend({ 
  el: '.right_column',
  initialize: function() {
  this.changed_names = false;
    this.weights_reference = {2: "160", 3: "250", 4: "280"}
    this.listenTo(thisProduct, 'change:quantity', this._renderGuests)
    this.listenTo(thisProduct.get("guests"), 'change:name', this._renderQuickGuests)
    this.listenTo(thisProduct.get("guests"), 'remove', this._renderQuickGuests)
        this.listenTo(thisProduct.get("guests"), 'add', this._renderQuickGuests)
    this.listenToOnce(thisProduct, 'change:colours', this.changeStepToFont);   
    this.listenTo(thisProduct, 'change:font', this.changeStepToThickness);   
    this.listenToOnce(thisProduct, 'change:weight', this.changeStepToQuantity);   
    this.listenTo(thisProduct, 'change:weight',     this.renderWeight);
    this.listenToOnce(thisProduct, 'change:quantity', this.changeStepToNames);
    this.listenTo(thisProduct, "change:total", this.renderQtyAndPrice)
    this.current_step = 1;
  },
  events: {     
    "click .buy": "checkout",        
    "mouseenter .spc": "hoverOver",
    "mouseleave .spc": "hoverOut",     
    "click .texture": "updateTexture",  
    "blur #qty": "setQuantity",  
    "click #plus_qty": "plusQty",
    "click #minus_qty": "minusQty",
    "focus #qty": "clearQuantity",
    "click .weight": "updateWeight",
    "blur #quick_guests": "updateGuests"
  },
  changeStepToFont: function() {
    if (this.current_step < 2) this.current_step = 2;  
    this.changeStep();
  },
  changeStepToThickness: function() { 
    if (this.current_step < 4) this.current_step = 4;
    this.changeStep();
  },  
  changeStepToQuantity: function() { 
    if (this.current_step < 5) this.current_step = 5;
    this.changeStep();
  },  
  changeStepToNames: function() { 
    if (this.current_step < 6) this.current_step = 6;
    this.changeStep();
  },
  changeStep: function() {
      this.$('.step').css("background-color", "#BBB") 
      this.$('#step_' + this.current_step + " .step").addClass('colour_0')   
  },
  updateWeight: function(e) {   
    var weight_selected = $(e.currentTarget).index();
    weight_selected = this.weights_reference[weight_selected];
    thisProduct.set("weight", weight_selected);
  },
  renderWeight: function(e) {
    this.$('.weight').removeClass('selected').addClass('deselected');
    this.$('#weight_' + thisProduct.get("weight")).addClass("selected").removeClass('deselected')      
  },
  _renderQuickGuests: function() {
  console.log("deleted", thisProduct.get("guests").toJSON())
    this.$('#quick_guests').val(thisProduct.get("guests").pluck("name").join("\n"))
  },
  updateGuests: function() {
    this.changed_names = true;
    var guests = ($('#quick_guests').val());
    if (!($.trim(guests ) == '')) {
    if(guests.indexOf(',') === -1) { // Check how the names are delimited (comma or newline)
      guests = guests.split("\n")
    } else {
      guests = guests.split(",")
    }
   
    var names = _.map(guests, function(name) {
      name = $.trim(name);
      return {name: name}
    })   
    thisProduct.get("guests").reset(names)
    }
  },
  plusQty: function(e) {
    if(thisProduct.get("quantity") < 250) thisProduct.set("quantity", thisProduct.get("quantity") + 1)
  },
  minusQty: function(e) { 
    if ((thisProduct.get("quantity") - 1) > 0) {
    thisProduct.get("guests").pop()
    thisProduct.set("quantity", thisProduct.get("quantity") -1)
    }
  },
  clearQuantity: function(e) {
    $(e.currentTarget).val("")
  },
  setQuantity: function(e) {
    $field = $(e.currentTarget)
    var value = $field.val();
    value = parseInt(value)
    if(isNaN(value) || value == false || value < 1) {
      $field.val(thisProduct.get("quantity"))
    } else if (value > 250) {
                thisProduct.set("quantity",250)
                $field.val(250)
    } else {
       thisProduct.set("quantity",value)
    }    
  },  
  updateTexture: function(e) {
    var texture_selected = $(e.currentTarget)
    this.model.set("texture", texture_selected.index());
    this.$('.texture').removeClass("deselected");
    texture_selected.addClass("selected");
  },
  // We use the index of the div to toggle it (index is its place within the hierarchy of other siblings obtained by the jquery.index() function), this breaks easily if other divs are added between or before steps. The first sibling
  // element is actually the img of the name place icon so this counts as index 0, then the first step is index 1. 
  // If we were to move the img then the first step would be index 0 so this would break things. 
  hoverOver: function(e) {
    var step_index = $(e.currentTarget).index() - 1;
    this.$('#step_' + step_index + " .step").css("background-color", thisProduct.get("colours")[0])      
    this.$('#step_' + step_index).toggleClass('highlight')
    if(step_index == 3) {
        this.$('#print_button').css("background-color", thisProduct.get("colours")[0])
    }
  },
  hoverOut: function(e) {
    var step_index = $(e.currentTarget).index() - 1;
    if(step_index != this.current_step) this.$('#step_' + step_index + " .step").css("background-color", "#BBB") 
     if(step_index == 3) {
        this.$('#print_button').css("background-color", '#AAA')
    }
  },
  checkout: function() {
    $('.paypal_spinner').show();
    $('.buy').hide();
    thisProduct.makePurchase();
  },
  render: function() {    
    var json_product = thisProduct.toJSON();
    var guests = thisProduct.get("guests").pluck("name").join("\n")
    json_product.guests = guests;
    var $result = $(Handlebars.template(templates["products_show_step_through"])(json_product));         
    
    this.$el.html($result)
    this._renderGuests($result.find('#guests'));  // Input fields for guests
    var colours = thisProduct.get("colours");
    for(var i=0; i < colours.length; i++) {
      var $div = $('<div></div>')
      $result.find('#colour_section_render').append($div)
      
      $div.colorPicker({
        default_color: colours[i], 
        listen_to: thisProduct,
        index: i
      });
    }
    this.$('#fonts').fontPicker({
      fonts: casamiento_fonts, 
      selected_font: thisProduct.get("font")
    });  
    this.renderWeight();
    return this;
  },  
  renderQtyAndPrice: function() { 
    this.$('#qty').val(thisProduct.get("quantity"))   
    this.$('#pound').text(thisProduct.get("pounds"));
    this.$('#decimal').text("." + thisProduct.get("pence"));  
  },
  _renderGuests: function($element) {
    if ($element.set) $element = undefined;
    var $element = $element || this.$('#guests')
    var guests_html = thisProduct.get("guests").map(function(guest) {    
      return new GuestView({model:guest}).render().el;
    })
    $element.html(guests_html);    
    this.renderQtyAndPrice();
  }
})
