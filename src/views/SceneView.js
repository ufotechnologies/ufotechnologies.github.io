import { Group } from 'three';

import { Events } from '../config/Events.js';
import { Stage } from '../utils/Stage.js';
import { Grid } from './Grid.js';
import { AlienKitty } from './AlienKitty.js';

import { mapLinear } from '../utils/Utils.js';

export class SceneView extends Group {
    constructor() {
        super();

        this.initViews();

        this.addListeners();
    }

    initViews() {
        this.grid = new Grid();
        this.add(this.grid);

        this.alienkitty = new AlienKitty();
        this.add(this.alienkitty);
    }

    addListeners() {
        Stage.events.on(Events.GLITCH_IN, this.onGlitchIn);
        Stage.events.on(Events.GLITCH_OUT, this.onGlitchOut);
    }

    /**
     * Event handlers
     */

    onGlitchIn = ({ delta }) => {
        const time = mapLinear(delta, 0, 400, 300, 50);

        this.alienkitty.showAlienKitty(time);
    };

    onGlitchOut = () => {
        this.alienkitty.hideAlienKitty();
    };

    /**
     * Public methods
     */

    resize = (width, height, dpr) => {
        this.grid.resize(width, height, dpr);
        this.alienkitty.resize(width, height, dpr);
    };

    update = (time, delta, frame) => {
        this.grid.update(time, delta, frame);
        this.alienkitty.update(time, delta, frame);
    };

    animateIn = () => {
        this.grid.animateIn();
        this.alienkitty.animateIn();
    };

    ready = () => this.alienkitty.ready();
}
