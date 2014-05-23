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
exports.create = function(req, response) {
  var attachment_data = { name:"woff", "Content-Type":"application/font-woff"}
  console.log(req.files.woff.path)
  var readStream = fs.createReadStream(req.files.woff.path)
  var font = req.body;
  font.type = "font";
  db.save(font.name, font, function (err, res) {
    if(err) {
      console.log(err)
    } else {
      var writeStream = db.saveAttachment(res, attachment_data, function(error, resp) {
        console.log(error, resp)           
        response.status(200) 
      })
      readStream.pipe(writeStream);
    }
  });
}