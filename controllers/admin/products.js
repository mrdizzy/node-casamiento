var db = require('./../../config/db').test_ebay;

exports.index = function(req, res) {
  db.view('all/type', {
    key: 'product'
  }, function(error, docs) {
    if (error) {
      console.log(error)
    }
    else {
      db.view("all/fonts_by_id", function(error, fonts_response) {
          var fonts = [];
        fonts_response.toArray().forEach(function(font) {
          fonts.push(font.id)
        })
        res.render("admin/products/index", {
          products: docs.toArray(), 
          layout:"admin_layout",
          fonts: fonts
        })
      })
    }
  })
}
