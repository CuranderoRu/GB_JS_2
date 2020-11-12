'use strict';

const productsArray = [
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
const appParams = {
    smallImagePath: "./img/small/",
    bigImagePath: "./img/big/",
};
const app = new App(productsArray, appParams);

function recalcCostLabel() {
    let cartCostLabel = document.getElementById("cart-cost");
    cartCostLabel.innerHTML = "&#8381; " + app.calculateCartSum();
}

function createCartMenu() {
    if (!document.getElementById("cartManagementMenu")) {
        let btn = document.getElementsByClassName("page-header-cart")[0];
        let menu = new Menu("cartManagementMenu", "page-header-cart-actions",
                                [
                                    {item: new MenuItem("viewCartItems", "#", null, "page-header-nav-item-link", "View items", null ,cartManagementClickHandler)},
                                    {item: new MenuItem("clearCart", "#", null, "page-header-nav-item-link", "Clear cart", null ,cartManagementClickHandler)},
                                ]
                            );
        btn.append(menu.render());
    }
};

function addToCart(productId) {
    if (app.addToCart(productId)) {
        recalcCostLabel();
        createCartMenu();
    }
}

function buttonBuyHandler(e) {
    e.preventDefault();
    let eIdArray = e.target.id.split('-');
    if (eIdArray[0] === "buybutton") {
        addToCart(eIdArray[1]);
    }
}

function getMenuArr() {
    return [
        {
            href: "#",
            label: "Controllers",
            submenu: [
                {
                    href: "#",
                    label: "ESP",
                    category: "ESP",
                },
                {
                    href: "#",
                    label: "Arduino",
                    category: "Arduino",
                },
                {
                    href: "#",
                    label: "Raspberry",
                    category: "Raspberry",
                },
                {
                    href: "#",
                    label: "STM",
                    category: "STM",
                },
            ],
        },
        {
            href: "#",
            label: "Periferals",
            submenu: [
                {
                    href: "#",
                    label: "Thermosensors",
                },
                {
                    href: "#",
                    label: "Air quality",
                },
                {
                    href: "#",
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
            href: "#",
            label: "Support",
        },
    ];
}

function createMenu() {
    let menuArr = getMenuArr();
    let menuItem;
    for (let i = 0; i < menuArr.length; i++) {
        let submenu;
        if ("submenu" in menuArr[i] && menuArr[i].submenu instanceof Array && menuArr[i].submenu.length > 0) {
            let submenuArr = [];
            for (let j = 0; j < menuArr[i].submenu.length; j++) {
                submenuArr.push({
                    item: new MenuItem("menuCategory"+menuArr[i].submenu[j].category, menuArr[i].submenu[j].href, "page-header-nav-item-submenu-item", "page-header-nav-item-link", menuArr[i].submenu[j].label)
                });
            }
            submenu = new Menu("nav-menu-submenu-" + i, "page-header-nav-item-submenu", submenuArr);
        }
        menuArr[i].item = new MenuItem(null, menuArr[i].href, "page-header-nav-item", "page-header-nav-item-link", menuArr[i].label, submenu);
    }
    let menu = new Menu("nav-menu", "page-header-nav-menu", menuArr);
    let nav = document.getElementById('nav');
    nav.append(menu.render());
}

function showSectionsList(arr, sectionId) {
    let div = document.getElementById(sectionId);
    for (let i = 0; i < arr.length; i++) {
        div.append(new Product(arr[i].id, "product-item", app.smallImagePath + arr[i].imgsrc, arr[i].title, arr[i].currency, arr[i].price).render());
    }
}

function cartManagementClickHandler(e) {
    e.preventDefault();
    if (e.target.id === "aclearCart") {
        app.clearCart();
        document.getElementById("cartManagementMenu").remove();
        recalcCostLabel();
    } else if (e.target.id === "aviewCartItems") {
        console.log(e);
    }
}

function init() {
    createMenu();
    showSectionsList(app.getLatestProductsArray(), "latestList");
    showSectionsList(app.getPopularProductsArray(), "popularList");
    recalcCostLabel();
    createCartMenu();
}
