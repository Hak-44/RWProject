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
var models = [];
var sceneObjectData = [];

var editingObject = [];
var hasEditingObject = false;
var isSideBarClicked = false;
var hasSearchBarBeenClicked = false;

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
var bathroomItems;
var bedroomItems;


// labelling variables for the navigation for the left sidebar
var objectType;
var objectSecondType;
var previousObjectType; // used to close the div when needed.
var objectTypeName;
const roomTypeLabel = document.getElementById('objectTypeLabelName');
const leftSidebar2nd = document.getElementById('leftSidebar2nd');
const objectOptions = document.getElementById('objectOptions');
const objectScrollPane = document.getElementById('objectScrollPane');
const searchScrollPane = document.getElementById('searchScrollPane');
const rightSidebar = document.getElementById('rightSidebar');



const objectName = document.getElementById('objectName');
const objectImage = document.getElementById('objectImage');
const objectDescription = document.getElementById('objectDescription');
const objectPrice = document.getElementById('objectPrice')
const objectURL = document.getElementById('objectURL')



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

document.getElementById('rightSidebar').addEventListener('click', function(){
    isSideBarClicked = true;
});

document.getElementById('objectSearchInput').addEventListener('click', function(){
    hasSearchBarBeenClicked = true;
});


document.getElementById('objectSearchButton').addEventListener('click', function(){
    var searchInput = document.getElementById('objectSearchInput').value;
    console.log(searchInput);
    searchInput = searchInput + " " +selectedObject.userData.queryPhrase;
    // do the rest of the inputs here if needed.
    console.log("Searching for "+searchInput);
    SearchForItems(searchInput);
});

// // currently not working, need to find another way....
// document.getElementById('removeObjectButton').addEventListener('click', function(){
//     console.log("WIP.");
//     // console.log("selected id unique: "+selectedObject.userData.uniqueID);
//     //
//     // console.log(sceneObjects);
//     // console.log(models);
//     // for (let i = 0; i < sceneObjects.length; i++){
//     //     console.log("current unique: " +sceneObjects[i].userData.uniqueID)
//     //     if(sceneObjects[i].userData.uniqueID == selectedObject.userData.uniqueID){
//     //         RevertDeselectedObject();git s
//     //         mainScene.remove(sceneObjects[i]);
//     //         mainScene.remove(models[i]);
//     //         sceneObjects.pop(sceneObjects[i]);
//     //         models.pop(models[i]);
//     //
//     //         activeClick = false;
//     //         rightSidebar.style.width = '0px';
//     //
//     //     }
//     // }
//     // console.log("After")
//     // console.log(sceneObjects)
//     // console.log(models)
//
// });

// creating the json object that will be given after going through the
function SearchForItems(searchInput){

    const searchJSON = {
        query: searchInput
    }
    console.log("Sending: "+JSON.stringify(searchJSON));

    fetch('/rapidAPI', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchJSON),
    })
        .then(response => response.json())
        .then((data) => {
            if(data){
                DisplaySearchResults(data.data.products);
            }
        })
        .catch(error => {
            // handle any errors that occur during the fetch request
            console.log("[CLIENT] - Error occured: "+error)
        });
}

