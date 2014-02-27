var db = require('./../../config/db').test_ebay;

exports.index = function(req, res) {
    getTypes('theme', function(themes) {
        getTypes('product_type', function(product_types) {
            getTypes('product', function(products) {
                res.render("admin/products/index", {
                    products: products,
                    themes: themes,
                    product_types: product_types
                , layout:"admin_layout" })
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
