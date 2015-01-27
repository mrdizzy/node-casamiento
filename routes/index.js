var fs = require('fs');

module.exports = function(app){

  app.get("/svg/:id/:colours", require("./../controllers/svg").show)
  
  app.get("/svg/:id", require("./../controllers/svg").show)
  app.resource("payments", require("./../controllers/payments"))
  app.resource("fonts", require("./../controllers/fonts"))
  var products = app.resource('products', require('./../controllers/products'), {
      load: parseRevision
  });
  app.get("/products/tags/:tag", require('./../controllers/products').tags)
  var attachments = app.resource("attachments", require('./../controllers/attachments'));
  products.add(attachments);
  
  // eBay
  app.get("/ebay", require('./../controllers/ebay').index);
  app.post("/ebay", require('./../controllers/ebay').create);
  app.get('/ebay/:id', require('./../controllers/ebay').show)
  
  app.post("/ebay/places", require('./../controllers/ebay').places)
  
  // Admin  
  app.get("/admin/products", require('./../controllers/admin/products').index); 
  
  app.get("/admin/orders", require('./../controllers/admin/orders').index); 
  app.resource("conversations", require('./../controllers/conversations'));
  app.resource("invoices", require('./../controllers/invoices'))

  // Homepage
  app.get("/", require("./../controllers/welcome").index)
}

// Takes a request and parses the _rev and _id out of it
function parseRevision(req, id, callback) {
  var id_split = id.split("--");
  if(id_split[1] == "undefined") {
    id_split[1] = undefined;
  }
  callback(null, { rev: id_split[1], id: id_split[0]})
}