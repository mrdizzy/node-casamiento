var db = require('./../config/db').test_ebay,
  _ = require('underscore');

exports.update = exports.create = function(req, res) {
req.body.type = "EBAY_ORDER";
  db.save(req.body, function(err, result) {
    console.log(err, result)
    res.render("thanks", {layout: false});
  })
  
}