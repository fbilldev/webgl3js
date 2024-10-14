import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let scene, camera, renderer, model, controls, mixer, clock;

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
  const light = new THREE.DirectionalLight(0xffffff, 5);
  light.position.set(5, 5, 5).normalize();
  scene.add(light);

  // Setup OrbitControls for mouse control
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; // Optional: smooth motion
  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = false;
  controls.maxPolarAngle = Math.PI / 2;

  // Initialize clock for animation
  clock = new THREE.Clock();

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

  // Start animation loop
  animate();
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