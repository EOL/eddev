//= require template_renderer/template-renderer

$(function() {
  function setPreviewTopMargin() {
    var scrollTop = $(this).scrollTop()
      , $preview = $('#Preview')
      , $col = $('#LeftCol')
      , $colHead = $('#LeftColHeadBox')
      , colOffsetTop = $col.offset().top
      , colViewOffset = colOffsetTop - scrollTop
      , colHeadHeight = $colHead.outerHeight()
      , colHeight = $col.outerHeight()
      , innerColViewOffset = colViewOffset + colHeadHeight
      , previewHeight = $preview.outerHeight()
      , top
      ;

    if (innerColViewOffset < 0) {
      top = Math.min(colViewOffset * -1, colHeight - previewHeight);
    } else {
      top = colHeadHeight;
    }

    $preview.animate({
      top: top
    }, 50);
  }

  $(document).scroll(setPreviewTopMargin);
});
