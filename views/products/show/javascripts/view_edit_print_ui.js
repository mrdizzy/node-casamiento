var EditPrintControlPanelView = PrintControlPanelView.extend({
    render: function() {
        PrintControlPanelView.prototype.render.apply(this, arguments);
        
        var colours = thisProduct.get("colours");
        
        
        for(var i=0; i < colours.length; i++) {
          var $div = $('<div class="colour_picker_wrapper"></div>');
          $('#bar_colour_picker').append($div);
          $div.colorPicker({
            default_color: colours[i], 
            listen_to: thisProduct,
            index: i
          });
        }       
        this.$('#ui_font_picker').fontPicker({
          fonts: casamiento_fonts, 
          selected_font: thisProduct.get("font")
        }) 
   
    },
    
  events: {
    "fontpicker:selected": "changeFont",
    "fontpicker:fontloaded": "loadFont",
    "click #print_button": "printing",
    "click .global_baseline_up": "baselineUp",
    "click .global_baseline_down": "baselineDown",
    "click .global_font_increase": "fontIncrease",
    "click .global_font_decrease": "fontDecrease",
    "click .global_font_reset": "fontReset",
    "click #ui_printer_icon": "printPage",  
    "click #mobile_ui_printer_icon": "printPage"
  }, 
  loadFont: function(e, font) {
    this.$('.font_spinner').hide();
    this.$('.guest_name').show();
  },
  changeFont: function(e, font) {
    this.$('.font_spinner').show();
    this.$('.guest_name').hide()    
    thisProduct.set("font", font)
  }
})