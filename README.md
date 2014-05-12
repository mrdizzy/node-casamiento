DEPENDENCIES USED
=================

This is a good article about dependencies done right:

    http://blog.nodejitsu.com/package-dependencies-done-right

Node uses Semantic versioning in the format 1.2.3 where 1 is a major version that is not backwards compatible, 2 is a minor version and 3 is a patch version. 

CONVENTIONS
===========

LAYOUTS 
=======
The main layout is in views/layout.ejs

This is used by home.js. This layout also specifies the stylesheet to use which is main.css


COUCHDB PRODUCT
===============

attachments_order: this field is an array that determines the order of the attachments [1,4,3,5] means attachments will be displayed in that order.

EBAY TEMPLATES GENERATOR
========================

/public/ebay_templates/auction.html -> Simplicity Invitation package sample auction
/public/ebay_templates/buy_it_now.html -> Simplicity Invitation package buy-it-now multiple variation listing
/public/ebay_templates/testing.html -> Simplicity Invitation package old listing ebay from 2011 with photographs

/views/ebay/name_places/new.ejs -> Single name place card listing
/views/ebay/name_places/name_places_new_trial.ejs -> Multiple name place cards listing this is called by /ebay/places url

    ## Single place card template 
    /ebay/birds_of_paradise-name_place?auction=true&price=6.99&quantity=50&buy_it_now=251504908304
    
    Use the query string to provide options to the template:
        buy_it_now = item number
        quantity
        auction = true or false
        price = decimal

SERVER SIDE LIBS
================

prepare_divs.js
---------------
For preparing the background divs that are used to display the background colours for the transparent product images. This works by looping through each of the attachments using the attachments_order field, and then checking the colours attribute to see if the product has more than 1 colour. If it has only 1 colour then we just specify the background colour in the <img> tag as css. If it has more than 1 colour, then we find the correlating background-[number] field which contains the divs for the second background colour, and we render these using a template. We then use a second template which is passed the resulting divs we just rendered to create a self-container div that can be displayed.

in_groups_of - identical to client-side version below


CLIENT SIDE JAVASCRIPTS
=======================

JavaScripts are kept in `/public/javascripts/libraries` if they are a library that is used by other scripts. 


    ## /public/javascripts/libraries/attachments.js
    
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

/controllers/admin/products.js - for updating/creating products
/controllers/attachments.js - for displaying couchdb attachments by streaming them using the .show method
/controllers/paypal.js - displays paypal transactions for immediate download, does not save them to database in any way

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
        
        
public/names.html
    
        Takes a list of names in a textarea box and formats them as XML for importing into Illustrator.
    
        /conversations
    
    Conversations