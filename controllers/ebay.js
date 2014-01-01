var db = require('./../config/db').test_ebay,
    _ = require('underscore'),
    colours = require('./../config/colours')
    inGroupsOf = require('./../lib/in_groups_of');

// Route: /ebay/:id
// This renders an ebay product view by looking in the /views/ebay/product_type folder for its template as different product types will need different rendering
exports.show = function(req, res) {
    var id = req.params.id,
    theme = id.split("-")[0],
    product_type = id.split("-")[1];
    
    db.view('products/all', {
        startkey: theme,
        endkey: theme + "z"
    }, function(err, docs) {
    
        var documents = docs.toArray();
        var current = _.find(documents, function(doc) {
        doc.document = doc;
        for(var i=0;i < 6; i++) {
        if (doc['background-' + i]) {
            var compiled = _.template(doc['background-' + i]);
    doc['background-' + i] = compiled({colour: doc.colour_2});
    
    doc['background_' + i] = doc['background-' + i]
        }
    }
    
    doc.hex_colours = _.uniq(colours.hex)
    doc.colours_ref = colours.labels
    doc.hex_colours = inGroupsOf(doc.hex_colours, 16)
            return doc._id == id;
        })
        var without = _.without(documents, current);
        current.related = without;
        current.sample = ""
        current.theme = theme
        console.log(without);
        current.quantity = req.query.quantity || 1;
        current.auction = req.query.auction;
        res.render('ebay/' + product_type + 's/14_nov_13.ejs', {
            layout: false,
            locals: current
        });
    });
}
exports.places = function(req, res) {
       db.view('products/name_place', function(err, docs) {
       
        res.render('ebay/name_places/name_places', {
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