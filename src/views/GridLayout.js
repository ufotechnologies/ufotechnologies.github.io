import { Events, Interface, Stage } from '../../alien.js/src/Alien.js';

export class GridLayout extends Interface {
    constructor() {
        super('GridLayout');
        const self = this;
        let pos = 0,
            last = 0,
            delta = 0;

        initHTML();
        this.startRender(loop);

        function initHTML() {
            self.css({ position: 'relative' });
        }

        function loop() {
            const scrollElement = Stage.element,
                scrolled = scrollElement.scrollTop + Stage.height;
            pos = scrollElement.scrollTop;
            delta = pos - last;
            last = pos;
            const start = self.element.offsetTop,
                current = scrolled - start,
                end = start + Stage.height * 2;
            if (scrolled > start && scrolled < end) {
                const percent = current / (Stage.height * 2);
                if (percent > 0.25 && percent < 0.75) {
                    if (!self.animatedIn) {
                        self.animatedIn = true;
                        self.animateIn(delta);
                    }
                } else {
                    if (self.animatedIn) {
                        self.animatedIn = false;
                        self.animateOut(delta);
                    }
                }
            }
        }

        this.resize = () => {
            this.size('100%', Stage.height);
        };

        this.animateIn = delta => {
            this.events.fire(Events.GLITCH_IN, delta);
        };

        this.animateOut = delta => {
            this.events.fire(Events.GLITCH_OUT, delta);
        };
    }
}
