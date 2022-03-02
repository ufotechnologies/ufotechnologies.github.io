import { Events } from '../config/Events.js';
import { Assets } from '../loaders/Assets.js';
import { Interface } from '../utils/Interface.js';
import { Data } from '../data/Data.js';
import { WorldController } from './world/WorldController.js';
import { RenderManager } from './world/RenderManager.js';
import { Stage } from './Stage.js';
import { SceneView } from '../views/SceneView.js';
import { Page } from '../views/Page.js';

import { ticker } from '../tween/Ticker.js';
import { wait } from '../tween/Tween.js';

export class App {
    static async init() {
        Data.init(Assets.get('assets/data/data.json'));

        this.initWorld();
        this.initViews();
        this.initControllers();

        this.addListeners();
        this.onResize();

        await this.view.ready();
        this.view.animateIn();

        await wait(1000);
    }

    static initWorld() {
        WorldController.init();

        this.world = new Interface(WorldController.element);
        this.world.css({
            position: 'fixed',
            pointerEvents: 'none'
        });
        Stage.add(this.world);
    }

    static initViews() {
        this.view = new SceneView();
        WorldController.scene.add(this.view);

        this.page = new Page();
        Stage.add(this.page);
    }

    static initControllers() {
        const { renderer, scene, camera } = WorldController;

        RenderManager.init(renderer, scene, camera);
    }

    static addListeners() {
        Stage.events.on(Events.RESIZE, this.onResize);
        ticker.add(this.onUpdate);
    }

    /**
     * Event handlers
     */

    static onResize = () => {
        const { width, height, dpr } = Stage;

        WorldController.resize(width, height, dpr);
        this.view.resize(width, height, dpr);
        RenderManager.resize(width, height, dpr);
        this.page.resize();
    };

    static onUpdate = (time, delta, frame) => {
        WorldController.update(time, delta, frame);
        this.view.update(time, delta, frame);
        RenderManager.update();
        this.page.update();
    };

    /**
     * Public methods
     */

    static start = async () => {
        this.page.animateIn();

        Stage.events.emit(Events.GLITCH_LOADER);
    };
}
