const catDocument = document.currentScript.ownerDocument;

class CatTemplate extends PetTemplate {
    constructor(color, price, name, isFluffy) {
        super(color, price);
        this.name = name;
        this.isFluffy = isFluffy;
    }
    
    connectedCallback() {
        const shadowRoot = super.connectedCallback();
        
        const catTemplate = catDocument.querySelector("#cat-template");
        const catInstance = catTemplate.content.cloneNode(true);
        
        shadowRoot.appendChild(catInstance);
        
        this.render(shadowRoot);
    }
    
    render(shadowRoot) {
        super.render(shadowRoot);
        shadowRoot.querySelector(".pet-type").innerHTML = "Cat";
        shadowRoot.querySelector(".cat-name").innerHTML += this.name;
        shadowRoot.appendChild(document.createElement("br"));
        
        if (!this.isFluffy) {
            shadowRoot.querySelector(".cat-fluffy").innerHTML = "Not fluffy";
        }
        
    }

}

customElements.define("a-cat", CatTemplate);
