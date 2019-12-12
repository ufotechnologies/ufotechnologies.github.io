import { AssetLoader, Assets, Events, FontLoader, Interface, Utils } from '../../alien.js/src/Alien.js';

import { AlienKittyCanvas } from '../views/AlienKittyCanvas.js';
import { Container } from './Container.js';

export class Loader extends Interface {
    constructor() {
        super('Loader');
        const self = this;
        let alienkitty;

        initHTML();
        initView();
        initLoader();

        function initHTML() {
            self.size('100%').setZ(1).mouseEnabled(false);
            self.css({
                position: 'fixed',
                top: 0,
                left: 0,
                overflow: 'hidden'
            });
            self.bg('#111');
        }

        function initView() {
            const wrapper = self.create('.wrapper');
            wrapper.size(90, 86).center();
            wrapper.css({
                marginTop: -108,
                overflow: 'hidden'
            });
            alienkitty = wrapper.initClass(AlienKittyCanvas);
            alienkitty.canvas.object.transform({ y: 86 });
            alienkitty.ready().then(() => {
                alienkitty.animateIn();
                alienkitty.canvas.object.tween({ y: 0 }, 1000, 'easeOutCubic', 500);
            });
        }

        function initLoader() {
            Config.ASSETS.push(`assets/data/data.json?${Utils.timestamp()}`);
            Promise.all([
                FontLoader.loadFonts([
                    { family: 'Inter', style: 'normal', weight: '400' },
                    { family: 'Inter', style: 'normal', weight: '700' }
                ]),
                AssetLoader.loadAssets(Config.ASSETS)
            ]).then(loadComplete);
        }

        function loadComplete() {
            Config.DATA = Assets.getData('data');
            Container.instance().preload().then(complete);
        }

        function complete() {
            Container.instance().scene.animateIn();
            self.loaded = true;
            self.events.fire(Events.COMPLETE);
        }

        this.animateOut = callback => {
            this.tween({ opacity: 0 }, 50, 'easeInOutExpo', callback);
        };
    }
}
