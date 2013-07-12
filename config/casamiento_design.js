module.exports =
// Security 

[{
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
}, {
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
}]