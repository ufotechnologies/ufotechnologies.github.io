import { Component, Events } from '../../alien.js/src/Alien.js';

import { CanvasGrid } from './CanvasGrid.js';

export class Scene extends Component {
    constructor() {
        super();
        const self = this;
        let grid;

        initViews();
        addListeners();

        function initViews() {
            grid = self.initClass(CanvasGrid);
        }

        function addListeners() {
            self.events.add(Events.GLITCH_IN, glitchIn);
            self.events.add(Events.GLITCH_OUT, glitchOut);
        }

        function glitchIn(delta = 0) {
            const time = Math.range(delta, 0, 400, 300, 50);
            grid.showAlienKitty(time);
        }

        function glitchOut() {
            grid.hideAlienKitty();
        }

        this.resize = grid.resize;

        this.animateIn = grid.animateIn;

        this.ready = grid.ready;
    }
}
