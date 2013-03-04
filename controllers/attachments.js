var db = require('couchdb-migrator').databases.test_ebay,
async = require('async'),
collateAttachments = require('./../lib/collate_attachments');

exports.show = function(req, res) {
    var stream = db.getAttachment(req.product.id, req.params["attachment"])
    stream.on("data", function(chunk) {
        res.write(chunk)
    });
    stream.on('end', function() {
        res.end();
    });
}
exports.update = function(req, res) {
    var currentRev = req.body.rev;
    
    collateAttachments(req, function(err, collated) {
        async.forEachSeries(Object.keys(collated), function(attachment, callback) {
            console.log("go", currentRev);
            db.saveAttachment({
                _id: req.params.product,
                _rev: currentRev
            }, {
                name: attachment,
                "content-type": collated[attachment].content_type,
                "body": collated[attachment].raw
            }, function(error, doc) {
                console.log("Error,", error);
                currentRev = doc.rev;
                callback(error)
                });

        }, function(err) {
            console.log(err);
            res.send("<html>Done</html>");
        })
        // db.saveAttachment({ _id: req.params.product, _rev: req.body.rev}, 
        //db.save(id, {
        //    _attachments: collated,
        //    type: "product"
        //}, function(err, doc) {
        //    console.log(err, doc)
        //})
    })
};
exports.destroy = function(req, res) {
    
   console.log("Body:", req.body); 
    
};