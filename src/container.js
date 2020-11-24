'use strict';

export default class Container {
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