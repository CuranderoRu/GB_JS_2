'use strict';

import Container from './container.js';

export default class Product extends Container {
    constructor({ id, title, currency, price, category, imgsrc, popularity }, _imgsrc = '', _className = 'product-item', cart) {
        super(id, _className);
        if (_imgsrc) {
            this.imgsrc = _imgsrc;
        } else {
            this.imgsrc = imgsrc;
        }
        this.title = title;
        this.currency = currency;
        this.price = price;
        this.category = category;
        this.popularity = popularity;
        this.cart = cart;
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
        a.addEventListener("click", this.cart);
        productItemSpec.append(a);
        productItem.append(productItemSpec);
        return productItem;
    }
}