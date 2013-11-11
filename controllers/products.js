var db = require('./../config/db').test_ebay,
_ = require('underscore')

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
    for(var i=0;i < 6; i++) {
        if (document['background-' + i]) {
            var compiled = _.template(document['background-' + i]);
    document['background-' + i] = compiled({colour: document.colours[1]});
    
    document['background_' + i] = document['background-' + i]
        }
    }
    document.hex_colours = ["#CC6666","#701C1C","#321414","#F08080","#1B1B1B","#C0C0C0","#8B0000","#FF0000","#ACACAC","#B31B1B","#FFFAFA","#FF9999","#757575","#990000","#989898","#A9A9A9","#801818","#A52A2A","#000000","#B22222","#990000","#996666","#FF4040","#A52A2A","#3C1414","#B31B1B","#F4C2C2","#F5F5F5","#E62020","#CC0000","#FFFFFF","#A9A9A9","#D3D3D3","#701C1C","#343434","#808080","#A52A2A","#DCDCDC","#CC3333","#800000","#7C4848","#C09999","#555555","#BC8F8F","#F4C2C2","#808080","#808080","#BEBEBE","#D40000","#A40000","#905D5D","#000000","#990000","#CD5C5C","#696969","#DEA5A4","#F7BFBE","#704241","#704241","#922724","#FF0800","#C4AEAD","#D7837F","#FF6961","#B94E48","#FF5349","#BA160C","#EB4C42","#674846","#E03C31","#FD5E53","#7C0A02","#C0362C","#AE0C00","#F88379","#F88379","#F88379","#E34234","#E34234","#AD6F69","#FE2712","#AF4035","#AF4035","#43302E","#A45A52","#1A1110","#FFE4E1","#FA8072","#FE6F5E","#E5CCC9","#FDBCB4","#645452","#592720","#A81C07","#C95A49","#DA614E","#D9381E","#FF2400","#79443B","#79443B","#8A3324","#FF6347","#674C47","#674C47","#C23B22","#FF2800","#986960","#CD5B45","#954535","#3D0C02","#E2725B","#FF5A36","#AA381E","#4E1609","#7C1C05","#882D17","#882D17","#6C2E1F","#FFA089","#FF6E4A","#A57164","#98817B","#543D37","#FF3800","#CB6D51","#E97451","#E97451","#D9603B","#E9967A","#FB4F14","#FF7F50","#FF4500","#FE5A1D","#CB410B","#E25822","#FFA07A","#B7410E","#DA8A67","#DA8A67","#FF7538","#F94D00","#FF4F00","#965A3E","#E9692C","#FF9966","#FF9966","#C04000","#FF8243","#FF5800","#FD5800","#635147","#C9C0BB","#FFDDCA","#9F8170","#CD9575","#EC5800","#2C1608","#FBCEB1","#DEAA88","#3D2B1F","#FF7518","#FF6700","#6F4E37","#6F4E37","#FFF5EE","#BB6528","#8B4513","#D2691E","#CC5500","#D2691E","#D2691E","#E86100","#EDC9AF","#BC987E","#CD5700","#80461B","#A67B5B","#A67B5B","#A67B5B","#FFCBA4","#FFCBA4","#A0785A","#B38B6D","#D99058","#F58025","#987456","#483C32","#483C32","#483C32","#C46210","#6B4423","#6B4423","#836953","#F4A460","#FFE4CD","#ED872D","#FFDAB9","#B5651D","#FDD5B1","#FDD5B1","#BA8759","#B86D29","#B87333","#FBAB60","#9B7653","#CD853F","#E08D3C","#FF7E00","#E5AA70","#CD7F32","#FF7F00","#F4F0EC","#4B3621","#FF9933","#CC7722","#F8B878","#100C08","#EFDECD","#FAF0E6","#964B00","#987654","#FFCC99","#654321","#654321","#704214","#A75502","#FFA343","#7B3F00","#F77F00","#D1BEA8","#FFE4C4","#644117","#C19A6B","#C19A6B","#C19A6B","#C19A6B","#C19A6B","#826644","#ED9121","#FF8C00","#F28500","#DBD7D2","#DEB887","#E6BE8A","#E1A95F","#FAEBD7","#FAEBD7","#A99A86","#856D4D","#FFAE42","#D2B48C","#B06500","#FAD6A5","#FAD6A5","#FAD6A5","#E3A857","#E48400","#FFC87C","#664C28","#FFB347","#FFDEAD","#FFEBCD","#E3AB57","#996515","#FB9902","#F7E7CE","#FFEFD5","#C3B091","#8A795D","#FF9F00","#C8AD7F","#FFA812","#FFA500","#FADFAD","#F5DEB3","#FDF5E6","#FFE5B4","#E3DAC9","#FFA700","#E49B0F","#DA9100","#FFFAF0","#B78727","#E5E4E2","#9C7C38","#6C541E","#EFDFBB","#FFB300","#EAE0C8","#FFF8E7","#967117","#967117","#967117","#967117","#967117","#85754E","#B8860B","#DAA520","#CBA135","#3C341F","#FAE7B5","#E1AD21","#FFBA00","#E5B73B","#CCA01D","#FFBF00","#FFBF00","#918151","#FFCC33","#F4C430","#FFC40C","#C2B280","#C2B280","#D4AF37","#F0EAD6","#FCC200","#FFDB58","#F6EABE","#F8DE7E","#F8DE7E","#F5C71A","#FADA5E","#FADA5E","#FADA5E","#FFF8DC","#FFCC00","#FFCC00","#F3E5AB","#F3E5AB","#F4CA16","#F0DC82","#CFB53B","#FFD300","#FFD300","#FAF0BE","#EEDC82","#FCE883","#C5B358","#FFD700","#FFD800","#E9D66B","#E9D66B","#FFE135","#EFCC00","#807532","#9B870C","#ECD540","#F7E98E","#B5A642","#FFDF00","#665D1E","#FEDF00","#EED202","#FFFACD","#F0E68C","#867E36","#F0E68C","#FBEC5D","#FBEC5D","#E4D96F","#E4D00A","#EEE8AA","#BCB88A","#F0E130","#BDB76B","#FFEF00","#FFEF00","#FFF44F","#FDEE00","#FFF000","#FFFDD0","#FFF600","#EEE600","#FCF75E","#FFF700","#737000","#ECEBBD","#E6E200","#FFFF00","#CFCFC4","#808000","#FEFE33","#FFFFE0","#FEFEFA","#808000","#848482","#848482","#F5F5DC","#FDFD96","#FFFF31","#FFFF66","#FAFAD2","#FFFFF0","#FFFF33","#FFFF66","#FDFF00","#9FA91F","#D1E231","#CAE00D","#E3FF00","#A8BB19","#DFFF00","#4B5320","#3B3C36","#E3F988","#CCFF00","#9DC209","#CCFF00","#BDDA57","#C9DC87","#8DB600","#A4C639","#BFFF00","#BFFF00","#8A9A5B","#8F9779","#8FD400","#6B8E23","#4A5D23","#9ACD32","#A7FC00","#568203","#556B2F","#ADFF2F","#444C38","#B2EC5D","#9AB973","#9EFD38","#7FFF00","#7CFC00","#78866B","#507D2A","#87A96B","#A9BA9D","#66B032","#66FF00","#93C572","#E9FFDB","#555D50","#85BB65","#D0F0C0","#2A8000","#4CBB17","#7BB661","#354230","#3FFF00","#195905","#4F7942","#74C365","#39FF14","#4C9141","#A8E4A0","#138808","#465945","#008000","#006400","#90EE90","#98FB98","#00FF00","#228B22","#009000","#008000","#8FBC8F","#32CD32","#679267","#306030","#006600","#F0FFF0","#00FF00","#008000","#98FF98","#00FF00","#77DD77","#ADDFAD","#76FF7A","#ACE1AF","#355E3B","#355E3B","#738276","#96C8A2","#253529","#B2BEB5","#738678","#1E4D2B","#03C03C","#059033","#50C878","#50C878","#A3C1AD","#99E6B3","#0BDA51","#3CD070","#087830","#A0D6B4","#4D5D53","#00AD43","#2E8B57","#3B7A57","#3CB371","#014421","#014421","#00A550","#00FF7F","#00FF7F","#F5FFFA","#177245","#123524","#C9FFE5","#00703C","#009150","#AAF0D1","#004225","#006B3C","#66DDAA","#00AB66","#009E60","#00FA9A","#013220","#3EB489","#00A86B","#1CAC78","#7FFFD4","#009F6B","#1C352D","#44D7A8","#40826D","#30BA8F","#1B4D3E","#88D8C0","#1B4D3E","#1A2421","#49796B","#00A877","#29AB87","#007F5C","#319177","#00563F","#00563F","#006A4E","#006A4E","#00CC99","#39A78E","#18453B","#007F66","#00755E","#009B7D","#96DED1","#3AB09E","#00A693","#40E0D0","#2F847C","#01796F","#317873","#00FFEF","#20B2AA","#43B3AE","#08E8DE","#48D1CC","#0ABAB5","#004B49","#00827F","#00FFFF","#B2FFFF","#007474","#004040","#232B2B","#AFEEEE","#2F4F4F","#E0FFFF","#00FFFF","#00FFFF","#F0FFFF","#00FFFF","#AFEEEE","#008B8B","#008080","#B2FFFF","#00CCCC","#004242","#009698","#00CED1","#5F9EA0","#E7FEFF","#7DF9FF","#6E7F80","#A4F4F9","#0A7E8C","#B0E0E6","#004953","#ACE5EE","#264348","#4F666A","#80DAEB","#0093AF","#0095B6","#414A4C","#B9F2FF","#0D98BA","#21ABCD","#00CCFF","#A4DDED","#00B7EB","#1DACD6","#367588","#4A646C","#ADD8E6","#353839","#00BFFF","#00BFFF","#0FC0FC","#007AA5","#007BA7","#007BA7","#A6E7FF","#AEC6CF","#126180","#0087BD","#87CEEB","#006994","#0892D0","#73A9C2","#89CFF0","#536872","#8CBED6","#007BB8","#BFC1C2","#C4D8E2","#45B1E8","#93CCEA","#0077BE","#0067A5","#0067A5","#006DB0","#87CEFA","#00416A","#0072BB","#0070B8","#36454F","#5D8AA8","#5D8AA8","#56A0D3","#003153","#72A0C1","#73C2FB","#91A3B0","#4997D0","#9BC4E2","#BCD4E6","#BCD4E6","#536878","#536878","#7CB9E8","#3B444B","#0073CF","#71A6D2","#4682B4","#6D9BC3","#F0F8FF","#035096","#004F98","#08457E","#A1CAF1","#1E90FF","#ABCDEF","#003366","#6699CC","#778899","#318CE7","#708090","#26619C","#6699CC","#F2F3F4","#007FFF","#1974D2","#436B95","#0F4D92","#5D89BA","#417DC1","#002147","#6CA0DC","#779ECB","#77B5FE","#8AB9F1","#1560BD","#0070FF","#B0C4DE","#778BA5","#0047AB","#2E5894","#5B92E5","#6082B6","#0F52BA","#5072A7","#1F75FE","#7C9ED9","#6495ED","#002366","#00308F","#0038A8","#003399","#003399","#4F86F7","#1C2841","#536895","#838996","#062A78","#0033AA","#446CCF","#002FA7","#214FC6","#0247FE","#2A52BE","#002387","#4169E1","#92A1CF","#1034A6","#A2ADD0","#002395","#1D2951","#4166F5","#324AB2","#8C92AC","#8C92AC","#1C39BB","#091F92","#979AAA","#4C516D","#0018A8","#0014A8","#000F89","#273BE2","#E6E8FA","#545AA7","#23297A","#4E5180","#666699","#A2A2D0","#191970","#CCCCFF","#E6E6FA","#000080","#1C1CF0","#0000FF","#00008B","#00009C","#F8F8FF","#E6E6FA","#CCCCFF","#0000CD","#333399","#777696","#120A8F","#C4C3D0","#5A4FCF","#746CC0","#6050DC","#6A5ACD","#483D8B","#7B68EE","#CEC8EF","#8878C3","#3F00FF","#DCD0FF","#5218FA","#32127A","#9370DB","#B19CD9","#F8F4FF","#966FD6","#58427C","#4C2882","#9457EB","#9457EB","#6F00FF","#6F00FF","#7851A9","#522D80","#967BB6","#9678B6","#7F00FF","#9966CC","#32174D","#69359C","#734F96","#8A2BE2","#6F2DA8","#BF94E4","#8F00FF","#8F00FF","#4B0082","#B57EDC","#A76BCF","#E0B0FF","#A020F0","#A020F0","#9F00FF","#D6CADD","#8806CE","#9955BB","#9932CC","#C9A0DC","#D19FE8","#9400D3","#6C3082","#B666D2","#BF00FF","#D891EF","#8601AF","#DF73FF","#9A4EAE","#B284BE","#CC00FF","#BA55D3","#9F00C5","#563C5C","#563C5C","#563C5C","#602F6B","#86608E","#86608E","#F4BBFF","#F4BBFF","#F1A7FE","#DF00FF","#DF00FF","#B39EB5","#856088","#800080","#C8A2C8","#800080","#D473D4","#EE82EE","#CC33CC","#D473D4","#FF00FF","#C154C1","#D8BFD8","#FF77FF","#FF6FFF","#CC00CC","#C154C1","#FF00FF","#DDA0DD","#DDA0DD","#DDA0DD","#8B008B","#EE82EE","#FF6FFF","#880085","#DA70D6","#CB99C9","#AA98A9","#AA98A9","#796878","#F984EF","#5B3256","#8E4585","#682860","#8D4E85","#D39BCB","#F984E5","#BD33A4","#702963","#D8B2D1","#50404D","#FE4EDA","#FF1DCE","#51484F","#E6A8D7","#5D3954","#FF33CC","#FC0FC0","#FBA0E3","#915C83","#B768A2","#FFCFF1","#FF5CCD","#B784A7","#FFDDF4","#A2006D","#8B8589","#FF66CC","#B53389","#F400A1","#F400A1","#CF71AF","#CA2C92","#C71585","#C71585","#CF6BA9","#997A8D","#663854","#BB3385","#E7ACCF","#66023C","#66023C","#811453","#FBCCE7","#FE28A2","#FFB3DE","#FF0090","#E0218A","#9F4576","#E4007C","#873260","#FF1493","#FF1493","#A50B5E","#CA1F7B","#C54B8C","#D74894","#DA1D81","#E40078","#F77FBE","#8A496B","#78184A","#FF43A4","#614051","#E79FC4","#C84186","#DA3287","#872657","#F9429E","#FF69B4","#D470A2","#534B4F","#FF007F","#FF007F","#E25098","#FBAED2","#FF55A3","#FF55A3","#DE6FA1","#DE6FA1","#DE6FA1","#CC397B","#F49AC2","#FD3F92","#FFBCD9","#D0417E","#CF3476","#D71868","#D10056","#673147","#673147","#EC3B83","#843F5B","#F75394","#FFA6C9","#E8CCD7","#AA4069","#E30B5D","#C74375","#E0115F","#B03060","#B03060","#F64A8A","#8E3A59","#E3256B","#B48395","#F19CBB","#DE5285","#C30B4E","#B3446C","#B3446C","#D70A53","#CE4676","#D9004C","#FD6C9E","#F6ADC6","#C21E56","#D10047","#FFF0F5","#E68FAC","#E68FAC","#A8516E","#DB7093","#DB7093","#EFBBCC","#FC5A8D","#FF004F","#66424D","#FC89AC","#AB274F","#F2BDCD","#E75480","#D3003F","#D70040","#D70040","#DE5D83","#DE3163","#DE3163","#F56991","#FDDDE6","#915F6D","#915F6D","#7F1734","#FF91AF","#FC8EAC","#AC1E44","#560319","#BE0032","#F38FA9","#C40233","#800020","#CC8899","#F2003C","#FF003F","#E51A4C","#9C2542","#C32148","#C32148","#AF002A","#FF033E","#F78FA7","#B57281","#FF0038","#A9203E","#EE204D","#E63E62","#EF98AA","#703642","#FF355E","#DC143C","#FB607F","#E52B50","#FFB7C5","#FE4164","#9F1D35","#D98695","#C72C48","#FFC1CC","#FFC0CB","#FC6C85","#FC6C85","#FF91A4","#E2062C","#841B2D","#BE4F62","#C41E3A","#E60026","#FD0E35","#FD0E35","#960018","#FF0028","#A95C68","#B76E79","#FFB6C1","#E30022","#CB4154","#893843","#DA2C43","#EA3C53","#98777B","#860111","#722F37","#722F37","#CC4E5C","#C90016","#65000B","#E18E96","#4F3A3C","#9B111E","#FADADD","#8A7F80","#9D2933","#E32636","#E32636","#CF1020","#ED2939","#ED2939","#893F45","#E66771","#E4717A","#E4717A","#AB4B52","#92000A","#C80815","#AE2029","#7E5E60","#E8000D","#CE2029","#FF878D","#933D41","#AB4E52","#EF3038","#DDADAF","#ED1C24","#9E1316","#D73B3E","#7B1113","#BF4F51","#C08081","#480607"] 
    document.colours_ref = {"#A8BB19":"Acid green","#7CB9E8":"Aero","#C9FFE5":"Aero blue","#B284BE":"African violet","#5D8AA8":"Rackley","#00308F":"Air Force blue (USAF)","#72A0C1":"Air superiority blue","#AF002A":"Alabama Crimson","#F0F8FF":"Alice blue","#E32636":"Rose madder","#C46210":"Alloy orange","#EFDECD":"Almond","#E52B50":"Amaranth","#F19CBB":"Amaranth pink","#AB274F":"Amaranth purple","#3B7A57":"Amazon","#FFBF00":"Fluorescent orange","#FF7E00":"SAE/ECE Amber (color)","#FF033E":"American rose","#9966CC":"Amethyst","#A4C639":"Android green","#F2F3F4":"Anti-flash white","#CD9575":"Antique brass","#665D1E":"Antique bronze","#915C83":"Antique fuchsia","#841B2D":"Antique ruby","#FAEBD7":"Moccasin","#008000":"Office green","#8DB600":"Apple green","#FBCEB1":"Apricot","#00FFFF":"Spanish sky blue","#7FFFD4":"Aquamarine","#4B5320":"Army green","#3B444B":"Arsenic","#8F9779":"Artichoke","#E9D66B":"Hansa yellow","#B2BEB5":"Ash grey","#87A96B":"Asparagus","#FF9966":"Pink-orange","#A52A2A":"Red-brown","#FDEE00":"Aureolin","#6E7F80":"AuroMetalSaurus","#568203":"Avocado","#007FFF":"Azure","#F0FFFF":"Azure mist/web","#89CFF0":"Baby blue","#A1CAF1":"Baby blue eyes","#F4C2C2":"Tea rose","#FEFEFA":"Baby powder","#21ABCD":"Ball blue","#FAE7B5":"Banana Mania","#FFE135":"Banana yellow","#006A4E":"Bottle green","#E0218A":"Barbie pink","#7C0A02":"Barn red","#848482":"Old silver","#98777B":"Bazaar","#BCD4E6":"Pale aqua","#9F8170":"Beaver","#F5F5DC":"Beige","#2E5894":"B'dazzled blue","#9C2542":"Big dip o’ruby","#FFE4C4":"Bisque","#3D2B1F":"Bistre","#967117":"Sandy taupe","#CAE00D":"Bitter lemon","#BFFF00":"Lime (color wheel)","#FE6F5E":"Bittersweet","#BF4F51":"Bittersweet shimmer","#000000":"Cool black","#3D0C02":"Black bean","#253529":"Black leather jacket","#3B3C36":"Black olive","#FFEBCD":"Blanched almond","#A57164":"Blast-off bronze","#318CE7":"Bleu de France","#ACE5EE":"Blizzard Blue","#FAF0BE":"Blond","#0000FF":"Blue","#1F75FE":"Blue (Crayola)","#0093AF":"Blue (Munsell)","#0087BD":"Blue (NCS)","#0018A8":"Blue (Pantone)","#333399":"Blue (pigment)","#0247FE":"Blue (RYB)","#A2A2D0":"Blue Bell","#6699CC":"Livid","#0D98BA":"Blue-green","#126180":"Blue sapphire","#8A2BE2":"Blue-violet","#5072A7":"Blue yonder","#4F86F7":"Blueberry","#1C1CF0":"Bluebonnet","#DE5D83":"Blush","#79443B":"Medium Tuscan red","#0095B6":"Bondi blue","#E3DAC9":"Bone","#CC0000":"Boston University Red","#873260":"Boysenberry","#0070FF":"Brandeis blue","#B5A642":"Brass","#CB4154":"Brick red","#1DACD6":"Bright cerulean","#66FF00":"Bright green","#BF94E4":"Bright lavender","#D891EF":"Bright lilac","#C32148":"Maroon (Crayola)","#1974D2":"Bright navy blue","#FF007F":"Rose","#08E8DE":"Bright turquoise","#D19FE8":"Bright ube","#F4BBFF":"Electric lavender","#FF55A3":"Magenta (Crayola)","#FB607F":"Brink pink","#004225":"British racing green","#CD7F32":"Bronze","#737000":"Bronze Yellow","#964B00":"Brown (traditional)","#6B4423":"Flattery","#1B4D3E":"English green","#FFC1CC":"Bubble gum","#E7FEFF":"Bubbles","#F0DC82":"Buff","#7BB661":"Bud green","#480607":"Bulgarian rose","#800020":"Burgundy","#DEB887":"Burlywood","#CC5500":"Burnt orange","#E97451":"Light red ochre","#8A3324":"Burnt umber","#BD33A4":"Byzantine","#702963":"Byzantium","#536872":"Cadet","#5F9EA0":"Cadet blue","#91A3B0":"Cadet grey","#006B3C":"Cadmium green","#ED872D":"Cadmium orange","#E30022":"Cadmium red","#FFF600":"Cadmium yellow","#A67B5B":"Tuscan tan","#4B3621":"Café noir","#1E4D2B":"Cal Poly Pomona green","#A3C1AD":"Cambridge Blue","#C19A6B":"Wood brown","#EFBBCC":"Cameo pink","#78866B":"Camouflage green","#FFEF00":"Yellow (process)","#FF0800":"Candy apple red","#E4717A":"Tango pink","#00BFFF":"Deep sky blue","#592720":"Caput mortuum","#C41E3A":"Cardinal","#00CC99":"Caribbean green","#960018":"Carmine","#D70040":"Rich carmine","#EB4C42":"Carmine pink","#FF0038":"Carmine red","#FFA6C9":"Carnation pink","#B31B1B":"Cornell Red","#56A0D3":"Carolina blue","#ED9121":"Carrot orange","#00563F":"Sacramento State green","#062A78":"Catalina blue","#703642":"Catawba","#C95A49":"Cedar Chest","#92A1CF":"Ceil","#ACE1AF":"Celadon","#007BA7":"Cerulean","#2F847C":"Celadon green","#B2FFFF":"Italian sky blue","#4997D0":"Celestial blue","#DE3163":"Cherry","#EC3B83":"Cerise pink","#2A52BE":"Cerulean blue","#6D9BC3":"Cerulean frost","#007AA5":"CG Blue","#E03C31":"CG Red","#A0785A":"Chamoisee","#F7E7CE":"Champagne","#36454F":"Charcoal","#232B2B":"Charleston green","#E68FAC":"Light Thulian pink","#DFFF00":"Chartreuse (traditional)","#7FFF00":"Chartreuse (web)","#FFB7C5":"Cherry blossom pink","#954535":"Chestnut","#DE6FA1":"Thulian pink","#A8516E":"China rose","#AA381E":"Chinese red","#856088":"Chinese violet","#7B3F00":"Chocolate (traditional)","#D2691E":"Cocoa brown","#FFA700":"Chrome yellow","#98817B":"Cinereous","#E34234":"Vermilion","#E4D00A":"Citrine","#9FA91F":"Citron","#7F1734":"Claret","#FBCCE7":"Classic rose","#0047AB":"Cobalt","#965A3E":"Coconut","#6F4E37":"Tuscan brown","#C4D8E2":"Columbia blue","#F88379":"Tea rose","#8C92AC":"Gray-blue","#B87333":"Copper","#DA8A67":"Pale copper","#AD6F69":"Copper penny","#CB6D51":"Copper red","#996666":"Copper rose","#FF3800":"Coquelicot","#FF7F50":"Coral","#FF4040":"Coral red","#893F45":"Cordovan","#FBEC5D":"Maize","#6495ED":"Cornflower blue","#FFF8DC":"Cornsilk","#FFF8E7":"Cosmic latte","#FFBCD9":"Cotton candy","#FFFDD0":"Cream","#DC143C":"Crimson","#BE0032":"Crimson glory","#00B7EB":"Cyan (process)","#58427C":"Cyber grape","#FFD300":"Yellow (NCS)","#FFFF31":"Daffodil","#F0E130":"Dandelion","#00008B":"Dark blue","#666699":"Dark blue-gray","#654321":"Otter brown","#5D3954":"Dark byzantium","#A40000":"Dark candy apple red","#08457E":"Dark cerulean","#986960":"Dark chestnut","#CD5B45":"Dark coral","#008B8B":"Dark cyan","#536878":"Payne's grey","#B8860B":"Dark goldenrod","#A9A9A9":"Dark medium gray","#013220":"Dark green","#006400":"Dark green (X11)","#00416A":"Dark imperial blue","#1A2421":"Dark jungle green","#BDB76B":"Dark khaki","#483C32":"Taupe","#734F96":"Dark lavender","#534B4F":"Dark liver","#543D37":"Dark liver (horses)","#8B008B":"Dark magenta","#003366":"Dark midnight blue","#4A5D23":"Dark moss green","#556B2F":"Dark olive green","#FF8C00":"Dark orange","#9932CC":"Dark orchid","#779ECB":"Dark pastel blue","#03C03C":"Dark pastel green","#966FD6":"Dark pastel purple","#C23B22":"Dark pastel red","#E75480":"Dark pink","#003399":"Smalt (Dark powder blue)","#4F3A3C":"Dark puce","#872657":"Dark raspberry","#8B0000":"Dark red","#E9967A":"Dark salmon","#560319":"Dark scarlet","#8FBC8F":"Dark sea green","#3C1414":"Dark sienna","#8CBED6":"Dark sky blue","#483D8B":"Dark slate blue","#2F4F4F":"Dark slate gray","#177245":"Dark spring green","#918151":"Dark tan","#FFA812":"Dark tangerine","#CC4E5C":"Dark terra cotta","#00CED1":"Dark turquoise","#D1BEA8":"Dark vanilla","#9400D3":"Dark violet","#9B870C":"Dark yellow","#00703C":"Dartmouth green","#555555":"Davy's grey","#D70A53":"Debian red","#A9203E":"Deep carmine","#EF3038":"Deep carmine pink","#E9692C":"Deep carrot orange","#DA3287":"Deep cerise","#FAD6A5":"Tuscan","#B94E48":"Deep chestnut","#704241":"Roast coffee","#C154C1":"Fuchsia (Crayola)","#004B49":"Deep jungle green","#F5C71A":"Deep lemon","#9955BB":"Deep lilac","#CC00CC":"Deep magenta","#D473D4":"French mauve","#355E3B":"Hunter green","#FFCBA4":"Peach","#FF1493":"Fluorescent pink","#A95C68":"Deep puce","#843F5B":"Deep ruby","#FF9933":"Deep saffron","#4A646C":"Deep Space Sparkle","#7E5E60":"Deep Taupe","#66424D":"Deep Tuscan red","#BA8759":"Deer","#1560BD":"Denim","#EDC9AF":"Desert sand","#EA3C53":"Desire","#B9F2FF":"Diamond","#696969":"Dim gray","#9B7653":"Dirt","#1E90FF":"Dodger blue","#D71868":"Dogwood rose","#85BB65":"Dollar bill","#664C28":"Donkey brown","#00009C":"Duke blue","#E5CCC9":"Dust storm","#EFDFBB":"Dutch white","#E1A95F":"Earth yellow","#555D50":"Ebony","#C2B280":"Sand","#1B1B1B":"Eerie black","#614051":"Eggplant","#F0EAD6":"Eggshell","#1034A6":"Egyptian blue","#7DF9FF":"Electric blue","#FF003F":"Electric crimson","#00FF00":"Lime (web) (X11 green)","#6F00FF":"Indigo","#CCFF00":"Fluorescent yellow","#BF00FF":"Electric purple","#3F00FF":"Electric ultramarine","#8F00FF":"Violet","#FFFF33":"Electric yellow","#50C878":"Paris Green","#6C3082":"Eminence","#B48395":"English lavender","#AB4B52":"English red","#563C5C":"Pineapple","#96C8A2":"Eton blue","#44D7A8":"Eucalyptus","#801818":"Falu red","#B53389":"Fandango","#DE5285":"Fandango pink","#F400A1":"Hollywood cerise","#E5AA70":"Fawn","#4D5D53":"Feldgrau","#FDD5B1":"Light apricot","#4F7942":"Fern green","#FF2800":"Ferrari Red","#6C541E":"Field drab","#B22222":"Firebrick","#CE2029":"Fire engine red","#E25822":"Flame","#FC8EAC":"Flamingo pink","#F7E98E":"Flavescent","#EEDC82":"Flax","#A2006D":"Flirt","#FFFAF0":"Floral white","#FF004F":"Folly","#014421":"UP Forest green","#228B22":"Forest green (web)","#856D4D":"French bistre","#0072BB":"French blue","#FD3F92":"French fuchsia","#86608E":"Pomp and Power","#9EFD38":"French lime","#FD6C9E":"French pink","#811453":"French plum","#4E1609":"French puce","#C72C48":"French raspberry","#F64A8A":"French rose","#77B5FE":"French sky blue","#8806CE":"French violet","#AC1E44":"French wine","#A6E7FF":"Fresh Air","#FF00FF":"Magenta","#FF77FF":"Fuchsia pink","#CC397B":"Fuchsia purple","#C74375":"Fuchsia rose","#E48400":"Fulvous","#CC6666":"Fuzzy Wuzzy","#DCDCDC":"Gainsboro","#E49B0F":"Gamboge","#007F66":"Generic viridian","#F8F8FF":"Ghost white","#FE5A1D":"Giants orange","#B06500":"Ginger","#6082B6":"Glaucous","#E6E8FA":"Glitter","#00AB66":"GO green","#D4AF37":"Gold (metallic)","#FFD700":"Gold (web) (Golden)","#85754E":"Gold Fusion","#996515":"Bubble but brown","#FCC200":"Golden poppy","#FFDF00":"Golden yellow","#DAA520":"Goldenrod","#A8E4A0":"Granny Smith Apple","#6F2DA8":"Grape","#808080":"Trolley Grey","#BEBEBE":"Gray (X11 gray)","#465945":"Gray-asparagus","#1CAC78":"Green (Crayola)","#00A877":"Green (Munsell)","#009F6B":"Green (NCS)","#00AD43":"Green (Pantone)","#00A550":"Green (pigment)","#66B032":"Green (RYB)","#ADFF2F":"Green-yellow","#A99A86":"Grullo","#00FF7F":"Spring green","#663854":"Halay�  úbe","#446CCF":"Han blue","#5218FA":"Han purple","#3FFF00":"Harlequin","#C90016":"Harvard crimson","#DA9100":"Harvest gold","#808000":"Olive","#DF73FF":"Heliotrope","#AA98A9":"Rose quartz","#F0FFF0":"Honeydew","#006DB0":"Honolulu blue","#49796B":"Hooker's green","#FF1DCE":"Hot magenta","#FF69B4":"Hot pink","#71A6D2":"Iceberg","#FCF75E":"Icterine","#319177":"Illuminating Emerald","#602F6B":"Imperial","#002395":"Imperial blue","#66023C":"Tyrian purple","#ED2939":"Red (Pantone)","#B2EC5D":"Inchworm","#4C516D":"Independence","#138808":"India green","#CD5C5C":"Indian red","#E3A857":"Indian yellow","#091F92":"Indigo dye","#4B0082":"Indigo (web)","#002FA7":"International Klein Blue","#FF4F00":"International orange (aerospace)","#BA160C":"International orange (engineering)","#C0362C":"International orange (Golden Gate Bridge)","#5A4FCF":"Iris","#B3446C":"Raspberry rose","#F4F0EC":"Isabelline","#009000":"Islamic green","#FFFFF0":"Ivory","#00A86B":"Jade","#9D2933":"Japanese carmine","#264348":"Japanese indigo","#5B3256":"Japanese violet","#F8DE7E":"Mellow yellow","#D73B3E":"Jasper","#A50B5E":"Jazzberry jam","#DA614E":"Jelly Bean","#343434":"Jet","#F4CA16":"Jonquil","#8AB9F1":"Jordy blue","#BDDA57":"June bud","#29AB87":"Jungle green","#4CBB17":"Kelly green","#7C1C05":"Kenyan copper","#3AB09E":"Keppel","#C3B091":"Khaki (HTML/CSS) (Khaki)","#F0E68C":"Light khaki","#882D17":"Sienna","#E79FC4":"Kobi","#354230":"Kombu green","#E8000D":"KU Crimson","#087830":"La Salle Green","#D6CADD":"Languid lavender","#26619C":"Lapis lazuli","#FFFF66":"Unmellow yellow","#A9BA9D":"Laurel green","#CF1020":"Lava","#B57EDC":"Lavender (floral)","#E6E6FA":"Lavender mist","#CCCCFF":"Periwinkle","#FFF0F5":"Lavender blush","#C4C3D0":"Lavender gray","#9457EB":"Navy purple","#EE82EE":"Violet (web)","#FBAED2":"Lavender pink","#967BB6":"Lavender purple","#FBA0E3":"Lavender rose","#7CFC00":"Lawn green","#FFF700":"Lemon","#FFFACD":"Lemon chiffon","#CCA01D":"Lemon curry","#FDFF00":"Lemon glacier","#E3FF00":"Lemon lime","#F6EABE":"Lemon meringue","#FFF44F":"Lemon yellow","#1A1110":"Licorice","#545AA7":"Liberty","#ADD8E6":"Light blue","#B5651D":"Light brown","#E66771":"Light carmine pink","#F08080":"Light coral","#93CCEA":"Light cornflower blue","#F56991":"Light crimson","#E0FFFF":"Light cyan","#FF5CCD":"Light deep pink","#C8AD7F":"Light French beige","#F984EF":"Light fuchsia pink","#FAFAD2":"Light goldenrod yellow","#D3D3D3":"Light gray","#90EE90":"Light green","#FFB3DE":"Light hot pink","#D39BCB":"Light medium orchid","#ADDFAD":"Light moss green","#E6A8D7":"Light orchid","#B19CD9":"Light pastel purple","#FFB6C1":"Light pink","#FFA07A":"Light salmon","#FF9999":"Light salmon pink","#20B2AA":"Light sea green","#87CEFA":"Light sky blue","#778899":"Light slate gray","#B0C4DE":"Light steel blue","#B38B6D":"Light taupe","#FFFFE0":"Light yellow","#C8A2C8":"Lilac","#32CD32":"Lime green","#9DC209":"Limerick","#195905":"Lincoln green","#FAF0E6":"Linen","#6CA0DC":"Little boy blue","#674C47":"Medium taupe","#B86D29":"Liver (dogs)","#6C2E1F":"Liver (organ)","#987456":"Liver chestnut","#FFE4CD":"Lumber","#E62020":"Lust","#CA1F7B":"Magenta (dye)","#D0417E":"Magenta (Pantone)","#FF0090":"Magenta (process)","#9F4576":"Magenta haze","#AAF0D1":"Magic mint","#F8F4FF":"Magnolia","#C04000":"Mahogany","#6050DC":"Majorelle Blue","#0BDA51":"Malachite","#979AAA":"Manatee","#FF8243":"Mango Tango","#74C365":"Mantis","#880085":"Mardi Gras","#800000":"Maroon (HTML/CSS)","#B03060":"Rich maroon","#E0B0FF":"Mauve","#915F6D":"Raspberry glace","#EF98AA":"Mauvelous","#4C9141":"May green","#73C2FB":"Maya blue","#E5B73B":"Meat brown","#66DDAA":"Medium aquamarine","#0000CD":"Medium blue","#E2062C":"Medium candy apple red","#AF4035":"Pale carmine","#F3E5AB":"Vanilla","#035096":"Medium electric blue","#1C352D":"Medium jungle green","#DDA0DD":"Plum (web)","#BA55D3":"Medium orchid","#0067A5":"Sapphire blue","#9370DB":"Medium purple","#BB3385":"Medium red-violet","#AA4069":"Medium ruby","#3CB371":"Medium sea green","#80DAEB":"Medium sky blue","#7B68EE":"Medium slate blue","#C9DC87":"Medium spring bud","#00FA9A":"Medium spring green","#48D1CC":"Medium turquoise","#D9603B":"Medium vermilion","#C71585":"Red-violet","#F8B878":"Mellow apricot","#FDBCB4":"Melon","#0A7E8C":"Metallic Seaweed","#9C7C38":"Metallic Sunburst","#E4007C":"Mexican pink","#191970":"Midnight blue","#004953":"Midnight green (eagle green)","#FFC40C":"Mikado yellow","#E3F988":"Mindaro","#3EB489":"Mint","#F5FFFA":"Mint cream","#98FF98":"Mint green","#FFE4E1":"Misty rose","#73A9C2":"Moonstone blue","#AE0C00":"Mordant red 19","#8A9A5B":"Moss green","#30BA8F":"Mountain Meadow","#997A8D":"Mountbatten pink","#18453B":"MSU Green","#306030":"Mughal green","#C54B8C":"Mulberry","#FFDB58":"Mustard","#317873":"Myrtle green","#F6ADC6":"Nadeshiko pink","#2A8000":"Napier green","#FADA5E":"Stil de grain yellow","#FFDEAD":"Navajo white","#000080":"Navy","#FFA343":"Neon Carrot","#FE4164":"Neon fuchsia","#39FF14":"Neon green","#214FC6":"New Car","#D7837F":"New York pink","#A4DDED":"Non-photo blue","#059033":"North Texas Green","#E9FFDB":"Nyanza","#0077BE":"Ocean Boat Blue","#CC7722":"Ochre","#43302E":"Old burgundy","#CFB53B":"Old gold","#FDF5E6":"Old lace","#796878":"Old lavender","#673147":"Wine dregs","#867E36":"Old moss green","#C08081":"Old rose","#6B8E23":"Olive Drab (#3)","#3C341F":"Olive Drab #7","#9AB973":"Olivine","#353839":"Onyx","#B784A7":"Opera mauve","#FF7F00":"Orange (color wheel)","#FF7538":"Orange (Crayola)","#FF5800":"Orange (Pantone)","#FB9902":"Orange (RYB)","#FFA500":"Orange (web)","#FF9F00":"Orange peel","#FF4500":"Orange-red","#DA70D6":"Orchid","#F2BDCD":"Orchid pink","#FB4F14":"Orioles orange","#414A4C":"Outer Space","#FF6E4A":"Outrageous Orange","#002147":"Oxford Blue","#990000":"USC Cardinal","#006600":"Pakistan green","#273BE2":"Palatinate blue","#682860":"Palatinate purple","#AFEEEE":"Pale turquoise","#987654":"Pale brown","#9BC4E2":"Pale cerulean","#DDADAF":"Pale chestnut","#ABCDEF":"Pale cornflower blue","#E6BE8A":"Pale gold","#EEE8AA":"Pale goldenrod","#98FB98":"Pale green","#DCD0FF":"Pale lavender","#F984E5":"Pale magenta","#FADADD":"Pale pink","#DB7093":"Pale violet-red","#96DED1":"Pale robin egg blue","#C9C0BB":"Pale silver","#ECEBBD":"Pale spring bud","#BC987E":"Pale taupe","#78184A":"Pansy purple","#009B7D":"Paolo Veronese green","#FFEFD5":"Papaya whip","#E63E62":"Paradise pink","#AEC6CF":"Pastel blue","#836953":"Pastel brown","#CFCFC4":"Pastel gray","#77DD77":"Pastel green","#F49AC2":"Pastel magenta","#FFB347":"Pastel orange","#DEA5A4":"Pastel pink","#B39EB5":"Pastel purple","#FF6961":"Pastel red","#CB99C9":"Pastel violet","#FDFD96":"Pastel yellow","#800080":"Purple (HTML)","#FFE5B4":"Peach","#FFCC99":"Peach-orange","#FFDAB9":"Peach puff","#FADFAD":"Peach-yellow","#D1E231":"Pear","#EAE0C8":"Pearl","#88D8C0":"Pearl Aqua","#B768A2":"Pearly purple","#E6E200":"Peridot","#1C39BB":"Persian blue","#00A693":"Persian green","#32127A":"Persian indigo","#D99058":"Persian orange","#F77FBE":"Persian pink","#701C1C":"Prune","#CC3333":"Persian red","#FE28A2":"Persian rose","#EC5800":"Persimmon","#CD853F":"Peru","#DF00FF":"Psychedelic purple","#000F89":"Phthalo blue","#123524":"Phthalo green","#45B1E8":"Picton blue","#C30B4E":"Pictorial carmine","#FDDDE6":"Piggy pink","#01796F":"Pine green","#FFC0CB":"Pink","#D74894":"Pink (Pantone)","#FFDDF4":"Pink lace","#D8B2D1":"Pink lavender","#E7ACCF":"Pink pearl","#F78FA7":"Pink Sherbet","#93C572":"Pistachio","#E5E4E2":"Platinum","#8E4585":"Plum","#BE4F62":"Popstar","#FF5A36":"Portland Orange","#B0E0E6":"Powder blue","#F58025":"Princeton orange","#003153":"Prussian blue","#CC8899":"Puce","#722F37":"Wine","#644117":"Pullman Brown (UPS Brown)","#FF7518":"Pumpkin","#9F00C5":"Purple (Munsell)","#A020F0":"Veronica","#69359C":"Purple Heart","#9678B6":"Purple mountain majesty","#4E5180":"Purple navy","#FE4EDA":"Purple pizzazz","#50404D":"Purple taupe","#9A4EAE":"Purpureus","#51484F":"Quartz","#436B95":"Queen blue","#E8CCD7":"Queen pink","#8E3A59":"Quinacridone magenta","#FF355E":"Radical Red","#FBAB60":"Rajah","#E30B5D":"Raspberry","#E25098":"Raspberry pink","#826644":"Raw umber","#FF33CC":"Razzle dazzle rose","#E3256B":"Razzmatazz","#8D4E85":"Razzmic Berry","#FF0000":"Red","#EE204D":"Red (Crayola)","#F2003C":"Red (Munsell)","#C40233":"Red (NCS)","#ED1C24":"Red (pigment)","#FE2712":"Red (RYB)","#860111":"Red devil","#FF5349":"Red-orange","#E40078":"Red-purple","#A45A52":"Redwood","#522D80":"Regalia","#002387":"Resolution blue","#777696":"Rhythm","#004040":"Rich black","#F1A7FE":"Rich brilliant lavender","#0892D0":"Rich electric blue","#A76BCF":"Rich lavender","#B666D2":"Rich lilac","#444C38":"Rifle green","#00CCCC":"Robin egg blue","#8A7F80":"Rocket metallic","#838996":"Roman silver","#F9429E":"Rose bonbon","#674846":"Rose ebony","#B76E79":"Rose gold","#FF66CC":"Rose pink","#C21E56":"Rose red","#905D5D":"Rose taupe","#AB4E52":"Rose vale","#65000B":"Rosewood","#D40000":"Rosso corsa","#BC8F8F":"Rosy brown","#0038A8":"Royal azure","#002366":"Royal blue","#4169E1":"Royal blue","#CA2C92":"Royal fuchsia","#7851A9":"Royal purple","#CE4676":"Ruber","#D10056":"Rubine red","#E0115F":"Ruby","#9B111E":"Ruby red","#FF0028":"Ruddy","#BB6528":"Ruddy brown","#E18E96":"Ruddy pink","#A81C07":"Rufous","#80461B":"Russet","#679267":"Russian green","#32174D":"Russian violet","#B7410E":"Rust","#DA2C43":"Rusty red","#8B4513":"Saddle brown","#FF6700":"Safety orange (blaze orange)","#EED202":"Safety yellow","#F4C430":"Saffron","#BCB88A":"Sage","#23297A":"St. Patrick's blue","#FA8072":"Salmon","#FF91A4":"Salmon pink","#ECD540":"Sandstorm","#F4A460":"Sandy brown","#92000A":"Sangria","#507D2A":"Sap green","#0F52BA":"Sapphire","#CBA135":"Satin sheen gold","#FF2400":"Scarlet","#FD0E35":"Tractor red","#FF91AF":"Schauss pink","#FFD800":"School bus yellow","#76FF7A":"Screamin' Green","#006994":"Sea blue","#2E8B57":"Sea green","#321414":"Seal brown","#FFF5EE":"Seashell","#FFBA00":"Selective yellow","#704214":"Sepia","#8A795D":"Shadow","#778BA5":"Shadow blue","#FFCFF1":"Shampoo","#009E60":"Shamrock green","#8FD400":"Sheen Green","#D98695":"Shimmering Blush","#FC0FC0":"Shocking pink","#FF6FFF":"Ultra pink","#C0C0C0":"Silver","#ACACAC":"Silver chalice","#5D89BA":"Silver Lake blue","#C4AEAD":"Silver pink","#BFC1C2":"Silver sand","#CB410B":"Sinopia","#007474":"Skobeloff","#87CEEB":"Sky blue","#CF71AF":"Sky magenta","#6A5ACD":"Slate blue","#708090":"Slate gray","#C84186":"Smitten","#738276":"Smoke","#933D41":"Smokey topaz","#100C08":"Smoky black","#FFFAFA":"Snow","#CEC8EF":"Soap","#893843":"Solid pink","#757575":"Sonic silver","#9E1316":"Spartan Crimson","#1D2951":"Space cadet","#807532":"Spanish bistre","#0070B8":"Spanish blue","#D10047":"Spanish carmine","#E51A4C":"Spanish crimson","#989898":"Spanish gray","#009150":"Spanish green","#E86100":"Spanish orange","#F7BFBE":"Spanish pink","#E60026":"Spanish red","#4C2882":"Spanish violet","#007F5C":"Spanish viridian","#0FC0FC":"Spiro Disco Ball","#A7FC00":"Spring bud","#007BB8":"Star command blue","#4682B4":"Steel blue","#CC33CC":"Steel pink","#4F666A":"Stormcloud","#E4D96F":"Straw","#FC5A8D":"Strawberry","#FFCC33":"Sunglow","#E3AB57":"Sunray","#FD5E53":"Sunset orange","#CF6BA9":"Super pink","#D2B48C":"Tan","#F94D00":"Tangelo","#F28500":"Tangerine","#FFCC00":"USC Gold","#8B8589":"Taupe gray","#D0F0C0":"Tea green","#008080":"Teal","#367588":"Teal blue","#99E6B3":"Teal deer","#00827F":"Teal green","#CF3476":"Telemagenta","#CD5700":"Tenné","#E2725B":"Terra cotta","#D8BFD8":"Thistle","#FC89AC":"Tickle Me Pink","#0ABAB5":"Tiffany Blue","#E08D3C":"Tiger's eye","#DBD7D2":"Timberwolf","#EEE600":"Titanium yellow","#FF6347":"Tomato","#746CC0":"Toolbox","#FFC87C":"Topaz","#00755E":"Tropical rain forest","#0073CF":"True Blue","#417DC1":"Tufts Blue","#FF878D":"Tulip","#DEAA88":"Tumbleweed","#B57281":"Turkish rose","#40E0D0":"Turquoise","#00FFEF":"Turquoise blue","#A0D6B4":"Turquoise green","#7C4848":"Tuscan red","#C09999":"Tuscany","#8A496B":"Twilight lavender","#0033AA":"UA blue","#D9004C":"UA red","#8878C3":"Ube","#536895":"UCLA Blue","#FFB300":"UCLA Gold","#3CD070":"UFO Green","#120A8F":"Ultramarine","#4166F5":"Ultramarine blue","#FC6C85":"Wild watermelon","#635147":"Umber","#FFDDCA":"Unbleached silk","#5B92E5":"United Nations blue","#B78727":"University of California Gold","#7B1113":"UP Maroon","#AE2029":"Upsdell red","#E1AD21":"Urobilin","#004F98":"USAFA blue","#F77F00":"University of Tennessee Orange","#D3003F":"Utah Crimson","#F38FA9":"Vanilla ice","#C5B358":"Vegas gold","#C80815":"Venetian red","#43B3AE":"Verdigris","#D9381E":"Vermilion","#7F00FF":"Violet (color wheel)","#8601AF":"Violet (RYB)","#324AB2":"Violet-blue","#F75394":"Violet-red","#40826D":"Viridian","#009698":"Viridian green","#7C9ED9":"Vista blue","#922724":"Vivid auburn","#9F1D35":"Vivid burgundy","#DA1D81":"Vivid cerise","#CC00FF":"Vivid orchid","#00CCFF":"Vivid sky blue","#FFA089":"Vivid tangerine","#9F00FF":"Vivid violet","#004242":"Warm black","#A4F4F9":"Waterspout","#645452":"Wenge","#F5DEB3":"Wheat","#FFFFFF":"White","#F5F5F5":"White smoke","#A2ADD0":"Wild blue yonder","#D470A2":"Wild orchid","#FF43A4":"Wild Strawberry","#FD5800":"Willpower orange","#A75502":"Windsor tan","#C9A0DC":"Wisteria","#738678":"Xanadu","#0F4D92":"Yale Blue","#1C2841":"Yankees blue","#FFFF00":"Yellow","#FCE883":"Yellow (Crayola)","#EFCC00":"Yellow (Munsell)","#FEDF00":"Yellow (Pantone)","#FEFE33":"Yellow (RYB)","#9ACD32":"Yellow-green","#FFAE42":"Yellow Orange","#FFF000":"Yellow rose","#0014A8":"Zaffre","#2C1608":"Zinnwaldite brown","#39A78E":"Zomp"} 
    document.hex_colours = inGroupsOf(document.hex_colours, 24)
              
       // res.format({
        //    json: function() {
         //       res.json(document)
         //   },
          //  html: function() {
          
                res.render('products/product_17_oct_2013.ejs', {
                    locals: document
                });
          //  }
        //})
    });
}

var inGroupsOf = function(arr, n){
  var ret = [];
  var group = [];
  var len = arr.length;
  var per = len * (n / len);

  for (var i = 0; i < len; ++i) {
    group.push(arr[i]);
    if ((i + 1) % n == 0) {
      ret.push(group);
      group = [];
    }
  }

  if (group.length) ret.push(group);

  return ret;
};