function DisplaySearchResults(items){



    items.forEach(item =>{
        var mainDiv = document.createElement('div');
        var horizontalDiv = document.createElement('div');
        var detailDiv = document.createElement('div');

        // creation of elements for the information
        var photoSRC = document.createElement('img');
        var descLabel = document.createElement('label');
        var priceLabel = document.createElement('label');
        var urlLabel = document.createElement('label');

        // width of the picture
        photoSRC.src = item.product_photo;
        photoSRC.width = 128; //180
        photoSRC.height = 128; //256
        photoSRC.id = "itemPhoto";

        //inserted the text for the appropriate divs
        descLabel.innerText = item.product_title.toString();
        descLabel.id = "productDescription";

        priceLabel.innerText = item.product_price.toString();
        priceLabel.id = "productPrice";

        urlLabel.innerText = item.product_url;
        urlLabel.id = "productURL";

        // setting the div to flex column, so the details are displayed as a column
        detailDiv.id = "itemDetails";
        detailDiv.style.display = "flex";
        detailDiv.style.flexDirection = "column";

        // setting the div to flex row so the information is next to the img div on the right
        horizontalDiv.style.display = "flex";
        horizontalDiv.style.gap = "1em";
        horizontalDiv.style.flexDirection = "row";
        horizontalDiv.style.width = "100%"; // makes it share it

        mainDiv.style.width = "100%";   // match the right side div

        detailDiv.appendChild(descLabel);
        detailDiv.appendChild(priceLabel);
        detailDiv.appendChild(urlLabel);

        horizontalDiv.appendChild(photoSRC);
        horizontalDiv.appendChild(detailDiv);

        mainDiv.appendChild(horizontalDiv);

        // event listeners for hovering over the div and leaving the div, which simply changes the colour of it.
        mainDiv.addEventListener('mouseenter', function() {
            mainDiv.style.backgroundColor = '#BAC5B8';
        });

        mainDiv.addEventListener('mouseleave', function() {
            mainDiv.style.backgroundColor = '';
        });

        mainDiv.addEventListener('click', function() {

            //query selectors delve into different divs and can select the children of the childrens of parents (if you get what I mean)
            console.log("Updating object details");
            var itemDetails = mainDiv.querySelector('#itemDetails')
            //var itemDetails = itemDiv.querySelector('#productDescription');
            var itemPrice = itemDetails.querySelector('#productPrice').textContent;
            var itemDesc = itemDetails.querySelector('#productDescription').textContent;
            var itemURL = itemDetails.querySelector('#productURL').textContent;

            selectedObject.userData.image = mainDiv.querySelector('#itemPhoto').src;
            selectedObject.userData.itemDescription = itemDesc;
            selectedObject.userData.itemPrice = itemPrice;
            selectedObject.userData.itemURL = itemURL;

            objectImage.src = mainDiv.querySelector('#itemPhoto').src;
            objectDescription.innerText = itemDesc;
            objectPrice.innerText = itemPrice;
            objectURL.innerText = itemURL;

        });



        searchScrollPane.appendChild(mainDiv);
    })

    searchScrollPane.style.display = 'flex';
}


