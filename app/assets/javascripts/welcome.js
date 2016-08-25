$(function() {
  // init slideshow
  $('#FeaturedGallery').slick({
    'arrows': false,
    'autoplay': true,
    'autoplaySpeed': 5000,
    'dots': true
  });

  // For each .dyn-blur element, give it the dimensions
  // of the next element and the proper background offset
  // such that the blur effect is seamless with the background.
  // Make sure to do this after all other document modifications!
  $('.dyn-blur').each(function(i, elem) {
    var elem = $(elem),
        next = $(elem).next(),
        bgTopOffset = 0,
        height = 0
        topPosn = 0;

    if (next) {
      bgTopOffset = next.offset().top * -1; 
      height = next.innerHeight();
      topPosn = next.position().top;

      elem.css({
        'background-position-y': bgTopOffset,
        'height':                height,
        'top':                   topPosn
      });
    }
  });

});
