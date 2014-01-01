
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