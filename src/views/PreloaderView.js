import { Interface } from 'alien.js';

import { Config } from '../config/Config.js';
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
            backgroundColor: Config.BG_COLOR,
            zIndex: 1,
            pointerEvents: 'none'
        });
    }

    initViews() {
        this.alienkitty = new AlienKittyCanvas();
        this.alienkitty.css({
            y: this.alienkitty.height
        });

        this.wrapper = new Interface('.alienkitty');
        this.wrapper.css({
            left: '50%',
            top: '50%',
            width: this.alienkitty.width,
            height: this.alienkitty.height,
            marginLeft: -this.alienkitty.width / 2,
            marginTop: -this.alienkitty.height / 2 - 65,
            overflow: 'hidden'
        });
        this.wrapper.add(this.alienkitty);
        this.add(this.wrapper);
    }

    /**
     * Public methods
     */

    animateIn = async () => {
        await this.alienkitty.ready();
        this.alienkitty.animateIn();
        await this.alienkitty.tween({ y: 0 }, 1000, 'easeOutCubic', 500);
    };

    animateOut = () => this.tween({ opacity: 0 }, 50, 'easeInOutExpo');
}
