/**
 * @author pschroen / https://ufo.ai/
 *
 * Based on https://codepen.io/ReGGae/pen/pxMJLW
 */

import { Events } from '../config/Events.js';
import { Component } from './Component.js';
import { Stage } from '../controllers/Stage.js';

import { ticker } from '../tween/Ticker.js';
import { defer } from '../tween/Tween.js';

export class Smooth extends Component {
    constructor(content) {
        super();

        this.content = content;

        this.pos = 0;
        this.rounded = 0;
        this.lerpSpeed = 0.1;
        this.multiplier = 7.5;

        this.initHTML();
    }

    initHTML() {
        this.content.css({ willChange: 'transform' });

        history.scrollRestoration = 'manual';
    }

    addListeners() {
        Stage.events.on(Events.RESIZE, this.onResize);
        ticker.add(this.onUpdate);
    }

    removeListeners() {
        Stage.events.off(Events.RESIZE, this.onResize);
        ticker.remove(this.onUpdate);
    }

    /**
     * Event handlers
     */

    onResize = async () => {
        await defer();

        document.body.style.height = `${this.content.element.getBoundingClientRect().height}px`;

        this.rounded = this.pos = window.scrollY;
    };

    onUpdate = () => {
        this.pos += (window.scrollY - this.pos) * this.lerpSpeed;
        this.rounded = Math.round(this.pos * 100) / 100;

        const delta = window.scrollY - this.rounded;
        const velocity = delta / Stage.width;
        const skewY = velocity * this.multiplier;

        this.content.css({ y: -this.rounded, skewY });
    };

    /**
     * Public methods
     */

    enable = () => {
        this.addListeners();

        defer(this.onResize);
    };

    disable = () => {
        this.removeListeners();

        document.body.style.height = '';
    };

    destroy = () => {
        this.disable();

        return super.destroy();
    };
}
