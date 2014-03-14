var db = require('./../config/db').test_ebay,
    _ = require('underscore'),
    prepareDivs = require('./../lib/prepare_divs');

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

