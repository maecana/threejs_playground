// Library Imports
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// DOM Declarations
const w = window.innerWidth;
const h = window.innerHeight;

// Three Declarations
const fov = 45;
const aspect = w / h;
const near = 0.1;
const far = 10;

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 2;

// Lights
const hemilight = new THREE.HemisphereLight(0xffffff, 0x000000, 1);
scene.add(hemilight);

// IcosahedronGeometry
const geo = new THREE.IcosahedronGeometry(0.5, 2);
const mat = new THREE.MeshStandardMaterial({
    color: 0x06D995,
    flatShading: true,
});
const mesh = new THREE.Mesh(geo, mat);
const wireframe = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    wireframe: true,
});
const wireframeMesh = new THREE.Mesh(geo, wireframe);
wireframeMesh.scale.setScalar(1.001);
mesh.add(wireframeMesh);
scene.add(mesh);

// Geometries
// BoxGeometry
const box = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const edges = new THREE.EdgesGeometry(box);
const lineMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
});
const line = new THREE.LineSegments(edges, lineMat);
const boxMat = new THREE.MeshStandardMaterial({
    color: 0x06deae,
    flatShading: true
});
const boxMesh = new THREE.Mesh(box, boxMat);
boxMesh.position.x = 0.9
boxMesh.position.y = 0.2;
scene.add(boxMesh);
boxMesh.add(line);

// Box1 Geometry
const box1 = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const box1Mat = new THREE.MeshStandardMaterial({
    color: 0x06feae,
    flatShading: true,
});
const box1Mesh = new THREE.Mesh(box1, box1Mat);
box1Mesh.position.x = -0.8;
// Box1 Wireframe
const box1wireframe = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    wireframe: true
});
const box1wireframeMesh = new THREE.Mesh(box1, box1wireframe);
box1wireframeMesh.scale.setScalar(1.001);
box1Mesh.add(box1wireframeMesh);
scene.add(box1Mesh);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.12;

// Function Declarations
const animate = () => {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
    controls.update();
};

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
document.body.querySelector('#index').appendChild(renderer.domElement);
window.addEventListener('resize', onWindowResize);

// Invoke Functions
animate();
onWindowResize();
