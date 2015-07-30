var GuestView = BackboneRelativeView.extend({  
  className: 'input_container',
  initialize: function() {
    BackboneRelativeView.prototype.initialize.apply(this)
    this.listenTo(this.model, "change:name", this._renderName);
    this.listenTo(this.model, "remove", this.deleteGuest)
  },
  events: {
    "blur input": 'updateGuest',
    'focus input': 'clearGuest'
  },
  deleteGuest: function() {
  thisProduct.get("guests").remove(this.model);
  console.log("Deleting guest", this.model.get("name"))
    var that = this;
    this.$el.fadeOut(function() {
      that.remove();
    });
  },
  clearGuest: function() {
    if(this.model.get("name") == "Guest Name") this.$('input').val("")     
  },
  updateGuest: function() {
   var name = this.$('input').val()
   this.model.set("name", name)
  },
  _renderName: function() {
    this.$('input').val(this.model.get("name"))            
  },
  render: function() { 
    var html = '<input type="text" name="guest" value="' + 
      this.model.get("name") + 
      '"></input> <img src="/gfx/trash/delete96.svg" class="trash deselected" style="display:inline-block;width:13px;"/>'
    this.$el.html(html)
    return this;
  }
})
