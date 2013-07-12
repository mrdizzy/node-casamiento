var db = require('./../config/db').test_ebay,
async = require('async'),
collateAttachments = require('./../lib/collate_attachments');

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