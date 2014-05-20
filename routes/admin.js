module.exports = function(app) {
  app.get("/admin/products", require('./../controllers/admin/products').index); 
  app.resource("conversations", require('./../controllers/conversations'));
  app.resource("paypal", require('./../controllers/paypal'));
  app.resource("invoices", require('./../controllers/invoices'))
}
