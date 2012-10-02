var db = require('couchdb-migrator').db,
    async = require('async'),
    
_ = require('underscore'),
    paypal = require('./../config/paypal_config')();

function parseTransaction(t) {
    console.log(t);
    var address = [t.SHIPTONAME, t.SHIPTOSTREET, t.SHIPTOCITY, t.SHIPTOSTATE, t.SHIPTOZIP]
    address = address.join("\n");
    var date = Date.parse(t.ORDERTIME);
    var t2 = {
        items: t.GetTransactionDetailsResponse,
        payer_id: t.PAYERID,
        address: address,
        email: t.EMAIL,
        date: date,
        amount: t.AMT,
        note: t.NOTE
    }
    return t2;
}

function parseTransactions(transactions, maincallback) {
    async.map(transactions, function(transaction, callback) {
        if (transaction.L_TYPE == 'Fee' || transaction.L_TYPE == 'Fee Reversal') {
            callback(null, null)
        }
        else {
            paypal.buildQuery("GetTransactionDetails", function(err, response) {
                var result = parseTransaction(response);
                callback(err, result);
            }, {
                TRANSACTIONID: transaction.L_TRANSACTIONID
            })
        }
    }, maincallback);
}
module.exports.index = function(req, res) {
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
        startdate: "2012-09-20T00:00:00Z",
        enddate: "2012-10-01T23:59:59Z",
        transactionclass: "BalanceAffecting"
    })
}