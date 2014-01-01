DEPENDENCIES USED
=================

This is a good article about dependencies done right:

    http://blog.nodejitsu.com/package-dependencies-done-right

Node uses Semantic versioning in the format 1.2.3 where 1 is a major version that is not backwards compatible, 2 is a minor version and 3 is a patch version. 

EXTERNAL JAVASCRIPTS
====================

    /public/javascripts/attachments.js
    
    This file provides classes for CouchDB models that contain attachments, abstracting out a lot of reusable functionality. 

COLOURS
=======

/config/colours.js exports two objects, hex and labels. colours.hex is just an array of hex colours, whereas colours.labels is an object of key-value pairs in order to lookup the human descriptive label of the hex colours. 

ROUTES
======

Routes are all listed in /routes. The /routes/index.js file is required in app.js and,it is passed an instance of the application. Within the routes/index.js it 

    * sets up express-resource based routes
    * loops through all the other files in the /routes directory and
    * requires each of the files which set up other routes
    
 This is better than cluttering the app.js file with routes. 



/public/admin/index.html
    - Static page linking to the following pages:
    
    GET /ebay  
        This provides a list of pages sorted first by product_type, then by product_theme. E.g.
        
           name_place:
                rose-name_place
           invitation:
                rose-invitation
    
    GET /ebay/:id
        This renders the eBay page and choose view in the /views/ebay/product_type folder where product_type is the product type
    
    GET /admin/products
        T
public/names.html
    
        Takes a list of names in a textarea box and formats them as XML for importing into Illustrator.
    
    http://node-casamiento.mrdizzy.c9.io/paypal
    
        /conversations
    
    Conversations