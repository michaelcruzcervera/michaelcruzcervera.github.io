$(function(){

    main();

});

function main(){
  var full = $(".workBx");

  //Loops over all elements that have the class fullscreen

  $('a.with-transition').click(function (e) {
    e.preventDefault();                   // prevent default anchor behavior
    var goTo = this.getAttribute("href"); // store anchor href
    full.each(function(index, elem) {
      $(elem).click(fullscreenClick);
    });
    setTimeout(function(){
         window.location = goTo;
    }, 1000);                             // time in ms
});

  window.addEventListener('scroll', function(){
    toggleSticky();
  });

  $(window).on("load",function() {
    function fade() {
      var animation_height = $(window).innerHeight() * 0.1;
      var ratio = Math.round( (1 / animation_height) * 10000 ) / 1000;

      $('section div:not(section.banner div)').each(function() {
        var objectTop = $(this).offset().top;
        var objectBottom = $(this).position().top + ($(this).outerHeight());
        var windowTop = $(window).scrollTop();
        var windowBottom = $(window).scrollTop() + $(window).innerHeight();

        if ( objectTop < windowBottom && objectBottom > windowTop) {
          $(this).css( {
            opacity: 1,
            animation: 'animate_in 0.2s normal ease-out'
          } );
        } else {
          $(this).css( {opacity: 0, animation: 'unset' });

        }
      });
    }
    $('.fade').css( 'opacity', 0 );
    fade();
    $(window).scroll(function() {fade();});
    $(window).resize(function() {fade();});
  });

}

function fullscreenClick() {
    //The button is this
    //We want to clone the parent
    var box = $(this);
    // /var image = $(this).child();
    //create a holder box so the layout stays the same
    var holder = $(box).clone(false, true);
    //and make it not visible
    $(holder).css({
      "visibility": "hidden"
    });

    //Get its position
    var pos = $(box).children().position();
    var width = $(box).innerWidth();
    var height = $(box).innerHeight();
    //Substitute our box with our holder
    $(box).before($(holder));

    //Set the position of our box (not holder)
    //Give it absolute position (eg. outside our set structure)
    $(box).css({
      "position": "fixed",
      "z-index": "100000",
      "left": (pos.left) + "px",
      "top": (pos.top) + "px",
      //"left": "50%",
      "width": width + "px",
      "height": height + "px"

    });
    /*
    $(image).css({
      "width":"100%",
      "height":"auto",
      "object-fit": "none",
      "background-position": "center center",
      "background-repeat": "no-repeat"
    });*/

    //Set class so it can be animated
    $(box).addClass("fullscreen");

    //Animate the position
    $(box).animate({
      "top": "0",
      "left": "0",
      "padding": "0",
      "margin": "0",
      "height": "100vh",
      "width": "100vw"

    }, 800);

  }

function toggleSticky(){
  var header = document.querySelector('header');
  header.classList.toggle('sticky', window.scrollY > 0);
}

function toggleMenu(){
  var menu = document.querySelector('.menu');
  var hamburger = document.querySelector('.hamburger')
  hamburger.classList.toggle("is-active");
  menu.classList.toggle('active');
}
