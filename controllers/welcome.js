var _ = require('underscore'),
	db = require('./../config/db').test_ebay,
	colours = require('./../lib/colour_lookup');

exports.index = function(req, res) {
    if (req.query.show) {
    		var cards_to_show = req.query.show.split(",")
	cards_to_show = _.map(cards_to_show, function(card) {
		return card + "-name_place"
	})
    }
    else {
		cards_to_show =["birds_of_paradise_trees-name_place", "birds_of_paradise_spirals-name_place", "acorn_pattern-name_place", "botanic_sketch-name_place", "damask-name_place", "egyptian_diamonds-name_place", "egyptian_motif-name_place", "foliage-name_place", "garden_of_life-name_place", "guilloche-name_place", "chequers-name_place", "ornamental-name_place", "modern_floral-name_place", "wild_magic-name_place", "wild_vintage-name_place", "zigzag-name_place"]
	}
	db.get(cards_to_show, function(err, docs) {

		docs = docs.toArray();
		
		docs.forEach(function(card) {
			card.colour_0 = colours[card.colours[0]]
			var colour_1 = card.colours[1]
			if (colour_1) {
				card.colour_1 = colours[colour_1]
			}

		})
		docs.place_cards = docs;
		
	docs.headline =  req.query.headline || "Impress your guests with unique place cards to match your theme"
		res.render('welcome/index', {
			locals: docs
		});
	});
}

exports.about = function(req, res) {
	res.render('welcome/about', {
		layout: "about_layout",
	});
}

exports.faq = function(req, res) {
	res.render('welcome/faq', {
		layout: "about_layout",
	});
}

