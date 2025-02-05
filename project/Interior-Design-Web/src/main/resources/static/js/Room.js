import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

// sets to true whenever a room is loaded or created.
export var hasNewRoomBeenMade = false;

// used to track the values for the walls
var wallCount = 0;
let wallAngle;
let lineLength;
let lineMidPoint;
let originAngle; // used for the origin angle

// used for the finalised wall objects
const wallObjects = [];

const wallCoordinates = [];
const wallLineObjects = [];
const wallAngles = [];
const angleObjects = [];
const wallLengths = [];
const lengthObjects = [];

const fontLoader = new FontLoader();
const material = new THREE.LineBasicMaterial( { color: 0x000000 } );
const phantomLineMaterial = new THREE.LineBasicMaterial( { color: 0xCECECE } );
// set variables for the colours of the text, makes it easier to edit
const regularTextColour = 0xB8B8B8;
const finalTextColour = 0x24BA00;

const textMaterial = new THREE.MeshBasicMaterial({ color: regularTextColour });
let retrievedFont;

// stores the phantomLineObject and phantomAngleTextObject so its easier to locate and remove
var phantomLineObject;
var phantomAngleTextObject;
var phantomLengthTextObject;

// capturing the x and y axis on the screen
var mouseCoordinate;
var x_coordinates;
var y_coordinates;

// placing points indicates if the user is defining the wall length or not
export let isPlacingPoint = false;
let phantomClick;

// used as a flag to determine whether the phantom line has snapped to the start point
var originSnap = false;
//once the snap is made, then the configuration is complete unless the last wall is removed
export var hasCompleteWalls = false;

let mainScene;


const loader = new FontLoader();
loader.load( 'https://threejs.org/examples/fonts/helvetiker_bold.typeface.json',

    function ( font ) {
        // do something with the font
        retrievedFont = font;
    },

    // onProgress callback
    function ( xhr ) {
        console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
    },

    // onError callback
    function ( err ) {
        console.log( 'An error happened' );
    }
);

