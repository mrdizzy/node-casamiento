var db = require('./../config/db').test_ebay,
  _ = require('underscore');

exports.show = function(req, res) {

  // We set the type to text/plain rather than image/svg+xml oraas otherwise
  // when the data is sent to jQuery it will try to parse the SVG and this 
  // will cause problems, so instead we send it as plaintext and then use the
  // $.html() to insert the SVG data into an element
  res.set("Content-Type", "text/plain")

  // We are sending the gzipped version which is stored in couchDB. Storing 
  // the gzipped version in CouchDB reduces bandwidth and storage space 
  // and the browser will then unzip the data
  res.set("Content-Encoding", "gzip")
  
  // Let's stream the data'
  var stream = db.getAttachment("svg__damask-name_place", "gary2.svg.gz")
  stream.on("data", function(chunk) {
    res.write(chunk)
  });
  stream.on('end', function() {
    res.end();
  });

// //db.get("svg__" + req.params.id, function(error, results) {
  
}