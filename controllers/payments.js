 var  paypal = require('./../config/paypal_config')(),
 _ = require('underscore'),
db = require('./../config/db').test_ebay,
  inGroupsOf = require('./../lib/in_groups_of');
 
 /* Example parameters

[requiredSecurityParameters]
&METHOD=SetExpressCheckout
&RETURNURL=http://...
&CANCELURL=http://...
&PAYMENTREQUEST_0_PAYMENTACTION=Sale
&L_PAYMENTREQUEST_0_NAME0=10% Decaf Kona Blend Coffee
&L_PAYMENTREQUEST_0_NUMBER0=623083
&L_PAYMENTREQUEST_0_DESC0=Size: 8.8-oz
&L_PAYMENTREQUEST_0_AMT0=9.95
&L_PAYMENTREQUEST_0_QTY0=2
&L_PAYMENTREQUEST_0_NAME1=Coffee Filter bags
&L_PAYMENTREQUEST_0_NUMBER1=623084
&L_PAYMENTREQUEST_0_DESC1=Size: Two 24-piece boxes
&L_PAYMENTREQUEST_0_AMT1=39.70
&L_PAYMENTREQUEST_0_QTY1=2
&PAYMENTREQUEST_0_ITEMAMT=99.30
&PAYMENTREQUEST_0_TAXAMT=2.58
&PAYMENTREQUEST_0_SHIPPINGAMT=3.00
&PAYMENTREQUEST_0_HANDLINGAMT=2.99
&PAYMENTREQUEST_0_SHIPDISCAMT=-3.00
&PAYMENTREQUEST_0_INSURANCEAMT=1.00
&PAYMENTREQUEST_0_AMT=105.87
&PAYMENTREQUEST_0_CURRENCYCODE=USD
&ALLOWNOTE=1
*/

exports.create = function(req, res) {
  var product = JSON.parse(req.body.object);
  product.product_id = product._id;
  delete product._rev
  delete product._id
  delete req.body.object;
  console.log(product)
  product.type = "order"
  product.status = "UNPAID"
  
  
  var default_options = {
    "PAYMENTREQUEST_0_CURRENCYCODE": "GBP",
    "RETURNURL": "http://www.casamiento.co.uk/payments",
    "CANCELURL": "http://www.casamiento.co.uk",
    "PAYMENTREQUEST_0_PAYMENTACTION": "Sale",  
    "ALLOWNOTE": 1,
    "LOGOIMG": "http://www.casamiento.co.uk/gfx/logo/casamiento_black.png"
  };
  var options = _.extend(default_options, req.body);
  
  paypal.buildQuery("SetExpressCheckout", function(error, response) { 
  console.log(error, response)
  product._id = response.TOKEN
    db.save(product, function(err, docs) {
      if(err) {
        res.send(500)
      } else {
      console.log(docs)
        res.redirect("https://www.paypal.com/uk/cgi-bin/webscr?cmd=_express-checkout&token="+response.TOKEN)
      }      
    })
    
  }, options)
}

exports.index = function(req, res) {
  paypal.buildQuery("GetExpressCheckoutDetails", function(error, response) {
    db.get(req.query.token, function(dberror, doc) {
    
      doc.paypal = response;
      doc.status = "PAID"
      db.save(doc, function(new_err, new_doc) {
        if(new_err) {
          console.log(new_err, new_doc)
        } else {
           paypal.buildQuery("DoExpressCheckoutPayment", function(paymenterror, paymentresponse) { 
           doc.guests = inGroupsOf(doc.guests, 2);
           res.render('invoices/thankyou', {
      locals:doc
    })
           }, { TOKEN: req.query.token, PAYERID: req.query.PayerID, PAYMENTACTION: "Sale", PAYMENTREQUEST_0_AMT: doc.paypal.PAYMENTREQUEST_0_AMT,
       PAYMENTREQUEST_0_CURRENCYCODE: 'GBP' })
        }
      })
    })
  }, { TOKEN: req.query.token })
}