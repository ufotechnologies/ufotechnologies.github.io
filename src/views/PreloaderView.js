import { Interface } from '../utils/Interface.js';
import { AlienKittyCanvas } from './AlienKittyCanvas.js';

export class PreloaderView extends Interface {
    constructor() {
        super('.preloader');

        this.initHTML();
        this.initViews();
    }

    initHTML() {
        this.css({
            position: 'fixed',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'var(--bg-color)',
            zIndex: 1,
            pointerEvents: 'none'
        });
    }

    initViews() {
        this.alienkitty = new AlienKittyCanvas();

        this.container = new Interface('.container');
        this.container.css({
            left: '50%',
            top: '50%',
            width: this.alienkitty.width,
            height: this.alienkitty.height,
            marginLeft: -this.alienkitty.width / 2,
            marginTop: -this.alienkitty.height / 2 - 65,
            overflow: 'hidden'
        });
        this.add(this.container);

        this.wrapper = new Interface('.wrapper');
        this.wrapper.css({
            y: this.alienkitty.height
        });
        this.wrapper.add(this.alienkitty);
        this.container.add(this.wrapper);
    }

    /**
     * Public methods
     */

    animateIn = async () => {
        await this.alienkitty.ready();
        this.alienkitty.animateIn();
        await this.wrapper.tween({ y: 0 }, 1000, 'easeOutCubic', 500);
    };

    animateOut = () => this.tween({ opacity: 0 }, 50, 'easeInOutExpo');
}
