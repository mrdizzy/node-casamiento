var db = require('./../config/db').test_ebay,
  _ = require('underscore'),  
    prepareDivs = require('./../lib/prepare_divs'),
    zlib = require('zlib');

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
  var rev = req.product.rev,
  id = req.product.id;
  console.log(req.product.rev, req.product.id)
  req.body._rev = rev;
  var svg = req.body.svg
//var svg = new String(req.body.svg) // new String is used to "copy" the string as we are about to delete it in the next line

  delete req["body"].svg;
  db.save(id, rev, req.body, function(err, documents) {
    if (err) {
    console.log(err)
      res.status(500);
      res.end();
    }
    else {
      var svg_id = "svg__" + documents.id;
      db.get(svg_id, function(e, record) {
        zlib.gzip(svg.toString(), function (theerror, file) {  
          if (record) {
            var svg_rev = record._rev
          }
          db.saveAttachment({id: svg_id, rev: svg_rev}, {name: "svg", 'Content-Type': "image/xml+svgz", body: file}, function(anerror, done) {
            if (anerror) {
              console.log("Error here",anerror)
              res.status(500);
              res.end();
            } else {
              console.log("DONE")
              
            }
          })
          
          
          console.log(file.toString('base64'))
        })
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
