

export default class Planet {
    constructor(x, y, z, scene) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.mesh = this.createMesh();
        scene.add(this.mesh);
        this.setPosition(x, y, z);

    }

    setPosition(x, y, z) {
        this.mesh.position.x = x;
        this.mesh.position.y = y;
        this.mesh.position.z = z;
    }

    createMesh() {
        var geometry = new THREE.OctahedronGeometry(this.radnInt(20, 50), 3);
        var material = new THREE.MeshStandardMaterial({
            color: 0xff0000,
            roughness: 0.5,
            metalness: 0.0
        });

        var mesh = new THREE.Mesh(geometry, material);
        mesh.receiveShadow = true;
        mesh.castShadow = true;
        return mesh;
    }

    radnInt(min,max) {
        return Math.floor(Math.random()*(max-min+1)+min);
    }

    getMesh() {
        return this.mesh;
    }

}
