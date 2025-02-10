import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { DragControls } from 'three/addons/controls/DragControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';

import { HouseItem } from "./HouseItem.js";
import { DisableBothOrbitCameras, EnableBothOrbitCameras } from "./main.js";

// loader to load the object.
const loader = new GLTFLoader();

let mainScene;
let renderer;
let camera;

// referencing the json file containing the
const objectJSONPath = "json/interiorObjects";
const imgLocation = "images/";

// 1. create a list that will contain all the objects[]
// 2. create an object list that will have the objects that are in the scene
// 3. if the list is loaded, then don't retrieve from the backend.

var allObjectData = [];
var sceneObjects = [];

var editingObject = [];
var hasEditingObject = false;

// outline objects
var hoveredObject = null;
var selectedObject = null;
var hoveredObjMaterial = null;
var activeClick = false;



var dragControls = null;    // used for drag controls
let transformControls = null;
var hasTransformControls = false;
var transformHelp;

var x_coordinates;
var y_coordinates;

var livingRoomItems;
var kitchenItems;


// labelling variables for the navigation for the left sidebar
var objectType;
var objectSecondType;
var previousObjectType; // used to close the div when needed.
var objectTypeName;
const roomTypeLabel = document.getElementById('objectTypeLabelName');
const leftSidebar2nd = document.getElementById('leftSidebar2nd');
const objectOptions = document.getElementById('objectOptions');
const objectScrollPane = document.getElementById('objectScrollPane');

const rightSidebar = document.getElementById('rightSidebar');

// each button will pass through their own unique value, displaying the correct format of the menu
document.getElementById('addFurniture').addEventListener('click', function(){
    DisplayRoomTypeOptions(1, "Furniture");
});

document.getElementById('addDecor').addEventListener('click', function(){
    DisplayRoomTypeOptions(2, "Decoration");
});

document.getElementById('addDoor').addEventListener('click', function(){
    DisplayRoomTypeOptions(3, "Doors");
});

document.getElementById('addWindow').addEventListener('click', function(){
    DisplayRoomTypeOptions(4, "Windows");
});


document.getElementById('livingRoomButton').addEventListener('click', function(){
    ShowObjectList(5, "Living Room");
});

document.getElementById('kitchenButton').addEventListener('click', function(){
    ShowObjectList(6, "Kitchen");
});

document.getElementById('bathroomButton').addEventListener('click', function(){
    ShowObjectList(7, "Bathroom");
});

document.getElementById('bedroomButton').addEventListener('click', function(){
    ShowObjectList(8, "Bedroom");
});

document.getElementById('backToObjectList').addEventListener('click', function(){
    HideObjectList();
});

// adding an event listener that will check for keyboard inputs
document.addEventListener('keydown', function(event) {
    // G is the button that will move the object around that is selected
    if (event.key === 'g') {
        // if this flag is true, it means the user has pressed G again, so release it
        if(hasEditingObject){
            dragControls.enabled = false;
            DetachTransformControls();
            ReleaseObject();
            EnableBothOrbitCameras();

            return;
        }
        // if an object is selected, it will allow movement for that object
        if(selectedObject){
            console.log("Object dragging enabled");
            if(!hasEditingObject) AddObjectToDragArray();
            dragControls = new DragControls( editingObject, camera, renderer.domElement );
            dragControls.enabled = true;
            DisableBothOrbitCameras();
        }

    }

    if (event.key === 't' || event.key === 'r' && hasEditingObject){
        CreateTransformControls();
        // allows for more specific movement, such as moving it in the x or y axis
        if (event.key === 't' && hasEditingObject) {
            /* This function should return true if a helper exists within the scene.
                by traversing through it. If false, it will create. (WIP) */
            if(!FindHelperControls()){
                console.log("HelperControls do not exist, adding.");
                transformHelp = transformControls.getHelper();
                mainScene.add( transformHelp );
            }else{
                console.log("HelpControls already exists.");
            }
            console.log("hasEditingObject: "+hasEditingObject)
            if(selectedObject){
                transformControls.attach( selectedObject );
                transformControls.setMode('translate');

            }

        }
        if (event.key === 'r' && hasEditingObject) {
            if(!FindHelperControls()){
                console.log("HelperControls do not exist, adding.");
                transformHelp = transformControls.getHelper();
                mainScene.add( transformHelp );
            }else{
                console.log("HelpControls already exists.");
            }
            console.log("hasEditingObject: "+hasEditingObject)
            if(selectedObject){
                transformControls.attach( selectedObject );
                transformControls.setMode('rotate');

            }
        }
    }





});

function AddObjectToDragArray(){
    hasEditingObject = true;
    editingObject.push(selectedObject);

}

function ReleaseObject(){
    console.log("position: "+JSON.stringify(selectedObject.position));
    console.log("Releasing object");
    hasEditingObject = false;
    editingObject = [];
    RevertDeselectedObject();

}


