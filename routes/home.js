var _ = require('underscore'),
    db = require('./../config/db').test_ebay;
    
module.exports = function(app){
  app.get("/", function(req, res) {
    db.get(["wild_vintage-name_place", "ace_of_hearts-name_place", "beautiful-name_place", "paisley-name_place", "damask-name_place", "rose-name_place", "e87cea260c13c66b90d544c55000292d-name_place", "foliage-name_place","birds_of_paradise-name_place", "chess-name_place", "borders-name_place", "e87cea260c13c66b90d544c550001945-name_place"], function(err, docs) {
    console.log(docs.toArray())
      docs = docs.toArray();     
      docs.place_cards = docs;
      res.render('welcome/index', {
        layout: 'welcome_layout',
        locals: docs
      });
    });
  })
}