//Sticky Menu
$(window).scroll(function () {
  if($(window).scrollTop() > 400) {
    $(".top-3").addClass('sticky');
  } else {
    $(".top-3").removeClass('sticky');
  }
});
//Sticky End

//Counter Start
$('.counter-count').each(function () {
$(this).prop('Counter',0).animate({
    Counter: $(this).text()
}, {
    duration: 5000,
    easing: 'swing',
    step: function (now) {
        $(this).text(Math.ceil(now));
    }
});
});
//Counter End

$(document).ready(function() {
//Home Page Slider
$("#home_lider").owlCarousel({
      loop: true,
    margin:30,
    nav: true,
    navText: [ "<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
  dots: true,
    autoplay: true,
    autoplayHoverPause: true,
   animateIn: 'fadeIn',
       animateOut: 'fadeOut',
    responsive: {
    0: {items: 1},
    600: {items: 1},
    1000: {items:1}
    } 
  });
});
//AOS Animation
AOS.init();
//AOS Animation End

//Back to top
$(document).ready(function(){
	$(window).scroll(function () {
			if ($(this).scrollTop() > 50) {
				$('#back-to-top').fadeIn();
			} else {
				$('#back-to-top').fadeOut();
			}
		});
		// scroll body to 0px on click
		$('#back-to-top').click(function () {
			$('body,html').animate({
				scrollTop: 0
			}, 400);
			return false;
		});
});
//Back to top End


