import { NeutralObj} from "./NeutralObj.js";

export class HouseItem extends NeutralObj{

    itemName;
    itemDescription;
    itemPrice;
    itemURL;

    constructor(itemName, objectType, itemType, width, height) {
        super(objectType, itemType, width, height);
        this.itemName = itemName;
        this.objectType = objectType;
        this.itemType = itemType;
        this.width = width;
        this.height = height;
        this.itemDescription = "None";
        this.itemPrice = 0.00;
        this.itemURL = "N/A";

    }

    GetItemName(){
        return this.itemName;
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

    SetItemName(newItemName){
        this.itemName = newItemName;
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