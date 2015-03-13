// When this file is executed, it makes a request to the eBay API, asking it to return
// message headers for a specific date range. It then 

var api = require('./../../config/ebay_config')(),
    crypto = require('crypto'),
    db = require('./../../config/db').ebay_messages,
    async = require('async'),
    _ = require('underscore');

api.makeRequest("GetMyMessages", {
    DetailLevel: "ReturnHeaders",

    StartTime: "2015-01-01T00:00:01Z",
    EndTime: "2015-02-18T00:00:00Z"

}, "json", null, function(err, response) {
    console.log(err, response);
    retrieveMessages(response.Messages.Message);
});

// Takes an array of messageIDs and then requests 10 messages at a time
// from the eBay API

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
    // Get an array of messages out of the response and loop through 
    var results = _.chain(messages).pluck("Messages").pluck("Message").flatten().map(function(message) {
        message._id = message.MessageID;
        if (!message.Content) {
            message.Content =  message.Text  
        }
        // replace all instances of "re:" and trim whitespace
        var subject_sanitised = message.Subject.replace(/re:/ig, "").trim();
        
        // Create a hash of the sanitised subject line that we can use to cross-reference
        // related messages into one conversation
        var subject_hashed = crypto.createHash('sha1').update(message.Sender + subject_sanitised, 'utf-8').digest("hex");
        message.conversation_id = subject_hashed;

        return message
    }).sortBy('ReceiveDate').value();
    
    results.forEach(function(message) {
        console.log("Saving.....", message.ReceiveDate);
        var thread = {
            _id: message.conversation_id,
            subject: message.Subject,
            last_message_date: message.ReceiveDate,
            status: "OPEN"
        }
        var threadAndMessage = [message, thread]
        db.save(threadAndMessage, function(error, response) {
        console.log("----------------response:", threadAndMessage[0]._id,  threadAndMessage[1]._id, response, error)
            if(response[1] && (response[1].error == "conflict")) {
                db.save(message.conversation_id, thread, function(e, r) {
                });
            }
        });
    });
}


// Takes an array and a number n, and returns an array of arrays, with each array having n number of elements
_.chunk = function(array, n) {
    var chunks = [];
    var numChunks = Math.ceil(array.length / n); // Round a number upwards to its nearest integer
    for (var i = 0; i < numChunks; i++) {
        chunks.push(array.slice(i * n, i * n + n));
    }
    return chunks;
}
