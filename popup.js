const WIDTH = 300, HEIGHT = 300, ASPECT_RATIO = 1.0;
const SPACING = 1.5; // spacing between cubes
const SIZE = 3;
const FRONT = true;
const BACK = false;
const LEFT = true;
const RIGHT = false;
const UP = true;
const DOWN = false;

let scene, camera, renderer;
let cubes = [];

// Array to hold the cubes to be animated(rotated)
let animationCubes = [];
let clockWise = true;

const colors = [
    0xff0000, // Right face
    0x00ff00, // Left face
    0x0000ff, // Top face
    0xffff00, // Bottom face
    0x00ffff, // Front face
    0xff00ff  // Back face
];

function randomColors() {
    const colors = [];
    for (let i = 0; i < 6; i++) {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        colors.push(`rgb(${r}, ${g}, ${b})`);
    }
    return colors;
}


function init() {
    const materials = [
        new THREE.MeshBasicMaterial({ color: 0xff3333 }), // Right face
        new THREE.MeshBasicMaterial({ color: 0x33ff33 }), // Left face
        new THREE.MeshBasicMaterial({ color: 0x3333ff }), // Top face
        new THREE.MeshBasicMaterial({ color: 0xffff33 }), // Bottom face
        new THREE.MeshBasicMaterial({ color: 0x33ffff }), // Front face
        new THREE.MeshBasicMaterial({ color: 0xff33ff })  // Back face
    ];

    // Scene, Camera, Renderer setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, ASPECT_RATIO, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(WIDTH, HEIGHT);
    document.getElementById('cube-container').appendChild(renderer.domElement);

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light
    scene.add(ambientLight);

    // Function to create a cube
    function createCube(x, y, z) {
        const qcBox = new QCBox(x, y, z, 1, 1, 1, colors);
        qcBox.addToScene(scene);
        cubes.push(qcBox);
    }

    camera.position.set(9, 9, 9);
    camera.lookAt(new THREE.Vector3(0.5, 0.5, 0.5)); // Look at the center of the cube

    for (let x = 0; x < SIZE; x++) {
        for (let y = 0; y < SIZE; y++) {
            for (let z = 0; z < SIZE; z++) {
                createCube(x * SPACING, y * SPACING, z * SPACING);
            }
        }
    }

    // Camera positioning
    camera.position.z = 10;

    // Handle window resize
    function onWindowResize() {
        // camera.aspect = window.innerWidth / window.innerHeight;
        camera.aspect = ASPECT_RATIO;
        camera.updateProjectionMatrix();
        // renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setSize(WIDTH, HEIGHT);
    }

    window.addEventListener('resize', onWindowResize, false);

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();
}

// rotateXCubes : z, rotateYCubes: x, rotateZCubes: y

// Function to rotate the X cubes (front or back 9 cubes) clockwise
function rotateXCubes(clockwiseDirection, frontOrBack) {
    
    animationCubes = cubes
        .filter(cube => cube.position.z === (frontOrBack ? 0 : SPACING * (SIZE - 1)))
        .sort((cube1, cube2) => {
            // Sort by cube.position.x descending
            if (cube1.position.x > cube2.position.x) return -1;
            if (cube1.position.x < cube2.position.x) return 1;

            // If cube.position.x are equal, sort by cube.position.z descending
            if (cube1.position.y > cube2.position.y) return -1;
            if (cube1.position.y < cube2.position.y) return 1;

            // If both cube.position.x and cube.position.z are equal, retain order
            return 0;
        });
        
    const angle = (clockwiseDirection ? 1 : -1) * Math.PI / 2; // 90 degrees

    // Store original positions for animation
    const originalPositions = animationCubes.map(cube => cube.position.clone());
    const originalRotations = animationCubes.map(cube => cube.rotation.clone());

    // Calculate new positions
    const newPositions = clockwiseDirection ? [
        originalPositions[6], originalPositions[3], originalPositions[0],
        originalPositions[7], originalPositions[4], originalPositions[1],
        originalPositions[8], originalPositions[5], originalPositions[2]
    ] : [
        originalPositions[2], originalPositions[5], originalPositions[8],
        originalPositions[1], originalPositions[4], originalPositions[7],
        originalPositions[0], originalPositions[3], originalPositions[6]
    ];

    clockWise = true;

    // Animate rotation
    let progress = 0;
    const duration = 100; // Duration of animation in milliseconds

    function animateRotation() {
        if (progress < duration) {
            requestAnimationFrame(animateRotation);
            progress += 16; // Assuming 60fps, ~16ms per frame
            const t = progress / duration;

            // Rotate and interpolate positions
            animationCubes.forEach((cube, i) => {
                // Interpolate position
                cube.position.lerpVectors(originalPositions[i], newPositions[i], t);
                // Rotate around Z axis
                cube.setRotation(cube.rotation.x, cube.rotation.y, originalRotations[i].z + angle * t);
            });

            renderer.render(scene, camera);
        } else {
            // Ensure final position and rotation
            animationCubes.forEach((cube, i) => {
                cube.position.copy(newPositions[i]);
                cube.setRotation(cube.rotation.x, cube.rotation.y, originalRotations[i].z + angle); // Reset rotation
            });

            renderer.render(scene, camera);
        }
    }

    animateRotation();
}

