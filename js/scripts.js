

$(function(){

    main()
})

function main() {
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

const boxWidth = 1;
  const boxHeight = 2;
  const boxDepth = 1;
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

  const material = new THREE.MeshPhongMaterial({color: 0x44aa88});  // greenish blue

  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  this.mouse = new THREE.Vector2(0, 0)
  mouseArea.addEventListener('mousemove', (ev) => { this.onMouseMove(ev, mesh) })
  mouseArea.addEventListener('mouseleave', (ev) => { this.onMouseLeave(ev, mesh) })




  function render(time) {
    time *= 0.001;  // convert time to seconds

    //cube.rotation.x = time;
    //cube.rotation.y = time;
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

}

function onMouseMove(event, cube) {
  this.mouse = {
    x: (event.clientX / window.innerWidth) * 2 - 1,
    y: -(event.clientY / window.innerHeight) * 2 + 1,
  }

  cube.rotation.x = -this.mouse.y * 0.3 ;
  cube.rotation.y = this.mouse.x * (Math.PI / 6);
}

function onMouseLeave(event, cube) {
  cube.rotation.x = 0;
  cube.rotation.y = 0;
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
