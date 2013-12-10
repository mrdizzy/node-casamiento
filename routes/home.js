
    var colours = require('./../config/colours'),
    _ = require('underscore'),
    db = require('./../config/db').test_ebay,
    inGroupsOf = require('./../lib/in_groups_of');
    
    module.exports = function(app){
app.get("/", function(req, res) {
    db.view('products/name_place', function(error, documents) {
    var d = documents.toArray()
    d.hex_colours = _.uniq(colours.hex)
    d.colours_ref = colours.labels
    d.hex_colours = inGroupsOf(d.hex_colours, 16)
    d.documents = d
    console.log(d.colours_ref)
        res.render("welcome/index", {
            documents: d
        })
    })
})
}