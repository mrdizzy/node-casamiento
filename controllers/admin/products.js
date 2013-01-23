var db = require('couchdb-migrator').databases.test_ebay,
collateAttachments = require('./../../lib/collate_attachments'),
    themes = ["ace_of_hearts", "simplicity", "rose", "chequers", "birds_of_paradise", "border", "eloquence"],
    product_types = ["invitation", "name_place", "wrap", "rsvp", "envelope"]

exports.index = function(req, res) {
    db.view('all/type', {
        key: 'product'
    }, function(err, documents) {
        res.render("admin/products/index", {
            products: documents.toArray(),
            themes: themes,
            product_types: product_types
        })
    });
};

exports.create = function(req, res) {
    collateAttachments(req, function(err, collated) {
        var id = req.body.theme + "-" + req.body.product_type; // theme_name-product_type
        db.save(id, {
            _attachments: collated,
            type: "product"
        }, function(err, doc) {
            console.log(err, doc)
        })
    })
}

exports.new = function(req, res) {
    res.render('products/new.ejs', {
        themes: themes,
        product_types: product_types
    })
}