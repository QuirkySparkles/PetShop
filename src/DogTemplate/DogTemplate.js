const dogDocument = document.currentScript.ownerDocument;

class DogTemplate extends PetTemplate {
    constructor(color, price, name) {
        super(color, price);
        this.name = name;
        
        this.render = this.render.bind(this);
    }
    
    connectedCallback() {
        const shadowRoot = super.connectedCallback();
        const dogTemplate = dogDocument.querySelector("#dog-template");
        const dogInstance = dogTemplate.content.cloneNode(true);
        
        shadowRoot.appendChild(dogInstance);
        
        this.render(shadowRoot);
    }
    
    render(shadowRoot) {
        super.render();
        shadowRoot.querySelector(".dog-name").innerHTML += this.name;
        shadowRoot.querySelector(".pet-type").innerHTML = "Dog";
        shadowRoot.appendChild(document.createElement("br"));
    }

}

customElements.define("a-dog", DogTemplate);
