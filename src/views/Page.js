import { Interface } from '../utils/Interface.js';
import { Smooth } from '../utils/Smooth.js';
import { NavLayout } from './NavLayout.js';
import { GridLayout } from './GridLayout.js';

export class Page extends Interface {
    constructor() {
        super('.page');

        this.initHTML();
        this.initViews();

        this.addListeners();
    }

    initHTML() {
        this.css({
            width: '100%'
        });
    }

    initViews() {
        this.nav = new NavLayout();
        this.add(this.nav);

        this.grid = new GridLayout();
        this.add(this.grid);
    }

    addListeners() {
        this.smooth = new Smooth(this);
    }

    /**
     * Public methods
     */

    resize = () => {
        this.nav.resize();
        this.grid.resize();
    };

    update = () => {
        this.grid.update();
    };

    animateIn = () => {
        this.nav.animateIn();
        this.smooth.enable();
    };
}
