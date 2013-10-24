// Prevent the JavaScript template delimiters interfering with the node express delimiters
_.templateSettings = {
  interpolate : /\%\%(.+?)\%\%/g,
  evaluate: /\%\-(.+?)\-\%/g
};

var Product = Backbone.Model.extend({});
var Items = Backbone.Collection.extend({});

// Model representing a cart

var Cart = Backbone.Model.extend({
  idAttribute: "_id",
  // Sets a context so we know which item we are editing/changing
  setContext: function(current_item) {
    this.context = current_item;
  },
  setMonogram: function(monogram) {
    this.context.set("monogram", monogram)      
  },
  initialize: function() {
    this.listenTo(this.get("items"), "add", this.updateCart)     
    this.listenTo(this.get("items"), "change", this.updateCart)  
    this.saving = 0;
  },
  // To update the cart we need to check if it is currently being 
  // saved, if so we need to wait for saving to complete before trying
  // to save it again
  updateCart: function(event) {
    if (this.saving > 0) {
      this.saving = this.saving + 1;
    } else {
      this.saving = this.saving + 1;
      this.doSave();
    }
  },
  doSave: function() {
    var that = this;
    this.save(null, {
      error: function() {  }, 
      success: function() { 
      
      that.saving = that.saving - 1;
        if(that.saving > 0) {
          that.doSave();
        }
      }
    })
  },
  defaults: {
    items: new Items()      
  },
  parse: function(response, options) {
    response.items = new Items(response.items);
    return response;
  },
  urlRoot: '/cart'
});

////////////////////////
///////// CART ITEM VIEW
////////////////////////

var CartItemView = Backbone.View.extend({
    initialize: function() {
    _.bindAll(this, 'render', 'renderQuantity', 'renderTotal', 'renderMonogram', 'calculatePrice', 'renderGuests', 'renderColour')
    this.model.on("change:quantity", this.renderQuantity)  
    this.model.on("change:quantity", this.calculatePrice) 
    this.model.on("change:quantity", this.renderGuests)  
    this.model.on("change:colour", this.renderColour)
    this.model.on("change:total", this.renderTotal)  
    this.model.on("change:texture", this.calculatePrice)
    this.model.on("change:monogram", this.renderMonogram) 
  },
  render: function() {
    var item_table_template = $('#cart_item_table').html();
    var compiled = _.template(item_table_template);
    var item_html = compiled(this.model.toJSON());
    this.$el.html(item_html)
    var that = this;
    this.$('.noUiSlider').noUiSlider({
        range: [10, 200]
       ,start: that.model.get("quantity")
       ,step: 5,
       slide: function(input) {
        that.$('#qty').html(that.$('.noUiSlider').val())
       },
       handles: 1
    });
    this.$('.noUiSlider a div').click(function() {
      that.model.set("quantity", that.$('.noUiSlider').val())
    })
    this.renderColour();
    this.calculatePrice()
    this.renderTotal();
    this.renderGuests();
    return this;
  },
  renderColour: function() {
  this.$('.colour_0').css("background-color", this.model.get("colours")[0])
  },
  renderMonogram: function() {
      this.$('.monogram_image').attr("src", "/gfx/m/" + this.model.get("monogram") + ".png")
  },
  renderTotal: function() {
  var total = this.model.get("total");
  var ary = total.toString().split(".");
  var pounds = ary[0];
  var dec = ary[1]
      this.$('span.pound').text(pounds);
      this.$('span.dec').text("." + dec);
  },
  renderGuests: function() {
      var html = "<table>";
      var lists = _.groupBy(this.model.get("guests"), function(a, b){
        return Math.floor(b/3);
});
    lists = _.toArray(lists); //Added this to convert the returned object to an array.
      var i = 0;
      _.forEach(lists, function(row) {
        html = html + "<tr>"
        _.forEach(row, function(guest) {
          html = html + '<td><input data-name="' + i + '" class="guest_name" type="text" style="display:block;font:normal 1.2em \'OS Light Italic\';text-align:left;margin:0;border:0;width:100%;" value="' + (guest ? guest : "&hellip;") + '"></input></td>'
          i++;
        })
    html = html + "</tr>"
     })
     html = html + "</table>"
      this.$('.guests').html(html)
  },
  renderQuantity: function() {
    this.$('#qty').html(this.model.get("quantity"))
  },
 
  calculatePrice: function() {
    var price = this.model.get("price") * this.model.get("quantity")
    var texture = this.model.get("texture");
    if(texture == "hammer") {
      price = ((10/100) * price) + price
    } else if (texture == "pearl") {
      price = ((15/100) * price) + price
    }
    var price = (price).toFixed(2)
    this.model.set("total", price)
  },
})

