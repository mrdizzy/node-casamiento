var express = require('express'),
  http = require('http'),
  compression = require('compression'), // gzip compression for static files
  resource = require('express-resource'),
  db = require('./config/db').test_ebay,
  exposeTemplates = require('./lib/middleware/expose_handlebars_to_client'),
  partials = require('express-partials'),
  expressLayouts = require('express-ejs-layouts');
  assetManager = require('connect-assetmanager');
  //Cacher = require("cacher"); 
  //var cacher = new Cacher();
  
var app = express();
var dir = __dirname; // The name of the directory that the currently executing script resides in.

// We use the connect-assetmanager module to concatenate and serve javascript and CSS files.
var assetManagerGroups = {
  'css': { 
    route: /\/static\/css\/all\.css/, // This is the name of the route that will create this file
    path: __dirname + '/public/stylesheets/',
    dataType: 'css',
    // These files must be availble in the directory specified by path above
    // Make sure they are in the right order--stylesheets cascade! Reponsive last!
    files: [ 'reset.css', 'new_color_picker.css', 'font_picker.css', 'main.css',  'product.css', 'browse.css', 'place_cards.css', 'ui_print_alert_box.css', 'print.css' ]
  },
  'js': { 
    route: /\/static\/javascripts\/all\.js/,
    path: __dirname + '/public/javascripts/libraries/',
    dataType: 'javascript',
    files: [ 'localstorage.min.js', 'viewport.js', 'fastclick.js', 'picturefill.min.js', 'in_groups_of.js', 'font_loader.js', 'new_font_picker.js','new_color_picker.js', 'jquery_form.js', 'jquery.slides.min.js' ]
  },
  'adminjs': {
      route: /\/static\/javascripts\/admin\.js/,
      path: __dirname + '/public/javascripts/libraries/',
      dataType: 'javascript',
      files: [ "handlebars_helpers.js", "handlebars.form-helpers.js","backbone_selection_view.js", 'backbone_syphon.js', 'attachments.js' ]
  }
};

// Fonts need to be served with Access-Control-Allow-Origin set to * if
// FireFox is to support cross-domain downloading of them (e.g. from an eBay listing)
app.configure(function(){
  app.use(function(req, res, next) {
    var matchUrl = '/f';
    if (req.url.substring(0, matchUrl.length) === matchUrl) {
      res.setHeader("Access-Control-Allow-Origin", "*");
    } else if (req.url.substring(0, "/fonts".length) === "/fonts") { // match /fonts as well as /f
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
    
    // Compresses static files and res.json responses    
    app.use(compression()); // must be one of the first middlewares to compress effectively
    
    app.use(express.cookieParser());
    app.use(express.favicon());
    app.use(expressLayouts);
    
    app.use(assetManager(assetManagerGroups)); // CSS and javascript files concatenated
    
    app.use(express.logger('dev'));
    app.use(express.bodyParser({limit:'100mb'}));
    app.use(exposeTemplates); // exposes server side javascript templates to client side
    
    app.use(express.static(__dirname + '/public'));
    
  // app.use(cacher.cache('seconds', 1000))
    app.use(app.router);
    // Error handling function for 404s and 500s
    app.use(function (err, req, res, next) {
      res.send("There was an error!" + err);
    })
});

app.configure('development', function() {
    app.use(express.errorHandler());
});

require('./routes')(app);

http.createServer(app).listen((process.env.PORT || 3000), function() {
console.log(process.env.NODE_ENV)
  console.log("Express server listening on port " + (process.env.PORT || 3000));
});


// Testing of node cacher
/*cacher.on("hit", function(key) {
  console.log(key, "woohoo!")
})
cacher.on("miss", function(key) {
  console.log("doh!")
})
cacher.on("error", function(key) {
  console.log(err)
})
*/