TODO

Make a model to control the subviews?
Set cache expires header on non-changing assets: branding, images, fonts

/all

* Add dashed line menu button to reveal navigation: browse, about, contact

/welcome 

* Add navigation << >> and * * * * * for desktop view

/admin
--------------------------------------------------------------------------
  * Add 'add colour' button to enable 2 colour designs
  * Fix adding images to existing products
  * Move JavaScript templates into directory with their dependencies
  * Create price tiers for products rather than individually entering price of each product
  * Remove svgupload field form data field form (make it stale)

/product_page
--------------------------------------------------------------------------
  * After colour has been changed, make sure related colour pickers automatically show new default colour panel that contains the hues closest to new selected
  * Stop flat preview name place card from using one of the guest names. Stick with "Mr. Guest Name" and make it uneditable
  * Scroll bar disappears after rendering flat_preview
  * Stop crashing on wrong id  
  * When moving to the print page, if any new guests have been added there will not be place cards for them
  * Make thisProduct save on change of guest name
  
  * Use picturefill() to call picturefill on elements after javascript view renders
  * Make javascripts in an external file to reduce overhead and allow caching  
  
  * Highlight each step after completion
  * Allow selection of texture
  * Allow selection of thickness
  * Card thickness will change based on texture selected
  * Make step descriptions more verbose
  * Remove product format step - add it to top with name place showing size
  * Improve product descriptions
  * Quantity step description, explaining the "snap to 8" feature
  * Show related designs on product page
  * Show spinner while images load
  * Show clickable product tags
  
  * Update all images for existing products: Damask, Birds of Paradise, Birds of Spiral, Simplicity, Together Forever, Chess, Ornamental, Paisley, Wild Vintage, Guilloche, FLORAL, Rose, Foliage, Borders, Acorn, Garden of Life (16)
  
  * Add Facebook, Twitter, Google+ and PinIt like buttons
  
  * Fix product page font-selector as it does not display selected font correctly when you have navigated to #print and back to #flat_preview again  
  
  * Font picker name description text is unformatted
  * make font selector directly change the font and size of thisProduct rather than in the view
  * Change Font images to fit neatly in fonts menu

  * Crop marks for printing
  * Make clearer print icon button
  
  * If mobile browser, post names to new controller when printer icon clicked and save in database with new id, then render with id to make completely unique page for sharing with google cloud print
  * Make colour picker infinite so it scrolls back to the beginning again

/print UI page
  * Font does not display on print UI page when moving back and forwards between the preview page
  * Add global reset font/baseline button 
  * Global navigation buttons are not vertically aligned properly
  * Top of place cards on mobile print are obscured by the fixed global menu
  * Add close button for side panel
  * Tooltip over guest name on print page to show it can be edited

/responsive
--------------------------------------------------------------------------
  Mobile:
  * Adjust landscape display of product page on smaller smartphones

/invoices
--------------------------------------------------------------------------
  * Capitalise addresses properly and remove empty lines
  * Make all three addresses match up
  * Dreams on Paper is not svg
  * Refactor fonts as they are not working properly

/order processing
  * Program a name sorter that sorts by first name
  * Automatically capitalize addresses and format post codes on the invoice correctly plus removed "undefined" from address lines
  * Letter that thanks them for their order and explains things
  * Improve folding and cutting of place cards - record exact measurements
