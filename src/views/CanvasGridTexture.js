/* global THREE */

import { Canvas, CanvasGraphics, CanvasTexture, Component, Stage } from '../../alien.js/src/Alien.js';

import { AlienKittyCanvas } from './AlienKittyCanvas.js';

export class CanvasGridTexture extends Component {
    constructor() {
        super();
        const self = this;
        let canvas, fill, dots, alienkitty, alienkittygraphics, texture, timeout;

        this.needsUpdate = false;

        initCanvas();
        initFill();
        initDots();
        initAlienKitty();

        function initCanvas() {
            canvas = self.initClass(Canvas, Stage.width, Stage.height, true, true);
            self.canvas = canvas;
            texture = new THREE.Texture(canvas.element);
            texture.minFilter = texture.magFilter = THREE.LinearFilter;
            texture.generateMipmaps = false;
            self.texture = texture;
        }

        function initFill() {
            fill = self.initClass(CanvasGraphics);
            fill.fillStyle = '#111';
            canvas.add(fill);
        }

        function initDots() {
            dots = self.initClass(CanvasGraphics);
            dots.fillStyle = 'rgba(255, 255, 255, 0.1)';
            canvas.add(dots);
        }

        function initAlienKitty() {
            alienkitty = self.initClass(AlienKittyCanvas);
            self.alienkitty = alienkitty;
            alienkittygraphics = self.initClass(CanvasTexture, alienkitty.element, 90, 86);
            alienkittygraphics.opacity = 1;
            canvas.add(alienkittygraphics);
        }

        function drawFill() {
            fill.clear();
            fill.fillRect(0, 0, canvas.width, canvas.height);
        }

        function drawDots() {
            dots.clear();
            const size = canvas.height / 10;
            for (let j = 0; j < 10; j++) {
                for (let i = 0; i < canvas.width / 10; i++) {
                    dots.beginPath();
                    dots.arc(size * (i + 0.5), size * (j + 0.5), 2.5 / Math.PI, 0, 2 * Math.PI, false);
                    dots.fill();
                }
            }
        }

        function drawAlienKitty() {
            alienkittygraphics.transform({ x: (canvas.width - alienkittygraphics.width) / 2, y: (canvas.height - alienkittygraphics.height) / 2 - 65 });
        }

        this.update = () => {
            canvas.size(Stage.width, Stage.height);
            drawFill();
            drawDots();
            drawAlienKitty();
            canvas.render();
            texture.needsUpdate = true;
        };

        this.showAlienKitty = time => {
            this.clearTimeout(timeout);
            this.needsUpdate = true;
            alienkittygraphics.tween({ opacity: 1 }, time, 'easeInOutExpo');
            timeout = this.delayedCall(() => this.needsUpdate = false, 500);
        };

        this.hideAlienKitty = () => {
            this.clearTimeout(timeout);
            this.needsUpdate = true;
            alienkittygraphics.tween({ opacity: 0 }, 250, 'easeOutSine');
            timeout = this.delayedCall(() => this.needsUpdate = false, 500);
        };

        this.animateIn = alienkitty.animateIn;

        this.ready = alienkitty.ready;
    }
}
