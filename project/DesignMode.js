import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

// labelling all the 
var objectType;
var previousObjectType; // used to close the div when needed.
var objectTypeName;
const roomTypeLabel = document.getElementById('roomTypeLabelName');
const leftSidebar2nd = document.getElementById('leftSidebar2nd');


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


function DisplayRoomTypeOptions(value, typeName){
    /* Set the room ID for the objectTypes that will be retrieved */
    objectType = value; 
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