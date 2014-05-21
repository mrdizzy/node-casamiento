var db = require('./../config/db').test_ebay,
  _ = require('underscore');
  

exports.show = function(req, res) {
  db.get("svg__" + req.params.id, function(error, results) {
    if(error) {
      res.json({})
    } else {
      res.json(results)
    }
  })
  
}