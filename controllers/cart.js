var db = require('./../config/db').test_ebay;

exports.create = function(req, res) {
	var attrs = req.body;
	attrs.type = "cart"
	db.save(attrs, function(err, doc) {
	attrs._id = doc._id;
		if(err) { console.log(err)} else {
		res.cookie("cart", doc._id)
			res.json(attrs)
		}
	})
}
exports.update = function(req, res) {
	var attrs = req.body;
	console.log(req.body)
	db.save(attrs, function(err, doc) {
	console.log(err, doc)
	attrs._id = doc._id;
	attrs._rev = doc._rev;
		if(err) { console.log(err)} else {
			res.json(attrs)
			}
	})
}

exports.index = function(req, res) {
	console.log("GO")
	
}