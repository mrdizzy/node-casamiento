// STEP VIEW
////////////////////////////////////////////////////////////////////////////// 
var StepView = Backbone.View.extend({ 
  el: '.right_column',
  initialize: function() {
    this.guests = thisProduct.get("guests");
    this.weights_reference =  {2: "200", 3: "300" } // number refers to position of element in HTML hierarchy
    this.listenTo(this.guests, 'change', this._renderQuickGuests)
    this.listenTo(this.guests, 'destroy', this._renderQuickGuests)
    this.listenTo(thisProduct, 'change:weight', this.renderWeight);
    this.listenTo(thisProduct, 'change:weight', this.renderQtyAndPrice);
    this.listenTo(this.guests, "add", this.renderQtyAndPrice)
    this.listenTo(this.guests, "remove", this.renderQtyAndPrice)
    this.listenTo(this.guests, "removeMultiple", this.renderQtyAndPrice)
    this.listenTo(this.guests, "addMultiple", this.renderQtyAndPrice)
    this.listenTo(this.guests, "reset", this.renderQtyAndPrice)
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
    "keyup #quick_guests": "newKeyPressGuests",
    "paste #quick_guests": "newKeyPressGuests"
  },
  // When the guests entry textarea is selected we add a class to the root element to enable us to detect that it 
  // has been focused and therefore make adjustments to the layout for mobile devices that do not have enough 
  // screen space when the onscreen keyboard appears
  selectQuickGuests: function() { 
    $('body').addClass("quick_guests_selected");
    if(casamiento_test_for_mobile) $('html,body').scrollTop($("#quick_guests").offset().top)
  },
  hideQuickGuests: function() { $('body').removeClass("quick_guests_selected"); },
  _renderQuickGuests: function() { this.$('#quick_guests').val(this.guests.pluck("name").join("\n")) },
  
  updateWeight: function(e) {   
    var weight_selected = $(e.currentTarget).index();
    weight_selected = this.weights_reference[weight_selected];
    thisProduct.set("weight", weight_selected);
  },
  renderWeight: function(e) {
    this.$('.weight').removeClass('selected').addClass('deselected');
    this.$('#weight_' + thisProduct.get("weight")).addClass("selected").removeClass('deselected')      
  },
  newKeyPressGuests: _.debounce(function() {
    var guests = ($('#quick_guests').val());
    
    if (!($.trim(guests) == '')) { // Only run this code if the textarea isn't blank!
      
    //Change this to check for more than one comma on the same line in order to determine delimiter with more accuracy
      if(guests.indexOf(',') === -1) { // Check how the names are delimited (comma or newline)
        guests = guests.split("\n")
      } else {
        guests = guests.split(",")
      }
    
      var names_from_textarea = _.map(guests, function(name) {
        name = $.trim(name);
        return name;
      })   

      var existing_length = this.guests.length;
      var counter = 0;
    
      // SAME number of names in textarea and existing collection
      if (names_from_textarea.length == existing_length) {
        this.guests.forEach(function(guest) {    
          guest.set("name", names_from_textarea[counter])
          counter = counter + 1;
        })
      
      // MORE names in textarea than in existing collection
      } else if (names_from_textarea.length > existing_length) {
        this.guests.forEach(function(guest) {    
          guest.set("name", names_from_textarea[counter], {silent:true}).trigger("changeWithoutAffectingTextarea")
          counter = counter + 1;
        })
        var new_models = [];
        for(var i = counter; i < names_from_textarea.length; i++) {
          new_models.push({ name: names_from_textarea[i],
          font_size: thisProduct.get("global_font_size") || thisProduct.get("font_size"),
            baseline: thisProduct.globalBaseline()
          });
        }
        this.guests.add(new_models, { silent:true });
        this.guests.trigger("addMultiple", counter)
      
      // LESS names in textarea than in existing collection
      } else if (names_from_textarea.length < existing_length) {
        var number_removed = 0;
        for(var i = counter; i < names_from_textarea.length; i++) {
          var guest = this.guests.at(i)
          guest.set({name: names_from_textarea[i]}, {silent:true});
          counter = counter + 1;
        }
        var to_remove = [];
        for(var i = counter; i < existing_length; i++) {
          var model = this.guests.pop({silent:true})
          model.trigger("removeWithoutAffectingTextarea")
          number_removed = number_removed - 1;
        }
        this.guests.trigger("removeMultiple", number_removed)
        this.guests.trigger("renderNames")
      }
    }
    thisProduct.saveGuests()
  },750),
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
    json_product.guests = this.guests.pluck("name").join("\n");
    json_product.quantity = thisProduct.quantity();
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
    $('.qty').text(thisProduct.quantity())   
    $('.pound').text(thisProduct.get("pounds"));
    $('.decimal').text("." + thisProduct.get("pence"));  
  }
})
