var db = require('couchdb-migrator').databases.test_ebay,
_ = require('underscore');

exports.show = function(req, res) {
    var results = req.params.theme_id.split("-"),
        theme_name = results[0],
        product_type = results[1];
        
    db.view('products/all', {
        startkey: theme_name,
        endkey: theme_name + "z"
    }, function(err, docs) {
        console.log(docs);
        var documents = docs.toArray();
        var current = _.find(documents, function(doc) {
            return doc._id == req.params.theme_id;
            })
        var without = _.without(documents, current);
        current.related = without;
        res.render('catalog/product_ebay', { layout:false, locals:current } );
    });
}
exports.index = function(req, res) {
    db.view('products/all', function(err, docs) {
    res.render('ebay/index.ejs', { layout:false, documents: docs });
    });
};

exports.sample = function(req, res) {
    var results = req.params.theme_id.split("-"),
        theme_name = results[0];
        
    db.view('products/all', {
        startkey: theme_name,
        endkey: theme_name + "z"
    }, function(err, docs) {
        var documents = docs.toArray(),
        current = _.clone(documents[0]);
        current.product_type = "sample";
        current.related = documents;
        res.render('catalog/product_ebay', { layout:false, locals:current } );
    });
}