// adding an event listener that will check for keyboard inputs
document.addEventListener('keydown', function(event) {
    // G is the button that will move the object around that is selected
    if (event.key === 'g') {

        // checks if the textfield for searching is still active, if so, return.
        if(document.activeElement === document.getElementById('objectSearchInput')){
            console.log("typing..")
            return;
        }

        // if this flag is true, it means the user has pressed G again, so release it
        if(hasEditingObject){
            dragControls.enabled = false;
            DetachTransformControls();
            ReleaseObject();
            EnableBothOrbitCameras();
            if(selectedObject == null) rightSidebar.style.width = '0px';

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
    //  depending on its position, if the object goes underneath the main plain, it will snap back to a reasonable y-axis
    if(selectedObject.position.y < -0.45){
        selectedObject.position.y = -0.45;

    }
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
    if(hasTransformControls) transformControls.enabled = false;
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
        searchScrollPane.innerHTML = ''; // clearing the scroll pane for the next object.
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
            DisplayObjectDetails(true); // display te details
            rightSidebar.style.width = '500px';

        }
        console.log("Object: "+selectedObject.userData.objectName);
    }else{
        // clicked off the object, so remove it from the selected variable

        if(!hasEditingObject && !isSideBarClicked){
            activeClick = false;
            RevertDeselectedObject();
            if(selectedObject == null) rightSidebar.style.width = '0px';
            //DisplayObjectDetails(false);
        }
        if(isSideBarClicked) isSideBarClicked = false;

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

function DisplayObjectDetails(isDisplayed){
    if(isDisplayed){

        objectName.innerText = selectedObject.userData.objectName;
        // image
        objectImage.src = selectedObject.userData.image;
        objectDescription.innerText = selectedObject.userData.itemDescription;
        objectPrice.innerText = selectedObject.userData.itemPrice;
        objectURL.innerText = selectedObject.userData.itemURL;
    }else{
        objectName.innerText = "";
        // image
        objectImage.src = "";
        objectDescription.innerText = "";
        objectPrice.innerText = "";
        objectURL.innerText = "";
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
            bathroomItems = data.bathroomItems;
            bedroomItems = data.bedroomItems;
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
        const houseItem = new HouseItem(obj.name, obj.objectType, obj.roomType, obj.width, obj.height, obj.depth, obj.image, obj.extension, obj.queryPhrase);
        allObjectData.push(houseItem);
    });

    kitchenItems.forEach(obj => {
        const houseItem = new HouseItem(obj.name, obj.objectType, obj.roomType, obj.width, obj.height, obj.depth, obj.image, obj.extension, obj.queryPhrase);
        allObjectData.push(houseItem);
    });

    bathroomItems.forEach(obj => {
        const houseItem = new HouseItem(obj.name, obj.objectType, obj.roomType, obj.width, obj.height, obj.depth, obj.image, obj.extension, obj.queryPhrase);
        allObjectData.push(houseItem);
    });

    bedroomItems.forEach(obj => {
        const houseItem = new HouseItem(obj.name, obj.objectType, obj.roomType, obj.width, obj.height, obj.depth, obj.image, obj.extension, obj.queryPhrase);
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
            bathroomItems.forEach(obj => {

                if(obj.roomType == objectSecondType && obj.objectType == objectType) DisplayObject(obj);
            });
            break;
        case 8:
            // loop pass and add (bedroom items)
            bedroomItems.forEach(obj => {

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

    var index;
    var width;
    var height;
    var depth;
    var extension;
    var loaderPath;

    for (var i = 0; i < allObjectData.length; i++){
        if(allObjectData[i].name === name){
            index = i;
            width = allObjectData[i].width;
            height = allObjectData[i].height;
            depth = allObjectData[i].depth;
            extension = allObjectData[i].extension;
            break;
        }
    }
    var filename = name+extension;
    loaderPath = 'objects/chair2.glb';  //NOTE: THERE IS A REASON WHY THE PATH IS SET LIKE THIS
    console.log("object name before loading.. : " +name)
    loader.load(loaderPath,
        // call-back
        function ( gltf ) {
            // https://discourse.threejs.org/t/uncaught-in-promise-typeerror-cannot-read-properties-of-undefined-reading-material-error/38003
            console.log("Setting obj position and size. ");

            const model = gltf.scene;
            model.receiveShadow = true;
            model.castShadow = true;

            console.log("depth:  "+depth);
            model.scale.set(45/10, 95/20, 40/10)   //NOTE: THERE IS A REASON WHY THE PATH IS SET LIKE THIS

            model.traverse( ( object ) => {

                // setting the user data for the specific object loaded with userdata
                if ( object.isMesh ) {
                    object.userData = {
                        objectName: name,

                        width: width,
                        height: height,
                        depth: depth,

                        objectType: allObjectData[index].objectType,
                        roomType: allObjectData[index].roomType,
                        extension: allObjectData[index].extension,

                        image: imgLocation+allObjectData[index].image,
                        itemDescription: allObjectData[index].itemDescription,
                        itemPrice: allObjectData[index].itemPrice,
                        itemURL: allObjectData[index].itemURL,
                        queryPhrase: allObjectData[index].queryPhrase,

                        sceneID: 4,
                        uniqueID: object.uuid


                    };
                    object.material.color.set( 0xffffff );
                    mainScene.add( model );


                }

            } );
            models.push(model);
            sceneObjects.push(object);
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