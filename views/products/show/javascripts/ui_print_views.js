var PlaceCardView = GuestView.extend({
  initialize: function() {
    this.listenTo(thisProduct, 'change:font', this.changeFont) 
  },
    events: {
    'click .plus_font': 'increaseFont',
    'click .minus_font': 'decreaseFont'
  },  
  changeFont: function() {
    var font = thisProduct.get("font")
    this.font_as_percentage_of_container = this.options.width * thisProduct.get("font_size");     
    this.$('input').css('font-size', this.font_as_percentage_of_container +"px");
    this.$('input').css('font-family', font)
  },
  increaseFont: function() {
    this.adjustFontSize(5)
  },
  decreaseFont: function() {
   this.adjustFontSize(-5)
  },
  adjustFontSize: function(amount) {
    this.font_as_percentage_of_container =  amount + this.font_as_percentage_of_container;
    this.$('input').css("font-size", this.font_as_percentage_of_container+"px") 
  },
  render: function() {
    var that = this,
      width = this.options.width,
      height = 0.70714285714 * width,
      half_height = height / 2;
    this.font_as_percentage_of_container = width * object_fonts[thisProduct.get("font")]; 

    var compiled_template = Handlebars.template(templates["place_card"]);
    var $template = $(compiled_template({
      half_height:half_height, 
      font_family: thisProduct.get("font"),
      font_size: that.font_as_percentage_of_container,
      background: thisProduct.get("background-5"),
      height:height, 
      product: thisProduct.get("_id"),
      width: width, 
      units:"px"
    }));
    $template.find('.colour_1').css("background-color", thisProduct.get("colour_1"));
    
    $template.find('.colour_2').css("background-color", thisProduct.get("colour_2"))
    this.$el.html($template)
    return this;
  }
})

// This view is the user interface view for customising the place
// cards and uses the bitmap representations
var UIPrintView = Backbone.View.extend({
  initialize: function() {
    _.bindAll(this, 'render')
    this.klass = "up_8";    
    this.listenTo(thisProduct, 'change:font', this._renderFont)
   // this.listenTo(thisProduct.get("guests"), 'add', this.render)    
    //this.listenTo(thisProduct.get("guests"), 'remove', this.render)
  },
  events: {    
    "fontpicker:selected": "changeFont",
    "click input[type=radio]": "changeLayout"
  },
  changeLayout: function(e) {
    var val = $(e.currentTarget).val()
    this.$('#user_interface_print_view').attr("class", "up_" + val)
  },
  changeFont: function(e, font) { 
    thisProduct.set("font", font.font)
  },
  _renderFont: function() {
    var font = thisProduct.get("font");
    //appendFont(font);
    this.$('.ui_half_container_guest input').css("font-family", font);
  },
  render: function() {
    // We use the html of the element as the template is stored in a <script>
    // tag, therefore if we use the actual element it remains a <script> tag
    // and would be hidden from view! So we create a new element from the html
    // this is a bit of a hack and needs updating
    var width = $('#ui_ruler').width();
    var guests = thisProduct.get("guests");
    var place_cards = [];
    var counter = 1
    guests.forEach(function(guest) {
     var place_card = new PlaceCardView({model: guest, width: width}).render().el
     place_cards.push(place_card)
     //$container.append(place_card);
     //if(counter == 3) {
     //  $container.append('<div style="border-top:1px dashed grey;clear:both" class="page_break_3"></div>')          
     //} else if (counter == 4) {          
     //  $container.append('<div style="border-top:1px dashed grey;clear:both" class="page_break_4"></div>')
     //} else if (counter == 8) {
     //  $container.append('<div style="border-top:1px dashed grey;clear:both" class="page_break_8"></div>')
     //  counter = 0;
     //}        
      counter = counter + 1;
    }, this)
    
    this.$el.html(place_cards)
    return this;          
  } 
})
