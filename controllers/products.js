var db = require('./../config/db').test_ebay,
    colours = require('./../config/colours'),
    _ = require('underscore')

exports.update = function(req, res) {

    db.save(req.body, function(err, documents) {
        if (err) {
            console.log("ERROR", err)
            res.status(500);
            res.end();
        }
        else {
            db.get(documents.id, function(error, response) {
            console.log(response)
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
    for(var i=0;i < 6; i++) {
        if (document['background-' + i]) {
            var compiled = _.template(document['background-' + i]);
    document['background-' + i] = compiled({colour: document.colour_2});
    
    document['background_' + i] = document['background-' + i]
        }
    }
    document.document = document
    document.hex_colours = _.uniq(colours.hex)
    document.colours_ref = colours.labels
    document.hex_colours = inGroupsOf(document.hex_colours, 24)
              
       // res.format({
        //    json: function() {
         //       res.json(document)
         //   },
          //  html: function() {
          
                res.render('products/product_17_oct_2013.ejs', {
                    locals: document
                });
          //  }
        //})
    });
}

var inGroupsOf = function(arr, n){
  var ret = [];
  var group = [];
  var len = arr.length;
  var per = len * (n / len);

  for (var i = 0; i < len; ++i) {
    group.push(arr[i]);
    if ((i + 1) % n == 0) {
      ret.push(group);
      group = [];
    }
  }

  if (group.length) ret.push(group);

  return ret;
};