function CreateTransformControls(){
    if(!hasTransformControls){
        // ref: https://github.com/mrdoob/three.js/blob/master/examples/webgl_animation_skinning_ik.html
        hasTransformControls = true;
        transformControls = new TransformControls( camera, renderer.domElement );
        transformControls.size = 0.75;
        transformControls.space = 'world';
        transformControls.setMode('translate');

    }
    transformControls.enabled = true;

}

function DetachTransformControls(){

    mainScene.remove(transformHelp);
    transformHelp = null;
    transformControls.enabled = false;
}

function FindHelperControls(){
    if(transformHelp != null) return true;
    return false;
}



// passing the scene camera and renderer which will be used for drag control operations
export function PassSceneToDesign(scene, passedCamera, passedRenderer){
    console.log("Passing scene to design mode");
    mainScene = scene;
    renderer = passedRenderer;
    camera = passedCamera;


}


export function ObjectRayCast(scene, pointer, raycaster, currentCamera, objectName){

    /* similar to how the general raycast works within /main.js, it will track the mouse position, but now against the worldPlane,
        only. After finding the worldplane object, it will return the X and Z coordinates where the raycast has
        collided with the plane.
    */

    raycaster.setFromCamera( pointer, currentCamera );
    var selectedObject;

    var intersects = raycaster.intersectObjects( scene.children );
    if(intersects.length > 0 && intersects[0].object.userData.sceneID == 4){

        var foundObject = intersects[0]
        //console.log("Found object: "+foundObject.object.userData.objectName);
        hoveredObject = foundObject.object;

        // x_coordinates = intersects[0].point.x;
        // // the Z coordinates is the y coordinates to the user as they are looking straight down towards the worldPlane
        // y_coordinates = intersects[0].point.z;

    }else{

        hoveredObject = null;

    }


     // Ensure the material is updated

    // x_coordinates = intersects[0].point.x;
    // y_coordinates = intersects[0].point.z;
    //console.log("Mouse X: "+ x_coordinates + " | Mouse Y: " + y_coordinates);

}

// when clicked in main when design mode is true, this function will rin
export function GetObjectSelected(){
    SelectTheObject();
}

function SelectTheObject(){
    if(hasEditingObject){
        return;
    }
    if(hoveredObject != null){
        activeClick = true;   // counts it as a click
        if(selectedObject != hoveredObject){
            // switch it to the new hovered object
            RevertDeselectedObject();
            selectedObject = hoveredObject;
            //selectedObject.material.color.set(0xff0000);
            selectedObject.material.transparent = true;
            selectedObject.material.opacity = 0.1;

            // re-enabling the shadows as they can get removed when altering the transparency
            selectedObject.castShadow = true;
            selectedObject.receiveShadow = true;
            rightSidebar.style.width = '300px';

        }
        console.log("Object: "+selectedObject.userData.objectName);
    }else{
        // clicked off the object, so remove it from the selected variable
        if(!hasEditingObject){
            activeClick = false;
            RevertDeselectedObject();
            if(selectedObject == null) rightSidebar.style.width = '0px';
        }
    }
    console.log("Active click: "+activeClick)
}

// reverts the current selected object back to normal
function RevertDeselectedObject(){
    if(selectedObject){
        selectedObject.material.opacity = 1;
        selectedObject.material.color.set(0xffffff);
        selectedObject.material.transparent = false;

        selectedObject.castShadow = true;
        selectedObject.receiveShadow = true;
        selectedObject = null;  // clear the reference to the object once clearing
    }
}

function DisplayRoomTypeOptions(value, typeName){
    /* Set the room ID for the objectTypes that will be retrieved */
    objectType = value;
    console.log("name: "+typeName);
    HideObjectList();
    // the previousTypeID will be used to check if the user clicks the same
    if(previousObjectType == objectType){
        previousObjectType = 0;
        ShowNextMenu(false);    // triggers the hide operation
        return;
    }
    previousObjectType = value;
    objectTypeName = typeName;    // changes the label text
    ShowNextMenu(true);
}


function ShowObjectList(roomTypeValue){
    objectSecondType = roomTypeValue; // determins whether its kitcken or bedroom etc
    console.log()
    loadObjectsInList();   // retrieving the json from the object folder
    objectScrollPane.style.display = 'flex';
    objectOptions.style.display = 'none';   // hide the other content
}

function loadObjectsInList(){

    if(allObjectData.length == 0){
        // getting the json from the public object folder
        fetch("json/interiorObjects")
        .then(response => response.json())
        .then(data => {
            console.log("loading from json");
            livingRoomItems = data.livingRoomItems;
            kitchenItems = data.kitchenItems;
            CacheObjectData();
            GetRoomType();

        })
        .catch(error => console.error('Error:', error))
        console.log(allObjectData);
    }else{
        console.log("Reading from cache data.");
        allObjectData.forEach(obj =>{
            if(obj.roomType == objectSecondType && obj.objectType == objectType) DisplayObject(obj);
        })
    }



}

