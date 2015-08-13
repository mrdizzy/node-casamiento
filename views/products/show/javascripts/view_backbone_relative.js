// This View class contains some utility methods which other views can 
// inherit. It is important that child classes which override the initialize
// method call BackboneRelativeView.prototype.initialize.apply(this) in order
// to initialize the utility functions
var BackboneRelativeView = Backbone.View.extend({
  initialize: function() {
    this.print_ui_el = $('#print_ui');
   this.calculateWidth();
    $(window).on("resize", this.calculateWidth.bind(this)); 
  },
  // This function looks at the widths defined in widths_relative_to_viewport 
  // which should be defined when initialising the View. It is defined as follows:
  //
  //  new View({widths_relative_to_viewport: { 
  //    desktop: 80,
  //    mobile: 50 
  //  })
  //
  // It calculates and returns an absolute width of the element based on the 
  // current viewport size and the device type
  calculateWidth: function() {
     var body_width = $('body').width(),
      previous_width = this.previous_body_width;
    if((previous_width != body_width) && !(this.print_ui_el.css('display') == 'none' )) {
      console.log("rendering")
    var print_ui_width = this.print_ui_el.width()
   
      var desktop_panel_width = netbook_panel_width= ((95/100) * (print_ui_width/body_width/2));
      var phablet = smartphone = (95/100) * (print_ui_width/body_width);
    if (this.options.widths_relative_to_viewport) { // doesn't exist in plain GuestView
      if(body_width < 501) {
        this.calculatedWidth = (smartphone * body_width); 
      } else if(body_width > 500 && body_width < 801){ 
        this.calculatedWidth = (phablet * body_width);
      }  else if(body_width > 800 && body_width < 1026){ 
        this.calculatedWidth = netbook_panel_width * body_width;
      } else {
        this.calculatedWidth = desktop_panel_width * body_width;
      }
    }
    }
    
      this.previous_body_width = body_width;
  }
})
