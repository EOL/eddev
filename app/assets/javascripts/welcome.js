$(function() {
  function fixImageTextBars() {
    $('.nav-item .bar').each(function(i, item) {
      console.log('scrollWidth: ' + item.scrollWidth);
      console.log('innerWidth: ' + $(item).innerWidth());
    });
  }

  function initSlideshow() {
    $('#Slideshow').slick({
      arrows: false,
      dots: true,
      //dotsClass: 'slideshow-dots'
    });
  }

  fixImageTextBars();
  initSlideshow();
});
