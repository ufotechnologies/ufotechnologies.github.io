import { Global } from '../config/Global.js';
import { Interface } from '../utils/Interface.js';
import { ScrollWarp } from '../utils/ScrollWarp.js';
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
            width: '100%',
            zIndex: 3
        });
    }

    initViews() {
        this.nav = new NavLayout();
        this.add(this.nav);

        this.grid = new GridLayout();
        this.add(this.grid);
    }

    addListeners() {
        const warp = new ScrollWarp(this, Global.SCROLL);
        warp.multiplier = 3;
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
    };
}
