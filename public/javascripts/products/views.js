// 
// GUEST VIEW
// 
var GuestView = Backbone.View.extend({  
  initialize: function() {
    this.first_clear = true;
  },
  events: {
    "blur input": 'updateGuest',
    'focus input': 'clearGuest'
  },
  clearGuest: function() {
    if(this.first_clear) {
      this.$('input').val("")      
      this.first_clear = false;
    }
  },
  updateGuest: function() {
    this.model.set("name", this.$('input').val())
  },
  render: function() { 
    this.$el.html('<input type="text" name="guest" value="' + this.model.get("name") + '"></input>')
    return this;
  }
})

//
// PLACE CARDS FOR PRINT
//

// This view handles each individual place card for printing
var PlaceView = Backbone.View.extend({
  initialize: function() {
    this.listenTo(this.model, 'change:name', this.render)	
  },
  render: function() {
    this.$el.html($('#svg_place_card_template').html());
    // http://www.unitconversion.org/unit_converter/typography-ex.html
    var fontSize = 395 * 0.10; // 10% of container width
    this.$(".half_container").css('font-size', fontSize);
    this.$('.print_guest').text(this.model.get("name"))
    return this;
  }
})

// This view is a container for the individual place card views 
// At the  moment it re-renders every single place card when there is 
// an additional or removal from the collection
var PrintView = Backbone.View.extend({
  initialize: function() {
    this.listenTo(thisProduct.get("guests"), 'add', this.render)    
    this.listenTo(thisProduct.get("guests"), 'remove', this.render)
  },
  render: function() {
    this.$el.empty();
    var guests = thisProduct.get("guests");
    guests.forEach(function(guest) {
      var place_card = new PlaceView({model: guest}).render().el
      this.$el.append(place_card);
    }, this)
    return this;          
  } 
})

