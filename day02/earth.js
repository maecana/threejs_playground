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
const far = 50;
const _earthTexturePath = '../public/assets/textures/earthmap1k.jpg';
const _earthBumpTexturePath = '../public/assets/textures/earthbump1k.jpg';
const _cloudsTransTexturePath = '../public/assets/textures/earthcloudmaptrans.jpg';
const _cloudsTexturePath = '../public/assets/textures/earthcloudmap.jpg';
const _lightsTexturePath = '../public/assets/textures/earthlights1k.jpg';
const _specsTexturePath = '../public/assets/textures/earthspec1k.jpg';

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

renderer.setSize(w, h);

// Scenes
const scene = new THREE.Scene();

// Cameras
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 3;

// Groups
const globeGroup = new THREE.Group();
// Add axial tilt / obliquity
globeGroup.rotation.z = 23.4 * Math.PI / 180;
scene.add(globeGroup);

// Lights
// Directional Light
const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
sunLight.position.set(-2, 0.5, 1.5);
scene.add(sunLight);

// Textures
const _textureLoader = new THREE.TextureLoader();
const EarthTexture = _textureLoader.load(_earthTexturePath);
const EarthBumpTexture = _textureLoader.load(_earthBumpTexturePath);
const CloudsTexture = _textureLoader.load(_cloudsTexturePath);
const CloudsTransTexture = _textureLoader.load(_cloudsTransTexturePath);
const LightsTexture = _textureLoader.load(_lightsTexturePath);
const SpecTexture = _textureLoader.load(_specsTexturePath);

// Models
// Plain Earth
const globe = new THREE.IcosahedronGeometry(1, 10);
const globeMat = new THREE.MeshPhongMaterial({
    map: EarthTexture,
    bumpMap: EarthBumpTexture,
    bumpScale: 1,
    specularMap: SpecTexture,
});
const globeMesh = new THREE.Mesh(globe, globeMat);
globeGroup.add(globeMesh);

// Clouds
const cloudsMat = new THREE.MeshStandardMaterial({
    map: CloudsTexture,
    transparent: true,
    opacity: 0.5,
    alphaMap: CloudsTransTexture,
    blending: THREE.AdditiveBlending,
});
const cloudsMesh = new THREE.Mesh(globe, cloudsMat);
cloudsMesh.scale.addScalar(0.003);
globeGroup.add(cloudsMesh);

// Lights
const lightsMat = new THREE.MeshBasicMaterial({
    map: LightsTexture,
    blending: THREE.AdditiveBlending,
});
const lightsMesh = new THREE.Mesh(globe, lightsMat);
globeGroup.add(lightsMesh);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.12;

// Function Declarations
const animate = () => {
    const yRotationSpeed = 0.003;

    requestAnimationFrame(animate);
    
    globeMesh.rotation.y += yRotationSpeed;
    lightsMesh.rotation.y += yRotationSpeed;
    cloudsMesh.rotation.y += yRotationSpeed + 0.0009;

    controls.update();
    renderer.render(scene, camera);
}

const onWindowResize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const aspect = w / h;

    if(camera.aspect !== aspect) {
        camera.aspect = aspect;
        camera.updateProjectionMatrix();
    }

    renderer.setSize(w, h);
    renderer.setPixelRatio(window.devicePixelRatio);
}

// DOM
document.body.querySelector('#earth').appendChild(renderer.domElement);
window.addEventListener('resize', onWindowResize);

// Invoke Methods
animate();
onWindowResize();