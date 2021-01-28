$(function(){

    main();

});

function main(){
  //Let lightTheme = false;
  window.addEventListener('load', (event) => {
    //Set up hover buttons
    const tiles = $(".tile");

    tiles.each(function() {
        const btn = new HoverButton($(this)[0]);
    });

    const menu = $(".menu li a");
    menu.each(function() {
        const btn = new HoverButton($(this)[0], 0.1, 5, 1.1, 0.4);
    });


    const ham =  document.querySelector('.hamburger');
    const hamBtn = new HoverButton(ham);

    const btn = $(".btn");
    btn.each(function() {
        const btn = new HoverButton($(this)[0], 0.3, 10, 1.1, 0.4);
    });

    const hoverables = $(".hover");
    hoverables.each(function() {
        const btn = new HoverButton($(this)[0], 0.3, 10, 1.1, 0.4, false);
    });

    const socials = $(".footer li");
    socials.each(function() {
        const btn = new HoverButton($(this)[0], 0.2);
    });


  });
  document.body.addEventListener("click", () => {
    //Set Colors
    /*
    --backround: linear-gradient(to right, #ddd6f3, #faaca8);
    --meta-colour: linear-gradient(to right, #2bc0e4, #eaecc6);
    */
    const themes = [
      {bg1:'#ddd6f3', bg2:'#faaca8', main1:'#2bc0e4', main2:'#eaecc6'}, //Pink and Baby Blue
      {bg1:'#ddd6f3', bg2:'#faaca8', main1:'#aa076b', main2:'#61045f'}, //Pink and Ribena
      {bg1:'#ddd6f3', bg2:'#faaca8', main1:'#ff8008', main2:'#ffc837'}, //Pink and Fanta
      {bg1:'#ddd6f3', bg2:'#faaca8', main1:'#2bc0e4', main2:'#eaecc6'}, //Pink and Candy Floss
      {bg1:'#ddd6f3', bg2:'#faaca8', main1:'#757f9a', main2:'#d7dde8'}, //Pink and Clay
      {bg1:'#ddd6f3', bg2:'#faaca8', main1:'#de6262', main2:'#ffb88c'}, //Pink and Peach
    ];

    let index = Math.floor(Math.random()*themes.length);

    document.documentElement.style.setProperty('--background', `linear-gradient(to right, ${themes[index].bg1}, ${themes[index].bg2})`);
    document.documentElement.style.setProperty('--meta-colour', `linear-gradient(to right, ${themes[index].main1}, ${themes[index].main2})`);
  });


/*
  const bustAccent =  document.querySelector('.bust-hover');
  const bustAccentBtn = new HoverButton(bustAccent, 0.2, 200, 1, 10, false, true, false);
*/

  $(".blob").each(function () {

  //Set Start Postion/Size
  var minSize = 50;
  var maxSize = Math.max(100, $(window).width() * 0.2, $(window).height() * 0.2);
  var w = Math.floor(Math.random() * maxSize) + minSize;
  var newq = makeNewPosition();
  $(this).css({ top: newq[0], left: newq[1], width: 0, height: 0 });

  $(this).animate({ opacity: 1, width: w, height: w }, 400);

  //Add HoverButton
  const btn = new HoverButton($(this)[0], 0.4, maxSize/2, 1.0, 6, false, false, false, true);

  //Start Animation
  animateDiv($(this)[0], minSize, maxSize);
});

// start render
function start() {

  $(".blob").each(function () {
    animateDiv($(this)[0]);
});

}

// observer + log + stop render

const onScreen = new Set();
const intersectionObserver = new IntersectionObserver((entries) => {
entries.forEach(entry => {
  if (entry.isIntersecting) {
    onScreen.add(entry.target);
    start();
    //console.log('blobs has been started');
  } else {
    onScreen.delete(entry.target);
    //console.log('blobs has been halted');
      }
});

});

document.querySelectorAll('.cont').forEach(elem => intersectionObserver.observe(elem));

  window.addEventListener('scroll', function(){
    toggleSticky();
  });
/*
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
  });*/

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
      "border-radius": "0",
      "z-index": "10000",
      "top": "0",
      "left": "0",
      "height": "100vh",
      "width": "100vw",
      "padding": "0",
      "margin":"0"
    }, 500);

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



