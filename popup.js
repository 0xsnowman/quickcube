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
let experimentCubes = [];
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
    const vec1 = new THREE.Vector3(0, 1, 0);
    const euler1 = new THREE.Euler(0, -Math.PI / 2, 0);
    console.log(vec1.applyEuler(euler1));
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

function testCubes() {
    experimentCubes = cubes
        .filter(cube => cube.position.x === 3 && cube.position.y === 3 && cube.position.z === 3);

    if (experimentCubes.length === 0) {
        // alert("Empty!");
    } else {
        // alert("Filled!");
    }
}

function rotateTestCube(rotationDirection) {
    experimentCubes.forEach((cube, i) => {
        if (rotationDirection === 'x') {
            cube.rotateX(Math.PI / 2);
            cube.applyEuler(new THREE.Euler(Math.PI / 2, 0, 0));
        }
        else if (rotationDirection === 'y') {
            cube.rotateY(Math.PI / 2);
            cube.applyEuler(new THREE.Euler(0, Math.PI / 2, 0));
        }
        else {
            cube.rotateZ(Math.PI / 2);
            cube.applyEuler(new THREE.Euler(0, 0, Math.PI / 2));
        }

        console.log(cube.xDirection.x, cube.xDirection.y, cube.xDirection.z);
        console.log(cube.yDirection.x, cube.yDirection.y, cube.yDirection.z);
        console.log(cube.zDirection.x, cube.zDirection.y, cube.zDirection.z);
    });
}

function showEulers() {
    cubes.forEach((cube, i) => {
        if (cube.logicX === 2 && cube.logicY === 0 && cube.logicZ === 2) {
            console.log(cube.xDirection.x, cube.xDirection.y, cube.xDirection.z);
            console.log(cube.yDirection.x, cube.yDirection.y, cube.yDirection.z);
            console.log(cube.zDirection.x, cube.zDirection.y, cube.zDirection.z);
        }
    });
}

