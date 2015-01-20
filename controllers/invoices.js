var db = require('couchdb-migrator').db,
  async = require('async'),
  _ = require('underscore'),
  paypal = require('./../config/paypal_config')();

// Downloads PayPal Transactions for immediate display -- it does not save them to Couch

module.exports.create = function(req, res) { // POST /invoices?transaction_ids=[1,2,3,4]
 
  var transactions = req.body.transaction_ids;
   // If we are only submitting one transaction from the form then we need to make it into an array
  if(typeof transactions === "string") transactions = [transactions]

  async.map(transactions, function(transaction, callback) {
        
    paypal.buildQuery("GetTransactionDetails", function(err, response) {
      if(err) {
        callback(err)
      } else {
      response.items = response.GetTransactionDetailsResponse;
      response.items = _.map(response.items, function(item) {

        if(item.L_NAME) {
          item.L_NAME = item.L_NAME.replace("&", "&amp;")
        }
        return item;
      })
      callback(null,response)
      }
    }, {
      TRANSACTIONID: transaction
    })

  }, function(err, results) {
    if(err) {
      console.log("There has been an error getting the PayPal response:")
      console.log(err)
    } else {
            console.log(results)
      res.render("invoices/show.ejs", { layout: false, locals: { transactions: results }})
    }
  }); 
}

module.exports.index = function(req, res) {  // GET /invoices

  var timeNow = new Date();
var timeAgo = new Date(timeNow - 2629740000); //

  paypal.buildQuery("TransactionSearch", function(error, response) {
    parseTransactions(response.TransactionSearchResponse, function(err, results) {
      if (err) {
        console.log("There has been an error with the Paypal Request: ")
        console.log(err)
      } else {
        results = _.compact(results); // remove all falsy values

        res.render('invoices/index', { layout: 'admin_layout', locals: { transactions: results}});
      }
    });
  }, {
    startdate: timeAgo.toISOString(),
    enddate: timeNow.toISOString(),
    transactionclass: "BalanceAffecting"
  })
}

function parseTransactions(transactions, maincallback) {
  async.map(transactions, function(transaction, callback) {
    if (transaction.L_TYPE == 'Fee' || transaction.L_TYPE == 'Fee Reversal' || transaction.L_TYPE == 'Temporary Hold' || transaction.L_TYPE == 'Transfer' || transaction.L_TYPE == 'Refund' || transaction.L_TYPE == 'Voucher' || transaction.L_TYPE == 'Currency Conversion (debit)' || transaction.L_TYPE == 'Currency Conversion (credit)') {
        callback(null, null)
    }
    else {
      paypal.buildQuery("GetTransactionDetails", function(err, response) {
      if(err) {
        console.log("THERE HAS BEEN AN ERROR RETRIEVING THE RESPONSE:")
        console.log(err)
        console.log(transaction)
      } else {
        response.items = response.GetTransactionDetailsResponse;
          response.items = _.map(response.items, function(item) {
          if(item.L_NAME) {
              item.L_NAME = item.L_NAME.replace("&", "&amp;")
              }
              return item;
          })
        callback(err,response)
        }
        }, {
        TRANSACTIONID: transaction.L_TRANSACTIONID
      })
    }
  }, maincallback);
}