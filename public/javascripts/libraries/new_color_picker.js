var colours = {"#cd5c5c":"Indian red","#ff4040":"Coral red","#321414":"Seal brown","#3c1414":"Dark sienna","#cc3333":"Persian red","#701c1c":"Persian plum","#a52a2a":"Red brown","#922724":"Vivid auburn","#ff6961":"Pastel red","#b94e48":"Deep chestnut","#ff5349":"Red Orange","#eb4c42":"Carmine pink","#e03c31":"CG Red","#fd5e53":"Sunset Orange","#f88379":"Coral pink","#e34234":"Vermilion","#af4035":"Pale carmine","#fe6f5e":"Bittersweet","#592720":"Caput mortuum","#79443b":"Bole","#8a3324":"Burnt umber","#ff6347":"Tomato","#cd5b45":"Dark coral","#e2725b":"Terra cotta","#ff5a36":"Portland Orange","#ff6e4a":"Outrageous Orange","#e97451":"Burnt sienna","#ff8c69":"Salmon","#ff7f50":"Coral","#ffa07a":"Light salmon","#da8a67":"Pale copper","#ff9966":"Atomic tangerine","#ff8243":"Mango Tango","#d68a59":"Raw Sienna","#6f4e37":"Coffee","#bb6528":"Ruddy brown","#80461b":"Russet","#d99058":"Persian orange","#f4a460":"Sandy brown","#b87333":"Copper","#e08d3c":"Tiger eye","#e5aa70":"Fawn","#cd7f32":"Bronze","#4b3621":"Café noir","#654321":"Otter brown","#ffa343":"Neon Carrot","#e1a95f":"Earth yellow","#ffae42":"Yellow Orange","#e3a857":"Indian yellow","#ffc87c":"Topaz","#ffb347":"Pastel orange","#b78727":"University of California Gold","#6c541e":"Field drab","#cba135":"Satin sheen gold","#e5b73b":"Meat brown","#f8d568":"Orange Yellow","#ffdb58":"Mustard","#fada5e":"Stil de grain yellow","#cfb53b":"Old gold","#c5b358":"Vegas gold","#e9d66b":"Hansa yellow","#ffe135":"Banana yellow","#ecd540":"Sandstorm","#b5a642":"Brass","#fbec5d":"Maize","#e4d96f":"Straw","#fff44f":"Lemon Yellow","#fcf75e":"Icterine","#ffff66":"Unmellow Yellow","#d1e231":"Pear","#4b5320":"Army green","#bdda57":"June bud","#a4c639":"Android Green","#6b8e23":"Olive Drab","#9acd32":"Yellow green","#556b2f":"Dark olive green","#b2ec5d":"Inchworm","#507d2a":"Sap green","#21421e":"Myrtle","#228b22":"Forest green","#32cd32":"Lime green","#76ff7a":"Screamin Green","#1e4d2b":"Cal Poly Pomona green","#50c878":"Paris Green","#3cd070":"UFO Green","#2e8b57":"Sea green","#3cb371":"Medium sea green","#177245":"Dark spring green","#123524":"Phthalo green","#66ddaa":"Medium aquamarine","#3eb489":"Mint","#7fffd4":"Aquamarine","#45cea2":"Shamrock","#40826d":"Viridian","#30ba8f":"Mountain Meadow","#29ab87":"Jungle green","#18453b":"MSU Green","#30d5c8":"Turquoise","#43b3ae":"Verdigris","#48d1cc":"Medium turquoise","#7df9ff":"Electric blue","#367588":"Teal blue","#73c2fb":"Maya blue","#4997d0":"Celestial blue","#4682b4":"Steel blue","#318ce7":"Bleu de France","#26619c":"Lapis lazuli","#417dc1":"Tufts Blue","#5b92e5":"United Nations blue","#6495ed":"Cornflower blue","#446ccf":"Han blue","#2a52be":"Cerulean blue","#4169e1":"Royal blue","#4166f5":"Ultramarine blue","#324ab2":"Violet Blue","#23297a":"Saint Patrick Blue","#191970":"Midnight blue","#5a4fcf":"Iris","#6050dc":"Majorelle Blue","#6a5acd":"Slate blue","#483d8b":"Dark slate blue","#7b68ee":"Medium slate blue","#9457eb":"Lavender indigo","#7851a9":"Royal purple","#69359c":"Purple Heart","#9955bb":"Deep lilac","#9932cc":"Dark orchid","#b666d2":"Rich lilac","#df73ff":"Heliotrope","#ba55d3":"Medium orchid","#fc74fd":"Pink Flamingo","#ff77ff":"Fuchsia pink","#c154c1":"Deep fuchsia","#ff6fff":"Ultra pink","#682860":"Palatinate purple","#bd33a4":"Byzantine","#702963":"Byzantium","#fe4eda":"Purple pizzazz","#ff66cc":"Rose pink","#b53389":"Fandango","#ca2c92":"Royal fuchsia","#fe59c2":"Neon fuchsia","#bb3385":"Medium red violet","#873260":"Boysenberry","#c54b8c":"Mulberry","#ff43a4":"Wild Strawberry","#da3287":"Deep cerise","#872657":"Dark raspberry","#f9429e":"Rose bonbon","#ff69b4":"Hot pink","#e25098":"Raspberry pink","#ff55a3":"Brilliant rose","#673147":"Old mauve","#ec3b83":"Cerise pink","#f75394":"Violet Red","#b03060":"Rich maroon","#f64a8a":"French rose","#b3446c":"Raspberry rose","#e75480":"Dark pink","#de5d83":"Blush","#de3163":"Cherry","#f56991":"Light Crimson","#ff355e":"Radical Red","#fb607f":"Brink pink","#fc6c85":"Wild Watermelon","#cb4154":"Brick red","#722f37":"Wine","#cc4e5c":"Dark terra cotta","#893f45":"Cordovan","#e66771":"Light carmine pink","#e4717a":"Candy pink","#933d41":"Smokey topaz","#ab4e52":"Rose vale","#ef3038":"Deep carmine pink","#d73b3e":"Jasper"}

