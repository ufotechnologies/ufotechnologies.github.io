import { Assets, Canvas, CanvasTexture, Component, Utils } from '../../alien.js/src/Alien.js';

export class AlienKittyCanvas extends Component {
    constructor() {
        super();
        const self = this;
        let canvas, alienkitty, eyelid1, eyelid2;

        this.needsUpdate = false;

        initCanvas();
        initImages();

        function initCanvas() {
            canvas = self.initClass(Canvas, 90, 86, true, true);
            self.canvas = canvas;
            self.element = canvas.element;
        }

        function initImages() {
            return Promise.all([
                Assets.loadImage('assets/images/alienkitty.svg'),
                Assets.loadImage('assets/images/alienkitty_eyelid.svg')
            ]).then(finishSetup);
        }

        function finishSetup(img) {
            alienkitty = self.initClass(CanvasTexture, img[0], 90, 86);
            eyelid1 = self.initClass(CanvasTexture, img[1], 24, 14);
            eyelid1.transformPoint('50%', 0).transform({ x: 35, y: 25, scaleX: 1.5, scaleY: 0.01 });
            eyelid2 = self.initClass(CanvasTexture, img[1], 24, 14);
            eyelid2.transformPoint(0, 0).transform({ x: 53, y: 26, scaleX: 1, scaleY: 0.01 });
            alienkitty.add(eyelid1);
            alienkitty.add(eyelid2);
            canvas.add(alienkitty);
        }

        function blink() {
            self.delayedCall(Utils.headsTails(blink1, blink2), Utils.random(0, 10000));
        }

        function blink1() {
            self.needsUpdate = true;
            eyelid1.tween({ scaleY: 1.5 }, 120, 'easeOutCubic', () => {
                eyelid1.tween({ scaleY: 0.01 }, 180, 'easeOutCubic');
            });
            eyelid2.tween({ scaleX: 1.3, scaleY: 1.3 }, 120, 'easeOutCubic', () => {
                eyelid2.tween({ scaleX: 1, scaleY: 0.01 }, 180, 'easeOutCubic', () => {
                    self.needsUpdate = false;
                    blink();
                });
            });
        }

        function blink2() {
            self.needsUpdate = true;
            eyelid1.tween({ scaleY: 1.5 }, 120, 'easeOutCubic', () => {
                eyelid1.tween({ scaleY: 0.01 }, 180, 'easeOutCubic');
            });
            eyelid2.tween({ scaleX: 1.3, scaleY: 1.3 }, 180, 'easeOutCubic', () => {
                eyelid2.tween({ scaleX: 1, scaleY: 0.01 }, 240, 'easeOutCubic', () => {
                    self.needsUpdate = false;
                    blink();
                });
            });
        }

        function loop() {
            if (self.needsUpdate) canvas.render();
        }

        this.animateIn = () => {
            canvas.render();
            this.startRender(loop);
            blink();
        };

        this.ready = initImages;
    }
}
