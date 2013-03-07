var db = require('./../../config/db').test_ebay,
    collateAttachments = require('./../../lib/collate_attachments'),
    product_types = ["invitation", "name_place", "wrap", "rsvp", "envelope"]

    exports.index = function(req, res) {
        db.view('all/type', {
            key: 'theme'
        }, function(error, t) {
            console.log(t)
            db.view('all/type', {
                key: 'product',
            }, function(err, documents) {
                res.render("admin/products/index", {
                    products: documents.toArray(),
                    themes: t.toArray(),
                    product_types: product_types
                })
            });
        })
    };
