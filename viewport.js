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
        camera.rotation.z += deltaY / 100;

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
    camera.position.x -= delta * zoomSpeed;

    // Clamp camera position to prevent zooming too close or too far
    camera.position.z = Math.max(minZoom, Math.min(maxZoom, camera.position.z));
    camera.position.x = Math.max(minZoom, Math.min(maxZoom, camera.position.x));
}