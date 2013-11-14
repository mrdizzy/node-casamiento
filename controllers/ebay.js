var db = require('./../config/db').test_ebay,
    _ = require('underscore');

//casamiento.co.uk/ebay places -> exports.places -> renders all name place cards on one page
// casamiento.co.uk/ebay/product-id -> exports.show -> renders the product id
// casamiento.co.uk/ebay_single_places/product-id -> exports.name_place_single -> renders the product id

// Route: /ebay/id
// Renders the view found in catalog/
exports.show = function(req, res) {

  if(req.params.ebay) {
    var theme = req.params.ebay.split("-")[0]
        var id = req.params.ebay;
    }
    else {
      var theme = req.params.theme_id.split("-")[0]
      var id = req.params.theme_id;
      var sample = true;
    }
    db.view('products/all', {
        startkey: theme,
        endkey: theme + "z"
    }, function(err, docs) {
        var documents = docs.toArray();
        var current = _.find(documents, function(doc) {
            return doc._id == id;
        })
        var without = _.without(documents, current);
        current.related = without;
        current.theme = theme
        current.sample = sample;
        console.log(without);
        current.quantity = req.query.quantity || 1;
        current.auction = req.query.auction;
        res.render('ebay/14_nov_13.ejs', {
            layout: false,
            locals: current
        });
    });
}

exports.name_place_single = function(req, res) {
  db.get(req.params.id, function(err, docs) {
    res.render('ebay/name_places/name_place_single', {
            layout:false,
            locals: docs
    })      
  })     
}

exports.places = function(req, res) {
       db.view('products/name_place', function(err, docs) {
       
        res.render('ebay/name_places/name_places_new_trial', {
            layout: false,
            documents: docs
        });
    });
}
exports.index = function(req, res) {
    db.view('products/all', function(err, docs) {
        res.render('ebay/index', {
            layout: false,
            documents: docs
        });
    });
}