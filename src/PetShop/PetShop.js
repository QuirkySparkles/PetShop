const shopDocument = document.currentScript.ownerDocument;

const sneaky = new Cat ("brown", 17, "Sneaky", true);
const mellow = new Cat ("white", 100, "Mellow", true);
const barky = new Dog ("cream", 27, "Barky");
const buddy = new Dog ("ashen", 53, "Buddy");
const chip = new Hamster ("brown", 15, false);
const dale = new Hamster ("cream", 15, true);

let zoo = [sneaky, barky, chip, mellow, buddy, dale];

let zooElements = [];
let totalPrice = 0;

zoo.forEach((pet, i) => {
    const { _id, color, price } = pet;
    
    totalPrice += price;

    if (pet instanceof Cat) {
        zooElements.push(new CatTemplate(color, price, pet.name, pet.isFluffy));
    }

    if (pet instanceof Dog) {
        zooElements.push(new DogTemplate(color, price, pet.name));
    }

    if (pet instanceof Hamster) {
        zooElements.push(new HamsterTemplate(color, price, pet.isFluffy));
    }
    
    zooElements[i].classList.add(_id);
});

let petShopView = new PetShopView(zoo, totalPrice);

class PetShop extends HTMLElement {
    constructor() {
        super();
        this.initialPets = zooElements;
        this._viewMode = "all";
    }
    
    connectedCallback() {
        const shadowRoot = this.attachShadow({mode: "open"});
        const shopTemplate = shopDocument.querySelector("#pet-shop");
        const shopInstance = shopTemplate.content.cloneNode(true);
        
        shadowRoot.appendChild(shopInstance);
        petShopView.setAveragePrice();
        
        const modalWindow = this.shadowRoot.querySelector(".add-modal");
        
        this.shadowRoot.querySelector(".open-modal").addEventListener("click", e => this.openModal(modalWindow));
        this.shadowRoot.querySelector(".cancel").addEventListener("click", e => this.closeModal(modalWindow));
        this.shadowRoot.querySelector(".pet-type").addEventListener("change", e => this.changeModalView(e.target.value));
        this.shadowRoot.querySelector(".create-pet").addEventListener("click", e => this.addPet());
        this.shadowRoot.querySelector(".all-pets").addEventListener("click", e => this.showAll());
        this.shadowRoot.querySelector(".all-cats").addEventListener("click", e => this.showCats());
        this.shadowRoot.querySelector(".exp-pets").addEventListener("click", e => this.showAverage());
        this.shadowRoot.querySelector(".fluffy-white").addEventListener("click", e => this.showFluffyWhite());
        
        this.initialPets.forEach((pet, i) => {        
            this.shadowRoot.querySelector("#showcase").appendChild(pet);
            
            this.shadowRoot.querySelector("." + zoo[i]._id).shadowRoot.querySelector("img").addEventListener("click", e => this.deletePet(zoo[i]._id));
        });
    }
        
    addPet() {
        const selectedPet = this.shadowRoot.querySelector(".pet-type").value;
        const color = this.shadowRoot.querySelector(".pet-color").value;
        const price = Number(this.shadowRoot.querySelector(".price").value);
        
        if (!this.validateInput(price, "price")) {
            petShopView.showMessage("Price is not correct!", this);
            return;
        }
        
        petShopView.totalPrice += price;
        
        if (selectedPet === "cat") {
            const isFluffy = this.shadowRoot.querySelector(".fluffy").checked;
            const name = this.shadowRoot.querySelector(".name").value;
            
            if (!this.validateInput(name, "name")) {
                petShopView.showMessage("Name is not correct!", this);
                return;
            }
            
            this._createPet(Cat, CatTemplate, color, price, name, isFluffy);
        }
        
        if (selectedPet === "dog") {
            const name = this.shadowRoot.querySelector(".name").value;
            
            if (!this.validateInput(name, "name")) {
                petShopView.showMessage("Name is not correct!", this);
                return;
            }
            
            this._createPet(Dog, DogTemplate, color, price, name);
        }
        
        if (selectedPet === "hamster") {
            const isFluffy = this.shadowRoot.querySelector(".fluffy").checked;
            
            this._createPet(Hamster, HamsterTemplate, color, price, isFluffy);
        }
    }
    
    _createPet(PetClass, ElementClass, color, price, nameOrFluffy, isFluffy) {
        let newPet = new PetClass(color, price, nameOrFluffy, isFluffy);
        let newPetElement = new ElementClass(color, price, nameOrFluffy, isFluffy);

        newPetElement.classList.add(newPet._id);

        petShopView.allPets.push(newPet);
        petShopView.setAveragePrice();
        
        if (this._viewMode !== "all") {
            
           if (this._shouldHide(newPet)) {
               newPetElement.classList.add("hidden");
           }
        }
        
        this.shadowRoot.querySelector("#showcase").appendChild(newPetElement);
        
        const newElement = this.shadowRoot.querySelector("." + newPet._id);
        newElement.shadowRoot.querySelector("img").addEventListener("click", e => this.deletePet(newPet._id));
        
        petShopView.showMessage("Pet has been added!", this);
    }
    
    _shouldHide(element) {
        if (this._viewMode === "cats") {
            return (!(element instanceof Cat));
        } else if (this._viewMode === "average") {
            return (petShopView.averagePrice > element.price);
        } else {
            return (!element.isFluffy || element.color !== "white")
        }
    }
    
    showAll() {
        this._viewMode = "all";
        petShopView.renderAllPets(this);
    }
    
    showCats() {
        this._viewMode = "cats";
        petShopView.renderView(this);
    }
    
    showAverage() {
        this._viewMode = "average";
        petShopView.renderView(this);
    }
    
    showFluffyWhite() {    
        this._viewMode = "fluffy-white";
        petShopView.renderView(this);
    }
    
    openModal(modalWindow) {
        modalWindow.classList.remove("hidden");
    }
    
    closeModal(modalWindow) {
        modalWindow.classList.add("hidden");
    }
    
    changeModalView(pet) {
        petShopView.changeModalView(pet, this);
    }
    
    validateInput(input, type) {        
        if (type === "price") {
            return (input > 0 && isFinite(input) && typeof(input) === "number");
        }
        
        return (input && typeof(input) === "string");
    }
    
    deletePet(petId) {
        petShopView.allPets = petShopView.allPets.filter(pet => {
            
            if (pet._id === petId) {
                petShopView.totalPrice -= pet.price;
                petShopView.setAveragePrice();
                return false;
            }
            return true;
        });
        this.shadowRoot.querySelector("#showcase").removeChild(this.shadowRoot.querySelector("." + petId));
    }
    
}

customElements.define("pet-shop", PetShop);
