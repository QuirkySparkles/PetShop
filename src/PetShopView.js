class PetShopView {
    constructor(allPets, totalPrice) {
        this.allPets = allPets;
        this.averagePrice = 0;
        this.totalPrice = totalPrice;
    }
    
    renderAllPets(petShop) {
        if (!this.allPets.length) {
            return;
        }
        
        const navbarTabs = petShop.shadowRoot.querySelectorAll("#navbar div");
        
        for (let i = 0; i < 4; i++) {
            navbarTabs[i].classList.remove("active-tab");
        }
        
        petShop.shadowRoot.querySelector(".all-pets").classList.add("active-tab");
        
        this.allPets.forEach(pet => petShop.shadowRoot.querySelector("." + pet._id).classList.remove("hidden"));
    }
    
    renderView(petShop) {
        if (!this.allPets.length) {
            return;
        }
        
        let toShow = [];
        let toHide = [];
        
        const navbarTabs = petShop.shadowRoot.querySelectorAll("#navbar div");
        
        for (let i = 0; i < 4; i++) {
            navbarTabs[i].classList.remove("active-tab");
        }
        
        if (petShop._viewMode === "cats") {
            petShop.shadowRoot.querySelector(".all-cats").classList.add("active-tab");
            this.allPets.forEach(pet => (pet instanceof Cat) ? toShow.push(pet._id) : toHide.push(pet._id));
        } else if (petShop._viewMode === "average") {
            petShop.shadowRoot.querySelector(".exp-pets").classList.add("active-tab");
            this.allPets.forEach(pet => (pet.price > this.averagePrice) ? toShow.push(pet._id) : toHide.push(pet._id));
        } else {
            petShop.shadowRoot.querySelector(".fluffy-white").classList.add("active-tab");
            this.allPets.forEach(pet => (pet.isFluffy && pet.color === "white") ? toShow.push(pet._id) : toHide.push(pet._id));
        }

        toShow.forEach(elementClass => petShop.shadowRoot.querySelector("." + elementClass).classList.remove("hidden"));
        toHide.forEach(elementClass => petShop.shadowRoot.querySelector("." + elementClass).classList.add("hidden"));
    }
    
    changeModalView(pet, petShop) {
        const fluffyCheckBox = petShop.shadowRoot.querySelector(".fluffy-section");
        const petNameInput = petShop.shadowRoot.querySelector(".name-section");
        
        if (pet === "cat") {
            fluffyCheckBox.classList.remove("hidden");
            petNameInput.classList.remove("hidden");
        } else if (pet === "dog") {
            fluffyCheckBox.classList.add("hidden");
            petNameInput.classList.remove("hidden");
        } else {
            fluffyCheckBox.classList.remove("hidden");
            petNameInput.classList.remove("label");
            petNameInput.classList.add("hidden");
        }
    }
    
    showMessage(message, petShop) {
        const messageElement = petShop.shadowRoot.querySelector("#creation-status");
        
        messageElement.innerHTML = message;
        setTimeout( () => messageElement.innerHTML = "", 3000);
    }
    
    setAveragePrice() {
        this.averagePrice = this.totalPrice / this.allPets.length;
    }
}

