// This View class contains some utility methods which other views can 
// inherit. It is important that child classes which override the initialize
// method call BackboneRelativeView.prototype.initialize.apply(this) in order
// to initialize the utility functions
var BackboneRelativeView = Backbone.View.extend({
  initialize: function() {
   //this.calculateWidth();
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
  
})
