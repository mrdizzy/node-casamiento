var AttachView = Backbone.View.Attachment.extend({
  initialize: function() {
    if(this.model) 
      this.model.on("change", this.render, this)
  },
  tagName: "td",
  className: "attachment",
  render: function() {
    if(this.model) {
        this.$el.html(this.model.id + " - " + this.model.get("width") + "x" + this.model.get("height") + "<br/><img src='" + this.model.url() + "' width='120' height='90' />")
    } else {
        this.$el.html("<div style='width:120px;height:90px;border:1px solid black;display:inline-block;'></div>")
    }
    return this;
  }
})

var ProductView = Backbone.View.extend({
  events: {
    'click': 'select',
    'click .destroy': 'delete'
  },
  // TODO: handle errors when destroying model on server
  delete: function() {
    this.remove();
    this.model.destroy({success:function(model, response) {
    }})
  },
  // TODO: refactor to use events and an event listener when current product is changed
  select: function() {
    var cpv = new CurrentProductView({model:this.model, attachmentView: AttachView});
    $('#cpv').html(cpv.render().el)
  },
  render: function() {
    this.$el.html(this.model.get("_id") + " | <span class='destroy'>destroy</span>");
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
    var product = new Product({colours: ["#23297a"]});
    
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
    this.$el.append("<p><a id='addnew'>Add new</a></p>")
    return this;
  }
});

// SELECTED PRODUCT
var CurrentProductView = Backbone.View.CouchDB.extend({
  initialize: function() {
    this.model.on("sync", this.render, this)
    this.model.on("change:colours", this.renderColours, this) 
    this.model.on("change:background", this.renderBackground, this)
  },    
  events: { 
    'change input[name=svgupload]': 'prepareSVG',      
    'dizzy-cp:hoverColor .picker': 'updateColours',  
    'blur .change_background': 'updateBackground',
    'click input[type=submit]': 'sendForm',
    'click .addmore': 'addAttachment'
  },
  prepareSVG: function(e) {
   var that = this,
   file = e.currentTarget.files[0],
   reader  = new FileReader();
    
   reader.onload = function() {
      var data = reader.result.split(",")[1];
      that.model.set("svg", data)
    }

    reader.readAsDataURL(file);
  },
  updateColours: function(e, colour) {
     var index = $(e.currentTarget).index();
     var colours = this.model.get("colours");
     colours[index] = colour;
     this.model.set("colours", colours).trigger("change:colours")
  },  
  renderColours: function() {
    this.$('.colour_0').css("background-color", this.model.get("colours")[0])       
    this.$('.colour_1').css("background-color", this.model.get("colours")[1])
  },    
  updateBackground: function(e) {  
    var $textarea = $(e.currentTarget),
      id = $textarea.data("id"),
      val = $textarea.val();
    this.model.set("background-" + id, val).trigger("change:background")
  },
  renderBackground: function(e, f,g) {
    var changed_attributes = this.model.changedAttributes();
    for(var key in changed_attributes) {
      if(key.match(/background/)) 
        this.$('.' + key).html(changed_attributes[key]) 
    }
    this.renderColours();
  },
  sendForm: function(e) {
    e.preventDefault();
    // Backbone.Syphon serializes a Backbone view into a JavaScript object. See:
    // https://github.com/derickbailey/backbone.syphon/
    var serialized = Backbone.Syphon.serialize(this);
    //serialized.tags.sort();
    this.model.set(serialized)
    this.model.save(this.model.attributes, {
      success: function(model, response, options) {
        console.log("Success:", response)
      }, 
      error: function(model, xhr, options) {
        console.log("error", model, xhr, options)
      }
    })
  },
  render: function() {
    var modelToJSON = this.model.toJSON();   
    modelToJSON.divs = {}
    this.model.attachments_order.map(function(attachment) {
        modelToJSON.divs[attachment] = this.model.get("background-" + attachment)
    }, this)
    
    var html = Handlebars.template(templates["admin_current_product_form"])(modelToJSON); 
    
    this.$el.html(html);
    this.renderColours();
    
    var number_of_colours = this.model.get("colours").length;
    for(var i=0; i < number_of_colours; i++) {
        var picker = $('<div class="picker"></div>').colorPicker({default_color: this.model.get("colours")[i], colours_per_page: 32})
        this.$('#colour_picker').append(picker)
    }
    
    // Build attachments
    var attachments = this.buildAttachments({groupEl: 'tr'})
    var table = $('<table></table>').append(attachments);
    this.$el.append(table)
    this.$el.append("<a class='addmore'>Add more</a>")
    return this;
  }
})

   //var options_for_select = "";
   //default_tags.forEach(function(tag) {
   //    if(_.contains(tags, tag)) {
   //        options_for_select = options_for_select + "<option value='" + tag + "' selected='selected'>" + tag + "</option>";
   //    } else {
   //        options_for_select = options_for_select + "<option value='" + tag + "'>" + tag + "</option>";
   //    }
   //})