function testRemoveGroupFromQcbox() {
    cubes.forEach((cube, i) => {
        if (cube.logicX === 2 && cube.logicY === 2 && cube.logicZ === 2) {
            cube.removeToScene(scene);
        }
    });
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
    const duration = 3200; // Duration of animation in milliseconds

    function animateRotation() {
        if (progress < duration) {
            requestAnimationFrame(animateRotation);
            progress += 16; // Assuming 60fps, ~16ms per frame
            const t = progress / duration;
            const rotationAmount = angle * 16 / duration;

            // Rotate and interpolate positions
            animationCubes.forEach((cube, i) => {
                // if (progress < 32) {
                //     console.log(cube.xDirection.x, cube.xDirection.y, cube.xDirection.z);
                //     console.log(cube.yDirection.x, cube.yDirection.y, cube.yDirection.z);
                //     console.log(cube.zDirection.x, cube.zDirection.y, cube.zDirection.z);    
                // }
                // Rotate around Z axis
                if (cube.isParallel(new THREE.Vector3(0, 0, 1), cube.xDirection)) {
                    cube.rotateX(rotationAmount * cube.dotProductDirection(new THREE.Vector3(0, 0, 1), cube.xDirection));
                    if (cube.logicX === 2 && cube.logicY === 0 && cube.logicZ === 2) {
                        console.log('x-parellel to z-axis is right', cube.xDirection.x, cube.xDirection.y, cube.xDirection.z);
                    }
                } else if (cube.isParallel(new THREE.Vector3(0, 0, 1), cube.yDirection)) {
                    if (cube.logicX === 2 && cube.logicY === 0 && cube.logicZ === 2) {
                        console.log('y-parellel is z-axis is right', cube.yDirection.x, cube.yDirection.y, cube.yDirection.z);
                    }
                    cube.rotateY(rotationAmount * cube.dotProductDirection(new THREE.Vector3(0, 0, 1), cube.yDirection));
                } else if (cube.isParallel(new THREE.Vector3(0, 0, 1), cube.zDirection)) {
                    cube.rotateZ(rotationAmount * cube.dotProductDirection(new THREE.Vector3(0, 0, 1), cube.zDirection));
                } else {
                    console.log('[require fix]');
                }

                // Interpolate position
                cube.position.lerpVectors(originalPositions[i], newPositions[i], t);
            });

            renderer.render(scene, camera);
        } else {
            // Ensure final position and rotation
            animationCubes.forEach((cube, i) => {
                cube.position.copy(newPositions[i]);

                let euler = new THREE.Euler(0, 0, angle); // Get the Euler rotation

                if (cube.currentRotationProgress === 'x') {
                    euler = new THREE.Euler(0, 0, angle * cube.dotProductDirection(new THREE.Vector3(0, 0, 1), cube.xDirection));
                } else if (cube.currentRotationProgress === 'y') {
                    euler = new THREE.Euler(0, 0, angle * cube.dotProductDirection(new THREE.Vector3(0, 0, 1), cube.yDirection));
                } else if (cube.currentRotationProgress === 'z') {
                    euler = new THREE.Euler(0, 0, angle * cube.dotProductDirection(new THREE.Vector3(0, 0, 1), cube.zDirection));
                } else {
                    console.log('[require fix]');
                }

                if (cube.logicX === 2 && cube.logicY === 0 && cube.logicZ === 2) {
                    console.log('euler', euler);
                }

                cube.applyEuler(euler);

                // console.log("FB console");
                // console.log(i, " ---------------------", cube.position.x, cube.position.y, cube.position.z);
                // console.log('x-(', cube.xDirection.x, cube.xDirection.y, cube.xDirection.z, ')');
                // console.log('y-(', cube.yDirection.x, cube.yDirection.y, cube.yDirection.z, ')');
                // console.log('z-(', cube.zDirection.x, cube.zDirection.y, cube.zDirection.z, ')');
                // console.log(" ---------------------\n");
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
    const duration = 3200; // Duration of animation in milliseconds

    function animateRotation() {
        if (progress < duration) {
            requestAnimationFrame(animateRotation);
            progress += 16; // Assuming 60fps, ~16ms per frame
            const t = progress / duration;
            const rotationAmount = angle * 16 / duration;

            // Rotate and interpolate positions
            animationCubes.forEach((cube, i) => {
                // if (progress < 32) {
                //     console.log(cube.xDirection.x, cube.xDirection.y, cube.xDirection.z);
                //     console.log(cube.yDirection.x, cube.yDirection.y, cube.yDirection.z);
                //     console.log(cube.zDirection.x, cube.zDirection.y, cube.zDirection.z);    
                // }
                
                // Rotate around X axis
                if (cube.isParallel(new THREE.Vector3(1, 0, 0), cube.xDirection)) {
                    cube.rotateX(rotationAmount * cube.dotProductDirection(new THREE.Vector3(1, 0, 0), cube.xDirection), t);
                    // if (cube.logicX === 2 && cube.logicY === 0 && cube.logicZ === 2) {
                    //     console.log('x-parellel to x-axis is right', cube.yDirection.x, cube.yDirection.y, cube.yDirection.z);
                    // }
                } else if (cube.isParallel(new THREE.Vector3(1, 0, 0), cube.yDirection)) {
                    cube.rotateY(rotationAmount * cube.dotProductDirection(new THREE.Vector3(1, 0, 0), cube.yDirection), t);
                    if (cube.logicX === 2 && cube.logicY === 0 && cube.logicZ === 2) {
                        console.log('y-parellel to x-axis is right', cube.yDirection.x, cube.yDirection.y, cube.yDirection.z);
                    }
                } else if (cube.isParallel(new THREE.Vector3(1, 0, 0), cube.zDirection)) {
                    cube.rotateZ(rotationAmount * cube.dotProductDirection(new THREE.Vector3(1, 0, 0), cube.zDirection), t);
                } else {
                    console.log('[require fix]');
                }

                // Interpolate position
                cube.position.lerpVectors(originalPositions[i], newPositions[i], t);
            });

            renderer.render(scene, camera);
        } else {
            // Ensure final position and rotation
            animationCubes.forEach((cube, i) => {
                cube.position.copy(newPositions[i]);

                let euler = new THREE.Euler(angle, 0, 0); // Get the Euler rotation

                if (cube.currentRotationProgress === 'x') {
                    euler = new THREE.Euler(angle * cube.dotProductDirection(new THREE.Vector3(1, 0, 0), cube.xDirection), 0, 0);
                } else if (cube.currentRotationProgress === 'y') {
                    euler = new THREE.Euler(angle * cube.dotProductDirection(new THREE.Vector3(1, 0, 0), cube.yDirection), 0, 0);
                } else if (cube.currentRotationProgress === 'z') {
                    euler = new THREE.Euler(angle * cube.dotProductDirection(new THREE.Vector3(1, 0, 0), cube.zDirection), 0, 0);
                } else {
                    console.log('[require fix]');
                }

                if (cube.logicX === 2 && cube.logicY === 0 && cube.logicZ === 2) {
                    console.log('euler', euler);
                }

                cube.applyEuler(euler);

                // console.log("LR console");
                // console.log(i, " ---------------------", cube.position.x, cube.position.y, cube.position.z);
                // console.log('x-(', cube.xDirection.x, cube.xDirection.y, cube.xDirection.z, ')');
                // console.log('y-(', cube.yDirection.x, cube.yDirection.y, cube.yDirection.z, ')');
                // console.log('z-(', cube.zDirection.x, cube.zDirection.y, cube.zDirection.z, ')');
                // console.log(" ---------------------\n");
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
    const duration = 3200; // Duration of animation in milliseconds
    const rotationAmount = angle * 16 / duration;

    function animateRotation() {
        if (progress < duration) {
            requestAnimationFrame(animateRotation);
            progress += 16; // Assuming 60fps, ~16ms per frame
            const t = progress / duration;

            // Rotate and interpolate positions
            animationCubes.forEach((cube, i) => {
                // if (progress < 32) {
                //     console.log(cube.xDirection.x, cube.xDirection.y, cube.xDirection.z);
                //     console.log(cube.yDirection.x, cube.yDirection.y, cube.yDirection.z);
                //     console.log(cube.zDirection.x, cube.zDirection.y, cube.zDirection.z);    
                // }
                // Rotate around Y axis
                if (cube.isParallel(new THREE.Vector3(0, 1, 0), cube.xDirection)) {
                    cube.rotateX(rotationAmount * cube.dotProductDirection(new THREE.Vector3(0, 1, 0), cube.xDirection));
                } else if (cube.isParallel(new THREE.Vector3(0, 1, 0), cube.yDirection)) {
                    cube.rotateY(rotationAmount * cube.dotProductDirection(new THREE.Vector3(0, 1, 0), cube.yDirection));
                } else if (cube.isParallel(new THREE.Vector3(0, 1, 0), cube.zDirection)) {
                    cube.rotateZ(rotationAmount * cube.dotProductDirection(new THREE.Vector3(0, 1, 0), cube.zDirection));
                } else {
                    console.log('[require fix]');
                }

                // Interpolate position
                cube.position.lerpVectors(originalPositions[i], newPositions[i], t);
            });

            renderer.render(scene, camera);
        } else {
            // Ensure final position and rotation
            animationCubes.forEach((cube, i) => {
                cube.position.copy(newPositions[i]);

                let euler = new THREE.Euler(angle, 0, 0); // Get the Euler rotation

                if (cube.currentRotationProgress === 'x') {
                    euler = new THREE.Euler(0, angle * cube.dotProductDirection(new THREE.Vector3(0, 1, 0), cube.xDirection), 0);
                } else if (cube.currentRotationProgress === 'y') {
                    euler = new THREE.Euler(0, angle * cube.dotProductDirection(new THREE.Vector3(0, 1, 0), cube.yDirection), 0);
                } else if (cube.currentRotationProgress === 'z') {
                    euler = new THREE.Euler(0, angle * cube.dotProductDirection(new THREE.Vector3(0, 1, 0), cube.zDirection), 0);
                } else {
                    console.log('[require fix]');
                }

                if (cube.logicX === 2 && cube.logicY === 0 && cube.logicZ === 2) {
                    console.log('euler', euler);
                }

                cube.applyEuler(euler);
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
        case 'T':
        case 't':
            testCubes();
            break;
        case 'X':
        case 'x':
            rotateTestCube('x');
            break;
        case 'Y':
        case 'y':
            rotateTestCube('y');
            break;
        case 'Z':
        case 'z':
            rotateTestCube('z');
            break;
        case 'Q':
        case 'q':
            // showEulers();
            testRemoveGroupFromQcbox();
            break;
        case ' ':
            clockWise = false;
            break;
    };
});