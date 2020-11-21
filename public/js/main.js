'use strict';

function init() {
    const appParams = {
        smallImagePath: "./img/small/",
        bigImagePath: "./img/big/",
    };

    let app = new App(appParams);
    let nav = document.getElementById('nav');
    nav.append(app.buildMenu().render());
    let logo = document.querySelector('.page-header-logo');
    logo.addEventListener('click', app);
}