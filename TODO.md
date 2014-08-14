TODO

Make a model to control the subviews?

/admin
--------------------------------------------------------------------------
  * Add 'add colour' button to enable 2 colour designs
  * Fix adding transparent images to existing products
  * Disable editing of existing product ID 
  * Allow selecting of default font, baseline and size via GUI
  * Move JavaScript templates into directory with their dependencies
  * Create price tiers for products rather than individually entering price of each product
  * Remove svgupload field form data field form 

/product_page
--------------------------------------------------------------------------
  * Stop crashing on wrong id
  * page doesn't render properly on first time -- no steps rendered -- due to localstorage
  * Fix product page font-selector as it is not showing top arrow and also does not display selected font correctly when you have navigated to #print and back to #flat_preview again
  * Highlight each step after completion
  * Call picturefill on images to render appropriate resolutions
  * Allow selection of texture
  * Allow selection of thickness
  * Choose better icon for PRINT YOURSELF button
  * Style PayPal button prpperly
  * Fix display of name place cards buttons on left hand side on smartphone main product page view
  * When moving to the print page, if any new guests have been added there will not be place cards for them
  * Make thisProduct save on change of guest name
  * After colour has been changed, make sure related colour pickers automatically show new default colour panel that contains the hues closest to new selected

  * make font selector directly change the font and size of thisProduct rather than in the view

  * Make step descriptions more verbose
  * Product format step description needs to be written
  * Card thickness will change based on texture selected
  * Improve product descriptions
  * Show clickable product tags
  * Tooltips for + and - and baseline shift
  * Change Font images to fit neatly in fonts menu
  * Show spinner while images load
  * Show related designs on product page
  * Quantity step description, explaining the "snap to 8" feature
  * Stop flat preview name place card from using one of the guest names. Stick with "Guest Name" and make it uneditable.
  * If mobile browser, post names to new controller when printer icon clicked and save in database with new id, then render with id to make completely unique page for sharing with google cloud print
 

/responsive
--------------------------------------------------------------------------
  Mobile:
  * Main product page will not display correctly on first load   
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
