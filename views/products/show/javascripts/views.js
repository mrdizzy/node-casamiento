// 
// GUEST VIEW
// 
var GuestView = Backbone.View.extend({  
  events: {
    "blur input": 'updateGuest',
    'focus input': 'clearGuest'
  },
  clearGuest: function() {
    if(!this.model.hasChanged("name")) 
      this.$('input').val("")      
  },
  updateGuest: function() {
    this.model.set("name", this.$('input').val())
  },
  render: function() { 
    this.$el.html('<input type="text" name="guest" value="' + this.model.get("name") + '"></input>')
    return this;
  }
})

// This view is a container for the individual place card views 
// At the  moment it re-renders every single place card when there is 
// an additional or removal from the collection
var PrintView = Backbone.View.extend({
  initialize: function() {
   // this.listenTo(thisProduct.get("guests"), 'add', this.render)    
    this.listenTo(thisProduct.get("guests"), 'remove', this.render)
  },
  render: function() {
    this.$el.empty();
    var guests = thisProduct.get("guests");
    guests.forEach(function(guest) {
   //   var place_card = new PlaceView({model: guest}).render().el
   //   this.$el.append(place_card);
    }, this)
    return this;          
  } 
})

// 
// PREVIEW VIEW
// 
var DownloadView = Backbone.View.extend({
  initialize: function() {
    this.listenTo(thisProduct, 'change:colour_1', this.activateView)
    this.listenTo(thisProduct, 'change:colour_2', this.activateView)
    this.listenTo(thisProduct, 'change:font', this.changeFont)    
  },
  events: {
    'click #plus_font': 'increaseFont',
    'click #minus_font': 'decreaseFont'
  },
  activateView: function() {
    if(!this.first_time) {
      $('#image_container').fadeOut(function() { // hide 3D slides  
        $('#svgs').fadeIn()// display 2D customise image 
        // Calculate font size relative to container
        location.hash = "2Dview"// jumps to <div id=foo> or <a name="foo">
        var fontSize = $(".front_place_card").width() * object_fonts[thisProduct.get("font")]; // 10% of container width
        $(".front_place_card").css('font-size', fontSize);
      }); 
      this.first_time = true;
    }
  },
  changeFont: function() {
    var font = thisProduct.get("font")
    appendFont(font);
    font_size = $(".front_place_card").width() * thisProduct.get("font_size"); 
    $('.guest').css('font-family', font)
    $('.front_place_card').css('font-size', font_size)
    this.activateView();
  },
  increaseFont: function() {
    this.adjustFontSize(5)
  },
  decreaseFont: function() {
   this.adjustFontSize(-5)
  },
  adjustFontSize: function(amount) {
    var font_size_no_units = $('.front_place_card').css('font-size').replace("px", "");
    font_size_no_units =  amount + parseInt(font_size_no_units);    
    var percentage_of_container_size = font_size_no_units / $('.front_place_card').width();
    thisProduct.set("font_size", percentage_of_container_size)
    $('.front_place_card').css('font-size',font_size_no_units + "px");
  },
  render: function() { 
    return this;
  }
})

