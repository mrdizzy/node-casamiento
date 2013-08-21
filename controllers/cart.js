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
	db.save(attrs, function(err, doc) {
		console.log("error", err, doc)
		
		if(err) { 
		console.log("-------------------------------Conflict")
			if(err.error == 'conflict') {
		
				db.get(attrs._id, function(error, response) {
					attrs._rev = response._rev
					db.save(attrs, function(new_err, new_doc) {
					attrs._id = new_doc._id;
			attrs._rev = new_doc._rev;
						console.log("Saved after conflict", new_err, new_doc)
						res.json(attrs)
					})
				})
			}	
		} else {
			attrs._id = doc._id;
			attrs._rev = doc._rev;
			res.json(attrs)
		}
	})
}

exports.index = function(req, res) {
	console.log("GO")
	
}