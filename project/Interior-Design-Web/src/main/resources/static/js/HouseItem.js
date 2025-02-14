import { NeutralObj} from "./NeutralObj.js";

export class HouseItem extends NeutralObj{

    name;
    image;
    itemDescription;
    itemPrice;
    itemURL;
    queryPhrase;

    constructor(name, objectType, roomType, width, height, depth, image, extension, queryPhrase) {
        super(objectType, roomType, width, height, depth, extension);
        this.name = name;
        this.image = image;
        this.objectType = objectType;
        this.roomType = roomType;
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.extension = extension;
        this.itemDescription = "None";
        this.itemPrice = 0.00;
        this.itemURL = "N/A";
        this.queryPhrase = queryPhrase

    }

    GetItemName(){
        return this.name;
    }

    GetItemDesc(){
        return this.itemDescription;
    }

    GetItemPrice(){
        return this.itemPrice;
    }

    GetItemURL(){
        return this.itemURL;
    }

    Setname(newname){
        this.name = newname;
    }

    SetItemDesc(newItemDescription){
        this.itemDescription = newItemDescription;
    }

    SetItemPrice(newItemPrice){
        this.itemPrice = newItemPrice;
    }

    SetItemURL(newItemURL){
        this.itemURL = newItemURL;
    }


}