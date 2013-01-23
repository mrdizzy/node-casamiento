var db = require('couchdb-migrator').db,
    async = require('async'),
_ = require('underscore'),
    paypal = require('./../config/paypal_config')();

function parseTransactions(transactions, maincallback) {
    async.map(transactions, function(transaction, callback) {
        if (transaction.L_TYPE == 'Fee' || transaction.L_TYPE == 'Fee Reversal' || transaction.L_TYPE == 'Temporary Hold') {
            callback(null, null)
        }
        else {
            console.log(transaction.L_TYPE);
            paypal.buildQuery("GetTransactionDetails", function(err, response) {
                console.log(err, response);
                    response.items = response.GetTransactionDetailsResponse;
                    console.log(response);
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
        startdate: "2012-09-30T00:00:00Z",
        enddate: "2012-10-01T23:59:59Z",
        transactionclass: "BalanceAffecting"
    })
},
html: function(req, res){
       res.render('paypal/index');
}
}