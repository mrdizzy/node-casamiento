var express = require('express'),
    http = require('http'),
    productsController = require('./controllers/products'),
    importEbayMessage = require('./import_ebay_messages'),
    db = require('couchdb-migrator').db;

var app = express();

app.configure(function() {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.favicon());
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


app.get('/catalog/:id', function(req, res) {
    var id = req.params.id;
    db.get(id, function(error, document) {
        console.log(document);
        res.render('catalog/product.ejs', document); 
    });
});

// Products
app.get("/products/:id/attachments/:filename", productsController.show);
app.delete("/products/:productId/attachments/:id", function(req, res) {
    console.log(req.params); 
});
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

http.createServer(app).listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'));
});