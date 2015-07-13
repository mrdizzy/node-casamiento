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
exports.destroy = function(req, res) {
  db.remove(req.params.id, req.body._rev, function(err, res) {
    console.log(err, res)
  })
}
exports.patch = function(req, res) {
var id = req.body.order_id;
delete req.body.order_id;
console.log(id, req.body)
db.merge(id, req.body, function (err, res) {
      console.log(err, res)
  });
}