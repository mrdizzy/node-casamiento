var db = require('./../config/db').test_ebay,
    _ = require('underscore');

// Route: /ebay/:id
// This renders an ebay product view by looking in the /views/ebay/product_type folder for its template as different product types will need different rendering
exports.show = function(req, res) {
    var id = req.params.id,
    theme = id.split("-")[0],
    product_type = id.split("-")[1];
    
    db.get(id, function(err, doc) {
        
      var divs = prepareDivs(doc);
        doc.document = doc;
        doc.divs = divs;
        res.render('ebay/' + product_type + 's/14_nov_13.ejs', {
            layout: false,
            locals: doc
        });
    });
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


function prepareDivs(object) {
var results = []
    object.attachments_order.forEach(function(number) {
        if (object['background-' + number]) {
            var compiled = _.template(object['background-' + number]);
            var result = compiled({colour: object.colours[1]});   
        }
        var html = '<div id="slide' + number + '" class="slide_container colour_0">';
        html = html + '<img src="http://www.casamiento.co.uk/products/' + object._id + '/attachments/display-' + number + '" class="slide_image" />'
      if ((typeof  object["background-" + number]) !== "undefined") {
        html = html + '<div class="slide_background_container">' + result + '</div>'
      }
      html = html + '</div>'
      results.push(html)
     })  
     return results;
     
}