var db = require('couchdb-migrator').databases.test_ebay;

exports.show = function(req, res) {
    var stream = db.getAttachment(req.params["product"], req.params["attachment"])
    stream.on("data", function(chunk) {
        res.write(chunk)
    });
    stream.on('end', function() {
        res.end();
    });
}
exports.update = function(req, res) {
  console.log("Updated:", req.files)  
};
exports.destroy = function(req, res) {
    
   console.log("Body:", req.body); 
    
};