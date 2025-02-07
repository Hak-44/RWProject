package com.InteriorDesign.Interior_Design_Web;


public class HouseItem extends NeutralObj{

    String name;
    String image;
    String itemDescription;
    float itemPrice;
    String itemURL;

    public HouseItem(String name, short objectType, short itemType, float width, float height, String image) {
        super(objectType, itemType, width, height);
        this.name = name;
        this.image = image;
        this.objectType = objectType;
        this.itemType = itemType;
        this.width = width;
        this.height = height;
        this.itemDescription = "None";
        this.itemPrice = 0.00f;
        this.itemURL = "N/A";

    }


    public String GetItemName(){
        return this.name;
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
        this.name = newName;
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
