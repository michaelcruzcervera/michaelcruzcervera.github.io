

$(function(){

    bust();
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
    }, 500);                             // time in ms
});

  window.addEventListener('scroll', function(){
    toggleSticky();
  });

  $(window).on("load",function() {
    function fade() {
      var animation_height = $(window).innerHeight() * 0.1;
      var ratio = Math.round( (1 / animation_height) * 10000 ) / 1000;

      $('section div').each(function() {

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
    var holder = $(this).clone(false, true);
    //and make it not visible
    $(holder).css({
      "visibility": "hidden"
    });

    //Get its position
    var pos = $(box).position();

    //Substitute our box with our holder
    $(box).before($(holder));

    //Set the position of our box (not holder)
    //Give it absolute position (eg. outside our set structure)
    $(box).css({
      "position": "fixed",
      "z-index": "100000",
      "left": pos.left + "px",
      "top": pos.top + "px",
      "border-radius": "0",
      "padding": 0,
      "object-fit": "none",
      "background-position": "center center",
      "background-repeat": "no-repeat"
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
      "top": 0,
      "left": 0,
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



function bust() {
  const canvas = document.querySelector('#bust');
  const mouseArea = document.querySelector('#about');
  const renderer = new THREE.WebGLRenderer({canvas,  alpha: true});
  renderer.setClearColor( 0x000000, 0 );

  const fov = 75;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 10;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 8;

  const scene = new THREE.Scene();
  //scene.background = new THREE.Color(0xdddddd);

  {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }

  const textureLoader = new THREE.TextureLoader();
  const loader = new THREE.GLTFLoader();
  loader.load('https://threejs.org/examples/models/gltf/LeePerrySmith/LeePerrySmith.glb', function (gltf) {
    mesh = gltf.scene.children[0];

    mesh.material = new THREE.MeshPhongMaterial({
      specular: 0x111111,
      map: textureLoader.load('https://threejs.org/examples/models/gltf/LeePerrySmith/Map-COL.jpg'),
      specularMap: textureLoader.load('https://threejs.org/examples/models/gltf/LeePerrySmith/Map-SPEC.jpg'),
      normalMap: textureLoader.load('https://threejs.org/examples/models/gltf/LeePerrySmith/Infinite-Level_02_Tangent_SmoothUV.jpg'),
      shininess: 25,
    });
    scene.add(mesh)
  }, undefined, function ( error ) {

    console.error( error );

  } );
  this.mouse = new THREE.Vector2(0, 0)
  mouseArea.addEventListener('mousemove', (ev) => { this.onMouseMove(ev, mesh) })
  mouseArea.addEventListener('mouseleave', (ev) => { this.onMouseLeave(ev, mesh) })


  requestAnimationFrame(render);

  function render(time) {

    TWEEN.update(time);

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }


}

function onMouseMove(event, cube) {
  this.mouse = {
    x: (event.clientX / window.innerWidth) * 2 - 1,
    y: -(event.clientY / window.innerHeight) * 2 + 1,
  }

  var tween = new TWEEN.Tween(cube.rotation)
                  .to({x:-this.mouse.y * 0.3 ,
                    y: this.mouse.x * (Math.PI / 6)}, 300)
                  .easing(TWEEN.Easing.Quadratic.Out)
                  .start();
}

function onMouseLeave(event, cube) {
  var tween = new TWEEN.Tween(cube.rotation)
                  .to({x:0,
                    y: 0}, 600)
                  .easing(TWEEN.Easing.Quadratic.Out)
                  .start();
}

function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const pixelRatio = window.devicePixelRatio;
  const width  = canvas.clientWidth  * pixelRatio | 0;
  const height = canvas.clientHeight * pixelRatio | 0;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
  }
