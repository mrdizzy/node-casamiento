var express = require('express'),
    http = require('http'),
    productsController = require('./controllers/products'),
    paypalController = require('./controllers/paypal'),
    importEbayMessage = require('./import_ebay_messages'),
    db = require('couchdb-migrator').databases.test_ebay,
    conversationsController = require('./controllers/conversations'),
    partials = require('express-partials');

var app = express();

app.configure(function() {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
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
app.get("/paypalrecent",paypalController.index);
app.get('/catalog/ebay/:id', function(req, res) {
    var id = req.params.id;
    db.get(id, function(error, document) {
        console.log(document);
        res.render('catalog/product_ebay.ejs',  {layout:false, locals: document}); 
    });
});

app.get('/catalog/:id', function(req, res) {
    var id = req.params.id;
    db.get(id, function(error, document) {
        res.render('catalog/product.ejs', {locals: document}); 
    });
});

// Products
app.get("/products/:id/attachments/:filename", productsController.show);
app.get("/products/:id/attachments/:filename.:png/", productsController.show);

app.put("/products/:productId", productsController.update);
app.get("/products", productsController.index);
app.post("/products", productsController.create)
app.get('/products/new', productsController.new);

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

// Conversations
app.get("/conversations", conversationsController.index);
app.delete("/conversations/:id", conversationsController.destroy);
app.get("/conversations/:id", conversationsController.show);

//Home page
app.get("/", function(req, res) {
    db.view('all/type', { key: 'product' }, function(error, documents) {
        res.render("welcome/index", {  
            documents: documents.toArray()
        })
    })
});

http.createServer(app).listen(process.env.C9_PORT, function() {
    console.log("Express server listening on port " + process.env.C9_PORT);
});