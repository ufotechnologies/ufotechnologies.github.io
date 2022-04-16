import { Events } from '../config/Events.js';
import { Component } from './Component.js';
import { Stage } from './Stage.js';

import { ticker } from '../tween/Ticker.js';
import { defer } from '../tween/Tween.js';

export class ScrollWarp extends Component {
    constructor(object, scroll) {
        super();

        this.object = object;
        this.container = scroll ? scroll.element.parentNode : document.scrollingElement || document.documentElement;
        this.inner = scroll || document.body;
        this.pos = 0;
        this.last = 0;
        this.delta = 0;
        this.lerpSpeed = 0.15;
        this.multiplier = 1;

        this.initHTML();

        this.enable();
    }

    initHTML() {
        this.object.css({ willChange: 'transform' });

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

        const { height } = this.object.element.getBoundingClientRect();

        this.inner.css({ height });
    };

    onUpdate = () => {
        this.pos += (this.container.scrollTop - this.pos) * this.lerpSpeed;
        this.delta = this.pos - this.last;
        this.last = this.pos;

        if (Math.abs(this.delta) < 0.001) {
            return;
        }

        this.object.css({
            y: -Math.round(this.pos / 2),
            skewY: this.delta / window.innerHeight * 10 * this.multiplier
        });
    };

    /**
     * Public methods
     */

    enable = () => {
        this.addListeners();
        this.onResize();
    };

    disable = () => {
        this.removeListeners();
    };

    destroy = () => {
        this.disable();

        return super.destroy();
    };
}
