var cradle = require('cradle'),
    connection = new(cradle.Connection)('https://casamiento.iriscouch.com', 443, {
        auth: {
            username: "casamiento",
            password: "floppsy1"
        },
        cache: false
    }),
    databases = {}

databases.test_import = connection.database("test_import");
databases.ebay_messages = connection.database("ebay_messages");
databases.test_ebay = connection.database("test_ebay");
databases.boo = connection.database("boo");

databases.test_ebay.documents = [
// Design documents

// Security 

{
    _id: '_design/blockAnonymousWrites',
    language: "javascript",
    validate_doc_update: function(new_doc, old_doc, userCtx) {
        if (userCtx.name != 'casamiento') {
            throw ({
                forbidden: "Not Authorized"
            });
        }
    }
}, {
    _id: "_security",
    "admins": {
        "names": [],
        "roles": ["admin"]
    },
    "members": {
        "names": [],
        "roles": []
    }
},

// Customers 

{
    _id: '_design/customers',
    language: "javascript",
    views: {
        by_email: {
            map: function(doc) {
                if (doc.type == 'Customer') {
                    doc.emails.forEach(function(email) {
                        emit(email, doc)
                    });
                }
            }
        },
        email_for_customer: {
            map: function(doc) {
                if (doc.type == 'Customer') {
                    doc.emails.forEach(function(email) {
                        emit([email, 0], doc);
                    })
                }
                else if (doc.type == 'email') {
                    emit([doc.From, 1], doc);
                }
            }
        },
        by_id_and_email: {
            map: function(doc) {
                if (doc.type == "Customer") {
                    doc.emails.forEach(function(email) {
                        emit([doc._id, email], doc);
                    })
                }
            }
        }
    }
},

// ALL
{
    _id: '_design/all',
    language: "javascript",
    views: {
        type: {
            map: function(doc) {
                if (doc.type) {
                    emit(doc.type, doc);
                }
            }
        }
    }
},

{
    _id: '_design/products',
    language: "javascript",
    views: {
        by_type: {
            map: function(doc) {
    if (doc.type && doc.type == 'product') {
  emit(doc._id, doc)
}
}
        }
    }
},
{
    _id: '_design/paypal',
    language: "javascript",
    views: {
        by_type: {
            reduce: function(keys, values, rereduce) {
                return sum(values);
            },
            map: function(doc) {
                emit(doc.L_TYPE, 1);
            }
        },
        customers: {
            map: function(doc) {
                if (doc.L_AMT) {
                    var amount = parseFloat(doc.L_AMT);
                }
                if (doc.L_TYPE == "Payment" && amount > 0) {
                    emit(doc.L_TIMESTAMP, doc);
                }
            }
        },
        sales: {
            map: function(doc) {

                if (doc.L_AMT) {
                    var amount = parseFloat(doc.L_AMT);
                }
                if ((doc.L_TYPE == "Payment" && amount > 0) || (doc.L_TYPE == "Refund" && amount < 0)) {
                    emit(doc.L_TIMESTAMP, doc);
                }
            },
        },
        suppliers: {
            map: function(doc) {
                var amount;
                var date = doc.L_TIMESTAMP.substring(0, 7)
                if (doc.L_NAME == "Fee") {
                    var card_name = "PayPal"
                }
                else if (doc.RECEIVERID) {
                    var card_name = doc.L_NAME + " " + doc.RECEIVERID;
                }
                else {
                    var card_name = doc.L_NAME;
                }
                if (doc.L_AMT) {
                    amount = parseFloat(doc.L_AMT);
                }
                if (((doc.L_TYPE == "Payment" || doc.L_TYPE == "Fee" || doc.L_TYPE == "Transfer") && amount < 0) || (doc.L_TYPE == "Refund" && amount > 0)) {
                    emit([date, card_name], {
                        name: card_name,
                        email: doc.L_EMAIL
                    });
                }
            },
            reduce: function(keys, values) {
                return {
                    email: values[0].email,
                    name: values[0].name
                }
            }
        },
        expenses: {
            map: function(doc) {
                if (doc.L_NAME == "Fee") {
                    var card_name = "PayPal"
                }
                else if (doc.RECEIVERID) {
                    var card_name = doc.L_NAME + " " + doc.RECEIVERID;
                }

                if (doc.L_AMT) {
                    var amount = parseFloat(doc.L_AMT);
                }
                var myob_account = doc.MYOB_ACCOUNT;
                if (!myob_account) {
                    myob_account = "69999"
                }
                if ((doc.L_TYPE == "Payment" || doc.L_TYPE == "PayPal Services" || doc.L_TYPE == "Fee" || doc.L_TYPE == "Transfer") && amount < 0) {
                    emit(doc.L_TIMESTAMP, {
                        name: card_name,
                        _id: doc._id,
                        date: doc.L_TIMESTAMP,
                        amount: amount * -1,
                        account: myob_account
                    });
                }
                else if (doc.L_TYPE == "Transfer" && amount > 0) {
                    emit(doc.L_TIMESTAMP, {
                        name: "Cahoot",
                        _id: doc._id,
                        date: doc.L_TIMESTAMP,
                        amount: amount,
                        account: 12160
                    });
                }
            }
        },
        received: {
            map: function(doc) {
                if (doc.L_NAME == "Fee" || doc.L_TYPE == "Fee Reversal") {
                    var card_name = "PayPal"
                }
                else if (doc.RECEIVERID) {
                    var card_name = doc.L_NAME + " " + doc.RECEIVERID;
                }

                if (doc.L_AMT) {
                    var amount = parseFloat(doc.L_AMT);
                }
                var myob_account = doc.MYOB_ACCOUNT;
                if (!myob_account) {
                    myob_account = "69999"
                }
                if ((doc.L_TYPE == "Reversal" || doc.L_TYPE == "Refund" || doc.L_TYPE == "Fee Reversal") && amount > 0) {
                    emit(doc.L_TIMESTAMP, {
                        name: card_name,
                        _id: doc._id,
                        date: doc.L_TIMESTAMP,
                        amount: amount,
                        account: myob_account
                    });
                }
            }
        },
        time: {
            map: function(doc) {
                emit(doc.L_TIMESTAMP, doc);
            }
        },
        types: {
            map: function(doc) {
                emit([doc.L_TIMESTAMP, doc._id], [doc.L_AMT, doc.L_TYPE, doc.L_CURRENCYCODE]);
            }
        },
        by_date_and_type: {
            map: function(doc) {
                emit([doc.L_TIMESTAMP, doc.L_TYPE], doc);
            }
        }
    }
},


{
    _id: '_design/customers',
    language: "javascript",
    views: {
        ebay_messages_by_customer: {
            map: function(doc) {
                if (doc.type == "Customer") {
                    emit([doc._id, 0], {
                        _id: doc._id,
                        type: doc.type,
                        user_id: doc.UserIDs[0]
                    });
                }
                else if (doc.type == "ebay_message") {
                    emit([doc.customer, 1], {
                        _id: doc._id,
                        type: doc.type,
                        Sender: doc.Sender,
                        Subject: doc.Subject,
                        Content: doc.Content
                    });
                }
            }
        }
    }
},
// MYOB ACCOUNTS
{
    _id: "myob_accounts",
    accounts: {
        11200: "Computer Hardware",
        11210: "Computer Hardware Acc Depre",
        11300: "Plant & : Machinery",
        11310: "Plant & Machinery Acc Depre",
        12101: "Cahoot Current Account",
        12160: "PayPal",
        41100: "Sales Type 1",
        44124: "Interest",
        51100: "Paper & Card",
        51200: "Ink",
        51300: "Embellishments",
        52010: "Postage",
        52020: "Packaging",
        56000: "Glue",
        61925: "Telephone",
        61945: "Postage",
        61955: "Books, magazine & reference",
        61965: "Graphic Design Services",
        61975: "Web services",
        31100: "Money invested",
        31200: "Money withdrawn",
        62450: "eBay",
        63500: "Sotware Subscriptions",
        65000: "PayPal Fees",
        68000: "Miscellaneous"
    }
},
// Customers
{
    _id: "nY+sHZ2PrBmdj6wVnY+sEZ2PrsA2dj6wFk4CoAZeCoAqdj6x9nY+seQ==",
    name: "David Pettifer",
    emails: ["david.p@dizzy.co.uk", "david.p@casamiento.co.uk", "david.pettifer@dizzy.co.uk"],
    type: "Customer",
    UserIDs: ["casamiento"]
}, {
    _id: "ANEIASTOKEN",
    name: "Helena Betts",
    emails: ["helena@helena.com"],
    type: "Customer",
    UserIDs: ["happyhele"]
}, {
    _id: "EIASTOKENFORGARY",
    name: "G COOLEY",
    type: "Customer",
    emails: ["garycoo@coo.com"],
}, {
    _id: "1",
    name: "Gary Cooley",
    type: "Customer",
    emails: ["rebelcoo7@hotmail.com"],
    UserIDs: ["rebelcoo7"]
}, {
    _id: "2",
    name: "Helena Betts",
    type: "Customer",
    emails: ["happyhele@hotmail.com", "helena.betts@fatima.com"]
},
// Emails
{
    Subject: "Hello",
    From: "david.pettifer@dizzy.co.uk",
    Content: "Some content",
    customer: 'nY+sHZ2PrBmdj6wVnY+sEZ2PrsA2dj6wFk4CoAZeCoAqdj6x9nY+seQ==',
    type: "email"
}, {
    Subject: "Another one",
    From: "rebelcoo7@hotmail.com",
    Content: "Some more content",
    customer: '1',
    type: "email"

}, {
    // Ebay Messages
    _id: 'rebelcoo7-1234',
    Subject: "An ebay message",
    Sender: "rebelcoo7",
    Content: "Some stuff",
    customer: '1',
    MessageID: '1234',
    type: "ebay_message"
}, {
    _id: 'casamiento-9999',
    Subject: "Another one",
    Sender: "casamiento",
    Content: "Blah",
    type: "ebay_message",
    MessageID: '9999',
    customer: "nY+sHZ2PrBmdj6wVnY+sEZ2PrsA2dj6wFk4CoAZeCoAqdj6x9nY+seQ=="
},

// Time
{
    _id: 'time',
    lastModified: '2012-06-01T02:20:00.000Z'
}]
databases.ebay_messages.documents = [{
    _id: '_design/conversations',
    language: "javascript",
    views: {
        with_messages: {
            map: function(doc) {
                if (doc.status != null) {
                    emit([doc._id, 0], doc);
                }
                else {
                    emit([doc.conversation_id, 1], doc.Content);
                }
            }
        },
        messages_by_conversation: {
            map: function(doc) {
                if (doc.conversation_id) {
                    emit(doc.conversation_id, doc);
                }
            }
        },
        all: {
            map: function(doc) {
                if (doc.status != null) {
                    emit(doc._id, doc);
                }
            }
        }
    }
}]

module.exports = databases;