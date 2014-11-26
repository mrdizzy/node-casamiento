var db = require('./../config/db').test_ebay,
    _ = require('underscore');
    //prepareDivs = require('./../lib/prepare_divs');

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
        doc.params = req.query
        console.log(req.query)
        res.render('ebay/' + product_type + 's/new.ejs', {
            layout: false,
            locals: doc
        });
    });
    })
}
exports.create = function(req, res) {
     var id = req.body.id,
    theme = id.split("-")[0],
    product_type = id.split("-")[1];
    
    db.get(id, function(err, doc) {
     var name = doc._id.replace(/_/g, " ").split("-")[0];
name = name.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
doc.name = name; 
    db.view('products/name_place', function(err, related) {
    var related = related.toArray()
        related.forEach(function(related) {
            var name = related._id.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
related.name = name; 
        })
        doc.related = related;
      
        doc.document = doc;
        doc.params = req.body
        res.render('ebay/' + product_type + 's/new.ejs', {
            layout: false,
            locals: doc
        });
    });
    })
}

// POST to places with an array of ids for multiple place cards on one page
exports.places = function(req, res) {
  db.get(req.body.ids, function(err, docs) {
    docs = docs.toArray();
    var counter = 0;
    docs.place_cards = docs;
    res.render('ebay/name_places/name_places_new_trial', {
      layout: 'ebay_layout',
      locals: docs
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

