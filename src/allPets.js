class Pet {
    constructor(color, price) {
        this.color = color;
        this.price = price;
        this._id = "pet-id" + Math.floor((Math.random() * 1000));
    }
    
    get getId() {
        return this._id;
    }
    
    get getColor() {
        return this.color;
    }
    
    get getPrice() {
        return this.price;
    }
}

class Dog extends Pet {
    constructor(color, price, name) {
        super(color, price);
        this.name = name;
    }
}

class Cat extends Pet {
    constructor(color, price, name, isFluffy) {
        super(color, price);
        this.name = name;
        this.isFluffy = isFluffy;
    }
    
    get getFluffy() {
        return this.isFluffy;
    }
}

class Hamster extends Pet {
    constructor(color, price, isFluffy) {
        super(color, price);
        this.isFluffy = isFluffy;
    }
    
    get getFluffy() {
        return this.isFluffy;
    }
}
