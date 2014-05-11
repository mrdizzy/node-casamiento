var _ = require('underscore');

// Template used for items that have more than 2 colours
var template = '<div style="position:relative;background-color:<%= background_colour %>" id="<%= id %>" class="<%= klass %>">';
template = template + '<div style="width:100%;height:100%;position:absolute;z-index:5;"><%=background %></div>';
template = template + '<img src="<%= url %>" style="display:block;width:100%;position:relative;z-index:100;"/>';
template = template + "</div>"

// object: the couchdb Product object that contains the div templates, colours etc.
module.exports = function (object,id,klass,size,colour_class) {
  var results = [],
  counter = 1;
  // Use attachments_order to loop through each attachment
  object.attachments_order.forEach(function(number) {
    var url = 'http://www.casamiento.co.uk/products/' + object._id + '/attachments/' + size + '-' + number
    // items with 2 colours have background divs so we need to render the backgrounds using the background-field attributes as templates. First we render the background divs by filling in the colour, and then we pass the result to another template
    if(object.colours.length > 1) {
      if (object['background-' + number]) { 
        var compiled = _.template(object['background-' + number]);
        var result = compiled({colour: object.colours[1]}); 
      }
      var finished = _.template(template)
      if(object.colours[0] != undefined) {
        var backgroundcolor = object.colours[0]
      }
      else {
        var backgroundcolor = ""
      }
      var html = finished({background: result, background_colour:backgroundcolor, url: url, klass: klass, id: id + counter})     
      // Render products that only have 1 colour by simply filling in the background of the img tag
    } else {
      var html = '<img src="' + url + '" class="' + klass + '" id ="' + id + counter + '"style="display:block;background-color:' + object.colours[0] + ';" />'   
    }
    counter++;
    results.push(html)
  })  
  return results;   
}