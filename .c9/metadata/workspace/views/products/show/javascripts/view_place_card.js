{"changed":true,"filter":false,"title":"view_place_card.js","tooltip":"/views/products/show/javascripts/view_place_card.js","value":"/* \n  Each font has a size value such as 0.12 or 0.08 and this value\n  is the size of the font as a percentage of the container width. \n  This allows us to make sure that when the font size is changed\n  it remains consistent relative to its container \n  \n  This view takes a Guest as a model.\n  We start by binding the window resize events to two private render methods, _renderFontSize and\n  _renderBaseline, which will rerender the font and baseline when\n  the window is resized\n*/\nvar PlaceCardView = Backbone.View.extend({\n  className: 'place_card_view',\n  initialize: function() {   \n    this.print_ui_el = $('#print_ui');\n    this.percentage_font_size = this.model.get(\"font_size\")\n    this.display_font_size = this.calculatedWidth * this.percentage_font_size;\n    $(window).bind(\"resize\", _.bind(this._renderFontAndBaseline, this));\n    this.listenTo(thisProduct.get(\"guests\"), 'resetFont', this._renderBaseline)\n    this.listenTo(thisProduct.get(\"guests\"), 'resetFont', this._renderFontSize)\n    this.listenTo(thisProduct, 'redraw', this._renderFontAndBaseline)\n    this.listenTo(thisProduct, 'change:font', this._renderFontFamily); \n    this.listenTo(thisProduct.get(\"guests\"), 'adjustFontSize', this._renderFontSize)\n    this.listenTo(thisProduct.get(\"guests\"), 'adjustBaseline', this._renderBaseline)\n    this.listenTo(this.model, \"change:name\", this._renderName)\n    this.listenTo(this.model, \"removeWithoutAffectingTextarea\", this.deleteGuest)\n    this.listenTo(this.model, \"changeWithoutAffectingTextarea\", this._renderName)\n    this.listenTo(thisProduct.get(\"guests\"), 'renderNames', this._renderName)\n  },  \n  events: {  \n    \"blur .guest_name\": 'updateGuestFromDiv',\n    'focus .guest_name': 'focusGuest',\n    'click .delete_guest': 'deleteGuest',\n    'click .plus_font': 'increaseFont',  \n    'click .minus_font': 'decreaseFont',\n    'click .up_baseline': 'upBaseline',\n    'click .down_baseline': 'downBaseline',\n     \"keydown .guest_name\": \"resetFocus\"\n  },   \n  focusGuest: function() {\n    app_router.navigate(\"editing_place_cards\")\n    var that = this;\n    $('body').addClass(\"guest_focused\")\n     this.timeout_id = setTimeout(function(){\n        that.$('.guest_name').blur();\n      }, 5000);  \n  },\n  resetFocus: function() {\n    var that = this;\n  \n    clearTimeout(this.timeout_id)\n    this.timeout_id = setTimeout(function(){\n      that.$('.guest_name').blur();\n    }, 3000);   \n  },\n  blurGuest: function() {\n    clearTimeout(this.timeout_id)\n    $('body').removeClass(\"guest_focused\")\n  },\n  deleteGuest: function() {\n    this.model.destroy();\n    this.$el.addClass(\"hide\")\n    this.remove();\n    Waypoint.refreshAll();\n  },\n  updateGuestFromDiv: function() {\n    this.updated_from_div = true;\n    this.model.set(\"name\", $.trim(this.$('.guest_name').text()))\n   \n    clearTimeout(this.timeout_id)\n    $('body').removeClass(\"guest_focused\")\n  },\n  increaseFont:   function() { this._adjustFontSize(1.03); thisProduct.saveGuests(); }, // percentage increase\n  decreaseFont:   function() { this._adjustFontSize(0.97); thisProduct.saveGuests(); }, // percentage decrease\n  upBaseline:     function() { this._adjustBaseline(-1); thisProduct.saveGuests(); },\n  downBaseline:   function() { this._adjustBaseline(1); thisProduct.saveGuests() },\n  calculateWidth: function() {\n     var body_width = $('body').width()\n    var print_ui_width = this.print_ui_el.width()\n  \n         var desktop_panel_width = netbook_panel_width= ((95/100) * (print_ui_width/body_width/2));\n      var phablet = smartphone = (95/100) * (print_ui_width/body_width);\n    if (this.options.widths_relative_to_viewport) { // doesn't exist in plain GuestView\n      if(body_width < 501) {\n        this.calculatedWidth = (smartphone * body_width); \n      } else if(body_width > 500 && body_width < 801){ \n        this.calculatedWidth = (phablet * body_width);\n      }  else if(body_width > 800 && body_width < 1026){ \n        this.calculatedWidth = netbook_panel_width * body_width;\n      } else {\n        this.calculatedWidth = desktop_panel_width * body_width;\n      }\n    }\n   },\n  _renderBaseline: function() {\n    var baseline = this.model.calculateBaselineOffset(this.calculatedWidth);\n    this.guest_name_element.css({\n      \"margin-top\": baseline.top_half + \"px\", \n      \"height\":baseline.bottom_half + \"px\", \n      \"line-height\": baseline.bottom_half + \"px\"});\n  },\n  _renderFontFamily: function() { this.$('.guest_name').css('font-family', thisProduct.get(\"font\")); },\n  _renderFontSize: function() {\n    this.guest_name_element = this.guest_name_element || this.$('.guest_name') \n    this.display_font_size = this.calculatedWidth * this.model.get(\"font_size\");\n    this.guest_name_element.css('font-size', this.display_font_size + \"px\");   \n  },\n  _renderFontAndBaseline: function() {\n    var body_width = $('body').width(),\n      previous_width = this.previous_body_width;\n    if((previous_width != body_width) && !(this.print_ui_el.css('display') == 'none' )) {\n      this.calculateWidth()\n      this._renderFontSize();\n      this._renderBaseline();\n      this.previous_body_width = body_width;\n    }\n  },\n  _adjustFontSize: function(amount) {\n    this.percentage_font_size = this.percentage_font_size * amount;\n    this.display_font_size = this.calculatedWidth * this.percentage_font_size;\n    this._renderFontSize();\n  },\n  _renderName: function() {  \n    if (!this.updated_from_div) this.$('.guest_name').text(this.model.get(\"name\"))\n    this.updated_from_div = false;\n  },\n  render: function() {     \n    var compiled_template = Handlebars.template(templates[\"place_card\"]),\n      $template = $(compiled_template(this.model.presenter(this.calculatedWidth))),\n      colours = thisProduct.get(\"colours\");\n    for(var i=0; i < colours.length; i++) {\n      $template.find('.colour_' + i).css(\"background-color\", colours[i])\n    }\n    this.$el.html($template)\n    console.log(this.options)\n    this.guest_name_element = this.$('.guest_name');\n    return this;\n  }\n});","undoManager":{"mark":99,"position":100,"stack":[[{"start":{"row":21,"column":32},"end":{"row":21,"column":34},"action":"insert","lines":["()"],"id":955}],[{"start":{"row":21,"column":33},"end":{"row":21,"column":35},"action":"insert","lines":["\"\""],"id":956}],[{"start":{"row":21,"column":34},"end":{"row":21,"column":35},"action":"insert","lines":["g"],"id":957}],[{"start":{"row":21,"column":35},"end":{"row":21,"column":36},"action":"insert","lines":["u"],"id":958}],[{"start":{"row":21,"column":36},"end":{"row":21,"column":37},"action":"insert","lines":["e"],"id":959}],[{"start":{"row":21,"column":37},"end":{"row":21,"column":38},"action":"insert","lines":["s"],"id":960}],[{"start":{"row":21,"column":38},"end":{"row":21,"column":39},"action":"insert","lines":["t"],"id":961}],[{"start":{"row":21,"column":39},"end":{"row":21,"column":40},"action":"insert","lines":["s"],"id":962}],[{"start":{"row":81,"column":83},"end":{"row":82,"column":145},"action":"remove","lines":[""," // _adjustBaseline: function(amount) { this.model.set(\"baseline\", this.model.get(\"baseline\") + amount, {silent:true}); this._renderBaseline() },"],"id":963}],[{"start":{"row":123,"column":37},"end":{"row":124,"column":0},"action":"insert","lines":["",""],"id":964},{"start":{"row":124,"column":0},"end":{"row":124,"column":4},"action":"insert","lines":["    "]}],[{"start":{"row":124,"column":4},"end":{"row":124,"column":5},"action":"insert","lines":["i"],"id":965}],[{"start":{"row":124,"column":5},"end":{"row":124,"column":6},"action":"insert","lines":["f"],"id":966}],[{"start":{"row":124,"column":6},"end":{"row":124,"column":8},"action":"insert","lines":["()"],"id":967}],[{"start":{"row":124,"column":7},"end":{"row":124,"column":8},"action":"insert","lines":["a"],"id":968}],[{"start":{"row":124,"column":8},"end":{"row":124,"column":9},"action":"insert","lines":["m"],"id":969}],[{"start":{"row":124,"column":9},"end":{"row":124,"column":10},"action":"insert","lines":["o"],"id":970}],[{"start":{"row":124,"column":10},"end":{"row":124,"column":11},"action":"insert","lines":["u"],"id":971}],[{"start":{"row":124,"column":11},"end":{"row":124,"column":12},"action":"insert","lines":["n"],"id":972}],[{"start":{"row":124,"column":12},"end":{"row":124,"column":13},"action":"insert","lines":["t"],"id":973}],[{"start":{"row":124,"column":14},"end":{"row":124,"column":15},"action":"insert","lines":[" "],"id":974}],[{"start":{"row":124,"column":15},"end":{"row":124,"column":16},"action":"insert","lines":["{"],"id":975}],[{"start":{"row":124,"column":0},"end":{"row":124,"column":16},"action":"remove","lines":["    if(amount) {"],"id":987}],[{"start":{"row":123,"column":37},"end":{"row":124,"column":0},"action":"remove","lines":["",""],"id":988}],[{"start":{"row":110,"column":57},"end":{"row":110,"column":77},"action":"remove","lines":["percentage_font_size"],"id":989},{"start":{"row":110,"column":57},"end":{"row":110,"column":58},"action":"insert","lines":["m"]}],[{"start":{"row":110,"column":58},"end":{"row":110,"column":59},"action":"insert","lines":["o"],"id":990}],[{"start":{"row":110,"column":59},"end":{"row":110,"column":60},"action":"insert","lines":["d"],"id":991}],[{"start":{"row":110,"column":60},"end":{"row":110,"column":61},"action":"insert","lines":["e"],"id":992}],[{"start":{"row":110,"column":61},"end":{"row":110,"column":62},"action":"insert","lines":["l"],"id":993}],[{"start":{"row":110,"column":62},"end":{"row":110,"column":63},"action":"insert","lines":["."],"id":994}],[{"start":{"row":110,"column":63},"end":{"row":110,"column":64},"action":"insert","lines":["g"],"id":995}],[{"start":{"row":110,"column":64},"end":{"row":110,"column":65},"action":"insert","lines":["e"],"id":996}],[{"start":{"row":110,"column":65},"end":{"row":110,"column":66},"action":"insert","lines":["t"],"id":997}],[{"start":{"row":110,"column":66},"end":{"row":110,"column":68},"action":"insert","lines":["()"],"id":998}],[{"start":{"row":110,"column":67},"end":{"row":110,"column":69},"action":"insert","lines":["\"\""],"id":999}],[{"start":{"row":110,"column":68},"end":{"row":110,"column":69},"action":"insert","lines":["f"],"id":1000}],[{"start":{"row":110,"column":69},"end":{"row":110,"column":70},"action":"insert","lines":["o"],"id":1001}],[{"start":{"row":110,"column":70},"end":{"row":110,"column":71},"action":"insert","lines":["n"],"id":1002}],[{"start":{"row":110,"column":71},"end":{"row":110,"column":72},"action":"insert","lines":["t"],"id":1003}],[{"start":{"row":110,"column":72},"end":{"row":110,"column":73},"action":"insert","lines":["_"],"id":1004}],[{"start":{"row":110,"column":73},"end":{"row":110,"column":74},"action":"insert","lines":["s"],"id":1005}],[{"start":{"row":110,"column":74},"end":{"row":110,"column":75},"action":"insert","lines":["i"],"id":1006}],[{"start":{"row":110,"column":75},"end":{"row":110,"column":76},"action":"insert","lines":["z"],"id":1007}],[{"start":{"row":110,"column":76},"end":{"row":110,"column":77},"action":"insert","lines":["e"],"id":1008}],[{"start":{"row":21,"column":27},"end":{"row":21,"column":28},"action":"insert","lines":["c"],"id":1009}],[{"start":{"row":21,"column":68},"end":{"row":21,"column":83},"action":"remove","lines":["_adjustFontSize"],"id":1010},{"start":{"row":21,"column":68},"end":{"row":21,"column":69},"action":"insert","lines":["r"]}],[{"start":{"row":21,"column":69},"end":{"row":21,"column":70},"action":"insert","lines":["e"],"id":1011}],[{"start":{"row":21,"column":70},"end":{"row":21,"column":71},"action":"insert","lines":["n"],"id":1012}],[{"start":{"row":21,"column":71},"end":{"row":21,"column":72},"action":"insert","lines":["d"],"id":1013}],[{"start":{"row":21,"column":72},"end":{"row":21,"column":73},"action":"insert","lines":["e"],"id":1014}],[{"start":{"row":21,"column":73},"end":{"row":21,"column":74},"action":"insert","lines":["r"],"id":1015}],[{"start":{"row":21,"column":74},"end":{"row":21,"column":75},"action":"insert","lines":["F"],"id":1016}],[{"start":{"row":21,"column":75},"end":{"row":21,"column":76},"action":"insert","lines":["o"],"id":1017}],[{"start":{"row":21,"column":76},"end":{"row":21,"column":77},"action":"insert","lines":["n"],"id":1018}],[{"start":{"row":21,"column":77},"end":{"row":21,"column":78},"action":"insert","lines":["t"],"id":1019}],[{"start":{"row":21,"column":78},"end":{"row":21,"column":79},"action":"insert","lines":["t"],"id":1020}],[{"start":{"row":21,"column":78},"end":{"row":21,"column":79},"action":"remove","lines":["t"],"id":1021}],[{"start":{"row":21,"column":78},"end":{"row":21,"column":79},"action":"insert","lines":["S"],"id":1022}],[{"start":{"row":21,"column":79},"end":{"row":21,"column":80},"action":"insert","lines":["i"],"id":1023}],[{"start":{"row":21,"column":80},"end":{"row":21,"column":81},"action":"insert","lines":["z"],"id":1024}],[{"start":{"row":21,"column":81},"end":{"row":21,"column":82},"action":"insert","lines":["e"],"id":1025}],[{"start":{"row":21,"column":67},"end":{"row":21,"column":68},"action":"remove","lines":["."],"id":1026},{"start":{"row":21,"column":67},"end":{"row":21,"column":68},"action":"insert","lines":["_"]}],[{"start":{"row":21,"column":67},"end":{"row":21,"column":68},"action":"insert","lines":["."],"id":1027}],[{"start":{"row":39,"column":0},"end":{"row":40,"column":38},"action":"remove","lines":["    this.model.set(\"baseline\", 0);","    this.model.set(\"font_size\", size);"],"id":1028}],[{"start":{"row":37,"column":7},"end":{"row":43,"column":4},"action":"remove","lines":["","  _resetFont: function(baseline, size) {","","    this.percentage_font_size = size;","    this._renderFontSize();","    this._renderBaseline();","  },"],"id":1029}],[{"start":{"row":18,"column":63},"end":{"row":18,"column":73},"action":"remove","lines":["_resetFont"],"id":1030},{"start":{"row":18,"column":63},"end":{"row":18,"column":77},"action":"insert","lines":["renderFontSize"]}],[{"start":{"row":18,"column":78},"end":{"row":19,"column":0},"action":"insert","lines":["",""],"id":1031},{"start":{"row":19,"column":0},"end":{"row":19,"column":4},"action":"insert","lines":["    "]}],[{"start":{"row":19,"column":4},"end":{"row":20,"column":78},"action":"insert","lines":["","    this.listenTo(thisProduct.get(\"guests\"), 'resetFont', this.renderFontSize)"],"id":1032}],[{"start":{"row":19,"column":4},"end":{"row":20,"column":78},"action":"remove","lines":["","    this.listenTo(thisProduct.get(\"guests\"), 'resetFont', this.renderFontSize)"],"id":1033}],[{"start":{"row":18,"column":72},"end":{"row":18,"column":77},"action":"remove","lines":["tSize"],"id":1034},{"start":{"row":18,"column":72},"end":{"row":18,"column":73},"action":"insert","lines":["A"]}],[{"start":{"row":18,"column":73},"end":{"row":18,"column":74},"action":"insert","lines":["n"],"id":1035}],[{"start":{"row":18,"column":74},"end":{"row":18,"column":75},"action":"insert","lines":["d"],"id":1036}],[{"start":{"row":18,"column":75},"end":{"row":18,"column":76},"action":"insert","lines":["B"],"id":1037}],[{"start":{"row":18,"column":76},"end":{"row":18,"column":77},"action":"insert","lines":["a"],"id":1038}],[{"start":{"row":18,"column":77},"end":{"row":18,"column":78},"action":"insert","lines":["s"],"id":1039}],[{"start":{"row":18,"column":78},"end":{"row":18,"column":79},"action":"insert","lines":["e"],"id":1040}],[{"start":{"row":18,"column":79},"end":{"row":18,"column":80},"action":"insert","lines":["l"],"id":1041}],[{"start":{"row":18,"column":80},"end":{"row":18,"column":81},"action":"insert","lines":["i"],"id":1042}],[{"start":{"row":18,"column":81},"end":{"row":18,"column":82},"action":"insert","lines":["n"],"id":1043}],[{"start":{"row":18,"column":82},"end":{"row":18,"column":83},"action":"insert","lines":["e"],"id":1044}],[{"start":{"row":18,"column":72},"end":{"row":18,"column":73},"action":"insert","lines":["t"],"id":1045}],[{"start":{"row":18,"column":63},"end":{"row":18,"column":64},"action":"insert","lines":["_"],"id":1046}],[{"start":{"row":18,"column":70},"end":{"row":18,"column":85},"action":"remove","lines":["FontAndBaseline"],"id":1047},{"start":{"row":18,"column":70},"end":{"row":18,"column":71},"action":"insert","lines":["B"]}],[{"start":{"row":18,"column":71},"end":{"row":18,"column":72},"action":"insert","lines":["a"],"id":1048}],[{"start":{"row":18,"column":72},"end":{"row":18,"column":73},"action":"insert","lines":["s"],"id":1049}],[{"start":{"row":18,"column":73},"end":{"row":18,"column":74},"action":"insert","lines":["l"],"id":1050}],[{"start":{"row":18,"column":73},"end":{"row":18,"column":74},"action":"remove","lines":["l"],"id":1051}],[{"start":{"row":18,"column":73},"end":{"row":18,"column":74},"action":"insert","lines":["e"],"id":1052}],[{"start":{"row":18,"column":74},"end":{"row":18,"column":75},"action":"insert","lines":["l"],"id":1053}],[{"start":{"row":18,"column":75},"end":{"row":18,"column":76},"action":"insert","lines":["i"],"id":1054}],[{"start":{"row":18,"column":76},"end":{"row":18,"column":77},"action":"insert","lines":["n"],"id":1055}],[{"start":{"row":18,"column":77},"end":{"row":18,"column":78},"action":"insert","lines":["e"],"id":1056}],[{"start":{"row":18,"column":79},"end":{"row":19,"column":79},"action":"insert","lines":["","    this.listenTo(thisProduct.get(\"guests\"), 'resetFont', this._renderBaseline)"],"id":1057}],[{"start":{"row":19,"column":70},"end":{"row":19,"column":78},"action":"remove","lines":["Baseline"],"id":1058},{"start":{"row":19,"column":70},"end":{"row":19,"column":71},"action":"insert","lines":["F"]}],[{"start":{"row":19,"column":71},"end":{"row":19,"column":72},"action":"insert","lines":["o"],"id":1059}],[{"start":{"row":19,"column":72},"end":{"row":19,"column":73},"action":"insert","lines":["n"],"id":1060}],[{"start":{"row":19,"column":73},"end":{"row":19,"column":74},"action":"insert","lines":["t"],"id":1061}],[{"start":{"row":19,"column":74},"end":{"row":19,"column":75},"action":"insert","lines":["S"],"id":1062}],[{"start":{"row":19,"column":75},"end":{"row":19,"column":76},"action":"insert","lines":["i"],"id":1063}],[{"start":{"row":19,"column":76},"end":{"row":19,"column":77},"action":"insert","lines":["z"],"id":1064}],[{"start":{"row":19,"column":77},"end":{"row":19,"column":78},"action":"insert","lines":["e"],"id":1065}],[{"start":{"row":19,"column":79},"end":{"row":20,"column":4},"action":"remove","lines":["","    "],"id":1066}]]},"ace":{"folds":[],"scrolltop":0,"scrollleft":0,"selection":{"start":{"row":39,"column":26},"end":{"row":39,"column":26},"isBackwards":false},"options":{"guessTabSize":true,"useWrapMode":true,"wrapToView":true},"firstLineState":0},"timestamp":1440456332493}