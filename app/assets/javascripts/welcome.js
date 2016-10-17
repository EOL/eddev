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
      autoplay: true,
      autoplaySpeed: 3000
    });
  }

  function expandWelcomeBox() {
    var $box = $('#WelcomeBox'),
        $hidden = $('#WelcomeContent .hidden'),
        $moreBar = $('#WelcomeMoreBar'),
        $moreText = $('#WelcomeMoreText');

    $box.off('mouseenter');
    
    $hidden.slideDown(function() {
      $moreText.hide(); 

      $box.mouseleave(function() { 
        $box.off('mouseleave');

        $hidden.slideUp(function() {
          $moreText.show();
          $box.mouseenter(expandWelcomeBox);
        });  
      });
    });
  }

  fixImageTextBars();
  initSlideshow();
  $('#WelcomeBox').mouseenter(expandWelcomeBox);
});
