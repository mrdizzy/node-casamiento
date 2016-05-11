var fs = require('fs'),
   inGroupsOf = require('./../lib/in_groups_of');

var test_thankyou = {
   "_id": "EC-54J34043EK665930X",
   "_rev": "2-9e63e919eada39baaf31ae181295af57",
   "colours": [
      "#d73b3e"
   ],
   "font": "Metroscript",
   "name": "Ace Of Hearts",
   "monochromatic": null,
   "quantity": 12,
   "guests": [{
      "name": "David",
      "baseline": 0,
      "font_size": "0.08"
   }, {
      "name": "Martin",
      "baseline": 0,
      "font_size": "0.08"
   }, {
      "name": "Louis",
      "baseline": 0,
      "font_size": "0.08"
   }, {
      "name": "James",
      "baseline": 0,
      "font_size": "0.08"
   }, {
      "name": "Emily",
      "baseline": 0,
      "font_size": "0.08"
   }, {
      "name": "Guest Name",
      "baseline": 0,
      "font_size": "0.08"
   }, {
      "name": "Guest Name",
      "baseline": 0,
      "font_size": "0.08"
   }, {
      "name": "Guest Name",
      "baseline": 0,
      "font_size": "0.08"
   }, {
      "name": "Guest Name",
      "baseline": 0,
      "font_size": "0.08"
   }, {
      "name": "Guest Name",
      "baseline": 0,
      "font_size": "0.08"
   }, {
      "name": "Guest Name",
      "baseline": 0,
      "font_size": "0.08"
   }, {
      "name": "Guest Name",
      "baseline": 0,
      "font_size": "0.08"
   }],
   "price": 0.1,
   "total": 6,
   "type": "order",
   "status": "PAID",
   "paypal": {
      "TOKEN": "EC-54J34043EK665930X",
      "BILLINGAGREEMENTACCEPTEDSTATUS": "0",
      "CHECKOUTSTATUS": "PaymentActionNotInitiated",
      "TIMESTAMP": "2015-01-20T17:14:33Z",
      "CORRELATIONID": "497aa5e434",
      "ACK": "Success",
      "VERSION": "86.0",
      "BUILD": "14839371",
      "EMAIL": "paypal-buyer@dizzy.co.uk",
      "PAYERID": "NLDAJPHWDNKRL",
      "PAYERSTATUS": "verified",
      "FIRSTNAME": "Test",
      "LASTNAME": "Buyer",
      "COUNTRYCODE": "GB",
      "SHIPTONAME": "Test Buyer",
      "SHIPTOSTREET": "1 Main Terrace",
      "SHIPTOCITY": "Wolverhampton",
      "SHIPTOSTATE": "West Midlands",
      "SHIPTOZIP": "W12 4LQ",
      "SHIPTOCOUNTRYCODE": "GB",
      "SHIPTOCOUNTRYNAME": "United Kingdom",
      "ADDRESSSTATUS": "Confirmed",
      "CURRENCYCODE": "GBP",
      "AMT": "6.00",
      "ITEMAMT": "6.00",
      "SHIPPINGAMT": "0.00",
      "HANDLINGAMT": "0.00",
      "TAXAMT": "0.00",
      "INSURANCEAMT": "0.00",
      "SHIPDISCAMT": "0.00",
      "PAYMENTREQUEST_0_CURRENCYCODE": "GBP",
      "PAYMENTREQUEST_0_AMT": "6.00",
      "PAYMENTREQUEST_0_ITEMAMT": "6.00",
      "PAYMENTREQUEST_0_SHIPPINGAMT": "0.00",
      "PAYMENTREQUEST_0_HANDLINGAMT": "0.00",
      "PAYMENTREQUEST_0_TAXAMT": "0.00",
      "PAYMENTREQUEST_0_INSURANCEAMT": "0.00",
      "PAYMENTREQUEST_0_SHIPDISCAMT": "0.00",
      "PAYMENTREQUEST_0_INSURANCEOPTIONOFFERED": "false",
      "PAYMENTREQUEST_0_SHIPTONAME": "Test Buyer",
      "PAYMENTREQUEST_0_SHIPTOSTREET": "1 Main Terrace",
      "PAYMENTREQUEST_0_SHIPTOCITY": "Wolverhampton",
      "PAYMENTREQUEST_0_SHIPTOSTATE": "West Midlands",
      "PAYMENTREQUEST_0_SHIPTOZIP": "W12 4LQ",
      "PAYMENTREQUEST_0_SHIPTOCOUNTRYCODE": "GB",
      "PAYMENTREQUEST_0_SHIPTOCOUNTRYNAME": "United Kingdom",
      "PAYMENTREQUEST_0_ADDRESSSTATUS": "Confirmed",
      "PAYMENTREQUESTINFO_0_ERRORCODE": "0",
      "GetExpressCheckoutDetailsResponse": [{
         "L_NAME": "Ace Of Hearts",
         "L_QTY": "12",
         "L_TAXAMT": "0.00",
         "L_AMT": "0.50",
         "L_DESC": "Place cards",
         "L_ITEMWEIGHTVALUE": "   0.00000",
         "L_ITEMLENGTHVALUE": "   0.00000",
         "L_ITEMWIDTHVALUE": "   0.00000",
         "L_ITEMHEIGHTVALUE": "   0.00000",
         "L_PAYMENTREQUEST_0_NAME": "Ace Of Hearts",
         "L_PAYMENTREQUEST_0_QTY": "12",
         "L_PAYMENTREQUEST_0_TAXAMT": "0.00",
         "L_PAYMENTREQUEST_0_AMT": "0.50",
         "L_PAYMENTREQUEST_0_DESC": "Place cards",
         "L_PAYMENTREQUEST_0_ITEMWEIGHTVALUE": "   0.00000",
         "L_PAYMENTREQUEST_0_ITEMLENGTHVALUE": "   0.00000",
         "L_PAYMENTREQUEST_0_ITEMWIDTHVALUE": "   0.00000",
         "L_PAYMENTREQUEST_0_ITEMHEIGHTVALUE": "   0.00000"
      }],
      "GetExpressCheckoutDetailsResponseErrors": []
   }
}

