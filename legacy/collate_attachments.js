var async = require('async'),
  fs = require('fs');

// A function that 

// req.files is an object with each file referenced by a key which is derived
// from its input[name] value in the multipart/enc HTML form
module.exports = function collateAttachments(req, callback) {
  var collated = {}
  async.forEach(Object.keys(req.files), function(key, callback) {
    var thisFile = req.files[key];
    if (thisFile.size > 0) { // Only process files which are not empty!
      fs.readFile(thisFile.path, function(err, data) {
        collated[key] = {}
        collated[key]["content_type"] = "image/png";
        collated[key]["data"] = data.toString('base64');
        collated[key]["raw"] = data;
        callback(err);
      })
    }
    else {
      callback(null)
    }
  }, function(err) {
    if (err == null) {
      callback(null, collated)
    }
    else {
      callback(null)
    }
  })
}
