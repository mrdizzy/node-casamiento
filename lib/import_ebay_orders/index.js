process.env.NODE_ENV = "test";
var _ = require('underscore'),
    api = require('./config/ebay_config')(),
    db = require('./config/database').db,
    async = require('async');
ImportOrders(function(err, response) {
    saveOrders(err, response, function(e, r) {});
});

function ImportOrders(callback) {
    async.waterfall([

    function(cb) {
        db.get('time', cb)
    }, function(response, cb) {
        api.makeRequest("GetOrders", {
            ModTimeFrom: response.lastModified,
            ModTimeTo: new Date().toISOString(),
            DetailLevel: "ReturnAll"
        }, "json", null, callback);
    }])
}

function saveOrders(error, ordersResponse, callback) {
    var timestamp = ordersResponse.Timestamp;
    if (ordersResponse.ReturnedOrderCountActual === '0') {
        callback("No orders to import");
    }
    else {
        var orders = ordersResponse.OrderArray;
        orders.forEach(function(order) {
            order._id = order.OrderID;
        })
        async.waterfall([function(cb) {
            db.save(orders, function(err, response) {
                cb(err, response)
            });
        }, function(response, cb) {
            var conflicts = _.map(response, function(doc) {
                if (doc.error == 'conflict') {
                    return doc.id;
                }
            })
            db.get(_.compact(conflicts), function(e, r) {
                r.forEach(function(doc) {
                    doc.emails = "POOO";
                });
                db.save(r.toArray(), function(ee, conflicts) {
                    cb(ee, conflicts)
                });
            })
        }, function(conflicts, cb) {
            var multipleLineOrders = _.map(orders, function(order) {
                if (order.TransactionArray.length > 1) {
                    return _.pluck(order.TransactionArray, 'OrderLineItemID');
                }
            });
            multipleLineOrders = _.compact(multipleLineOrders);
            multipleLineOrders = _.flatten(multipleLineOrders);
            db.get(multipleLineOrders, cb)
        },
        function(duplicates, cb) {
              var duplicatesFound = _.map(duplicates, function(d) {
                if(d.error != "not_found") {
                    return { _id: d.id, rev: d.value.rev }
              }
              });
              duplicatesFound = _.compact(duplicatesFound);
              async.forEach(duplicatesFound, function(duplicate, callback) {
               console.log(duplicate);
                   db.remove(duplicate._id, duplicate.rev, callback);
              }, cb);
             
        },
        
        function(response, cb) { // Update time
            db.save('time', {
                lastModified: timestamp
            }, cb);
        }], callback);
    }
}
