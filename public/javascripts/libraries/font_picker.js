;(function($) {
  $.fn.fontPicker = function(options) {
    var that = this;
    var settings = $.extend({},  $.fn.fontPicker.defaultOptions, options);

    var fonts = settings.fonts,
      grouped_fonts = inGroupsOf(fonts, settings.in_groups_of),
      selected_font = settings.selected_font,
      current_index = 0,
      tables = [],
      clicked_font = true,

    $container_div = $('<div></div>').addClass("font_selector_container");
    $up_arrow_container = $('<div></div>').addClass("up_arrow_container").append($('<div></div>').addClass("up_arrow").html("&#9650"));

    $table_container = $('<div></div>').css("position", "relative")
    
    $container_div.append($up_arrow_container).append($table_container)
    
    var $selected_font = $('<table class="selected_font" class="fonts_table"></table>');
    $selected_row = $('<tr></tr>');
    $selected_image = $('<img src="/fonts/' + selected_font + '.svg">')
    $selected_font_name= $('<td class="font_name">'+ selected_font + '</td>');
    $selected_row.append($('<td class="font_image"></td>').append($selected_image));
    $selected_row.append($selected_font_name)
    $selected_font.append($selected_row)

    var $down_arrow = $('<tr style="border-top:1px solid black;"><td class="down_arrow" colspan="2" style="text-align:center;">&#9660;</td></tr>')

    grouped_fonts.forEach(function(group) {
      var $table = $('<table></table>').addClass("fonts_table").css("display", "none");
     
      group.forEach(function(font) {
        var $tr = $('<tr data-image="' + font + '"></tr>').append("<td class='font_image'><img src='/fonts/" + font + ".svg' /></td>").addClass("font_image").append("<td class='font_name'>" + font + "</td>")
        // Click on a font
        $tr.click(function(e) {
          $.appendFont(font);
          that.trigger("fontpicker:selected", {font: font, font_size: 1 })
          $up_arrow_container.hide()
          $selected_image.attr("src", "/fonts/" + font + ".svg")
          $selected_font_name.text(font)
          tables[current_index].hide();
        })
        $table.append($tr)
      })
      $table_container.append($table)
      tables.push($table)
    })
 
   $container_div.append($selected_font);
    
    // Enter and leave 
    $selected_font.click(function(e) {
    //  if(clicked_font) {
        $up_arrow_container.show();
        tables[current_index].append($down_arrow);
        tables[current_index].show();
        clicked_font = false;
     // }
    })
  
    //$container_div.mouseleave(function(e) {
    //  clicked_font = true;
    //  $up_arrow_container.hide();
    //  tables[current_index].hide();      
    //})
 
    // Move down
    $down_arrow.click(function(e) {
      if(current_index < tables.length -1) {
      tables[current_index].hide();
      current_index++;    
      tables[current_index].append($down_arrow);
      tables[current_index].show();
      }
    })
    // Move up
    $up_arrow_container.click(function(e) {
      if(current_index > 0) {
        tables[current_index].hide();
        current_index--;
        tables[current_index].append($down_arrow)
        tables[current_index].show()
      }
    })
   this.html($container_div)
    return this;
  }
  $.fn.fontPicker.defaultOptions ={
    fonts: ["Metroscript", "TrajanPro", "CaslonPro", "EccentricStd", "MyriadProLight", "SacramentoRegular", "ChaparralItalic", "Exmouth"],
    selected_font: "Metroscript",
    in_groups_of: 3
  }

}(jQuery))

$.appendFont = function(font) {
    $('head').append("<style type='text/css'> @font-face { font-family:'" + font + "'; src: url('/fonts/"+ font + ".eot?') format('eot'), url('/fonts/" + font + ".woff') format('woff'); }</style>");
  }