var ThemeView = Backbone.View.extend({
  tagName: 'li',
  events: {
      'click .delete': 'destroy'
  },
  destroy: function(e) {
      e.preventDefault();
      this.model.destroy();
      this.remove();  
  },
  render: function() {
      this.$el.html(this.model.get("name") + " | <span class='delete'>Delete</span>");
      return this;
  }
})

var ThemeAdminView = Backbone.View.extend({
  el: $('#themes_admin'),
  initialize: function() {
    this.collection.on("add", this.render, this);  
  },
  events: {
    'click input[type=submit]': 'addTheme'            
  },
  addTheme: function(e) {
    e.preventDefault();
    var name = this.$('input[name=new_theme]').val();
    var description = this.$('textarea[name=description]').val();
    this.collection.create({name: name, description: description}, { wait:true })
  },
  render: function() {
    this.$('#theme_list').empty();
    this.collection.forEach(function(theme) {
      this.$('#theme_list').append(new ThemeView({model:theme}).render().el)
    }, this)
     
    return this;
  }
})

// A view that renders a drop-down select menu from the models in a Backbone collection
// Inherit from this View and define attributes { name: name_of_select_form }
var SelectionView = Backbone.View.extend({
  initialize: function() {
    this.collection.on('add', this.render, this)  
  },
  tagName: "select",
  render: function() {
    this.$el.empty();
    this.collection.forEach(function(model) {
        var model = model.toJSON()
        this.$el.append("<option value='" + model._id + "'>" + model.name + "</option>")
    },this)
    return this;
  }
})

var ProductTypesView = SelectionView.extend({attributes: { name: "product_type"}}) 
var ThemesView = SelectionView.extend({attributes: { name: "theme"}})

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

var CurrentProductView = Backbone.View.CouchDB.extend({
  initialize: function() {
    this.model.on("destroy", this.remove, this) 
    this.model.on("sync", this.render, this)
    this.model.on("change:colour_1", this.updateAllBackgrounds, this)
    
    this.model.on("change:colour_2", this.updateAllBackgrounds, this)
    this.model.on("change:background-1", this.updateBackground, this) 
    this.model.on("change:background-2", this.updateBackground, this)             
    this.model.on("change:background-3", this.updateBackground, this) 
    this.model.on("change:background-4", this.updateBackground, this) 
    },
    updateAllBackgrounds: function(e, f,g) {
      for(att in e.changed) {
      
        if(att == "colour_2") {
       
      this.$('.background_container').css("background-color",  this.model.get(att))
       
      } else {
         this.$('.background_container div').css("background-color", this.model.get(att))
      }
      
  }

  },
  updateBackground: function(e, f,g) {
  
    for(att in e.changed) {
      var attach_number = att.split("-")[1]
      var element = "background_" + this.model.id + "_" + attach_number;
      this.$('#' + element + ' div').remove();
      
      var divs = this.model.get("background-" + attach_number);
      var compiled = _.template(divs);
      var divs = compiled({colour: this.model.get("colour_2")});
      this.$('#' +element).append(divs)       
    }
  },
  events: { 
    'click select[name=colour_1] option': 'selectColour',
    'click select[name=colour_2] option': 'selectColour',
    'click input[type=submit]': 'sendForm',
    'click .addmore': 'addMore',
    'click .delete': 'destroy',
    'blur .change_background': 'changeBackground'
  },
  selectColour: function(e) {
    var option = $(e.currentTarget);
    var parent = option.parent()
    this.model.set(parent.attr('name'), option.val())
  },
  changeBackground: function(e) {
    var id = $(e.currentTarget).attr('id');
    var val = $(e.currentTarget).val()
    var attachment = id.split("-")[2]
    this.model.set("background-" + attachment, val)
  },
  destroy: function() {
    this.model.destroy();  
  },
  addMore: function() {
    this.addAttachment();
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
  console.log($('#current_product_form').html())
    var result = Handlebars.compile($('#current_product_form').html())(modelToJSON);
    this.$el.html(result);
    
    // Select boxes for product and theme
    this.$('form').append(themes_view)
    this.$('form').append(product_types_view)
    
    
    // Render product images with coloured background divs
    this.model.attachments_order.forEach(function(attachment) {
    
      var divs = this.model.get("background-" + attachment);
      var compiled = _.template(divs);
      var divs = compiled({colour: this.model.get("colour_2")});
      
      // Render background-coloured image
      var result = Handlebars.compile($('#image_backgrounds').html(), {noEscape: true})({id: this.model.id, attachment: attachment, first_colour:this.model.get("colour_1"), divs: divs, background_html: this.model.get("background-"+attachment)});
    this.$el.append(result);
    }, this)
    
    // Build attachments
    this.$el.append("<table>")
    this.$el.append(this.buildAttachments({groupEl: 'tr'}))
    this.$el.append("</table>")
    this.$el.append("<a class='addmore'>Add more</a>")
    this.$el.append("<a class='delete'>Delete</a>" )
    return this;
  }
})