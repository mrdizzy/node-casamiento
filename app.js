var express = require('express'),
    http = require('http'),
    compression = require('compression'),
    resource = require('express-resource'),
    db = require('./config/db').test_ebay,
    handlebars = require('express3-handlebars').create(),
    partials = require('express-partials'),
    expressLayouts = require('express-ejs-layouts');

var app = express();
var dir = __dirname;

function exposeTemplates(req, res, next) {
    // Uses the `ExpressHandlebars` instance to get the get the **precompiled**
    // templates which will be shared with the client-side of the app.
    handlebars.loadTemplates(dir + "/views/javascript_templates", {
        precompiled: true
    }, function (err, templates) {
        if (err) { return next(err); }

        // RegExp to remove the ".handlebars" extension from the template names.
        var extRegex = new RegExp(handlebars.extname + '$');

        // Creates an array of templates which are exposed via
        // `res.locals.templates`.
        templates = Object.keys(templates).map(function (name) {
            return {
                name    : name.replace(extRegex, ''),
                template: templates[name]
            };
        });

        // Exposes the templates during view rendering.
        if (templates.length) {
            res.locals.templates = templates;
        }

        next();
    });
}
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
    app.use(compression());
    app.use(expressLayouts)
    app.use(express.logger('dev'));
    app.use(express.bodyParser({limit:'100mb'}));
    
app.use(exposeTemplates);
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function() {
    app.use(express.errorHandler());
});

require('./routes')(app);
http.createServer(app).listen((process.env.PORT || 3000), function() {
    console.log("Express server listening on port " + (process.env.PORT || 3000));
});
