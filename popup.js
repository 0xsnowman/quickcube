const WIDTH = 400, HEIGHT = 400, ASPECT_RATIO = 1.0; // camera settings
const SPACING = 1.5; // spacing between cubes
const SIZE = 3; // count of cubes in a row
const BACKGROUND_COLOR = 0x000000;
const FOREGROUND_COLOR = 0xffffff;

const SHUFFLE_LENGTH = 10; // shuffle count
const SHUFFLE_DEALING_TIME = 300; // face rotation dealing time
const DURATION_FRAMES = 240; // face rotation duration frames
const FRAME_PER_SECOND = 16; // duration frame count per second

let scene, camera, renderer;
let cubes = [];
let randomizerString = [];
let userKeyHistory = [];

// Array to hold the cubes to be animated(rotated)
let animationCubes = []; // array which stores the face cubes rotating
let clockWise = true;

let faceGroup; // THREE.Group() object which stores the face cubes rotating

let keyQueue = [];

const colors = [
    0xff0000, // Right face
    0x00ff00, // Left face
    0x0000ff, // Top face
    0xffff00, // Bottom face
    0x00ffff, // Front face
    0xff00ff  // Back face
];

function init() {

    // Scene, Camera, Renderer setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, ASPECT_RATIO, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(WIDTH, HEIGHT);
    document.getElementById('cube-container').appendChild(renderer.domElement);

    faceGroup = new THREE.Group();

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light
    scene.add(ambientLight);

    // Function to create a cube
    function createCube(x, y, z, logicX, logicY, logicZ) {
        const qcBox = new QCBox(x, y, z, 1, 1, 1, colors, logicX, logicY, logicZ);
        qcBox.addToScene(scene);
        cubes.push(qcBox);
    }

    // const axesHelper = new THREE.AxesHelper(5);
    // scene.add(axesHelper);

    camera.position.set(5.997259969301958, 9, 6.710653683554849);
    camera.lookAt(new THREE.Vector3(0, 0, 0)); // Look at the center of the cube

    for (let x = 0; x < SIZE; x++) {
        for (let y = 0; y < SIZE; y++) {
            for (let z = 0; z < SIZE; z++) {
                createCube((x - 1) * SPACING, (y - 1) * SPACING, (z - 1) * SPACING, x, y, z);
            }
        }
    }

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

// Function to rotate the cubes (one face cubes -> SIZE*SIZE) clockwise/anti-clockwise
function rotateCubes(clockwiseDirection, face, fromUserKeyInput = true) {
    switch (face) {
        case 'b': // back face
        case 'f': // front face
        case 'g': // middle z face
            animationCubes = cubes.filter(cube => cube.position.z === {
                'b': -SPACING,
                'f': SPACING * (SIZE - 2),
                'g': 0
            }[face]).sort((cube1, cube2) => {
                if (cube1.position.x > cube2.position.x) return -1;
                if (cube1.position.x < cube2.position.x) return 1;
                if (cube1.position.y > cube2.position.y) return -1;
                if (cube1.position.y < cube2.position.y) return 1;
                return 0;
            });
            axis = new THREE.Vector3(0, 0, -1);
            break;
        case 'l': // left face
        case 'r': // right face
        case 'j': // middle x face
            animationCubes = cubes.filter(cube => cube.position.x === {
                'l': -SPACING,
                'r': SPACING * (SIZE - 2),
                'j': 0
            }[face]).sort((cube1, cube2) => {
                if (cube1.position.y > cube2.position.y) return -1;
                if (cube1.position.y < cube2.position.y) return 1;
                if (cube1.position.z > cube2.position.z) return -1;
                if (cube1.position.z < cube2.position.z) return 1;
                return 0;
            });
            axis = new THREE.Vector3(-1, 0, 0);
            break;
        case 'd': // down face
        case 'u': // up face
        case 'i': // middle y face
            animationCubes = cubes.filter(cube => cube.position.y === {
                'd': -SPACING,
                'u': SPACING * (SIZE - 2),
                'i': 0
            }[face]).sort((cube1, cube2) => {
                if (cube1.position.z > cube2.position.z) return -1;
                if (cube1.position.z < cube2.position.z) return 1;
                if (cube1.position.x > cube2.position.x) return -1;
                if (cube1.position.x < cube2.position.x) return 1;
                return 0;
            });
            axis = new THREE.Vector3(0, -1, 0);
            break;
        default:
            break;
    }

    faceGroup = new THREE.Group();
    animationCubes.forEach(cube => faceGroup.add(cube.getGroup()));
    scene.add(faceGroup);
    clockWise = true;

    const angle = (clockwiseDirection ? 1 : -1) * Math.PI / 2;
    const duration = DURATION_FRAMES;
    const frameDuration = FRAME_PER_SECOND;
    const totalFrames = duration / frameDuration;
    let progress = 0;

    const originalPositions = animationCubes.map(cube => cube.position.clone());
    const newPositions = clockwiseDirection ? [
        originalPositions[2], originalPositions[5], originalPositions[8],
        originalPositions[1], originalPositions[4], originalPositions[7],
        originalPositions[0], originalPositions[3], originalPositions[6]
    ] : [
        originalPositions[6], originalPositions[3], originalPositions[0],
        originalPositions[7], originalPositions[4], originalPositions[1],
        originalPositions[8], originalPositions[5], originalPositions[2]
    ];

    function animateRotation() {
        if (progress < totalFrames) {
            requestAnimationFrame(animateRotation);
            progress++;
            const rotationAmount = angle * frameDuration / duration;
            const quaternion = new THREE.Quaternion().setFromAxisAngle(axis, rotationAmount);
            faceGroup.applyQuaternion(quaternion);
        } else {
            const finalQuaternion = new THREE.Quaternion().setFromAxisAngle(axis, angle);
            faceGroup.children.forEach(cubeInternalGroup => {
                cubeInternalGroup.applyQuaternion(finalQuaternion);
                cubeInternalGroup.updateMatrixWorld(true);
                animationCubes.forEach((cube, i) => {
                    if (cube.getGroup().uuid === cubeInternalGroup.uuid) {
                        cube.setGroup(cubeInternalGroup);
                        cube.position.copy(newPositions[i]);
                    }
                });
            });

            while (faceGroup.children.length > 0) {
                faceGroup.remove(faceGroup.children[0]);
            }
            scene.remove(faceGroup);

            animationCubes.forEach(cube => cube.addToScene(scene));

            removeHandledKey();

            if (fromUserKeyInput && checkComplete()) {
                stopTimer();
                keyQueue = [];
                userKeyHistory = [];
                alert('Congratulations!');
            }
        }
    }

    animateRotation();
}

// Function to navigate the cubes (entire cubes -> SIZE*SIZE*SIZE) clockwise/anti-clockwise
function navigateCubes(clockwiseDirection, face) {
    let axis;

    switch (face) {
        case 'arrowleft':
        case 'arrowright':
            animationCubes = cubes.sort((cube1, cube2) => {
                if (cube1.position.y > cube2.position.y) return -1;
                if (cube1.position.y < cube2.position.y) return 1;
                if (cube1.position.z > cube2.position.z) return -1;
                if (cube1.position.z < cube2.position.z) return 1;
                if (cube1.position.x > cube2.position.x) return -1;
                if (cube1.position.x < cube2.position.x) return 1;
                return 0;
            });
            axis = new THREE.Vector3(0, -1, 0);
            break;

        case 'arrowup':
        case 'arrowdown':
            animationCubes = cubes.sort((cube1, cube2) => {
                if (cube1.position.x > cube2.position.x) return -1;
                if (cube1.position.x < cube2.position.x) return 1;
                if (cube1.position.y > cube2.position.y) return -1;
                if (cube1.position.y < cube2.position.y) return 1;
                if (cube1.position.z > cube2.position.z) return -1;
                if (cube1.position.z < cube2.position.z) return 1;
                return 0;
            });
            axis = new THREE.Vector3(-1, 0, 0);
            break;
        default:
            break;
    }

    faceGroup = new THREE.Group();

    // Add cubes to faceGroup
    animationCubes.forEach(cube => {
        faceGroup.add(cube.getGroup());
    });
    scene.add(faceGroup);

    const angle = (clockwiseDirection ? 1 : -1) * Math.PI / 2; // 90 degrees

    let progress = 0;
    const duration = DURATION_FRAMES; // Duration of animation in milliseconds
    const frameDuration = FRAME_PER_SECOND; // Assuming 60fps, ~16ms per frame
    const totalFrames = duration / frameDuration;

    // Store original positions for animation
    const originalPositions = animationCubes.map(cube => cube.position.clone());

    let newPositions = [];

    for (let i = 0; i < SIZE; ++i) {
        // Calculate new positions
        newPositions.push(...(clockwiseDirection ? [
            originalPositions[i * 9 + 2], originalPositions[i * 9 + 5], originalPositions[i * 9 + 8],
            originalPositions[i * 9 + 1], originalPositions[i * 9 + 4], originalPositions[i * 9 + 7],
            originalPositions[i * 9 + 0], originalPositions[i * 9 + 3], originalPositions[i * 9 + 6]
        ] : [
            originalPositions[i * 9 + 6], originalPositions[i * 9 + 3], originalPositions[i * 9 + 0],
            originalPositions[i * 9 + 7], originalPositions[i * 9 + 4], originalPositions[i * 9 + 1],
            originalPositions[i * 9 + 8], originalPositions[i * 9 + 5], originalPositions[i * 9 + 2]
        ]));
    }

    clockWise = true;

    function animateRotation() {
        if (progress < totalFrames) {
            requestAnimationFrame(animateRotation);
            progress++;

            const rotationAmount = angle * frameDuration / duration;

            const quaternion = new THREE.Quaternion();
            quaternion.setFromAxisAngle(axis, rotationAmount);

            faceGroup.applyQuaternion(quaternion);
        } else {
            // Final rotation adjustment
            const finalQuaternion = new THREE.Quaternion();
            finalQuaternion.setFromAxisAngle(axis, angle);

            faceGroup.children.forEach(cubeInternalGroup => {
                // Apply the final rotation to each cube
                cubeInternalGroup.applyQuaternion(finalQuaternion);

                // Update the cube's world position and rotation
                cubeInternalGroup.updateMatrixWorld(true);

                // Apply to animation cubes
                animationCubes.forEach((cube, i) => {
                    if (cube.getGroup().uuid === cubeInternalGroup.uuid) {
                        cube.setGroup(cubeInternalGroup);
                        cube.position.copy(newPositions[i]);
                    }
                });
            });

            // Clear the faceGroup
            while (faceGroup.children.length > 0) {
                faceGroup.remove(faceGroup.children[0]);
            }
            scene.remove(faceGroup);

            animationCubes.forEach((cube, i) => {
                cube.addToScene(scene);
            });

            removeHandledKey();
        }
    }

    animateRotation();
}

document.addEventListener('DOMContentLoaded', init);

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('shuffle').addEventListener('click', function () {
        shuffle();
    });
});

