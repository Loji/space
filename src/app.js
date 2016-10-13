"use strict"

var scene, camera, renderer;

var clock = new THREE.Clock();
var ambient = new THREE.AmbientLight(0xffffff, 0.31);

var lightHelper;

var mouseX = 0,
    mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var bulbLight, bulbMat, hemiLight;

var planets;

import Planet from './planet.js';
import Util from './util.js';

init();
animate();

// listeners for function moving camera 
document.addEventListener('mousemove', onDocumentMouseMove, false);
window.addEventListener('resize', onWindowResize, false);

function init() {

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 100000000);
    camera.position.z = 2;


    var bulbGeometry = new THREE.OctahedronGeometry(10, 3);
    bulbLight = new THREE.PointLight(0xffee88, 10, Number.MAX_SAFE_INTEGER, 0);
    bulbMat = new THREE.MeshStandardMaterial({
        emissive: 0xffffee,
        emissiveIntensity: 1,
        color: 0x000000
    });
    bulbLight.add(new THREE.Mesh(bulbGeometry, bulbMat));

    bulbLight.position.set(0, 10, 0);
    bulbLight.castShadow = true;
    bulbLight.power = 1000;
    bulbLight.shadowCameraVisible = true;

    var d = Number.MAX_SAFE_INTEGER;

    bulbLight.shadowCameraLeft = -d;
    bulbLight.shadowCameraRight = d;
    bulbLight.shadowCameraTop = d;
    bulbLight.shadowCameraBottom = -d;

    bulbLight.shadowCameraFar = Number.MAX_SAFE_INTEGER;
    bulbLight.shadowDarkness = 0.2;

    bulbMat.emissiveIntensity = Number.MAX_SAFE_INTEGER;
    scene.add(bulbLight);
    
    // lightHelper = new THREE.PointLightHelper(bulbLight);
    // scene.add(lightHelper);

    hemiLight = new THREE.HemisphereLight(0xddeeff, 0x0f0e0d, 0.02);
    scene.add(hemiLight);

    planets = [];
    for (var i = 6; i < Util.randInt(10, 15); i++) {
        if(Util.randInt(0, 5) != 4) { // there is no particular reason it is checking if random is 4
          planets.push(new Planet(i, scene));
        }
    }

    // adding skydome
    var skyGeo = new THREE.OctahedronGeometry(10000000, 3);
    var texture = THREE.ImageUtils.loadTexture( "images/space.jpg" );
    var material = new THREE.MeshBasicMaterial({
            map: texture,
    });
    var sky = new THREE.Mesh(skyGeo, material);
    sky.material.side = THREE.BackSide;
    scene.add(sky);


    scene.add(ambient);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.physicallyCorrectLights = true;
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    renderer.gammaInput = true;
    renderer.gammaOutput = true;

    document.body.appendChild(renderer.domElement);

}

function animate() {
    requestAnimationFrame(animate);

    // renderer.shadowMap.enabled = true;

    planets.forEach(function(planet) {
      planet.needsUpdate = true;
      planet.animate();
    })

    camera.position.x += (mouseX - camera.position.x) * .001;
    camera.position.y += ((-mouseY - camera.position.y) * .001);


    camera.lookAt(scene.position);

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
