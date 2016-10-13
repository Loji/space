import Util from './util.js';

export default class Planet {
    constructor(i, scene) {
        this.x = i * (40 + Util.randInt(-5, 5));
        this.y = 0;
        this.z = 0;
        this.size = i * Util.randInt(1, 3) / 10;

        this.parentMesh = '';
        this.moons = [];
        this.mesh = '';
        this.createMesh(this.x, this.y, this.z, this.size);

        scene.add(this.parentMesh);

        this.speed = ((Util.randInt(1, 2) + this.size) / (i * 3)) / 10;
        this.parentMesh.rotation.y = Util.randInt(0, 360);


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

        moon.position.x = i * 3;
        moon.position.y = 0;
        moon.position.z = 0;

        var parentMesh = new THREE.Object3D();
        parentMesh.add(moon);

        return parentMesh;
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
        for(var i = 1; i < Util.randInt(3, 6); i++) {
          if(Util.randInt(0, 4) == 4) {
            var moon = this.createMoon(i, size / 4);
            moon.orbitSpeed = (Util.randInt(6, 9) - i) * 0.005; 
            this.moons.push(moon);
            this.mesh.add(moon);
          }
        }

        // create abstract mesh that is used for orbiting
        this.parentMesh = new THREE.Object3D();
        this.parentMesh.add(this.mesh);
    }


    getMesh() {
        return this.mesh;
    }

    animate() {
        this.parentMesh.rotation.y += this.speed;
        this.mesh.rotation.y += 0.01;
        this.moons.forEach(function(moon) {
          moon.rotation.y += moon.orbitSpeed;
        });
    }

}
