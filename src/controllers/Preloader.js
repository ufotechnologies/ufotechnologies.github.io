import { AssetLoader, Assets, Device, FontLoader, Global, Interface, Stage, wait } from 'alien.js';

import { Config } from '../config/Config.js';
import { PreloaderView } from '../views/PreloaderView.js';

export class Preloader {
    static init() {
        if (!Device.webgl) {
            return location = 'fallback.html';
        }

        Assets.path = Config.CDN;
        Assets.crossOrigin = 'anonymous';

        Assets.options = {
            mode: 'cors',
            //credentials: 'include'
        };

        Assets.cache = true;

        this.loaded = 0;

        this.initStage();
        this.initScroll();
        this.initViews();
        this.initLoader();
    }

    static initStage() {
        Stage.css({
            overflowY: 'scroll'
        });
    }

    static initScroll() {
        this.scroll = new Interface('.scroll');
        this.scroll.css({
            width: '100%'
        });
        Stage.add(this.scroll);

        Global.SCROLL = this.scroll;

        history.scrollRestoration = 'manual';
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

        await this.app.init(this.scroll);

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
