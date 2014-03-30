var colours = require('./../config/colours'),
    _ = require('underscore'),
    db = require('./../config/db').test_ebay,
    inGroupsOf = require('./../lib/in_groups_of'),
    prepareDivs = require('./../lib/prepare_divs');
    
module.exports = function(app){
    app.get("/", function(req, res) {
        db.view('products/name_place', function(error, documents) {
        var place_cards = documents.toArray()
        place_cards.forEach(function(place_card) {
           place_card.divs = prepareDivs(place_card, "thumbnail", "thumbnail", "display", "related_colour")
       })
            res.render("welcome/index", {
                documents: place_cards
            })
        })
    })
}