import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let scene, camera, renderer, model;

function init() {
  // Setup scene
  scene = new THREE.Scene();

  // Setup camera
  camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 1, 1500);
  camera.position.z = 8;

  // Setup renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Add lighting
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 5, 5).normalize();
  scene.add(light);

  // Load GLTF model
  const loader = new GLTFLoader();
  loader.load(
    './3d/gedung_tanaman/gedung_tanaman_reduced.gltf', // Replace with the path to your GLTF file
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
