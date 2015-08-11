var _ = require('underscore'),
		db = require('./../config/db').test_ebay, 
		colours = require('./../lib/colour_lookup');

exports.index = function(req, res) {
	db.get(["botanic_sketch-name_place", "new_york_skyline-name_place", "paris_skyline-name_place", "london_skyline-name_place", "egyptian_floret-name_place", "beautiful-name_place", "simple_butterfly-name_place"], function(err, docs) {
		docs = docs.toArray();  
		docs.forEach(function(card) {
			card.colour_0 = colours[card.colours[0]]
			var colour_1 = card.colours[1]
			if(colour_1) {
				card.colour_1 = colours[colour_1]
			}
			
		})
		docs.place_cards = docs;
		res.render('welcome/index', {
			locals: docs
		});
	});
}