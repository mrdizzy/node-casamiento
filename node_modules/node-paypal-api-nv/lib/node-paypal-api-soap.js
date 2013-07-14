/*
Test Account:    d_1340017956_biz@dizzy.co.uk    Jun 18, 2012 04:13:02 PDT
API Username:	d_1340017956_biz_api1.dizzy.co.uk
API Password:	1340017982
Signature:	 AsBcEj3sB0OTqP3cgez.qbrs93N7ABBl2XWSgabuj4bOVqtt84mlgaPW	

Signatures: https://api-3t.sandbox.paypal.com/nvp


Specify the API username associated with your account.
USER=API_username
Specify the password associated with the API username.
PWD=API_password
If you are using an API signature and not an API certificate, specify the API signature associated with the API username.
SIGNATURE=API_signature
Optionally, you can specify the email address on file with PayPal of the third-party merchant on whose behalf you are calling the API operation.
SUBJECT=merchantEmailAddress

*/

// FIRSTNAME=Robert&MIDDLENAME=Herbert&LASTNAME=Moore
var path = encodeURI('/nvp?METHOD=SetExpressCheckout');
console.log(path);
var https = require('https');

var xml = '<?xml version="1.0" encoding="UTF-8"?>'  +
'<SOAP-ENV:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"'+
 '   xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/"'+
'	xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" '+
'	xmlns:xsd="http://www.w3.org/2001/XMLSchema"  '+
'	SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"'+
'><SOAP-ENV:Header> '+
'	<RequesterCredentials xmlns="urn:ebay:api:PayPalAPI"> '+
'		<Credentials xmlns="urn:ebay:apis:eBLBaseComponents"> '+
'			<Username>d_1340017956_biz_api1.dizzy.co.uk</Username> '+
'			<Password>1340017982</Password> '+
'			<Signature>AsBcEj3sB0OTqP3cgez.qbrs93N7ABBl2XWSgabuj4bOVqtt84mlgaPW</Signature>'+
'			<Subject/> '+
'		</Credentials> '+
'	</RequesterCredentials> '+
'</SOAP-ENV:Header> '+
'<SOAP-ENV:Body> '+
'	<GetBalanceReq xmlns="urn:ebay:api:PayPalAPI"> '+
	'	<GetBalanceRequest> '+
    '<Version xmlns="urn:ebay:apis:eBLBaseComponents">86.0</Version>' +
'		</GetBalanceRequest> '+
'	</GetBalanceReq> '+
'</SOAP-ENV:Body> '+
'</SOAP-ENV:Envelope>';


var options = {
    host: 'api-3t.sandbox.paypal.com',
    port: 443,
    path: '/2.0',
    method: 'POST',
    headers: {
        'Content-length': xml.length   
    }
};

var req = https.request(options, function(res) {
    console.log(res.statusCode);
    console.log(res.headers);
    var result = "";
    res.on('data', function(d) {
        result += d;
    });
    res.on('end', function() {
       console.log(result); 
    });
});
req.write(xml);
req.end();

req.on('error', function(e) {
    console.error(e);
});