function changeUrlLang(event) {
  event.preventDefault();
  window.location.replace($(this).find("select").val());
}

function changeUserLang(event) {
  event.preventDefault();
  window.location.replace("/i18ntest?user_lang=" + $(this).find("select").val());
}

$(document).on("page:change", function() {
  $("#url_lang").submit(changeUrlLang);
  $("#user_lang").submit(changeUserLang);
});
