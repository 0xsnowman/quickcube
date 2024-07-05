class QCBox {
    constructor(x, y, z, sizeX, sizeY, sizeZ, colors) {
        this.position = new THREE.Vector3(x, y, z);
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.sizeZ = sizeZ;
        this.rotation = new THREE.Euler(0, 0, 0); // Initial rotation

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

        this.geometries = [
            new THREE.PlaneGeometry(this.sizeZ, this.sizeY), // Right face
            new THREE.PlaneGeometry(this.sizeZ, this.sizeY), // Left face
            new THREE.PlaneGeometry(this.sizeX, this.sizeZ), // Top face
            new THREE.PlaneGeometry(this.sizeX, this.sizeZ), // Bottom face
            new THREE.PlaneGeometry(this.sizeX, this.sizeY), // Front face
            new THREE.PlaneGeometry(this.sizeX, this.sizeY)  // Back face
        ];

        this.meshes = this.geometries.map((geometry, index) => new THREE.Mesh(geometry, this.materials[index]));

        this.group = new THREE.Group();
        this.meshes.forEach(mesh => this.group.add(mesh));

        this.updateMeshes();
    }

    addToScene(scene) {
        scene.add(this.group);
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

    setRotation(x, y, z) {
        this.rotation.set(x, y, z);
        this.updateMeshes();
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