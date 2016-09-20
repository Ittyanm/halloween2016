$(function() {
  hljs.initHighlightingOnLoad();

  var navH = $('.nav').height();

  $('.pagelinks').on('click', function() {
    var speed = 400;
    var href= $(this).attr("href");
    var target = $(href == "#" || href == "" ? 'html' : href);
    var position = target.offset().top - navH;
    $('body,html').animate({scrollTop:position}, speed, 'swing');
    event.preventDefault();
  });

  $('.nav').fxpulldown();

  // $('.test').fxpulldown();

});
