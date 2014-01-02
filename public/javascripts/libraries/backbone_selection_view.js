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