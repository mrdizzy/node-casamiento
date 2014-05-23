var db = require('./../config/db').test_ebay,
fs = require('fs');
exports.new = function(req,res) {
  res.render('fonts/new', {layout:"admin_layout" });
}


exports.show = function(req, res) {
  var id = req.params.font;
  console.log(id)
  var stream = db.getAttachment(id, "woff")
  stream.on("data", function(chunk) {
    res.write(chunk)
  });
  stream.on('end', function() {
  console.log("ENDED")
    res.end();
  });
}

exports.index = function(req, res) {
db.view('all/type', {
        key: "font"
    }, function(error, docs) {
        if (error) {
            console.log(error)
        }
        else {
            res.render("fonts/index", { layout: "admin_layout", locals: {fonts: docs.toArray()}})
        }
    })
  
}
exports.create = function(req, res) {
var font = req.body;{}
font.type = "font";
var files = req.files;
woff = req.files
db.save(font.name, font, function (err, res) {
  if(err) {
    console.log(err)
  } else {
  db.saveAttachment(res, { name:"woff", "Content-Type":"application/font-woff"}, function(err, res) {
  console.log(err, res)
  }, fs.createReadStream(req.files.woff.path))
    
  }
});
  res.status(200)
}