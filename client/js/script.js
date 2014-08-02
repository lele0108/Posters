$(document).ready(function(){
	$('.slider-contents').slick({
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 5000,
		arrows: true,
		accessibility: true,
	});

	[].slice.call( document.querySelectorAll('a[href="#"') ).forEach( function(el) {
		el.addEventListener( 'click', function(ev) { ev.preventDefault(); } );
	} );
});

$(document).scroll(function(){
    if($('body').scrollTop() > 0)
    {   
        $('.header').css({"border-bottom":"1px solid #ecf0f1"});
    }
    else if ($('body').scrollTop() <= 0) {
    	$('.header').css({"border-bottom":"none"});
    }
});