// 
// STEP VIEW
// 
var StepView = Backbone.View.extend({ 
  el: '#steps',
  initialize: function() {
    _.bindAll(this, 'render')
    this.listenTo(thisProduct, 'change:colour_1', this.changeColour)	
    this.listenTo(thisProduct, 'change:colour_2', this.changeColour2)
  },
  events: {     
    "click #buy": "checkout",        
    "mouseenter .spc": "hoverStep",
    "mouseleave .spc": "hoverStep",     
    "click .texture": "updateTexture",  
    "click .weight": "updateWeight",  
    "fontpicker:selected": "changeFont",
    "dizzy-cp:hoverColor #picker_1": "updateColour1",
    "dizzy-cp:hoverColor #picker_2": "updateColour2",
    "dizzy-cp:click #picker_1": "selectColour1",    
    "dizzy-cp:click #picker_2": "selectColour2",
    "click #plus_qty": "plusQty",
    "click #minus_qty": "minusQty"
  },
  changeFont: function(e, font) {   
    thisProduct.set("font_size", font.font_size)
    thisProduct.set("font", font.font)
  },
  print: function() {
    $('#add_another').fadeOut(function() {
      $('#print_spinner').fadeIn()
    });
    
    var images = $('img.place_card_image'),
      counter = images.length,
      i = 0,
      hex = thisProduct.get("colours")[0].substring(1); // remove # from hexcode
    $('img.place_card_image').attr("src", "/svg/" + thisProduct.get("_id") + "/" + hex); // url to pull new svg image
    $('img.place_card_image').load(function() {
      i++;
      if(counter == i) {      
        $('#print_spinner').hide(function() {                 
          $('#print_box').fadeIn();  
        }); 
      }
    })
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
    if(thisProduct.get("colours").length == 1) 
      this.presenter.moveStep()
  },
  updateColour1: function(e, colour) {
    $('.colour_1').css("background-color", colour)
    $('.slide').css("background-color", colour)
    thisProduct.set("colour_1", colour)
  },
  updateColour2: function(e, colour) {    
    $('.slide > div > div:not(.nocolor)').css("background-color", colour);
    thisProduct.set("colour_2", colour)
  },
  plusQty: function(e) {
    this.updateQty(8)
  },
  minusQty: function(e) {
    if(thisProduct.get("quantity") > 8) 
      this.updateQty(-8)
  },
  updateQty: function(number) {
    var quantity = thisProduct.get("quantity") + number;
    thisProduct.set("quantity", quantity);
    var guests = thisProduct.get("guests")
    if(number > 0) {
      guests.add([{name: "..."}, {name: "..."},{name: "..."},{name: "..."},{name: "..."},{name: "..."},{name: "..."},{name: "..."}]) 
    } else {
      var silent = false;  
      for(var i =0;  i < 8; i++) {  
        if(i > 6) { silent = true; } 
        guests.pop({silent: silent});
      }
    }
    thisProduct.set("guests", guests);
    this.$('#qty').val(thisProduct.get("quantity"))
    this.$('span#pound').text(that.presenter().pounds());
    this.$('span#decimal').text("." + that.presenter().dec());
    this._renderGuests()
  },
  updateTexture: function(e) {
    var texture_selected = $(e.currentTarget)
    this.model.set("texture", texture_selected.index());
    this.$('.texture').removeClass("deselected");
    texture_selected.addClass("selected");
  },
  updateWeight: function(e) {
  },
  
  // We use the index of the div to toggle it (index is its place within the hierarchy of other siblings obtained by the jquery.index() function), this breaks easily if other divs are added between or before steps. The first sibling
  // element is actually the img of the name place icon so this counts as index 0, then the first step is index 1. 
  // If we were to move the img then the first step would be index 0 so this would break things. 
  hoverStep: function(e) {
    var step_index = $(e.currentTarget).index();
    this.$('#step_' + step_index + " .step").fadeToggle()      
    this.$('#step_' + step_index + " .chat-bubble").slideToggle()
    this.$('#step_' + step_index).toggleClass('highlight')
  },
  
  //
  // RENDER METHODS
  //
  render: function() {
    // Compile the steps template
    var $result = $(Handlebars.template(templates["products_show_step_through"])(this.presenter()));     
      
    // Create colour pickers and font pickers
    var colours_1 = $result.find("#picker_1").colorPicker({colours_per_page:12, default_color: thisProduct.get("colours")[0]});
    if(thisProduct.get("colours")[1]) {
      var colours_2 =$result.find('#picker_2').colorPicker({colours_per_page:12, default_color: thisProduct.get("colours")[1]});
    }
    
    // Create font picker
    $result.find('#fonts').fontPicker({fonts: casamiento_fonts, selected_font: thisProduct.get("font")});
    
    // Input fields for guests
    this._renderGuests($result.find('#guests'));
    
    $('.step').css("background-color", thisProduct.get("colours")[0]) // move to template
    this.$el.html($result)
    return this;
  },
  _renderGuests: function($element) {
    var $element = $element || this.$('#guests')
    var guests_html = []
    thisProduct.get("guests").forEach(function(guest) {    
      guests_html.push(new GuestView({model:guest}).render().el);
    })
    $element.html(guests_html);
  }, 
    
  presenter: function() {
    var productJSON = thisProduct.toJSON();
    var presented = _.extend(productJSON, {
      guests: function() {
        return(productJSON.guests.pluck("name"))
      },
      pounds: function() {
      console.log("Presenter", this)
        return productJSON.total.toString().split(".")[0]
      },
      dec: function() {
        return productJSON.total.toString().split(".")[1]
      }
    });
    return presented;
  }
})

var $head = $('head')
function appendFont(font) {
  $head.append("<style type='text/css'> @font-face { font-family:'" + font + "'; src: url('/fonts/"+ font + ".eot?') format('eot'), url('/fonts/" + font + ".woff') format('woff'); }</style>");
}