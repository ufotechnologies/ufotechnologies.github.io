import { Interface } from '../utils/Interface.js';
import { Data } from '../data/Data.js';

export class NavHeadline extends Interface {
    constructor() {
        super(null, 'h1');

        this.words = [];

        this.initHTML();
        this.initText();
    }

    initHTML() {
        this.css({
            position: 'relative',
            fontWeight: '740',
            fontSize: 37,
            lineHeight: '1.15em',
            letterSpacing: -0.2,
            color: 'rgba(255, 255, 255, 0.9)',
            marginTop: 0,
            marginBottom: 60
        });
    }

    initText() {
        const text = Data.getHeadline();
        const split = text.split(' ');

        split.forEach((str, i) => {
            if (i < split.length - 1) {
                str += '&nbsp';
            }

            const word = new Interface(null, 'span');
            word.html(str);
            this.add(word);

            this.words.push(word);
        });

        this.words.forEach(word => {
            word.inner = word.clone();
            word.inner.css({
                y: 50
            });

            word.css({
                overflow: 'hidden'
            });
            word.empty();
            word.add(word.inner);
        });
    }

    /**
     * Public methods
     */

    animateIn = () => {
        const duration = 1000;
        const stagger = 100;
        const delay = 500;

        this.words.forEach((word, i) => {
            word.inner.tween({ y: 0 }, duration, 'easeOutCubic', delay + i * stagger);
        });
    };
}
