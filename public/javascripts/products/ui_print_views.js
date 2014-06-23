// This view is the user interface view for customising the place
// cards and uses the bitmap representations

var UIPlaceView = Backbone.View.extend({
  className: "ui_single_place_card_container",
  initialize: function() {
    this.first_clear = true;
    this.listenTo(this.model, 'change:name', this.render)	
  },
  events: {
    "focus input": 'clearGuest'
  },  
  clearGuest: function() {
    if(this.first_clear) {
      this.$('input').val("")      
      this.first_clear = false;
    }
  },
  render: function() {
    this.$el.html($('#ui_bitmap_place_card_template').html());
    // http://www.unitconversion.org/unit_converter/typography-ex.html
    var fontSize = 395 * 0.10; // 10% of container width
    this.$(".ui_half_container_guest").css('font-size', fontSize)
    
    this.$('.ui_half_container_guest input').val(this.model.get("name")).css("font-family", thisProduct.get("font"));
    this.$('.slide').css("background-color", thisProduct.get("colour_1"))
    this.$('.slide > div > div:not(.nocolor)').css("background-color", thisProduct.get("colour_2"));
    return this;
  }
})

var UIPrintView = Backbone.View.extend({
  initialize: function() {
    _.bindAll(this, 'render')
    this.klass = "up_8";    
    this.listenTo(thisProduct, 'change:font', this.render)
    this.listenTo(thisProduct.get("guests"), 'add', this.render)    
    this.listenTo(thisProduct.get("guests"), 'remove', this.render)
  },
  events: {    
    "fontpicker:selected": "changeFont",
    "click input[type=radio]": "changeLayout"
  },
  changeLayout: function(e) {
    var val = $(e.currentTarget).val()
    this.klass = "up_" + val;
    this.klassChanged = true;
    this.render();
  },
  changeFont: function(e, font) { 
    thisProduct.set("font", font)
  },
  render: function() {
    if(thisProduct.hasChanged("font")) {
      var font = thisProduct.get("font");
      appendFont(font);
      this.$('.ui_half_container_guest input').css('font-family', font)
    }
    if(this.klassChanged) {    
      this.$('#user_interface_print_view').attr("class", this.klass)
    } else {
      // We use the html of the element as the template is stored in a <script>
      // tag, therefore if we use the actual element it remains a <script> tag
      // and would be hidden from view! So we create a new element from the html
      // this is a bit of a hack and needs updating
      var $template = $($('#ui_view_template').html());
      var $container = $template.find('#user_interface_print_view');
      var guests = thisProduct.get("guests");
      var counter = 1;
      guests.forEach(function(guest) {
        var place_card = new UIPlaceView({model: guest}).render().el
        $container.append(place_card);
        if(counter == 3) {
          $container.append('<div style="border-top:1px dashed grey;clear:both" class="page_break_3"></div>')          
        } else if (counter == 4) {          
          $container.append('<div style="border-top:1px dashed grey;clear:both" class="page_break_4"></div>')
        } else if (counter == 8) {
          $container.append('<div style="border-top:1px dashed grey;clear:both" class="page_break_8"></div>')
          counter = 0;
        }        
        counter = counter + 1;
      }, this)
      this.$el.append($template)
      
      this.$('#ui_font_picker').fontPicker({fonts:casamiento_fonts})
    }
    return this;          
  } 
})
