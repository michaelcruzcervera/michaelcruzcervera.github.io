$(function(){

    main();

});

function main(){


  $('.tile').each(function() {
      const btn = new HoverButton($(this)[0]);
  });

  var tiles = $(".tile");

  //Loops over all elements that have the class with-transition

  $('a.with-transition').click(function (e) {
    e.preventDefault();                   // prevent default anchor behavior
    var goTo = this.getAttribute("href"); // store anchor href
    tiles.each(function(index, elem) {
      $(elem).click(fullscreenClick);
    });
    setTimeout(function(){
         window.location = goTo;
    }, 1200);                             // time in ms
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


    var box = $(box).children().getBoundingClientRect();
    var pos;
    var x = box.left + box.width * 0.5;
    var y = box.top + box.height * 0.5;

    //Substitute our box with our holder
    $(box).before($(holder));

    //Set the position of our box (not holder)
    //Give it absolute position (eg. outside our set structure)
    $(box).css({
      "position": "absolute",
      "z-index": "100000",
      "width": box.width + "px",
      "height": box.height + "px",
      "left": (box.left) + "px",
      "top": (box.top) + "px",


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
      "height": "100vh",
      "width": "100vw",
      "padding": "0",
      "margin":"0"

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

class HoverButton {
  constructor(el) {
    this.el = el;
    this.hover = false;
    this.calculatePosition();
    this.attachEventsListener();
  }

  attachEventsListener() {
    window.addEventListener("mousemove", (e) => this.onMouseMove(e));
    window.addEventListener("resize", (e) => this.calculatePosition(e));
    window.addEventListener("scroll", (e) => this.calculatePosition(e));

  }

  calculatePosition() {
    this.el.style.transition="0.4s ease-out"
    this.el.style.transform = "none";

    const box = this.el.getBoundingClientRect();
    this.x = box.left + box.width * 0.5;
    this.y = box.top + box.height * 0.5;
    this.width = box.width;
    this.height = box.height;
  }

  onMouseMove(e) {

    let hover = false;
    let hoverArea = this.hover ? 0.6: 0.4;
    let x = e.clientX - this.x;
    let y = e.clientY - this.y;
    let distance = Math.sqrt(x * x + y * y);

    if (x < this.width/2 && x > -this.width/2 && y < this.height/2 && y > -this.height/2) {
      hover = true;
      if (!this.hover) {
        this.hover = true;
      }
      this.onHover(e.clientX, e.clientY);
    }

    if (!hover && this.hover) {
      this.onLeave();
      this.hover = false;
    }
  }

  onHover(x, y) {
     this.el.style.transition="0.4s ease-out"
    this.el.style.transform = "translate(" + ((x - this.x) * 0.12) + "px," + ((y - this.y) * 0.12) + "px)";// scale(1.05)";

    this.el.style.zIndex = 10;
  }
  onLeave() {

    this.el.style.transition="0.8s ease-out"
    this.el.style.transform = "none";

    this.el.style.zIndex = 1;
  }
}
