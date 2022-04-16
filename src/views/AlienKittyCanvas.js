import { Assets } from '../loaders/Assets.js';
import { Interface } from '../utils/Interface.js';
import { Stage } from '../utils/Stage.js';

import { ticker } from '../tween/Ticker.js';
import { clearTween, tween } from '../tween/Tween.js';
import { degToRad, headsTails, randInt } from '../utils/Utils.js';

export class AlienKittyCanvas extends Interface {
    constructor() {
        super(null, 'canvas');

        this.width = 90;
        this.height = 86;
        this.needsUpdate = false;
        this.isLoaded = false;

        this.initHTML();
        this.initCanvas();
    }

    initHTML() {
        this.css({
            position: 'relative'
        });
    }

    initCanvas() {
        this.context = this.element.getContext('2d');
    }

    async initImages() {
        const img = await Promise.all([
            Assets.loadImage('assets/images/alienkitty.svg'),
            Assets.loadImage('assets/images/alienkitty_eyelid.svg')
        ]);

        this.alienkitty = this.createCanvasObject(img[0], 90, 86);
        this.eyelid1 = this.createCanvasObject(img[1], 24, 14, { pX: 0.5, x: 35, y: 25, scaleX: 1.5, scaleY: 0.01 });
        this.eyelid2 = this.createCanvasObject(img[1], 24, 14, { x: 53, y: 26, scaleX: 1, scaleY: 0.01 });

        this.isLoaded = true;

        this.update();
    }

    createCanvasObject(image, width, height, {
        x = 0,
        y = 0,
        pX = 0,
        pY = 0,
        rotation = 0,
        scaleX = 1,
        scaleY = 1,
        scale = 1,
        opacity = 1
    } = {}) {
        return {
            image,
            width,
            height,
            x,
            y,
            pX: width * pX,
            pY: height * pY,
            rotation,
            scaleX: scaleX * scale,
            scaleY: scaleY * scale,
            opacity
        };
    }

    drawImage(object) {
        const context = this.context;

        context.save();
        context.translate(object.x + object.pX, object.y + object.pY);
        context.rotate(degToRad(object.rotation));
        context.scale(object.scaleX, object.scaleY);
        context.globalAlpha = object.opacity;
        context.drawImage(object.image, -object.pX, -object.pY, object.width, object.height);
        context.restore();
    }

    addListeners() {
        ticker.add(this.onUpdate);
    }

    removeListeners() {
        ticker.remove(this.onUpdate);
    }

    blink() {
        this.delayedCall(randInt(0, 10000), headsTails(this.onBlink1, this.onBlink2));
    }

    /**
     * Event handlers
     */

    onUpdate = () => {
        if (this.needsUpdate) {
            this.update();
        }
    };

    onBlink1 = () => {
        this.needsUpdate = true;
        tween(this.eyelid1, { scaleY: 1.5 }, 120, 'easeOutCubic', () => {
            tween(this.eyelid1, { scaleY: 0.01 }, 180, 'easeOutCubic');
        });
        tween(this.eyelid2, { scaleX: 1.3, scaleY: 1.3 }, 120, 'easeOutCubic', () => {
            tween(this.eyelid2, { scaleX: 1, scaleY: 0.01 }, 180, 'easeOutCubic', () => {
                this.needsUpdate = false;
                this.blink();
            });
        });
    };

    onBlink2 = () => {
        this.needsUpdate = true;
        tween(this.eyelid1, { scaleY: 1.5 }, 120, 'easeOutCubic', () => {
            tween(this.eyelid1, { scaleY: 0.01 }, 180, 'easeOutCubic');
        });
        tween(this.eyelid2, { scaleX: 1.3, scaleY: 1.3 }, 180, 'easeOutCubic', () => {
            tween(this.eyelid2, { scaleX: 1, scaleY: 0.01 }, 240, 'easeOutCubic', () => {
                this.needsUpdate = false;
                this.blink();
            });
        });
    };

    /**
     * Public methods
     */

    resize = () => {
        const { dpr } = Stage;

        this.element.width = Math.round(this.width * dpr);
        this.element.height = Math.round(this.height * dpr);
        this.element.style.width = this.width + 'px';
        this.element.style.height = this.height + 'px';
        this.context.scale(dpr, dpr);

        if (this.isLoaded) {
            this.update();
        }
    };

    update = () => {
        this.context.clearRect(0, 0, this.element.width, this.element.height);

        this.drawImage(this.alienkitty);
        this.drawImage(this.eyelid1);
        this.drawImage(this.eyelid2);
    };

    animateIn = () => {
        this.addListeners();
        this.resize();
        this.blink();
    };

    ready = () => this.initImages();

    destroy = () => {
        this.removeListeners();

        clearTween(this.eyelid1);
        clearTween(this.eyelid2);

        return super.destroy();
    };
}
