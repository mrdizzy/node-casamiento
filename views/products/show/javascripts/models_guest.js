var Guest = Backbone.Model.extend({ // rename PlaceCardBluePrint?
  defaults: {
    name:"Guest Name",
    baseline: (<%= product.baseline %> || 0),
    font_size: "<%= product.font_size %>"
  },
  adjustBaseline: function(amount) { this.set("baseline", this.get("baseline") + amount) },
  adjustFontSize: function(amount) { this.set("font_size", this.get("font_size") * amount) },
  
  // This method calculates how far up or down the guest name on
  // the place card should appear. It returns an object containing 
  // two heights, the bottom half and the top half, which are used to 
  // position the divs containing the guest name. We pass an ABSOLUTE width to this function and use a ratio to calculate its height
  calculateBaselineOffset: function(absolute_width) { 
    var height = (70.714285714285714285714285714286/100) * absolute_width;     
    var baseline = (this.get("baseline") /100) * height;
    var top_half_height = (height / 2) + baseline;
    var bottom_half_height = height - top_half_height // removed - 1;
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
    if (thisProduct.get("browser") == "ipad") {
      var result = { width:120.75, height: 85.3875 }
    } else {
      var result = { width: 105, height: 74.25 }
    }    
    var baseline = (this.get("baseline") /100) * result.height;
    result.name = this.get("name");
    result.font = thisProduct.get("font");
    result.font_size = result.width * this.get("font_size");
    result.margin_top = (result.height /2) + baseline;
    result.guest_height = result.height - result.margin_top // Removed (- 1) from this calculation
    return result;
  }
})

var Guests = Backbone.Collection.extend({
//================================================================================
  initialize: function() {
    this.on("change", this.saveGuests)
  },
  saveGuests: function() { // Change to pluck?
    var guests = this.map(function(guest) {
      return { name: guest.get("name") }
    })
    localStorage.setItem("guests", JSON.stringify(guests));
  },
  printPresenter: function() {
    return {
      groups: inGroupsOf(this.invoke('printPresenter'), thisProduct.get("per_page"))
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