export function PassScene(scene){
    mainScene = scene;
    hasNewRoomBeenMade = true;

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
        console.log("-----------OTHER---------");
        console.log("isPlacingPoint: " +isPlacingPoint);
        console.log("Phantom click: " +phantomClick);
        console.log("Has completed walls: " +hasCompleteWalls);
        console.log("originSnap: " +originSnap);
        console.log(" ");
        return;
    }

    if(hasCompleteWalls) return;

    if(wallCoordinates.length >= 1){
        // The points from now can be joined together as there is a previous point to connect to
        let wallLine;
        wallCount++;

        mouseCoordinate = new THREE.Vector3( x_coordinates, 0, y_coordinates );
        /*The .setFromPoints gets the values from the last point and the new point the user clicked on. Getting the last points location
        and the one before will draw a line geometry connecting the two. */
        const geometry = originSnap ? new THREE.BufferGeometry().setFromPoints( [wallCoordinates[wallCoordinates.length-1], wallCoordinates[0]]) : new THREE.BufferGeometry().setFromPoints( [wallCoordinates[wallCoordinates.length-1], mouseCoordinate])
        wallCoordinates.push( mouseCoordinate );
        wallLine = new THREE.Line( geometry, material );

        // Ref: https://threejs.org/docs/index.html?q=obje#api/en/core/Object3D.userData
        wallLine.userData.objectID = 0;     // custom id that is used here is to distinguish the differnet objects on the scene. The unique object id for the wall line objects will be 0.
        wallLine.name = "Wall line " +wallCount;
        wallLine.userData.wallNumber = wallCount;
        mainScene.add(wallLine);

        /* these below are ternary conditions, the variable is determined by the condition before the question mark,
            if the statment is true, then the first value before the semi-colon is assigned, if false, then the
            value after is assigned.

            This is done because there is no given angle when there is only 2 coordinates as it can't form one
            yet. 3 coordinates or more will create an angle.
        */
        wallAngle = wallCount >= 2 ? wallAngle : 0;
        phantomAngleTextObject = wallCount >= 2 ? phantomAngleTextObject : 0;

        wallLineObjects.push(wallLine);
        wallAngles.push(wallAngle); // pushing the angle to corresponding area
        wallLengths.push(lineLength);

        if(phantomAngleTextObject != 0) angleObjects.push(phantomAngleTextObject);
        lengthObjects.push(phantomLengthTextObject);

        console.log("Total walls " +wallCount);

        if(originSnap){
            // re-calculates the last angle before joining back to the origin point
            wallAngles.pop(wallAngle);
            wallAngle = CalculateLineEquations();
            wallAngles.push(wallAngle);

            let textGeometry = new TextGeometry( wallAngle+"°", {
                font: retrievedFont,
                size: 5,   // size of the text
                depth: 0,  // depth of the text (which makes it 3D or not)
                curveSegments: 12, // Details on the curvature of the font text
                bevelEnabled: false,  // no bevels as the text is 2D (depth is 0)

            } );
            phantomAngleTextObject.geometry = textGeometry;


            // recalculating the length to the correct value
            const finalLine = wallLineObjects[wallLineObjects.length-1];
            finalLine.computeLineDistances();
            //ref: https://stackoverflow.com/questions/62665406/three-js-why-is-line-length-equal-to-zero
            // you can access each bufferGeometrys attribute and find information about it, calling the
            // in this case the last line is taken and we are getting the true line length.
            var ld = finalLine.geometry.getAttribute("lineDistance");
            var finalLineLength = ld.getX(ld.count - 1).toFixed(2);
            ld.getX(ld.count - 1);

            textGeometry = new TextGeometry( finalLineLength, {
                font: retrievedFont,
                size: 2,   // size of the text
                depth: 0,  // depth of the text (which makes it 3D or not)
                curveSegments: 12, // Details on the curvature of the font text
                bevelEnabled: false,  // no bevels as the text is 2D (depth is 0)

            } );
            lengthObjects[lengthObjects.length-1].geometry = textGeometry;
            wallLengths[wallLengths.length-1] = finalLineLength;


            // recalculating the angle to the correct value (still WIP)
            originAngle = CalculateLineEquations(true);
            wallAngles[0] = originAngle;

            textGeometry = new TextGeometry( originAngle+"°", {
                font: retrievedFont,
                size: 5,   // size of the text
                depth: 0,  // depth of the text (which makes it 3D or not)
                curveSegments: 12, // Details on the curvature of the font text
                bevelEnabled: false,  // no bevels as the text is 2D (depth is 0)

            } );


            const originAngleObject = new THREE.Mesh(textGeometry, textMaterial);
            originAngleObject.position.x = wallCoordinates[0].x;
            originAngleObject.position.z = wallCoordinates[0].z;
            originAngleObject.rotation.x = -Math.PI / 2; // the rotation is negative, so it faces upright, in addition it needs to be flat on the plane
            originAngleObject.name = "phantomAngle";
            originAngleObject.userData.objectID = 1;
            mainScene.add(originAngleObject);
            originAngle = originAngleObject;
            angleObjects.unshift(originAngle);

            //RemovePreviousPhantomData();
            DisablePointPlacement();


            hasCompleteWalls = true;
            HighlightWallInformation(hasCompleteWalls);
        }else{

            EnterAccurateLength();

        }

        /* here we are adding the objects to the scene before they are cleard of reference
            this is because the DrawPhantomLine varaible will clear it from the scene.
            */
        mainScene.add(phantomAngleTextObject);
        mainScene.add(phantomLengthTextObject);
        phantomAngleTextObject = "";
        phantomLengthTextObject = "";


    }else{
        /* place the point down and do nothing else, as this will be the first point for the first wall
           to draw from.  */
        wallCoordinates.push( new THREE.Vector3( x_coordinates, 0, y_coordinates ) );
        //lengthObjects.push(0);



    }

    // console.log("Point added");
    // console.log("Total walls " +wallCount);
    // console.log( "wall angle: "+wallAngle);

    // console.log("line length: "+lineLength);


    PrintLists();
}


function PrintLists(){

    // pinting out information for dev purposes
    console.log(" ");
    console.log("-----------WALL INFO---------");
    console.log("Wall count: "+wallCount);
    console.log("wallcoordinates: " +wallCoordinates);
    console.log("wall line objects: " +wallLineObjects);
    console.log("wall angles: " +wallAngles);
    console.log("angle objects: " +angleObjects);
    console.log("wall lengths: " +wallLengths);
    console.log("length objects: " +lengthObjects);
    console.log(" @ ");
    console.log("-----------OTHER---------");
    console.log("isPlacingPoint: " +isPlacingPoint);
    console.log("Phantom click: " +phantomClick);
    console.log("Has completed walls: " +hasCompleteWalls);
    console.log("originSnap: " +originSnap);

}

function EnterAccurateLength(){
    phantomClick = false;
    //alert("Enter the desired length or skip.");
    /*NOTE FOR DEV (ME): COMMENT OUT PHANTOM CLICK WITHIN "DrawPhantomLine" TO DISABLE CONSECUTIVE WALL CLICKING.
     THEN REMOVE COMMENTED LINE BELOW, VICE VERSA */
    DisablePointPlacement();

}

