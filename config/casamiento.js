module.exports = [

// MYOB ACCOUNTS
{
    _id: "myob_accounts",
    accounts: {
        11200: "Computer Hardware",
        11210: "Computer Hardware Acc Depre",
        11300: "Plant & : Machinery",
        11310: "Plant & Machinery Acc Depre",
        12101: "Cahoot Current Account",
        12160: "PayPal",
        41100: "Sales Type 1",
        44124: "Interest",
        51100: "Paper & Card",
        51200: "Ink",
        51300: "Embellishments",
        52010: "Postage",
        52020: "Packaging",
        56000: "Glue",
        61925: "Telephone",
        61945: "Postage",
        61955: "Books, magazine & reference",
        61965: "Graphic Design Services",
        61975: "Web services",
        31100: "Money invested",
        31200: "Money withdrawn",
        62450: "eBay",
        63500: "Sotware Subscriptions",
        65000: "PayPal Fees",
        68000: "Miscellaneous"
    }
},
// Customers
{
    _id: "nY+sHZ2PrBmdj6wVnY+sEZ2PrsA2dj6wFk4CoAZeCoAqdj6x9nY+seQ==",
    name: "David Pettifer",
    emails: ["david.p@dizzy.co.uk", "david.p@casamiento.co.uk", "david.pettifer@dizzy.co.uk"],
    type: "Customer",
    UserIDs: ["casamiento"]
}, {
    _id: "ANEIASTOKEN",
    name: "Helena Betts",
    emails: ["helena@helena.com"],
    type: "Customer",
    UserIDs: ["happyhele"]
}, {
    _id: "EIASTOKENFORGARY",
    name: "G COOLEY",
    type: "Customer",
    emails: ["garycoo@coo.com"],
}, {
    _id: "1",
    name: "Gary Cooley",
    type: "Customer",
    emails: ["rebelcoo7@hotmail.com"],
    UserIDs: ["rebelcoo7"]
}, {
    _id: "2",
    name: "Helena Betts",
    type: "Customer",
    emails: ["happyhele@hotmail.com", "helena.betts@fatima.com"]
},
// Emails
{
    Subject: "Hello",
    From: "david.pettifer@dizzy.co.uk",
    Content: "Some content",
    customer: 'nY+sHZ2PrBmdj6wVnY+sEZ2PrsA2dj6wFk4CoAZeCoAqdj6x9nY+seQ==',
    type: "email"
}, {
    Subject: "Another one",
    From: "rebelcoo7@hotmail.com",
    Content: "Some more content",
    customer: '1',
    type: "email"

}, {
    // Ebay Messages
    _id: 'rebelcoo7-1234',
    Subject: "An ebay message",
    Sender: "rebelcoo7",
    Content: "Some stuff",
    customer: '1',
    MessageID: '1234',
    type: "ebay_message"
}, {
    _id: 'casamiento-9999',
    Subject: "Another one",
    Sender: "casamiento",
    Content: "Blah",
    type: "ebay_message",
    MessageID: '9999',
    customer: "nY+sHZ2PrBmdj6wVnY+sEZ2PrsA2dj6wFk4CoAZeCoAqdj6x9nY+seQ=="
},

// Time
{
    _id: 'time',
    lastModified: '2012-06-01T02:20:00.000Z'
}]