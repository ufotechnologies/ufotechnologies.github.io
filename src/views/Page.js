import { Interface, ScrollWarp, Stage } from '../../alien.js/src/Alien.js';

import { NavLayout } from './NavLayout.js';
import { GridLayout } from './GridLayout.js';

export class Page extends Interface {
    constructor() {
        super('Page');
        const self = this;
        let nav, grid;

        initContainer();
        initViews();
        addListeners();

        function initContainer() {
            self.size('100%', 'auto');
        }

        function initViews() {
            nav = self.initClass(NavLayout);
            grid = self.initClass(GridLayout);
            self.nav = nav;
        }

        function addListeners() {
            self.initClass(ScrollWarp, self, Stage.scroll);
        }

        this.resize = () => {
            nav.resize();
            grid.resize();
        };

        this.animateIn = () => {
        };
    }
}