////////////////////////
///////////// ITEM VIEW 
////////////////////////
var ItemView = Backbone.View.extend({
  tagName: "tr",
  events: {
    "mouseenter .tooltip-select": "showTooltip",
    "mouseleave .tooltip-select": "closeTooltip",
    "mouseenter .a_colour": "updateColour",
   
  },
  selectFile: function(e) {
      alert('change')
  },
  
 
  selectMonogram: function(e) {
      if($(e.currentTarget).val() == "logo") {
      $('.monogram_image').slideUp();
     this.$('.selectedFile').click();
     } else {
       $('.monogram_image').slideDown();
     }
  },
  showTooltip: function(e) {
    var which = $(e.currentTarget).data("tooltip")
          $('.' + which).show()
  },
  closeTooltip: function(e) {
       var which = $(e.currentTarget).data("tooltip")
          $('.' + which).hide();
  },

  updateGuestName: function(e) {
    var currentTarget = $(e.currentTarget);
    var id = currentTarget.data("name");
    var name = $(e.currentTarget).val();
    var guests = this.model.get("guests");
    guests[id] = name;
    this.model.set("guests", guests)
    
    this.model.trigger("change")
  },
  changeTexture: function(e) {
    var currentTarget = $(e.currentTarget);
    $('.texture').removeClass("selected")
    currentTarget.toggleClass("selected");  
    this.model.set("texture", currentTarget.data("texture"))
  },
  changeMonogram: function() {
    cart.setContext(this.model)    
    $('#cart').fadeOut(function() {
      $('#monograms').fadeIn()
   });
  },
  render: function() {
    var item_template = $('#cart_item').html();
    var compiled = _.template(item_template);
    var item_html = compiled(this.model.toJSON());
    
    this.$el.html(item_html);
    var cart_item_view = new CartItemView({model: this.model}).render().el
    
    $(cart_item_view).appendTo(this.$('td.second_col'));
    
    return this;
  }
});

///////////////////
//// ITEMS VIEW
//////////////////

// View listing the items in the cart, delegates to ItemView
var ItemsView = Backbone.View.extend({
  tagName: "table",
  attributes: { style: "border-collapse:collapse;border:1px dotted grey" },
  initialize: function() {
          this.listenTo(this.collection, "add", this.render)
          //this.listenTo(this.collection, "change", this.render)
  },
  render: function() {
     this.$el.empty();    
     var header = $('#cart_header').html();
     this.$el.html(header);
     this.collection.forEach(function(item) {
     
           this.$el.append(new ItemView({model: item}).render().el)
           this.$el.append("<tr>" + $('#break').html() + "</tr>")
     }, this);
      this.$el.append("</table>");
     return this;
  }
});

var PanelView = Backbone.View.extend({
  el: $('#product_page'),
  showCart: function() {
    $('#product_page_genesis').fadeOut();
    $('#buy').fadeOut();
    $('#nav').fadeOut();
    $('#product_page_genesis').fadeOut();
    $('#product_page').fadeOut(function() {
      $('#cart_page').fadeIn();
    })
  }
})

/////////////////////
//// MONOGRAM VIEW
////////////////////

var MonogramView = Backbone.View.extend({
  el: $('#monograms'),
  events: {
          "click img": "selectMonogram"
  },
  selectMonogram: function(event) {
    var monogram = $(event.target).attr('id');
    var monogram_id = monogram.split("_")[1]
    cart.setMonogram(monogram_id)
    $('#monograms').fadeOut(function() {
      $('#cart').fadeIn()
    });
  }
})

/*var BuyButtonView = Backbone.View.extend({
  initialize: function() {
    this.setElement($('#buy'))
  },
  events: { 
    "click": "addToCart"
  },
  addToCart: function() {
    cart.get("items").add(thisProduct)
    pv.showCart();
  }
})*/

var ProductRouter = Backbone.Router.extend({
  routes: {
    "monograms": "chooseMonogram"
  }
});