test_thankyou.guests = inGroupsOf(test_thankyou.guests, 2);
module.exports = function(app) {
   app.get("/thankyou", function(req, res) {

      console.log(test_thankyou.guests)
      res.render('invoices/thankyou', {
         locals: test_thankyou
      })
   })
   app.get("/xmas", require("./../controllers/landing").xmas)
   app.get("/svg/:id/:colours", require("./../controllers/svg").show)
   app.get("/svg_check", require("./../controllers/svg").check)
   app.post("/email", require("./../controllers/email").create)
   app.get("/svg/:id", require("./../controllers/svg").show)
   app.resource("payments", require("./../controllers/payments"))
   app.resource("fonts", require("./../controllers/fonts"))
   var products = app.resource('products', require('./../controllers/products'), {
      load: parseRevision
   });
   app.get("/products/tags/:tag", require('./../controllers/products').tags)
   var attachments = app.resource("attachments", require('./../controllers/attachments'));
   products.add(attachments);
app.post("/ebay_order", require('./../controllers/save').create)
   // eBay
   app.get("/ebay", require('./../controllers/ebay').index);
   app.post("/ebay", require('./../controllers/ebay').create);
   app.get('/ebay/:id', require('./../controllers/ebay').show)

   app.post("/ebay/places", require('./../controllers/ebay').places)

   // Admin  
   app.get("/admin/products", require('./../controllers/admin/products').index);
   app.get("/products/images/:id", require('./../controllers/products').for_ebay)
   app.get("/admin/orders", require('./../controllers/admin/orders').index);
   app.patch("/admin/orders/:id", require('./../controllers/admin/orders').patch);
   app.delete("/admin/orders/:id", require('./../controllers/admin/orders').destroy);
   app.resource("conversations", require('./../controllers/conversations'));
   app.resource("invoices", require('./../controllers/invoices'))

   // Homepage and static
  // app.get("/", require("./../controllers/welcome").index)
  app.get('/', function(req, res) {
     res.render('welcome/invitations', { layout: false});
     
		console.log(req.headers)
  })
   app.get("/about", require("./../controllers/welcome").about)
   app.get("/faq", require("./../controllers/welcome").faq)
}

// Takes a request and parses the _rev and _id out of it
function parseRevision(req, id, callback) {
   var id_split = id.split("--");
   if (id_split[1] == "undefined") {
      id_split[1] = undefined;
   }
   callback(null, {
      rev: id_split[1],
      id: id_split[0]
   })
}