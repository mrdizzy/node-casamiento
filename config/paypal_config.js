var PayPal = require('node-paypal-api-nv'),
// When using sandbox or production make sure the api.paypal.com host is set correctly in the nv paypal module
    sandbox = {

    },
    production = {
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