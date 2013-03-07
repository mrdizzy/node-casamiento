var express = require('express'),
    http = require('http'),
    resource = require('express-resource'),
    importEbayMessage = require('./import_ebay_messages'),
    db = require('./config/db').test_ebay,
    partials = require('express-partials');

var app = express();

app.configure(function() {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.set('view options', {
        layout: false
    });
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
app.resource("themes", require("./controllers/themes"))

var products = app.resource('products', require('./controllers/products'), {
    load: function(req, id, callback) {
        var id_split = id.split("--");
        callback(null, { rev: id_split[1], id: id_split[0]})
    }
});
var attachments = app.resource("attachments", require('./controllers/attachments'));

products.add(attachments);

app.resource("conversations", require('./controllers/conversations'));
app.resource("paypal", require('./controllers/paypal'));

var ebay = app.resource("ebay", require('./controllers/ebay'));

ebay.get('/sample/:theme_id', require('./controllers/ebay').sample);

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
    app.get("/admin/products", require('./controllers/admin/products').index);
    
//Home page
app.get("/", function(req, res) {
    db.view('all/type', {
        key: 'product'
    }, function(error, documents) {
        res.render("welcome/index", {
            documents: documents.toArray()
        })
    })
});

http.createServer(app).listen(process.env.PORT, function() {
    console.log("Express server listening on port " + process.env.PORT);
});