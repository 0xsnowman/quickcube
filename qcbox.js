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
        this.xDirection = new THREE.Vector3(1, 0, 0);
        this.yDirection = new THREE.Vector3(0, 1, 0);
        this.zDirection = new THREE.Vector3(0, 0, 1);

        this.logicX = logicX;
        this.logicY = logicY;
        this.logicZ = logicZ;

        this.currentRotationProgress = ''; // if it's x, cube is rotating around its own x-axis

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

    applyEuler(euler) {
        this.xDirection.applyEuler(euler);
        this.yDirection.applyEuler(euler);
        this.zDirection.applyEuler(euler);
        this.roundUpDirection();

        if (this.logicX === 2 && this.logicY === 0 && this.logicZ === 2) {
            console.log(this.xDirection.x, this.xDirection.y, this.xDirection.z);
            console.log(this.yDirection.x, this.yDirection.y, this.yDirection.z);
            console.log(this.zDirection.x, this.zDirection.y, this.zDirection.z);
        }
    }

    normalizeDirection(direction) {
        const roundedDirection = Math.round(direction * 100) / 100;
        return Math.abs(roundedDirection) === 0 ? 0 : roundedDirection;
    }

    isParallel(vec1, vec2) {
        const crossProduct = new THREE.Vector3().crossVectors(vec1, vec2);
        return crossProduct.length() === 0;
    }

    dotProductDirection(vec1, vec2) {
        const dotProduct = vec1.dot(vec2);
        return dotProduct > 0 ? 1 : -1;
    }

    roundUpDirection() {
        this.xDirection.x = this.normalizeDirection(this.xDirection.x); // Round to two decimal places
        this.xDirection.y = this.normalizeDirection(this.xDirection.y);
        this.xDirection.z = this.normalizeDirection(this.xDirection.z);

        this.yDirection.x = this.normalizeDirection(this.yDirection.x); // Round to two decimal places
        this.yDirection.y = this.normalizeDirection(this.yDirection.y);
        this.yDirection.z = this.normalizeDirection(this.yDirection.z);

        this.zDirection.x = this.normalizeDirection(this.zDirection.x); // Round to two decimal places
        this.zDirection.y = this.normalizeDirection(this.zDirection.y);
        this.zDirection.z = this.normalizeDirection(this.zDirection.z);
    }

    addToScene(scene) {
        scene.add(this.group);
    }

    removeToScene(scene) {
        scene.remove(this.group);
    }

    setPosition(x, y, z) {
        this.position.set(x, y, z);
        this.updateMeshes();
    }

    setSize(sizeX, sizeY, sizeZ) {
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.sizeZ = sizeZ;

        this.geometries = [
            new THREE.PlaneGeometry(this.sizeZ, this.sizeY), // Right face
            new THREE.PlaneGeometry(this.sizeZ, this.sizeY), // Left face
            new THREE.PlaneGeometry(this.sizeX, this.sizeZ), // Top face
            new THREE.PlaneGeometry(this.sizeX, this.sizeZ), // Bottom face
            new THREE.PlaneGeometry(this.sizeX, this.sizeY), // Front face
            new THREE.PlaneGeometry(this.sizeX, this.sizeY)  // Back face
        ];

        this.meshes.forEach((mesh, index) => {
            mesh.geometry.dispose();
            mesh.geometry = this.geometries[index];
        });

        this.updateMeshes();
    }

    rotateX(rx) {
        this.rotation.set(this.rotation.clone().x + rx, this.rotation.clone().y, this.rotation.clone().z);
        this.updateMeshes();
        // this.applyEuler(new THREE.Euler(rx, 0, 0));
        this.currentRotationProgress = 'x';
    }

    rotateY(ry) {
        this.rotation.set(this.rotation.clone().x, this.rotation.clone().y + ry, this.rotation.clone().z);            
        this.updateMeshes();
        // this.applyEuler(new THREE.Euler(0, ry, 0));
        this.currentRotationProgress = 'y';
    }

    rotateZ(rz) {
        this.rotation.set(this.rotation.clone().x, this.rotation.clone().y, this.rotation.clone().z + rz);
        this.updateMeshes();
        // this.applyEuler(new THREE.Euler(0, 0, rz));
        this.currentRotationProgress = 'z';
    }

    // This is manual method to set rotation of cube
    // setRotation(x, y, z) {
    //     this.rotation.set(x, y, z);
    //     this.updateMeshes();
    // }

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
