'use strict';

import Product from './product.js';
import FormBuilder from './formbuilder.js';

export default class Cart {

    constructor(_productsArray = []) {
        this._version = "1.0";
        this._cartSum = 0;
        this._items = [];

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
            this._items.push(new CartProduct(item, item._q, this))
        });
    }

    loadItems(_items) {
        if (!_items instanceof Array) {
            return;
        }
        this._items = [];
        _items.forEach(function(item, index, array) {
            this._items.push(new CartProduct(item, item._q, this))
        });
    }

    init() {
        const fb = new FormBuilder();
        fb.buildCartMenu(this);
        this.recalcCostLabel();
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
                if (product !== undefined) {
                    this._items.push(new CartProduct(product, 1, this));
                    added = true;
                    localStorage.setItem('cart', JSON.stringify(this.getStorageData()));
                }
            }
            this.total();
            this.init();
            if (added) {
                resolve();
            } else {
                reject();
            }
        });

    }

    getStorageData() {
        let storageItems = this._items.map(item => {
            return {
                id: item.id,
                _q: item._q
            };
        });
        return {
            version: this._version,
            _items: storageItems
        };
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
        localStorage.setItem('cart', JSON.stringify(this.getStorageData()));
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

    recalcCostLabel() {
        let cartCostLabel = document.getElementById("cart-cost");
        cartCostLabel.innerHTML = "&#8381; " + this._cartSum;
    }

    handleEvent(e) {
        e.preventDefault();
        if (e.target.id === "aclearCart") {
            this.clear();
            document.getElementById("cartManagementMenu").remove();
            this.recalcCostLabel();
            return;
        } else if (e.target.id === "aviewCartItems") {
            let mainSections = document.getElementsByClassName('main-section');
            for (let i = 0; i < mainSections.length; i++) {
                mainSections[i].classList.toggle('invisible');
            }
            document.querySelector('.cart').classList.toggle('invisible');
            this.render();
            return;
        }

        let eIdArray = e.target.id.split('-');
        switch (eIdArray[0]) {
            case 'buybutton':
                this.add(eIdArray[1])
                    .then(() => {
                        this.recalcCostLabel();
                    })
                    .catch(() => {
                        console.log('Could not add good to cart')
                    });
                break;
            case 'remove':
                this.remove(eIdArray[1], 1)
                    .then(() => {
                        this.recalcCostLabel();
                    })
                    .catch(() => {
                        console.log('Could not remove good from cart')
                    });

                break;
            case 'dropbutton':
                this.remove(eIdArray[1])
                    .then(() => {
                        this.recalcCostLabel();
                    })
                    .catch(() => {
                        console.log('Could not remove good from cart')
                    });
                break;
            default:
                console.log('Unsupported call ', eIdArray[0]);
        }
    }

    render() {
        let divCart = document.getElementsByClassName(this.className)[0];
        divCart.innerHTML = '';
        this._items.forEach(function(item, index, array) {
            divCart.append(item.render());
        });
    }

}

class CartProduct extends Product {
    constructor(product, _q, cart) {
        super(product, '', 'cart-item', cart);
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
        button_minus.addEventListener("click", this.cart);
        let button_plus = document.createElement('a');
        button_plus.textContent = '+';
        button_plus.className = 'cart-item-button';
        button_plus.id = `buybutton-${this.id}`;
        button_plus.addEventListener("click", this.cart);
        let button_drop = document.createElement('a');
        button_drop.textContent = 'X';
        button_drop.className = 'cart-item-button';
        button_drop.id = `dropbutton-${this.id}`;
        button_drop.addEventListener("click", this.cart);
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