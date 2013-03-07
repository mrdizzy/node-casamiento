var db = require('./../config/db').test_ebay;

exports.index = function(req, res) {
    db.view('all/type', { key: "theme" },  function(err, docs) {
        console.log(err, docs)
    })
}

exports.create = function(req, res) {
    req.body.type = "theme"
    db.save(req.body, function(error, docs) {
        if(error) {
            console.log(error)
        } else {
            res.json(req.body)
            res.end()
        }
    })
}