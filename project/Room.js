import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';

var wallCount = 0;

export function generateWall(scene){

    console.log("Wall is being generated");
    let lines;
    const material = new THREE.LineBasicMaterial( { color: 0x000000 } );
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

export function getWallCount(){
    return wallCount
}

export function setWallCount(count){
    wallCount = count
}


