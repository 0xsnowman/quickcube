// let isMouseDown = false;
// let mouseX = 0;
// let mouseY = 0;

// document.addEventListener('mousedown', onMouseDown);
// document.addEventListener('mouseup', onMouseUp);
// document.addEventListener('mousemove', onMouseMove);

// function onMouseDown(event) {
//     isMouseDown = true;
//     mouseX = event.clientX;
//     mouseY = event.clientY;
// }

// function onMouseUp() {
//     isMouseDown = false;
// }

// function onMouseMove(event) {
//     if (isMouseDown) {
//         const deltaX = event.clientX - mouseX;
//         const deltaY = event.clientY - mouseY;

//         // Clamp vertical rotation to avoid flipping
//         camera.rotation.x += deltaX / 100;
//         camera.rotation.z += deltaY / 100;

//         mouseX = event.clientX;
//         mouseY = event.clientY;
//     }
// }

// // Variables for zoom control
// const zoomSpeed = 0.3; // Adjust zoom speed as needed
// const minZoom = 2; // Minimum distance to the origin
// const maxZoom = 20; // Maximum distance to the origin

// // Event listener for mouse scroll events
// document.addEventListener('wheel', onDocumentMouseWheel);

// function onDocumentMouseWheel(event) {
//     // Calculate zoom direction and amount
//     const delta = Math.sign(event.deltaY); // Normalize scroll direction (1 for zoom in, -1 for zoom out)

//     // Adjust camera position based on zoom direction and speed
//     camera.position.z -= delta * zoomSpeed;
//     camera.position.x -= delta * zoomSpeed;

//     // Clamp camera position to prevent zooming too close or too far
//     camera.position.z = Math.max(minZoom, Math.min(maxZoom, camera.position.z));
//     camera.position.x = Math.max(minZoom, Math.min(maxZoom, camera.position.x));
// }

// Function to animate camera rotation along the circular path
function animateCameraYAxisRotation(angleIncrement) {

    const radius = 9; // Radius of the circle
    const center = new THREE.Vector3(0, 0, 0); // Center of the circle

    const cameraPosition = camera.position.clone();

    const startTheta = Math.atan2(cameraPosition.z - center.z, cameraPosition.x - center.x);
    const endTheta = startTheta + angleIncrement;

    let startTime = null;
    const duration = 300; // Duration in milliseconds

    function animateStep(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;

        if (elapsed < duration) {
            requestAnimationFrame(animateStep);

            const progress = elapsed / duration;
            const theta = startTheta + (endTheta - startTheta) * progress;

            const newX = center.x + radius * Math.cos(theta);
            const newZ = center.z + radius * Math.sin(theta);

            camera.position.set(newX, camera.position.y, newZ);
            camera.lookAt(center);

            renderer.render(scene, camera);
        } else {
            // Ensure final position exactly at the end angle
            const newX = center.x + radius * Math.cos(endTheta);
            const newZ = center.z + radius * Math.sin(endTheta);

            camera.position.set(newX, camera.position.y, newZ);
            camera.lookAt(center);

            console.log(newX, camera.position.y, newZ);

            renderer.render(scene, camera);
        }
    }

    requestAnimationFrame(animateStep);
}

// Function to animate camera rotation along the circular path
function animateCameraRotation(angleIncrement, axis = new THREE.Vector3(0, 1, 0), duration = 300) {

    const center = new THREE.Vector3(0, 0, 0); // Center of the circle
    const cameraPosition = camera.position.clone();
    const startTheta = Math.atan2(cameraPosition.z - center.z, cameraPosition.x - center.x);
    const endTheta = startTheta + angleIncrement;

    let startTime = null;

    function animateStep(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;

        if (elapsed < duration) {
            requestAnimationFrame(animateStep);

            const progress = elapsed / duration;
            const theta = startTheta + (endTheta - startTheta) * progress;

            const quaternion = new THREE.Quaternion().setFromAxisAngle(axis, theta - startTheta);

            const newPosition = cameraPosition.clone().applyQuaternion(quaternion);

            camera.position.set(newPosition.x, newPosition.y, newPosition.z);
            camera.lookAt(center);

            renderer.render(scene, camera);
        } else {
            // Ensure final position exactly at the end angle
            const quaternion = new THREE.Quaternion().setFromAxisAngle(axis, angleIncrement);

            const newPosition = cameraPosition.clone().applyQuaternion(quaternion);

            camera.position.set(newPosition.x, newPosition.y, newPosition.z);
            camera.lookAt(center);

            renderer.render(scene, camera);
        }
    }

    requestAnimationFrame(animateStep);
}

// Handle keyup events for left, right, and down arrow keys
document.addEventListener('keyup', function (event) {
    switch (event.key) {
        case 'ArrowLeft':
            animateCameraRotation(-Math.PI / 2); // Rotate 90 degrees counter-clockwise
            break;
        case 'ArrowRight':
            animateCameraRotation(Math.PI / 2); // Rotate 90 degrees clockwise
            break;
        case 'ArrowDown':
            animateCameraRotation(-Math.PI, new THREE.Vector3(1, 0, 0)); // Rotate 90 degrees down
            break;
        case 'ArrowUp':
            animateCameraRotation(Math.PI, new THREE.Vector3(1, 0, 0)); // Rotate 90 degrees down
            break;
        default:
            break;
    }
});

function drawTexts() {
    const radius = 7.5;
    const fontLoader = new THREE.FontLoader();

    fontLoader.load('./typeface.json', function (font) {
        const textMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFF });
        const textConfigs = [
            { text: 'F', position: new THREE.Vector3(0, 0, radius), rotation: new THREE.Euler(0, 0, 0) },
            { text: 'B', position: new THREE.Vector3(0, 0, -radius), rotation: new THREE.Euler(0, Math.PI, 0) },
            { text: 'R', position: new THREE.Vector3(radius, 0, 0), rotation: new THREE.Euler(0, -Math.PI / 2, 0) },
            { text: 'L', position: new THREE.Vector3(-radius, 0, 0), rotation: new THREE.Euler(0, Math.PI / 2, 0) },
            { text: 'U', position: new THREE.Vector3(0, radius, 0), rotation: new THREE.Euler(-Math.PI / 2, 0, 0) },
            { text: 'D', position: new THREE.Vector3(0, -radius, 0), rotation: new THREE.Euler(Math.PI / 2, 0, 0) },
        ];

        textConfigs.forEach(config => {
            const textGeometry = new THREE.TextGeometry(config.text, {
                font: font,
                size: 2,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: false,
            });

            const textMesh = new THREE.Mesh(textGeometry, textMaterial);
            textMesh.position.copy(config.position);
            textMesh.rotation.copy(config.rotation);
            scene.add(textMesh);
        });
    });
}

document.addEventListener('DOMContentLoaded', drawTexts);