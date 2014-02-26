(function($) {

    function inGroupsOf(arr, n){
      var ret = [];
      var group = [];
      var len = arr.length;
      var per = len * (n / len);

      for (var i = 0; i < len; ++i) {
        group.push(arr[i]);
        if ((i + 1) % n == 0) {
          ret.push(group);
          group = [];
        }
      }
      if (group.length) ret.push(group);
      return ret;
    };
    
    var colour_list = {"#cd5c5c":"Indian red","#ff4040":"Coral red","#321414":"Seal brown","#3c1414":"Dark sienna","#cc3333":"Persian red","#701c1c":"Persian plum","#a52a2a":"Red brown","#922724":"Vivid auburn","#ff6961":"Pastel red","#b94e48":"Deep chestnut","#ff5349":"Red Orange","#eb4c42":"Carmine pink","#e03c31":"CG Red","#fd5e53":"Sunset Orange","#f88379":"Coral pink","#e34234":"Vermilion","#af4035":"Pale carmine","#fe6f5e":"Bittersweet","#592720":"Caput mortuum","#79443b":"Bole","#8a3324":"Burnt umber","#ff6347":"Tomato","#cd5b45":"Dark coral","#e2725b":"Terra cotta","#ff5a36":"Portland Orange","#ff6e4a":"Outrageous Orange","#e97451":"Burnt sienna","#ff8c69":"Salmon","#ff7f50":"Coral","#ffa07a":"Light salmon","#da8a67":"Pale copper","#ff9966":"Atomic tangerine","#ff8243":"Mango Tango","#d68a59":"Raw Sienna","#6f4e37":"Coffee","#bb6528":"Ruddy brown","#80461b":"Russet","#d99058":"Persian orange","#f4a460":"Sandy brown","#b87333":"Copper","#e08d3c":"Tiger eye","#e5aa70":"Fawn","#cd7f32":"Bronze","#4b3621":"Café noir","#654321":"Otter brown","#ffa343":"Neon Carrot","#e1a95f":"Earth yellow","#ffae42":"Yellow Orange","#e3a857":"Indian yellow","#ffc87c":"Topaz","#ffb347":"Pastel orange","#b78727":"University of California Gold","#6c541e":"Field drab","#cba135":"Satin sheen gold","#e5b73b":"Meat brown","#f8d568":"Orange Yellow","#ffdb58":"Mustard","#fada5e":"Stil de grain yellow","#cfb53b":"Old gold","#c5b358":"Vegas gold","#e9d66b":"Hansa yellow","#ffe135":"Banana yellow","#ecd540":"Sandstorm","#b5a642":"Brass","#fbec5d":"Maize","#e4d96f":"Straw","#fff44f":"Lemon Yellow","#fcf75e":"Icterine","#ffff66":"Unmellow Yellow","#d1e231":"Pear","#4b5320":"Army green","#bdda57":"June bud","#a4c639":"Android Green","#6b8e23":"Olive Drab","#9acd32":"Yellow green","#556b2f":"Dark olive green","#b2ec5d":"Inchworm","#507d2a":"Sap green","#21421e":"Myrtle","#228b22":"Forest green","#32cd32":"Lime green","#76ff7a":"Screamin Green","#1e4d2b":"Cal Poly Pomona green","#50c878":"Paris Green","#3cd070":"UFO Green","#2e8b57":"Sea green","#3cb371":"Medium sea green","#177245":"Dark spring green","#123524":"Phthalo green","#66ddaa":"Medium aquamarine","#3eb489":"Mint","#7fffd4":"Aquamarine","#45cea2":"Shamrock","#40826d":"Viridian","#30ba8f":"Mountain Meadow","#29ab87":"Jungle green","#18453b":"MSU Green","#30d5c8":"Turquoise","#43b3ae":"Verdigris","#48d1cc":"Medium turquoise","#7df9ff":"Electric blue","#367588":"Teal blue","#73c2fb":"Maya blue","#4997d0":"Celestial blue","#4682b4":"Steel blue","#318ce7":"Bleu de France","#26619c":"Lapis lazuli","#417dc1":"Tufts Blue","#5b92e5":"United Nations blue","#6495ed":"Cornflower blue","#446ccf":"Han blue","#2a52be":"Cerulean blue","#4169e1":"Royal blue","#4166f5":"Ultramarine blue","#324ab2":"Violet Blue","#23297a":"Saint Patrick Blue","#191970":"Midnight blue","#5a4fcf":"Iris","#6050dc":"Majorelle Blue","#6a5acd":"Slate blue","#483d8b":"Dark slate blue","#7b68ee":"Medium slate blue","#9457eb":"Lavender indigo","#7851a9":"Royal purple","#69359c":"Purple Heart","#9955bb":"Deep lilac","#9932cc":"Dark orchid","#b666d2":"Rich lilac","#df73ff":"Heliotrope","#ba55d3":"Medium orchid","#fc74fd":"Pink Flamingo","#ff77ff":"Fuchsia pink","#c154c1":"Deep fuchsia","#ff6fff":"Ultra pink","#682860":"Palatinate purple","#bd33a4":"Byzantine","#702963":"Byzantium","#fe4eda":"Purple pizzazz","#ff66cc":"Rose pink","#b53389":"Fandango","#ca2c92":"Royal fuchsia","#fe59c2":"Neon fuchsia","#bb3385":"Medium red violet","#873260":"Boysenberry","#c54b8c":"Mulberry","#ff43a4":"Wild Strawberry","#da3287":"Deep cerise","#872657":"Dark raspberry","#f9429e":"Rose bonbon","#ff69b4":"Hot pink","#e25098":"Raspberry pink","#ff55a3":"Brilliant rose","#673147":"Old mauve","#ec3b83":"Cerise pink","#f75394":"Violet Red","#b03060":"Rich maroon","#f64a8a":"French rose","#b3446c":"Raspberry rose","#e75480":"Dark pink","#de5d83":"Blush","#de3163":"Cherry","#f56991":"Light Crimson","#ff355e":"Radical Red","#fb607f":"Brink pink","#fc6c85":"Wild Watermelon","#cb4154":"Brick red","#722f37":"Wine","#cc4e5c":"Dark terra cotta","#893f45":"Cordovan","#e66771":"Light carmine pink","#e4717a":"Candy pink","#933d41":"Smokey topaz","#ab4e52":"Rose vale","#ef3038":"Deep carmine pink","#d73b3e":"Jasper"}

  $.fn.colorPicker = function(options) {
  var that = this;
    var settings = $.extend({
            colours_per_page: 16,
            colour_list: colour_list,
            default_color: '#cd5c5c'
        }, options);
    var colour_groups = inGroupsOf(Object.keys(settings.colour_list), settings.colours_per_page)
    
    var pointer = 0;
    // find colour
    for (var i=0; i < colour_groups.length; i++) {
      var result = colour_groups[i].indexOf(settings.default_color)
      if(result > -1) {
      pointer = i;
        break;
      }
    }
    alert(pointer)
    
    //static container
    var $static_container = $('<div></div>').addClass('dizzycp-static_container')
    var $text_label_for_colour = $('<div>' + settings.colour_list[settings.default_color] + '</div>').addClass("dizzycp-text_label_for_colour")
    var $big_colour_square_frame = $('<div></div>').addClass('dizzycp-big_colour_square_frame')
    var $big_colour_square_swatch = $('<div></div>').css("background-color", settings.default_color).addClass('dizzycp-big_colour_square_swatch')
    
    $big_colour_square_frame.append($big_colour_square_swatch)
    var $swatch = $('<div></div>').addClass("dizzycp-swatch_container")
    $swatch.append($big_colour_square_frame).append($text_label_for_colour)
    
    // container to fade in
    var $container_to_fade_in = $static_container.clone().addClass("dizzycp-container_to_fade_in")
    
    // compile containers
    $static_container.append($swatch)

    // Colour grids
    var counter = 0;
    
     var $divs = []
    colour_groups.forEach(function(colours) {
        var $div = $("<div></div>")
        $divs.push($div)
        colours.forEach(function(colour) {
            $div.append("<div class='dizzycp-small_swatch_frame'><div class='dizzycp-small_swatch' style='background-color:" + colour + "'></div></div>")
        })
        if(counter != pointer ) {
            $div.css({display:"none"})
        }
        counter++
    })
    
     var $table = $('<table></table>').addClass("dizzycp").prepend("<td class='dizzycp-left'>&laquo</td>");
     var $td = $('<td></td>').addClass("dizzycp-swatch_cell").html($divs)
     $table.append($td).append("<td class='dizzycp-right'>&raquo;</td>")    

    $container_to_fade_in.append($table)
        
    var $wrapper = $('<div></div>').append($static_container).append($container_to_fade_in)
    $wrapper.css("position", "relative")
   // Hover over a swatch
    $wrapper.on('mouseenter', 'div.dizzycp-small_swatch_frame', function() {    
        var chosen_colour = colour_groups[pointer][$(this).index()]
        $big_colour_square_swatch.css("background-color",chosen_colour)
        $text_label_for_colour.text(settings.colour_list[chosen_colour])        
        that.trigger('hover_colour', chosen_colour)
    })      
    
    // Click on a swatch    
    $wrapper.on('click', 'div.dizzycp-small_swatch_frame', function() {
        $container_to_fade_in.fadeOut();
    })  
    
    // Enter big swatch    
    $big_colour_square_frame.mouseenter(function() {   
        $static_container.addClass("dizzycp-container_selected")
        $container_to_fade_in.addClass("dizzycp-container_selected")
        $container_to_fade_in.fadeIn();
    })
    
    // Leave wrapper
    $wrapper.mouseleave(function() {  
        $static_container.removeClass("dizzycp-container_selected")
        $container_to_fade_in.removeClass("dizzycp-container_selected")  
        $container_to_fade_in.fadeOut();
    })   
   
   // Navigate between palettes
   $(this).on('click', '.dizzycp-left', function() {
   if(pointer > 0) {
         $divs[pointer].hide();
       pointer = pointer -1;
       $divs[pointer].show();
       }
   })
   
   $(this).on('click', '.dizzycp-right', function() {
   if(pointer < $divs.length + 1) {
       $divs[pointer].hide();
       pointer = pointer + 1;
       $divs[pointer].show();
       }
   })
   $(this).html($wrapper)
    
  return this;
  }
  

})(jQuery)