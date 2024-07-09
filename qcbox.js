const visibleFaces = [
    [1, 3, 5],  /* '000' = 0 */
    [1, 3],     /* '001' = 1 */
    [1, 3, 4],  /* '002' = 2 */
    [1, 5],     /* '010' = 3 */
    [1],        /* '011' = 4 */
    [1, 4],     /* '012' = 5 */
    [1, 2, 5],  /* '020' = 6 */
    [1, 2],     /* '021' = 7 */
    [1, 2, 4],  /* '022' = 8 */
    [3, 5],     /* '100' = 9 */
    [3],        /* '101' = 10 */
    [3, 4],     /* '102' = 11 */
    [5],        /* '110' = 12 */
    [],         /* '111' = 13 */
    [4],        /* '112' = 14 */
    [2, 5],     /* '120' = 15 */
    [2],        /* '121' = 16 */
    [2, 4],     /* '122' = 17 */
    [0, 3, 5],  /* '200' = 18 */
    [0, 3],     /* '201' = 19 */
    [0, 3, 4],  /* '202' = 20 */
    [0, 5],     /* '210' = 21 */
    [0],        /* '211' = 22 */
    [0, 4],     /* '212' = 23 */
    [0, 2, 5],  /* '220' = 24 */
    [0, 2],     /* '221' = 25 */
    [0, 2, 4],  /* '222' = 26 */
];

class QCBox {
    constructor(x, y, z, sizeX, sizeY, sizeZ, logicX, logicY, logicZ) {
        this.position = new THREE.Vector3(x, y, z);
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.sizeZ = sizeZ;
        this.rotation = new THREE.Euler(0, 0, 0); // Initial rotation

        this.logicX = logicX;
        this.logicY = logicY;
        this.logicZ = logicZ;

        this.colorUrls = [
            'assets/boxcolors/red.jpg',
            'assets/boxcolors/green.jpg',
            'assets/boxcolors/blue.jpg',
            'assets/boxcolors/yellow.jpg',
            'assets/boxcolors/orange.jpg',
            'assets/boxcolors/white.jpg',
        ];

        this.materials = this.colorUrls.map((colorUrl) => this.loadTexture(colorUrl));
        this.darkMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

        this.geometries = [
            this.createGeometry(this.sizeZ, this.sizeY), // Right face
            this.createGeometry(this.sizeZ, this.sizeY), // Left face
            this.createGeometry(this.sizeX, this.sizeZ), // Top face
            this.createGeometry(this.sizeX, this.sizeZ), // Bottom face
            this.createGeometry(this.sizeX, this.sizeY), // Front face
            this.createGeometry(this.sizeX, this.sizeY)  // Back face
        ];

        this.meshes = this.geometries.map((geometry, index) => {
            if (this.isInsideMesh(index))
                return new THREE.Mesh(geometry, this.materials[index]);
            else return new THREE.Mesh(geometry);
        });

        this.group = new THREE.Group();
        this.meshes.forEach(mesh => this.group.add(mesh));

        this.updateMeshes();
    }

    createGeometry(width, height) {
        const radius = 0.15;

        // Create a shape for the rounded rectangle
        const shape = new THREE.Shape();
        shape.moveTo(-width / 2 + radius, -height / 2);
        shape.lineTo(width / 2 - radius, -height / 2);
        shape.quadraticCurveTo(width / 2, -height / 2, width / 2, -height / 2 + radius);
        shape.lineTo(width / 2, height / 2 - radius);
        shape.quadraticCurveTo(width / 2, height / 2, width / 2 - radius, height / 2);
        shape.lineTo(-width / 2 + radius, height / 2);
        shape.quadraticCurveTo(-width / 2, height / 2, -width / 2, height / 2 - radius);
        shape.lineTo(-width / 2, -height / 2 + radius);
        shape.quadraticCurveTo(-width / 2, -height / 2, -width / 2 + radius, -height / 2);

        // Extrude the shape into a geometry
        const extrudeSettings = { depth: 0.1, bevelEnabled: false };
        return new THREE.ExtrudeGeometry(shape, extrudeSettings);
    }

    loadTexture(colorUrl) {
        const texture = new THREE.TextureLoader().load(colorUrl);

        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(0.55, 0.55);
        texture.offset.set(-SIZE / 2, -SIZE / 2); // Ensure no offset

        return new THREE.MeshBasicMaterial({ map: texture });
    }

    getGroup() {
        return this.group;
    }

    setGroup(group) {
        this.rotation.copy(group.rotation);
    }

    addToScene(scene) {
        scene.add(this.group);
        this.updateMeshes();
    }

    isInsideMesh(meshIndex) {
        const faceIndex = this.logicX * SIZE * SIZE + this.logicY * SIZE + this.logicZ;
        // if (faceIndex > visibleFaces.length) return false;
        return visibleFaces[faceIndex].includes(meshIndex);
    }

    updateMeshes() {
        // Update the position and rotation of the group
        this.group.position.copy(this.position);
        this.group.rotation.copy(this.rotation);

        // Adjust each mesh's position and rotation based on the face index
        this.meshes.forEach((mesh, index) => {
            switch (index) {
                case 0: // Right face
                    mesh.position.set(this.sizeX / 2, 0, 0);
                    mesh.rotation.y = Math.PI / 2;
                    break;
                case 1: // Left face
                    mesh.position.set(-this.sizeX / 2, 0, 0);
                    mesh.rotation.y = -Math.PI / 2;
                    break;
                case 2: // Top face
                    mesh.position.set(0, this.sizeY / 2, 0);
                    mesh.rotation.x = -Math.PI / 2;
                    break;
                case 3: // Bottom face
                    mesh.position.set(0, -this.sizeY / 2, 0);
                    mesh.rotation.x = Math.PI / 2;
                    break;
                case 4: // Front face
                    mesh.position.set(0, 0, this.sizeZ / 2);
                    mesh.rotation.set(0, 0, 0);
                    break;
                case 5: // Back face
                    mesh.position.set(0, 0, -this.sizeZ / 2);
                    mesh.rotation.y = Math.PI;
                    break;
            }
        });
    }
}
