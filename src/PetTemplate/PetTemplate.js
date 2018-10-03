const petDocument = document.currentScript.ownerDocument;

class PetTemplate extends HTMLElement {
    constructor(color, price,) {
        super();
        this.color = color;
        this.price = price;
    }
    
    connectedCallback() {
        const shadowRoot = this.attachShadow({mode: 'open'});
        const petTemplate = petDocument.querySelector("#pet-template");
        const petInstance = petTemplate.content.cloneNode(true);
        
        shadowRoot.appendChild(petInstance);
        return shadowRoot;
    }
    
    render() {
        this.shadowRoot.querySelector(".pet-color").innerHTML += this.color;
        this.shadowRoot.querySelector(".pet-price").innerHTML += this.price;
    }

}

customElements.define("a-pet", PetTemplate);
