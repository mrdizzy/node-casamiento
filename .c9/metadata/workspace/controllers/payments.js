{"changed":true,"filter":false,"title":"payments.js","tooltip":"/controllers/payments.js","value":"var  paypal = require('./../config/paypal_config')(),\n  _ = require('underscore'),\n  db = require('./../config/db').test_ebay,\n  inGroupsOf = require('./../lib/in_groups_of'),\n  sendgrid  = require('sendgrid')(\"app7076151@heroku.com\", \"fbnafrlv8387\");\n \n /* \n[requiredSecurityParameters]\n&METHOD=SetExpressCheckout\n&RETURNURL=http://...\n&CANCELURL=http://...\n&PAYMENTREQUEST_0_PAYMENTACTION=Sale\n&L_PAYMENTREQUEST_0_NAME0=10% Decaf Kona Blend Coffee\n&L_PAYMENTREQUEST_0_NUMBER0=623083\n&L_PAYMENTREQUEST_0_DESC0=Size: 8.8-oz\n&L_PAYMENTREQUEST_0_AMT0=9.95\n&L_PAYMENTREQUEST_0_QTY0=2\n&L_PAYMENTREQUEST_0_NAME1=Coffee Filter bags\n&L_PAYMENTREQUEST_0_NUMBER1=623084\n&L_PAYMENTREQUEST_0_DESC1=Size: Two 24-piece boxes\n&L_PAYMENTREQUEST_0_AMT1=39.70\n&L_PAYMENTREQUEST_0_QTY1=2\n&PAYMENTREQUEST_0_ITEMAMT=99.30\n&PAYMENTREQUEST_0_TAXAMT=2.58\n&PAYMENTREQUEST_0_SHIPPINGAMT=3.00\n&PAYMENTREQUEST_0_HANDLINGAMT=2.99\n&PAYMENTREQUEST_0_SHIPDISCAMT=-3.00\n&PAYMENTREQUEST_0_INSURANCEAMT=1.00\n&PAYMENTREQUEST_0_AMT=105.87\n&PAYMENTREQUEST_0_CURRENCYCODE=USD\n&ALLOWNOTE=1\n*/\n\nexports.create = function(req, res) {\n  var product = JSON.parse(req.body.object);\n  product.product_id = product._id;\n  delete product._rev\n  delete product._id\n  delete req.body.object;\n  product.type = \"order\"\n  product.status = \"UNPAID\"\n   var localhost = \"http://localhost:3000/payments\"\n   var heroku_test = \"http://node-casamiento-mrdizzy.c9.io/payments\"\n   var c9 = \"http://node-casamiento.mrdizzy.c9.io/payments\"\n   var production = \"http://www.casamiento.co.uk/payments\"\n  // Change RETURNURL to http://localhost for testing\n  var default_options = {\n    \"PAYMENTREQUEST_0_CURRENCYCODE\": \"GBP\",\n    \"RETURNURL\": c9,\n    \"CANCELURL\": \"http://node-casamiento-mrdizzy.c9.io/products/\" + product.product_id, // http://localhost:3000/products or http://node-casamiento-mrdizzy.c9.io/products\n    \"PAYMENTREQUEST_0_PAYMENTACTION\": \"Sale\",  \n    \"ALLOWNOTE\": 1,\n    \"LOGOIMG\": \"http://www.casamiento.co.uk/gfx/logo/casamiento_black.png\"\n  };\n  var options = _.extend(default_options, req.body);\n  \n  paypal.buildQuery(\"SetExpressCheckout\", function(error, response) { \n  console.log(options)\n  console.log(error, response)\n    product._id = response.TOKEN\n    db.save(product, function(err, docs) {\n      if(err) {\n        res.send(500)\n      } else {\n      // If in sandbox mode change to www.sandbox.paypal.com\n        res.redirect(\"https://www.sandbox.paypal.com/uk/cgi-bin/webscr?cmd=_express-checkout&token=\"+response.TOKEN)\n      }      \n    })    \n  }, options)\n}\n\nexports.index = function(req, res) {\n  paypal.buildQuery(\"GetExpressCheckoutDetails\", function(error, response) {\n    db.get(req.query.token, function(dberror, doc) {\n      doc.paypal = sanitizePaypalResponse(response);\n      doc.status = \"PAID\"\n      db.save(doc, function(new_err, new_doc) {\n        if(new_err) {\n          console.log(new_err, new_doc)\n        } else {\n           paypal.buildQuery(\"DoExpressCheckoutPayment\", function(paymenterror, paymentresponse) { \n           doc.guests = inGroupsOf(doc.guests, 2);\n           req.app.render(\"invoices/email\", { locals: doc}, function(err, html) {  \n    sendgrid.send({\n      to:       doc.paypal.email,\n      from:     'david@casamiento.co.uk',\n      subject:  \"Your order at Casamiento\",\n      text:     '',\n      html: html\n    }, function(err, json) {\n      if (err) { return console.error(\"Error\", err); }\n      console.log(json)  \n    })\n\n  });\n      res.render('invoices/thankyou', {\n        locals:doc\n      })\n           }, { TOKEN: req.query.token, PAYERID: req.query.PayerID, PAYMENTACTION: \"Sale\", PAYMENTREQUEST_0_AMT: doc.paypal.PAYMENTREQUEST_0_AMT,\n       PAYMENTREQUEST_0_CURRENCYCODE: 'GBP' })\n        }\n      })\n    })\n  }, { TOKEN: req.query.token })\n}\n\nfunction sanitizePaypalResponse(response) {\n  var checkout_details = response.GetExpressCheckoutDetailsResponse[0]\n  return { \n    email: response.EMAIL,\n    payerid: response.PAYERID,\n    firstname: response.FIRSTNAME,\n    lastname: response.LASTNAME,\n    countrycode: response.COUNTRYCODE,\n    shiptoname: response.SHIPTONAME,\n    shiptostreet: response.SHIPTOSTREET, \n    shiptocity: response.SHIPTOCITY,\n    shiptostate: response.SHIPTOSTATE,\n    shiptozip: response.SHIPTOZIP,\n    shiptocountrycode: response.SHIPTOCOUNTRYCODE,\n    shiptocountryname: response.SHIPTOCOUNTRYNAME,\n    amt: response.AMT,\n    product: checkout_details.L_NAME,\n    quantity: checkout_details.L_QTY,\n    price_each: checkout_details.L_AMT\n  }\n}","undoManager":{"mark":63,"position":62,"stack":[[{"start":{"row":34,"column":44},"end":{"row":35,"column":22},"action":"remove","lines":["","  console.log(product)"],"id":2}],[{"start":{"row":42,"column":68},"end":{"row":43,"column":0},"action":"insert","lines":["",""],"id":3},{"start":{"row":43,"column":0},"end":{"row":43,"column":3},"action":"insert","lines":["   "]}],[{"start":{"row":43,"column":3},"end":{"row":43,"column":4},"action":"insert","lines":["v"],"id":4}],[{"start":{"row":43,"column":4},"end":{"row":43,"column":5},"action":"insert","lines":["a"],"id":5}],[{"start":{"row":43,"column":5},"end":{"row":43,"column":6},"action":"insert","lines":["r"],"id":6}],[{"start":{"row":43,"column":6},"end":{"row":43,"column":7},"action":"insert","lines":[" "],"id":7}],[{"start":{"row":43,"column":7},"end":{"row":43,"column":8},"action":"insert","lines":["c"],"id":8}],[{"start":{"row":43,"column":8},"end":{"row":43,"column":9},"action":"insert","lines":["9"],"id":9}],[{"start":{"row":43,"column":9},"end":{"row":43,"column":10},"action":"insert","lines":[" "],"id":10}],[{"start":{"row":43,"column":10},"end":{"row":43,"column":11},"action":"insert","lines":["="],"id":11}],[{"start":{"row":43,"column":11},"end":{"row":43,"column":12},"action":"insert","lines":[" "],"id":12}],[{"start":{"row":43,"column":12},"end":{"row":43,"column":14},"action":"insert","lines":["\"\""],"id":13}],[{"start":{"row":43,"column":13},"end":{"row":43,"column":14},"action":"insert","lines":["h"],"id":14}],[{"start":{"row":43,"column":14},"end":{"row":43,"column":15},"action":"insert","lines":["t"],"id":15}],[{"start":{"row":43,"column":15},"end":{"row":43,"column":16},"action":"insert","lines":["t"],"id":16}],[{"start":{"row":43,"column":16},"end":{"row":43,"column":17},"action":"insert","lines":["p"],"id":17}],[{"start":{"row":43,"column":17},"end":{"row":43,"column":18},"action":"insert","lines":[":"],"id":18}],[{"start":{"row":43,"column":18},"end":{"row":43,"column":19},"action":"insert","lines":["/"],"id":19}],[{"start":{"row":43,"column":19},"end":{"row":43,"column":20},"action":"insert","lines":["/"],"id":20}],[{"start":{"row":43,"column":20},"end":{"row":43,"column":21},"action":"insert","lines":["m"],"id":21}],[{"start":{"row":43,"column":21},"end":{"row":43,"column":22},"action":"insert","lines":["r"],"id":22}],[{"start":{"row":43,"column":21},"end":{"row":43,"column":22},"action":"remove","lines":["r"],"id":23}],[{"start":{"row":43,"column":20},"end":{"row":43,"column":21},"action":"remove","lines":["m"],"id":24}],[{"start":{"row":43,"column":20},"end":{"row":43,"column":21},"action":"insert","lines":["n"],"id":25}],[{"start":{"row":43,"column":21},"end":{"row":43,"column":22},"action":"insert","lines":["o"],"id":26}],[{"start":{"row":43,"column":22},"end":{"row":43,"column":23},"action":"insert","lines":["d"],"id":27}],[{"start":{"row":43,"column":23},"end":{"row":43,"column":24},"action":"insert","lines":["e"],"id":28}],[{"start":{"row":43,"column":24},"end":{"row":43,"column":25},"action":"insert","lines":["-"],"id":29}],[{"start":{"row":43,"column":25},"end":{"row":43,"column":26},"action":"insert","lines":["c"],"id":30}],[{"start":{"row":43,"column":26},"end":{"row":43,"column":27},"action":"insert","lines":["a"],"id":31}],[{"start":{"row":43,"column":27},"end":{"row":43,"column":28},"action":"insert","lines":["s"],"id":32}],[{"start":{"row":43,"column":28},"end":{"row":43,"column":29},"action":"insert","lines":["a"],"id":33}],[{"start":{"row":43,"column":29},"end":{"row":43,"column":30},"action":"insert","lines":["m"],"id":34}],[{"start":{"row":43,"column":30},"end":{"row":43,"column":31},"action":"insert","lines":["i"],"id":35}],[{"start":{"row":43,"column":31},"end":{"row":43,"column":32},"action":"insert","lines":["e"],"id":36}],[{"start":{"row":43,"column":32},"end":{"row":43,"column":33},"action":"insert","lines":["n"],"id":37}],[{"start":{"row":43,"column":33},"end":{"row":43,"column":34},"action":"insert","lines":["t"],"id":38}],[{"start":{"row":43,"column":34},"end":{"row":43,"column":35},"action":"insert","lines":["o"],"id":39}],[{"start":{"row":43,"column":35},"end":{"row":43,"column":36},"action":"insert","lines":["."],"id":40}],[{"start":{"row":43,"column":36},"end":{"row":43,"column":37},"action":"insert","lines":["m"],"id":41}],[{"start":{"row":43,"column":37},"end":{"row":43,"column":38},"action":"insert","lines":["r"],"id":42}],[{"start":{"row":43,"column":38},"end":{"row":43,"column":39},"action":"insert","lines":["d"],"id":43}],[{"start":{"row":43,"column":39},"end":{"row":43,"column":40},"action":"insert","lines":["i"],"id":44}],[{"start":{"row":43,"column":40},"end":{"row":43,"column":41},"action":"insert","lines":["z"],"id":45}],[{"start":{"row":43,"column":41},"end":{"row":43,"column":42},"action":"insert","lines":["z"],"id":46}],[{"start":{"row":43,"column":42},"end":{"row":43,"column":43},"action":"insert","lines":["y"],"id":47}],[{"start":{"row":43,"column":43},"end":{"row":43,"column":44},"action":"insert","lines":["."],"id":48}],[{"start":{"row":43,"column":44},"end":{"row":43,"column":45},"action":"insert","lines":["c"],"id":49}],[{"start":{"row":43,"column":45},"end":{"row":43,"column":46},"action":"insert","lines":["9"],"id":50}],[{"start":{"row":43,"column":46},"end":{"row":43,"column":47},"action":"insert","lines":["."],"id":51}],[{"start":{"row":43,"column":47},"end":{"row":43,"column":48},"action":"insert","lines":["i"],"id":52}],[{"start":{"row":43,"column":48},"end":{"row":43,"column":49},"action":"insert","lines":["o"],"id":53}],[{"start":{"row":43,"column":49},"end":{"row":43,"column":50},"action":"insert","lines":["/"],"id":54}],[{"start":{"row":43,"column":50},"end":{"row":43,"column":51},"action":"insert","lines":["p"],"id":55}],[{"start":{"row":43,"column":51},"end":{"row":43,"column":52},"action":"insert","lines":["a"],"id":56}],[{"start":{"row":43,"column":52},"end":{"row":43,"column":53},"action":"insert","lines":["y"],"id":57}],[{"start":{"row":43,"column":53},"end":{"row":43,"column":54},"action":"insert","lines":["m"],"id":58}],[{"start":{"row":43,"column":54},"end":{"row":43,"column":55},"action":"insert","lines":["e"],"id":59}],[{"start":{"row":43,"column":55},"end":{"row":43,"column":56},"action":"insert","lines":["n"],"id":60}],[{"start":{"row":43,"column":56},"end":{"row":43,"column":57},"action":"insert","lines":["t"],"id":61}],[{"start":{"row":43,"column":57},"end":{"row":43,"column":58},"action":"insert","lines":["s"],"id":62}],[{"start":{"row":48,"column":17},"end":{"row":48,"column":26},"action":"remove","lines":["localhost"],"id":63},{"start":{"row":48,"column":17},"end":{"row":48,"column":18},"action":"insert","lines":["c"]}],[{"start":{"row":48,"column":18},"end":{"row":48,"column":19},"action":"insert","lines":["9"],"id":64}],[{"start":{"row":56,"column":70},"end":{"row":58,"column":30},"action":"remove","lines":["","  console.log(options)","  console.log(error, response)"],"id":65}]]},"ace":{"folds":[],"scrolltop":539,"scrollleft":0,"selection":{"start":{"row":18,"column":34},"end":{"row":18,"column":34},"isBackwards":false},"options":{"guessTabSize":true,"useWrapMode":false,"wrapToView":true},"firstLineState":{"row":37,"mode":"ace/mode/javascript"}},"timestamp":1441029730000}