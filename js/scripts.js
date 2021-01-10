$(function(){

    main();

});

function main(){

  var tiles = $(".tile");

  tiles.each(function() {
      const btn = new HoverButton($(this)[0]);
  });

  var skills = $(".skill");
  skills.each(function() {
      const btn = new HoverButton($(this)[0]);
  });

  var circle = $(".circle");
  circle.each(function() {
      const btn = new HoverButton($(this)[0]);
  });

  var social = $(".footer li");
  social.each(function() {
      const btn = new HoverButton($(this)[0], circl=true);
  });
/*
  var scrollMouse = document.querySelector('.mouse-wrap');
  const btn = new HoverButton(scrollMouse, strength = 0.06, proximity = 1000);
*/


  //Loops over all elements that have the class with-transition

  $('.work .content .tile a').click(function (e) {
    e.preventDefault();                   // prevent default anchor behavior
    var goTo = this.getAttribute("href"); // store anchor href
    tiles.each(function(index, elem) {
      $(elem).click(fullscreenClick);
    });
    setTimeout(function(){
         window.location = goTo;
    }, 500);                             // time in ms
});

  window.addEventListener('scroll', function(){
    toggleSticky();
  });

  $(window).on("load",function() {
    function fade() {
      var animation_height = $(window).innerHeight() * 0.1;
      var ratio = Math.round( (1 / animation_height) * 10000 ) / 1000;

      $('section .content').each(function() {
        var objectTop = $(this).offset().top;
        var objectBottom = $(this).position().top + ($(this).outerHeight());
        var windowTop = $(window).scrollTop();
        var windowBottom = $(window).scrollTop() + $(window).innerHeight();

        if ( objectTop < windowBottom ) {
          $(this).css( {
            opacity: 1,
            animation: 'animate_in 0.4s normal cubic-bezier(.25,1.98,.27,.02)'
          } );
        } else {
          $(this).css( {transition: "0.1s linear", opacity: 0, animation: 'unset' });

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
    var holder = $(box).clone(true, true);
    //and make it not visible
    $(holder).css({
      "visibility": "hidden"
    });

    //Get its position
    //$(box).before($(holder));

    var pos = this.getBoundingClientRect();
    var left = pos.left;
    var top = pos.top;
    //Substitute our box with our holder
    $(box).css({
      "position": "fixed",
      "z-index": "100000",
      "width": pos.width + "px",
      "height": pos.height + "px",
      "left": left + "px",
      "top": top + "px",
      "transition":"ease-out"
    });
    //Set the position of our box (not holder)
    //Give it absolute position (eg. outside our set structure)
    $(box).animate({
      "position": "absolute",
      "border-radius": "0",
      "z-index": "10000",
      "top": "0",
      "left": "0",
      "height": "100vh",
      "width": "100vw",
      "padding": "0",
      "margin":"0"
    }, 500);
    /*
    $(box).css({
      "position": "fixed",
      "z-index": "100000",
      "width": box.width + "px",
      "height": box.height + "px",
      "left": (box.left) + "px",
      "top": (box.top) + "px",
      "transition":"1s linear"
    });

    /*
    $(image).css({
      "width":"100%",
      "height":"auto",
      "object-fit": "none",
      "background-position": "center center",
      "background-repeat": "no-repeat"
    });*/
/*

    //Animate the position
    $(box).animate({
      "position": "fixed",
      "top": "0",
      "left": "0",
      "height": "100vh",
      "width": "100vw",
      "padding": "0",
      "margin":"0"


    }, 800);*/

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
    scale = 1.07,
    circle = false,
    attract = true,
    tilt = false,
    enterDuration = 0.4,
    easeLeave = 'elastic.out(1.1, 0.4)',
    easeEnter = 'power2.out'
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

    window.addEventListener("scroll", (e) => this.calculatePosition(e));//this.onScroll(e);});
    //window.addEventListener("scroll", (e) => this.onScroll(e));
  }

  calculatePosition() {
    gsap.set(this.el, {
  x: 0,
  y: 0,
  scale: 1
});

    const box = this.el.getBoundingClientRect();
    this.x = box.left + (box.width * 0.5);
    this.y = box.top + (box.height * 0.5);
    this.width = box.width;
    this.height = box.height;
  }

  onMouseMove(e) {
    let hover = false;
    let hoverArea = (this.hover ? 0.4 : 0.4);
    let x = e.clientX - this.x;
    let y = e.clientY - this.y;
    let distance = Math.sqrt(x * x + y * y);

    var inside = false;

    if (this.circle) {
      inside = distance < (this.width/2 * hoverArea)
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

      var transX = 0;
      var transY = 0;

      if (this.attract) {
        transX = limitNumberWithinRange((x - this.x) * this.strength, -this.width/2, this.width/2);
        transY = limitNumberWithinRange((y - this.y) * this.strength, -this.height/2, this.height/2);
      } else {
        transX = limitNumberWithinRange(-(x - this.x) * this.strength, -this.width/2, this.width/2);
        transY = limitNumberWithinRange(-(y - this.y) * this.strength, -this.height/2, this.height/2);
      }

      gsap.to(this.el,  {
  x: transX,
  y: transY,
  scale: this.scale,
  ease: this.easeEnter,
  duration: 0.4
});


    this.el.style.zIndex = 10;
  }
  onLeave() {
    gsap.to(this.el, {
      x: 0,
      y: 0,
      scale: 1,
      ease: this.easeLeave,
      duration: 0.7
    });

    this.el.style.zIndex = 0;
  }
}



function limitNumberWithinRange(num, min, max){
  const parsed = parseInt(num)
  return Math.min(Math.max(parsed, min), max)
}
