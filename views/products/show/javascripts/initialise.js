<script type="text/javascript">

$(function() {
  // Render javascripts
  <%= include models.js %>
  <%= include presenters.js %>
  <%= include ui_print_views.js %>
  <%= include views.js %>

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
        
  new StepView().render();
  new DownloadView({el: '#product_container', model: thisProduct}).render();
  new PrintView({el: '#per_8_page_print', model: thisProduct}).render();
  new UIPrintView({el: '#user_interface_print_view', model: thisProduct}).render();

  $('#ui_font_picker').fontPicker({fonts: casamiento_fonts, in_groups_of: 4})

  $('#send_to_print').click(function() {
      window.print();
  })

})
</script>