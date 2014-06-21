var db = require('./../config/db').test_ebay,
fs = require('fs');

exports.new = function(req,res) {
  res.render('fonts/new', {layout:"admin_layout" });
}

exports.show = function(req, res) {
  var id = req.params.font;
  var stream = db.getAttachment(id, req.format)
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
  var woff_data = { name:"woff", "Content-Type":"application/font-woff"}
  var eot_data = { name: "eot", "Content-Type": "application/vnd.ms-fontobject"}
  var svg_data = { name: "svg", "Content-Type": "image/svg+xml"}
  
  var readStreamWoff = fs.createReadStream(req.files.woff.path)  
  var readStreamEot = fs.createReadStream(req.files.eot.path)
  var readStreamSvg = fs.createReadStream(req.files.svg.path)
  
  var font = req.body;
  font.type = "font";
  db.save(font.name, font, function (err, res) {
    if(err) { 
      console.log(err)
    } else {
      var writeStreamWoff = db.saveAttachment(res, woff_data, function(woff_error, woff_resp) {       
        if(woff_error) {
          console.log("Error saving woff", woff_error)
        } else {
        
        
                console.log("Uploaded WOFF")
            var writeStreamEot = db.saveAttachment(woff_resp, eot_data, function(eot_error, eot_resp) {       
              if(eot_error) {
                console.log("Error saving eot" ,eot_error)
              } else {
              
                console.log("Uploaded EOT")
              
               var writeStreamSvg = db.saveAttachment(eot_resp, svg_data, function(svg_error, svg_resp) {       
                if(svg_error) {
                  console.log("Error saving SVG")
                } else {
                console.log("Uploaded SVG")
                  response.status(200)
                  response.end()
                }
              })
              
      readStreamSvg.pipe(writeStreamSvg);
              
              
              
              
              }
            })
            
            readStreamEot.pipe(writeStreamEot);
        
        
        
        
        
        
        
        
        
         
        }
      })
      
      readStreamWoff.pipe(writeStreamWoff);
      
    }
  });
}

