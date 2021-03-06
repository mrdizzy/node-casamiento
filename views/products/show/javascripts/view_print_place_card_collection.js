// Loops through guests and creates an SVG placecard for printing.
// We listen to the Product object for changes
// to crop marks or number of place cards per page. When these changes happen,
// we call private methods which will alter css or add/remove classes on  
// elements 
var PrintPlaceCardCollectionView = Backbone.View.extend({
  el: '#printsvg',
  initialize: function() {  
    this.listenTo(thisProduct, 'change:cutting_marks', this._renderCuttingMarks) 
    this.listenTo(thisProduct, 'change:per_page', this._changeOrientation) 
    this.listenTo(thisProduct, 'change:per_page', this.render)
  },
  render: function() {  
    var $template = $(Handlebars.template(templates["print_place_card_view_collection"])(thisProduct.get("guests").printPresenter())); 
    this.$el.removeClass().addClass("up" + thisProduct.get("per_page"))
    if(thisProduct.get("browser")) this.$el.addClass(thisProduct.get("browser"))
    this.$el.html($template)
   
    // Wait for SVG images to be loaded before printing, and then 
    // trigger a "readyforprint" event which will bring up the custom-made print
    // dialog box
    var images  = $('#printsvg img.place_card_image'),  
      counter = images.length;
    
    this._renderCuttingMarks();
    images.attr('src', thisProduct.svgURL()).load(function() {
      counter--;
      if(counter == 0) thisProduct.trigger("readyforprint")
    })    
    return this;
  },
  _changeOrientation: function() {
    if(thisProduct.get("per_page") == 4) {   
      $('head').append("<style type='text/css'>@page { size: A4 landscape }</style>");
    } 
    else {             
      $('head').append("<style type='text/css'>@page { size: A4 portrait }</style>");
    }    
  },
  // add or remove the "show_crop_marks" class on #printsvg to so that we can display or hide cutting marks based on CSS alone, rather than adding or removing elements from the DOM
  _renderCuttingMarks: function() {
    thisProduct.get("cutting_marks") ? this.$el.addClass('show_crop_marks') : this.$el.removeClass('show_crop_marks');
  }
})