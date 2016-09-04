

export default class Planet {
    constructor(i, scene) {
        this.x = i * (300 + this.randInt(-5, 5));
        this.y = 0;
        this.z = 0;
        this.size = this.randInt(20, 50);
        this.mesh = this.createMesh(this.x, this.y, this.z, this.size);
        scene.add(this.mesh);
        this.speed = (this.randInt(1, 5) * (9 - i) * this.size ) / 400;
    }

    setPosition(x, y, z) {
        this.mesh.position.x = x;
        this.mesh.position.y = y;
        this.mesh.position.z = z;
    }

    createMesh(x, y, z, size) {
        var geometry = new THREE.OctahedronGeometry(, 3);
        geometry.translate(x, y, z);
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

    randInt(min, max) {
        return Math.floor(Math.random()*(max-min+1)+min);
    }

    getMesh() {
        return this.mesh;
    }

    animate() {
      this.mesh.rotation.y += this.speed;
    }

}