// The phantom line is used to draw a line that will represent the final line when the user clicks on the canvas the second time.
export function DrawPhantomLine(){
    //phantomClick = true;

    if(hasCompleteWalls) return;
    RemovePreviousPhantomLine();
    let phantomLine;

    // checking if the length of the coordinate is greater than 0 will make sure the line is only drawn as long as there is a starting point
    if(wallCoordinates.length > 0){
        mouseCoordinate = new THREE.Vector3( x_coordinates, 0, y_coordinates );
        let geometry;
        if(originSnap){
            geometry = new THREE.BufferGeometry().setFromPoints( [wallCoordinates[wallCoordinates.length-1], wallCoordinates[0]]);
        }else{
            geometry = new THREE.BufferGeometry().setFromPoints( [wallCoordinates[wallCoordinates.length-1], mouseCoordinate]);
        }

        phantomLine = new THREE.Line( geometry, phantomLineMaterial );
        phantomLine.name = "PhantomLine";
        phantomLine.userData.objectID = 0;

        phantomLineObject = phantomLine;    // reference to the object is recorded down so it can be removed when no longer needed.
        mainScene.add(phantomLine);

        wallAngle = CalculateLineEquations();

        lineLength = CalculateLineData(1);  // returns the line length from the method
        lineMidPoint = CalculateLineData(2);    // returns the midpoint of the line

        if(!originSnap){
            /* due to the originSnap flag occuring at different times than the entire removal of the phantom data,
                it has to be triggered once the originSnap flag is no longer true*/

            RemovePreviousPhantomData();

            if(wallCoordinates.length > 1){

                const textGeometry = new TextGeometry( wallAngle+"°", {
                    font: retrievedFont,
                    size: 5,   // size of the text
                    depth: 0,  // depth of the text (which makes it 3D or not)
                    curveSegments: 12, // Details on the curvature of the font text
                    bevelEnabled: false,  // no bevels as the text is 2D (depth is 0)

                } );

                // Create the text mesh
                const phantomAngle = new THREE.Mesh(textGeometry, textMaterial);
                phantomAngle.position.x = wallCoordinates[wallCoordinates.length-1].x;
                phantomAngle.position.z = wallCoordinates[wallCoordinates.length-1].z;
                phantomAngle.rotation.x = -Math.PI / 2; // the rotation is negative, so it faces upright, in addition it needs to be flat on the plane
                phantomAngle.name = "phantomAngle";
                phantomAngle.userData.objectID = 1;
                mainScene.add(phantomAngle);
                phantomAngleTextObject = phantomAngle;

            }

            const phantomLength = CreatePhantomLength();
            mainScene.add(phantomLength);

            phantomLengthTextObject = phantomLength;

        }
    }

    if(wallCount >= 2) {

        originSnap = CheckTheDistanceBetweenOrigin();

    }


}

// here will check the distance between the origin coordinate and the mouse coordinate
function CheckTheDistanceBetweenOrigin(){

    /* If the mouse coordinate distance is lower than 5, then it will match the coordinate
        of the starting coordinate*/
    if(mouseCoordinate.distanceTo(wallCoordinates[0]).toFixed(2) < 5){
        //console.log("its that close...");
        return true;
    }
    return false;
}


function CreatePhantomLength(isLastAngle){
    const textGeometry = new TextGeometry( lineLength, {
        font: retrievedFont,
        size: 2,   // size of the text
        depth: 0,  // depth of the text (which makes it 3D or not)
        curveSegments: 12, // Details on the curvature of the font text
        bevelEnabled: false,  // no bevels as the text is 2D (depth is 0)

    } );

    if(isLastAngle) return textGeometry;
    // Create the text for the length
    const phantomLength = new THREE.Mesh(textGeometry, textMaterial);
    phantomLength.position.x = lineMidPoint.x;
    phantomLength.position.z = lineMidPoint.z;
    phantomLength.rotation.x = -Math.PI / 2; // the rotation is negative, so it faces upright, in addition it needs to be flat on the plane
    phantomLength.name = "phantomLength";
    phantomLength.userData.objectID = 2;

    return phantomLength;
}

function RemovePreviousPhantomLine(){
    // if there is a phantomline object once closing or quitting, then the object will be deleted.
    if(phantomLineObject)
        mainScene.remove(phantomLineObject);


}

function RemovePreviousPhantomData(){
    // removes the line length text, this is separate from the above due to sequence within the code
    if(phantomAngleTextObject){ // removes the angle text
        mainScene.remove(phantomAngleTextObject);
    } // removes the line length text
    if(phantomLengthTextObject){
        mainScene.remove(phantomLengthTextObject);
    }
}

