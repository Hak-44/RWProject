import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { tan } from 'three/tsl';
import { Vector3 } from 'three/webgpu';

var wallCount = 0;
let wallAngle;
const wallCoordinates = []; 
const wallLines = [];
const wallAngles = [];

const material = new THREE.LineBasicMaterial( { color: 0x000000 } );
const phantomLineMaterial = new THREE.LineBasicMaterial( { color: 0xCECECE } );
var phantomLineObject;

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

    
    //console.log("Mouse X: "+ x_coordinates + " | Mouse Y: " + y_coordinates);

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
        
        console.log("Wall points: " +wallCoordinates);
        console.log("Total walls " +wallCount);
        /*The .setFromPoints gets the values from the last point and the new point the user clicked on. Getting the last points location 
        and the one before will draw a line geometry connecting the two. */
        const geometry = new THREE.BufferGeometry().setFromPoints( [wallCoordinates[wallCoordinates.length-1], wallCoordinates[wallCoordinates.length-2]] ); 
        wallLine = new THREE.Line( geometry, material );

        // Ref: https://threejs.org/docs/index.html?q=obje#api/en/core/Object3D.userData
        wallLine.userData.objectID = 0;     // custom id that is used here is to distinguish the differnet objects on the scene. The unique object id for the wall lines will be 0.
        wallLine.name = "Wall line " +wallCount;
        wallLines.push(wallLine)
        wallAngles.push(wallAngle); // pushing the angle to corresponding area
        mainScene.add(wallLine);

        EnterAccurateLength();

    }else{
        /* place the point down and do nothing else, as this will be the first point for the first wall
           to draw from.  */
        wallCoordinates.push( new THREE.Vector3( x_coordinates, 0, y_coordinates ) );
        console.log("Point added");
        console.log("Total walls " +wallCount);
    }
}

function EnterAccurateLength(){
    phantomClick = false;
    //alert("Enter the desired length or skip.");
    /*NOTE FOR DEV (ME): COMMENT OUT PHANTOM CLICK WITHIN "DrawPhantomLine" TO DISABLE CONSECUTIVE WALL CLICKING. 
     THEN REMOVE COMMENTED LINE BELOW, VICE VERSA */
    //DisablePointPlacement();
    
}

// The phantom line is used to draw a line that will represent the final line when the user clicks on the canvas the second time. 
export function DrawPhantomLine(){
    phantomClick = true;
    RemovePreviousPhantomLine();
    let phantomLine;
    // checking if the length of the coordinate is greater than 0 will make sure the line is only drawn as long as there is a starting point
    if(wallCoordinates.length > 0){
        let mouseCoordinate = new THREE.Vector3( x_coordinates, 0, y_coordinates );
        const geometry = new THREE.BufferGeometry().setFromPoints( [wallCoordinates[wallCoordinates.length-1], mouseCoordinate]);
        phantomLine = new THREE.Line( geometry, phantomLineMaterial );
        phantomLine.name = "PhantomLine";

        phantomLineObject = phantomLine;    // reference to the object is recorded down so it can be removed when no longer needed. 
        wallAngle = CalculateLineEquations();   
        if(wallCoordinates > 1)console.log("Angle: "+wallAngle);
        mainScene.add(phantomLine);
        
    }
}

function RemovePreviousPhantomLine(){
    // if there is a phantomline object once closing or quitting, then the object will be deleted. 
    if(phantomLineObject){
        mainScene.remove(phantomLineObject);
    }
    
}

// this process is to show the angle of the walls for the user
function CalculateLineEquations(){
    // Getting the coordinates of the previous line, there needs to be more than one coordinate in the array
    if(wallCoordinates.length > 1){

        // gets the first starting coordinate for the most recent line drawn.
        let recentLineCoordStart = wallCoordinates[wallCoordinates.length - 2];
        /* Getting the shared coordinate for the line. This position is the end for the recent line
        and the start for the phantom line */
        let SharedCoord = wallCoordinates[wallCoordinates.length - 1];

        // getting the end of the phantom line coordinate
        let phantomLineCoordEnd = new THREE.Vector3(x_coordinates, 0, y_coordinates);

        // get the direction between the coordinates
        let firstDirection = new THREE.Vector3();
        let secondDirection = new THREE.Vector3();
        
        // ref: https://threejs.org/docs/index.html?q=text#api/en/math/Vector3.angleTo
        // using the built in functions for the equation.
        /* to get the inner angle (acute) within both lines, sub vectors need to go in line order */
        firstDirection = firstDirection.subVectors(SharedCoord, recentLineCoordStart);  // from last line start to current
        secondDirection = secondDirection.subVectors(SharedCoord, phantomLineCoordEnd); // from current to phantom line end

        var radianValue = firstDirection.angleTo(secondDirection);
        var angleToDegree = radianValue * (180 / Math.PI);
        var angle1dp = angleToDegree.toFixed(1); // fixed is used to convert the decimal to 1dp
        return angle1dp;
    }

    
}


export function EnablePointPlacement(){
    isPlacingPoint = true;
    phantomClick = false;   // resets the phantomClick

}

export function DisablePointPlacement(){
    isPlacingPoint = false;
    // removes the point placement flag and will remove the phantom line
    RemovePreviousPhantomLine();
}


export function getPlacingPoint(){
    return isPlacingPoint;
}

function getWallCount(){
    return wallCount;
}

function setWallCount(count){
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


