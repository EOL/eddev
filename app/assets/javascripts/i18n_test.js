function changeUrlLang(e) {
  var select = $(this);
  window.location.replace(select.val());
}

$(document).on("page:change", function() {
  $("#url_lang").change(changeUrlLang);
});
