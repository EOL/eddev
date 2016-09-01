function userSessionControlInit() {
  var $btn = $('#SignInBtn'),
      $loginForm = $('#LoginForm'),
      $signupForm = $('#SignupForm'),
      $signupBtn = $signupForm.find('input[type="submit"]'),
      $accountPanel = $('#AccountPanel'),
      btnTxt = $btn.html(),
      btnToggleTxt = $btn.data('toggle-txt'),
      state = $btn.data('state');

  var signInFn = function() {
    $accountPanel.slideDown();
  }

  var signOutFn = function() {
    window.location = window.app_uri_prefix + '/logout';
  }

  if (state === 'signed_in') {
    $btn.click(signOutFn);
  } else {
    // Login AJAX handling
    $loginForm.on('ajax:success', function(e, data, status, xhr) {
      if (data['success']) {
        window.location = window.app_uri_prefix + '/'
      } else {
        $('#LoginForm .error-msg').html(data['error_msg']);
      }
    });

    // Signup form handling
    $signupForm.on('ajax:success', function(e, data, status, xhr) {
      $signupForm.find('.error-field').removeClass('error-field');
      $signupForm.find('.field-errors').remove();
      $signupForm.find('.error-msg').html(data['msg']);

      if (data['success']) {
        $signupForm.find('.field input').val('');
      } else {
        $.each(data['errors'], function(attr, errors) {
          var $field = $('#user_' + attr).parent();
          var $label = $field.children('label');
          var $errorList = $('<ul class="field-errors"></ul>');

          $field.addClass('error-field');
          $label.after($errorList);
          
          $.each(errors, function(i, error) {
            $errorList.append('<li>' + error + '</li>');
          });  
        });
      }
    });

    $btn.click(signInFn);
  }
  
  if ($accountPanel.data('open')) {
    $accountPanel.slideDown();
  }
}

$(function() {
  userSessionControlInit();

  $('#AccountPanel .close-btn').click(function() {
    $('#AccountPanel').slideUp();
  });



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
