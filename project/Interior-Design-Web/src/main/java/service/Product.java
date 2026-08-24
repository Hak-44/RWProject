package service;

public class Product {

    private String product_series;
    private String product_title;
    private String product_photo;
    private double product_price;
    private String product_url;


    public Product(String series, String name, String image, double price, String link){
        this.product_series = series;
        this.product_title = name;
        this.product_photo = image;
        this.product_price = price;
        this.product_url = link;
    }


    // Get

    public String getSeries(){
        return this.product_series;
    }

    public String getName(){
        return this.product_title;
    }

    public String getImage(){
        return this.product_photo;
    }

    public double getPrice(){
        return this.product_price;
    }

    public String getLink(){
        return this.product_url;
    }



    // Set
    public void setSeries(String series){
        this.product_series = series;
    }

    public void setName(String name){
        this.product_title = name;
    }

    public void setImage(String imageLink){
        this.product_photo = imageLink;
    }

    public void setPrice(double price){
        this.product_price = price;
    }

    public void setLink(String link){
        this.product_url = link;
    }




}
