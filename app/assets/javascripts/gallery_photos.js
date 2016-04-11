$(function() {
  $('#gallery_photo_license_id').change(function(event) {
    $('.license_desc').each(function(i, v) {
      $(v).addClass('hide');
    });

    $(".license_desc[data-license-id='" + $(this).val() + "'").removeClass('hide');
  });
});
