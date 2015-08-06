var PrintAlertBoxView = Backbone.View.extend({
  el: '#ui_print_alert',
  initialize: function() {
    this.listenTo(thisProduct, "readyforprint", this.renderPrintDialog)
  },
  events:  {
    "click .layout_icon_container": "changeLayout",
    'click #print_now': "printNow",    
    "click #cutting_marks": "toggleCuttingMarks",
    "click .close": "closePrintAlert"
  },
  closePrintAlert: function() {
    $('#ui_print_alert').fadeOut();
    $('#ui_printer_icon').attr('src', "/gfx/printer_icon.svg")
  },
  renderPrintDialog: function() {
    $('#ui_print_alert').fadeIn();
    $('#ui_printer_icon').attr('src', "/gfx/printer_icon.svg")   
    
    $('#mobile_ui_printer_icon').attr('src', "/gfx/printer_icon.svg")    
    $('#step_print_spinner').hide();
    $('#print_button').show()
  },  
  printNow: function() {
    $('#ui_print_alert').hide();
    window.print()     
  },
  changeLayout: function(e) {
    var per_page = [8,3,4][$(e.currentTarget).index()]
    $('.layout_icon_container').removeClass('layout_selected');
    $(e.currentTarget).addClass('layout_selected')
    $("input[type=radio]").prop("checked", false)
    $("#radio_" + per_page).prop("checked", true)
    thisProduct.set("per_page", per_page)
  },    
  toggleCuttingMarks: function() {  thisProduct.toggleCuttingMarks(); },
})