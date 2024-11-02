import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let scene, camera, renderer, model, controls, mixer, clock, raycaster, mouse, isClickable;

function init() {
  // Setup scene
  scene = new THREE.Scene();

  // Setup camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 120;

  // Setup renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Add lighting
  //const light = new THREE.DirectionalLight(0xffffff, 4);
  const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 5 );
  //light.position.set(5, 5, 5).normalize();
  scene.add(light);

  //add background
  scene.background = new THREE.Color(0x87CEEB);

  // Setup OrbitControls for mouse control
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = false;
  controls.maxPolarAngle = Math.PI / 2;

  // Initialize clock for animation
  clock = new THREE.Clock();

  // Initialize raycaster and mouse vector
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  // Variable to track whether the model is clickable
  isClickable = false;

  // Load GLTF model
  const loader = new GLTFLoader();
  loader.load(
    './3d/gedung/AllBuildingREV.gltf', // Replace with the path to your GLTF file
    function (gltf) {
      model = gltf.scene;
      scene.add(model);

      // Setup animation mixer for GLTF animations
      mixer = new THREE.AnimationMixer(model);

      // Play all animations from the model
      if (gltf.animations.length > 0) {
        gltf.animations.forEach((clip) => {
          const action = mixer.clipAction(clip);
          action.play();
        });
      }
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
    },
    function (error) {
      console.error('An error occurred while loading the model:', error);
    }
  );

  // Add event listener for mouse movement and clicks
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('click', onClick);

  // Start animation loop
  animate();
}

function onMouseMove(event) {
  // Convert mouse position to normalized device coordinates (-1 to +1)
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Update raycaster with camera and mouse position
  raycaster.setFromCamera(mouse, camera);

  // Check for intersections with the model
  const intersects = raycaster.intersectObject(model, true);

  if (intersects.length > 0) {
    // If the mouse is over the model, change cursor to pointer
    document.body.style.cursor = 'pointer';
    isClickable = true;
  } else {
    // If the mouse is not over the model, revert cursor to default
    document.body.style.cursor = 'default';
    isClickable = false;
  }
}

function onClick(event) {
  if (isClickable) {
    // Show confirmation popup before redirecting
    const confirmed = confirm('Do you want to proceed to the next page?');
    if (confirmed) {
      // If the user confirms, redirect to the new page
      window.location.href = 'https://www.bi.go.id/'; // Replace with your target URL
    }
  }
}

function animate() {
  requestAnimationFrame(animate);

  // Update animation mixer and controls
  const delta = clock.getDelta();
  if (mixer) mixer.update(delta);

  controls.update();

  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  // Update renderer and camera on window resize
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// Initialize the scene
init();