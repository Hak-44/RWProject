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

    constructor(objectType, roomType, width, height, extension) {
        this.objectType = objectType;
        this.roomType = roomType;
        this.width = width;
        this.height = height;
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