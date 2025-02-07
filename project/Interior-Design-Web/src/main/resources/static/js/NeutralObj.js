export class NeutralObj{

    width
    height
    depth;

    objectType;
    roomType;
    positionX;
    positionY;
    positionZ;

    constructor(objectType, roomType, width, height) {
        this.objectType = objectType;
        this.roomType = roomType;
        this.width = width;
        this.height = height;
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
    setPositionX(newPositionX){
        this.positionX = newPositionX;
    }

    getPositionY(){
        return this.positionY;
    }
    setPositionY(newPositionY){
        this.positionY = newPositionY;
    }

    getPositionZ(){
        return this.positionZ;
    }
    setPositionZ(newPositionZ){
        this.positionZ = newPositionZ;
    }


}