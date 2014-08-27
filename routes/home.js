var _ = require('underscore'),
    db = require('./../config/db').test_ebay;
    
module.exports = function(app){
  app.get("/", function(req, res) {
    db.view('products/name_place', function(err, docs) {
      docs = docs.toArray();     
      docs.place_cards = docs;
      res.render('welcome/index', {
        layout: 'welcome_layout',
        locals: docs
      });
    });
  })
}