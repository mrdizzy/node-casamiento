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
    var $up_arrow_container = $('<div></div>').addClass("up_arrow_container").append($('<div></div>').addClass("up_arrow").html("&#9650"));
    var $table_container = $('<div></div>').css("position", "relative")
    
    $container_div.append($up_arrow_container).append($table_container)
    
    var $selected_font = $('<table class="selected_font" class="fonts_table"></table>');
    var $selected_row = $('<tr></tr>');
    var $selected_image = $('<img src="/fonts/' + selected_font + '.svg">')
    $selected_row.append($('<td class="font_image"></td>').append($selected_image));
    $selected_font.append($selected_row)

    var $down_arrow = $('<tr style="border-top:1px solid black;"><td class="down_arrow" colspan="2" style="text-align:center;">&#9660;</td></tr>')

    grouped_fonts.forEach(function(group) {
      var $table = $('<table></table>').addClass("fonts_table").css("display", "none");
     
      group.forEach(function(font) {
        var $tr = $('<tr data-image="' + font + '"></tr>').append("<td class='font_image'><img src='/fonts/" + font + ".svg' /></td>").addClass("font_image")
        // Click on a font
        $tr.click(function(e) {
          $.updateFont(font, that);
          that.trigger("fontpicker:selected", font)
          $up_arrow_container.hide()
          $selected_image.attr("src", "/fonts/" + font + ".svg")
          tables[current_index].hide();
        })
        $table.append($tr)
      })
      $table_container.append($table)
      tables.push($table)
    })
 
   $container_div.append($selected_font);
    
    // Enter
    $selected_font.click(function(e) {
        
        tables[current_index].append($down_arrow);
        tables[current_index].show();
        $up_arrow_container.show();
        clicked_font = false;    
    })
  
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
    fonts: ["Vast Shadow", "Abril Fatface", "TrajanPro", "CaslonPro", "EccentricStd", "MyriadProLight", "SacramentoRegular", "ChaparralItalic", "Exmouth", "PerpetuaTitling"],
    selected_font: "Metroscript",
    in_groups_of: 3
  }

}(jQuery))

$.updateFont = function(font, obj) {
var font_for_google_api = font.split(" ").join("+")
  var obj = obj || { trigger: function() {}}
  $('head').append("<style type='text/css'>@import url('https://fonts.googleapis.com/css?family=" + font_for_google_api + "');</style>");
  var fontLoader = new FontLoader([font], {
    "fontsLoaded": function(error) {
      if (error !== null) {
        // Reached the timeout but not all fonts were loaded
        console.log("ERROR: " + font + " " + error.message);
      } else {       
        console.log("all fonts were loaded");
      }
    },
    "fontLoaded": function(fontFamily) {
      // One of the fonts was loaded
      obj.trigger("fontpicker:fontloaded", fontFamily)
    }
  }, 3000);
  fontLoader.loadFonts();
}