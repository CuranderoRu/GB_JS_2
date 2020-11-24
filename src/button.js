'use strict';

import Container from './container.js';

export default class Button extends Container {
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