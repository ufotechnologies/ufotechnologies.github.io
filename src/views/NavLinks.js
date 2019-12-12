import { Interface } from '../../alien.js/src/Alien.js';

import { NavLink } from './NavLink.js';

export class NavLinks extends Interface {
    constructor() {
        super('NavLinks');
        const self = this;
        const links = [];

        initHTML();
        initLinks();

        function initHTML() {
            self.size('100%', 'auto');
            self.css({
                position: 'relative'
            });
        }

        function initLinks() {
            Config.DATA.forEach(createLink);
            links.forEach(link => {
                link.transform({ y: 50 }).css({ opacity: 0 });
            });
        }

        function createLink(link) {
            links.push(self.initClass(NavLink, link));
        }

        this.animateIn = () => {
            links.forEach((link, i) => {
                link.tween({ y: 0, opacity: 1 }, 1000, 'easeOutCubic', 3500 + i * 80);
            });
        };
    }
}
