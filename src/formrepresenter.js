'use strict';

export default class FormRepresenter {
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