var db = require('./../config/db').test_ebay,
  _ = require('underscore'),
  fs = require('fs');

exports.index = function(req, res) {

fs.readFile("svg_template.svg", 'utf8', function(err, data) {
console.log(err)
  data = data.replace(/\#FF0000/g, "#00DDCC")
  res.set("Content-Type", "image/svg+xml")
  res.send(data)
  res.end();
})
}

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
  var stream = db.getAttachment("svg__" + req.params.id, "svg")
  var data = "";
  stream.on("data", function(chunk) {
  data = data + chunk.toString();
   // res.write(chunk)
  });
  stream.on('end', function() {
  console.log(data)
    res.end();
  });

// //db.get("svg__" + req.params.id, function(error, results) {
  
}

exports.show = function(req, res) {
  
fs.readFile("svg_template.svg", 'utf8', function(err, data) {
  data = data.replace(/\FF0000/g, req.params.id)
  res.set("Content-Type", "image/svg+xml")
  res.send(data)
  res.end();
})
  
}

/*exports.show = function(req, res) {

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
  var stream = db.getAttachment("svg__" + req.params.id, "svg")
  var data = "";
  stream.on("data", function(chunk) {
  data = data + chunk.toString();
   // res.write(chunk)
  });
  stream.on('end', function() {
  console.log(data)
    res.end();
  });

// //db.get("svg__" + req.params.id, function(error, results) {
  
}
*/

