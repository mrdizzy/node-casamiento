var db = require('./../config/db').test_ebay,
  zlib = require('zlib'),
  _ = require('underscore'),
  es = require('event-stream');
  
exports.show = function(req, res) {

  // The gzipped version is stored in CouchDB. The gzipped version is NOT 
  // created in Illustrator using its own compressed version, rather a normal 
  // SVG file is created and then gzipped using 7Zip software to create the 
  // gzipped file. This is then uploaded to CouchDB as an attachment. 
  
  // We get the attachment and decompress it using zlib, then use the event-stream
  // library to replace instances of the colours and pipe it to the response
  res.set("Content-Encoding", "gzip")
  res.set("Content-Type", "image/svg+xml")
  db.getAttachment("svg__birds_of_paradise-name_place", "svg")
    .pipe(zlib.createGunzip())
    .pipe(es.replace(/\FF0000/g, "FF00FF"))
    .pipe(zlib.createGzip())
    .pipe(res)
}
