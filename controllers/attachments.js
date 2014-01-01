var db = require('./../config/db').test_ebay;

// Attachments are stored inline with a product
// 1. thumb
// 2. display
// 3. medium
// 4. large
// Calls the cradle getAttachment method using the product_id and the attachment id
exports.show = function(req, res) {
  var stream = db.getAttachment(req.product.id, req.params["attachment"])
  stream.on("data", function(chunk) {
    res.write(chunk)
  });
  stream.on('end', function() {
    res.end();
  });
}

exports.destroy = function(req, res) {
 console.log("Body:", req.body); 
};
