'use strict';

function App(_productsArray, _params){
    this.name = "app";
    this.cart = [];
    this.productsArray = _productsArray;
    if (localStorage['cart'] === undefined) {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    } else {
        this.cart = JSON.parse(localStorage.cart);
    }
    this.smallImagePath = _params.smallImagePath;
    this.bigImagePath = _params.bigImagePath;
}
App.prototype.getPriceById = function (productId){
    return this.productsArray.filter(elem => elem.id === productId)[0].price;
};
App.prototype.addToCart = function (productId){
    let added = false;
    for (let i = 0; i < this.cart.length; i++) {
        if (this.cart[i].id === productId) {
            this.cart[i].q += this.cart[i].q;
            added = true;
            break;
        }
    }
    if (!added) {
        this.cart.push({
            id: productId,
            q: 1,
            price: this.getPriceById(productId)
        });
        added = true;
    }
    localStorage.setItem('cart', JSON.stringify(this.cart));

    return added;
}

App.prototype.clearCart = function () {
    this.cart = [];
    localStorage.setItem('cart', JSON.stringify(this.cart));
};
App.prototype.calculateCartSum = function(){
    let cartSum = 0;
    for (var i = 0; i < this.cart.length; i++) {
        cartSum += +(this.cart[i].q * this.cart[i].price).toFixed(2);
    }
    return cartSum.toFixed(2);
};
App.prototype.getLatestProductsArray = function() {
    return this.productsArray.filter((element, index) => index < 3);
};
App.prototype.getPopularProductsArray = function() {
    return this.productsArray.filter((element, index) => index > 2 && index < 6);
};


function Container() {
    this.name = "container";
    this.className = "container";
}

Container.prototype.render = function () {
    let div = document.createElement('div');
    div.id = this.id;
    div.classList.add(this.className);
    return div;
}

function Menu(_id, _class, _items) {
    Container.call(this);
    this.id = _id;
    this.className = _class;
    this.items = _items;
}

Menu.prototype = Object.create(Container.prototype);
Menu.prototype.constructor = Menu;
Menu.prototype.render = function () {
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

function MenuItem(_id, _href, _class, _aclass, _label, _submenu, _handler) {
    Container.call(this);
    this.id = _id;
    this.href = _href;
    this.className = _class;
    this.aclass = _aclass;
    this.label = _label;
    this.submenu = _submenu;
    this.handler = _handler;
}

MenuItem.prototype = Object.create(Container.prototype);
MenuItem.prototype.constructor = MenuItem;
MenuItem.prototype.render = function () {
    let li = document.createElement('li');
    if(this.className){
        li.classList.add(this.className);
    }
    let a = document.createElement('a');
    a.href = this.href;
    if(this.aclass){
        a.classList.add(this.aclass);
    }
    if(this.id){
        li.id = this.id;
        a.id = "a"+this.id;
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

function Product(_id, _class, _imgsrc, _title, _currency, _price) {
    Container.call(this);
    this.id = _id;
    this.className = _class;
    this.imgsrc = _imgsrc;
    this.title = _title;
    this.currency = _currency;
    this.price = _price;
}

Product.prototype = Object.create(Container.prototype);
Product.prototype.constructor = Product;
Product.prototype.render = function () {
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
