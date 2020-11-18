'use strict';
class App {
    productsArray = this.fetchProducts();
    cart = new Cart();
    constructor(_params) {
        this.name = "app";
        if (localStorage['cart'] === undefined) {
            this.initLocalStorage();
        } else {
            let _cart = JSON.parse(localStorage.cart);
            if(this.cart.version !== _cart.version){
                this.initLocalStorage();
            }else{
//                this.cart.loadItems(_cart._items); //Какого х здесь теряется контекст this????
            }
        }
        this.smallImagePath = _params.smallImagePath;
        this.bigImagePath = _params.bigImagePath;
    }

    initLocalStorage(){
        localStorage.setItem('cart', JSON.stringify(this.cart.storage()));
    }
    getPriceById(productId) {
        return this.productsArray.filter(elem => elem.id === productId)[0].price;
    };
    getLatestProductsArray() {
        return this.productsArray.filter((element, index) => index < 3);
    };
    getPopularProductsArray() {
        return this.productsArray.filter((element, index) => index > 2 && index < 6);
    };
    getProductById(productId) {
        return this.productsArray.find(element => element.id = productId);
    };

    fetchProducts() {
        return [
            {
                id: "000001",
                imgsrc: "Arduino%20Uno.png",
                title: "Arduino Uno",
                currency: "₽",
                price: 499.75,
                category: "Arduino",
        },
            {
                id: "000002",
                imgsrc: "arduino-nano-atmega328.png",
                title: "Arduino Nano",
                currency: "₽",
                price: 399.96,
                category: "Arduino",
        },
            {
                id: "000003",
                imgsrc: "esp32.png",
                title: "ESP32",
                currency: "₽",
                price: 599.93,
                category: "ESP",
        },
            {
                id: "000004",
                imgsrc: "esp8266%20NodeMCU.png",
                title: "ESP8266 NodeMCU v3",
                currency: "₽",
                price: 299.97,
                category: "ESP",
        },
            {
                id: "000005",
                imgsrc: "raspberry_pi_3_b.png",
                title: "Raspberry Pi 3b",
                currency: "₽",
                price: 2836.24,
                category: "Raspberry",
        },
            {
                id: "000006",
                imgsrc: "raspberry_pi_zero.jpg",
                title: "Raspberry Pi zero",
                currency: "₽",
                price: 1715.44,
                category: "Raspberry",
        },
            {
                id: "000007",
                imgsrc: "stm32.jpg",
                title: "STM 32",
                currency: "₽",
                price: 815.26,
                category: "STM",
        },
    ];
    }
}

class Container{
    constructor(_id, _className) {
        this._id = _id;
        this.className = _className;
    }
    render() {
        let div = document.createElement('div');
        div.id = this.id;
        div.classList.add(this.className);
        return div;
    }
    get id(){
        return this._id;
    }
}

class Cart{
    _version = "1.0";
    _cartSum = 0;
    _items = [];

    constructor (_productsArray = []) {
        this.className = "cart";
        this._productsArray = _productsArray;
    };

    get version(){
        return this._version;
    }

    get productsArray(){
        return this._productsArray;
    }

    set productsArray(_productsArray){
        this._productsArray = _productsArray;
    }

    get items(){
        return this._items;
    }

    set items(_items){
        if(!_items instanceof Array){
            return;
        }
        this._items = [];
        _items.forEach(function(item, index, array) {
            this._items.push(new CartProduct(item, item._q))
        });
    }

    loadItems(_items){
        if(!_items instanceof Array){
            return;
        }
        this._items = [];
        _items.forEach(function(item, index, array) {
            this._items.push(new CartProduct(item, item._q))
        });
    }

    add (productId, _q = 1) {
        let added = false;
        let cartProduct = this._items.find(element => element.id === productId);
        if (cartProduct !== undefined) {
            cartProduct.q = cartProduct.q + _q;
            added = true;
        }
        if (!added) {
            let product = this.getProductById(productId);
            console.log();
            if (product !== undefined) {
                this._items.push(new CartProduct(product, 1));
                added = true;
            localStorage.setItem('cart', JSON.stringify(this.storage()));
            this.total();
            }
        }
        return added;
    }

    storage () {
        return {version: this.version, _items: this._items};
    }

    remove(productId, _q = 0) {
        let productIndex = this._items.findIndex(element => element.id === productId);
        if (productIndex >= 0) {
            if(_q = 0 || _q >= this._items[productIndex].q){
                this._items.splice(productIndex, 1);
            }else{
                this._items[productIndex].q -= _q;
            }
        }
        this.total();
    }

