var messages = require('couchdb-migrator').databases.ebay_messages,
_ = require('underscore');

exports.index = function(req, res) {
    messages.view('conversations/all', function(error, documents) {
        res.render("conversations/index", {
            documents: documents.toArray()
        });
    });
}
exports.destroy = function(req, res) {
    messages.merge(req.params.id, {
        status: "CLOSED"
    }, function(err, res) {
        console.log(err, res);
    });
}
exports.show = function(req, res) {
    messages.view('conversations/messages_by_conversation', {
        key: req.params.id
    }, function(err, documents) {
        var parsed = documents.toArray();
        parsed = _.map(parsed, function(c) {
            c.Content = c.Content.trim();
            c.Content = c.Content.replace(/-([\s\S]*?)Dear casamiento-wedding-stationery/m, "")
            return (c)
        });
        res.json(parsed);
    });
}