// this process is to show the angle of the walls for the user
function CalculateLineEquations(originAngle){
    // Getting the coordinates of the previous line, there needs to be more than one coordinate in the array
    if(wallCoordinates.length > 1){

        let firstCoord, SharedCoord, phantomCoord;
        // gets the first starting coordinate for the most recent line drawn.
        firstCoord = wallCoordinates[wallCoordinates.length - 2];
        /* Getting the shared coordinate for the line. This position is the end for the recent line
        and the start for the phantom line */
        SharedCoord = wallCoordinates[wallCoordinates.length - 1];

        // getting the end of the phantom line coordinate
        phantomCoord = new THREE.Vector3(x_coordinates, 0, y_coordinates);

        /* IF this is the line that will connect to the origin, it will change the values, this is because
            it needs to recorrect the final angle as the phantom angle isn't due to updating angle. This is a
            messy, bruteforce way of doing it, possibly sphagetti, but it works regardless.
        */
        if(originSnap && wallCount >=2 ){
            firstCoord = wallCoordinates[wallCoordinates.length - 3];

            SharedCoord = wallCoordinates[wallCoordinates.length - 2];
            phantomCoord = wallCoordinates[0];
        }

        if(originAngle){
            // the origin angle that completes the shape will add its own angle
            firstCoord = wallCoordinates[wallCoordinates.length - 2];

            SharedCoord = wallCoordinates[wallCoordinates.length - 1];
            /* The last coordinate will be the first coordinate, this is because the first
                coordinate is the same as the last. */
            phantomCoord = wallCoordinates[1];
        }

        // get the direction between the coordinates
        let firstDirection = new THREE.Vector3();
        let secondDirection = new THREE.Vector3();

        // ref: https://threejs.org/docs/index.html?q=text#api/en/math/Vector3.angleTo
        // using the built in functions for the equation.
        /* to get the inner angle (acute) within both lines, sub vectors need to go in line order */
        firstDirection = firstDirection.subVectors(SharedCoord, firstCoord);  // from last line start to current
        secondDirection = secondDirection.subVectors(SharedCoord, phantomCoord); // from current to phantom line end
        firstDirection.normalize();
        secondDirection.normalize();

        var radianValue = firstDirection.angleTo(secondDirection);
        var angleToDegree = radianValue * (180 / Math.PI);
        var angle1dp = angleToDegree.toFixed(1); // fixed is used to convert the decimal to 1dp
        return angle1dp;
    }


}

function CalculateLineData(data){

    // setting the line coordinates, the most recent point placed to the phantom line
    let recentLineCoordinate = new THREE.Vector3(wallCoordinates[wallCoordinates.length - 1].x, 0 ,wallCoordinates[wallCoordinates.length - 1].z);
    let phantomCoordinate = new THREE.Vector3(x_coordinates, 0, y_coordinates);

    if(data == 1){
        //line returns
        if(originSnap){
            return wallCoordinates[wallCoordinates.length-2].distanceTo(wallCoordinates[wallCoordinates.length - 1]).toFixed(2);
        }
        return recentLineCoordinate.distanceTo(phantomCoordinate).toFixed(2);
    }else{
        // calculates the mid point for the phantom line
        let midpointX = (recentLineCoordinate.x + phantomCoordinate.x) / 2;
        let midpointY = (recentLineCoordinate.z + phantomCoordinate.z) / 2;

        //let returningVector = new THREE.Vector3(midpointX, 0 , midpointY);
        //console.log("MidpointX: "+JSON.stringify(returningVector))
        return new THREE.Vector3(midpointX, 0, midpointY);
    }

}


export function EnablePointPlacement(){

    /* this check will prevent any actions when clicking the new wall button
    if the walls are in a complete state. */
    if(hasCompleteWalls) return;

    isPlacingPoint = true;
    phantomClick = false;   // resets the phantomClick

}

export function DisablePointPlacement(){
    isPlacingPoint = false;
    // removes the point placement flag and will remove the phantom line
    RemovePreviousPhantomLine();
    RemovePreviousPhantomData();


}

