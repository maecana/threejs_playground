// Library Imports
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

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

// Global Declations
let boxEdgesMeshes = [];

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.toneMapping = THREE.CineonToneMapping;
renderer.toneMappingExposure = 0.5;
renderer.renderToScreen = true;

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 35;

// Post Processing
const composer = new EffectComposer(renderer);
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), 1.5, 0.4, 0.85);

bloomPass.threshold = 0;
bloomPass.strength = 0.9;
bloomPass.radius = 0.12;
bloomPass.renderToScreen = false;

composer.addPass(renderScene);
composer.addPass(bloomPass);

// Lights
const hemilight = new THREE.HemisphereLight(0xffffff, 0x000000);
scene.add(hemilight);

// Fog
const fog = new THREE.FogExp2(0x000000, 0.3);
scene.fog = fog;

// Groups
const vortexGroup = new THREE.Group();
scene.add(vortexGroup);

// Geometries
const tube = new THREE.TubeGeometry(spline, 222, 0.65, 22, true);
const tubeMat = new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide,
    flatShading: true,
});
const tubeMesh = new THREE.Mesh(tube, tubeMat);
vortexGroup.add(tubeMesh);

// Edges
const edges = new THREE.EdgesGeometry(tube, 0.2);
const edgesMat = new THREE.LineBasicMaterial({ color: 0xefefef, linewidth: 2, linecap: 'round' });
const line = new THREE.LineSegments(edges, edgesMat);
vortexGroup.add(line);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.12;

// Functions
const spawnBoxes = () => {
    const boxCount = 200;
    const boxSize = 0.08;
    const box = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
    for ( let i = 0; i < boxCount; i++ ) {
        const boxPos = (i / boxCount ) % 1;
        const color = new THREE.Color().setHSL((boxPos + Math.random()) % 1, 1, 0.5);
        const currentPoint = tube.parameters.path.getPointAt(boxPos);
        const boxRotation = new THREE.Vector3(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() *Math.PI
        );

        const boxEdges = new THREE.EdgesGeometry(box, 0.2);
        const boxEdgesLine = new THREE.LineBasicMaterial({ color: color, linewidth: 2, linecap: 'round' });
        const boxEdgesMesh = new THREE.LineSegments(boxEdges, boxEdgesLine);

        currentPoint.y += (Math.random() - 0.5) * 0.9;
        currentPoint.z += (Math.random() - 0.5) * 0.85;
        boxEdgesMesh.rotation.set(boxRotation.x, boxRotation.y, boxRotation.z);
        boxEdgesMesh.position.copy(currentPoint);

        vortexGroup.add(boxEdgesMesh);
        boxEdgesMeshes.push(boxEdgesMesh);
    }
}

const animateBoxes = () => {
    for (let i = 0; i < boxEdgesMeshes.length; i++) {
        const box = boxEdgesMeshes[i];
        box.rotation.x += (0.01 * Math.random()) % 0.1;
        box.rotation.y += (0.01 * Math.random()) % 0.1;
        box.rotation.z += (0.01 * Math.random()) % 0.1;
    }
}

const cameraFlyThrough = (t) => {
    const speed = t * 0.2;
    const loopDuration = 20 * 1000;
    const normalizeTime = (speed % loopDuration) / loopDuration;

    const currentPoint =tube.parameters.path.getPointAt(normalizeTime);
    const focusPoint = tube.parameters.path.getPointAt((normalizeTime + 0.03) % 1);

    const tubeColor = new THREE.Color().setHSL(1.0 - normalizeTime, 1, 0.5);
    tubeMat.color = tubeColor;

    camera.position.copy(currentPoint);
    camera.lookAt(focusPoint);
}

const animate = (t = 0) => {
    requestAnimationFrame(animate);
    cameraFlyThrough(t);
    animateBoxes();

    // Render
    composer.render(scene, camera);
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
    renderer.setPixelRatio(window.devicePixelRatio);

    bloomPass.setSize(w, h);
}

// DOM
document.body.querySelector("#vortex").appendChild(renderer.domElement);
window.addEventListener('resize', onWindowResize);

// Invoke functions
animate();
spawnBoxes();
