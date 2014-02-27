var db = require('./../config/db').test_ebay,
  _ = require('underscore');
  inGroupsOf = require('./../lib/in_groups_of')

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
    document.cart = cart;
    for(var i=0;i < 6; i++) {
        if (document['background-' + i]) {
            var compiled = _.template(document['background-' + i]);
    document['background-' + i] = compiled({colour: document.colour_2});
    document['background_' + i] = document['background-' + i]
        }
    }
    document.document = document
    console.log(colours)
    document.colour_list = colours
              
       // res.format({
        //    json: function() {
         //       res.json(document)
         //   },
          //  html: function() {
          
        res.render('products/show.ejs', {
            locals: document
        });
          //  }
        //})
    });
}
