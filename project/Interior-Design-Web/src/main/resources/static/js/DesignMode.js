import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { HouseItem } from "./HouseItem.js";

// loader to load the object.
const loader = new GLTFLoader();
let mainScene;


// referencing the json file containing the
const objectJSONPath = "json/interiorObjects";
const imgLocation = "images/";

// 1. create a list that will contain all the objects[]
// 2. create an object list that will have the objects that are in the scene
// 3. if the list is loaded, then don't retrieve from the backend.

var allObjectData = [];
var sceneObjects = [];

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

export function PassSceneToDesign(scene){
    console.log("Passing scene to design mode");
    mainScene = scene;
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

        var name = intersects[0].object.userData.objectName
        console.log("Object: "+name)
        // x_coordinates = intersects[0].point.x;
        // // the Z coordinates is the y coordinates to the user as they are looking straight down towards the worldPlane
        // y_coordinates = intersects[0].point.z;

    }else{


    }



    //console.log("Mouse X: "+ x_coordinates + " | Mouse Y: " + y_coordinates);

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
                        sceneID: 4
                    };
                    object.material.color.set( 0xffffff );

                }

            } );

            mainScene.add( model );


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