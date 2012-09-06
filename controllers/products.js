var db = require('couchdb-migrator').db,
async = require('async'),
fs = require('fs'), 
themes = ["ace-of-hearts", "simplicity", "rose", "chequers"],
product_types = ["invitation", "name_place", "wrap", "rsvp", "envelope"]

exports.show = function(req, res) {
    var stream = db.getAttachment(req.params["id"], req.params["filename"])
    stream.on("data", function(chunk) {
       res.write(chunk)
    });
    stream.on('end', function() {
        res.end(); 
    });
}
exports.index = function(req, res) {
    console.log(req.accepted);
    db.view('all/type', { key: 'product' }, function(err, documents) {
        res.render("products/index", { products: documents.toArray() } )
    });
};

exports.create =  function(req, res) {
    collateAttachments(req, function(err,collated) {
        var id = req.body.theme + "-" + req.body.product_type; // theme_name-product_type
       db.save(id, { _attachments: collated, type: "product"}, function(err, doc) {
           console.log(err,doc)
       })
    })
}

function collateAttachments(req,callback) {
 var collated = {}
    async.forEach(Object.keys(req.files), function(key, callback) {
        var thisFile = req.files[key];
        if (thisFile.size > 0) {
        fs.readFile(thisFile.path, function(err, data) {
            
            collated[key] = {}
            collated[key]["content_type"] = "image/png";
            collated[key]["data"] = data.toString('base64');
          
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
exports.new = 
    function(req, res) {
    res.render('products/new.ejs', { themes: themes, product_types: product_types })
}