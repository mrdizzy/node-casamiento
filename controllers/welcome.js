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
		cards_to_show =["xmas_sketch,xmas_diamante,xmas_santa_hats,xmas_tree_scribbles,xmas_simple_baubles,xmas_squares"]
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

