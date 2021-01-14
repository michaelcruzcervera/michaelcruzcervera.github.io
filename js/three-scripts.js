$(function(){

    bust();

});

function bust() {
  const canvas = document.querySelector('#bust');
  const mouseArea = document.querySelector('#about');
  const renderer = new THREE.WebGLRenderer({canvas,  alpha: true, antialias: true});
  renderer.setClearColor( 0x000000, 0 );
  renderer.gammaFactor = 2.2;
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

  const directionalLight2 = new THREE.DirectionalLight( 0xffffff, 4 );
  directionalLight2.position.set( -15, 10, -30 );
  directionalLight2.target.position.set(0, 6, 3.5);
  scene.add( directionalLight2 );

  const directionalLight3 = new THREE.DirectionalLight( 0xffffff, 1 );
  directionalLight3.position.set( 0, 20, 20 );
  directionalLight3.target.position.set(0, 6, 2);
  scene.add( directionalLight3 );

var model;
var fileAnimations;
var mixer;
var neck;
var root;
  const textureLoader = new THREE.TextureLoader();
  const loader = new THREE.GLTFLoader();
  loader.load('../models/bust.glb', function (gltf) { //'https://threejs.org/examples/models/gltf/LeePerrySmith/LeePerrySmith.glb'
    model = gltf.scene.children[0];
    model.scale.set(10,10,10);
    /*
    model.children[2].material.map = 0;
    model.children[3].material.map = 0;
    model.children[4].material.map = 0; //eyes
    model.children[5].material.map = 0;
    model.children[6].material.map = 0; //skin
    model.children[7].material.map = 0; //hair
    model.children[8].material.map = 0; //shirt

*/
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

    var idleAnim = fileAnimations[5]
    idleAnim.tracks.splice(3, 3);
    idleAnim.tracks.splice(9, 3);
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
      moveJoint(mousecoords, root, 20);
  }
  });

  mouseArea.addEventListener('mouseleave', (ev) => {
    this.onMouseLeave(ev, neck);
    this.onMouseLeave(ev, root);
  });

/*
  mouseArea.addEventListener('mousemove', (ev) => { this.onMouseMove(ev, model) })
  mouseArea.addEventListener('mouseleave', (ev) => { this.onMouseLeave(ev, model) })
*/

  requestAnimationFrame(render);

  function render() {
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

    requestAnimationFrame(render);
  }
  render();


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
    dy = ((degreeLimit*0.3) * yPercentage) / 100;
  }
  return { x: dx, y: dy };
}


class ColorGUIHelper {
  constructor(object, prop) {
    this.object = object;
    this.prop = prop;
  }
  get value() {
    return `#${this.object[this.prop].getHexString()}`;
  }
  set value(hexString) {
    this.object[this.prop].set(hexString);
  }
}