// 
// PREVIEW VIEW
// 
var DownloadView = Backbone.View.extend({
  events: {
    'click #plus_font': 'increaseFont',
    'click #minus_font': 'decreaseFont'
  },
  increaseFont: function() {
    var fontSize = $('.front_place_card').css('font-size').replace("px", "");
    fontSize =  5 + parseInt(fontSize);
    $('.front_place_card').css('font-size',fontSize + "px");
  },
  decreaseFont: function() {
    var fontSize = $('.front_place_card').css('font-size').replace("px", "");
    fontSize =  parseInt(fontSize) - 5;
    $('.front_place_card').css('font-size',fontSize + "px");
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
    this.print_view_off = true;
    this.presenter = new StepsPresenter(thisProduct, this)
    this.listenTo(thisProduct, 'change:colour_1', this.changeColour)	
    this.listenTo(thisProduct, 'change:colour_2', this.changeColour2)
    this.listenTo(thisProduct, 'change:font', this.render)

    var that = this;
    
    // Move these into a main control panel View. They are event listeners
    // for the buttons
    $('#print_button').click(function() {
      that.printYourself();
    })
    $('#customise_button').click(function() {
        that.downloadView();
    })
  },
  events: {     
    "click #buy": "checkout",        
    "mouseenter .spc": "hoverStepOn",
    "mouseleave .spc": "hoverStepOff",      
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
  printYourself: function(e) {
    if(this.print_view_off) {
      var print_view = new UIPrintView({}).render().el;
      $('body').html(print_view)
      this.print_view_off = false;
    }
  },
  changeFont: function(e, font) {   
    thisProduct.set("font_size", font.font_size)
    thisProduct.set("font", font.font)
    console.log(thisProduct.get("font_size"))
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
  downloadView: function() {
    if(!this.already_shown_2D) {
      this.render_2D_view = true;
      this.render();
      this.render_2D_view = false;
      this.already_shown_2D = true;
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
  
  // We use the index of the div to toggle it (index is its place within the hierarchy of other siblings obtained by the jquery.index() function), this breaks easily if other divs are added between or before steps. The first sibling
  // element is actually the img of the name place icon so this counts as index 0, then the first step is index 1. 
  // If we were to move the img then the first step would be index 0 so this would break things. 
  hoverStepOn: function(e) {
   this.presenter.hoverStepOn($(e.currentTarget).index());  
  },
  hoverStepOff: function(e) {
    this.presenter.hoverStepOff($(e.currentTarget).index());   
  },
  
  
  //
  // RENDER METHODS
  //
  render: function() {
    if(thisProduct.hasChanged("font")) {
      var font = thisProduct.get("font")
      appendFont(font);
      console.log(thisProduct.get("font_size"))
      font_size = $(".front_place_card").width() * thisProduct.get("font_size"); 
      
      $('.guest').css('font-family', font)
      $('.front_place_card').css('font-size', font_size)
    }
    if (this.render_2D_view)
      this._render2DPreview();
    else if(this.presenter.toggleStepOn) 
      this._renderEnterStep();
    else if(this.presenter.toggleStepOff)
      this._renderLeaveStep();
    else if (this.presenter.changeTexture)
     this._renderHighlightTexture();
    else if (this.presenter.changeQty)   
      this._renderQuantityChanged();
    else 
      this._renderFirstTime() 
    return this;
  },
  
  _renderFirstTime: function() {  
    // Compile the steps template
    var result = $(Handlebars.template(templates["products_show_step_through"])(this.presenter));     
      
    // Create colour pickers and font pickers
    var colours_1 = $("<div id='picker_1'></div>").colorPicker({colours_per_page:12, default_color: thisProduct.get("colours")[0]});
    if(thisProduct.get("colours")[1]) {
      var colours_2 =$("<div id='picker_2'></div>").colorPicker({colours_per_page:12, default_color: thisProduct.get("colours")[1]});
    }
    
    var $font_picker = $("<div id='font_picker_steps'></div>").fontPicker({fonts: casamiento_fonts});
    this.$el.html(result)
    
    // Input fields for guests
    thisProduct.get("guests").forEach(function(guest) {
      this.$('#guests').append(new GuestView({model:guest}).render().el);
    }, this)
    $('.step').css("background-color", thisProduct.get("colours")[0]) 
    this.$('#colour_section_render').append(colours_1).append(colours_2);
    this.$('#fonts').append($font_picker)
  },
    
  _render2DPreview: function() {
    $('#image_container').fadeOut(function() { // hide 3D slides  
      $('#svgs').fadeIn()// display 2D customise image 
      // Calculate font size relative to container
      $('#steps').fadeIn();
      location.hash = "2Dview"// jumps to <div id=foo> or <a name="foo">
      var fontSize = $(".front_place_card").width() * object_fonts[thisProduct.get("font")]; // 10% of container width
      $(".front_place_card").css('font-size', fontSize);
    }); 
  },  
  
  _renderEnterStep: function() {
    this.$('#step_' + this.presenter.toggleStepOn + " .step").fadeIn()      
    this.$('#step_' + this.presenter.toggleStepOn + " .chat-bubble").slideDown()
    this.$('#step_' + this.presenter.toggleStepOn).addClass('highlight')
    this.presenter.toggleStepOn = false;
  },  
  
  _renderLeaveStep: function() {    
      this.$('#step_' + this.presenter.toggleStepOff + " .step").fadeOut()      
      this.$('#step_' + this.presenter.toggleStepOff + " .chat-bubble").slideUp()
      this.$('#step_' + this.presenter.toggleStepOff).removeClass('highlight')
      this.presenter.toggleStepOff = false;
  },  
  
  _renderHighlightTexture: function() {
    this.$('.texture').removeClass("selected")
    var texture_changed = this.$('.texture').get(this.presenter.changeTexture) ;
    $(texture_changed).toggleClass("selected"); 
    this.presenter.changeTexture = false;
  },
  
  _renderQuantityChanged: function() {
    this.$('#qty').val(thisProduct.get("quantity"))
    this.$('span#pound').text(this.presenter.pounds);
    this.$('span#decimal').text("." + this.presenter.dec);
    var input_fields = []
    thisProduct.get("guests").forEach(function(guest) {
      input_fields.push(new GuestView({model:guest}).render().el)
    })
    this.$('#guests').html(input_fields)
  }
})

var $head = $('head')
function appendFont(font) {
  $head.append("<style type='text/css'> @font-face { font-family:'" + font + "'; src: url('/fonts/"+ font + ".eot?') format('eot'), url('/fonts/" + font + ".woff') format('woff'); }</style>");
}