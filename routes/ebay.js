module.exports = function(app){

  app.get("/ebay", require('./../controllers/ebay').index);

  app.get('/ebay/:id', require('./../controllers/ebay').show)

// The eBay Notify API posts a message to this address that we need to parse
app.post('/ebay', function(req, res) {
    var result = "";
    req.on('data', function(chunk) {
        result += chunk;
        console.log(result);
    })
    req.on('end', function() {
        try {
            importEbayMessage(result, function(e, r) {
                console.log("DONE", e, r);
            })
        }
        catch (e) {
            console.log(e);
        }
        console.log(result);
        res.end();
    })
});

}