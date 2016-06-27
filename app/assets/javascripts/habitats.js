$(function() {
  var compiledTemplates = {};

  function makeLangsSelections() {
    var checkboxTemplateKey = 'lang-checkbox-template',
        compiledTemplate = compiledTemplates[checkboxTemplateKey],
        form = $('#new_habitat'),
        langsDynamicElem = $('#langs-dynamic'),
        spinner = form.find('.fa-spinner'),
        submit = form.find("input[type='submit']"),
        habitatId = $(this).val(),
        placesPart = window.location.pathname.match(/.*\/places\/\d*/)[0],
        url = placesPart + '/habitats/' +  habitatId + '/langs_with_content.json';

    langsDynamicElem.remove();

    if (!habitatId) return;

    spinner.removeClass('hide');
    submit.prop('disabled', true);

    $.getJSON(url, function(data) {
      spinner.addClass('hide');
      submit.prop('disabled', false);

      if (data.langs.length) {
        if (!compiledTemplate) {
          compiledTemplate = compiledTemplates[checkboxTemplateKey] = Handlebars.compile($('#lang-checkbox-template').html());
        }
        spinner.before($(compiledTemplates[checkboxTemplateKey](data)));
      }
    });
  }

  // Behavior
  $("input[name='habitat_to_copy_id']").change(makeLangsSelections);
});

