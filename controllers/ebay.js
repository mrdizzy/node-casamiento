var db = require('./../config/db').test_ebay,
    _ = require('underscore');

// Route: /ebay/:id
// This renders an ebay product view by looking in the /views/ebay/product_type folder for its template as different product types will need different rendering
exports.show = function(req, res) {
    var id = req.params.id,
    theme = id.split("-")[0],
    product_type = id.split("-")[1];
    
    db.get(id, function(err, doc) {
    db.view('products/name_place', function(err, related) {
    var related = related.toArray()
       related.forEach(function(related) {
           related.divs = prepareDivs(related, "thumbnail", "thumbnail", "display")
       })
        doc.related = related;
      var divs = prepareDivs(doc);
        doc.document = doc;
        doc.divs = divs;
        res.render('ebay/' + product_type + 's/14_nov_13.ejs', {
            layout: false,
            locals: doc
        });
    });
    })
}
exports.places = function(req, res) {
       db.view('products/name_place', function(err, docs) {
       
        res.render('ebay/name_places/name_places_new_trial', {
            layout: false,
            documents: docs
        });
    });
}
exports.index = function(req, res) {
    db.view('products/all', function(err, docs) {
    var documents = _.groupBy(docs.toArray(), 'product_type');

        res.render('ebay/index', {
            layout: false,
            documents: documents
        });
    });
}


function prepareDivs(object, id, klass, size) {
    if(id == undefined) {
        id = "slide"
    }
    if (klass == undefined) {
        klass= "slide"
    }
    if(size == undefined) {
        size="display"
    }
var results = []
    object.attachments_order.forEach(function(number) {
        if (object['background-' + number]) {
            var compiled = _.template(object['background-' + number]);
            var result = compiled({colour: object.colours[1]});   
        }
        var html = '<div id="' + id + number + '" class="' + klass+ '_container_' + number + " "+ klass + '_container colour_0" style="background-color:' + object.colours[0] + '">';
        html = html + '<img src="http://www.casamiento.co.uk/products/' + object._id + '/attachments/' + size + '-' + number + '" class="' + klass + '_image" />'
      if ((typeof  object["background-" + number]) !== "undefined") {
        html = html + '<div class="' + klass + '_background_container colour_1">' + result + '</div>'
      }
      html = html + '</div>'
      results.push(html)
     })  
     return results;
     
}