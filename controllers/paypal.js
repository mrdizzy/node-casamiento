var db = require('couchdb-migrator').db,
    async = require('async'),
_ = require('underscore'),
    paypal = require('./../config/paypal_config')();

var timeNow = new Date();
var timeAgo = new Date(timeNow - 2629740000);

// Downloads PayPal Transactions for immediate display -- it does not save them to Couch

function parseTransactions(transactions, maincallback) {
    async.map(transactions, function(transaction, callback) {
        if (transaction.L_TYPE == 'Fee' || transaction.L_TYPE == 'Fee Reversal' || transaction.L_TYPE == 'Temporary Hold' || transaction.L_TYPE == 'Transfer') {
            callback(null, null)
        }
        else {
            paypal.buildQuery("GetTransactionDetails", function(err, response) {

                    response.items = response.GetTransactionDetailsResponse;
                                response.items = _.map(response.items, function(item) {
                                    item.L_NAME = item.L_NAME.replace("&", "&amp;")
                                    return item;
                                })
                    callback(err,response)
                }, {
                TRANSACTIONID: transaction.L_TRANSACTIONID
            })
        }
    }, maincallback);
}
module.exports.index = {
    json: function(req, res) {
    
    paypal.buildQuery("TransactionSearch", function(error, response) {
        parseTransactions(response.TransactionSearchResponse, function(err, results) {
            if (err) {
                console.log(err);
            } else {
                results = _.compact(results);
            res.json(results);
            }
        });
    }, {
        startdate: timeAgo.toISOString(),
        enddate: timeNow.toISOString(),
        transactionclass: "BalanceAffecting"
    })
},
html: function(req, res){
       res.render('paypal/index');
}
}