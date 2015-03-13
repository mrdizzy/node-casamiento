var db = require('./../../config/db').test_ebay;

exports.index = function(req, res) {
  db.view('all/type', {
    key: 'order'
  }, function(error, docs) {
    if (error) {
      console.log(error)
    }
    else {
      res.render("admin/orders/index", {
        orders: docs.toArray(), 
        layout:"admin_layout"
      })
    }
  })
}
