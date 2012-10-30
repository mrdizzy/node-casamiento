var express = require('express'),
    http = require('http'),
    resource = require('express-resource'),
    paypalController = require('./controllers/paypal'),
    importEbayMessage = require('./import_ebay_messages'),
    db = require('couchdb-migrator').databases.test_ebay,
    ebay = require('./controllers/ebay'),
    partials = require('express-partials');

var app = express();

app.configure(function() {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.set('view options', { layout: false });
    app.use(express.favicon());
    app.use(partials());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

// CONFIGURATION
app.configure('development', function() {
    app.use(express.errorHandler());
});
app.configure('production', function() {
    app.use(express.errorHandler());
});


var products = app.resource('products', require('./controllers/products'));
    var attachments  = app.resource("attachments", require('./controllers/attachments'));
    products.add(attachments);

app.resource("admin/products", require('./controllers/admin/products'));
app.resource("conversations", require('./controllers/conversations'));
app.resource("paypal", require('./controllers/paypal'));
app.resource("ebay", require('./controllers/ebay'));
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
        catch(e) {
            console.log(e);   
        }
        console.log(result);
        res.end();
    })
});

//Home page
app.get("/", function(req, res) {
    db.view('all/type', { key: 'product' }, function(error, documents) {
        res.render("welcome/index", {  
            documents: documents.toArray()
        })
    })
});

http.createServer(app).listen(process.env.PORT, function() {
    console.log("Express server listening on port " + process.env.PORT);
});