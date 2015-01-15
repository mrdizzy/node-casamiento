var Guest = Backbone.Model.extend({
////////////////////////////////////////////////////////////////
  defaults: {
    name: "Guest Name",
    baseline: (<%= product.baseline %> || 0),
    font_size: "<%= product.font_size %>"
  },
  adjustBaseline: function(amount) {
    this.set("baseline", this.get("baseline") + amount)
  },
  adjustFontSize: function(amount) {
    this.set("font_size", this.get("font_size") * amount)
  },
  calculateBaselineOffset: function(absolute_width) { 
    var height = (70.714285714285714285714285714286/100) * absolute_width;     
    var baseline = (this.get("baseline") /100) * height;
    var top_half_height = (height / 2) + baseline;
    var bottom_half_height = height - top_half_height - 1;
    return { top_half: top_half_height, bottom_half: bottom_half_height }
  },  
  presenter: function(absolute_width) {
    var baselines = this.calculateBaselineOffset(absolute_width)
    return {
      font_family: thisProduct.get("font"),   
      baseline_top: baselines.top_half,
      baseline_bottom: baselines.bottom_half,
      font_size: absolute_width * this.get("font_size"),
      background: thisProduct.get("background-5"),  
      product: thisProduct.get("_id"),
      name: this.get("name")
    } 
  },
  printPresenter: function() {
    if(navigator.userAgent.match(/Chrome|firefox/i) != null) var result = { width: 105, height: 74.25 }
    if (navigator.userAgent.match(/iPad/i) != null) var result = { width:120.75, height: 85.3875 }
    
    var baseline = (this.get("baseline") /100) * result.height;
    result.name = this.get("name");
    result.font = thisProduct.get("font");
    result.font_size = result.width * this.get("font_size");
    result.margin_top = (result.height /2) + baseline;
    result.guest_height = result.height - result.margin_top - 1
    return result;
  }
})

var Guests = Backbone.Collection.extend({
  initialize: function() {
    this.on("change", this.saveGuests)
  },
  saveGuests: function() {
    var guests = this.map(function(guest) {
      return { name: guest.get("name") }
    })
    localStorage.setItem("guests", JSON.stringify(guests));
  },
  printPresenter: function() {
    var result = this.invoke('printPresenter');

    return {
      ipad: thisProduct.get("ipad"),
      group_class: thisProduct.get("group_class"),
      per_page: thisProduct.get("per_page"),
      groups: inGroupsOf(result, thisProduct.get("per_page"))
    }
  },
  resetFont: function() {
    this.invoke('set', {
      font_size: thisProduct.get("font_size"), 
      baseline: thisProduct.get("baseline")
    })
  },
  model: Guest,
  url: '/guests'
})