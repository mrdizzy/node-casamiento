// This View class contains some utility methods which other views can 
// inherit. It is important that child classes which override the initialize
// method call BackboneRelativeView.prototype.initialize.apply(this) in order
// to initialize the utility functions
var BackboneRelativeView = Backbone.View.extend({
  initialize: function() {
    $(window).on("resize", this.testForMobile.bind(this)); 
    this.testForMobile();
  },
  // This function looks at the widths defined in widths_relative_to_viewport 
  // which should be defined when initialising the View. It is defined as follows:
  //
  //  new View({widths_relative_to_viewport: { 
  //    desktop: 80,
  //    mobile: 50 
  //  })
  //
  // It calculates and returns the absolute width of the element based on the 
  // current viewport size and the device type
  relativeToViewport: function() {
    var widths_relative_to_viewport = this.options.widths_relative_to_viewport;
    var viewport = $('body').width();
    if(viewport < 501) return (widths_relative_to_viewport.mobile/100) * viewport;
    return (widths_relative_to_viewport.desktop/100) * viewport;
  },  
  testForMobile: function() {
    var viewport = $('body').width();
    if(viewport < 501) {
      this.mobile = true
    } else {
      this.mobile = false;
    }
  }
})