var db = require('./../config/db').test_ebay,
  _ = require('underscore'),
  
    prepareDivs = require('./../lib/prepare_divs');
  
module.exports = function(req, res) {
  db.view('tags/by_tags', { key: req.body.tags },function(err, docs) {
  if(docs) {
  var result = docs.toArray();
  result.forEach(function(doc) {
      doc.divs = prepareDivs(doc, "search", "search", "display", "colour");
  })
    res.render('search/index.ejs',{ docs: result, layout:false })
    }
  })
  
};