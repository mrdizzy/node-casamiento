var db = require('./../config/db').test_ebay,
  _ = require('underscore'),  
    prepareDivs = require('./../lib/prepare_divs');

exports.index = function(req, res) {
  db.view('products/name_place', function(err, docs) {
    docs = docs.toArray();
    var counter = 0;
      docs.forEach(function(place) {
        place.divs = prepareDivs(place, "search", "search", "display", "colour");
        counter++;
      })
      docs.place_cards = docs;
       console.log(docs)
      res.render('products/index', {
        layout: 'layout',
        locals: docs
      });
    });
}

exports.update = exports.create = function(req, res) {
var svg = { data: new String(req.body.svg) }
delete req["body"].svg;
  db.save(req.body, function(err, documents) {
    if (err) {
      res.status(500);
      res.end();
    }
    else {
      svg._id = "svg__" + documents.id;
      db.save(svg, function(error, result) {
        if (err) {
          res.status(500);
          res.end();
        } else {
        console.log(result)
          db.get(documents.id, function(error, response) {
              res.json(response)
              res.end();
          })
        }
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
    db.get(id, function(error, doc) {
        doc.divs = prepareDivs(doc, "slide", "slide", "display", "colour");
        res.render('products/show.ejs', {
            locals: {product: doc}
        });
    });
}
