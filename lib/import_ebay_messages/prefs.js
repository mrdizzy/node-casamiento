var api = require('./config/ebay_config')();

function getPrefs() {
    var r = api.makeRequest("GetNotificationPreferences", {
        PreferenceLevel: "Application"
    }, "json", null, function(err, res) {
        console.log(r);
        console.log(res);
        console.log(res.UserDeliveryPreferenceArray);
    });
};
getPrefs();

function setPrefs() {
    api.makeRequest("SetNotificationPreferences", function(err, res) {}, {
        ApplicationDeliveryPreferences: {
            ApplicationEnable: "Disable",
            ApplicationURL: "http://ebay-api-notify.mrdizzy.c9.io/ebay"
        },
        UserDeliveryPreferenceArray: {
            NotificationEnable: [{
                EventType: "MyMessagesM2MMessage",
                EventEnable: "Disable"
            }, {
                EventType: "FixedPriceTransaction",
                EventEnable: "Disable"
            }, {
                EventType: "ItemClosed",
                EventEnable: "Disable"
            }]
        }
    }, "json")
}