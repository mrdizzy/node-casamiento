var api = require('./../config/ebay_config')(),
    crypto = require('crypto'),
    db = require('./../config/db').ebay_messages,
    async = require('async'),
    _ = require('underscore');

_.chunk = function(array, n) {
    var chunks = [];
    var numChunks = Math.ceil(array.length / n);
    for (var i = 0; i < numChunks; i++) {
        chunks.push(array.slice(i * n, i * n + n));
    }
    return chunks;
}
api.makeRequest("GetMyMessages", {
    DetailLevel: "ReturnHeaders",
    StartTime: "2012-10-08T00:00:01Z",
    EndTime: "2013-04-25T00:00:00Z"
}, "json", null, function(err, response) {
    console.log(err, response);
    retrieveMessages(response.Messages.Message);
});

function retrieveMessages(messages) {
    var messageIDs = _.pluck(messages, "MessageID");
    var groupedMessageIDs = _.chunk(messageIDs, 10);
    async.map(groupedMessageIDs, function(messageIDs, callback) {
        api.makeRequest("GetMyMessages", {
            MessageIDs: {
                MessageID: messageIDs
            },
            DetailLevel: "ReturnMessages"
        }, "json", null, callback)

    }, saveToDatabase);
}

function saveToDatabase(err, messages) {
    var results = _.chain(messages).pluck("Messages").pluck("Message").flatten().map(function(message) {
        message._id = message.MessageID;
        if (!message.Content) {
            message.Content =  message.Text  
        }
        var subject_sanitised = message.Subject.replace(/re:/ig, "").trim();
        var subject_hashed = crypto.createHash('sha1').update(message.Sender + subject_sanitised, 'utf-8').digest("hex");

        message.conversation_id = subject_hashed;

        return message
    }).sortBy('ReceiveDate').value();
    
    results.forEach(function(message) {
        console.log(message.ReceiveDate);
        var thread = {
            _id: message.conversation_id,
            subject: message.Subject,
            last_message_date: message.ReceiveDate,
            status: "OPEN"
        }
        var threadAndMessage = [message, thread]
        db.save(threadAndMessage, function(error, response) {
            if(response[1].error == "conflict") {
                db.save(message.conversation_id, thread, function(e, r) {
                });
            }
        });
    });
}
