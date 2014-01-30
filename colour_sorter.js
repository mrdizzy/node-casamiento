var colours = require('./colours'), 
fs = require ('fs'), 
_ = require('underscore');

var results = []
Object.keys(colours).forEach(function(hex) {
	var without_hash = hex.substring(1);
	var r = parseInt(without_hash.substring(0,2),16)/255;
	var g = parseInt(without_hash.substring(2,4),16)/255;
	var b = parseInt(without_hash.substring(4,6),16)/255;
	/* Getting the Max and Min values for Chroma. */
	var max = Math.max.apply(Math, [r,g,b]);
	var min = Math.min.apply(Math, [r,g,b]);

	/* Variables for HSV value of hex color. */
	var chr = max-min;
	var hue = 0;
	var val = max;
	var sat = 0;
	
	if (val > 0) {
		/* Calculate Saturation only if Value isn't 0. */
		sat = chr/val;
		if (sat > 0) {
			if (r == max) { 
				hue = 60*(((g-min)-(b-min))/chr);
				if (hue < 0) {hue += 360;}
			} else if (g == max) { 
				hue = 120+60*(((b-min)-(r-min))/chr); 
			} else if (b == max) { 
				hue = 240+60*(((r-min)-(g-min))/chr); 
			}
		}
	};
	if(sat > 0.25) {
		results.push({ hex: hex, english: colours[hex], hue: hue, sat: sat, val: val})
	}
})

var sorted = results.sort(function(a,b){return a.hue - b.hue;});
var result = {}
sorted.forEach(function(colour) {
	result[colour.hex] = colour.english
})
console.log(result)
fs.writeFile("sorted_colours.json",JSON.stringify(result))