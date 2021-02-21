$(function() {

  main();

});

function main() {
  //Let lightTheme = false;
  //window.addEventListener('load', (event) => {
  //Set up hover buttons
  const tiles = $(".tile");

  tiles.each(function() {
    const btn = new HoverButton($(this)[0]);
  });

  const menu = $(".menu li a");
  menu.each(function() {
    const btn = new HoverButton($(this)[0], 0.1, 5, 1.1, 0.4, true, true, true, true);
  });


  const ham = document.querySelector('.hamburger');
  const hamBtn = new HoverButton(ham, 0.1, 30, 1.1, 0.4);

  const sw = document.querySelector('.switch');
  const swBtn = new HoverButton(sw, 0.1, 30, 1.1, 0.4);

  const btn = $(".btn");
  btn.each(function() {
    const btn = new HoverButton($(this)[0], 0.1, 0, 1.1, 0.4);
  });

  const hoverables = $(".hover");
  hoverables.each(function() {
    const btn = new HoverButton($(this)[0], 0.3, 10, 1.1, 0.4, false);
  });

  const socials = $(".footer li");
  socials.each(function() {
    const btn = new HoverButton($(this)[0], 0.2);
  });


  //  });

  let light = true;
  const toggle = document.querySelector(".toggle");

  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

  const currentTheme = localStorage.getItem("theme");
  if (currentTheme == "dark") {
    document.body.classList.toggle("dark-theme");
    light = false;
    changeBannerTheme(light);
    toggle.checked = true;
  } else if (currentTheme == "light") {
    document.body.classList.toggle("light-theme");
    light = true;
    changeBannerTheme(light);
    toggle.checked = false;
  }

  toggle.addEventListener("click", function() {
    if (prefersDarkScheme.matches) {
      document.body.classList.toggle("light-theme");
      var theme = document.body.classList.contains("light-theme") ?
        "light" :
        "dark";

    } else {
      document.body.classList.toggle("dark-theme");
      var theme = document.body.classList.contains("dark-theme") ?
        "dark" :
        "light";
    }
    if (theme != "dark") {
      light = true;
    } else if (theme != "light") {
      light = false;
    }
    changeBannerTheme(light);
    localStorage.setItem("theme", theme);
  });


  document.body.addEventListener("click", () => {
    changeBannerTheme(light);
  });

  $(".blob").each(function() {

    //Set Start Postion/Size
    var minSize = 50;
    var maxSize = Math.max(100, $(window).width() * 0.2, $(window).height() * 0.2);
    var w = Math.floor(Math.random() * maxSize) + minSize;
    var newq = makeNewPosition();
    $(this).css({
      top: newq[0],
      left: newq[1],
      width: 0,
      height: 0
    });

    $(this).animate({
      opacity: 1,
      width: w,
      height: w
    }, 400);

    //Add HoverButton
    const btn = new HoverButton($(this)[0], 0.4, maxSize / 2, 1.0, 6, false, false, false, true);

    //Start Animation
    animateDiv($(this)[0], minSize, maxSize);
  });



  window.addEventListener('scroll', function() {
    toggleSticky();
  });

}

