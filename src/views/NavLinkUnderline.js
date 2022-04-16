import { Interface } from '../utils/Interface.js';

export class NavLinkUnderline extends Interface {
    constructor(element) {
        super(element);

        this.initHTML();

        this.addListeners();
    }

    initHTML() {
        this.line = new Interface('.line');
        this.line.css({
            bottom: 0,
            width: '100%',
            height: 2,
            backgroundColor: 'var(--ui-color)',
            scaleX: 0
        });
        this.add(this.line);
    }

    addListeners() {
        this.element.addEventListener('mouseenter', this.onHover);
        this.element.addEventListener('mouseleave', this.onHover);
    }

    /**
     * Event handlers
     */

    onHover = ({ type }) => {
        this.line.clearTween();

        if (type === 'mouseenter') {
            this.line.css({ transformOrigin: 'left center', scaleX: 0 }).tween({ scaleX: 1 }, 800, 'easeOutQuint');
        } else {
            this.line.css({ transformOrigin: 'right center' }).tween({ scaleX: 0 }, 500, 'easeOutQuint');
        }
    };
}
