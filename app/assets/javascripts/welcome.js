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

  $('.nav-item').on('touchstart', function(event) {
    event.preventDefault();
    console.log('touch');
  });

  $('.nav-item').click(function(event) {
    event.preventDefault();
    console.log('click');
  });
});
