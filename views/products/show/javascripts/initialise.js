<script type="text/javascript">
$(function() {
  // Render javascripts
  <%= include models.js %>  
  <%= include views.js %>
  <%= include ui_print_views.js %>

  // Initialize templates
  var templates = {}
  <% templates.forEach(function(template) { %>
    templates["<%= template.name %>"] = <%- template.template %>;
  <% }) %>

  // Setup and initialization
  var thisProduct = new Product(<%- JSON.stringify(product) %>),
    casamiento_fonts = <%- JSON.stringify(fonts) %>,
    object_fonts = {};
    casamiento_fonts.forEach(function(obj) {
      object_fonts[obj[0]] = obj[1];
    })
    thisProduct.set("font_size", object_fonts[thisProduct.get("font")])
        
  new StepView().render();
  new DownloadView({el: '#product_container', model: thisProduct});
 // new PrintView({el: '#per_8_page_print', model: thisProduct}).render();

})
</script>