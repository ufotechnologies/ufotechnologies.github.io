import { Interface } from 'alien.js';

import { Data } from '../data/Data.js';
import { NavLink } from './NavLink.js';

export class NavLinks extends Interface {
    constructor() {
        super('.links');

        this.links = [];

        this.initHTML();
        this.initLinks();
    }

    initHTML() {
        this.css({
            position: 'relative'
        });
    }

    initLinks() {
        Data.getLinks().forEach(data => {
            const link = new NavLink(data);
            link.css({
                y: 50,
                opacity: 0
            });
            this.add(link);

            this.links.push(link);
        });
    }

    /**
     * Public methods
     */

    resize = () => {
        this.links.forEach(link => {
            link.resize();
        });
    };

    animateIn = () => {
        const duration = 1000;
        const stagger = 80;
        const delay = 3000;

        this.links.forEach((link, i) => {
            link.tween({ y: 0, opacity: 1 }, duration, 'easeOutCubic', delay + i * stagger);
        });
    };
}
