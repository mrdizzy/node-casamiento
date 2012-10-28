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

// PAYPAL
app.get("/paypalrecent",paypalController.index);

// EBAY
app.get('/catalog/ebay/:id', function(req, res) {
    var id = req.params.id;
    db.get(id, function(error, document) {
        console.log(document);
        res.render('catalog/product_ebay.ejs',  {layout:false, locals: document}); 
    });
})

app.get('/ebay', ebay.index);
app.get('/ebay/:theme_id', ebay.show);
app.get('/ebay/sample/:theme_id', ebay.sample);

// main catalog

app.get('/catalog/:id', function(req, res) {
    var id = req.params.id;
    db.get(id, function(error, document) {
        res.render('catalog/product.ejs', {locals: document}); 
    });
});

var products = app.resource('products', require('./controllers/products'));
    var attachments  = app.resource("attachments", require('./controllers/attachments'));
    products.add(attachments);

app.resource("conversations", require('./controllers/conversations'));

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
app.get("/poo.:format?", function(req, res) {
    console.log(req.format);
    res.format({
       html: function() {
           console.log("html");
       },
       text: function() {
           console.log("text");
       },
       json: function() {
           console.log("json");
       }
        
    });
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