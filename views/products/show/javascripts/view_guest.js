var GuestView = BackboneRelativeView.extend({  
  className: 'input_container',
  initialize: function() {
    BackboneRelativeView.prototype.initialize.apply(this)
    this.listenTo(this.model, "change:name", this._renderName);
  },
  events: {
    "blur input": 'updateGuest',
    'focus input': 'clearGuest',
    'click .trash': 'deleteGuest'
  },
  deleteGuest: function() {
    this.model.destroy();
    var that = this;
    thisProduct.set("quantity", thisProduct.get("quantity") -1)  
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
