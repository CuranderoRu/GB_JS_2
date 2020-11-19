'use strict';
class App {
    productsArray = [];
    cart = new Cart();

    constructor(_params) {
        this.name = "app";
        if (localStorage['cart'] === undefined) {
            this.initLocalStorage();
        } else {
            let _cart = JSON.parse(localStorage.cart);
            if (this.cart.version !== _cart.version) {
                this.initLocalStorage();
            } else {
                //                this.cart.loadItems(_cart._items); //Какого х здесь теряется контекст this????
            }
        }
        this.smallImagePath = _params.smallImagePath;
        this.bigImagePath = _params.bigImagePath;
        // productsArray = this.fetchProducts();
        let prom = this.fetchProducts();
        prom
            .then(() => {
                this.cart.productsArray = this.productsArray;
                this.fillProducts("latestList");
                this.fillProducts("popularList");
            })
            .catch(() => {
                this.cart.productsArray = [];
            });

    }

    initLocalStorage() {
        localStorage.setItem('cart', JSON.stringify(this.cart.storage()));
    }
    getPriceById(productId) {
        return this.productsArray.filter(elem => elem.id === productId)[0].price;
    };
    fillProducts(sectionId, category = null) {
        let arr;
        let div = document.getElementById(sectionId);
        if(sectionId==='latestList'){
            const label = document.getElementById('mainListHeader');
            if(category){
                arr = this.getProductsByCategory(category);
                label.textContent = category;
            }else{
                label.textContent = 'Latest Products';
                arr = this.getLatestProductsArray();
            }
        }else {
            arr = this.getPopularProductsArray();
        }
        div.innerHTML = '';
        for (let i = 0; i < arr.length; i++) {
            div.append(new Product(arr[i].id, "product-item", this.smallImagePath + arr[i].imgsrc, arr[i].title, arr[i].currency, arr[i].price).render());
        }
    };
    getLatestProductsArray() {
        return this.productsArray.filter((element, index) => index < 3);
    };
    getPopularProductsArray() {
        return this.productsArray.filter((element, index) => index > 2 && index < 6);
    };
    getProductsByCategory(category) {
        return this.productsArray.find(element => element.category === category);
    };
    getProductById(productId) {
        return this.productsArray.find(element => element.id === productId);
    };

    fetchProducts() {
        const result = fetch('/js/database.json');
        return result
            .then(res => {
                return res.json();
            })
            .then(data => {
                this.productsArray = data.data;
            })
            .catch(err => {
                console.warn('Check your network connection', err);
            });
    }
    menuSelectionHandler(e){
        e.preventDefault();
        console.log(e.target.href);
    }
}

class Container {
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
    get id() {
        return this._id;
    }
}

class Cart {
    _version = "1.0";
    _cartSum = 0;
    _items = [];

    constructor(_productsArray = []) {
        this.className = "cart";
        this._productsArray = _productsArray;
        this.init();
    };

    get version() {
        return this._version;
    }

    get productsArray() {
        return this._productsArray;
    }

    set productsArray(_productsArray) {
        this._productsArray = _productsArray;
    }

    get items() {
        return this._items;
    }

    set items(_items) {
        if (!_items instanceof Array) {
            return;
        }
        this._items = [];
        _items.forEach(function(item, index, array) {
            this._items.push(new CartProduct(item, item._q))
        });
    }

    loadItems(_items) {
        if (!_items instanceof Array) {
            return;
        }
        this._items = [];
        _items.forEach(function(item, index, array) {
            this._items.push(new CartProduct(item, item._q))
        });
    }

    init(){
        if (!document.getElementById("cartManagementMenu")) {
            let btn = document.getElementsByClassName("page-header-cart")[0];
            let menu = new Menu("cartManagementMenu", "page-header-cart-actions", [
                { item: new MenuItem("viewCartItems", "#", null, "page-header-nav-item-link", "View items", null, cartManagementClickHandler) },
                { item: new MenuItem("clearCart", "#", null, "page-header-nav-item-link", "Clear cart", null, cartManagementClickHandler) },
            ]);
            btn.append(menu.render());
        }
    }