function makeNewPosition() {
  // Get viewport dimensions (remove the dimension of the div)
  var h = $(".cont").height();
  var w = $(".cont").width();

  var nh = Math.floor(Math.random() * h);
  var nw = Math.floor(Math.random() * w);

  return [nh, nw];
}

function animateDiv(element, minSize = 20, maxSize = 150, minSpeed = 35, maxSpeed = 25) {

  var newPos = makeNewPosition();
  var speed = Math.floor(Math.random() * maxSpeed) + minSpeed;
  const x1 = element.offsetTop;
  const y1 = element.offsetLeft;
  var dist = Math.floor(distance(x1, y1, newPos[0], newPos[1]));
  var time = dist * speed;
  var screenWidth = Math.max($(window).width() * 0.2, $(window).height() * 0.2, maxSize);
  let width = Math.floor(Math.random() * screenWidth) + minSize;
  var w = width;

  $(element).animate(
    { top: newPos[0], left: newPos[1], width: w, height: w },
    time,
    function () {

    }
  );
}

function distance(x1, y1, x2, y2) {
  var a = x1 - x2;
  var b = y1 - y2;

  return Math.sqrt(a * a + b * b);
}

class HoverButton {
  constructor(
    el,
    strength = 0.09,
    proximity = 0,
    scale = 1.07,
    enterDuration = 0.4,
    attract = true,
    lift = true,
    unset = true,
    calcPosOnMM = false

  ) {
    this.el = el;
this.strength = strength;
this.proximity = proximity;
this.scale =  scale;
this.attract = attract;
this.enterDuration = enterDuration;
this.lift = lift;
this.unset = unset;
this.calcPosOnMM = calcPosOnMM;

this.easeLeave = 'elastic.out(1.1, 0.4)';
this.easeEnter = 'power2.out';

    this.hover = false;

    this.calculatePosition();
    this.attachEventsListener();
  }

  attachEventsListener() {
    window.addEventListener("mousemove", (e) => this.onMouseMove(e));
    if(this.calcPosOnMM){
          window.addEventListener("mousemove", (e) => this.calculatePosition(e));
    }

    window.addEventListener("resize", (e) => this.calculatePosition(e));
    window.addEventListener("load", (e) => this.calculatePosition(e));

    window.addEventListener("scroll", (e) => this.calculatePosition(e));//this.onScroll(e);});
    //window.addEventListener("scroll", (e) => this.onScroll(e));
  }

  calculatePosition() {
    if(this.unset){
      gsap.set(this.el, {
    x: 0,
    y: 0,
    scale: 1
  });
    }
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

    const inside =
        x < this.width / 2 + this.proximity &&
        x > -this.width / 2 - this.proximity &&
        y < this.height / 2 + this.proximity &&
        y > -this.height / 2 - this.proximity;

    if (inside) {
      hover = true;
      if (!this.hover) {
        this.hover = true;
      }
      this.onHover(e.clientX, e.clientY);
    }

    if (!hover && this.hover && this.unset) {
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
  duration: this.enterDuration
});

if(this.lift){
this.el.style.zIndex = 10;
}
  }
  onLeave() {
    gsap.to(this.el, {
      x: 0,
      y: 0,
      scale: 1,
      ease: this.easeLeave,
      duration: 0.9
    });

    this.el.style.zIndex = 0;
  }
}



function limitNumberWithinRange(num, min, max){
  const parsed = parseInt(num)
  return Math.min(Math.max(parsed, min), max)
}
