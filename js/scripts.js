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
  constructor(
    el,
    strength = 0.09,
    proximity = 0,
    scale = 1.05,
    circle = false,
    attract = true,
    tilt = false,
    easeLeave = "cubic-bezier(.57,1.66,.54,-0.04)",
    easeEnter = "linear"
  ) {
    this.el = el;
    this.strength = strength;
    this.attract = attract;
    this.proximity = proximity;
    this.circle = circle;
    this.scale = scale;
    this.easeLeave = easeLeave;
    this.easeEnter = easeEnter;
    this.tilt = tilt;

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
    gsap.set(this.el, {
  x: 0,
  y: 0,
  scale: 1
});

    const box = this.el.getBoundingClientRect();
    this.x = box.left + box.width * 0.5;
    this.y = box.top + box.height * 0.5;
    this.width = box.width;
    this.height = box.height;
  }

  onMouseMove(e) {
    let hover = false;
    let hoverArea = (this.hover ? 0.7 : 0.5);
    let x = e.clientX - this.x;
    let y = e.clientY - this.y;
    let distance = Math.sqrt(x * x + y * y);

    var inside = false;

    if (this.circle) {
      inside = distance < (this.width/2 + this.proximity)
    } else {
      inside =
        x < this.width / 2 + this.proximity &&
        x > -this.width / 2 - this.proximity &&
        y < this.height / 2 + this.proximity &&
        y > -this.height / 2 - this.proximity;
    }

    if (inside) {
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
    if (this.tilt) {
      var rotX = ((y - this.y + this.height/2 - 90) / -2) * this.strength;
      var rotY = ((x - this.x + this.width/2 - 90) / 2) * this.strength;
      gsap.to(this.el,  {
  rotationX: rotX,
  rotationY: rotY,
  scale: this.scale,
  ease: 'power2.out',
  duration: 0.4
});
    } else {
      var transX = 0;
      var transY = 0;

      if (this.attract) {
        transX = (x - this.x) * this.strength;
        transY = (y - this.y) * this.strength;
      } else {
        transX = -(x - this.x) * this.strength;
        transY = -(y - this.y) * this.strength;
      }

      gsap.to(this.el,  {
  x: transX,
  y: transY,
  scale: this.scale,
  ease: 'power2.out',
  duration: 0.4
});
    }

    this.el.style.zIndex = 10;
  }
  onLeave() {
    gsap.to(this.el, {
      x: 0,
      y: 0,
      scale: 1,
      ease: 'elastic.out(1.1, 0.4)',
      duration: 0.7
    });

    this.el.style.zIndex = 1;
  }
}

$("div.tile .img").each(function () {
  const btn = new HoverButton($(this)[0]);
});

function insideElipse(x, y, centreX, centreY, width, height) {
  var p =
    Math.pow(x - centreX, 2) / Math.pow(height/2, 2) +
    Math.pow(y - centreY, 2) / Math.pow(width/2, 2);
  if (p <= 1) {
    return true;
  } else {
    return false;
  }
}
