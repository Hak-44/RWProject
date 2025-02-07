package com.InteriorDesign.Interior_Design_Web;


public class HouseItem extends NeutralObj{

    String itemName;
    String itemDescription;
    float itemPrice;
    String itemURL;

    HouseItem(String itemName, short objectType, short itemType) {
        this.itemName = itemName;
        this.objectType = objectType;
        this.itemType = itemType;
        itemDescription = "None";
        itemPrice = 0.00f;
        itemURL = "N/A";

    }

    public String GetItemName(){
        return this.itemName;
    }

    public String GetItemDesc(){
        return this.itemDescription;
    }

    public float GetItemPrice(){
        return this.itemPrice;
    }

    public String GetItemURL(){
        return this.itemURL;
    }

    public void SetItemName(String newName){
        this.itemName = newName;
    }

    public void SetItemDesc(String newDescription){
        this.itemDescription = newDescription;
    }

    public void SetItemPrice(float newPrice){
        this.itemPrice = newPrice;
    }

    public void SetItemURL(String newURL){
        this.itemURL = newURL;
    }

}
