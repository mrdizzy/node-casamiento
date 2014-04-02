var colours = require('./../config/colours'),
    _ = require('underscore'),
    db = require('./../config/db').test_ebay,
    inGroupsOf = require('./../lib/in_groups_of'),
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
       
        res.render('welcome/index', {
            layout: 'layout',
            locals: docs
        });
    });
    })
}