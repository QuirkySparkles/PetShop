class PetShop {
    constructor(allPets = [], totalPrice = 0) {
        
        this.allPets = allPets;
        this.totalPrice = totalPrice;
        this.averagePrice = this.setAveragePrice();
    }
    
    filterPets(viewMode) {    
        let toShow = [];
        let toHide = [];
        
        if (viewMode === "cats") {
            this.allPets.forEach(pet => (pet instanceof Cat) ? toShow.push(pet.getId) : toHide.push(pet.getId));
        } else if (viewMode === "average") {
            this.allPets.forEach(pet => (pet.getPrice > this.averagePrice) ? toShow.push(pet.getId) : toHide.push(pet.getId));
        } else if (viewMode === "fluffy-white") {
            this.allPets.forEach(pet => (pet.getFluffy && pet.getColor === "white") ? toShow.push(pet.getId) : toHide.push(pet.getId));
        } else {
            this.allPets.forEach(pet => toShow.push(pet.getId));
        }
        
        return [toShow, toHide];
    }
    
    createPet(viewMode, PetClass, ElementClass, color, price, nameOrFluffy, isFluffy) {
        let newPet = new PetClass(color, price, nameOrFluffy, isFluffy);
        let newPetElement = new ElementClass(color, price, nameOrFluffy, isFluffy);

        newPetElement.classList.add(newPet.getId);

        this.allPets.push(newPet);
        this.totalPrice += price;
        this.setAveragePrice();
        
        if (viewMode !== "all") {
            
           if (this._shouldHide(newPet)) {
               newPetElement.classList.add("hidden");
           }
        }
        
        return newPetElement;
    }
    
    _shouldHide(element) {
        if (this._viewMode === "all") {
            return false;
        } else if (this._viewMode === "cats") {
            return (!(element instanceof Cat));
        } else if (this._viewMode === "average") {
            return (petShopView.averagePrice > element.getPrice);
        } else {
            return (!element.getFluffy || element.getColor !== "white");
        }
    }
    
    deletePet(petId) {
        this.allPets = this.allPets.filter(pet => {
            if (pet.getId === petId) {
                this.totalPrice -= pet.getPrice;
                this.setAveragePrice();
                return false;
            }
            return true;
        });
    }
    
    setAveragePrice() {
        this.averagePrice = this.totalPrice / this.allPets.length;
    }
}

