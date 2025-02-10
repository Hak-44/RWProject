export class NeutralObj{

    width
    height
    depth;

    objectType;
    roomType;
    extension;

    positionX;
    positionY;
    positionZ;

    rotationX;
    rotationY;
    rotationZ;

    scaleX;
    scaleY;
    scaleZ;

    constructor(objectType, roomType, width, height, depth, extension) {
        this.objectType = objectType;
        this.roomType = roomType;
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.extension = extension;
    }

    getObjectType(){
        return this.objectType;
    }
    getItemType(){
        return this.roomType;
    }




    getPositionX(){
        return this.positionX;
    }
    getPositionY(){
        return this.positionY;
    }
    getPositionZ(){
        return this.positionZ;
    }

    setPositionX(newPositionX){
        this.positionX = newPositionX;
    }
    setPositionY(newPositionY){
        this.positionY = newPositionY;
    }
    setPositionZ(newPositionZ){
        this.positionZ = newPositionZ;
    }




    getRotationX(){
        return this.rotationX;
    }
    getRotationY(){
        return this.rotationY;
    }
    getRotationZ(){
        return this.rotationZ;
    }

    setRotationX(newRotationX){
        this.rotationX = newRotationX;
    }
    setRotationY(newRotationY){
        this.rotationY = newRotationY;
    }
    setRotationZ(newRotationZ){
        this.rotationZ = newRotationZ;
    }




    getScaleX(){
        return this.scaleX;
    }
    getScaleY(){
        return this.scaleY;
    }
    getScaleZ(){
        return this.scaleZ;
    }

    setScaleX(newScaleX){
        this.scaleX = newScaleX;
    }
    setScaleY(newRotationY){
        this.scaleY = newRotationY;
    }
    setScaleZ(newRotationZ){
        this.scaleZ = newRotationZ;
    }


}