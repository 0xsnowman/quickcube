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

let faceGroup;

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
                createCube((x - 1) * SPACING, (y - 1) * SPACING, (z - 1) * SPACING, x, y, z);
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

function showEulers() {
    cubes.forEach((cube, i) => {
        if (cube.logicX === 2 && cube.logicY === 2 && cube.logicZ === 2) {
            console.log(cube.rotation.x, cube.rotation.y, cube.rotation.z);
        }
    });
}

// Function to rotate the cubes (9 cubes) clockwise
function rotateCubes(clockwiseDirection, face) {
    let axis;

    switch (face) {
        case 'b': //
            animationCubes = cubes.filter(cube => cube.position.z === -SPACING).sort((cube1, cube2) => {
                // Sort by cube.position.x descending
                if (cube1.position.x > cube2.position.x) return -1;
                if (cube1.position.x < cube2.position.x) return 1;
    
                // If cube.position.x are equal, sort by cube.position.z descending
                if (cube1.position.y > cube2.position.y) return -1;
                if (cube1.position.y < cube2.position.y) return 1;
    
                // If both cube.position.x and cube.position.z are equal, retain order
                return 0;
            });
            axis = new THREE.Vector3(0, 0, -1);
            break;
        case 'f':
            animationCubes = cubes.filter(cube => cube.position.z === SPACING * (SIZE - 2)).sort((cube1, cube2) => {
                // Sort by cube.position.x descending
                if (cube1.position.x > cube2.position.x) return -1;
                if (cube1.position.x < cube2.position.x) return 1;
    
                // If cube.position.x are equal, sort by cube.position.z descending
                if (cube1.position.y > cube2.position.y) return -1;
                if (cube1.position.y < cube2.position.y) return 1;
    
                // If both cube.position.x and cube.position.z are equal, retain order
                return 0;
            });
            axis = new THREE.Vector3(0, 0, -1);
            break;
        case 'l': //
            animationCubes = cubes.filter(cube => cube.position.x === -SPACING).sort((cube1, cube2) => {
                // Sort by cube.position.x descending
                if (cube1.position.y > cube2.position.y) return -1;
                if (cube1.position.y < cube2.position.y) return 1;

                // If cube.position.x are equal, sort by cube.position.z descending
                if (cube1.position.z > cube2.position.z) return -1;
                if (cube1.position.z < cube2.position.z) return 1;
    
                // If both cube.position.x and cube.position.z are equal, retain order
                return 0;
            });
            axis = new THREE.Vector3(-1, 0, 0);
            break;
        case 'r':
            animationCubes = cubes.filter(cube => cube.position.x === SPACING * (SIZE - 2)).sort((cube1, cube2) => {
                // Sort by cube.position.x descending
                if (cube1.position.y > cube2.position.y) return -1;
                if (cube1.position.y < cube2.position.y) return 1;

                // If cube.position.x are equal, sort by cube.position.z descending
                if (cube1.position.z > cube2.position.z) return -1;
                if (cube1.position.z < cube2.position.z) return 1;
    
                // If both cube.position.x and cube.position.z are equal, retain order
                return 0;
            });
            axis = new THREE.Vector3(-1, 0, 0);
            break;
        case 'd':
            animationCubes = cubes.filter(cube => cube.position.y === -SPACING).sort((cube1, cube2) => {
                // Sort by cube.position.x descending
                if (cube1.position.x > cube2.position.x) return -1;
                if (cube1.position.x < cube2.position.x) return 1;

                // If cube.position.x are equal, sort by cube.position.z descending
                if (cube1.position.z > cube2.position.z) return -1;
                if (cube1.position.z < cube2.position.z) return 1;
    
                // If both cube.position.x and cube.position.z are equal, retain order
                return 0;
            });
            axis = new THREE.Vector3(0, 1, 0);
            break;
        case 'u': //
            animationCubes = cubes.filter(cube => cube.position.y === SPACING * (SIZE - 2)).sort((cube1, cube2) => {
                // Sort by cube.position.x descending
                if (cube1.position.x > cube2.position.x) return -1;
                if (cube1.position.x < cube2.position.x) return 1;

                // If cube.position.x are equal, sort by cube.position.z descending
                if (cube1.position.z > cube2.position.z) return -1;
                if (cube1.position.z < cube2.position.z) return 1;
    
                // If both cube.position.x and cube.position.z are equal, retain order
                return 0;
            });
            axis = new THREE.Vector3(0, 1, 0);
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
    const duration = 800; // Duration of animation in milliseconds
    const frameDuration = 16; // Assuming 60fps, ~16ms per frame
    const totalFrames = duration / frameDuration;

    // Store original positions for animation
    const originalPositions = animationCubes.map(cube => cube.position.clone());

    // Calculate new positions
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
            progress ++;

            const rotationAmount = angle * frameDuration / duration;

            const quaternion = new THREE.Quaternion();
            quaternion.setFromAxisAngle(axis, rotationAmount);

            faceGroup.applyQuaternion(quaternion);
        } else {
            // Final rotation adjustment
            const finalQuaternion = new THREE.Quaternion();
            finalQuaternion.setFromAxisAngle(axis, angle);

            console.log("here");
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
        case 'R':
        case 'r':
        case 'U':
        case 'u':
            rotateCubes(clockWise, event.key.toLowerCase());
            break;
        case 'B':
        case 'b':
        case 'L':
        case 'l':
        case 'D':
        case 'd':
            rotateCubes(!clockWise, event.key.toLowerCase());
            break;
        case 'Q':
        case 'q':
            showEulers();
            break;
        case ' ':
            clockWise = false;
            break;
    };
});