    add(productId, _q = 1) {

        return new Promise((resolve, reject) => {
            let added = false;
            let cartProduct = this._items.find(element => element.id === productId);
            if (cartProduct !== undefined) {
                cartProduct.q = cartProduct.q + _q;
                cartProduct.render(true);
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
            if (added) {
                resolve();
            } else {
                reject();
            }
        });

    }

    storage() {
        return { version: this.version, _items: this._items };
    }

    remove(productId, _q = 0) {
        return new Promise((resolve, reject) => {
            let removed = false;
            let productIndex = this._items.findIndex(element => element.id === productId);
            if (productIndex >= 0) {
                if (_q === 0 || _q >= this._items[productIndex].q) {
                    this._items.splice(productIndex, 1);
                    this.render();
                } else {
                    this._items[productIndex].q = this._items[productIndex].q - _q;
                    this._items[productIndex].render(true);
                }
                removed = true;
            }
            this.total();
            if (removed) {
                resolve();
            } else {
                reject();
            }
        });

    }

    clear() {
        this._items = [];
        this._cartSum = 0;
        let cartSection = document.querySelector('.cart');
        cartSection.innerHTML = '';
        localStorage.setItem('cart', JSON.stringify(this._items));
    };

    total() {
        this._cartSum = 0;
        for (let i = 0; i < this._items.length; i++) {
            this._cartSum += this._items[i].sum;
        }
        this._cartSum = this._cartSum.toFixed(2);
    };

    get cartSum() {
        return this._cartSum;
    }

    getProductById(productId) {
        return this._productsArray.find(element => element.id === productId);
    };

    render() {
        let divCart = document.getElementsByClassName(this.className)[0];
        divCart.innerHTML = '';
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
            a.id = `a${this.id}`;
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

class Product extends Container {
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
        span.innerHTML = `${this.currency} ${this.price}`;
        productItemSpec.append(span);
        let a = document.createElement('a');
        a.href = "#";
        a.id = `buybutton-${this.id}`;
        a.classList.add("product-item-spec-button");
        a.textContent = "В корзину";
        a.addEventListener("click", cartChangeHandler);
        productItemSpec.append(a);
        productItem.append(productItemSpec);
        return productItem;
    }
}

class CartProduct extends Product {
    _q = 0;
    constructor(product, _q) {
        super(product.id, "cart-item", product.imgsrc, product.title, product.currency, product.price);
        this._q = _q;
        this._sum = +(_q * product.price).toFixed(2);
    }

    get sum() {
        return this._sum;
    }

    get q() {
        return this._q;
    }

    set q(_q) {
        this._q = _q;
        this._sum = +(_q * this.price).toFixed(2);
    }

    render(existedOnly = false) {
        let _elId = `cartProduct-${this.id}`;
        let div = document.getElementById(_elId);
        if (!div) {
            if (existedOnly) {
                return;
            }
            div = document.createElement('div');
            div.id = _elId;
            div.classList.add(this.className);
        } else {
            div.innerHTML = '';
        }
        let spanName = document.createElement('span');
        spanName.textContent = this.title;
        let button_minus = document.createElement('a');
        button_minus.textContent = '-';
        button_minus.className = 'cart-item-button';
        button_minus.id = `remove-${this.id}`;
        button_minus.addEventListener("click", cartChangeHandler);
        let button_plus = document.createElement('a');
        button_plus.textContent = '+';
        button_plus.className = 'cart-item-button';
        button_plus.id = `buybutton-${this.id}`;
        button_plus.addEventListener("click", cartChangeHandler);
        let button_drop = document.createElement('a');
        button_drop.textContent = 'X';
        button_drop.className = 'cart-item-button';
        button_drop.id = `dropbutton-${this.id}`;
        button_drop.addEventListener("click", cartChangeHandler);
        let spanQ = document.createElement('span');
        spanQ.textContent = this._q;
        let spanDecoration = document.createElement('span');
        spanDecoration.textContent = 'x';
        let spanPrice = document.createElement('span');
        spanPrice.textContent = this.price;
        let spanDecoration2 = document.createElement('span');
        spanDecoration2.textContent = '=';
        let spanSum = document.createElement('span');
        spanSum.textContent = `${this.sum} ${this.currency}`;
        div.append(spanName);
        div.append(button_minus);
        div.append(spanQ);
        div.append(button_plus);
        div.append(spanDecoration);
        div.append(spanPrice);
        div.append(spanDecoration2);
        div.append(spanSum);
        div.append(button_drop);

        return div;
    }

}