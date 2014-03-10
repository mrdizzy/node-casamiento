var db = require('./../config/db').test_ebay,
    _ = require('underscore');

var template = '<div style="position:relative;background-color:<%= background_colour %>" id="<%= id %>" class="<%= klass %>">';
template = template + '<div style="width:100%;height:100%;position:absolute;z-index:5;"><%=background %></div>';
template = template + '<img src="<%= url %>" style="display:block;width:100%;position:relative;z-index:100;"/>';
template = template + "</div>"

// Route: /ebay/:id
// This renders an ebay product view by looking in the /views/ebay/product_type folder for its template as different product types will need different rendering
exports.show = function(req, res) {
    var id = req.params.id,
    theme = id.split("-")[0],
    product_type = id.split("-")[1];
    
    db.get(id, function(err, doc) {
    db.view('products/name_place', function(err, related) {
    var related = related.toArray()
       related.forEach(function(related) {
           related.divs = prepareDivs(related, "thumbnail", "thumbnail", "display", "related_colour")
       })
        doc.related = related;
      var divs = prepareDivs(doc, "slide", "slide", "display", "colour");
        doc.document = doc;
        doc.divs = divs;
        res.render('ebay/' + product_type + 's/14_nov_13.ejs', {
            layout: false,
            locals: doc
        });
    });
    })
}
exports.places = function(req, res) {
       db.view('products/name_place', function(err, docs) {
       
        res.render('ebay/name_places/name_places_new_trial', {
            layout: false,
            documents: docs
        });
    });
}
exports.index = function(req, res) {
    db.view('products/all', function(err, docs) {
    var documents = _.groupBy(docs.toArray(), 'product_type');

        res.render('ebay/index', {
            layout: false,
            documents: documents
        });
    });
}

function prepareDivs(object,id,klass,size,colour_class) {
    var results = []
    object.attachments_order.forEach(function(number) {
        if (object['background-' + number]) {
            var compiled = _.template(object['background-' + number]);
            var result = compiled({colour: object.colours[1]}); 
        }
        var url = 'http://www.casamiento.co.uk/products/' + object._id + '/attachments/' + size + '-' + number
        var finished = _.template(template)
        if(object.colours[0] != undefined) {
            var backgroundcolor = object.colours[0]
        }
        else {
            var backgroundcolor = ""
        }
        var html = finished({background: result, background_colour:backgroundcolor, url: url, klass: klass, id: id + number}) 
      results.push(html)
     })  
     return results;   
}