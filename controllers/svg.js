var db = require('./../config/db').test_ebay,
  zlib = require('zlib'),
  es = require('event-stream');
  
exports.show = function(req, res) {
  var id = req.params.id,
    colours = req.params.colours;
  var colour_1 =  colours.split("_")[0] || colours;
  var colour_2 =  colours.split("_")[1];
  // The gzipped version is stored in CouchDB. The gzipped version is NOT 
  // created in Illustrator using its own compressed version, rather a normal 
  // SVG file is created and then gzipped using 7Zip software to create the 
  // gzipped file. This is then uploaded to CouchDB as an attachment. 
  
  // We get the attachment and decompress it using zlib, then use the event-stream
  // library to replace instances of the colours and pipe it back to the response
  // after recompressing it
  res.set("Content-Encoding", "gzip")
  res.set("Content-Type", "image/svg+xml")
  if(colour_2) {
    db.getAttachment("svg__" + id, "svg")
      .pipe(zlib.createGunzip())
      // Make sure the regexes are in this order (blue first, then red), 
      // as for some reason altering these makes the regexes much slower!
      // We need to work out why!
      .pipe(es.replace(/0000FF/g, colour_1)) // 0000FF is red
      .pipe(es.replace(/FF0000/g, colour_2)) // FF0000 is blue      
      .pipe(zlib.createGzip())
      .pipe(res)
  }
  else {
    db.getAttachment("svg__" + id, "svg")
      .pipe(zlib.createGunzip())
      .pipe(es.replace(/FF0000/g, colour_1)) // FF0000 is red
      .pipe(zlib.createGzip())
      .pipe(res)
  }
}
