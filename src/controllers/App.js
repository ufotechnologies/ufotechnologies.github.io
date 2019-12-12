import { Device, Events, Stage } from '../../alien.js/src/Alien.js';

import '../config/Config.js';

import { Loader } from './Loader.js';
import { Container } from './Container.js';

export class App {
    constructor() {
        if (!Device.webgl) return window.location = 'fallback.html';

        let scroll, loader;

        initStage();
        initScroll();
        initLoader();
        addListeners();

        function initStage() {
            Stage.allowScroll();
            Stage.css({ overflowY: 'scroll' });
            window.history.scrollRestoration = 'manual';
        }

        function initScroll() {
            scroll = Stage.create('Scroll');
            scroll.css({ width: '100%' });
            Stage.scroll = scroll;
        }

        function initLoader() {
            loader = Stage.initClass(Loader);
            Stage.events.add(loader, Events.COMPLETE, initContainer);
            Stage.delayedCall(init, 2000);
        }

        function initContainer() {
            Stage.events.fire(Events.COMPLETE);
        }

        function init() {
            Stage.loaded = true;
            Stage.events.fire(Events.COMPLETE);
        }

        function addListeners() {
            Stage.events.add(Events.COMPLETE, complete);
        }

        function complete() {
            if (loader.loaded && Stage.loaded) {
                Stage.delayedCall(() => {
                    loader.animateOut(() => {
                        loader = loader.destroy();
                        Container.instance().page.nav.animateIn();
                    });
                    Stage.events.fire(Events.GLITCH_LOADER);
                }, 1000);
            }
        }
    }
}
