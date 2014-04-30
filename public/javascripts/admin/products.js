var ProductTypeSelectionView = SelectionView.extend({attributes: { name: "product_type"}}) 
var ThemeSelectionView = SelectionView.extend({attributes: { name: "theme"}})


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var AttachView = Backbone.View.Attachment.extend({
  initialize: function() {
    this.model.on("change", this.render, this)
  },
  tagName: "td",
  className: "attachment",
  render: function() {
    this.$el.html(this.model.id + " - " + this.model.get("width") + "x" + this.model.get("height") + "<br/><img src='" + this.model.url() + "' width='120' height='90' />")
    return this;
  }
})


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Click on a product to select it, rendered by ProductsView below
////////////////////////////////////////////////////////////////
var ProductView = Backbone.View.extend({
  events: {
    'click': 'select',
    'click .destroy': 'delete'
  },
  // TODO: handle errors when destroying model on server
  delete: function() {
  var that = this;
  that.remove();
      this.model.destroy({success:function(model, response) {
          
      }})
  },
  // TODO: refactor to use events and an event listener when current product is changed
  select: function() {
  var svg = this.model.get("svg");
  if (svg) {
  svg = svg.replace('#6D9200','purple')
  this.model.set("svg", svg)
  }
    var cpv = new CurrentProductView({model:this.model, attachmentView: AttachView});
    $('#cpv').html(cpv.render().el)
  },
  render: function() {
    this.$el.html(this.model.get("_id") + " <span class='destroy'>destroy</span>");
    return this;
  }
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// A list of products--renders ProductView above for each product
/////////////////////////////////////////////////////////

var ProductsView = Backbone.View.extend({
  initialize: function() {
    this.collection.on("add", this.render, this)  
  },
  el: '#products',
  events: {
    'click #addnew': 'addNew'
  },
  addNew: function() {
    var product = new Product({colours: ["#000000"]});
    
    this.collection.add(product);
    var cpv = new CurrentProductView({model:product, attachmentView: AttachView});
    $('#cpv').html(cpv.render().el)   
  },
  render: function() {
    this.$el.empty();
    this.collection.forEach(function(product) {
      var productview = new ProductView({
        model: product
      }).render().el
    this.$el.append(productview);
    }, this) 
    this.$el.append("<a id='addnew'>Add new</a>")
    return this;
  }
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var BackgroundView = Backbone.View.extend({
  initialize: function(options) {
    this.attachment = options.attachment
    this.model.on("change:background-" + this.attachment, this.updateBackground, this)
    this.model.on("change:colours", this.updateColours, this) 
  },
  events: {
    'blur .change_background': 'changeBackground'
  },
  // This is called when the textarea box containing the divs that represent the second background colour is changed. 
  changeBackground: function(e) {
    var val = $(e.currentTarget).val()
    this.model.set("background-" + this.attachment, val)
  },
  updateColours: function() {
    this.$('.background_container').css("background-color",  this.model.get("colours")[0])       
    this.$('.background_container div:not(.nocolor)').css("background-color", this.model.get("colours")[1])
  },
  updateBackground: function(e, f,g) {
      this.$('div div').remove();
      var divs = this.model.get("background-" + this.attachment);
      var compiled = _.template(divs);
            var result = compiled({colour: this.model.get("colours")[1]});
      this.$('div').append(result)  
      this.$('div.visual_div').html(result)
  },
  render: function() {
    var attach_model = this.model.toJSON();
    attach_model.number_of_colours = this.model.get("colours").length
    attach_model.current_attachment = this.attachment;
    attach_model.url = "/products/" +  attach_model._id + "/attachments/medium-" + attach_model.current_attachment
    attach_model.divs = attach_model["background-" + this.attachment]
      // Render background-coloured image
    var result = Handlebars.compile($('#image_backgrounds').html(), {noEscape: true})(attach_model);
    this.$el.html(result)
    this.updateColours();
    return this
  }
})


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var CurrentProductView = Backbone.View.CouchDB.extend({
  initialize: function() {
    this.model.on("sync", this.render, this)
  },    
  events: { 
    'click input[type=submit]': 'sendForm',
    'click .addmore': 'addAttachment',
    'dizzy-cp:hoverColor .picker': 'selectColour'
  },
  selectColour: function(e, colour) {
     var index = $(e.currentTarget).index();
     var colours = this.model.get("colours");
     colours[index] = colour;
     console.log(colour)
     this.model.set("colours", colours).trigger("change:colours")
  },
  sendForm: function(e) {
    e.preventDefault();
    // Backbone.Syphon serializes a Backbone view into a JavaScript object. See:
    // https://github.com/derickbailey/backbone.syphon/
    this.model.set(Backbone.Syphon.serialize(this))
    this.model.save(this.model.attributes, {success: function(model, response, options) {
      console.log("Success:", response)
    }, 
    error: function(model, xhr, options) {
      console.log("error", model, xhr, options)
    }})
  },
  render: function() {
    var modelToJSON = this.model.toJSON();
    
    var result = Handlebars.compile($('#current_product_form').html())(modelToJSON);
    this.$el.html(result);
    var number_of_colours = this.model.get("colours").length;
    for(var i=0; i < number_of_colours; i++) {
        var picker = $('<div class="picker"></div>').colorPicker({default_color: this.model.get("colours")[i], colours_per_page: 32})
        this.$('#colour_picker').append(picker)
    }
    
    // Drop-down select-option menus for product and theme
    this.$('form').append(theme_selection_view).append(product_type_selection_view)
    
    // Render product images with coloured background divs
    // attachments_order is an array of the attachments in order [1,2,3]
    this.model.attachments_order.forEach(function(attachment) {
      var background_view = new BackgroundView({model: this.model, attachment: attachment})
      var result = background_view.render().el
      this.$el.append(result);
    }, this)
    
    // Build attachments
    var attachments = this.buildAttachments({groupEl: 'tr'})
    var table = $('<table></table>').append(attachments);
    this.$el.append(table)
    this.$el.append("<a class='addmore'>Add more</a>")
    return this;
  }
})