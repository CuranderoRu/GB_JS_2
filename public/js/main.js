'use strict';

const appParams = {
    smallImagePath: "./img/small/",
    bigImagePath: "./img/big/",
};

let app;

function recalcCostLabel() {
    let cartCostLabel = document.getElementById("cart-cost");
    cartCostLabel.innerHTML = "&#8381; " + app.cart._cartSum;
}

// function createCartMenu() {
//     if (!document.getElementById("cartManagementMenu")) {
//         let btn = document.getElementsByClassName("page-header-cart")[0];
//         let menu = new Menu("cartManagementMenu", "page-header-cart-actions", [
//             { item: new MenuItem("viewCartItems", "#", null, "page-header-nav-item-link", "View items", null, cartManagementClickHandler) },
//             { item: new MenuItem("clearCart", "#", null, "page-header-nav-item-link", "Clear cart", null, cartManagementClickHandler) },
//         ]);
//         btn.append(menu.render());
//     }
// };

function cartChangeHandler(e) {
    e.preventDefault();
    let eIdArray = e.target.id.split('-');
    switch (eIdArray[0]) {
        case 'buybutton':
            app.cart.add(eIdArray[1])
                .then(() => {
                    recalcCostLabel();
                })
                .catch(() => {
                    console.log('Could not add good to cart')
                });
            break;
        case 'remove':
            app.cart.remove(eIdArray[1], 1)
                .then(() => {
                    recalcCostLabel();
                })
                .catch(() => {
                    console.log('Could not remove good from cart')
                });

            break;
        case 'dropbutton':
            app.cart.remove(eIdArray[1])
                .then(() => {
                    recalcCostLabel();
                })
                .catch(() => {
                    console.log('Could not remove good from cart')
                });
            break;
        default:
            console.log('Unsupported call ', eIdArray[0]);
    }
}

function getMenuArr() {
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
            href: "#",
            label: "Support",
        },
    ];
}

function createMenu() {
    let menuArr = getMenuArr();
    for (let i = 0; i < menuArr.length; i++) {
        let submenu;
        if ("submenu" in menuArr[i] && menuArr[i].submenu instanceof Array && menuArr[i].submenu.length > 0) {
            let submenuArr = [];
            for (let j = 0; j < menuArr[i].submenu.length; j++) {
                submenuArr.push({
                    item: new MenuItem("menuCategory" + menuArr[i].submenu[j].category, menuArr[i].submenu[j].href, "page-header-nav-item-submenu-item", "page-header-nav-item-link", menuArr[i].submenu[j].label, undefined, app.menuSelectionHandler)
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

function cartManagementClickHandler(e) {
    e.preventDefault();
    if (e.target.id === "aclearCart") {
        app.cart.clear();
        document.getElementById("cartManagementMenu").remove();
        recalcCostLabel();
    } else if (e.target.id === "aviewCartItems") {
        let mainSections = document.getElementsByClassName('main-section');
        for (let i = 0; i < mainSections.length; i++) {
            mainSections[i].classList.toggle('invisible');
        }
        document.querySelector('.cart').classList.toggle('invisible');
        app.cart.render();
    }
}

// function reloadPage(e) {
//     let mainSections = document.getElementsByClassName('main-section');
//     for (let i = 0; i < mainSections.length; i++) {
//         mainSections[i].classList.remove('invisible');
//     }
//     let cart = document.querySelector('.cart');
//     cart.classList.add('invisible');
// }

function init() {
    app = new App(appParams);
    createMenu();
    recalcCostLabel();
    let logo = document.querySelector('.page-header-logo');
    // logo.addEventListener('click', reloadPage);

}