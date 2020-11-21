'use strict';

const appParams = {
    smallImagePath: "./img/small/",
    bigImagePath: "./img/big/",
};

let app;

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
    let nav = document.getElementById('nav');
    nav.append(app.buildMenu().render());
    app.cart.recalcCostLabel();
    let logo = document.querySelector('.page-header-logo');
    // logo.addEventListener('click', reloadPage);

}