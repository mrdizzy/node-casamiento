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
    cpv.render()
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
    cpv.render();
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
  el: '#cpv',
  initialize: function() {
    this.place_card_view = new PlaceCardView({model: this.model})
    this.model.on("sync", this.render, this)
    this.model.on("change:colours", this.renderColours, this) 
    this.model.on("change:background", this.renderBackground, this)
  },    
  events: { 
    'change input[name=svgupload]': 'prepareSVG',      
    'dizzy-cp:hoverColor': 'updateColours',  
    'click #add_second_colour': 'addSecondColour',
    'blur .change_background': 'updateBackground',
    'click input[type=submit]': 'sendForm',
    'click .addmore': 'addAttachment',
    "fontpicker:selected": "changeFont"
  },
  changeFont: function(e, font) {   
    this.model.set("font_size", 0.08)
    this.model.set("font", font)
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
  updateBackground: function(e) {  
    var $textarea = $(e.currentTarget),
      id = $textarea.data("id"),
      val = $textarea.val();
    this.model.set("background-" + id, val).trigger("change:background")
  },
  renderColours: function() {
    this.$('.colour_0').css("background-color", this.model.get("colours")[0])       
    this.$('.colour_1').css("background-color", this.model.get("colours")[1])
  },    
  renderBackground: function(e, f,g) {
    var changed_attributes = this.model.changedAttributes();
    for(var key in changed_attributes) {
      if(key.match(/background/)) 
        this.$('.' + key).html(changed_attributes[key]) 
    }
    this.renderColours();
  },
  addSecondColour: function() {
   var colours = this.model.get("colours");
   colours[1] = "#cd5c5c";
   this.render();
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
    modelToJSON.isNew = this.model.isNew();
    modelToJSON.divs = {}
    this.model.attachments_order.map(function(attachment) {
        modelToJSON.divs[attachment] = this.model.get("background-" + attachment)
    }, this)
    
    var html = Handlebars.template(templates["admin_current_product_form"])(modelToJSON); 
    
    this.$el.html(html);
    this.renderColours();
    
    var number_of_colours = this.model.get("colours").length;
    for(var i=0; i < number_of_colours; i++) {
      var $picker = $('<div class="picker"></div>')     
      this.$('#colour_picker').append($picker)
      $picker.colorPicker({width: this.$('#colour_picker').width(), index: i, default_color: this.model.get("colours")[i], colours_per_page: 10, listen_to: this.model})
    }
     this.$('#font_picker_wrapper').fontPicker({
      selected_font: this.model.get("font")
    });
   var place_card = this.place_card_view.render()
   this.$('#place_card').html(place_card.el)
   place_card._renderFontSize();
    // Build attachments
    var attachments = this.buildAttachments({groupEl: 'tr'})
    var table = $('<table></table>').append(attachments);
    this.$el.append(table)
    this.$el.append("<a class='addmore'>Add more</a>")
    return this;
  }
})

var PlaceCardView = Backbone.View.extend({
  className: 'place_card_view',
  initialize: function() {
    this.listenTo(this.model, 'change:font', this._renderFontFamily);
    this.listenTo(this.model, 'change:font_size', this._renderFontSize);
    this.listenTo(this.model, 'change:baseline', this._renderBaseline);
    this.units = "px"
    $(window).bind("resize", _.bind(this._renderFontSize, this));
  },  
  events: {
    'click .plus_font': 'increaseFont',
    'click .minus_font': 'decreaseFont',
    'click .up_baseline': 'upBaseline',
    'click .down_baseline': 'downBaseline'
  }, 
  increaseFont: function() {
    this.model.adjustFontSize(1.05) // percentage increase
  },
  decreaseFont: function() {
   this.model.adjustFontSize(0.95) // percentage decrease
  },
  upBaseline: function() {
    this.model.upBaseline();
  },
  downBaseline: function() {
    this.model.downBaseline();
  },  
  calculateFontSize: function() {
    var width = this.$el.width();
    this.font_size = width * this.model.get("font_size");
  },  
  calculateBaselineOffset: function() {
    var height =  this.$el.height();
    var baseline = (this.model.get("baseline") /100) * height;
    this.top_half_height = (height / 2) + baseline;
    this.bottom_half_height = (height / 2)  - baseline;
  },
  render: function() {     
    var compiled_template = Handlebars.template(templates["admin_place_card"]);
    var $template = $(compiled_template({
      font_family: this.model.get("font"),   
      background: this.model.get("background-5"),  
      product: this.model.get("_id")
    }));
  
    var colours = this.model.get("colours");
  
    for(var i=0; i < colours.length; i++) {
      $template.find('.colour_' + i).css("background-color", colours[i])
    }
    this.$el.html($template)
    appendFont(this.model.get("font"))
    return this;
  },
  _renderFontFamily: function() {    
    this.$('input').css('font-family', this.model.get("font"));
  },
  _renderBaseline: function() {
    this.calculateBaselineOffset();
    this.$('.spacer').css("height", this.top_half_height + this.units)
    this.$('input').css("height", this.bottom_half_height + this.units)
  },
  _renderFontSize: function() {
    this.calculateFontSize();
    this._renderBaseline();
    this.$('input').css('font-size', this.font_size + this.units);
  }
})

function appendFont(font) {
  $('head').append("<style type='text/css'> @font-face { font-family:'" + font + "'; src: url('/fonts/"+ font + ".eot?') format('eot'), url('/fonts/" + font + ".woff') format('woff'); }</style>");
}
   //var options_for_select = "";
   //default_tags.forEach(function(tag) {
   //    if(_.contains(tags, tag)) {
   //        options_for_select = options_for_select + "<option value='" + tag + "' selected='selected'>" + tag + "</option>";
   //    } else {
   //        options_for_select = options_for_select + "<option value='" + tag + "'>" + tag + "</option>";
   //    }
   //})
   
   
   
   