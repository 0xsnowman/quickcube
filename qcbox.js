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
    constructor(x, y, z, sizeX, sizeY, sizeZ, colors, logicX, logicY, logicZ) {
        this.position = new THREE.Vector3(x, y, z);
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.sizeZ = sizeZ;
        this.rotation = new THREE.Euler(0, 0, 0); // Initial rotation

        this.logicX = logicX;
        this.logicY = logicY;
        this.logicZ = logicZ;

        // Default colors if not provided
        this.colors = colors || [
            0xff0000, // Right face
            0x00ff00, // Left face
            0x0000ff, // Top face
            0xffff00, // Bottom face
            0x00ffff, // Front face
            0xff00ff  // Back face
        ];

        this.materials = this.colors.map(color => new THREE.MeshBasicMaterial({ color }));
        this.darkMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

        this.geometries = [
            new THREE.PlaneGeometry(this.sizeZ, this.sizeY), // Right face
            new THREE.PlaneGeometry(this.sizeZ, this.sizeY), // Left face
            new THREE.PlaneGeometry(this.sizeX, this.sizeZ), // Top face
            new THREE.PlaneGeometry(this.sizeX, this.sizeZ), // Bottom face
            new THREE.PlaneGeometry(this.sizeX, this.sizeY), // Front face
            new THREE.PlaneGeometry(this.sizeX, this.sizeY)  // Back face
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
        return visibleFaces[this.logicX * 9 + this.logicY * 3 + this.logicZ].includes(meshIndex);
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