function CacheObjectData(){
    livingRoomItems.forEach(obj => {
        const houseItem = new HouseItem(obj.name, obj.objectType, obj.roomType, obj.width, obj.height, obj.image, obj.extension);
        allObjectData.push(houseItem);
    });

    kitchenItems.forEach(obj => {
        const houseItem = new HouseItem(obj.name, obj.objectType, obj.roomType, obj.width, obj.height, obj.image, obj.extension);
        allObjectData.push(houseItem);
    });

}

function GetRoomType(){

    switch(objectSecondType){
        case 5:
            // loop pass and add (living room items)
            livingRoomItems.forEach(obj => {

                if(obj.roomType == objectSecondType && obj.objectType == objectType) DisplayObject(obj);
            });
            break;
        case 6:
            // loop pass and add (Kitchen items)
            kitchenItems.forEach(obj => {

                if(obj.roomType == objectSecondType && obj.objectType == objectType) DisplayObject(obj);
            });
            break;
        case 7:
            // loop pass and add (Bathroom items)
            kitchenItems.forEach(obj => {

                if(obj.roomType == objectSecondType && obj.objectType == objectType) DisplayObject(obj);
            });
            break;
        case 8:
            // loop pass and add (bedroom items)
            kitchenItems.forEach(obj => {
                // console.log("displaying "+obj.name);
                // console.log("Room type: "+obj.roomType);
                // console.log("--------------------------");
                if(obj.roomType == objectSecondType && obj.objectType == objectType) DisplayObject(obj);
            });
            break;

    }
}

// creating an element and an image
function DisplayObject(obj){

    console.log(obj.image);
    var div = document.createElement('div');
    var label = document.createElement('label');
    var img = document.createElement('img');

    label.innerText = obj.name;
    label.id = "object-name";
    label.style.textAlign = "center";

    img.src = imgLocation+obj.image;
    img.width = 128;
    img.height = 128;

    div.style.display = "flex";
    div.style.flexDirection = "column";

    div.appendChild(label);
    div.appendChild(img);
    objectScrollPane.appendChild(div);

    div.addEventListener('click', function() {
        /* grabs the first label that is within the div, then get the
           inner text, which will be used for the object creation. */
        const label = div.getElementsByTagName('label')[0];
        const objectName = label.innerText;
        console.log('Object: '+objectName);
        LoadObject(objectName);

    });

}


function LoadObject(name){

    var width;
    var height;
    var extension;
    var loaderPath;

    for (var i = 0; i < allObjectData.length; i++){
        if(allObjectData[i].name === name){
            width = allObjectData[i].width;
            height = allObjectData[i].height;
            extension = allObjectData[i].extension;
            break;
        }
    }
    var filename = name+extension;
    loaderPath = 'objects/'+name+'.glb';
    console.log("object name before loading.. : " +name)
    loader.load(loaderPath,
        // call-back
        function ( gltf ) {
            // https://discourse.threejs.org/t/uncaught-in-promise-typeerror-cannot-read-properties-of-undefined-reading-material-error/38003
            console.log("Setting obj position and size. ");

            const model = gltf.scene;
            model.receiveShadow = true;
            model.castShadow = true;

            model.scale.set(width/10, height/20, 40/10)

            model.traverse( ( object ) => {

                if ( object.isMesh ) {
                    object.userData = {
                        objectName: name,
                        sceneID: 4,

                        isDraggable: true
                    };
                    object.material.color.set( 0xffffff );

                }

            } );

            mainScene.add( model );
            sceneObjects.push(model);
            console.log("Updating drag controller");
            // updating the drag controls to the new current list of objects

        },
        // called when loading is in progress
        function ( xhr ) {

            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

        },
        // called when loading has errors
        function ( error ) {

            console.log( 'An error happened: ' +error);

        }
    );


}

function HideObjectList(){
    // clearing the innerHTML and hiding
    objectScrollPane.innerHTML = '';
    objectScrollPane.style.display = 'none';
    objectOptions.style.display = 'flex';
}


// if shouldshow is false, it will hide it
function ShowNextMenu(shouldShow){
    if(!shouldShow){

        leftSidebar2nd.style.width = '0px';
        return;
    }
    roomTypeLabel.innerText = objectTypeName;
    leftSidebar2nd.style.width = '180px';
}

/* if the user goes to the build mode, it will hide the design bar and will then display them
    afterwards after editing the walls*/
export function HideDesignBar(){
    leftSidebar2nd.style.display = 'none';
}

export function ShowDesignBar(){
    leftSidebar2nd.style.display = 'flex';
}