import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'; // orbital controls allow movement of the camera, changing the perspective. 

import { generateWall } from './Room';
import { or } from 'three/tsl';

// initial setup for the three.js website
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// the scene void that is visible
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xf8f8f8 ); // background colour of 3D env

// adding gray colour fog to the scene allows better visibality with certain colours
scene.fog = new THREE.Fog(0xD3D3D3, 0.0025, 500);


// ground properties
const groundGeometry = new THREE.PlaneGeometry(10000, 10000)
const groundMaterial = new THREE.MeshBasicMaterial({
    color: 0xE5E4E2
    
})

// plane rendering.
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial)
groundMesh.position.set(0, -2, 0)   // positioning at -2 places it downwards from starting view
groundMesh.rotation.set(Math.PI / -2, 0, 0) // rotating to be flat on screen
groundMesh.receiveShadow = true  // giving shadow to the object
scene.add(groundMesh)


// 3D orbiting camera setup for the scene
const orbitCamera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
orbitCamera.position.set( 0, 0, 100 );
scene.add(orbitCamera);

// adding sky camera for the overhead perspective
const skyCamera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
skyCamera.position.set(1,100,1);    // the sky camera will be set above the plane from a reasonable distance
skyCamera.lookAt(groundMesh.position);        // the camera is set to the same position as the plane location.
skyCamera.name = "SkyCam";          // name for easy access
scene.add(skyCamera);

var currentCamera = orbitCamera;    // set camera is the 

// orbiting controls allow the user to move around the 3D space created. Reference: https://threejs.org/docs/#examples/en/controls/OrbitControls
const controls = new OrbitControls( orbitCamera, renderer.domElement );
/*skyControl orbiting will allow movement with the 2D perspective*/
const skyControls = new OrbitControls( skyCamera, renderer.domElement );
var is2D = false;   // the variable is checking whether the perspective of the 


//camera.lookAt( 0, 0, 0 );
// interita factors contribute to the smoothness of the camera movement controls. 
controls.enableDamping = true;  // enables the inertia
controls.dampingFactor = 0.1;   // sets the inerita value


const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();



// here is used to loop the scene so it keeps getting updated (siilar to update() in unity)
function animate() {
    MouseRaycast();
    CameraLeveling();
    controls.update();  // updating the controls from the camera
	renderer.render( scene, currentCamera );   // final render of the scene 
}
renderer.setAnimationLoop( animate );

// here keeps the scene updated depending on the windows resizing. 
window.addEventListener('resize', function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    currentCamera.aspect = window.innerWidth / window.innerHeight;
    currentCamera.updateProjectionMatrix();
});


var selectedObject = null;   /* this object is recorded whenever the mosue is hovered over, that way 
    when the object*/
var lines;

var objectName = document.getElementById('selected-object');

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
    raycaster.setFromCamera( pointer, currentCamera );

	/* calculate objects intersecting the picking ray (needs to be var since it will be constantly updated)
        which will return an array of objects  */
	var intersects = raycaster.intersectObjects( scene.children );

    // currently checks if the object that is being hovered over is an actual mesh or not
    if(intersects.length > 0 && intersects[0].object.name == "Floor Plan"){
        selectedObject = intersects[0].object;
        selectedObject.material.color.set( 0x55E200 );  // yellow: 0xFFE59B
        objectName.innerText = selectedObject.name;
        
    }else{
        if(selectedObject){
            selectedObject.material.color.set( 0x000000 );  
            selectedObject = null;
            objectName.innerText = "";  // the small text gets removed
        }
    }
    

}

// the div will trigger the change in perspective, it will check the current view and will swap to the other accordingly. 
document.getElementById('changeCameraPerspectiveDiv').addEventListener('click', changeCamPerspective);
function changeCamPerspective(){
    if(!is2D){
        is2D = true;
        currentCamera = skyCamera;
        skyControls.enableRotate = false;   // disabling the rotation camera as it is the 2D view
        
        //skyCamera.position = orbitCamera.position;
        

    }else{
        is2D = false;
        currentCamera = orbitCamera;

    }

}


/* this camera leveling makes sure the camera will not go beneath the plane, that way it is easier to track the
  scene.  */
function CameraLeveling(){

    if(!is2D)
        if(currentCamera.position.y < 0) currentCamera.position.y = 0;
  
}




// -------------------- ROOM DETAILS --------------------


document.getElementById('createRoomDiv').addEventListener('click', doSomething);
function doSomething(){

    // select the root within the CSS that contains colour variables
    var root = document.querySelector(':root');

    // gets the properties within the root style
    // ref: http://w3schools.com/css/tryit.asp?filename=trycss3_var_js
    var styleProperties = getComputedStyle(root)

    // grabbing the elements by id
    var createRoom = document.getElementById('createRoomDiv');
    var roomOptions = document.getElementById('room-option-box');
    
    // if the room option is flex, then it will remove the highlight from the button and remove the options div
    if(roomOptions.style.display == "flex"){
        
        //grabbing the correct colours form the :root
        var divBackgroundColour = styleProperties.getPropertyValue('--divOptionColour');
        var textColour = styleProperties.getPropertyValue('--regularTextColour')
        roomOptions.style.display = "none"; // hides the div

    }else{
        
        //grabbing the correct colours form the :root
        var divBackgroundColour = styleProperties.getPropertyValue('--divSelectedColour');
        var textColour = styleProperties.getPropertyValue('--selectedTextColour')
        roomOptions.style.display = "flex"; // shows the div in flex mode
    }
    // changes the colours accordingly.
    createRoom.style.backgroundColor = divBackgroundColour;
    createRoom.style.color = textColour;
    
    generateWall(scene);  

}







