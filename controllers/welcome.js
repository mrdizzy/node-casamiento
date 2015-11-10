var _ = require('underscore'),
	db = require('./../config/db').test_ebay,
	colours = require('./../lib/colour_lookup');

exports.index = function(req, res) {
    if (req.query.show) {
    		var cards_to_show = req.query.show.split(",")
	cards_to_show = _.map(cards_to_show, function(card) {
		return card + "-name_place"
	})
	console.log(cards_to_show)
    }
    else {
		cards_to_show =["halloween_skulls-name_place", "halloween_landscape-name_place", "halloween_cobwebs-name_place", "acorn_pattern-name_place", "egyptian_diamonds-name_place", "halloween_spiders-name_place", "paris_skyline-name_place", "london_skyline-name_place","zigzag-name_place","birds_of_paradise_trees-name_place", "simple_butterfly-name_place", "wild_vintage-name_place"]
	}
	db.get(cards_to_show, function(err, docs) {
	
		docs = docs.toArray();
			console.log(docs)
		docs.forEach(function(card) {
			card.colour_0 = colours[card.colours[0]]
			var colour_1 = card.colours[1]
			if (colour_1) {
				card.colour_1 = colours[colour_1]
			}

		})
		docs.place_cards = docs;
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

