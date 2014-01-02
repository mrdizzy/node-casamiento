var db = require('./../config/db').test_ebay;

exports.index = function(req, res) {
    db.view('all/type', { key: "theme" },  function(err, docs) {
        res.render('admin/themes', {themes: docs.toArray(), layout:"admin_layout" })
    })
}

exports.destroy = function(req, res) {
    db.remove(req.theme.id, req.theme.rev, function(error, docs) {
        console.log(error)
        res.end();
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