// Library Imports
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Internal Imports
import spline from './data/spline.js';

// DOM Declarations
const w = window.innerWidth;
const h = window.innerHeight;
// THREE Declarations
const fov = 45;
const aspect = w / h;
const near = 0.1;
const far = 100;

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 35;

// Lights
const hemilight = new THREE.HemisphereLight(0xffffff, 0x000000);
scene.add(hemilight);

// Geometries
const tube = new THREE.TubeGeometry(spline, 222, 0.65, 16, true);
const tubeMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    flatShading: true,
});
const tubeMesh = new THREE.Mesh(tube, tubeMat);
tubeMesh.position.y = 4;
tubeMesh.position.x = -4;
tubeMesh.rotation.x = 0.5;
scene.add(tubeMesh);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.12;

// Functions
const animate = () => {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
    controls.update();
}

const onWindowResize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const aspect = w / h;

    if (camera.aspect !== aspect) {
        camera.aspect = aspect;
        camera.updateProjectionMatrix();
    }

    renderer.setSize(w, h);
}

// DOM
document.body.querySelector("#vortex").appendChild(renderer.domElement);
window.addEventListener('resize', onWindowResize);

// Invoke functions
animate();
