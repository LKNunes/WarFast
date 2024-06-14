import * as THREE from 'https://unpkg.com/three@0.128.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.128.0/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
const aspect = window.innerWidth / window.innerHeight;

const camera = new THREE.OrthographicCamera(
    -aspect * 100, aspect * 100, 100, -100, 0.1, 1000
);
camera.position.set(0, 200, 0);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableRotate = false;
controls.enableZoom = true;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 50, 50).normalize();
scene.add(directionalLight);

const loader = new THREE.TextureLoader();
loader.load('/4020317.jpg', function(texture) {
    const geometry = new THREE.PlaneGeometry(200, 100);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    const territories = [
        { name: "Territory 1", points: [[-50, 25], [-40, 25], [-45, 35]] },
        { name: "Territory 2", points: [[-40, 25], [-30, 25], [-35, 35]] },
        { name: "Territory 3", points: [[-30, 25], [-20, 25], [-25, 35]] },
        { name: "Territory 4", points: [[-20, 25], [-10, 25], [-15, 35]] },
        { name: "Territory 5", points: [[-10, 25], [0, 25], [-5, 35]] },
        { name: "Territory 6", points: [[0, 25], [10, 25], [5, 35]] },
        { name: "Territory 7", points: [[10, 25], [20, 25], [15, 35]] },
        { name: "Territory 8", points: [[20, 25], [30, 25], [25, 35]] },
        { name: "Territory 9", points: [[30, 25], [40, 25], [35, 35]] },
        { name: "Territory 10", points: [[40, 25], [50, 25], [45, 35]] },
        { name: "Territory 11", points: [[-50, -5], [-40, -5], [-45, 5]] },
        { name: "Territory 12", points: [[-40, -5], [-30, -5], [-35, 5]] },
        { name: "Territory 13", points: [[-30, -5], [-20, -5], [-25, 5]] },
        { name: "Territory 14", points: [[-20, -5], [-10, -5], [-15, 5]] },
        { name: "Territory 15", points: [[-10, -5], [0, -5], [-5, 5]] },
        { name: "Territory 16", points: [[0, -5], [10, -5], [5, 5]] },
        { name: "Territory 17", points: [[10, -5], [20, -5], [15, 5]] },
        { name: "Territory 18", points: [[20, -5], [30, -5], [25, 5]] },
        { name: "Territory 19", points: [[30, -5], [40, -5], [35, 5]] },
        { name: "Territory 20", points: [[40, -5], [50, -5], [45, 5]] },
        { name: "Territory 21", points: [[-50, -35], [-40, -35], [-45, -25]] },
        { name: "Territory 22", points: [[-40, -35], [-30, -35], [-35, -25]] },
        { name: "Territory 23", points: [[-30, -35], [-20, -35], [-25, -25]] },
        { name: "Territory 24", points: [[-20, -35], [-10, -35], [-15, -25]] }
    ];

    territories.forEach(territory => {
        const shape = new THREE.Shape();
        territory.points.forEach((point, index) => {
            if (index === 0) {
                shape.moveTo(point[0], point[1]);
            } else {
                shape.lineTo(point[0], point[1]);
            }
        });
        shape.lineTo(territory.points[0][0], territory.points[0][1]);

        const geometry = new THREE.ShapeGeometry(shape);
        const material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff, side: THREE.DoubleSide });
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
    });
});

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    const aspect = window.innerWidth / window.innerHeight;
    camera.left = -aspect * 100;
    camera.right = aspect * 100;
    camera.top = 100;
    camera.bottom = -100;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
