var db = require('./../config/db').test_ebay;
  
exports.show = function(req, res) {
  var id = req.params.download;
  db.get(id, function(error, doc) {
    res.render('downloads/show.ejs', {
        locals: doc
    })
  });
};