;(function($) {

  $.fn.colorPicker = function(options) {
    var that = this;
    var settings = $.extend({},  $.fn.colorPicker.defaultOptions, options);

    var container_width = settings.width || this.width();
    var swatch_width = container_width / 6;
    var pairs = _.pairs(colours)
    var groups = inGroupsOf(pairs, 6)

    //static container
    var $static_container = $('<div></div>').addClass('dizzycp-static_container')
    var $text_label_for_colour = $('<div>' + settings.colour_list[settings.default_color] + '</div>').addClass("dizzycp-text_label_for_colour")
    var $big_colour_square_frame = $('<div></div>').addClass('dizzycp-big_colour_square_frame')
    var $big_colour_square_swatch = $('<div></div>').css("background-color", settings.default_color).addClass('dizzycp-big_colour_square_swatch')
  
    $big_colour_square_frame.append($big_colour_square_swatch)
    var $swatch = $('<div></div>').addClass("dizzycp-swatch_container")
    $swatch.append($big_colour_square_frame).append($text_label_for_colour)   
    
    var number_of_colours = pairs.length;
    var width_of_inside = swatch_width * number_of_colours;
  
    var $external_wrapper = $('<div></div>').addClass('dizzycp-external_wrapper').width(container_width).css("height", swatch_width + "px");
    var $internal_wrapper = $('<div></div>').addClass('dizzycp-internal_wrapper').width(container_width)
    var $scrollable_colours = $('<div></div>').addClass('dizzycp-scrollable_colours').css("width",width_of_inside + "px");
    $internal_wrapper.append($scrollable_colours)
    $external_wrapper.append($internal_wrapper)
  
    var counter = 0;
    var colour_divs = []
  
    groups.forEach(function(group) {
      var $colour_div = $('<div id="panel_' + counter + '" style="float:left"></div>');
      group.forEach(function(colour) {
        $colour_div.append('<div data-colour="' + colour[0] + '" style="width:' + swatch_width +'px;height:' + swatch_width + 'px;background-color:' + colour[0] + '" class="square"></div>');
      })
      colour_divs.push($colour_div)
      counter = counter + 1;
    })
      
    $scrollable_colours.html(colour_divs)
   
    // container to fade in
    var $container_to_fade_in = $static_container.clone().addClass("dizzycp-container_to_fade_in")

    $container_to_fade_in.append($external_wrapper)
    
    // Hover and click over swatches
    $container_to_fade_in.find('.square').mouseenter(function(e) {
      var $el = $(e.currentTarget);
      var hex = $el.data("colour");
      $text_label_for_colour.text(colours[hex])
        that.trigger('dizzy-cp:hoverColor', hex)
      $big_colour_square_swatch.css("background-color", hex)
    })
    
    $container_to_fade_in.find('.square').click(function(e) {
      var $el = $(e.currentTarget);
      var hex = $el.data("colour");
      that.trigger('dizzy-cp:click', hex)
      $container_to_fade_in.hide();
    })
  
  // compile containers
  $static_container.append($swatch)

  var $wrapper = $('<div></div>').append($static_container).append($container_to_fade_in)
  $wrapper.css("position", "relative")
  
  // Arrows 
  $left_arrow = $('<div class="dizzycp-left_arrow"style="float:left;font-size:50px;">&laquo;</div>').click(function() {
    scrollColours(-1)
  });
  $right_arrow = $('<div  class="dizzycp-right_arrow" style="float:right;font-size:50px;">&raquo;</div>').click(function() {
    scrollColours(1)
  });;
  
  $container_to_fade_in.append($left_arrow).append($right_arrow)
  
  // SELECT DEFAULT PANEL
  var pointer = 0;
  var panel_counter = 0;
  var selected_counter = 0;
  var default_panel;
  groups.forEach(function(colour_group) {
    for (var i=0; i < colour_group.length; i++) {

      var result = colour_group[i][0].indexOf(settings.default_color)
      if(result > -1) {
        default_panel = $container_to_fade_in.find('#panel_' + panel_counter)
        selected_counter = panel_counter;
        break;
      }
    }
    panel_counter = panel_counter + 1;
  })

  var first_time = true;
  
   // Enter big swatch    
  $big_colour_square_frame.mouseenter(function() {       
    $static_container.addClass("dizzycp-container_selected")
    $container_to_fade_in.addClass("dizzycp-container_selected")
    $container_to_fade_in.fadeIn();
    if(first_time) {    
      $internal_wrapper.scrollLeft(default_panel.position().left);
      first_time = false;
    }
  })
    
      // Leave wrapper
    $wrapper.mouseleave(function() {  
      $static_container.removeClass("dizzycp-container_selected")
      $container_to_fade_in.removeClass("dizzycp-container_selected")  
      $container_to_fade_in.fadeOut();
    })   
    this.html($wrapper)
   
    function scrollColours(amount) {
    console.log(panel_counter)
      selected_counter = selected_counter + amount;  
      var position = $container_to_fade_in.find('#panel_' + selected_counter).position().left;  
      $internal_wrapper.animate({scrollLeft: position}, 100);
    }
    return this;
  }

  $.fn.colorPicker.defaultOptions ={
    colours_per_page: 16,
    colour_list: colours,
    default_color: '#cd5c5c'
  } 
      
})(jQuery)  