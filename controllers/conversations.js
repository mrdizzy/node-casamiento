var messages = require('./../config/db').ebay_messages,
_ = require('underscore');

exports.index = function(req, res) {
    messages.view('conversations/all', { descending: true }, function(error, documents) {
        res.render("conversations/index", { layout:'admin_layout',
            documents: documents.toArray()
        });
    });
}
exports.destroy = function(req, res) {
    messages.merge(req.params.id, {
        status: "CLOSED"
    }, function(err, document) {
        if(err) {
            res.status(500).end();
        } else {
            res.status(200).end();
        }
    });
}
exports.show = function(req, res) {
    
    messages.view('conversations/messages_by_conversation', {
        key: req.params.conversation
        }, function(err, documents) {
        console.log(err,documents)
        var parsed = documents.toArray();
        parsed = _.map(parsed, function(c) {
            c.Content = c.Content.trim();
            c.Content = c.Content.replace(/-([\s\S]*?)Dear casamiento-wedding-stationery/m, "")
            return (c)
        });
        res.json(parsed);
    });
}