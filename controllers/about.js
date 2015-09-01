var _ = require('underscore'),
		db = require('./../config/db').test_ebay;

exports.index = function(req, res) {

		res.render('welcome/about', {
			layout:"about_layout",
		});
}