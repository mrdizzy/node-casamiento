TODO

Make a model to control the subviews?

/admin
--------------------------------------------------------------------------
  * Add 'add colour' button to enable 2 colour designs
  * Fix adding transparent images to existing products
  * Allow selecting of default font, baseline and size via GUI
  * Move JavaScript templates into directory with their dependencies
  * Create price tiers for products rather than individually entering price of each product
  * Remove svgupload field form data field form (make it stale)

/product_page
--------------------------------------------------------------------------
  * Make colour picker infinite so it scrolls back to the beginning again
  * After colour has been changed, make sure related colour pickers automatically show new default colour panel that contains the hues closest to new selected
  
  * Stop crashing on wrong id
  
  * Use picturefill() to call picturefill on elements   
  * Call picturefill on images to render appropriate resolutions
  
  * Highlight each step after completion
  * Allow selection of texture
  * Allow selection of thickness
  * Choose better icon for PRINT YOURSELF button
  * Style PayPal button prpperly
  * Make step descriptions more verbose
  * Product format step description needs to be written
  * Card thickness will change based on texture selected
  * Improve product descriptions
  * Quantity step description, explaining the "snap to 8" feature
  * Show related designs on product page
  * Show spinner while images load
  * Show clickable product tags
  
  * Fix product page font-selector as it is not showing top arrow and also does not display selected font correctly when you have navigated to #print and back to #flat_preview again  
  * make font selector directly change the font and size of thisProduct rather than in the view
  * Change Font images to fit neatly in fonts menu
   
  * When moving to the print page, if any new guests have been added there will not be place cards for them
  * Make thisProduct save on change of guest name

  * Tooltips for + and - and baseline shift
  * On internet explorer the global font adjust buttons are not displaying properly (stretched)
  * Stop flat preview name place card from using one of the guest names. Stick with "Guest Name" and make it uneditable
  * If mobile browser, post names to new controller when printer icon clicked and save in database with new id, then render with id to make completely unique page for sharing with google cloud print
 

/responsive
--------------------------------------------------------------------------
  Mobile:
  * Choose how to implement PRINT YOURSELF button on smartphone view
  * Adjust landscape display of product page on smaller smartphones

  /print UI page
  * Font does not display on print UI page when moving back and forwards between the preview page
  * Add global reset font/baseline button 
  * Format control panel responsively
  * Remove logo from panel for mobile browsers

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
