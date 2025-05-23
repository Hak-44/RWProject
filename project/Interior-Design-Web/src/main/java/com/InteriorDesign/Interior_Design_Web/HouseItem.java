package com.InteriorDesign.Interior_Design_Web;


public class HouseItem extends NeutralObj{

    String name;
    String image;
    String itemDescription;
    float itemPrice;
    String itemURL;
    String queryPhrase;

    public HouseItem(String name, short objectType, short roomType, float width, float height, float depth, String image, String extension, String queryPhrase) {
        super(objectType, roomType, width, height, depth, extension);
        this.name = name;
        this.image = image;
        this.objectType = objectType;
        this.roomType = roomType;
        this.width = width;
        this.height = height;
        this.itemDescription = "None";
        this.itemPrice = 0.00f;
        this.itemURL = "N/A";
        this.queryPhrase = queryPhrase;

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
