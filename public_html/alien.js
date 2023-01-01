class Page {
    constructor(id, html) {
        this.id = id;
        this.html = html;
    }

    display() {
        window.document.querySelector('main').innerHTML = this.html;
    }
}

class Component {
    
}

(async () => {
    var page_id = 0;

    var display = (html) => window.document.querySelector('main').innerHTML = String(html);

    switch(page_id)
    {
        default:
            generate(landingpage, "Hello world!");
            break;
    }
})();