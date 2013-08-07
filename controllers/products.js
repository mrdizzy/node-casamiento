var db = require('./../config/db').test_ebay;

exports.update = function(req, res) {
    console.log("Updating", req.body)
    res.json(req.body);
    res.end()
    db.save(req.body, function(err, documents) {
        if (err) {
            console.log("ERROR", err)
            res.status(500);
            res.end();
        }
        else {
            db.get(documents.id, function(error, response) {
                res.json(response)
                res.end();
            })
        }
    });
}
exports.destroy = function(req, res) {
    db.remove(req.product.id, req.product.rev, function(err, doc) {
        if (err) {
            console.log(err)
        }
        else {
            res.status(200);
            res.end()
        }
    })
}
exports.create = function(req, res) {
    db.save(req.body, function(err, documents) {
        if (err) {
            console.log("ERROR", err)
            res.status(500);
            res.end();
        }
        else {
            db.get(documents.id, function(error, response) {
                res.json(response)
                res.end();
            })
        }

    });
}
exports.show = function(req, res) {
    var id = req.params.product;
    db.get(id, function(error, document) {
       // res.format({
        //    json: function() {
         //       res.json(document)
         //   },
          //  html: function() {
                res.render('catalog/product.ejs', {
                    locals: document
                });
          //  }
        //})
    });
};