function changeBannerTheme(light) {
  //Dark Themes
  const dark_meta = [{
      main1: '#fe8c00',
      main2: '#f83600'
    }, //dark and bright orange
    {
      main1: '#00c6ff',
      main2: '#0072ff'
    }, //dark and bright blue
    {
      main1: '#fe8c00',
      main2: '#f83600'
    }, //dark and bright orange
    {
      main1: '#00c6ff',
      main2: '#0072ff'
    },
    {
      main1: '#fe8c00',
      main2: '#f83600'
    }, //dark and bright orange
    {
      main1: '#00c6ff',
      main2: '#0072ff'
    }
  ];
  const dark_bkg = [{
      bg1: '#485563',
      bg2: '#232B32'
    },
    {
      bg1: '#243b55',
      bg2: '#232B32'
    }, //dark and bright orange
    {
      bg1: '#004e92',
      bg2: '#232B32'
    },
  ];
  //Light Themes
  const light_meta = [{
      main1: '#2bc0e4',
      main2: '#eaecc6'
    }, //Baby Blue
    {
      main1: '#aa076b',
      main2: '#61045f'
    }, //Ribena
    {
      main1: '#ff8008',
      main2: '#ffc837'
    }, //Fanta
    {
      main1: '#2bc0e4',
      main2: '#eaecc6'
    }, //Candy Floss
    {
      main1: '#757f9a',
      main2: '#d7dde8'
    }, //Clay
    {
      main1: '#de6262',
      main2: '#ffb88c'
    }, //Peach
  ];
  const light_bkg = [{
      bg1: '#ddd6f3',
      bg2: '#faaca8'
    }, //Pink
    {
      bg1: '#2980B9',
      bg2: '#6DD5FA'
    }, //Blue
    {
      bg1: '#6190E8',
      bg2: '#A7BFE8'
    }, //Blue
  ];


  if (light) {
    let indexBkg = Math.floor(Math.random() * light_bkg.length);
    let indexMeta = Math.floor(Math.random() * light_meta.length);
    document.documentElement.style.setProperty('--background', `linear-gradient(to top, ${light_bkg[indexBkg].bg1}, ${light_bkg[indexBkg].bg2})`);
    document.documentElement.style.setProperty('--background-inverted', `linear-gradient(to bottom, ${light_bkg[indexBkg].bg1}, ${light_bkg[indexBkg].bg2})`);
    document.documentElement.style.setProperty('--meta-colour', `linear-gradient(to right, ${light_meta[indexMeta].main1}, ${light_meta[indexMeta].main2})`);
  } else {
    let indexBkg = Math.floor(Math.random() * dark_bkg.length);
    let indexMeta = Math.floor(Math.random() * dark_meta.length);
    document.documentElement.style.setProperty('--background', `linear-gradient(to bottom, ${dark_bkg[indexBkg].bg1}, ${dark_bkg[indexBkg].bg2})`);
    document.documentElement.style.setProperty('--background-inverted', `linear-gradient(to top, ${dark_bkg[indexBkg].bg1}, ${dark_bkg[indexBkg].bg2})`);
    document.documentElement.style.setProperty('--meta-colour', `linear-gradient(to right, ${dark_meta[indexMeta].main1}, ${dark_meta[indexMeta].main2})`);
  }
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
    "transition": "ease-out"
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
    "margin": "0"
  }, 500);

}

function toggleSticky() {
  var header = document.querySelector('header');
  header.classList.toggle('sticky', window.scrollY > 0);
}

function toggleMenu() {
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

function animateDiv(element, minSize = 40, maxSize = 150, minSpeed = 35, maxSpeed = 25) {

  var newPos = makeNewPosition();
  var speed = Math.floor(Math.random() * maxSpeed) + minSpeed;
  const x1 = element.offsetTop;
  const y1 = element.offsetLeft;
  var dist = distance(x1, y1, newPos[0], newPos[1]);
  var time = dist * speed;
  var screenWidth = Math.max($(window).width() * 0.2, $(window).height() * 0.2, maxSize);
  let w = Math.floor(Math.random() * screenWidth) + minSize;

  $(element).animate({
      top: newPos[0],
      left: newPos[1],
      width: w,
      height: w
    },
    time,
    function() {
      animateDiv(element);
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
    this.scale = scale;
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
    if (this.calcPosOnMM) {
      window.addEventListener("mousemove", (e) => this.calculatePosition(e));
    }

    window.addEventListener("resize", (e) => this.calculatePosition(e));
    window.addEventListener("load", (e) => this.calculatePosition(e));

    window.addEventListener("scroll", (e) => this.calculatePosition(e)); //this.onScroll(e);});
    //window.addEventListener("scroll", (e) => this.onScroll(e));
  }

  calculatePosition() {
    if (this.unset) {
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
      transX = limitNumberWithinRange((x - this.x) * this.strength, -this.width / 2, this.width / 2);
      transY = limitNumberWithinRange((y - this.y) * this.strength, -this.height / 2, this.height / 2);
    } else {
      transX = limitNumberWithinRange(-(x - this.x) * this.strength, -this.width / 2, this.width / 2);
      transY = limitNumberWithinRange(-(y - this.y) * this.strength, -this.height / 2, this.height / 2);
    }

    gsap.to(this.el, {
      x: transX,
      y: transY,
      scale: this.scale,
      ease: this.easeEnter,
      duration: this.enterDuration
    });

    if (this.lift) {
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



function limitNumberWithinRange(num, min, max) {
  const parsed = parseInt(num)
  return Math.min(Math.max(parsed, min), max)
}
