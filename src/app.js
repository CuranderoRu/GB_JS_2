'use strict';

import Product from './product.js';
import Button from './button.js';
import FormRepresenter from './formrepresenter.js';
import Route from './route.js';
import Cart from './cart.js';
import FormBuilder from './formbuilder.js';

// import './style.css';
import '../SASS/style.scss'

class App {
    name = "app";
    productsArray = [];

    constructor(_params) {
        this.cart = new Cart();

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
        this.pageIndex = 0;
        this.prod_start_pos = 0;
        this.route = new Route();
        // productsArray = this.fetchProducts();
        let prom = this.fetchProducts();
        prom
            .then(dataArray => {
                this.productsArray = dataArray.map(cur => {
                    return new Product(cur, this.smallImagePath + cur.imgsrc, 'product-item', this.cart);
                })
                this.cart.productsArray = this.productsArray;
                this.fillProducts("latestList");
                this.prod_start_pos = this.prod_start_pos + 3;
                this.fillProducts("popularList");
            })
            .catch(() => {
                this.cart.productsArray = [];
            });

    }

    initLocalStorage() {
        localStorage.setItem('cart', JSON.stringify(this.cart.getStorageData()));
    }
    getPriceById(productId) {
        return this.productsArray.filter(elem => elem.id === productId)[0].price;
    };
    fillProducts(sectionId, category = null) {
        let arr;
        let div = document.getElementById(sectionId);
        if (sectionId === 'latestList') {
            let label = document.getElementById('mainListHeader');
            if (category) {
                arr = this.getProductsByCategory(category);
                label.textContent = category;
                div.innerHTML = '';
            } else {
                label.textContent = 'Latest Products';
                arr = this.getLatestProductsArray(this.prod_start_pos, this.prod_start_pos + 3);
            }
        } else {
            arr = this.getPopularProductsArray();
        }
        for (let i = 0; i < arr.length; i++) {
            div.append(arr[i].render());
        }
        if (sectionId === 'latestList') {
            let btn = document.getElementById('loadMoreBTN');
            if (!btn) {
                btn = new Button('loadMoreBTN', 'Load more', this);
                div.parentNode.append(btn.render());
            }
        }
    };
    getLatestProductsArray(start_pos = 0, end_pos = 3) {
        return this.productsArray.filter((element, index) => index >= start_pos && index < end_pos);
    };
    getPopularProductsArray() {
        let res = [];
        let inputArr = [].concat([], this.productsArray);
        inputArr.sort((a, b) => {
            return b.popularity - a.popularity;
        });
        inputArr.reduce((res, cur) => {
            if (res.length <= 2 && cur.popularity > 0) {
                res.push(cur);
            }
            return res;
        }, res);
        return res;
    };
    getProductsByCategory(category) {
        return this.productsArray.filter(element => element.category.indexOf(category) >= 0);
    };
    getProductById(productId) {
        return this.productsArray.find(element => element.id === productId);
    };

    fetchProducts() {
        const result = fetch(`/js/database${this.pageIndex}.json`);
        return result
            .then(res => {
                return res.json();
            })
            .then(data => {
                return data.data;
            })
            .catch(err => {
                console.warn('Check your network connection', err);
            });
    }
    handleEvent(e) {
        e.preventDefault();
        if (e.target.id === 'loadMoreBTN') {
            if (this.prod_start_pos + 3 > this.productsArray.length) {
                this.pageIndex = this.pageIndex + 1;
                let prom = this.fetchProducts();
                prom
                    .then(dataArray => {
                        this.productsArray = this.productsArray.concat(dataArray.map(cur => {
                            return new Product(cur, this.smallImagePath + cur.imgsrc, 'product-item', this.cart);
                        }));
                        this.cart.productsArray = this.productsArray;
                        this.fillProducts('latestList', this.route.path);
                        this.prod_start_pos = this.prod_start_pos + 3;
                    })
                    .catch(() => {
                        this.pageIndex = this.pageIndex - 1;
                    });
            } else {
                this.fillProducts('latestList', this.route.path);
                this.prod_start_pos = this.prod_start_pos + 3;
            }
        } else { //menu item clicked
            this.route = new Route(e.target.href);
            let formRepresenter = new FormRepresenter();
            formRepresenter.hideContent();
            switch (this.route.path) {
                case 'support':
                    formRepresenter.showSupport();
                    break;
                default:
                    formRepresenter.showProducts();
                    this.fillProducts('latestList', this.route.path);
            }

        }
    }

    buildForm() {
        const nav = document.getElementById('nav');
        const fb = new FormBuilder();
        nav.append(fb.buildMenu(this).render());
        const mainSupport = document.getElementsByClassName('main-support')[0];
        mainSupport.append(fb.buildContactForm().render());
        const fr = new FormRepresenter()
        fr.hideContent();
        fr.showProducts();
    }

}

const appParams = {
    smallImagePath: "./img/small/",
    bigImagePath: "./img/big/",
};

let app = new App(appParams);
app.buildForm();