TODO

Make a model to control the subviews?

  / admin
  
  * Add 'add colour' button to enable 2 colour designs
  * Fix colour picker not displaying
  * Move JavaScript templates into directory with their dependencies
  * Make sure you can create a new product with an id - automatically add name_place to the id and make it uneditable if it is an existing product
  * Create price tiers for products rather than individually entering price of each product


    /product_page
   * Stop clicking on left and right arrows of colour picker affecting counter and preventing scrolling when reaching either end 
  * Remove dotted line at bottom of font selector
  * Fix product page font-selector as it is not showing top arrow and also does not display selected font correctly when you have navigated to #print and back to #flat_preview again
  * Highlight each step after completion
  * Allow selection of texture
  * Allow selection of thickness
  * When rendering a route, make sure that fonts are loaded properly  
  * Make design of PRINT YOURSELF button button
  * Choose how to implement PRINT YOURSELF button on smartphone view
  * Display PayPal button
  * Fix display of name place cards buttons on left hand side on smartphone main product page view
  * When quantity has been changed, another 8 guests are added on page reload of #flat_preview. Figure out whatt is causing this and fix it
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
  * When the quantity enter field is clicked make it empty. Store it's previous value. If no new value is entered or it is Not a Number then revert to the previous value
  * If mobile browser, post names to new controller when printer icon clicked and save in database with new id, then render with id to make completely unique page for sharing with google cloud print
 

   /responsive
   Mobile:
   * Main product page will not display correctly on first load

   /print UI page
* When showing two colours, make them adjacent on control panel
* Make the global baseline and font size buttons functional
* Remove dotted line from bottom of font selector 
* Space global baseline/font buttons appropriately
* Add global reset font/baseline button 
 * Format control panel responsively
  * Update layout icons so that they show "PORTRAIT" and "LANDSCAPE" next to the icons and also format the icons correctly
  * Panel for mobile browsers



  /invoices
  
* Capitalise addresses properly and remove empty lines
* Make all three addresses match up
* Dreams on Paper is not svg
* Refactor fonts as they are not working properly

/order processing
  * Program a name sorter that sorts by first name
  * Automatically capitalize addresses and format post codes on the invoice correctly plus removed "undefined" from address lines
  * Letter that thanks them for their order and explains things
  * Improve folding and cutting of place cards - record exact measurements
