var PayPal = require('node-paypal-api-nv'),
// https://developer.paypal.com/
// Login paypal@dizzy.co.uk password: password for main account
// production Merchant account ID 4WWJ2HESU6USU 
// Buyer: paypal-buyer@dizzy.co.uk password: world666
// Seller: paypal-facilitator@dizzy.co.uk password: 
  production = {USER: 'paypal-facilitator_api1.dizzy.co.uk',
  PWD: '1396521820',
  SIGNATURE: 'AFcWxV21C7fd0v3bYYYRCpSSRl31AIKlqHdAnD8OhuaQWBJ.Q0TQYGI6'}
  sandbox = {
    USER: 'david.p_api1.casamiento-cards.co.uk',
    PWD: 'WZFA2LEYHLMVS8GC',
    SIGNATURE: 'AFcWxV21C7fd0v3bYYYRCpSSRl31AGarkFSt5jUYyxNcPfou1CUmwV3u'
  }
    
module.exports = function() {
  if (process.env.NODE_ENV == 'test') {
    return new PayPal(sandbox.USER, sandbox.PWD, sandbox.SIGNATURE);
  }
  else {
    return new PayPal(production.USER, production.PWD, production.SIGNATURE);
  }
}