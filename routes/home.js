var colours = require('./../config/colours'),
    _ = require('underscore'),
    db = require('./../config/db').test_ebay,
    inGroupsOf = require('./../lib/in_groups_of');
    
module.exports = function(app){
    app.get("/", function(req, res) {
        db.view('products/name_place', function(error, documents) {
        var d = documents.toArray()
        console.log(d)
        d.documents = d
            res.render("welcome/index_2_old", {
                documents: d
            })
        })
    })
}