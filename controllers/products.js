var db = require('./../config/db').test_ebay,
  _ = require('underscore');

exports.update = function(req, res) {
  db.save(req.body, function(err, documents) {
    if (err) {
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
        for(var i=0;i < 6; i++) {
            // compile templates for different coloured backgrounds
            if (document['background-' + i]) {
                var compiled = _.template(document['background-' + i]);
                document['background-' + i] = compiled({colour: document.colours[1]});
            }
        }
        res.render('products/show.ejs', {
            locals: {product: document}
        });
    });
}