function shuffle() {
    const shuffleString = 'frubld';
    for (let i = 0; i < SHUFFLE_LENGTH; ++i)
        randomizerString.push(((Number(Math.random()) * 100).toFixed() % 12));
    copyOfRandomizerString = randomizerString;
    console.log(randomizerString);

    const timerID = setInterval(() => {
        if (randomizerString.length === 0) {
            clearInterval(timerID);
            return;
        }
        const randomShuffleKey = randomizerString[0];
        rotateCubes((randomShuffleKey % 6) < 3, shuffleString[randomShuffleKey % 6], false);
        randomizerString = randomizerString.slice(1, randomizerString.length);
    }, SHUFFLE_DEALING_TIME);
}

document.addEventListener('keyup', function (event) {
    const validKeys = ['f', 'b', 'r', 'l', 'u', 'd', 'g', 'i', 'j', ' ', 'arrowleft', 'arrowright', 'arrowup', 'arrowdown', 'enter'];

    if (validKeys.includes(event.key.toLowerCase())) {
        if (keyQueue.length === 0) {
            handleKey(event.key.toLocaleLowerCase());
        }
        
        if (keyQueue.length === 0 && event.key.toLowerCase() === ' ')
            return;

        keyQueue.push(event.key.toLowerCase());

        if (event.key.toLowerCase() !== 'enter')
            userKeyHistory.push(event.key.toLowerCase());
    }
});