    clear () {
        this._items = [];
        this._cartSum = 0;
        localStorage.setItem('cart', JSON.stringify(this._items));
    };

    total() {
        this._cartSum = 0;
        for (let i = 0; i < this._items.length; i++) {
            this._cartSum += this._items[i].sum;
        }
        this._cartSum = this._cartSum.toFixed(2);
    };

    get cartSum (){
        return this._cartSum;
    }

    getProductById(productId) {
        return this._productsArray.find(element => element.id === productId);
    };

    render() {
        let divCart = document.getElementsByClassName(this.className)[0];
        this._items.forEach(function(item, index, array) {
            divCart.append(item.render());
        });
    }

}

class Menu extends Container {
    constructor(_id, _class, _items) {
        super(_id, _class);
        this.items = _items;
    }
    render() {
        let ul = document.createElement('ul');
        ul.id = this.id;
        ul.classList.add(this.className);
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].item instanceof MenuItem) {
                ul.append(this.items[i].item.render());
            }
        }
        return ul;
    }
}

class MenuItem extends Container {
    constructor(_id, _href, _class, _aclass, _label, _submenu, _handler) {
        super(_id, _class);
        this.href = _href;
        this.aclass = _aclass;
        this.label = _label;
        this.submenu = _submenu;
        this.handler = _handler;
    }
    render() {
        let li = document.createElement('li');
        if (this.className) {
            li.classList.add(this.className);
        }
        let a = document.createElement('a');
        a.href = this.href;
        if (this.aclass) {
            a.classList.add(this.aclass);
        }
        if (this.id) {
            li.id = this.id;
            a.id = "a" + this.id;
        }
        a.textContent = this.label;
        if (this.handler) {
            a.addEventListener('click', this.handler);
        }
        li.append(a);
        if (this.submenu) {
            li.append(this.submenu.render());
        }
        return li;
    }
}

class Product extends Container{
    constructor(_id, _class, _imgsrc, _title, _currency, _price) {
        super(_id, _class);
        this.imgsrc = _imgsrc;
        this.title = _title;
        this.currency = _currency;
        this.price = _price;
    }
    render() {
        let productItem = document.createElement('div');
        productItem.id = this.id;
        productItem.classList.add(this.className);
        let img = document.createElement('img');
        img.src = this.imgsrc;
        img.width = "250";
        img.height = "250";
        productItem.append(img);
        let productItemSpec = document.createElement('div');
        productItemSpec.classList.add("product-item-spec");
        let h3 = document.createElement('h3');
        h3.textContent = this.title;
        productItemSpec.append(h3);
        let span = document.createElement('span');
        span.classList.add("product-item-spec-price");
        span.innerHTML = this.currency + " " + this.price;
        productItemSpec.append(span);
        let a = document.createElement('a');
        a.href = "#";
        a.id = "buybutton-" + this.id;
        a.classList.add("product-item-spec-button");
        a.textContent = "В корзину";
        a.addEventListener("click", buttonBuyHandler);
        productItemSpec.append(a);
        productItem.append(productItemSpec);
        return productItem;
    }
}

class CartProduct extends Product{
    _q = 0;
    constructor(product, _q) {
        super(product.id, "cart-item", product.imgsrc, product.title, product.currency, product.price);
        this._q = _q;
        this._sum = +(_q * product.price).toFixed(2);
    }

    get sum (){
        return this._sum;
    }

    get q(){
        return this._q;
    }

    set q(_q){
        this._q = _q;
        this._sum = +(_q * product.price).toFixed(2);
    }

    render () {
        let div = document.createElement('div');
        div.classList.add(this.className);
        let spanName = document.createElement('span');
        spanName.textContent = this.title;
        let spanQ = document.createElement('span');
        spanQ.textContent = ": " + this._q;
        let spanDecoration = document.createElement('span');
        spanDecoration.textContent = ' x ';
        let spanPrice = document.createElement('span');
        spanPrice.textContent = this.price;
        let spanDecoration2 = document.createElement('span');
        spanDecoration2.textContent = ' = ';
        let spanSum = document.createElement('span');
        spanSum.textContent = this.sum;
        let spanDecoration3 = document.createElement('span');
        spanDecoration3.textContent = " " + this.currency;

        div.append(spanName);
        div.append(spanQ);
        div.append(spanDecoration);
        div.append(spanPrice);
        div.append(spanDecoration2);
        div.append(spanSum);
        div.append(spanDecoration3);

        return div;
    }

}