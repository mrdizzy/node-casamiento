{"changed":true,"filter":false,"title":"view_print_ui.js","tooltip":"/views/products/show/javascripts/view_print_ui.js","value":"var PrintControlPanelView = Backbone.View.extend({\n  el: '#print_ui',\n  initialize: function() {\n    if(thisProduct.get(\"browser\")) {\n    $('body').addClass(thisProduct.get(\"browser\"))\n    }\n    this.listenTo(thisProduct, \"change:quantity\", this.renderPrice)\n    this.listenTo(thisProduct.get(\"guests\"), 'add', this.appendPlaceCard)\n    this.listenTo(thisProduct.get(\"guests\"), 'addMultiple', this.appendMultiplePlaceCards)\n    this.ui_alert_box_view = new PrintAlertBoxView();\n    //this._place_card_print_collection = new PrintPlaceCardCollectionView({\n    //  collection: thisProduct.get(\"guests\")\n    //})\n     this.listenTo(thisProduct.get(\"guests\"), 'reset', this.render)     \n  },\n  events: {\n    \"click #add_another\": \"addGuest\",\n    \"click #menu_lines\": \"toggleMainMenu\",\n    \"click .global_baseline_up\": \"baselineUp\",\n    \"click .global_baseline_down\": \"baselineDown\",\n    \"click .global_font_increase\": \"fontIncrease\",\n    \"click .global_font_decrease\": \"fontDecrease\",\n    \"click .global_font_reset\": \"fontReset\",\n    \"click .buy\": \"checkout\",\n    \"click #ui_printer_icon\": \"printPage\",  \n    \"click #mobile_ui_printer_icon\": \"printPage\"\n  },\n  addGuest:     function() {            thisProduct.get(\"guests\").add({}) },\n  fontReset:    function() {           thisProduct.get(\"guests\").resetFont(); },\n  fontIncrease: function() {           thisProduct.trigger('adjustFontSize', 1.05).saveGuests()  },\n  fontDecrease: function() {         thisProduct.trigger('adjustFontSize', 0.95).saveGuests()  },\n  baselineUp:   function() {          thisProduct.trigger('adjustBaseline', -1) },\n  baselineDown: function() {         thisProduct.trigger('adjustBaseline', 1) },\n  toggleMainMenu: function() { $('#left_menu').fadeToggle(); },\n  \n  checkout: function() {\n      this.$('.buy').hide();\n      this.$('.paypal_spinner').show()\n      thisProduct.makePurchase();\n  },\n  appendPlaceCard: function(guest) {\n    var place_card = this._newPlaceCardView(guest, \"appended_place_card\").render().el   \n    var place_card = $(place_card);\n    this.$( \".add_another\" ).before(place_card)    \n    place_card.fadeIn(2000);\n  },\n  \n  appendMultiplePlaceCards: function(counter) {\n    var results = thisProduct.get(\"guests\").slice(counter)\n    var html = []\n    var that = this;\n    results.forEach(function(guest) {\n        html.push(that._newPlaceCardView(guest, \"appended_place_card\").render().el)\n    })\n     this.$( \".add_another\" ).before(html)    \n  },\n  loadFont: function(e, font) {\n    $('.font_spinner').hide();\n    $('.guest_name').show()  \n  },\n  changeFont: function(e, font) { \n    thisProduct.set(\"font\", font)\n    $('.font_spinner').show();\n    $('.guest_name').hide()  \n    thisProduct.save();\n  },    \n  // Create the SVG print view\n  printPage: function(e) {    \n    this._place_card_print_collection.render()\n    $('#ui_printer_icon').attr('src', \"/gfx/spinners/360.gif\");\n    $('#mobile_ui_printer_icon').attr('src', \"/gfx/spinners/360.gif\");\n  },\n  render: function() {\n    var $template = $(Handlebars.template(templates[\"user_interface_for_print\"])({\n      pounds: thisProduct.get(\"pounds\"),\n      pence: thisProduct.get(\"pence\")\n    })); \n    this.$el.html($template)\n    \n    // Render place cards\n    var place_cards = thisProduct.get(\"guests\").map(function(guest) {   \n      return this._newPlaceCardView(guest).render().el\n    }, this)\n        \n    this.$('#actual_cards').prepend(place_cards)\n   \n    return this;\n  },\n  renderPrice: function() {\n    this.$('#pound').text(thisProduct.get(\"pounds\"));\n    this.$('#decimal').text(\".\" + thisProduct.get(\"pence\"))\n  },\n  // convenience method for rendering a new place card view\n  _newPlaceCardView: function(guest, appended) {\n    return new PlaceCardView(_.extend({\n      model: guest,      \n      widths_relative_to_viewport: {\n        netbook: 37.04890873,\n        desktop: 32.646875,\n        tablet: 61.746742671,\n        mobile: 88.65156576200418\n      },\n      className:\"place_card_view \" + (appended ? appended : \"\")\n    }))\n  }\n})","undoManager":{"mark":99,"position":100,"stack":[[{"start":{"row":29,"column":5},"end":{"row":29,"column":6},"action":"insert","lines":["s"],"id":113}],[{"start":{"row":29,"column":6},"end":{"row":29,"column":7},"action":"insert","lines":["P"],"id":114}],[{"start":{"row":29,"column":7},"end":{"row":29,"column":8},"action":"insert","lines":["r"],"id":115}],[{"start":{"row":29,"column":8},"end":{"row":29,"column":9},"action":"insert","lines":["o"],"id":116}],[{"start":{"row":29,"column":9},"end":{"row":29,"column":10},"action":"insert","lines":["d"],"id":117}],[{"start":{"row":29,"column":10},"end":{"row":29,"column":11},"action":"insert","lines":["u"],"id":118}],[{"start":{"row":29,"column":10},"end":{"row":29,"column":11},"action":"remove","lines":["u"],"id":119}],[{"start":{"row":29,"column":9},"end":{"row":29,"column":10},"action":"remove","lines":["d"],"id":120}],[{"start":{"row":29,"column":8},"end":{"row":29,"column":9},"action":"remove","lines":["o"],"id":121}],[{"start":{"row":29,"column":7},"end":{"row":29,"column":8},"action":"remove","lines":["r"],"id":122}],[{"start":{"row":29,"column":6},"end":{"row":29,"column":7},"action":"remove","lines":["P"],"id":123}],[{"start":{"row":29,"column":5},"end":{"row":29,"column":6},"action":"remove","lines":["s"],"id":124}],[{"start":{"row":29,"column":4},"end":{"row":29,"column":5},"action":"remove","lines":["i"],"id":125}],[{"start":{"row":29,"column":3},"end":{"row":29,"column":4},"action":"remove","lines":["h"],"id":126}],[{"start":{"row":29,"column":2},"end":{"row":29,"column":3},"action":"remove","lines":["t"],"id":127}],[{"start":{"row":29,"column":2},"end":{"row":29,"column":3},"action":"insert","lines":["a"],"id":128}],[{"start":{"row":29,"column":3},"end":{"row":29,"column":4},"action":"insert","lines":["d"],"id":129}],[{"start":{"row":29,"column":3},"end":{"row":29,"column":4},"action":"remove","lines":["d"],"id":130}],[{"start":{"row":29,"column":2},"end":{"row":29,"column":3},"action":"remove","lines":["a"],"id":131}],[{"start":{"row":29,"column":2},"end":{"row":29,"column":3},"action":"insert","lines":["f"],"id":132}],[{"start":{"row":29,"column":3},"end":{"row":29,"column":4},"action":"insert","lines":["o"],"id":133}],[{"start":{"row":29,"column":4},"end":{"row":29,"column":5},"action":"insert","lines":["n"],"id":134}],[{"start":{"row":29,"column":5},"end":{"row":29,"column":6},"action":"insert","lines":["t"],"id":135}],[{"start":{"row":29,"column":6},"end":{"row":29,"column":7},"action":"insert","lines":["I"],"id":136}],[{"start":{"row":29,"column":7},"end":{"row":29,"column":8},"action":"insert","lines":["n"],"id":137}],[{"start":{"row":29,"column":8},"end":{"row":29,"column":9},"action":"insert","lines":["c"],"id":139}],[{"start":{"row":29,"column":9},"end":{"row":29,"column":10},"action":"insert","lines":["r"],"id":140}],[{"start":{"row":29,"column":10},"end":{"row":29,"column":11},"action":"insert","lines":["e"],"id":141}],[{"start":{"row":29,"column":11},"end":{"row":29,"column":12},"action":"insert","lines":["a"],"id":142}],[{"start":{"row":29,"column":12},"end":{"row":29,"column":13},"action":"insert","lines":["s"],"id":143}],[{"start":{"row":29,"column":13},"end":{"row":29,"column":14},"action":"insert","lines":["e"],"id":144}],[{"start":{"row":29,"column":14},"end":{"row":29,"column":15},"action":"insert","lines":[":"],"id":145}],[{"start":{"row":29,"column":15},"end":{"row":29,"column":16},"action":"insert","lines":[" "],"id":146}],[{"start":{"row":29,"column":16},"end":{"row":29,"column":17},"action":"insert","lines":["f"],"id":147}],[{"start":{"row":29,"column":17},"end":{"row":29,"column":18},"action":"insert","lines":["u"],"id":148}],[{"start":{"row":29,"column":18},"end":{"row":29,"column":19},"action":"insert","lines":["n"],"id":149}],[{"start":{"row":29,"column":19},"end":{"row":29,"column":20},"action":"insert","lines":["c"],"id":150}],[{"start":{"row":29,"column":20},"end":{"row":29,"column":21},"action":"insert","lines":["t"],"id":151}],[{"start":{"row":29,"column":21},"end":{"row":29,"column":22},"action":"insert","lines":["i"],"id":152}],[{"start":{"row":29,"column":22},"end":{"row":29,"column":23},"action":"insert","lines":["o"],"id":153}],[{"start":{"row":29,"column":23},"end":{"row":29,"column":24},"action":"insert","lines":["n"],"id":154}],[{"start":{"row":29,"column":24},"end":{"row":29,"column":26},"action":"insert","lines":["()"],"id":155}],[{"start":{"row":29,"column":26},"end":{"row":29,"column":27},"action":"insert","lines":[" "],"id":156}],[{"start":{"row":29,"column":27},"end":{"row":29,"column":28},"action":"insert","lines":["P"],"id":157}],[{"start":{"row":29,"column":28},"end":{"row":29,"column":30},"action":"insert","lines":["  "],"id":158}],[{"start":{"row":29,"column":28},"end":{"row":29,"column":30},"action":"remove","lines":["  "],"id":159}],[{"start":{"row":29,"column":27},"end":{"row":29,"column":28},"action":"remove","lines":["P"],"id":160}],[{"start":{"row":29,"column":27},"end":{"row":29,"column":28},"action":"insert","lines":["{"],"id":161}],[{"start":{"row":29,"column":28},"end":{"row":29,"column":30},"action":"insert","lines":["  "],"id":162}],[{"start":{"row":29,"column":30},"end":{"row":29,"column":32},"action":"insert","lines":["  "],"id":163}],[{"start":{"row":29,"column":32},"end":{"row":29,"column":34},"action":"insert","lines":["  "],"id":164}],[{"start":{"row":29,"column":34},"end":{"row":29,"column":36},"action":"insert","lines":["  "],"id":165}],[{"start":{"row":29,"column":36},"end":{"row":29,"column":38},"action":"insert","lines":["  "],"id":166}],[{"start":{"row":29,"column":38},"end":{"row":29,"column":39},"action":"insert","lines":["t"],"id":167}],[{"start":{"row":29,"column":39},"end":{"row":29,"column":40},"action":"insert","lines":["h"],"id":168}],[{"start":{"row":29,"column":40},"end":{"row":29,"column":41},"action":"insert","lines":["i"],"id":169}],[{"start":{"row":29,"column":41},"end":{"row":29,"column":42},"action":"insert","lines":["s"],"id":170}],[{"start":{"row":29,"column":42},"end":{"row":29,"column":43},"action":"insert","lines":["P"],"id":171}],[{"start":{"row":29,"column":43},"end":{"row":29,"column":44},"action":"insert","lines":["r"],"id":172}],[{"start":{"row":29,"column":44},"end":{"row":29,"column":45},"action":"insert","lines":["o"],"id":173}],[{"start":{"row":29,"column":45},"end":{"row":29,"column":46},"action":"insert","lines":["d"],"id":174}],[{"start":{"row":29,"column":46},"end":{"row":29,"column":47},"action":"insert","lines":["u"],"id":175}],[{"start":{"row":29,"column":47},"end":{"row":29,"column":48},"action":"insert","lines":["c"],"id":176}],[{"start":{"row":29,"column":48},"end":{"row":29,"column":49},"action":"insert","lines":["t"],"id":177}],[{"start":{"row":29,"column":49},"end":{"row":29,"column":50},"action":"insert","lines":["."],"id":178}],[{"start":{"row":29,"column":50},"end":{"row":29,"column":51},"action":"insert","lines":["g"],"id":179}],[{"start":{"row":29,"column":50},"end":{"row":29,"column":51},"action":"remove","lines":["g"],"id":180}],[{"start":{"row":29,"column":50},"end":{"row":29,"column":51},"action":"insert","lines":["="],"id":181}],[{"start":{"row":29,"column":50},"end":{"row":29,"column":51},"action":"remove","lines":["="],"id":182}],[{"start":{"row":29,"column":50},"end":{"row":29,"column":51},"action":"insert","lines":["a"],"id":183}],[{"start":{"row":29,"column":51},"end":{"row":29,"column":52},"action":"insert","lines":["d"],"id":184}],[{"start":{"row":29,"column":52},"end":{"row":29,"column":53},"action":"insert","lines":["j"],"id":185}],[{"start":{"row":29,"column":53},"end":{"row":29,"column":54},"action":"insert","lines":["u"],"id":186}],[{"start":{"row":29,"column":54},"end":{"row":29,"column":55},"action":"insert","lines":["s"],"id":187}],[{"start":{"row":29,"column":55},"end":{"row":29,"column":56},"action":"insert","lines":["t"],"id":188}],[{"start":{"row":29,"column":56},"end":{"row":29,"column":57},"action":"insert","lines":["F"],"id":189}],[{"start":{"row":29,"column":57},"end":{"row":29,"column":58},"action":"insert","lines":["o"],"id":190}],[{"start":{"row":29,"column":58},"end":{"row":29,"column":59},"action":"insert","lines":["n"],"id":191}],[{"start":{"row":29,"column":59},"end":{"row":29,"column":60},"action":"insert","lines":["t"],"id":192}],[{"start":{"row":29,"column":60},"end":{"row":29,"column":61},"action":"insert","lines":["S"],"id":193}],[{"start":{"row":29,"column":61},"end":{"row":29,"column":62},"action":"insert","lines":["i"],"id":194}],[{"start":{"row":29,"column":62},"end":{"row":29,"column":63},"action":"insert","lines":["z"],"id":195}],[{"start":{"row":29,"column":63},"end":{"row":29,"column":64},"action":"insert","lines":["e"],"id":196}],[{"start":{"row":29,"column":64},"end":{"row":29,"column":66},"action":"insert","lines":["()"],"id":197}],[{"start":{"row":29,"column":65},"end":{"row":29,"column":66},"action":"insert","lines":["1"],"id":198}],[{"start":{"row":29,"column":66},"end":{"row":29,"column":67},"action":"insert","lines":["."],"id":199}],[{"start":{"row":29,"column":67},"end":{"row":29,"column":68},"action":"insert","lines":["0"],"id":200}],[{"start":{"row":29,"column":68},"end":{"row":29,"column":69},"action":"insert","lines":["5"],"id":201}],[{"start":{"row":29,"column":70},"end":{"row":29,"column":71},"action":"insert","lines":[";"],"id":202}],[{"start":{"row":29,"column":71},"end":{"row":29,"column":72},"action":"insert","lines":[" "],"id":203}],[{"start":{"row":29,"column":72},"end":{"row":29,"column":73},"action":"insert","lines":["{"],"id":204}],[{"start":{"row":29,"column":72},"end":{"row":29,"column":73},"action":"remove","lines":["{"],"id":205}],[{"start":{"row":29,"column":72},"end":{"row":29,"column":73},"action":"insert","lines":["}"],"id":206}],[{"start":{"row":29,"column":73},"end":{"row":29,"column":74},"action":"insert","lines":[","],"id":207}],[{"start":{"row":29,"column":2},"end":{"row":29,"column":3},"action":"insert","lines":["/"],"id":208}],[{"start":{"row":29,"column":3},"end":{"row":29,"column":4},"action":"insert","lines":["/"],"id":209}],[{"start":{"row":30,"column":3},"end":{"row":30,"column":4},"action":"remove","lines":[" "],"id":210}],[{"start":{"row":30,"column":2},"end":{"row":30,"column":3},"action":"remove","lines":["/"],"id":211}],[{"start":{"row":30,"column":1},"end":{"row":30,"column":2},"action":"remove","lines":["/"],"id":212}],[{"start":{"row":30,"column":1},"end":{"row":30,"column":2},"action":"insert","lines":[" "],"id":213}],[{"start":{"row":28,"column":80},"end":{"row":29,"column":76},"action":"remove","lines":["","  //fontIncrease: function() {          thisProduct.adjustFontSize(1.05); },"],"id":214}]]},"ace":{"folds":[],"scrolltop":1068,"scrollleft":0,"selection":{"start":{"row":74,"column":40},"end":{"row":74,"column":40},"isBackwards":false},"options":{"guessTabSize":true,"useWrapMode":false,"wrapToView":true},"firstLineState":{"row":147,"mode":"ace/mode/javascript"}},"timestamp":1439504654902}