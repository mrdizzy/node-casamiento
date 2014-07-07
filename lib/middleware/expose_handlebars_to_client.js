var handlebars = require('express3-handlebars').create();

  // Middleware for compiling and exposing javascript server-side templates to client side
module.exports = function exposeTemplates(req, res, next) {
  // Uses the handlebars instance, required at the top of this page, to read in 
  // the templates and precompile them to be shared with the client-side of the app. 
  handlebars.loadTemplates(__dirname + "./../../views/javascript_templates", {
      precompiled: true
  }, function (err, templates) {
    if (err) { return next(err); }

    // RegExp to remove the ".handlebars" extension from the template names.
    var extRegex = new RegExp(handlebars.extname + '$');

    // Creates an array of templates which are exposed via res.locals.templates
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