// Router
var AppRouter = Backbone.Router.extend({
  routes: {
    "preview_place_card": function() {
      coordinator_view.renderFlatPreview();
    },    
    "preview_place_card/colour0/:colour0": function(colour_0) {      
      thisProduct.updateColour(0, "#" + colour_0)
      coordinator_view.renderFlatPreview();
    },  
    "preview_place_card/c0/:colour0/c1/:colour1": function(colour_0, colour_1) {      
      thisProduct.updateColour(0, "#" + colour_0);
      thisProduct.updateColour(1, "#" + colour_1)
      coordinator_view.renderFlatPreview();
    },  
    "preview_place_card/c0/:colour0/c1/:colour1/f/:font": function(colour_0, colour_1, font) {      
      thisProduct.updateColour(0, "#" + colour_0);
      thisProduct.updateColour(1, "#" + colour_1)
      thisProduct.set("font", font)
      $.updateFont(font, {trigger: function(){}})
      coordinator_view.renderFlatPreview();
    },  
    "print": function() {
      coordinator_view.renderPrintView();      
    }, 
    "": function(actions) {  
      coordinator_view.renderHome();
      console.log("HOME ROUTE")
    }
  }
});
  