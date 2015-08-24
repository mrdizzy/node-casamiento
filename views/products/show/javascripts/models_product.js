var Product = Backbone.Model.extend({
////////////////////////////////////////////////////////////////
  urlRoot: '/products',
  idAttribute: "_id",
  localStorage: new Backbone.LocalStorage("CasamientoProducts"),
  defaults: {
      font_size: 1,
      guests: new Guests([{},{},{},{},{},{},{},{}]),
      price: 0.10,
      weight: 200,
      cutting_marks: true,
      per_page: 3
  },
  quantity: function() {
   return this.get("guests").length
  },
  makePurchase: function() {    
    if (this.get("quantity") > 7) {
      $.form('/payments', { 
        "object": JSON.stringify(this.toJSON()),
        "L_PAYMENTREQUEST_0_AMT0": this.get("total") / this.quantity(),
        "PAYMENTREQUEST_0_AMT": this.get("total"), 
        "L_PAYMENTREQUEST_0_QTY0": this.quantity(), 
        "L_PAYMENTREQUEST_0_NAME0": this.get("name"), 
        "L_PAYMENTREQUEST_0_DESC0": "Place cards" 
      }).submit();  
    } else {
      var price_each  = this.get("total") / 8;
      var qty = this.quantity();
      var place_cards_total = price_each * this.quantity();
      var minimum_charge = this.get("total") - place_cards_total;
     $.form('/payments', { 
      "object": JSON.stringify(this.toJSON()),
      "L_PAYMENTREQUEST_0_AMT0": price_each,
      "PAYMENTREQUEST_0_AMT": this.get("total"), 
      "L_PAYMENTREQUEST_0_QTY0":this.quantity(), 
      "L_PAYMENTREQUEST_0_NAME0": this.get("name"), 
      "L_PAYMENTREQUEST_0_DESC0": "Place cards",
      "L_PAYMENTREQUEST_0_AMT1": minimum_charge, 
      "L_PAYMENTREQUEST_0_QTY1": 1, 
      "L_PAYMENTREQUEST_0_NAME1": "Charge",
      "L_PAYMENTREQUEST_0_DESC1": "Minimum handling charge" 
    }).submit();  
    }
  },
  initialize: function() {  
    this.calculateUserAgent();
    this.calculatePrice();
    this.guests = this.get("guests")
    this.on("change:weight", this.calculatePrice)
    this.on("change:font", this.saveProduct)
    this.on("change:weight", this.saveProduct)
    this.on("change:colours", this.saveProduct)   
    this.listenTo(this.guests, "change", this.saveGuests)    
    this.listenTo(this.guests, "add", this.saveGuests)    
    this.listenTo(this.guests, "add", this.calculatePrice)
    this.listenTo(this.guests, "remove", this.saveGuests)
    this.listenTo(this.guests, "remove",this.calculatePrice)
    this.listenTo(this.guests, "reset", this.calculatePrice)
    this.listenTo(this.guests, "addMultiple", this.calculatePrice)
    this.listenTo(this.guests, "removeMultiple", this.calculatePrice)
  },
  resetFont: function() {
    this.guests.trigger("resetFont", this.get("baseline"), this.get("font_size"))
  },
  updateColour: function(index, colour) {
    var colours = this.get("colours");
    colours[index] = colour;
    this.set("colours", colours).trigger("change:colours")    
    $('.colour_0').css("background-color", this.get("colours")[0])   
    $('.colour_1').css("background-color", this.get("colours")[1])  
  },
  calculatePrice: function() {     
    var price, 
      quantity = this.quantity(),
      total;
    if(quantity >7 && quantity < 17) { price = 0.50 }
    else if (quantity > 15 && quantity < 25) { price = 0.40 }
    else if (quantity > 23 && quantity < 33) { price = 0.35 }
    else if (quantity > 31 && quantity < 41) { price = 0.34 }
    else if (quantity > 39 && quantity < 49) { price = 0.33 }
    else if (quantity > 47 && quantity < 57) { price = 0.32 }
    else if (quantity > 55 && quantity < 65) { price = 0.31 }
    else if (quantity > 63 && quantity < 73) { price = 0.30 }
    else if (quantity > 71 && quantity < 81) { price = 0.29 }
    else if (quantity > 79 && quantity < 89) { price = 0.28 }
    else if (quantity > 87 && quantity < 97) { price = 0.27 }
    else if (quantity > 95) { price = 0.26 }
    if (this.get("weight") == 300) {
      price = price + 0.05;
    }
    if (quantity < 8) { 
      total = 0.50 * 8
    } else {  
      total = price * quantity;  
    }
    total = total.toFixed(2);
    split_total = total.toString().split(".")   
    this.set("pounds",split_total[0]).set("pence", split_total[1]).set("total", total)    
  },
  toggleCuttingMarks: function() {
    var cutting_marks = this.get("cutting_marks") ? false : true;
    this.set("cutting_marks", cutting_marks)
  },
  calculateUserAgent: function() {
    if(navigator.userAgent.match(/Chrome/i) != null) {
      this.set("browser", "chrome") 
    } else if(navigator.userAgent.match(/firefox/i) != null) {
      this.set("browser", "firefox")
    } else if (navigator.userAgent.match(/iPad/i) != null) {
      this.set("browser", "ipad")
    }
  },
  shareURL: function() {
    var url = "http://www.casamiento.co.uk/products/" +
      this.id + "/#preview_place_card/c0/" + this.get("colours")[0].substr(1);
    if (this.get("colours")[1]) {
      return (url + "/c1/" + this.get("colours")[1].substr(1) + "/font/" + this.get("font"))  
    } else {
      return (url + "/font/" + this.get("font"))  
    }
  },
  saveProduct:  _.debounce(function() { this.save() },1000),
  saveGuests:   _.debounce(function() { this.save({guests: this.guests}) }, 500),
  parse: function(response) {
    if(response.guests && this.guests) {
      this.guests.reset(response.guests)
      delete response.guests;
    } else if (response.guests){
      response.guests = new Guests(response.guests, {silent:true})
    }
    return response;
  },
  svgURL: function() { return "/svg/" + this.get("_id") + "/" + this.hex(); },
  hex: function() { // This provides a URL for calling the /svg function with the appropriate hex values
    var monochromatic = this.get("monochromatic"),
      colour_0 = this.get("colours")[0].substring(1) // remove hash from #000000

    if(monochromatic) { // Handle shades of grey
      var first_shade = monochromatic[0]
      var rgb = $('.colour_0').css("background-color");
      var hex = this._rgb_to_hex(rgb, first_shade/100)
      return(colour_0 + "_" + hex.substring(1));
    } 
    if(this.get("colours").length == 2) {
      return(colour_0 + "_" + thisProduct.get("colours")[1].substring(1));
    }
    return(colour_0)
  },
  // Designs can have colours that are a darker shade of a main colour. This is implemented
  // using a transparent PNG that has a black tint (100% pure black that has an opacity of between
  // 1% and 99%). In order to translate the colour to an RBG value so that we can process the SVG
  // file, we must dim the R, G and B value in the RGB colour by the percentage of the tint.
  // We then convert it back to hex so that the svg URL can be called and the file processed
  _rgb_to_hex: function(rgb, percentage){
    rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    rgb[1] = rgb[1] - (percentage * rgb[1]);
    rgb[2] = rgb[2] - (percentage * rgb[2]);
    rgb[3] = rgb[3] - (percentage * rgb[3]);

    return (rgb && rgb.length === 4) ? "#" +
      ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
      ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
      ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
  },
  stale: ['attachments_order', 'baseline', 'pence', 'pounds', 'font_size', 'per_page', 'cutting_marks', 'browser'],
  toJSON: function() { return _.omit(this.attributes, this.stale); }
});
