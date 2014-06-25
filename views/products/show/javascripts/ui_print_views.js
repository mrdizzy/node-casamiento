// This view is the user interface view for customising the place
// cards and uses the bitmap representations
var UIPrintView = Backbone.View.extend({
  initialize: function() {
    _.bindAll(this, 'render')
    this.klass = "up_8";    
    this.listenTo(thisProduct, 'change:font', this.render)
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
    thisProduct.set("font", font)
  },
  render: function() {
    // We use the html of the element as the template is stored in a <script>
    // tag, therefore if we use the actual element it remains a <script> tag
    // and would be hidden from view! So we create a new element from the html
    // this is a bit of a hack and needs updating
    var $template = $(Handlebars.template(templates["user_interface_for_print"])());  
    var $container = $template.find('#user_interface_print_view');
    var guests = thisProduct.get("guests");
    var counter = 1
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
    
    // hardcoded width of place card container
    // using jQuery.width() will not work if display:none (element is hidden)
    var fontSize = 420 * thisProduct.get("font_size"); // percentage of container width
     
    $template.find(".ui_half_container_guest input").css('font-size', fontSize)
    $template.find('.ui_half_container_guest input').css("font-family", thisProduct.get("font"));
    $template.find('.slide').css("background-color", thisProduct.get("colour_1"))
    $template.find('.slide > div > div:not(.nocolor)').css("background-color", thisProduct.get("colour_2"));
    this.$el.append($template)   
    this.$('#ui_font_picker').fontPicker({fonts:casamiento_fonts})
    return this;          
  } 
})

var UIPlaceView = GuestView.extend({
  className: "ui_single_place_card_container",
  initialize: function() {
    this.listenTo(this.model, 'change:name', this.updateName)	
  },
  updateName: function() {
    this.$('input').val(this.model.get("name"))
  },
  render: function() {
    this.$el.html($(Handlebars.template(templates["bitmap_place_card"])(thisProduct.toJSON())));
    this.updateName();
    return this;
  }
})