// Function to rotate the Y cubes (left or right 9 cubes) clockwise
function rotateYCubes(clockwiseDirection, leftOrRight) {

    animationCubes = cubes
        .filter(cube => cube.position.x === (leftOrRight ? 0 : SPACING * (SIZE - 1)))
        .sort((cube1, cube2) => {
            // Sort by cube.position.x descending
            if (cube1.position.y > cube2.position.y) return -1;
            if (cube1.position.y < cube2.position.y) return 1;

            // If cube.position.x are equal, sort by cube.position.z descending
            if (cube1.position.z > cube2.position.z) return -1;
            if (cube1.position.z < cube2.position.z) return 1;

            // If both cube.position.x and cube.position.z are equal, retain order
            return 0;
        });

    const angle = (clockwiseDirection ? 1 : -1) * Math.PI / 2; // 90 degrees

    // Store original positions for animation
    const originalPositions = animationCubes.map(cube => cube.position.clone());
    const originalRotations = animationCubes.map(cube => cube.rotation.clone());

    // Calculate new positions
    const newPositions = clockwiseDirection ? [
        originalPositions[6], originalPositions[3], originalPositions[0],
        originalPositions[7], originalPositions[4], originalPositions[1],
        originalPositions[8], originalPositions[5], originalPositions[2]
    ] : [
        originalPositions[2], originalPositions[5], originalPositions[8],
        originalPositions[1], originalPositions[4], originalPositions[7],
        originalPositions[0], originalPositions[3], originalPositions[6]
    ];

    clockWise = true;

    // Animate rotation
    let progress = 0;
    const duration = 100; // Duration of animation in milliseconds

    function animateRotation() {
        if (progress < duration) {
            requestAnimationFrame(animateRotation);
            progress += 16; // Assuming 60fps, ~16ms per frame
            const t = progress / duration;

            // Rotate and interpolate positions
            animationCubes.forEach((cube, i) => {
                // Interpolate position
                cube.position.lerpVectors(originalPositions[i], newPositions[i], t);
                // Rotate around X axis
                cube.setRotation(originalRotations[i].x + angle * t, cube.rotation.y, cube.rotation.z);
            });

            renderer.render(scene, camera);
        } else {
            // Ensure final position and rotation
            animationCubes.forEach((cube, i) => {
                cube.setPosition(newPositions[i].x, newPositions[i].y, newPositions[i].z);
                cube.setRotation(originalRotations[i].x + angle, cube.rotation.y, cube.rotation.z); // Reset rotation
            });

            renderer.render(scene, camera);
        }
    }

    animateRotation();
}

