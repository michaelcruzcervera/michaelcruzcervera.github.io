$(function(){
      bust();
});

function bust() {
  const canvas = document.querySelector('#bust');
  const mouseArea = document.querySelector('#about');
  const renderer = new THREE.WebGLRenderer({canvas,  alpha: true, antialias: true});
  renderer.setClearColor( 0x000000, 0 );
  //renderer.gammaFactor = 2.2;
  renderer.gammaOutput = true;

  const clock = new THREE.Clock;

  const fov = 75;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 10;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 3.5;
  camera.position.y = 6;

  const scene = new THREE.Scene();


  const color = 0xFFFFFF;
  const intensity = 0.9;
  const light = new THREE.AmbientLight(color, intensity);
  //scene.add(light);


  const skyColor = 0xB1E1FF;  // light blue
  const groundColor = 0xB97A20;  // brownish orange
  const lightHemi = new THREE.HemisphereLight(skyColor, groundColor, 1.2);
  scene.add(lightHemi);

  const directionalLight1 = new THREE.DirectionalLight( 0xffffff, 4 );
  directionalLight1.position.set( 15, 20, -30 );
  directionalLight1.target.position.set(0, 6, 3.5);
  scene.add( directionalLight1 );
/*
  const directionalLight2 = new THREE.DirectionalLight( 0xffffff, 4 );
  directionalLight2.position.set( -15, 10, -30 );
  directionalLight2.target.position.set(0, 6, 3.5);
  scene.add( directionalLight2 );
*/
  const directionalLight3 = new THREE.DirectionalLight( 0xffffff, 1 );
  directionalLight3.position.set( 0, 20, 20 );
  directionalLight3.target.position.set(0, 6, 2);
  scene.add( directionalLight3 );

var model;
var fileAnimations;
var mixer;
var neck;
var root;
var glasses = [];
var gIndex = 0;
var shirts = [];
var sIndex = 0;


  const loader = new THREE.GLTFLoader();

  loader.load('../models/bust.glb', function (gltf) { //'https://threejs.org/examples/models/gltf/LeePerrySmith/LeePerrySmith.glb'
    model = gltf.scene.children[0];
    model.scale.set(10,10,10);

    model.traverse(o => {
      // Reference the accessories
      if (o.name.includes("Glasses")) {
        glasses.push(o);
      }
      if (o.name.includes("Shirt")) {
        shirts.push(o);
      }
    });

    gIndex = Math.floor(Math.random() * glasses.length);

    for (i = 0; i < glasses.length; i++) {
      if(i != gIndex){
        glasses[i].visible = false;
      }else{
        glasses[i].visible = true;
      }
    }

    sIndex = Math.floor(Math.random() * shirts.length);
    for (i = 0; i < shirts.length; i++) {
      if(i != sIndex){
        shirts[i].visible = false;
      }else{
        shirts[i].visible = true;
      }
    }

    let fileAnimations = gltf.animations;

    scene.add(model);

    model.traverse(o => {
      // Reference the neck and waist bones
      if (o.isBone && o.name === 'Head') {
        neck = o;
      }
      if (o.isBone && o.name === 'Spine') {
        root = o;
      }
    });



    mixer = new THREE.AnimationMixer( model );

    var idleAnim = fileAnimations[0]

    var action = mixer.clipAction( idleAnim  ); // access first animation clip
    action.play();


  }, undefined, function ( error ) {

    console.error( error );

  } );


  this.mouse = new THREE.Vector2(0, 0)


  mouseArea.addEventListener('mousemove', function(e) {
    var mousecoords = getMousePos(e);
  if (neck && root) {
      moveJoint(mousecoords, neck, 30);
      moveJoint(mousecoords, root, 10);
  }
  });

  mouseArea.addEventListener('mouseleave', (ev) => {
    this.onMouseLeave(ev, neck);
    this.onMouseLeave(ev, root);
  });

  mouseArea.addEventListener('click', (ev) => {
    gIndex = Math.floor(Math.random() * glasses.length);

    for (i = 0; i < glasses.length; i++) {
      if(i != gIndex){
        glasses[i].visible = false;
      }else{
        glasses[i].visible = true;
      }
    }

    sIndex = Math.floor(Math.random() * shirts.length);
    for (i = 0; i < shirts.length; i++) {
      if(i != sIndex){
        shirts[i].visible = false;
      }else{
        shirts[i].visible = true;
      }
    }
  });

/*
  mouseArea.addEventListener('mousemove', (ev) => { this.onMouseMove(ev, model) })
  mouseArea.addEventListener('mouseleave', (ev) => { this.onMouseLeave(ev, model) })
*/

  //requestAnimationFrame(render);

  function render() {
    requestId = requestAnimationFrame(render);
    if (typeof mixer !== 'undefined' ){
      var delta = clock.getDelta();
        mixer.update(delta);
    }

    TWEEN.update();

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    renderer.render(scene, camera);


  }
  render();

  // start render
  function start() {
      render();
  }

  // stop render
  function stop() {
     window.cancelAnimationFrame(requestId);
     requestId = undefined;
  }

  // observer + log + stop render

const onScreen = new Set();
const intersectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      onScreen.add(entry.target);
      start();
      //console.log('render has been started');
    } else {
      onScreen.delete(entry.target);
      stop();
      //console.log('render has been halted');
        }
  });

});

