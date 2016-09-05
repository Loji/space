export default class Planet {
    constructor(i, scene) {
        this.x = i * (150 + this.randInt(-5, 5));
        this.y = 0;
        this.z = 0;
        this.size = this.randInt(6, 12);

        this.parentMesh = '';
        this.moons = [];
        this.mesh = '';
        this.createMesh(this.x, this.y, this.z, this.size);

        scene.add(this.parentMesh);

        this.speed = ((this.randInt(1, 2) + this.size) / (i * 3)) / 100;
        this.parentMesh.rotation.y = this.randInt(0, 360);


    }

    setPosition(x, y, z) {
        this.mesh.position.x = x;
        this.mesh.position.y = y;
        this.mesh.position.z = z;
    }

    createMoon(i, size) {
        var moonGeometry = new THREE.OctahedronGeometry(size, 3);
        var material = new THREE.MeshStandardMaterial({
            color: 0xffff00,
            roughness: 0.5,
            metalness: 0.0
        });
        var moon = new THREE.Mesh(moonGeometry, material);
        moon.receiveShadow = true;
        moon.castShadow = true;

        moon.position.x = i * 20;
        moon.position.y = 0;
        moon.position.z = 0;

        return moon;
    }

    createMesh(x, y, z, size) {
        var meshGeometry = new THREE.OctahedronGeometry(size, 3);
        var material = new THREE.MeshStandardMaterial({
            color: 0xff0000,
            roughness: 0.5,
            metalness: 0.0
        });

        this.mesh = new THREE.Mesh(meshGeometry, material);
        this.mesh.receiveShadow = true;
        this.mesh.castShadow = true;
        this.mesh.position.x = x;
        this.mesh.position.y = y;
        this.mesh.position.z = z;

        // take care of adding moons
        for(var i = 1; i < this.randInt(3, 6); i++) {
          if(this.randInt(0, 4) == 4) {
            var moon = this.createMoon(i, size / 4);
            moon.orbitSpeed = 1;
            this.moons.push(moon);
            this.mesh.add(moon);
          }
        }


        // create abstract mesh that is used for orbiting
        this.parentMesh = new THREE.Object3D();
        this.parentMesh.add(this.mesh);
    }

    randInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    getMesh() {
        return this.mesh;
    }

    animate() {
        this.parentMesh.rotation.y += this.speed;
        this.mesh.rotation.y += 0.01;
    }

}