// Function to rotate the Z cubes (up or down 9 cubes) clockwise
function rotateZCubes(clockwiseDirection, upOrDown) {

    animationCubes = cubes
        .filter(cube => cube.position.y === (upOrDown ? 0 : SPACING * (SIZE - 1)))
        .sort((cube1, cube2) => {
            // Sort by cube.position.x descending
            if (cube1.position.z > cube2.position.z) return -1;
            if (cube1.position.z < cube2.position.z) return 1;

            // If cube.position.x are equal, sort by cube.position.z descending
            if (cube1.position.x > cube2.position.x) return -1;
            if (cube1.position.x < cube2.position.x) return 1;

            // If both cube.position.x and cube.position.z are equal, retain order
            return 0;
        });
    
    const angle = (clockwiseDirection ? 1 : -1) * Math.PI / 2; // 90 degrees

    // Store original positions for animation
    const originalPositions = animationCubes.map(cube => cube.position.clone());
    const originalRotations = animationCubes.map(cube => cube.rotation.clone());

    // Calculate new positions
    const newPositions = clockwiseDirection ? [
        originalPositions[6], originalPositions[3], originalPositions[0],
        originalPositions[7], originalPositions[4], originalPositions[1],
        originalPositions[8], originalPositions[5], originalPositions[2]
    ] : [
        originalPositions[2], originalPositions[5], originalPositions[8],
        originalPositions[1], originalPositions[4], originalPositions[7],
        originalPositions[0], originalPositions[3], originalPositions[6]
    ];

    clockWise = true;

    // Animate rotation
    let progress = 0;
    const duration = 100; // Duration of animation in milliseconds

    function animateRotation() {
        if (progress < duration) {
            requestAnimationFrame(animateRotation);
            progress += 16; // Assuming 60fps, ~16ms per frame
            const t = progress / duration;

            // Rotate and interpolate positions
            animationCubes.forEach((cube, i) => {
                // Interpolate position
                cube.position.lerpVectors(originalPositions[i], newPositions[i], t);
                // Rotate around Y axis
                cube.setRotation(cube.rotation.x, originalRotations[i].y + angle * t, cube.rotation.z);
            });

            renderer.render(scene, camera);
        } else {
            // Ensure final position and rotation
            animationCubes.forEach((cube, i) => {
                // cube.position.copy(newPositions[i]);
                cube.setPosition(newPositions[i].x, newPositions[i].y, newPositions[i].z);
                cube.setRotation(cube.rotation.x, originalRotations[i].y + angle, cube.rotation.z); // Reset rotation
            });

            renderer.render(scene, camera);
        }
    }

    animateRotation();
}

document.addEventListener('DOMContentLoaded', init);

document.addEventListener('keyup', function (event) {
    switch (event.key) {
        case 'F':
        case 'f':
            rotateXCubes(clockWise, FRONT);
            break;
        case 'B':
        case 'b':
            rotateXCubes(clockWise, BACK);
            break;
        case 'L':
        case 'l':
            rotateYCubes(clockWise, LEFT);
            break;
        case 'R':
        case 'r':
            rotateYCubes(clockWise, RIGHT);
            break;
        case 'U':
        case 'u':
            rotateZCubes(clockWise, UP);
            break;
        case 'D':
        case 'd':
            rotateZCubes(clockWise, DOWN);
            break;
        case ' ':
            clockWise = false;
            break;
    };
});

let isMouseDown = false;
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousedown', onMouseDown);
document.addEventListener('mouseup', onMouseUp);
document.addEventListener('mousemove', onMouseMove);

function onMouseDown(event) {
    isMouseDown = true;
    mouseX = event.clientX;
    mouseY = event.clientY;
}

function onMouseUp() {
    isMouseDown = false;
}

function onMouseMove(event) {
    if (isMouseDown) {
        const deltaX = event.clientX - mouseX;
        const deltaY = event.clientY - mouseY;

        // Clamp vertical rotation to avoid flipping
        camera.rotation.x += deltaX / 100;
        camera.rotation.y += deltaY / 100;

        mouseX = event.clientX;
        mouseY = event.clientY;
    }
}

// Variables for zoom control
const zoomSpeed = 0.1; // Adjust zoom speed as needed
const minZoom = 2; // Minimum distance to the origin
const maxZoom = 20; // Maximum distance to the origin

// Event listener for mouse scroll events
document.addEventListener('wheel', onDocumentMouseWheel);

function onDocumentMouseWheel(event) {
    // Calculate zoom direction and amount
    const delta = Math.sign(event.deltaY); // Normalize scroll direction (1 for zoom in, -1 for zoom out)

    // Adjust camera position based on zoom direction and speed
    camera.position.z -= delta * zoomSpeed;

    // Clamp camera position to prevent zooming too close or too far
    camera.position.z = Math.max(minZoom, Math.min(maxZoom, camera.position.z));
}