import { Interface } from 'alien.js';

export class GridCanvas extends Interface {
    constructor() {
        super(null, 'canvas');

        this.initCanvas();
        this.initDots();
    }

    initCanvas() {
        this.context = this.element.getContext('2d');
    }

    initDots() {
        this.dots = {
            fillStyle: 'rgba(255, 255, 255, 0.15)'
        };
    }

    drawDots() {
        const values = this.dots;
        const context = this.context;
        const size = this.element.height / 10;

        context.save();
        context.fillStyle = values.fillStyle;

        for (let j = 0; j < 10; j++) {
            for (let i = 0; i < this.element.width / 10; i++) {
                context.beginPath();
                context.arc(size * (i + 0.5), size * (j + 0.5), 2.5 / Math.PI, 0, 2 * Math.PI);
                context.fill();
            }
        }

        context.restore();
    }

    /**
     * Public methods
     */

    resize = (width, height, dpr) => {
        this.element.width = Math.round(width * dpr);
        this.element.height = Math.round(height * dpr);
        this.context.scale(dpr, dpr);

        this.update();
    };

    update = () => {
        this.context.clearRect(0, 0, this.element.width, this.element.height);

        this.drawDots();
    };
}
