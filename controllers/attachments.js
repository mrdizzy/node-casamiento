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