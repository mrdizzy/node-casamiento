var xml2js = require('xml2js'),
    api = require('./../config/ebay_config')(),
    xmlParser = new xml2js.Parser({trim: false, normalize: false}), // Important whitespace settings to preserve newlines in XML-parsed messages
    db = require('./../config/database').db;
    
module.exports = readMessage;

function readMessage(xml, cb) {
    xmlParser.parseString(xml, function(err, json_data) {
        parseMessage(json_data, function(err, message) {
            if (err) {
                cb(err);
            }
            else {
                findCustomer(message, function(e, r) {
                    cb(e, r);
                });
            }
        })
    })
}

// Find a customer in the database by searching for the EIASToken of the message
function findCustomer(message, cb) {
    db.get(message.EIASToken, function(err, res) {
        if (err && err.error == 'not_found' && err.reason == 'missing') {
            message.customer = message.EIASToken;
            createCustomer(message, cb);
        }
        else if (!err) {
            console.log("FOUND CUSTOMER!", res.UserIDs);
            message.customer = res._id;
            db.save(message, function(e, r) {
                cb(e, r);
            })
        }
        else {
            cb(err, res);
        }
    })
}

function createCustomer(message, cb) {
    db.save([message,
    {
        _id: message.EIASToken,
        type: "Customer",
        UserIDs: [message.Sender]
    }], function(err, res) {
        var customer_record = res[1];
        if (customer_record.error == 'conflict') {
            findCustomer(message, cb);
        }
        else {
            cb(err, res);
        }
    });
}

function parseMessage(message, cb) {
    if (message["soapenv:Body"]) { // Pass message from ebay NOTIFY or from an xml file
    var m = message["soapenv:Body"].GetMyMessagesResponse.Messages.Message;
    } else {
        var m = message.Messages.Message;
    }
    m.type = "ebay_message";
    m._id = m.Sender + '-' + m.MessageID;
    delete m.SendingUserID;
    delete m.RecipientUserID;
    delete m.SendToName;
    delete m.Flagged;
    delete m.Read;
    delete m.Folder;
    delete m.Replied;
    if (!m.Content) {
        m.Text = m.Text.replace('<![CDATA[', '');
        m.Text = m.Text.replace(/]]>$/, '');
        m.Text = m.Text.replace(/<(?:.|\n)*?>/gm, '');
        m.Content = m.Text;
    }
    delete m.Text;
    getEiasTokenForUser(m.Sender, function(err, res) {
        m.EIASToken = res;
        cb(err, m);
    })
}

function getEiasTokenForUser(userId, cb) {
    api.makeRequest("GetUser", function(err, res) {

        if (res && res.User && res.User.EIASToken) {
            var user = res.User.EIASToken;
        }
        else {
            err = err || {
                reason: "Could not get EIASToken"
            }
        }
        cb(err, user);
    }, {
        UserID: userId
    }, "json")
}