'use strict';

import Container from './container.js';

export default class FormBuilder {
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

    buildMenu(app) {
        let menuArr = this.getMenuArr();
        menuArr.forEach((element, i) => {
            let submenu;
            if ("submenu" in element && element.submenu instanceof Array && element.submenu.length > 0) {
                let submenuArr = element.submenu.map(sub => {
                    return {
                        item: new MenuItem("menuCategory" + sub.category, sub.href, "page-header-nav-item-submenu-item", "page-header-nav-item-link", sub.label, undefined, app)
                    };
                });
                submenu = new Menu("nav-menu-submenu-" + i, "page-header-nav-item-submenu", submenuArr);
            }
            element.item = new MenuItem(null, element.href, "page-header-nav-item", "page-header-nav-item-link", element.label, submenu, app);
        });
        return new Menu("nav-menu", "page-header-nav-menu", menuArr);
    }
    buildContactForm() {
        return new ContactForm();
    }
    buildCartMenu(cart) {
        if (!document.getElementById("cartManagementMenu")) {
            let btn = document.getElementsByClassName("page-header-cart")[0];
            let menu = new Menu("cartManagementMenu", "page-header-cart-actions", [
                { item: new MenuItem("viewCartItems", "#", null, "page-header-nav-item-link", "View items", null, cart) },
                { item: new MenuItem("clearCart", "#", null, "page-header-nav-item-link", "Clear cart", null, cart) },
            ]);
            btn.append(menu.render());
        }
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

class ContactForm {

    check(_value, _re) {
        // let re = new RegExp(_re);
        return _re.test(_value);
    }

    handleEvent(e) {
        e.preventDefault();
        let input_name = document.getElementById('input_name');
        if (this.check(input_name.value, /^[A-Za-zА-Яа-яЁё\ ]+$/)) {
            input_name.classList.remove('incorrect_input');
        } else {
            input_name.classList.add('incorrect_input');
            console.log(input_name.value);
        }

        let input_phone = document.getElementById('input_phone');
        if (this.check(input_phone.value, /\+[\d]{1}\([\d]{2,3}\)[\d]{2,3}-[\d]{2,3}-[\d]{2,3}$/)) {
            input_phone.classList.remove('incorrect_input');
        } else {
            console.log(input_phone.value);
            input_phone.classList.add('incorrect_input');
        }

        let input_email = document.getElementById('input_email');
        if (this.check(input_email.value, /^[\w]{1}[\w-\.]*@[\w-\.]+\.[a-z]{2,4}$/i)) {
            input_email.classList.remove('incorrect_input');
        } else {
            input_email.classList.add('incorrect_input');
            console.log(input_email.value);
        }

        // let input_content = document.getElementById('input_content');

    }
    render() {
        let form = document.createElement('form');
        form.addEventListener('submit', this);
        form.classList.add('contact-form');
        let span = document.createElement('span');
        span.textContent = 'Contact us';
        form.append(span);
        let label_name = document.createElement('label');
        label_name.for = 'input_name';
        label_name.textContent = 'Your name';
        let input_name = document.createElement('input');
        input_name.id = 'input_name';
        input_name.type = 'text';
        input_name.placeholder = 'Ivan';
        input_name.required = true;
        label_name.append(input_name);
        form.append(label_name);
        let label_phone = document.createElement('label');
        label_phone.for = 'input_phone';
        label_phone.textContent = 'Your phone number';
        let input_phone = document.createElement('input');
        input_phone.id = 'input_phone';
        input_phone.type = 'text';
        input_phone.placeholder = '+7(000)000-0000';
        label_phone.append(input_phone);
        form.append(label_phone);
        let label_email = document.createElement('label');
        label_email.for = 'input_email';
        label_email.textContent = 'Your contact e-mail';
        let input_email = document.createElement('input');
        input_email.id = 'input_email';
        input_email.type = 'text';
        input_email.placeholder = 'my@mail.com';
        label_email.append(input_email);
        form.append(label_email);
        let label_content = document.createElement('label');
        label_content.for = 'input_content';
        label_content.textContent = 'Your message:';
        form.append(label_content);
        let input_content = document.createElement('textarea');
        input_content.id = 'input_content';
        input_content.cols = '50';
        input_content.rows = '10';
        form.append(input_content);
        let input_submit = document.createElement('input');
        input_submit.id = 'input_submit';
        input_submit.type = 'submit';
        input_submit.value = 'Send';
        form.append(input_submit);
        return form;
    }
}