import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

// referencing the json file containing the
const objectJSONPath = "json/interiorObjects";
const imgLocation = "src/main/resources/static/images/";
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
    // getting the json from the public object folder
    fetch("json/interiorObjects")
        .then(response => response.json())
        .then(data => {
            console.log("loading from json");
            livingRoomItems = data.livingRoomItems;
            kitchenItems = data.kitchenItems;
            GetRoomType();
            CacheItems();
        })
        .catch(error => console.error('Error:', error))



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
    var div = document.createElement('div');
    var label = document.createElement('label');
    var img = document.createElement('img');

    label.innerText = obj.name;
    label.style.textAlign = "center";

    img.src = imgLocation+obj.image;
    img.width = 128;
    img.height = 128;

    div.style.display = "flex";
    div.style.flexDirection = "column";
    div.appendChild(label);
    div.appendChild(img);
    objectScrollPane.appendChild(div);

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