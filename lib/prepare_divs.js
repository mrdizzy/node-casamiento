var _ = require('underscore');

var template = '<div style="position:relative;background-color:<%= background_colour %>" id="<%= id %>" class="<%= klass %>">';
template = template + '<div style="width:100%;height:100%;position:absolute;z-index:5;"><%=background %></div>';
template = template + '<img src="<%= url %>" style="display:block;width:100%;position:relative;z-index:100;"/>';
template = template + "</div>"

module.exports = function (object,id,klass,size,colour_class) {
    var results = [],
    counter = 1;
    object.attachments_order.forEach(function(number) {
    var url = 'http://www.casamiento.co.uk/products/' + object._id + '/attachments/' + size + '-' + number
        // Render the backgrounds using the background-field attributes as templates
        if(object.colours.length > 1) {
        if (object['background-' + number]) { // Only items with 2 colours have background divs
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
        } else {
            var html = '<img src="' + url + '" class="' + klass + '" id ="' + id + counter + '"style="display:block;background-color:' + object.colours[0] + ';" />'   
        }
        counter++;
      results.push(html)
     })  
     return results;   
}