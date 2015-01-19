var _ = require('underscore'),
		db = require('./../config/db').test_ebay, 
		colours = require('./../lib/colour_lookup');

exports.index = function(req, res) {
	db.get(["birds_of_paradise_spirals-name_place","birds_of_paradise-name_place", "ornamental-name_place", "ace_of_hearts-name_place", "foliage-name_place", "chess-name_place", "rose-name_place","tiny_hearts-name_place","beautiful-name_place","damask-name_place","wild_vintage-name_place"], function(err, docs) {
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