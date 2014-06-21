var fs = require('fs');

module.exports = function(app){

  app.resource("themes", require("./../controllers/themes"),  {
      load: parseRevision
  })
  
  app.post("/search", require("./../controllers/search"))
  app.get("/svg/:id/:colours", require("./../controllers/svg").show)
  
  app.resource("payments", require("./../controllers/payments"))
  app.resource("product_types", require("./../controllers/product_types"))
  app.resource("fonts", require("./../controllers/fonts"))
  var products = app.resource('products', require('./../controllers/products'), {
      load: parseRevision
  });
  var attachments = app.resource("attachments", require('./../controllers/attachments'));
  products.add(attachments);

  // Look at all the files in the current /routes directory and require them
  fs.readdirSync(__dirname).forEach(function(file) {
      if (file == "index.js") return;
      var name = file.substr(0, file.indexOf('.'));
      require('./' + name)(app);
  });
}

// Takes a request and parses the _rev and _id out of it
function parseRevision(req, id, callback) {
    var id_split = id.split("--");
    callback(null, { rev: id_split[1], id: id_split[0]})
}