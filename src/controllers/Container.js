import { Events, Interface, Stage } from '../../alien.js/src/Alien.js';

import { World } from './World.js';
import { Scene } from '../views/Scene.js';
import { Page } from '../views/Page.js';

export class Container extends Interface {
    static instance() {
        if (!this.singleton) this.singleton = new Container();
        return this.singleton;
    }

    constructor() {
        super('Container');
        const self = this;
        let scene, page;

        initContainer();
        initViews();
        addListeners();

        function initContainer() {
            Stage.add(self);
            World.instance();
            self.add(World);
        }

        function initViews() {
            scene = self.initClass(Scene);
            page = self.initClass(Page);
            self.scene = scene;
            self.page = page;
        }

        function addListeners() {
            self.events.add(Events.RESIZE, resize);
            resize();
        }

        function resize() {
            self.size(Stage.width, Stage.height, true);
            scene.resize();
            page.resize();
        }

        this.preload = scene.ready;
    }
}
