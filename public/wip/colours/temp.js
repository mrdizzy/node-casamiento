
  var number_of_colours = pairs.length;
  var width_of_inside = 50 * number_of_colours;
  $('#inside').css("width",width_of_inside + "px");
  
  var counter = 0;
  var colour_divs = []
  
  groups.forEach(function(group) {
    var $colour_div = $('<div id="panel_' + counter + '" style="float:left"></div>');
    group.forEach(function(colour) {
      $colour_div.append('<div style="background-color:' + colour[0] + '" class="square"></div>');
    })
    colour_divs.push($colour_div)
    counter = counter + 1;
  })
    
  $('#inside').html(colour_divs)
  
  $('#arrow_left').click(function() {
    scrollColours(-1)
  })

$('#arrow_right').click(function() {
  scrollColours(1)
})