var request = require('request'),
cheerio = require('cheerio'), 
fs = require('fs');

var url = "http://www.colorhexa.com/color-names"
var colours = {}
var counter = 0;
var previous = ""
request(url,function(err, resp, body) {
	if(err)
	throw err;
	$ = cheerio.load(body);
	console.log($('#color-list span:first-child')[1])
	
	$('#color-list span').find('a').each(function(element) {
		if(counter == 1) {
			colours[$(this).text()] = previous;
			counter = 0;
		} else {
			previous = $(this).text()
			counter++;
		}
	})
	showColours();
})


function showColours() {
fs.writeFile("colours.json", JSON.stringify(colours))
}
