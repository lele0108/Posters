$(document).ready(function(){$(".slider-contents").slick({slidesToShow:1,slidesToScroll:1,autoplay:!0,autoplaySpeed:5e3,arrows:!0,accessibility:!0}),[].slice.call(document.querySelectorAll('a[href="#"')).forEach(function(e){e.addEventListener("click",function(e){e.preventDefault()})})});