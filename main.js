import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let scene, camera, renderer, model, controls;

function init() {
  // Setup scene
  scene = new THREE.Scene();

  // Setup camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  // Setup renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Add lighting
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 5, 5).normalize();
  scene.add(light);

  // Setup OrbitControls for mouse control
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; // Optional: smooth motion
  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = false;
  controls.maxPolarAngle = Math.PI / 2;

  // Load GLTF model
  const loader = new GLTFLoader();
  loader.load(
    './3d/gedunggabung/AllBuilding.gltf', // Replace with the path to your GLTF file
    function (gltf) {
      model = gltf.scene;
      scene.add(model);
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

  // Rotate the model (optional)
  if (model) {
    model.rotation.y += 0.01;
  }

  // Update controls for smooth camera movement
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
