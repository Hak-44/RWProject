export class NeutralObj{

    width
    height
    depth;

    objectType;
    itemType;
    positionX;
    positionY;
    positionZ;

    constructor(objectType, itemType, width, height) {
        this.objectType = objectType;
        this.itemType = itemType;
        this.width = width;
        this.height = height;
    }

    getObjectType(){
        return this.objectType;
    }

    getItemType(){
        return this.itemType;
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