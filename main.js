import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

var wallCount = 0;

function SetWallCount(count){
    wallCount = count
}

// initial setup for the three.js website
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// camera setup for the scene
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set( 0, 0, 100 );

// orbiting controls allow the user to move around the 3D space created. Reference: https://threejs.org/docs/#examples/en/controls/OrbitControls
const controls = new OrbitControls( camera, renderer.domElement );
camera.lookAt( 0, 0, 0 );


// the scene void that is visible
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0x36454F ); // background colour of 3D env


// here is used to loop the scene so it keeps getting updated (siilar to update() in unity)
function animate() {
    controls.update();  // updating the controls from the camera
	renderer.render( scene, camera );   // final render of the scene 
}
renderer.setAnimationLoop( animate );

// here keeps the scene updated depending on the windows resizing. 
window.addEventListener('resize', function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});


document.getElementById('createRoomDiv').addEventListener('click', doSomething);
function doSomething(){
    alert('did something');
    const material = new THREE.LineBasicMaterial( { color: 0xFFFFFF } );

    // creating lines and giving their vector axes
    const points = [];
    points.push( new THREE.Vector3( 20, 0, 0 ) );
    points.push( new THREE.Vector3( 10, 0, 0 ) );
    points.push( new THREE.Vector3( 5, 0, 0 ) );

    // data that represents mesh, lines or point geometry data.
    const geometry = new THREE.BufferGeometry().setFromPoints( points );    

    points[0].set(1, 5, 5);
    points[1].set(1, 5, 90);
    geometry.setFromPoints(points);

    const line = new THREE.Line( geometry, material );

    scene.add( line );
}










