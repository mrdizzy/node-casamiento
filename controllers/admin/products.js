var db = require('./../../config/db').test_ebay,
    collateAttachments = require('./../../lib/collate_attachments'),
    product_types = ["invitation", "name_place", "wrap", "rsvp", "envelope"]

    exports.index = function(req, res) {
        getTypes('theme', function(themes) {
            getTypes('product_type', function(product_types) {
                getTypes('product', function(products) {
                    res.render("admin/products/index", {
                        products: products,
                        themes: themes,
                        product_types: product_types
                    })
                })

            })
        })
    }

    function getTypes(type, callback) {
        db.view('all/type', {
            key: type
        }, function(error, docs) {
            if (error) {
                console.log(error)
            }
            else {
                callback(docs.toArray())
            }
        })
    }
