let navigatable = false;
let showHelperText = false;

function drawTexts() {
    const radius = 7.5;
    const fontLoader = new THREE.FontLoader();

    fontLoader.load('./typeface.json', function (font) {
        const textMaterial = new THREE.MeshBasicMaterial({ color: showHelperText ? FOREGROUND_COLOR : BACKGROUND_COLOR });
        const textConfigs = [
            { text: 'F', position: new THREE.Vector3(0, 0, radius), rotation: new THREE.Euler(-Math.PI / 2, 0, 0) },
            { text: 'B', position: new THREE.Vector3(0, 0, -radius), rotation: new THREE.Euler(Math.PI / 2, Math.PI, Math.PI) },
            { text: 'R', position: new THREE.Vector3(radius, 0, 0), rotation: new THREE.Euler(0, 0, 0) },
            { text: 'L', position: new THREE.Vector3(-radius, 0, 0), rotation: new THREE.Euler(-Math.PI / 2, 0, 0) },
            { text: 'U', position: new THREE.Vector3(0, radius, 0), rotation: new THREE.Euler(-Math.PI / 2, 0, 0) },
            { text: 'D', position: new THREE.Vector3(0, -radius, 0), rotation: new THREE.Euler(Math.PI / 2, 0, 0) },
        ];

        textConfigs.forEach(config => {
            const textGeometry = new THREE.TextGeometry(config.text, {
                font: font,
                size: 1.2,
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
    if (!navigatable) return;
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
    4
    if (!navigatable) return;
    // Calculate zoom direction and amount
    const delta = Math.sign(event.deltaY); // Normalize scroll direction (1 for zoom in, -1 for zoom out)

    // Adjust camera position based on zoom direction and speed
    camera.position.z -= delta * zoomSpeed;
    camera.position.x -= delta * zoomSpeed;

    // Clamp camera position to prevent zooming too close or too far
    camera.position.z = Math.max(minZoom, Math.min(maxZoom, camera.position.z));
    camera.position.x = Math.max(minZoom, Math.min(maxZoom, camera.position.x));
}