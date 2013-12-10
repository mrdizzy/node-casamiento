var express = require('express'),
    http = require('http'),
    resource = require('express-resource'),
    db = require('./config/db').test_ebay,
    partials = require('express-partials');

var app = express();

// Fonts need to be served with Access-Control-Allow-Origin set to * if
// FireFox is to support cross-domain downloading of them (e.g. from an eBay listing)
app.configure(function(){
  app.use(function(req, res, next) {
    var matchUrl = '/f';
    if(req.url.substring(0, matchUrl.length) === matchUrl) {
      res.setHeader("Access-Control-Allow-Origin", "*");
    }
    return next();
  });
});

app.configure(function() {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.set('view options', {
        layout: false
    });
    app.use(express.cookieParser());
    app.use(express.favicon());
    app.use(partials());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function() {
    app.use(express.errorHandler());
});

require('./routes')(app);

app.resource("themes", require("./controllers/themes"),  {
    load: parseRevision
})

app.resource("cart", require("./controllers/cart"))
app.resource("product_types", require("./controllers/product_types"))

var products = app.resource('products', require('./controllers/products'), {
    load: parseRevision
});
var attachments = app.resource("attachments", require('./controllers/attachments'));

products.add(attachments);

http.createServer(app).listen((process.env.PORT || 3000), function() {
    console.log("Express server listening on port " + (process.env.PORT || 3000));
});

// Takes a request and parses the _rev and _id out of it
function parseRevision(req, id, callback) {
        var id_split = id.split("--");
        callback(null, { rev: id_split[1], id: id_split[0]})
    }