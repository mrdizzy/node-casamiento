var db = require('couchdb-migrator').databases.test_ebay,
_ = require('underscore');

exports.show = function(req, res) {
    var results = req.params.ebay.split("-"),
        theme_name = results[0],
        product_type = results[1];
        console.log(theme_name);
    db.view('products/all', {
        startkey: theme_name,
        endkey: theme_name + "z"
    }, function(err, docs) {
        console.log(docs);
        var documents = docs.toArray();
        var current = _.find(documents, function(doc) {
            return doc._id == req.params.ebay;
            })
        var without = _.without(documents, current);
        current.related = without;
        current.quantity = req.query.quantity || 1;
        current.auction = req.query.auction;
        res.render('catalog/product_ebay', { layout:false, locals:current } );
    });
}

exports.index = function(req,res) {
    db.view('products/all', function(err, docs) {
        res.render('ebay/index', {layout:false, documents: docs}); 
    });
}

exports.sample = function(req, res) {
    var results = req.params.theme_id.split("-"),
        theme_name = results[0];
        console.log(req.query);
    db.view('products/all', {
        startkey: theme_name,
        endkey: theme_name + "z"
    }, function(err, docs) {
        var documents = docs.toArray(),
        current = _.clone(documents[0]);
        current.product_type = "sample";
        current.related = documents;
        current.auction = req.query.auction;
        current.quantity = req.query.quantity || 1;
        res.render('catalog/product_ebay', { layout:false, locals:current } );
    });
}