document.querySelectorAll('#bust').forEach(elem => intersectionObserver.observe(elem));
}




function moveJoint(mouse, joint, degreeLimit) {
  let degrees = getMouseDegrees(mouse.x, mouse.y, degreeLimit);

  var tween = new TWEEN.Tween(joint.rotation)
                  .to({x:THREE.Math.degToRad(degrees.y) ,
                    y: THREE.Math.degToRad(degrees.x)}, 300)
                  .easing(TWEEN.Easing.Quadratic.Out)
                  .start();
  //joint.rotation.y = THREE.Math.degToRad(degrees.x);
  //joint.rotation.x = THREE.Math.degToRad(degrees.y);
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
  function getMousePos(e) {
    return { x: e.clientX, y: e.clientY };
  }
  function getMouseDegrees(x, y, degreeLimit) {
  let dx = 0,
      dy = 0,
      xdiff,
      xPercentage,
      ydiff,
      yPercentage;

  let w = { x: window.innerWidth, y: window.innerHeight };

  // Left (Rotates neck left between 0 and -degreeLimit)

   // 1. If cursor is in the left half of screen
  if (x <= w.x / 2) {
    // 2. Get the difference between middle of screen and cursor position
    xdiff = w.x / 2 - x;
    // 3. Find the percentage of that difference (percentage toward edge of screen)
    xPercentage = (xdiff / (w.x / 2)) * 100;
    // 4. Convert that to a percentage of the maximum rotation we allow for the neck
    dx = ((degreeLimit * xPercentage) / 100) * -1; }
// Right (Rotates neck right between 0 and degreeLimit)
  if (x >= w.x / 2) {
    xdiff = x - w.x / 2;
    xPercentage = (xdiff / (w.x / 2)) * 100;
    dx = (degreeLimit * xPercentage) / 100;
  }
  // Up (Rotates neck up between 0 and -degreeLimit)
  if (y <= w.y / 2) {
    ydiff = w.y / 2 - y;
    yPercentage = (ydiff / (w.y / 2)) * 100;
    // Note that I cut degreeLimit in half when she looks up
    dy = (((degreeLimit * 0.5) * yPercentage) / 100) * -1;
    }

  // Down (Rotates neck down between 0 and degreeLimit)
  if (y >= w.y / 2) {
    ydiff = y - w.y / 2;
    yPercentage = (ydiff / (w.y / 2)) * 100;
    dy = ((degreeLimit*0.7) * yPercentage) / 100;
  }
  return { x: dx, y: dy };
}
