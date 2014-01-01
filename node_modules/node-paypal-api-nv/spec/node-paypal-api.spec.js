var vows = require('vows'),
    PayPal = require('./../index'),
    nock = require('nock'),
    assert = require('assert');

var USER = 'david.p_api1.casamiento-cards.co.uk',
    PWD = 'WZFA2LEYHLMVS8GC',
    SIGNATURE = 'AFcWxV21C7fd0v3bYYYRCpSSRl31AGarkFSt5jUYyxNcPfou1CUmwV3u';

var api = new PayPal(USER, PWD, SIGNATURE);

//api.buildQuery("TransactionSearch", function(err, res) {}, { startdate: "2012-05-01T00:00:00Z", enddate: "2012-06-01T00:00:00Z"});
vows.describe("Import PayPal Transactions").addBatch({
    "A request for GetBalance": {
        topic: function() {
            nock('https://api-3t.paypal.com').post('/nvp', "METHOD=GetBalance&VERSION=86.0&USER=david.p_api1.casamiento-cards.co.uk&PWD=WZFA2LEYHLMVS8GC&SIGNATURE=AFcWxV21C7fd0v3bYYYRCpSSRl31AGarkFSt5jUYyxNcPfou1CUmwV3u&RETURNALLCURRENCIES=1").reply(200, "L_AMT0=534%2e82&L_AMT1=0%2e00&L_CURRENCYCODE0=GBP&L_CURRENCYCODE1=USD&TIMESTAMP=2012%2d06%2d21T17%3a12%3a55Z&CORRELATIONID=d3173206d22d2&ACK=Success&VERSION=86%2e0&BUILD=3136725", {
                date: 'Thu, 21 Jun 2012 17:12:55 GMT',
                server: 'Apache',
                'content-length': '177',
                connection: 'close',
                'content-type': 'text/plain; charset=utf-8'
            });
            api.buildQuery("GetBalance", this.callback, {
                returnallcurrencies: 1
            });
        },
        "should return a successful response": function(res) {
            assert.equal(res["TIMESTAMP"], '2012-06-21T17:12:55Z');
            assert.equal(res["CORRELATIONID"], 'd3173206d22d2');
            assert.equal(res["ACK"], 'Success');
            assert.equal(res["VERSION"], '86.0');
            assert.equal(res["BUILD"], '3136725');
            assert.equal(res["GetBalanceResponse"][0]["L_AMT"], "534.82");
            assert.equal(res["GetBalanceResponse"][1]["L_AMT"], "0.00");
            assert.equal(res["GetBalanceResponse"][0]["L_CURRENCYCODE"], "GBP");
            assert.equal(res["GetBalanceResponse"][1]["L_CURRENCYCODE"], "USD");
        }
    },
    "A request for an invalid method": {
        topic: function() {
            nock('https://api-3t.paypal.com').
            post('/nvp', "METHOD=Getoalance&VERSION=86.0&USER=david.p_api1.casamiento-cards.co.uk&PWD=WZFA2LEYHLMVS8GC&SIGNATURE=AFcWxV21C7fd0v3bYYYRCpSSRl31AGarkFSt5jUYyxNcPfou1CUmwV3u").
            reply(200, "ACK=Failure&L_ERRORCODE0=81002&L_SHORTMESSAGE0=Unspecified%20Method&L_LONGMESSAGE0=Method%20Specified%20is%20not%20Supported&L_SEVERITYCODE0=Error", {
                date: 'Thu, 21 Jun 2012 14:10:22 GMT',
                server: 'Apache',
                'content-length': '146',
                connection: 'close',
                'content-type': 'text/plain; charset=utf-8'
            });
            api.buildQuery("Getoalance", this.callback);
        },
        "should return an error": function(err, res) {
            assert.equal(err["ACK"], "Failure");
            assert.equal(err["L_SHORTMESSAGE0"], "Unspecified Method");
            assert.equal(err["L_LONGMESSAGE0"], "Method Specified is not Supported");
            assert.equal(err["L_SEVERITYCODE0"], "Error");
        }
    },

    "A request for a method with additional attributes": {
        topic: function() {
            nock('https://api-3t.paypal.com').post('/nvp', "METHOD=TransactionSearch&VERSION=86.0&USER=david.p_api1.casamiento-cards.co.uk&PWD=WZFA2LEYHLMVS8GC&SIGNATURE=AFcWxV21C7fd0v3bYYYRCpSSRl31AGarkFSt5jUYyxNcPfou1CUmwV3u&STARTDATE=2012-05-01T00:00:00Z&ENDDATE=2012-06-01T00:00:00Z").
            reply(200, "L_TIMESTAMP0=2012%2d05%2d22T20%3a15%3a53Z&L_TIMESTAMP1=2012%2d05%2d19T07%3a29%3a35Z&L_TIMESTAMP2=2012%2d05%2d17T11%3a07%3a04Z&L_TIMESTAMP3=2012%2d05%2d17T11%3a03%3a22Z&L_TIMESTAMP4=2012%2d05%2d17T10%3a59%3a26Z&L_TIMESTAMP5=2012%2d05%2d17T10%3a56%3a12Z&L_TIMESTAMP6=2012%2d05%2d17T10%3a50%3a09Z&L_TIMESTAMP7=2012%2d05%2d17T10%3a45%3a03Z&L_TIMESTAMP8=2012%2d05%2d17T10%3a39%3a55Z&L_TIMESTAMP9=2012%2d05%2d17T10%3a31%3a17Z&L_TIMESTAMP10=2012%2d05%2d16T19%3a12%3a28Z&L_TIMESTAMP11=2012%2d05%2d16T17%3a26%3a07Z&L_TIMESTAMP12=2012%2d05%2d16T08%3a00%3a27Z&L_TIMESTAMP13=2012%2d05%2d16T04%3a05%3a10Z&L_TIMESTAMP14=2012%2d05%2d14T15%3a31%3a10Z&L_TIMESTAMP15=2012%2d05%2d14T07%3a00%3a37Z&L_TIMESTAMP16=2012%2d05%2d14T05%3a21%3a43Z&L_TIMESTAMP17=2012%2d05%2d14T03%3a27%3a37Z&L_TIMESTAMP18=2012%2d05%2d13T23%3a30%3a27Z&L_TIMESTAMP19=2012%2d05%2d06T13%3a09%3a49Z&L_TIMESTAMP20=2012%2d05%2d04T10%3a19%3a25Z&L_TIMEZONE0=GMT&L_TIMEZONE1=GMT&L_TIMEZONE2=GMT&L_TIMEZONE3=GMT&L_TIMEZONE4=GMT&L_TIMEZONE5=GMT&L_TIMEZONE6=GMT&L_TIMEZONE7=GMT&L_TIMEZONE8=GMT&L_TIMEZONE9=GMT&L_TIMEZONE10=GMT&L_TIMEZONE11=GMT&L_TIMEZONE12=GMT&L_TIMEZONE13=GMT&L_TIMEZONE14=GMT&L_TIMEZONE15=GMT&L_TIMEZONE16=GMT&L_TIMEZONE17=GMT&L_TIMEZONE18=GMT&L_TIMEZONE19=GMT&L_TIMEZONE20=GMT&L_TYPE0=Transfer&L_TYPE1=Payment&L_TYPE2=PayPal%20Services&L_TYPE3=PayPal%20Services&L_TYPE4=PayPal%20Services&L_TYPE5=PayPal%20Services&L_TYPE6=Payment&L_TYPE7=PayPal%20Services&L_TYPE8=PayPal%20Services&L_TYPE9=Payment&L_TYPE10=Payment&L_TYPE11=Payment&L_TYPE12=Payment&L_TYPE13=Payment&L_TYPE14=Payment&L_TYPE15=Payment&L_TYPE16=Payment&L_TYPE17=Payment&L_TYPE18=Payment&L_TYPE19=Payment&L_TYPE20=Payment&L_EMAIL10=minnigram%40web%2ede&L_EMAIL11=ebay%40appliedminds%2ecom&L_EMAIL12=horse%2eshit%40bigpond%2ecom&L_EMAIL13=gloriafroese%40mac%2ecom&L_EMAIL14=alanpeatppa%40hotmail%2eco%2euk&L_EMAIL15=krouichi%40yahoo%2eco%2euk&L_EMAIL16=rtn%40wanadoo%2efr&L_EMAIL17=ssstrand%40yahoo%2ecom&L_EMAIL18=shrivle%40gmail%2ecom&L_EMAIL20=paddycover%40googlemail%2ecom&L_NAME0=Bank%20Account&L_NAME1=eBay%20Europe%20Sarl&L_NAME2=Royal%20Mail%20Group%20Online%20Postage&L_NAME3=Royal%20Mail%20Group%20Online%20Postage&L_NAME4=Royal%20Mail%20Group%20Online%20Postage&L_NAME5=Royal%20Mail%20Group%20Online%20Postage&L_NAME6=eBay%20Intl%20AG&L_NAME7=Royal%20Mail%20Group%20Online%20Postage&L_NAME8=Royal%20Mail%20Group%20Online%20Postage&L_NAME9=eBay%20Intl%20AG&L_NAME10=Jens%20Mingram&L_NAME11=Applied%20Minds%2c%20LLC&L_NAME12=Peter%20Paisley&L_NAME13=O4W&L_NAME14=alan%20peat&L_NAME15=KHADIJA%20ROUICHI&L_NAME16=Claude%20BREZISKY&L_NAME17=Stacy%20Strand&L_NAME18=michael%20shelley&L_NAME19=eBay%20Intl%20AG&L_NAME20=jennifer%20dawn%20smith&L_TRANSACTIONID0=08P312366A533824N&L_TRANSACTIONID1=6L991444RY065835S&L_TRANSACTIONID2=07F50400EP8653201&L_TRANSACTIONID3=12Y32204CH638540N&L_TRANSACTIONID4=6JK94819604513208&L_TRANSACTIONID5=60W86140KF519041U&L_TRANSACTIONID6=87074538UA000645W&L_TRANSACTIONID7=0UW03276HC517132W&L_TRANSACTIONID8=21N658242K2147004&L_TRANSACTIONID9=0HK10009NG293341T&L_TRANSACTIONID10=9V486046X2981604C&L_TRANSACTIONID11=6GT39084KS919154C&L_TRANSACTIONID12=9EG971579R451423P&L_TRANSACTIONID13=15H07593TJ292710E&L_TRANSACTIONID14=28L43894HC2309055&L_TRANSACTIONID15=0GY56867TD408580N&L_TRANSACTIONID16=8JY18967MN4887622&L_TRANSACTIONID17=9R145049BC0949328&L_TRANSACTIONID18=4MH8102228048943U&L_TRANSACTIONID19=0TM944710B021244E&L_TRANSACTIONID20=29422541CW0645544&L_STATUS0=Completed&L_STATUS1=Completed&L_STATUS2=Completed&L_STATUS3=Completed&L_STATUS4=Completed&L_STATUS5=Completed&L_STATUS6=Completed&L_STATUS7=Completed&L_STATUS8=Completed&L_STATUS9=Completed&L_STATUS10=Completed&L_STATUS11=Completed&L_STATUS12=Completed&L_STATUS13=Cleared&L_STATUS14=Completed&L_STATUS15=Completed&L_STATUS16=Completed&L_STATUS17=Completed&L_STATUS18=Completed&L_STATUS19=Completed&L_STATUS20=Completed&L_AMT0=%2d333%2e54&L_AMT1=%2d23%2e08&L_AMT2=%2d3%2e30&L_AMT3=%2d3%2e30&L_AMT4=%2d2%2e70&L_AMT5=%2d3%2e30&L_AMT6=%2d1%2e60&L_AMT7=%2d3%2e30&L_AMT8=%2d2%2e70&L_AMT9=%2d1%2e85&L_AMT10=2%2e65&L_AMT11=19%2e10&L_AMT12=36%2e10&L_AMT13=3%2e09&L_AMT14=2%2e65&L_AMT15=16%2e50&L_AMT16=3%2e71&L_AMT17=3%2e35&L_AMT18=19%2e50&L_AMT19=%2d2%2e70&L_AMT20=7%2e51&L_CURRENCYCODE0=GBP&L_CURRENCYCODE1=GBP&L_CURRENCYCODE2=GBP&L_CURRENCYCODE3=GBP&L_CURRENCYCODE4=GBP&L_CURRENCYCODE5=GBP&L_CURRENCYCODE6=GBP&L_CURRENCYCODE7=GBP&L_CURRENCYCODE8=GBP&L_CURRENCYCODE9=GBP&L_CURRENCYCODE10=GBP&L_CURRENCYCODE11=GBP&L_CURRENCYCODE12=GBP&L_CURRENCYCODE13=GBP&L_CURRENCYCODE14=GBP&L_CURRENCYCODE15=GBP&L_CURRENCYCODE16=GBP&L_CURRENCYCODE17=GBP&L_CURRENCYCODE18=GBP&L_CURRENCYCODE19=GBP&L_CURRENCYCODE20=GBP&L_FEEAMT0=0%2e00&L_FEEAMT1=0%2e00&L_FEEAMT2=0%2e00&L_FEEAMT3=0%2e00&L_FEEAMT4=0%2e00&L_FEEAMT5=0%2e00&L_FEEAMT6=0%2e00&L_FEEAMT7=0%2e00&L_FEEAMT8=0%2e00&L_FEEAMT9=0%2e00&L_FEEAMT10=%2d0%2e30&L_FEEAMT11=%2d0%2e94&L_FEEAMT12=%2d1%2e97&L_FEEAMT13=%2d0%2e32&L_FEEAMT14=%2d0%2e29&L_FEEAMT15=%2d0%2e76&L_FEEAMT16=%2d0%2e34&L_FEEAMT17=%2d0%2e33&L_FEEAMT18=%2d1%2e16&L_FEEAMT19=0%2e00&L_FEEAMT20=%2d0%2e46&L_NETAMT0=%2d333%2e54&L_NETAMT1=%2d23%2e08&L_NETAMT2=%2d3%2e30&L_NETAMT3=%2d3%2e30&L_NETAMT4=%2d2%2e70&L_NETAMT5=%2d3%2e30&L_NETAMT6=%2d1%2e60&L_NETAMT7=%2d3%2e30&L_NETAMT8=%2d2%2e70&L_NETAMT9=%2d1%2e85&L_NETAMT10=2%2e35&L_NETAMT11=18%2e16&L_NETAMT12=34%2e13&L_NETAMT13=2%2e77&L_NETAMT14=2%2e36&L_NETAMT15=15%2e74&L_NETAMT16=3%2e37&L_NETAMT17=3%2e02&L_NETAMT18=18%2e34&L_NETAMT19=%2d2%2e70&L_NETAMT20=7%2e05&TIMESTAMP=2012%2d06%2d21T14%3a22%3a51Z&CORRELATIONID=d2f781592d328&ACK=Success&VERSION=86%2e0&BUILD=3136725", {
                date: 'Thu, 21 Jun 2012 14:22:47 GMT',
                server: 'Apache',
                'content-length': '5537',
                connection: 'close',
                'content-type': 'text/plain; charset=utf-8'
            });

            api.buildQuery("TransactionSearch", this.callback, {
                startdate: "2012-05-01T00:00:00Z",
                enddate: "2012-06-01T00:00:00Z"
            });
        },
        "should return a successful response": function(res) {
            assert.equal(res.ACK, "Success");
        },
        "With an array of objects": {
            topic: function(res) {
                return (res.TransactionSearchResponse)
            },
            "that is not null": function(results) {
                assert(results);
            },
            "that is the correct length": function(results) {
                console.log(results);
                assert.equal(results.length, 21);   
            }
        }
    }
}).run();