package com.InteriorDesign.Interior_Design_Web;

import java.math.BigDecimal;

abstract class NeutralObj {

    float width;
    float height;
    float depth;

    short objectType;
    short itemType;
    BigDecimal positionX;
    BigDecimal positionY;
    BigDecimal positionZ;

    public short getObjectType(){
        return objectType;
    }

    public short getItemType(){
        return itemType;
    }

    public BigDecimal getPositionX(){
        return this.positionX;
    }

    public void setPositionX(BigDecimal newPositionX){
        this.positionX = newPositionX;
    }

    public BigDecimal getPositionY(){
        return this.positionY;
    }
    public void setPositionY(BigDecimal newPositionY){
        this.positionY = newPositionY;
    }

    public BigDecimal getPositionZ(){
        return this.positionZ;
    }
    public void setPositionZ(BigDecimal newPositionZ){
        this.positionZ = newPositionZ;
    }

}
