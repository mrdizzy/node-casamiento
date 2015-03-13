var db = require('./../config/db').test_ebay,
  _ = require('underscore'),
  inGroupsOf = require('./../lib/in_groups_of');

var tags =  ["christmas", "victorian", "wallpaper", "damask", "contemporary", "pattern", "floral", "minimalistic", "geometric", "birds", "hearts", "vintage", "dots", "simple"].sort();
// Route: /ebay/:id
// This renders an ebay product view by looking in the /views/ebay/product_type folder for its template as different product types will need different rendering
exports.show = function(req, res) {
  var id = req.params.id,
  theme = id.split("-")[0],
  product_type = id.split("-")[1];
  
  db.get(id, function(err, doc) {
    db.view('products/name_place', function(err, related) {
      doc.related = related.toArray();
     
      doc.document = doc;
      doc.params = req.query
      res.render('ebay/' + product_type + 's/new.ejs', {
          layout: false,
          locals: doc
      });
    });
  })
}

exports.create = function(req, res) {
  var id = req.body.id,
    theme = id.split("-")[0],
    product_type = id.split("-")[1];
    
  if (!(req.body.tags instanceof Array)) req.body.tags = [req.body.tags] 
  
  db.get(id, function(err, doc) {
    var name = doc._id.replace(/_/g, " ").split("-")[0];
    doc.name = name.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    db.get(req.body.related_ids, function(err, related) {
    console.log(req.body.related_ids)
console.log("Related",related)
    //db.view('tags/by_tags', { key: req.body.tags }, function(err, related) {

      var related = related.toArray()
      related.forEach(function(related) {
        var name = related._id.replace(/_/g, " ").split("-")[0];
        related.name = name.replace(/\w\S*/g, 
          function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
      }) 
      
      // Exclude current main product from the related list!
      var found = _.find(related,function(obj) {
        return obj._id == id
      });
      related = _.without(related, found)
      doc.related = related;
      doc.document = doc;
      doc.params = req.body
      res.render('ebay/' + product_type + 's/new.ejs', {
        layout: false,
        locals: doc
      });
    });
  });
}

// POST to places with an array of ids for multiple place cards on one page
//exports.places = function(req, res, next) {
//  db.get(req.body.ids, function(err, docs) {
//
//    docs = docs.toArray();
//    docs.place_cards = docs;
//    console.log(docs.place_cards)
//    res.render('ebay/name_places/multiple_place_cards', {
//          layout: false,
//      locals: docs
//    });
//  });
//}

exports.places = function(req, res, next) {
  db.get(req.body.ids, function(err, docs) {
    var result = _.map(docs.toArray(), function(product) {
      for (var i=1; i< 5; i++) {
        var background;
        if(background = product["background-" + i]) {
          var divs = background.split("</div>");
          divs = _.map(divs, function(div) {
            if (!(/class="nocolor"/.test(div))) 
              div = div.replace(/style="/g, 'style="background-color:' + product.colours[1] + ";");  
            return div
          })          
          product["background-" + i] = divs.join("</div>")  
        }
      }    
      return product
    })
    var groups = inGroupsOf(result, 6);
    groups.groups = groups
    res.render('ebay/name_places/multiple_place_cards', {
      layout: false,
      locals: groups
    });
  })
}
exports.index = function(req, res) {
    db.view('products/all', function(err, docs) {
      var documents = _.groupBy(docs.toArray(), 'product_type');
      documents.tags =  tags;
      res.render('ebay/index', {
        layout: false,
        documents: documents
      });
  });
}

