'use strict';

function init() {
    const appParams = {
        smallImagePath: "./img/small/",
        bigImagePath: "./img/big/",
    };

    let app = new App(appParams);
    app.buildForm();
    let logo = document.querySelector('.page-header-logo');
    logo.addEventListener('click', app);
}