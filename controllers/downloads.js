var db = require('./../config/db').test_ebay;
  
exports.show = function(req, res) {
  var id = req.params.download;
 db.get(id, function(error, doc) {
    if(error) {
        res.send(500, "Error")
    } else {
        db.get("svg__" + id, function(err, results) {
        doc.svg = results.data
            res.render('downloads/show.ejs', {
                locals: doc
            })
        })
    }
    });
};