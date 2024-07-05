const WIDTH = 400, HEIGHT = 400, ASPECT_RATIO = 1.0;
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

let randomizerString = [];

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

    // Scene, Camera, Renderer setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, ASPECT_RATIO, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(WIDTH, HEIGHT);
    document.getElementById('cube-container').appendChild(renderer.domElement);

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light
    scene.add(ambientLight);

    /* -- experiment -- */

    /* -- experiment -- */

    // Function to create a cube
    function createCube(x, y, z, logicX, logicY, logicZ) {
        const qcBox = new QCBox(x, y, z, 1, 1, 1, colors, logicX, logicY, logicZ);
        qcBox.addToScene(scene);
        cubes.push(qcBox);
    }

    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    camera.position.set(9, 9, 9);
    camera.lookAt(new THREE.Vector3(0, 0, 0)); // Look at the center of the cube

    for (let x = 0; x < SIZE; x++) {
        for (let y = 0; y < SIZE; y++) {
            for (let z = 0; z < SIZE; z++) {
                createCube(x * SPACING, y * SPACING, z * SPACING, x, y, z);
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

    // Shuffler
}

// rotateFBCubes : z, rotateLRCubes: x, rotateUDCubes: y

// Function to rotate the FB cubes (front or back 9 cubes) clockwise
function rotateFBCubes(clockwiseDirection, frontOrBack) {
    animationCubes = cubes
        .filter(cube => cube.position.z === (frontOrBack ? 0 : SPACING * (SIZE - 1)))
        .sort((cube1, cube2) => {
            // Sort by cube.position.x descending
            if (cube1.position.x > cube2.position.x) return -1;
            if (cube1.position.x < cube2.position.x) return 1;

            // If cube.position.x are equal, sort by cube.position.y descending
            if (cube1.position.y > cube2.position.y) return -1;
            if (cube1.position.y < cube2.position.y) return 1;

            // If both cube.position.x and cube.position.y are equal, retain order
            return 0;
        });

    const angle = (clockwiseDirection ? 1 : -1) * Math.PI / 2; // 90 degrees

    // Store original positions for animation
    const originalPositions = animationCubes.map(cube => cube.position.clone());
    const originalQuaternions = animationCubes.map(cube => cube.group.quaternion.clone());

    // Calculate rotation axis
    const axis = new THREE.Vector3(0, 0, 1); // Z-axis

    // Create a quaternion for rotating around the axis
    const deltaQuaternion = new THREE.Quaternion().setFromAxisAngle(axis, angle);

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

    let progress = 0;
    const duration = 2000; // Duration of animation in milliseconds

    function animateRotation() {
        if (progress < duration) {
            requestAnimationFrame(animateRotation);
            progress += 16; // Assuming 60fps, ~16ms per frame
            const t = progress / duration;

            // Interpolate positions
            animationCubes.forEach((cube, i) => {
                cube.position.lerpVectors(originalPositions[i], newPositions[i], t);
                // const originalQuaternion = originalQuaternions[cubes.indexOf(cube)];
                // cube.quaternion.slerp(new THREE.Quaternion().copy([i]).multiply(deltaQuaternion), t);
                cube.updateMeshes();
            });

            renderer.render(scene, camera);
        } else {
            // Ensure final position and rotation
            animationCubes.forEach((cube, i) => {
                cube.position.copy(newPositions[i]);
                cube.applyQuaternion(deltaQuaternion.clone());
                // cube.group.quaternion.copy(originalQuaternions[i].multiply(deltaQuaternion));
            });

            renderer.render(scene, camera);
        }
    }

    animateRotation();
}

// Function to rotate the LR cubes (left or right 9 cubes) clockwise
function rotateLRCubes(clockwiseDirection, leftOrRight) {

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
    const originalQuaternions = animationCubes.map(cube => cube.group.quaternion.clone());

    // Calculate rotation axis
    const axis = new THREE.Vector3(1, 0, 0); // X-axis

    // Create a quaternion for rotating around the axis
    const deltaQuaternion = new THREE.Quaternion().setFromAxisAngle(axis, angle);

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

    let progress = 0;
    const duration = 2000; // Duration of animation in milliseconds

    function animateRotation() {
        if (progress < duration) {
            requestAnimationFrame(animateRotation);
            progress += 16; // Assuming 60fps, ~16ms per frame
            const t = progress / duration;

            // Interpolate positions
            animationCubes.forEach((cube, i) => {
                cube.position.lerpVectors(originalPositions[i], newPositions[i], t);
                // const originalQuaternion = originalQuaternions[cubes.indexOf(cube)];
                // cube.quaternion.slerp(new THREE.Quaternion().copy(originalQuaternions[i]).multiply(deltaQuaternion), t);
                cube.updateMeshes();
            });

            renderer.render(scene, camera);
        } else {
            // Ensure final position and rotation
            animationCubes.forEach((cube, i) => {
                cube.position.copy(newPositions[i]);
                cube.applyQuaternion(deltaQuaternion.clone());
                // cube.group.quaternion.copy(originalQuaternions[i].multiply(deltaQuaternion));
            });

            renderer.render(scene, camera);
        }
    }

    animateRotation();
}

// Function to rotate the UD cubes (up or down 9 cubes) clockwise
function rotateUDCubes(clockwiseDirection, upOrDown) {

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
    const originalQuaternions = animationCubes.map(cube => cube.group.quaternion.clone());

    // Calculate rotation axis
    const axis = new THREE.Vector3(0, 1, 0); // Y-axis

    // Create a quaternion for rotating around the axis
    const deltaQuaternion = new THREE.Quaternion().setFromAxisAngle(axis, angle);

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

    let progress = 0;
    const duration = 2000; // Duration of animation in milliseconds

    function animateRotation() {
        if (progress < duration) {
            requestAnimationFrame(animateRotation);
            progress += 16; // Assuming 60fps, ~16ms per frame
            const t = progress / duration;

            // Interpolate positions
            animationCubes.forEach((cube, i) => {
                cube.position.lerpVectors(originalPositions[i], newPositions[i], t);
                // const originalQuaternion = originalQuaternions[cubes.indexOf(cube)];
                // cube.quaternion.slerp(new THREE.Quaternion().copy(originalQuaternions[i]).multiply(deltaQuaternion), t);
                cube.updateMeshes();
            });

            renderer.render(scene, camera);
        } else {
            // Ensure final position and rotation
            animationCubes.forEach((cube, i) => {
                cube.position.copy(newPositions[i]);
                cube.applyQuaternion(deltaQuaternion.clone());
                // cube.group.quaternion.copy(originalQuaternions[i].multiply(deltaQuaternion));
            });

            renderer.render(scene, camera);
        }
    }

    animateRotation();
}

document.addEventListener('DOMContentLoaded', init);

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('shuffle').addEventListener('click', function () {
        for (let i = 0; i < 20; ++i) {
            randomizerString.push(((Number(Math.random()) * 100).toFixed() % 12));
        }
        const timerID = setInterval(() => {
            if (randomizerString.length === 0) {
                clearInterval(timerID);
                return;
            }

            const randomShuffleKey = randomizerString[0];
            switch (randomShuffleKey % 3) {
                case 0:
                    rotateFBCubes(randomShuffleKey % 2 === 0, randomShuffleKey < 6);
                    break;
                case 1:
                    rotateLRCubes(randomShuffleKey % 2 === 0, randomShuffleKey < 6);
                    break;
                case 2:
                    rotateUDCubes(randomShuffleKey % 2 === 0, randomShuffleKey < 6);
                    break;

                default:
                    break;
            }

            randomizerString = randomizerString.slice(1, randomizerString.length);
        }, 1000);
    });
});

document.addEventListener('keyup', function (event) {
    switch (event.key) {
        case 'F':
        case 'f':
            rotateFBCubes(clockWise, FRONT);
            break;
        case 'B':
        case 'b':
            rotateFBCubes(clockWise, BACK);
            break;
        case 'L':
        case 'l':
            rotateLRCubes(clockWise, LEFT);
            break;
        case 'R':
        case 'r':
            rotateLRCubes(clockWise, RIGHT);
            break;
        case 'U':
        case 'u':
            rotateUDCubes(clockWise, UP);
            break;
        case 'D':
        case 'd':
            rotateUDCubes(clockWise, DOWN);
            break;
        case ' ':
            clockWise = false;
            break;
    };
});