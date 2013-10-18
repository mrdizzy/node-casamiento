var db = require('./../config/db').test_ebay;

exports.update = function(req, res) {
    console.log("Updating", req.body)
    res.json(req.body);
    res.end()
    db.save(req.body, function(err, documents) {
        if (err) {
            console.log("ERROR", err)
            res.status(500);
            res.end();
        }
        else {
            db.get(documents.id, function(error, response) {
                res.json(response)
                res.end();
            })
        }
    });
}
exports.destroy = function(req, res) {
    db.remove(req.product.id, req.product.rev, function(err, doc) {
        if (err) {
            console.log(err)
        }
        else {
            res.status(200);
            res.end()
        }
    })
}
exports.create = function(req, res) {
    db.save(req.body, function(err, documents) {
        if (err) {
            console.log("ERROR", err)
            res.status(500);
            res.end();
        }
        else {
            db.get(documents.id, function(error, response) {
                res.json(response)
                res.end();
            })
        }

    });
}
exports.show = function(req, res) {
var id = req.params.product;
    var cart_id = req.cookies.cart;
    if (req.cookies.cart) {
        db.get(req.cookies.cart, function(err, doc) {
              getProduct(req, res,id,doc)
        })
    } else {
        getProduct(req, res, id)
    }
};

function getProduct(req, res,id,cart) {
    db.get(id, function(error, document) {
    document.cart = cart;
    document.cols = [['#FFC0CB pink','#FFB6C1 lightpink','#FF69B4 hotpink','#FF1493 deeppink','#DB7093 palevioletred','#BC8F8F rosybrown','#C71585 mediumvioletred','#CD5C5C indianred','#F08080 lightcoral','#FFA07A lightsalmon','#FA8072 salmon','#E9967A darksalmon','#DC143C crimson'],['#CD853F peru','#D2691E chocolate','#A0522D sienna','#A52A2A brown','#B22222 firebrick','#8B4513 saddlebrown','#8B0000 darkred','#800000 maroon'],['#FAA460 sandybrown','#FF7F50 coral','#FF6347 tomato','#FF0000 red','#FF4500 orangered','#FF8C00 darkorange','#FFA500 orange'],['#FFD700 gold','#FFFF00 yellow'],['#E6E6FA lavender','#D8BFD8 thistle','#DDA0DD plum','#FF00FF magenta','#EE82EE violet','#DA70D6 orchid','#BA55D3 mediumorchid','#9370DB mediumpurple','#8A2BE2 blueviolet','#9400D3 darkviolet','#9932CC darkorchid','#8B008B darkmagenta','#800080 purple','#4B0082 indigo','#483D8B darkslateblue','#6A5ACD slateblue','#7B68EE mediumslateblue'],['#98FB98 palegreen','#ADFF2F greenyellow','#7FFF00 chartreuse','#7CFC00 lawngreen','#00FF00 lime','#00FF7F springgreen','#00FA9A mediumspringgreen','#90EE90 lightgreen','#32CD32 limegreen','#3CB371 mediumseagreen','#2E8B57 seagreen','#228B22 forestgreen','#008000 green','#006400 darkgreen','#9ACD32 yellowgreen','#6B8E23 olivedrab','#808000 olive','#556B2F darkolivegreen','#8FBC8F darkseagreen','#66CDAA mediumaquamarine','#20B2AA lightseagreen','#008B8B darkcyan','#008080 teal'],['#00FFFF cyan','#7FFFD4 aquamarine','#AFEEEE paleturquoise','#40E0D0 turquoise','#48D1CC mediumturquoise','#00CED1 darkturquoise','#5F9EA0 cadetblue','#4682B4 steelblue','#B0C4DE lightsteelblue','#B0E0E6 powderblue','#ADD8E6 lightblue','#87CEEB skyblue','#87CEFA lightskyblue','#00BFFF deepskyblue','#1E90FF dodgerblue','#6495ED cornflowerblue','#4169E1 royalblue','#0000FF blue','#0000CD mediumblue','#00008B darkblue','#000080 navy','#191970 midnightblue'],['#DCDCDC gainsboro','#D3D3D3 lightgrey','#C0C0C0 silver','#A9A9A9 darkgray','#778899 lightslategray','#708090 slategray','#808080 gray','#696969 dimgray','#2F4F4F darkslategray','#000000 black']]
       // res.format({
        //    json: function() {
         //       res.json(document)
         //   },
          //  html: function() {
          
                res.render('catalog/product_15_oct_2013.ejs', {
                    locals: document
                });
          //  }
        //})
    });
}