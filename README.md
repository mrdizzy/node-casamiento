DEPENDENCIES USED
=================

This is a good article about dependencies done right:

    http://blog.nodejitsu.com/package-dependencies-done-right

Node uses Semantic versioning in the format 1.2.3 where 1 is a major version that is not backwards compatible, 2 is a minor version and 3 is a patch version. 

CONVENTIONS
===========

JavaScripts are kept in /libraries if they are a library that is used by other scripts. 

SERVER SIDE LIBS
================
prepare_divs.js - for preparing the background divs used to display product images
in_groups_of - identical to client-side version below

LAYOUTS 
=======


CLIENT SIDE JAVASCRIPTS
=======================

    /public/javascripts/libraries/attachments.js
    
    This file provides classes for CouchDB models that contain attachments, abstracting out a lot of reusable functionality. 
    
    /public/javascripts/libraries/json_to_xmls.js - routines for converting json to XML
    
    /public/javascripts/libraries/color_picker.js - the color picker 
    /public/javascripts/libraries/backbone_syphon.js - routines for serializing forms for Backbone
    /public/javascripts/libraries/in_groups_of.js - routines for grouping arrays
    
    
    /public/javascripts/admin
    
    This directory corresponds to the /views/admin/products/index.ejs file and contains three files:
        /public/javascripts/admin/models.js - contains the Product and ProductTypes Backbone models
        /public/javascripts/admin/themes.js - contains the Theme models AND views
        /public/javsacripts/admin/products.js - contains the Product views
        
    /public/javascripts/products
        contains /show.js which corresponds to the /views/products/show.ejs file

CONTROLLERS
===========

/admin/products.js - for updating/creating products
/attachments.js - for displaying couchdb attachments by streaming them using the .show method
/paypal.js - displays paypal transactions for immediate download, does not save them to database in any way
/

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