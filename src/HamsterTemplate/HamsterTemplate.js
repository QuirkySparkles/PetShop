const hamsterDocument = document.currentScript.ownerDocument;

class HamsterTemplate extends PetTemplate {
    constructor(color, price, isFluffy) {
        super(color, price);
        this.isFluffy = isFluffy;
    }
    
    connectedCallback() {
        const shadowRoot = super.connectedCallback();
        
        const hamsterTemplate = hamsterDocument.querySelector("#hamster-template");
        const hamsterInstance = hamsterTemplate.content.cloneNode(true);
        
        shadowRoot.appendChild(hamsterInstance);
        this.render(shadowRoot);
    }
    
    render(shadowRoot) {
        super.render();
        shadowRoot.querySelector(".pet-type").innerHTML = "Hamster";
        
        if (!this.isFluffy) {
            this.shadowRoot.querySelector(".hamster-fluffy").innerHTML = "Not fluffy";
        }
        
        shadowRoot.appendChild(document.createElement("br"));
    }

}

customElements.define("a-hamster", HamsterTemplate);
