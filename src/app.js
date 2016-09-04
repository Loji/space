"use strict"

var scene, camera, renderer;

var clock = new THREE.Clock();
var ambient = new THREE.AmbientLight(0xffffff, 0.05);

var lightHelper;

var mouseX = 0,
    mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var bulbLight, bulbMat, hemiLight;

document.addEventListener('mousemove', onDocumentMouseMove, false);
window.addEventListener('resize', onWindowResize, false);

var planets;

class Planet {
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
        var geometry = new THREE.OctahedronGeometry(100, 3);
        var material = new THREE.MeshStandardMaterial({
            color: 0xff0000,
            roughness: 0.5,
            metalness: 0.0
        });

        var mesh = new THREE.Mesh(geometry, material);
        mesh.receiveShadow = true;

        return mesh;
    }

    getMesh() {
        return this.mesh;
    }

}

init();
animate();

function init() {

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 100000);
    camera.position.z = 5;


    var bulbGeometry = new THREE.OctahedronGeometry(100, 3);
    bulbLight = new THREE.PointLight(0xffee88, 10, 10000, 0);
    bulbMat = new THREE.MeshStandardMaterial({
        emissive: 0xffffee,
        emissiveIntensity: 1,
        color: 0x000000
    });
    bulbLight.add(new THREE.Mesh(bulbGeometry, bulbMat));

    bulbLight.position.set(-500, 10, 0);
    bulbLight.castShadow = true;
    bulbLight.power = 1000;
    bulbMat.emissiveIntensity = 1000;
    scene.add(bulbLight);

    lightHelper = new THREE.PointLightHelper(bulbLight);
    scene.add(lightHelper);

    hemiLight = new THREE.HemisphereLight(0xddeeff, 0x0f0e0d, 0.02);
    scene.add(hemiLight);

    planets = [];
    for (var i = 0; i < 10; i++) {
        planets.push(new Planet(i * 100, i * 100, 0, scene));
    }

    scene.add(ambient);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.physicallyCorrectLights = true;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    renderer.gammaInput = true;
    renderer.gammaOutput = true;

    document.body.appendChild(renderer.domElement);

}

function animate() {
    requestAnimationFrame(animate);

    renderer.toneMappingExposure = Math.pow(0.7, 5.0); // to allow for very bright scenes.
    renderer.shadowMap.enabled = true;

    camera.position.x += (mouseX - camera.position.x) * .05;
    camera.position.y += (-mouseY - camera.position.y) * .05;

    camera.lookAt(scene.position);

    // mesh.position.x = 50;
    //
    // mesh.rotation.x += 0.01;
    // mesh.rotation.y += 0.02;
    // mesh.rotation.z += 0.01;
    lightHelper.update();
    renderer.render(scene, camera);

}


function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * 10;
    mouseY = (event.clientY - windowHalfY) * 10;
}
