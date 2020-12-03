'use strict';

class Route {
    constructor(href = '') {
        this.path = href.replace(document.location.origin + '/', '');
    }
}

class FormRepresenter {
    hideContent() {
        let sections = document.getElementsByClassName('main-section');
        for (let i = 0; i < sections.length; i++) {
            sections[i].classList.add('invisible');
        }
        sections = document.getElementsByClassName('cart');
        for (let i = 0; i < sections.length; i++) {
            sections[i].classList.add('invisible');
        }
        sections = document.getElementsByClassName('main-support');
        for (let i = 0; i < sections.length; i++) {
            sections[i].classList.add('invisible');
        }
    }
    showProducts() {
        let sections = document.getElementsByClassName('main-section');
        for (let i = 0; i < sections.length; i++) {
            sections[i].classList.remove('invisible');
        }
    }
    showCart() {
        let section = document.getElementsByClassName('cart')[0];
        section.classList.remove('invisible');
        return section;
    }
    showSupport() {
        let section = document.getElementsByClassName('main-support')[0];
        section.classList.remove('invisible');
        return section;
    }
}

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

    getMenuArr() {
        return [{
                href: "controllers",
                label: "Controllers",
                submenu: [{
                        href: "controllers/esp",
                        label: "ESP",
                        category: "ESP",
                    },
                    {
                        href: "controllers/arduino",
                        label: "Arduino",
                        category: "Arduino",
                    },
                    {
                        href: "controllers/raspberry",
                        label: "Raspberry",
                        category: "Raspberry",
                    },
                    {
                        href: "controllers/stm",
                        label: "STM",
                        category: "STM",
                    },
                ],
            },
            {
                href: "periferals",
                label: "Periferals",
                submenu: [{
                        href: "periferals/thermosensors",
                        label: "Thermosensors",
                    },
                    {
                        href: "periferals/air-quality",
                        label: "Air quality",
                    },
                    {
                        href: "periferals/relay",
                        label: "Relay",
                    },
                ],

            },
            {
                href: "#",
                label: "About",
            },
            {
                href: "#",
                label: "Blog",
            },
            {
                href: "support",
                label: "Support",
            },
        ];
    }

    buildMenu() {
        let menuArr = this.getMenuArr();
        menuArr.forEach(element => {
            let submenu;
            if ("submenu" in element && element.submenu instanceof Array && element.submenu.length > 0) {
                let submenuArr = element.submenu.map(sub => {
                    return {
                        item: new MenuItem("menuCategory" + sub.category, sub.href, "page-header-nav-item-submenu-item", "page-header-nav-item-link", sub.label, undefined, this)
                    };
                });
                submenu = new Menu("nav-menu-submenu-" + i, "page-header-nav-item-submenu", submenuArr);
            }
            element.item = new MenuItem(null, element.href, "page-header-nav-item", "page-header-nav-item-link", element.label, submenu, this);
        });
        return new Menu("nav-menu", "page-header-nav-menu", menuArr);
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
        if (!document.getElementById("cartManagementMenu")) {
            let btn = document.getElementsByClassName("page-header-cart")[0];
            let menu = new Menu("cartManagementMenu", "page-header-cart-actions", [
                { item: new MenuItem("viewCartItems", "#", null, "page-header-nav-item-link", "View items", null, this) },
                { item: new MenuItem("clearCart", "#", null, "page-header-nav-item-link", "Clear cart", null, this) },
            ]);
            btn.append(menu.render());
            this.recalcCostLabel();
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

class Button extends Container {
    constructor(_id, _textContent, _pushHandler) {
        super(_id, 'main-section-btn');
        this.textContent = _textContent;
        this.pushHandler = _pushHandler;
    }
    render() {
        let btn = document.createElement('button');
        btn.classList.add(this.className);
        btn.textContent = this.textContent;
        btn.id = this.id;
        btn.addEventListener('click', this.pushHandler);
        return btn;
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

class CartProduct extends Product {
    _q = 0;
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