export function RemoveLastWall(){

    // remove the origin angle and change the colour back
    if(hasCompleteWalls){
        mainScene.remove(originAngle);
        hasCompleteWalls = false;
        HighlightWallInformation(hasCompleteWalls);
    }
    RemovePreviousPhantomData();
    // remove the objects first before removing the reference in th e
    mainScene.remove(wallLineObjects[wallLineObjects.length-1]);
    mainScene.remove(angleObjects[angleObjects.length-1]);

    /*if the final angle is placed, then it will remove it from the scene
        the first object is the angle that gets removed as it gets pushed to the
        front to represent the first */
    if(originSnap){
        mainScene.remove(angleObjects[0]);
        angleObjects.shift();
    }
    mainScene.remove(lengthObjects[lengthObjects.length-1]);

    // if a wall is removed, then revert the condition flags
    if(originSnap) originSnap = false;

    // remove them from the list
    if(wallCount != 0){
        wallCount--;
        wallCoordinates.pop();
        wallLineObjects.pop();
        wallAngles.pop();
        angleObjects.pop();
        wallLengths.pop();
        lengthObjects.pop();

    }


    PrintLists();


}

export function getPlacingPoint(){
    return isPlacingPoint;
}

export function getWallCount(){
    return wallCount;
}


// loopoing through all the objects and adding them to the scene
function HighlightWallInformation(hasCompleteWalls){

    mainScene.traverse( function (element) {
        if (element.name == "phantomAngle" || element.name == "phantomLength"){
            if(hasCompleteWalls) element.material.color.set(finalTextColour);
            if(!hasCompleteWalls)  element.material.color.set(regularTextColour);
        }
    } );
}

export function CreateWalls(){

    /* for each objects that is created, there are attribute data stored on them. Here
        we are getting the coordinates ("position") that positions the line object and
        returning it as an array. The first three elements in are the coordinates for the
        start of the line and the last 3 are for the end of the line.

        ref: https://discourse.threejs.org/t/how-to-animate-three-line-objects-from-startpoint-to-endpoint/6626/8
             https://threejs.org/docs/?q=buffer#api/en/core/BufferGeometry
        example:
            var vertArray = wallLineObjects[0].geometry.getAttribute("position").array;
            console.log(vertArray);
            console.log(`first coordinates: (${vertArray[0]}, ${vertArray[1]}, ${vertArray[2]})`);

    */

    for(var i = 0; i < wallLineObjects.length; i++){

        var vertArray = wallLineObjects[i].geometry.getAttribute("position").array;

        var lineStart = new THREE.Vector3(vertArray[0], vertArray[1], vertArray[2]);
        var lineEnd = new THREE.Vector3(vertArray[3], vertArray[4], vertArray[5]);

        var midpointX = (lineStart.x + lineEnd.x) / 2;
        var midpointY = (lineStart.z + lineEnd.z) / 2;

        const geometry = new THREE.BoxGeometry( 1, 40, wallLengths[i] );
        const material = new THREE.MeshBasicMaterial( { color: 0xFFFFFF } );
        const wall = new THREE.Mesh( geometry, material );
        wall.name = "Wall Object";
        wall.position.set(midpointX,0,midpointY);
        wall.lookAt(lineEnd);
        mainScene.add( wall );
        wallObjects.push(wall);
    }

    /* removes the data objects as they do not need to be visible when
        in design mode */
    DisplayingObjectData(false);

};

// removes the walls so the lines can be visible
export function RemoveWalls(){
    wallObjects.forEach(element => {
        mainScene.remove(element);
    });

    while(wallObjects.length){
        wallObjects.pop();
    }

    /* as we are returning to the buildMode, we are displaying the
        wall data */
    DisplayingObjectData(true);

}

// clears the entire screen
export function ClearEverything(){

    // uncheck the flag and revert the colours
    if(hasCompleteWalls){
        hasCompleteWalls = false;
        HighlightWallInformation(hasCompleteWalls);
        originSnap = false;
    }

    /* for each of the objects on the scene, they will be removed
        by the referencees in the list
    */
    while(wallCount != 0){
        wallCount--;
        if(wallObjects.length){
            wallObjects.pop();
        }

        // will remove the data.
        DisplayingObjectData(false);

        // clearing the lists after removing the objects in the scene
        wallCoordinates.pop();
        wallLineObjects.pop();
        wallAngles.pop();
        angleObjects.pop()
        wallLengths.pop();
        lengthObjects.pop();
    }

    /* since the wallCoordinate will have an extra element in the list,
        it will call the pop() method one last time. */
    wallCoordinates.pop();

    PrintLists();


}

function DisplayingObjectData(isDisplayable){
    if(isDisplayable){
        // display the data.
        wallLineObjects.forEach(element => {
            mainScene.add(element);
        });
        angleObjects.forEach(element => {
            mainScene.add(element);
        });
        lengthObjects.forEach(element => {
            mainScene.add(element);
        });
        return;
    }
    wallLineObjects.forEach(element => {
        mainScene.remove(element);
    });
    angleObjects.forEach(element => {
        mainScene.remove(element);
    });
    lengthObjects.forEach(element => {
        mainScene.remove(element);
    });

}


