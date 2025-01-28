import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';

var wallCount = 0;
const wallCoordinates = []; 
const wallLines = [];
const material = new THREE.LineBasicMaterial( { color: 0x000000 } );

// capturing the x and y axis on the screen
var x_coordinates;
var y_coordinates;

// placing points indicates if the user is defining the wall length or not
export let isPlacingPoint = false;
let phantomClick;

let mainScene;


export function PassScene(scene){
    //testWalls(scene);
    mainScene = scene;
    
}

export function WallRayCast(scene, pointer, raycaster, currentCamera){

    /* similar to how the general raycast works within /main.js, it will track the mouse position, but now against the worldPlane,
        only. After finding the worldplane object, it will return the X and Z coordinates where the raycast has
        collided with the plane. 
    */
    raycaster.setFromCamera( pointer, currentCamera );
    var intersects = raycaster.intersectObjects( scene.children );
    if(intersects.length > 0 && intersects[0].object.name == "WorldPlane"){
        x_coordinates = intersects[0].point.x;
        // the Z coordinates is the y coordinates to the user as they are looking straight down towards the worldPlane
        y_coordinates = intersects[0].point.z;
        
    }

    
    //console.log("Mouse X: "+ pointer.x + " | Mouse Y: " + pointer.y);

}


export function AddPoint(scene){
    /* due to the eventListener "click" triggers regardless on what is done on the screen, another flag
    called phantomClick prevents the point being placed at the position of the "New Wall" button */ 
    if(!phantomClick){
        phantomClick = true;
        return;
    }
    if(wallCoordinates.length >= 1){
        // The points from now can be joined together as there is a previous point to connect to
        let wallLine;
        wallCount++;
        wallCoordinates.push( new THREE.Vector3( x_coordinates, 0, y_coordinates) );
        
        console.log("Wall point: " +wallCoordinates[0]);
        console.log("Wall point: " +wallCoordinates[1]);
        /*The .setFromPoints gets the values from the last point and the new point the user clicked on. Getting the last points location 
        and the one before will draw a line geometry connecting the two. */
        const geometry = new THREE.BufferGeometry().setFromPoints( [wallCoordinates[wallCoordinates.length-1], wallCoordinates[wallCoordinates.length-2]] ); 
        wallLine = new THREE.Line( geometry, material );

        // Ref: https://threejs.org/docs/index.html?q=obje#api/en/core/Object3D.userData
        wallLine.userData.objectID = 0;     // custom id that is used here is to distinguish the differnet objects on the scene. The unique object id for the wall lines will be 0.
        wallLine.name = "Wall line " +wallCount;
        wallLines.push(wallLine)
        mainScene.add(wallLine);

    }else{
        /* place the point down and do nothing else, as this will be the first point for the first wall
           to draw from.  */
        wallCoordinates.push( new THREE.Vector3( x_coordinates, 0, y_coordinates ) );
        console.log("Point added");
        console.log("Wall point: " +wallCoordinates[0]);
        console.log("Total walls " +wallCount);
    }
}

export function EnablePointPlacement(){
    isPlacingPoint = true;

}

export function DisablePointPlacement(){
    isPlacingPoint = false;
}


export function getPlacingPoint(){
    return isPlacingPoint;
}

export function getWallCount(){
    return wallCount;
}

export function setWallCount(count){
    wallCount = count;
}


function testWalls(scene){
    console.log("Wall is being generated");
    let lines;
    const material = new THREE.LineBasicMaterial( { color: 0x000000 } );
    // creating lines and giving their vector axes
    const points = [];
    points.push( new THREE.Vector3( 20, 0, 0 ) );
    points.push( new THREE.Vector3( 10, 0, 0 ) );
    points.push( new THREE.Vector3( 5, 0, 5 ) );

    // data that represents mesh, lines or point geometry data.
    const geometry = new THREE.BufferGeometry().setFromPoints( points );    

    // points[0].set(1, 0, 5);
    // points[1].set(1, 0, 90);
    geometry.setFromPoints(points);

    lines = new THREE.Line( geometry, material );
    // when creating the line, you can give it it's own properties, such as names, ids and so forth
    lines.name = "Floor Plan";

    scene.add( lines );

    // code here creates a sprite into the scene, this follows the sprite orientation no matter the angle by default
    const material1 = new THREE.SpriteMaterial({ size: 0.1, color: 0xADADAD })
    const sprite1 = new THREE.Sprite(material1)
    sprite1.position.copy(new THREE.Vector3(1,1,1))
    scene.add(sprite1)
    console.log(scene)
}


