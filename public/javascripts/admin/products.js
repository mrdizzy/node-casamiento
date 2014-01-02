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
var ProductView = Backbone.View.extend({
  events: {
    'click': 'select'
  },
  select: function() {
    var cpv = new CurrentProductView({model:this.model, attachmentView: AttachView});
    $('#cpv').html(cpv.render().el)
  },
  render: function() {
    this.$el.html(this.model.get("_id"));
    return this;
  }
});



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var ProductsView = Backbone.View.extend({
  initialize: function() {
    this.collection.on("add", this.render, this)  
  },
  el: '#products',
  events: {
    'click #addnew': 'addNew'
  },
  addNew: function() {
    var product = new Product();
    
    this.collection.add(product);
    var cpv = new CurrentProductView({model:product, attachmentView: AttachView});
    console.log("done")
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
    this.model.on("change:colour_1", this.updateFirstColour, this)    
    this.model.on("change:colour_2", this.updateSecondColour, this)
  },
  events: {
    'blur .change_background': 'changeBackground'
  },

  // This is called when the textarea box containing the divs that represent the second background colour is changed. 
  changeBackground: function(e) {
    var val = $(e.currentTarget).val()
    this.model.set("background-" + this.attachment, val)
  },
  
  updateFirstColour: function(e, f,g) {
    this.$('.background_container').css("background-color",  this.model.get("colour_1"))       
  },
  updateSecondColour: function() {
    this.$('.background_container div').css("background-color", this.model.get("colour_2"))
  },
  updateBackground: function(e, f,g) {
      this.$('div div').remove();
      var divs = $(this.model.get("background-" + this.attachment));
      divs.css('background-color', this.model.get("colour_2"))
      this.$('div').append(divs)  
  },
  render: function() {
    var attach_model = this.model.toJSON();
    
    attach_model.current_attachment = this.attachment;
    attach_model.url = "/products/" +  attach_model._id + "/attachments/medium-" + attach_model.current_attachment
    attach_model.divs = attach_model["background-" + this.attachment]
      // Render background-coloured image
    var result = Handlebars.compile($('#image_backgrounds').html(), {noEscape: true})(attach_model);
    this.$el.html(result)
      //update colours
      this.$('.first_colour').css('background-color', this.model.get("colour_1"))
    this.$('.background_container div').css("background-color", this.model.get("colour_2"))
      return this
  }
})



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var CurrentProductView = Backbone.View.CouchDB.extend({
  initialize: function() {
    this.model.on("destroy", this.remove, this) 
    this.model.on("sync", this.render, this)
    this.model.on("change:number_of_colours", this.render, this)
  },    
  events: { 
    'click select[name=colour_1] option': 'selectColour',
    'click select[name=colour_2] option': 'selectColour',
    'click input[type=submit]': 'sendForm',
    'blur input[name=number_of_colours]': 'changeNumberOfColours',
    'click .addmore': 'addAttachment',
    'click .delete': 'destroy',
  },
  // When the number of colours in a design are changed, this causes the current product
  // view to be re-rendered. If there is only one colour in the design, there is no need
  // to create and render background divs for the second colour, and there is only 
  // one drop-down colour-select menu. 
  
  // TODO: Stop entire view from re-rendering, only re-render the colour drop-down selection
  // boxes and the attachments
  changeNumberOfColours: function(e) {  
    this.model.set(Backbone.Syphon.serialize(this))
  },
  selectColour: function(e) {
    var option = $(e.currentTarget);
    var parent = option.parent() // name of the select form, ie the colour to change 
    this.model.set(parent.attr('name'), option.val())
  },
  destroy: function() {
    this.model.destroy();  
  },
  sendForm: function(e) {
    e.preventDefault();
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
    modelToJSON.hex_colours = colourList;
    var result = Handlebars.compile($('#current_product_form').html())(modelToJSON);
    this.$el.html(result);
    
    // Select boxes for product and theme
    this.$('form').append(theme_selection_view)
    this.$('form').append(product_type_selection_view)
    
    // Render product images with coloured background divs
    this.model.attachments_order.forEach(function(attachment) {
      var background_view = new BackgroundView({model: this.model, attachment: attachment})
      var result = background_view.render().el
      this.$el.append(result);
    }, this)
    
    // Build attachments
    this.$el.append("<table>" + this.buildAttachments({groupEl: 'tr'}) + "</table>")
    this.$el.append("<a class='addmore'>Add more</a>")
    this.$el.append("<a class='delete'>Delete</a>" )
    return this;
  }
})