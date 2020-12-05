'use strict';

export default class Route {
    constructor(href = '') {
        this.path = href.replace(document.location.origin + '/', '');
    }
}