// Library Imports
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


// Window Declarations
const w = window.innerWidth;
const h = window.innerHeight;

// Three declarations
const fov = 75;
const aspect = w / h;
const near = 0.1;
const far = 10;

// Subject declaration
const geo = new THREE.IcosahedronGeometry(1.0, 2);
const mat = new THREE.MeshStandardMaterial({
    color: 0x06DEAE,
    flatShading: true,
});
const mesh = new THREE.Mesh(geo, mat);

const wireframe = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true,
});
const wireframeMesh = new THREE.Mesh(geo, wireframe);
wireframeMesh.scale.setScalar(1.001)
mesh.add(wireframeMesh);

// 3 things needed for a Scene
// 1. Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

// 2. Camera
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 2;

// 3. Scene
const scene = new THREE.Scene();

// Additional Scene Configuration
// Lights
const hemiLight = new THREE.HemisphereLight(0xfffff, 0x000000);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.12;


// Scene Assembly
scene.add(mesh);
scene.add(hemiLight);

// Functions
const animate = (t = 0) => {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
    controls.update();
}

// Render
animate();