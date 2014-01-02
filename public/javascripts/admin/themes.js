var Theme = Backbone.Model.CouchDB.extend({
  toJSON: function() {
	var json = Backbone.Model.CouchDB.prototype.toJSON.apply(this, arguments)
	
	// Set the id to the value of theme_name with spaces replaced by underscores and all in lower case if not already been set
	// e.g. Birds of Paradise -> birds_of_paradise
	json._id = json._id || this.get("name").replace(/\s+/g, '_').toLowerCase();
	return json;
  }
})

var Themes = Backbone.Collection.extend({
  model: Theme,
  url: "/themes"
})

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
