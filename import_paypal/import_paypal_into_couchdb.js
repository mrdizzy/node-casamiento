var paypal = require('./../config/paypal_config')(),
    db = require('./../config/database').db,
    async = require('async');

var currency_conversions = {};

[2012, 2011].forEach(function(year) {
    ["01","02","03","04","05","06","07", "08","09","10","11","12"].forEach(function(month) {
        var startdate = year + "-" + month + "-01" + "T00:00:00Z",
            enddate = year + "-" + month + "-14" + "T23:59:59Z";
        var second_startdate = year + "-" + month + "-15" + "T00:00:00Z",
            second_enddate = year + "-" + month + "-31" + "T23:59:59Z";
        console.log(startdate, enddate);

        PayPalImport(startdate,enddate,function(err,response) {
        
            console.log(err,response)
        })
                PayPalImport(second_startdate,second_enddate,function(err,response) {
        
            console.log(err,response)
        })
    })
})

module.exports = PayPalImport;

function PayPalImport(startdate, enddate, callback) {
    paypal.buildQuery("TransactionSearch", function(error, response) {
        if (error) {
            callback(error);
        }
        else {
            parseTransactions(response, callback);
        }
    }, {
        startdate: startdate,
        enddate: enddate,
        transactionclass: "BalanceAffecting"
    })
}

function parseTransactions(res, callback) {

    var transactions = res.TransactionSearchResponse;

    transactions.forEach(function(t) {
        t._id = t.L_TRANSACTIONID;
        filter(t);
        //gatherCurrencyConversions(t);
    })
    //convertCurrencyConversions();
    async.map(transactions, getTransactionDetails, function(error, results) {
        if (error) {
            console.log("ERROR")
            callback(error);
        }
        else {
            console.log("Save transactions")
            saveTransactions(results, callback)
        }
    });
}

function sanityChecks(t, callback) {}

function getTransactionDetails(t, callback) {
    sanityChecks(t, callback);
    t.type = "paypal";
    if (t.L_TYPE == 'Fee' || t.L_TYPE == 'Fee Reversal') {
        callback(null, t)
    }
    else {
        console.log("Calling GetTransactionDetails for transaction " + t._id)
        paypal.buildQuery("GetTransactionDetails", function(error, response) {
            if (error == null) {
                t.transaction_details = response;
                callback(null, t)
            }
            else if (error.L_ERRORCODE0 == '10004' ) {
                console.log("WARNING calling GetTransactionDetails failed for transaction " + t._id + " type " + t.L_TYPE)
                callback(null, t)
            
            } else {
                console.log("FAILURE calling GetTransactionDetails failed for transaction " + t._id + " type " + t.L_TYPE)
            
                callback(error);
            }
        }, {
            transactionId: t._id
        });
    }
}

function saveTransactions(results, callback) {
    console.log("Saving Transactions to database...")
    db.save(results, callback);
}
// For an outgoing payment:
//    - there is an outgoing payment in USD ($-9.95)
//    - there is a Currency Conversion (credit) in USD ($+9.95)
//        - the above two balance each other out
//    - there is finally a Currency Conversion (debit) in GBP (£-4.99)
//    - the timestamps for all three of the above appear to be identical
//
// For a refunded payment
//    - there is an incoming payment in USD ($+9.95)
//    - there is a Currency conversion (debit) in USD ($-9.95)
//        - the above two balance each other out
//    - there is finally a Currency Conversion (credit) in GBP (£+4.99)
//    - the timestamps for all three of the above appear to be identical
//    

function convertCurrencyConversions() {
    for (var time in currency_conversions) {
        var transactions = currency_conversions[time];
        
        // If the transaction is a Payment and if its amount is less than zero
        if (transactions["Payment"] && transactions["Payment"][1] < 0) {
            if (transactions["Currency Conversion (debit)"]) {
                var transaction = transactions["Payment"][3];
                transaction.L_CURRENCYCODE = transactions["Currency Conversion (debit)"][0];
                transaction.L_AMT = transactions["Currency Conversion (debit)"][1];
            }
        }
        else if (transactions["Payment"] && transactions["Payment"][1] > 0) {
            if (transactions["Currency Conversion (credit)"]) {
                var transaction = transactions["Payment"][3];

                transaction.L_CURRENCYCODE = transactions["Currency Conversion (credit)"][0];
                transaction.L_AMT = transactions["Currency Conversion (credit)"][1];
            }
        }
    }
}

// We collect transactionsForTime relating to currency conversions and story them in 
// the currency_conversions object, keyed by the transaction's TIMESTAMP attribute

function gatherCurrencyConversions(t) {
    // If the currency code is not GBP and the TYPE is not Currency Conversion
    // then we have a payment made in a foreign currency, e.g. a payment in USD
    // and we store this keyed by TIMESTAMP and "Payment"
    var currencyCode = t.L_CURRENCYCODE,
        type = t.L_TYPE,
        time = t.L_TIMESTAMP,
        amount = t.L_AMT;
    if (currencyCode != 'GBP' && !type.match(/Currency Conversion/)) {
        currency_conversions[time] = currency_conversions[time] || {};
        currency_conversions[time]["Payment"] = [t.currencyCode, amount, type, t];
    }

    // Otherwise we have a currency conversion, which we key by its type, e.g.
    // "Currency Conversion (credit) or Currency Conversion (debit)
    else if (type.match(/Currency Conversion/)) {
        currency_conversions[time] = currency_conversions[time] || {};
        currency_conversions[time][type] = [currencyCode, amount, t];
    }
}

function filter(t) {
    if (t.L_NAME == 'Royal Mail Group Online Postage') {
        t.MYOB_ACCOUNT = '52010'
    }
    else if (t.L_TYPE == 'Fee') {
        t.MYOB_ACCOUNT = '65000'
    }
    else if (t.L_TYPE == 'Transfer') {
        t.MYOB_ACCOUNT = '12101'
    }
    else if (t.L_TYPE == 'Payment' && t.L_AMT > 0) {
        t.MYOB_ACCOUNT = '41110'
    }
    else if (t.L_TYPE == 'Fee Reversal') {
        t.MYOB_ACCOUNT = '65000'
    }
}