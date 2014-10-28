var db = require('./../config/db').test_ebay,
  _ = require('underscore'),  
    prepareDivs = require('./../lib/prepare_divs'),
    zlib = require('zlib');

exports.index = function(req, res) {
  db.view('products/name_place', function(err, docs) {
    docs = docs.toArray();
    docs.forEach(function(place) {
      place.divs = prepareDivs(place, "search", "search", "display", "colour");
    })
    docs.place_cards = docs;
    res.render('products/index', {
      layout: 'layout',
      locals: docs
    });
  });
}

exports.show = function(req, res) {
  var id = req.params.product;
  db.view('all/products_without_attachments', { key: id }, function(error, docs) {
    db.view("all/fonts_by_id", function(error, fonts_response) {
      res.render('products/show/show.ejs', {     
        locals: {
          fonts: fonts_response.toArray(), 
          product: docs[0].value // First record   
        }
      });
    })
  });
};

exports.update = exports.create = function(req, res) {
  if(req.product) {
    var rev = req.product.rev,
    id = req.product.id;
    req.body._rev = rev;
  } else {
    var id = req.body._id
  }
  //var svg = new String(req.body.svg) // new String is used to "copy" the string as we are about to delete it in the next line
  if(req.body.svg) {
    var svg = req.body.svg.toString();    
    delete req["body"].svg;
  }
  db.save(id, rev, req.body, function(err, documents) {
    if (err) {
    console.log("Error saving main product", err)
      res.status(500);
      res.end();
    }
    else if(svg) {
      var svg_id = "svg__" + documents.id;
      db.get(svg_id, function(e, record) {
        if (record) {
          var svg_rev = record._rev
        }
        db.save(svg_id,svg_rev, {_attachments: { svg: { 'Content-Type': "image/xml+svgz", data: svg}}}, function(anerror, done) {
            if (anerror) {
              console.log("Error saving attachment of SVG",anerror)
              res.status(500);
              res.end();
            } else {
              console.log("DONE")              
            }
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
