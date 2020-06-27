import { Interface, Stage } from 'alien.js';

import { Events } from '../config/Events.js';

export class GridLayout extends Interface {
    constructor() {
        super('.grid');

        this.pos = 0;
        this.last = 0;
        this.delta = 0;

        this.initHTML();
    }

    initHTML() {
        this.css({
            position: 'relative',
            width: '100%',
            height: '100vh'
        });
    }

    /**
     * Public methods
     */

    resize = () => {
    };

    update = () => {
        this.pos = Stage.element.scrollTop;
        this.delta = this.pos - this.last;
        this.last = this.pos;

        const scrolled = this.pos + window.innerHeight;
        const height = this.element.offsetHeight;
        const start = this.element.offsetTop;
        const end = start + height + window.innerHeight;

        if (scrolled > start && scrolled < end) {
            const current = scrolled - start;
            const percent = current / (height + window.innerHeight);

            if (percent > 0.25 && percent < 0.75 && !this.animatedIn) {
                this.animatedIn = true;
                this.animateIn(this.delta);
            }
        } else if (this.animatedIn) {
            this.animatedIn = false;
            this.animateOut(this.delta);
        }
    };

    animateIn = delta => {
        Stage.events.emit(Events.GLITCH_IN, { delta });
    };

    animateOut = delta => {
        Stage.events.emit(Events.GLITCH_OUT, { delta });
    };
}
