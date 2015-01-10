var db = require('./../../config/db').test_ebay;

exports.index = function(req, res) {
  db.view('all/type', {
    key: 'product'
  }, function(error, docs) {
    if (error) {
      console.log(error)
    }
   
    else {
    console.log(docs.toArray())
      res.render("admin/products/index", {
        products: docs.toArray(), 
        layout:"admin_layout" 
      })
    }
  })
}
