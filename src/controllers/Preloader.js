import { Config } from '../config/Config.js';
import { Device } from '../config/Device.js';
import { Assets } from '../loaders/Assets.js';
import { FontLoader } from '../loaders/FontLoader.js';
import { AssetLoader } from '../loaders/AssetLoader.js';
import { Stage } from './Stage.js';
import { PreloaderView } from '../views/PreloaderView.js';

import { wait } from '../tween/Tween.js';

export class Preloader {
    static init() {
        if (!Device.webgl) {
            return location.href = 'fallback.html';
        }

        Assets.path = Config.CDN;
        Assets.crossOrigin = 'anonymous';

        Assets.options = {
            mode: 'cors',
            // credentials: 'include'
        };

        Assets.cache = true;

        this.loaded = 0;

        this.initViews();
        this.initLoader();
    }

    static async initViews() {
        this.view = new PreloaderView();
        Stage.add(this.view);

        await wait(2000);

        this.loaded++;
        this.onComplete();
    }

    static async initLoader() {
        this.view.animateIn();

        await Promise.all([
            FontLoader.loadFonts(['Inter']),
            AssetLoader.loadAssets(['assets/data/data.json'])
        ]);

        const { App } = await import('./App.js');
        this.app = App;

        await this.app.init();

        this.loaded++;
        this.onComplete();
    }

    /**
     * Event handlers
     */

    static onComplete = async () => {
        if (this.loaded > 1) {
            await this.view.animateOut();
            this.view = this.view.destroy();

            this.app.start();
        }
    };
}
