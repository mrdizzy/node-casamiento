var _ = require('underscore'),
    db = require('./../config/db').test_ebay,
    prepareDivs = require('./../lib/prepare_divs');
    
module.exports = function(app){
  app.get("/", function(req, res) {
    db.view('products/name_place', function(err, docs) {
      docs = docs.toArray();
      var counter = 0;
      docs.forEach(function(place) {
        place.divs = prepareDivs(place, "slide_" + counter + "_", "slide slide_" + counter, "display", "colour");
        counter++;
      })
      docs.place_cards = docs;
      res.render('welcome/index_2_old', {
        layout: 'layout',
        locals: docs
      });
    });
  })
}