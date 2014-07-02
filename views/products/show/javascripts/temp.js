$('#add_another').fadeOut(function() {
      $('#print_spinner').fadeIn()
    });
    
    var images = $('img.place_card_image'),
      counter = images.length,
      i = 0,
      hex = thisProduct.get("colours")[0].substring(1); // remove # from hexcode
    $('img.place_card_image').attr("src", "/svg/" + thisProduct.get("_id") + "/" + hex); // url to pull new svg image
    $('img.place_card_image').load(function() {
      i++;
      if(counter == i) {      
        $('#print_spinner').hide(function() {                 
          $('#print_box').fadeIn();  
        }); 
      }
    })