var compiledTemplates = {};

function makeLangsSelections() {
  var langsDynamicElem = $('#langs-dynamic');
  var form = $('#new_habitat');
  var spinner = form.find('.fa-spinner');
  var submit = form.find("input[type='submit']");
  var habitatId = $(this).val();
  var placesPart = window.location.pathname.match(/.*\/places\/\d*/)[0];
  var url = placesPart + '/habitats/' +  habitatId + '/langs_with_content.json';
  var checkboxTemplateKey = 'lang-checkbox-template';
  var compiledTemplate = compiledTemplates[checkboxTemplateKey];

  langsDynamicElem.remove();
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

$(function() {
  $("input[name='habitat_to_copy_id']").change(makeLangsSelections);
});
