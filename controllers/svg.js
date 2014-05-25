var db = require('./../config/db').test_ebay,
  _ = require('underscore');
  

exports.show = function(req, res) {

res.set("Content-Type", "text/plain")

res.set("Content-Encoding", "gzip")

  var stream = db.getAttachment("svg__damask-name_place", "gary2.svg.gz")
  stream.on("data", function(chunk) {
  console.log(chunk)
    res.write(chunk)
  });
  stream.on('end', function() {

    res.end();
  });

//    res.set("Content-Type", "image/svg+xml")
//    res.set("Content-Encoding", "gzip")
//  db.getAttachment("svg__damask-name_place", "damask.svgz", function (err, reply) {
//  if (err) {
//    console.log(err)
//   
//  }
//}).pipe(res)
//res.set(200)
//res.end()
// //db.get("svg__" + req.params.id, function(error, results) {
 //console.log(req.params.id, error)
 //  if(error) {
 //    res.json({})
 //  } else {
 //    res.json(results)
 //  }
 //})
  
}