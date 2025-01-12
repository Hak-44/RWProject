import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'; // orbital controls allow movement of the camera, changing the perspective. 

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
//camera.lookAt( 0, 0, 0 );
// interita factors contribute to the smoothness of the camera movement controls. 
controls.enableDamping = true;  // enables the inertia
controls.dampingFactor = 0.1;   // sets the inerita value

// the scene void that is visible
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0x36454F ); // background colour of 3D env

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();



// here is used to loop the scene so it keeps getting updated (siilar to update() in unity)
function animate() {
    MouseRaycast();
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


var selectedObject = null;   /* this object is recorded whenever the mosue is hovered over, that way 
    when the object*/
var lines;

/* Raycasting is the used for tracking the mouse picking and can be used to check if users are 
hovering over 3D objects within the space. 

ref:https://threejs.org/docs/index.html?q=ray#api/en/core/Raycaster

*/
window.addEventListener( 'pointermove', onPointerMove );

function onPointerMove(event){
    pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function MouseRaycast(){
    raycaster.setFromCamera( pointer, camera );

	/* calculate objects intersecting the picking ray (needs to be var since it will be constantly updated)
        which will return an array of objects  */
	var intersects = raycaster.intersectObjects( scene.children );

    if(intersects.length > 0){
        selectedObject = intersects[0].object;
        selectedObject.material.color.set( 0xFFE59B );
    }else{
        if(selectedObject){
            selectedObject.material.color.set( 0xFFFFFF );
            selectedObject = null;
        }
    }
    

	
}

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

    points[0].set(1, 0, 5);
    points[1].set(1, 0, 90);
    geometry.setFromPoints(points);

    lines = new THREE.Line( geometry, material );

    scene.add( lines );
}






