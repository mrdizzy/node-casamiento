var db = require('./../config/db').test_ebay,
  _ = require('underscore');
  
exports.show = function(req, res) {
  var id = req.params.download;
 db.get(id, function(error, doc) {

        res.render('downloads/show.ejs', {
            locals: doc
        })
    });
};