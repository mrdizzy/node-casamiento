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
    var cart_id = req.cookies.cart;
    if (req.cookies.cart) {
        db.get(req.cookies.cart, function(err, doc) {
              getProduct(req, res,id,doc)
        })
    } else {
        getProduct(req, res, id)
    }
    
    
};

function getProduct(req, res,id,cart) {
    db.get(id, function(error, document) {
    document.cart = cart;
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
}