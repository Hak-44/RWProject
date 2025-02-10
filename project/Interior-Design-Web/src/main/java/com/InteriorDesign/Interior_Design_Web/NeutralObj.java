package com.InteriorDesign.Interior_Design_Web;

import java.math.BigDecimal;

public class NeutralObj {

    String UUID;
    
    float width;
    float height;
    float depth;

    short objectType;
    short roomType;
    String extension;

    BigDecimal positionX;
    BigDecimal positionY;
    BigDecimal positionZ;

    BigDecimal rotationX;
    BigDecimal rotationY;
    BigDecimal rotationZ;

    BigDecimal scaleX;
    BigDecimal scaleY;
    BigDecimal scaleZ;

    public NeutralObj(short objectType, short roomType, float width, float height, float depth, String extension) {
        this.objectType = objectType;
        this.roomType = roomType;
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.extension = extension;
    }

    public short getObjectType(){
        return objectType;
    }

    public short getRoomType(){
        return roomType;
    }




    public BigDecimal getPositionX(){
        return this.positionX;
    }
    public BigDecimal getPositionY(){
        return this.positionY;
    }
    public BigDecimal getPositionZ(){
        return this.positionZ;
    }

    public void setPositionX(BigDecimal newPositionX){
        this.positionX = newPositionX;
    }
    public void setPositionY(BigDecimal newPositionY){
        this.positionY = newPositionY;
    }
    public void setPositionZ(BigDecimal newPositionZ){
        this.positionZ = newPositionZ;
    }




    public BigDecimal GetRotationX(){
        return this.rotationX;
    }
    public BigDecimal GetRotationY(){
        return this.rotationY;
    }
    public BigDecimal GetRotationZ(){
        return this.rotationZ;
    }

    public void SetRotationX(BigDecimal newRotationX){
        this.rotationX = newRotationX;
    }
    public void SetRotationY(BigDecimal newRotationY){
        this.rotationY = newRotationY;
    }
    public void SetRotationZ(BigDecimal newRotationZ){
        this.rotationZ = newRotationZ;
    }




    public BigDecimal GetScaleX(){
        return this.scaleX;
    }
    public BigDecimal GetScaleY(){
        return this.scaleY;
    }
    public BigDecimal GetScaleZ(){
        return this.scaleZ;
    }

    public void SetScaleX(BigDecimal newScaleX){
        this.scaleX = newScaleX;
    }
    public void SetScaleY(BigDecimal newScaleY){
        this.scaleY = newScaleY;
    }
    public void SetScaleZ(BigDecimal newScaleZ){
        this.scaleZ = newScaleZ;
    }









}
