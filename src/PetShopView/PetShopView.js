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
    const _id = pet.getId;
    const color = pet.getColor;
    const price = pet.getPrice;
    
    totalPrice += price;

    if (pet instanceof Cat) {
        zooElements.push(new CatTemplate(color, price, pet.name, pet.getFluffy));
    }

    if (pet instanceof Dog) {
        zooElements.push(new DogTemplate(color, price, pet.name));
    }

    if (pet instanceof Hamster) {
        zooElements.push(new HamsterTemplate(color, price, pet.getFluffy));
    }
    
    zooElements[i].classList.add(_id);
});

let petShop = new PetShop(zoo, totalPrice);

class PetShopView extends HTMLElement {
    constructor() {
        super();
        
        this.initialPets = zooElements;
        this.viewMode = "all";
    }
    
    connectedCallback() {
        const shadowRoot = this.attachShadow({mode: "open"});
        const shopTemplate = shopDocument.querySelector("#pet-shop");
        const shopInstance = shopTemplate.content.cloneNode(true);
        
        shadowRoot.appendChild(shopInstance);
        
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
            
            this.shadowRoot.querySelector("." + zoo[i].getId).shadowRoot.querySelector("img").addEventListener("click", e => this.removePet(zoo[i].getId));
        });
        
        petShop.setAveragePrice();
    }
    
    addPet() {
        const selectedPet = this.shadowRoot.querySelector(".pet-type").value;
        const color = this.shadowRoot.querySelector(".pet-color").value;
        const price = Number(this.shadowRoot.querySelector(".price").value);
        
        if (!this.validateInput(price, "price")) {
            this.showMessage("Price is not correct!");
            return;
        }
        
        if (selectedPet === "cat") {
            const isFluffy = this.shadowRoot.querySelector(".fluffy").checked;
            const name = this.shadowRoot.querySelector(".name").value;
            
            if (!this.validateInput(name, "name")) {
                this.showMessage("Name is not correct!");
                return;
            }
            
            const newPet = petShop.createPet(this.viewMode, Cat, CatTemplate, color, price, name, isFluffy);
            
            this.finalizeCreation(newPet);
        }
        
        if (selectedPet === "dog") {
            const name = this.shadowRoot.querySelector(".name").value;
            
            if (!this.validateInput(name, "name")) {
                this.showMessage("Name is not correct!");
                return;
            }
            
            const newPet = petShop.createPet(this.viewMode, Dog, DogTemplate, color, price, name);
            
            this.finalizeCreation(newPet);
        }
        
        if (selectedPet === "hamster") {
            const isFluffy = this.shadowRoot.querySelector(".fluffy").checked;
            const newPet = petShop.createPet(this.viewMode, Hamster, HamsterTemplate, color, price, isFluffy);
            
            this.finalizeCreation(newPet);
        }
    }
    
    finalizeCreation(newPet) {    
        this.shadowRoot.querySelector("#showcase").appendChild(newPet);
        
        newPet.shadowRoot.querySelector("img").addEventListener("click", e => this.removePet(newPet.getId));
        
        this.showMessage("Pet has been added!");
    }
    
    removePet(petId) {
        petShop.deletePet(petId);
        
        this.shadowRoot.querySelector("#showcase").removeChild(this.shadowRoot.querySelector("." + petId));
    }
        
    showAll() {
        this.viewMode = "all";
        this.renderView();
        this.shadowRoot.querySelector(".all-pets").classList.add("active-tab");
    }
    
    showCats() {
        this.viewMode = "cats";
        this.renderView();
        this.shadowRoot.querySelector(".all-cats").classList.add("active-tab");
    }
    
    showAverage() {
        this.viewMode = "average";
        this.renderView();
        this.shadowRoot.querySelector(".exp-pets").classList.add("active-tab");
    }
    
    showFluffyWhite() {    
        this.viewMode = "fluffy-white";
        this.renderView();
        this.shadowRoot.querySelector(".fluffy-white").classList.add("active-tab");
    }
    
    renderView() {    
        const [toShow, toHide] = petShop.filterPets(this.viewMode);
        const navbarTabs = this.shadowRoot.querySelectorAll("#navbar div");
        
        for (let i = 0; i < navbarTabs.length; i++) {
            navbarTabs[i].classList.remove("active-tab");
        }
        
        toShow.forEach(elementClass => this.shadowRoot.querySelector("." + elementClass).classList.remove("hidden"));
        toHide.forEach(elementClass => this.shadowRoot.querySelector("." + elementClass).classList.add("hidden"));
    }
    
    openModal(modalWindow) {
        modalWindow.classList.remove("hidden");
    }
    
    closeModal(modalWindow) {
        modalWindow.classList.add("hidden");
    }
    
    changeModalView(pet) {
        const fluffyCheckBox = this.shadowRoot.querySelector(".fluffy-section");
        const petNameInput = this.shadowRoot.querySelector(".name-section");
        
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
    
    validateInput(input, type) {        
        if (type === "price") {
            return (input > 0 && isFinite(input) && typeof(input) === "number");
        }
        
        return (input && typeof(input) === "string");
    }
    
    showMessage(message) {
        const messageElement = this.shadowRoot.querySelector("#creation-status");
        
        messageElement.innerHTML = message;
        setTimeout( () => messageElement.innerHTML = "", 3000);
    }
}

customElements.define("pet-shop", PetShopView);
