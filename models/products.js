var db = require('couchdb-migrator').db,
async = require('async'),
fs = require('fs');


exports.create =  function(req, res) {
    collateAttachments(req, function(err,collated) {
       db.save({name: req.body.name, _attachments: collated}, function(err, doc) {
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