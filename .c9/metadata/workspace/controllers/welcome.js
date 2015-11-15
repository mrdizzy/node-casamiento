{"changed":true,"filter":false,"title":"welcome.js","tooltip":"/controllers/welcome.js","value":"var _ = require('underscore'),\n\tdb = require('./../config/db').test_ebay,\n\tcolours = require('./../lib/colour_lookup');\n\nexports.index = function(req, res) {\n    if (req.query.show) {\n    \t\tvar cards_to_show = req.query.show.split(\",\")\n\tcards_to_show = _.map(cards_to_show, function(card) {\n\t\treturn card + \"-name_place\"\n\t})\n    }\n    else {\n\t\tcards_to_show =[\"birds_of_paradise_trees\", \"birds_of_paradise_spirals\", \"acorn_pattern\", \"botanic_sketch\", \"damask\", \"egyptian_diamonds\", \"egyptian_motif\", \"foliage\", \"garden_of_life\", \"guilloche\", \"chequers\", \"ornamental\", \"modern_floral\", \"wild_magic\", \"wild_vintage\", \"zigzag\"]\n\t}\n\tdb.get(cards_to_show, function(err, docs) {\n\n\t\tdocs = docs.toArray();\n\t\t\n\t\tdocs.forEach(function(card) {\n\t\t\tcard.colour_0 = colours[card.colours[0]]\n\t\t\tvar colour_1 = card.colours[1]\n\t\t\tif (colour_1) {\n\t\t\t\tcard.colour_1 = colours[colour_1]\n\t\t\t}\n\n\t\t})\n\t\tdocs.place_cards = docs;\n\t\t\n\tdocs.headline =  req.query.headline || \"Impress your guests with unique place cards to match your theme\"\n\t\tres.render('welcome/index', {\n\t\t\tlocals: docs\n\t\t});\n\t});\n}\n\nexports.about = function(req, res) {\n\tres.render('welcome/about', {\n\t\tlayout: \"about_layout\",\n\t});\n}\n\nexports.faq = function(req, res) {\n\tres.render('welcome/faq', {\n\t\tlayout: \"about_layout\",\n\t});\n}\n\n","undoManager":{"mark":-245,"position":100,"stack":[[{"start":{"row":12,"column":185},"end":{"row":12,"column":186},"action":"insert","lines":[","],"id":367}],[{"start":{"row":12,"column":186},"end":{"row":12,"column":187},"action":"insert","lines":[" "],"id":368}],[{"start":{"row":12,"column":187},"end":{"row":12,"column":189},"action":"insert","lines":["\"\""],"id":369}],[{"start":{"row":12,"column":188},"end":{"row":12,"column":189},"action":"insert","lines":["u"],"id":370}],[{"start":{"row":12,"column":188},"end":{"row":12,"column":189},"action":"remove","lines":["u"],"id":371}],[{"start":{"row":12,"column":188},"end":{"row":12,"column":189},"action":"insert","lines":["g"],"id":372}],[{"start":{"row":12,"column":189},"end":{"row":12,"column":190},"action":"insert","lines":["u"],"id":373}],[{"start":{"row":12,"column":190},"end":{"row":12,"column":191},"action":"insert","lines":["i"],"id":374}],[{"start":{"row":12,"column":191},"end":{"row":12,"column":192},"action":"insert","lines":["l"],"id":375}],[{"start":{"row":12,"column":192},"end":{"row":12,"column":193},"action":"insert","lines":["l"],"id":376}],[{"start":{"row":12,"column":193},"end":{"row":12,"column":194},"action":"insert","lines":["o"],"id":377}],[{"start":{"row":12,"column":194},"end":{"row":12,"column":195},"action":"insert","lines":["c"],"id":378}],[{"start":{"row":12,"column":195},"end":{"row":12,"column":196},"action":"insert","lines":["h"],"id":379}],[{"start":{"row":12,"column":196},"end":{"row":12,"column":197},"action":"insert","lines":["e"],"id":380}],[{"start":{"row":12,"column":198},"end":{"row":12,"column":199},"action":"insert","lines":[","],"id":381}],[{"start":{"row":12,"column":199},"end":{"row":12,"column":200},"action":"insert","lines":[" "],"id":382}],[{"start":{"row":12,"column":200},"end":{"row":12,"column":202},"action":"insert","lines":["\"\""],"id":383}],[{"start":{"row":12,"column":201},"end":{"row":12,"column":202},"action":"insert","lines":["c"],"id":384}],[{"start":{"row":12,"column":202},"end":{"row":12,"column":203},"action":"insert","lines":["h"],"id":385}],[{"start":{"row":12,"column":203},"end":{"row":12,"column":204},"action":"insert","lines":["e"],"id":386}],[{"start":{"row":12,"column":204},"end":{"row":12,"column":205},"action":"insert","lines":["q"],"id":387}],[{"start":{"row":12,"column":205},"end":{"row":12,"column":206},"action":"insert","lines":["u"],"id":388}],[{"start":{"row":12,"column":206},"end":{"row":12,"column":207},"action":"insert","lines":["e"],"id":389}],[{"start":{"row":12,"column":207},"end":{"row":12,"column":208},"action":"insert","lines":["r"],"id":390}],[{"start":{"row":12,"column":208},"end":{"row":12,"column":209},"action":"insert","lines":["s"],"id":391}],[{"start":{"row":12,"column":209},"end":{"row":12,"column":210},"action":"insert","lines":[","],"id":392}],[{"start":{"row":12,"column":210},"end":{"row":12,"column":211},"action":"insert","lines":[" "],"id":393}],[{"start":{"row":12,"column":210},"end":{"row":12,"column":211},"action":"remove","lines":[" "],"id":394}],[{"start":{"row":12,"column":209},"end":{"row":12,"column":210},"action":"remove","lines":[","],"id":395}],[{"start":{"row":12,"column":210},"end":{"row":12,"column":211},"action":"insert","lines":[","],"id":396}],[{"start":{"row":12,"column":211},"end":{"row":12,"column":212},"action":"insert","lines":[" "],"id":397}],[{"start":{"row":12,"column":212},"end":{"row":12,"column":214},"action":"insert","lines":["\"\""],"id":398}],[{"start":{"row":12,"column":213},"end":{"row":12,"column":214},"action":"insert","lines":["o"],"id":399}],[{"start":{"row":12,"column":214},"end":{"row":12,"column":215},"action":"insert","lines":["r"],"id":400}],[{"start":{"row":12,"column":215},"end":{"row":12,"column":216},"action":"insert","lines":["n"],"id":401}],[{"start":{"row":12,"column":216},"end":{"row":12,"column":217},"action":"insert","lines":["a"],"id":402}],[{"start":{"row":12,"column":217},"end":{"row":12,"column":218},"action":"insert","lines":["m"],"id":403}],[{"start":{"row":12,"column":218},"end":{"row":12,"column":219},"action":"insert","lines":["e"],"id":404}],[{"start":{"row":12,"column":219},"end":{"row":12,"column":220},"action":"insert","lines":["n"],"id":405}],[{"start":{"row":12,"column":220},"end":{"row":12,"column":221},"action":"insert","lines":["t"],"id":406}],[{"start":{"row":12,"column":221},"end":{"row":12,"column":222},"action":"insert","lines":["a"],"id":407}],[{"start":{"row":12,"column":222},"end":{"row":12,"column":223},"action":"insert","lines":["l"],"id":408}],[{"start":{"row":12,"column":224},"end":{"row":12,"column":225},"action":"insert","lines":[","],"id":409}],[{"start":{"row":12,"column":225},"end":{"row":12,"column":226},"action":"insert","lines":[" "],"id":410}],[{"start":{"row":12,"column":226},"end":{"row":12,"column":228},"action":"insert","lines":["\"\""],"id":411}],[{"start":{"row":12,"column":227},"end":{"row":12,"column":228},"action":"insert","lines":["m"],"id":412}],[{"start":{"row":12,"column":228},"end":{"row":12,"column":229},"action":"insert","lines":["o"],"id":413}],[{"start":{"row":12,"column":229},"end":{"row":12,"column":230},"action":"insert","lines":["d"],"id":414}],[{"start":{"row":12,"column":230},"end":{"row":12,"column":231},"action":"insert","lines":["e"],"id":415}],[{"start":{"row":12,"column":231},"end":{"row":12,"column":232},"action":"insert","lines":["r"],"id":416}],[{"start":{"row":12,"column":232},"end":{"row":12,"column":233},"action":"insert","lines":["n"],"id":417}],[{"start":{"row":12,"column":233},"end":{"row":12,"column":234},"action":"insert","lines":["_"],"id":418}],[{"start":{"row":12,"column":234},"end":{"row":12,"column":235},"action":"insert","lines":["f"],"id":419}],[{"start":{"row":12,"column":235},"end":{"row":12,"column":236},"action":"insert","lines":["l"],"id":420}],[{"start":{"row":12,"column":236},"end":{"row":12,"column":237},"action":"insert","lines":["o"],"id":421}],[{"start":{"row":12,"column":237},"end":{"row":12,"column":238},"action":"insert","lines":["r"],"id":422}],[{"start":{"row":12,"column":238},"end":{"row":12,"column":239},"action":"insert","lines":["a"],"id":423}],[{"start":{"row":12,"column":239},"end":{"row":12,"column":240},"action":"insert","lines":["l"],"id":424}],[{"start":{"row":12,"column":241},"end":{"row":12,"column":242},"action":"insert","lines":[","],"id":425}],[{"start":{"row":12,"column":242},"end":{"row":12,"column":243},"action":"insert","lines":[" "],"id":426}],[{"start":{"row":12,"column":243},"end":{"row":12,"column":245},"action":"insert","lines":["\"\""],"id":427}],[{"start":{"row":12,"column":244},"end":{"row":12,"column":245},"action":"insert","lines":["w"],"id":428}],[{"start":{"row":12,"column":245},"end":{"row":12,"column":246},"action":"insert","lines":["i"],"id":429}],[{"start":{"row":12,"column":246},"end":{"row":12,"column":247},"action":"insert","lines":["l"],"id":430}],[{"start":{"row":12,"column":247},"end":{"row":12,"column":248},"action":"insert","lines":["d"],"id":431}],[{"start":{"row":12,"column":248},"end":{"row":12,"column":249},"action":"insert","lines":["_"],"id":432}],[{"start":{"row":12,"column":249},"end":{"row":12,"column":250},"action":"insert","lines":["m"],"id":433}],[{"start":{"row":12,"column":250},"end":{"row":12,"column":251},"action":"insert","lines":["a"],"id":434}],[{"start":{"row":12,"column":251},"end":{"row":12,"column":252},"action":"insert","lines":["g"],"id":435}],[{"start":{"row":12,"column":252},"end":{"row":12,"column":253},"action":"insert","lines":["i"],"id":436}],[{"start":{"row":12,"column":253},"end":{"row":12,"column":254},"action":"insert","lines":["c"],"id":437}],[{"start":{"row":12,"column":255},"end":{"row":12,"column":256},"action":"insert","lines":[","],"id":438}],[{"start":{"row":12,"column":256},"end":{"row":12,"column":257},"action":"insert","lines":[" "],"id":439}],[{"start":{"row":12,"column":257},"end":{"row":12,"column":259},"action":"insert","lines":["\"\""],"id":440}],[{"start":{"row":12,"column":258},"end":{"row":12,"column":259},"action":"insert","lines":["i"],"id":441}],[{"start":{"row":12,"column":259},"end":{"row":12,"column":260},"action":"insert","lines":["l"],"id":442}],[{"start":{"row":12,"column":259},"end":{"row":12,"column":260},"action":"remove","lines":["l"],"id":443}],[{"start":{"row":12,"column":258},"end":{"row":12,"column":259},"action":"remove","lines":["i"],"id":444}],[{"start":{"row":12,"column":258},"end":{"row":12,"column":259},"action":"insert","lines":["w"],"id":445}],[{"start":{"row":12,"column":259},"end":{"row":12,"column":260},"action":"insert","lines":["i"],"id":446}],[{"start":{"row":12,"column":260},"end":{"row":12,"column":261},"action":"insert","lines":["l"],"id":447}],[{"start":{"row":12,"column":261},"end":{"row":12,"column":262},"action":"insert","lines":["d"],"id":448}],[{"start":{"row":12,"column":262},"end":{"row":12,"column":263},"action":"insert","lines":["_"],"id":449}],[{"start":{"row":12,"column":263},"end":{"row":12,"column":264},"action":"insert","lines":["v"],"id":450}],[{"start":{"row":12,"column":264},"end":{"row":12,"column":265},"action":"insert","lines":["i"],"id":451}],[{"start":{"row":12,"column":265},"end":{"row":12,"column":266},"action":"insert","lines":["n"],"id":452}],[{"start":{"row":12,"column":266},"end":{"row":12,"column":267},"action":"insert","lines":["t"],"id":453}],[{"start":{"row":12,"column":267},"end":{"row":12,"column":268},"action":"insert","lines":["a"],"id":454}],[{"start":{"row":12,"column":268},"end":{"row":12,"column":269},"action":"insert","lines":["g"],"id":455}],[{"start":{"row":12,"column":269},"end":{"row":12,"column":270},"action":"insert","lines":["e"],"id":456}],[{"start":{"row":12,"column":271},"end":{"row":12,"column":272},"action":"insert","lines":[","],"id":457}],[{"start":{"row":12,"column":272},"end":{"row":12,"column":273},"action":"insert","lines":[" "],"id":458}],[{"start":{"row":12,"column":273},"end":{"row":12,"column":275},"action":"insert","lines":["\"\""],"id":459}],[{"start":{"row":12,"column":274},"end":{"row":12,"column":275},"action":"insert","lines":["z"],"id":460}],[{"start":{"row":12,"column":275},"end":{"row":12,"column":276},"action":"insert","lines":["i"],"id":461}],[{"start":{"row":12,"column":276},"end":{"row":12,"column":277},"action":"insert","lines":["z"],"id":462}],[{"start":{"row":12,"column":276},"end":{"row":12,"column":277},"action":"remove","lines":["z"],"id":463}],[{"start":{"row":12,"column":276},"end":{"row":12,"column":277},"action":"insert","lines":["g"],"id":464}],[{"start":{"row":12,"column":277},"end":{"row":12,"column":278},"action":"insert","lines":["z"],"id":465}],[{"start":{"row":12,"column":278},"end":{"row":12,"column":279},"action":"insert","lines":["a"],"id":466}],[{"start":{"row":12,"column":279},"end":{"row":12,"column":280},"action":"insert","lines":["g"],"id":467}]]},"ace":{"folds":[],"scrolltop":81,"scrollleft":0,"selection":{"start":{"row":12,"column":281},"end":{"row":12,"column":281},"isBackwards":false},"options":{"guessTabSize":true,"useWrapMode":true,"wrapToView":true},"firstLineState":0},"timestamp":1447578169712}