// Login to developer.paypal.com with the usual (and authentic) PayPal login details and then go to the Dashboard.
// Then look left for the Sandbox menu and select "Accounts"
// Buyer: paypal-buyer@dizzy.co.uk Password: Jenny333
// In development the return URL needs to be correct for testing to work, depending on the environment. This is usually
// localhost:3000 but if using cloud9 editor then it should be http://node-casamiento-mrdizzy.c9.io

var PayPal = require('node-paypal-api-nv'),
// When using sandbox or production make sure the api.paypal.com host is set correctly in the nv paypal module
    sandbox = {
      USER: 'paypal-facilitator_api1.dizzy.co.uk',
      PWD: '1396521820',
      SIGNATURE: 'AFcWxV21C7fd0v3bYYYRCpSSRl31AIKlqHdAnD8OhuaQWBJ.Q0TQYGI6'
    },
    production = {
      USER: 'david.p_api1.casamiento-cards.co.uk',
      PWD: 'WZFA2LEYHLMVS8GC',
      SIGNATURE: 'AFcWxV21C7fd0v3bYYYRCpSSRl31AGarkFSt5jUYyxNcPfou1CUmwV3u'
    }
    
    // Pass true as the final parameter to new PayPal() if we are using the sandbox
  module.exports = function() {
   // if (process.env.NODE_ENV == 'test') {
        return new PayPal(sandbox.USER, sandbox.PWD, sandbox.SIGNATURE, true);
   // }
   // else {
  //      return new PayPal(production.USER, production.PWD, production.SIGNATURE, false);
   // }
}