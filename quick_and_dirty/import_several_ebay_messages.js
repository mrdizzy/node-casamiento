process.env.NODE_ENV = "test";

var migrator = require('couchdb-migrator'),
    importMessage = require('./../import_ebay_messages'),
    ebay = require('./../config/ebay_config')();

migrator.resetDb(function (a, b) {
    ebay.makeRequest("GetMyMessages", {
        DetailLevel: "ReturnHeaders",
        StartTime: "2012-01-31T01:54:09.000Z",
        EndTime: "2012-08-07T01:54:09.000Z"
    }, "json", null, function (e, r) {
        var messages = r.Messages.Message;

        messages.forEach(function (mm) {
            ebay.makeRequest("GetMyMessages",  {
                DetailLevel: "ReturnMessages",
                MessageIDs: {
                    MessageID: [mm.MessageID]
                }
            }, "xml", null, function (error, x) {
                parseMessage(x);
            });
        });
    });
});

function parseMessage(m) {

    importMessage(m, function (er, ro) {});
}