function removeHandledKey() {
    if (keyQueue.length === 0) return;
    keyQueue = keyQueue.slice(1, keyQueue.length);

    console.log(keyQueue);
    if (keyQueue.length > 0) {
        handleKey(keyQueue[0]);
    }
}

function handleKey(key) {
    switch (key.toLowerCase()) {
        // control
        case 'f':
        case 'r':
        case 'u':
            rotateCubes(clockWise, key.toLowerCase());
            break;
        case 'b':
        case 'l':
        case 'd':
            rotateCubes(!clockWise, key.toLowerCase());
            break;
        case 'g':
        case 'j':
        case 'i':
            rotateCubes(clockWise, key.toLowerCase());
            break;
        case ' ':
            clockWise = false;
            removeHandledKey();
            break;

        // navigation
        case 'arrowleft':
            navigateCubes(clockWise, key.toLowerCase());
            break;
        case 'arrowright':
            navigateCubes(!clockWise, key.toLowerCase());
            break;
        case 'arrowup':
            navigateCubes(clockWise, key.toLowerCase());
            break;
        case 'arrowdown':
            navigateCubes(!clockWise, key.toLowerCase());
            break;

        // setting
        case 'enter':
            shuffle();
            break;
        default:
            break;
    };
};

function checkComplete() {
    let completed = true;

    cubes.forEach((cube) => {
        if ((cube.logicX - 1) * SPACING !== cube.position.x || (cube.logicY - 1) * SPACING !== cube.position.y || (cube.logicZ - 1) * SPACING !== cube.position.z) {
            completed = false;
        }
    });

    return completed;
}