var db = require('couchdb-migrator').databases.test_ebay;

exports.show = function(req, res) {
    var id = req.params.product;
    db.get(id, function(error, document) {
        res.render('catalog/product.ejs', {
            locals: document
        });
    });
};

exports.update = function(req, res) {
    console.log(req.body);
    db.save(req.body, function(err, documents) {
        if (err) {
            console.log(err)
            res.status(500);
            res.end();
        }
        else {
            console.log("DONE", documents);
            req.body._rev = documents.rev;
            res.json(req.body)
            res.end();
        }
    });
}
