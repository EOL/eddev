$(function() {
  function initSlideshow() {
    $('#Slideshow').slick({
      arrows: false,
      dots: true,
      //dotsClass: 'slideshow-dots'
      autoplay: true,
      autoplaySpeed: 5000
    });
  }

  initSlideshow();
});
