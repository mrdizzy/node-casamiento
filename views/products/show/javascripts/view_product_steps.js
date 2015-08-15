// STEP VIEW
////////////////////////////////////////////////////////////////////////////// 
var StepView = Backbone.View.extend({ 
  el: '.right_column',
  initialize: function() {
    this.changed_names = false;
    this.weights_reference = {2: "200", 3: "300" } // number refers to position of element in HTML hierarchy
    this.listenTo(thisProduct.get("guests"), 'change', this._renderQuickGuests)
    this.listenTo(thisProduct.get("guests"), 'remove', this._renderQuickGuests)
    this.listenTo(thisProduct.get("guests"), 'add', this._renderQuickGuests)
    this.listenTo(thisProduct.get("guests"), 'addMultiple', this._renderQuickGuests)
    this.listenTo(thisProduct, 'change:weight', this.renderWeight);
    this.listenTo(thisProduct, "change:total", this.renderQtyAndPrice)
    this.current_step = 1;
  },
  events: {     
    "click .buy": "checkout",        
    "mouseenter .spc": "hoverOver",
    "mouseleave .spc": "hoverOut",     
    "click .texture": "updateTexture", 
    "click .weight": "updateWeight",
    "focus #quick_guests": "selectQuickGuests",    
    "blur #quick_guests": "hideQuickGuests",
    "click #quick_guests": "updateCaretAfterClick",
    "keyup #quick_guests": "newKeyPressGuests",
    "paste #quick_guests": "newKeyPressGuests"
  },
  // When the guests entry textarea is selected we add a class to the root element to enable us to detect that it 
  // has been focused and therefore make adjustments to the layout for mobile devices that do not have enough 
  // screen space when the onscreen keyboard appears
  selectQuickGuests: function() { 
    $('body').addClass("quick_guests_selected");
    if(casamiento_test_for_mobile) $('html,body').scrollTop($("#quick_guests").offset().top)
//    this.$('#quick_guests').focus();
  },
  hideQuickGuests: function() { 
    $('body').removeClass("quick_guests_selected");
    
  },
  // If you happen to click somewhere else on the textarea in the split second before rendering, this stops the caret from jumping to the previous location
  updateCaretAfterClick: function() { this.caret_position = this.$('#quick_guests')[0].selectionStart; },
  
  updateWeight: function(e) {   
    var weight_selected = $(e.currentTarget).index();
    weight_selected = this.weights_reference[weight_selected];
    thisProduct.set("weight", weight_selected);
  },
  renderWeight: function(e) {
    this.$('.weight').removeClass('selected').addClass('deselected');
    this.$('#weight_' + thisProduct.get("weight")).addClass("selected").removeClass('deselected')      
  },
  _renderQuickGuests: function() { this.$('#quick_guests').val(thisProduct.get("guests").pluck("name").join("\n")) },
  _renderCaret: function() {
    if(this.caret_position) {        
    setSelectionRange($('#quick_guests')[0], this.caret_position, this.caret_position);
    this.caret_position = undefined
   }  
  },
  newKeyPressGuests: _.debounce(function() {
    this.caret_position = this.$('#quick_guests')[0].selectionStart;
    this.changed_names = true;
    var guests = ($('#quick_guests').val());
    if (!($.trim(guests) == '')) {
      if(guests.indexOf(',') === -1) { // Check how the names are delimited (comma or newline)
        guests = guests.split("\n")
      } else {
        guests = guests.split(",")
      }
    
    var collection =  thisProduct.get("guests")
    var names = _.map(guests, function(name) {
      name = $.trim(name);
      return name;
    })   
collection.reset(_.map(guests, function(name) { return { name: name  }}))

    thisProduct.get("guests").trigger('waypoint')
   // var existing_length = collection.length;
   // var counter = 0;
   // 
   // if (names.length == existing_length) {
   //   collection.forEach(function(guest) {    
   //     guest.set("name", names[counter])
   //     counter = counter + 1;
   //   })
   // } else if (names.length > existing_length) {
     // collection.forEach(function(guest) {    
      //  guest.set("name", names[counter])
      // counter = counter + 1;
      //})
     // var new_models = [];
     // for(var i = counter; i < names.length; i++) {
     //   new_models.push({ name: names[i] });
     // }
     // collection.add(new_models, {silent:true});
   //   //collection.trigger("addMultiple", counter);
   //   collection.reset(_.map(guests, function(name) { return { name: name  }}))
   //   collection.trigger("waypoint")
   // } else if (names.length < existing_length) {
   // for(var i = counter; i < names.length; i++) {
   //     var guest = collection.at(i)
   //     guest.set({name: names[i]});
   //     counter= counter + 1;
   //   }
   //   var to_remove = [];
   //   for(var i = counter; i < existing_length; i++) {
   //   collection.pop()
   //   }
   // }
    }
    this._renderCaret();
  },500),
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
    this.renderQtyAndPrice();
    return this;
  },  
  renderQtyAndPrice: function() { 
    this.$('#qty').val(thisProduct.get("quantity"))   
    this.$('#pound').text(thisProduct.get("pounds"));
    this.$('#decimal').text("." + thisProduct.get("pence"));  
  }
})
