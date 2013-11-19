var express = require('express'),
    http = require('http'),
    _ = require('underscore'),
    
    inGroupsOf = require('./lib/in_groups_of'),
    colours = require('./config/colours'),
    resource = require('express-resource'),
    importEbayMessage = require('./import_ebay_messages'),
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

// EBAY

app.get('/ebayplaces', require('./controllers/ebay').places);
var ebay = app.resource("ebay", require('./controllers/ebay'));

    ebay.get('/sample/:theme_id', require('./controllers/ebay').show);
app.get('/ebay_single_places/:id', require('./controllers/ebay').name_place_single)

// The eBay Notify API posts a message to this address that we need to parse
app.post('/ebay', function(req, res) {
    var result = "";
    req.on('data', function(chunk) {
        result += chunk;
        console.log(result);
    })
    req.on('end', function() {
        try {
            importEbayMessage(result, function(e, r) {
                console.log("DONE", e, r);
            })
        }
        catch (e) {
            console.log(e);
        }
        console.log(result);
        res.end();
    })
});

// 
//    Admin
//
app.get("/admin/products", require('./controllers/admin/products').index);
    
//Home page
app.get("/", function(req, res) {
    db.view('products/name_place', function(error, documents) {
    var d = documents.toArray()
    d.hex_colours = _.uniq(colours.hex)
    d.colours_ref = colours.labels
    d.hex_colours = inGroupsOf(d.hex_colours, 24)
    d.documents = d
    console.log(d.colours_ref)
        res.render("welcome/index", {
            documents: d
        })
    })
});

app.resource("conversations", require('./controllers/conversations'));

// ebay methods
app.resource("paypal", require('./controllers/paypal'));

http.createServer(app).listen((process.env.PORT || 3000), function() {
    console.log("Express server listening on port " + (process.env.PORT || 3000));
});

// Takes a request and parses the _rev and _id out of it
function parseRevision(req, id, callback) {
        var id_split = id.split("--");
        callback(null, { rev: id_split[1], id: id_split[0]})
    }