/**
 * Patrick Schroen –– Web 3.0 technologist.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Events, Stage, Interface, Device, Utils, Assets, AssetLoader, FontLoader, TweenManager } from '../alien.js/src/Alien.js';
import {  } from './Config';


class NavLink extends Interface {

    constructor(data) {
        super('.NavLink');
        const self = this;
        let container, title, description, line;

        initHTML();

        function initHTML() {
            self.size('100%', 'auto');
            self.css({
                position: 'relative',
                marginBottom: data.group ? 30 : 15
            });
            container = self.create('.container');
            container.css({
                position: 'relative',
                display: 'inline-block'
            });
            if (data.group || data.title) {
                title = container.create('.title');
                title.fontStyle('Neue Haas Grotesk', data.group ? 18.5 : 13.5, data.group ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 1)');
                title.css({
                    position: 'relative',
                    fontWeight: 'bold',
                    lineHeight: '1.2'
                });
                title.html(data.group ? data.group : data.title);
            }
            if (data.description) {
                description = container.create('.description');
                description.fontStyle('Neue Haas Grotesk', !data.title ? 13.5 : 12.5, 'rgba(255, 255, 255, 1)');
                description.css({
                    position: 'relative',
                    display: 'inline-block',
                    fontWeight: 'normal',
                    lineHeight: '1.2'
                });
                description.html(data.description);
                if (data.link) {
                    line = description.create('.line');
                    line.css({
                        position: 'relative',
                        display: Device.phone ? 'block' : 'inline-block'
                    });
                    line.html(Device.phone ? '––' : '&nbsp;––');
                    container.interact(hover, click);
                    container.link = data.link;
                }
            }
        }

        function hover(e) {
            if (e.action === 'over') line.tween({ x: 10 }, 200, 'easeOutCubic');
            else line.tween({ x: 0 }, 200, 'easeOutCubic');
        }

        function click(e) {
            getURL(e.object.link);
        }
    }
}

class NavLinks extends Interface {

    constructor() {
        super('NavLinks');
        const self = this;
        const links = [];

        initHTML();
        initLinks();

        function initHTML() {
            self.size('100%');
            self.css({
                height: '',
                position: 'relative',
                display: 'block'
            });
        }

        function initLinks() {
            Assets.getData('config').forEach(createLink);
            links.forEach((link, i) => link.transform({ y: 50 }).css({ opacity: 0 }).tween({ y: 0, opacity: 1 }, 1000, 'easeOutCubic', 3500 + i * 80));
        }

        function createLink(link) {
            links.push(self.initClass(NavLink, link));
        }
    }
}

class NavTitle extends Interface {

    constructor() {
        super('NavTitle');
        const self = this;
        let title, words;

        initHTML();

        function initHTML() {
            self.size('100%', 'auto');
            self.css({
                position: 'relative'
            });
            title = self.create('.title');
            title.size('100%', 'auto');
            title.fontStyle('Neue Haas Grotesk', 37, 'rgba(255, 255, 255, 0.9)');
            title.css({
                position: 'relative',
                fontWeight: 'bold',
                lineHeight: '1.1',
                marginBottom: 60
            });
            title.text('Hello, I’m Patrick, a Web 3.0 technologist based in Toronto, Canada.');
            words = title.split(' ');
            words.forEach((word, i) => {
                word.css({ overflow: 'hidden' });
                word = word.split(' ')[0];
                word.transform({ y: 50 }).tween({ y: 0 }, 1000, 'easeOutCubic', 500 + i * 80);
            });
        }
    }
}

class NavPage extends Interface {

    constructor() {
        super('NavPage');
        const self = this;
        let alienkitty;

        initHTML();
        initViews();
        addListeners();

        function initHTML() {
            self.size(Device.phone ? 'auto' : '55%').mouseEnabled(true);
            self.css({
                height: '',
                position: 'relative',
                display: 'block',
                marginLeft: Device.phone ? Config.UI_OFFSET - 5 : Config.UI_OFFSET,
                marginTop: Device.phone ? Config.UI_OFFSET : Config.UI_OFFSET - 5,
                marginRight: Device.phone ? Config.UI_OFFSET + 5 : 0
            });
        }

        function initViews() {
            self.initClass(NavTitle);
            self.initClass(NavLinks);
            alienkitty = self.initClass(AlienKitty);
            alienkitty.css({
                position: 'relative',
                marginTop: 60,
                marginBottom: 60
            });
            alienkitty.transformPoint(0, 0).transform({ scale: 0.8 });
            alienkitty.ready().then(alienkitty.animateIn);
        }

        function addListeners() {
            alienkitty.interact(null, click);
        }

        function click() {
            getURL('https://alienkitty.com/');
        }

        this.resize = () => {
        };

        this.animateIn = () => {
        };
    }
}

window.NavPage = NavPage;

class PageView extends Interface {

    constructor(data) {
        super('PageView');
        const self = this;
        let view;

        initHTML();
        initView();

        function initHTML() {
            self.size('100%', 'auto');
            self.css({
                position: 'relative',
                overflow: 'hidden'
            });
            self.bg('#111');
        }

        function initView() {
            view = self.initClass(window[data.view], data);
        }

        this.resize = () => {
            if (!data.overflow) this.size('100%', window.innerHeight < 520 ? 520 : window.innerHeight);
            if (view.resize) view.resize();
        };

        this.animateIn = () => {
            if (this.isVisible) return;
            this.isVisible = true;
            if (view.animateIn) view.animateIn();
        };
    }
}

class Page extends Interface {

    constructor(data) {
        super('Page');
        const self = this;
        let pages;

        initContainer();
        initViews();

        function initContainer() {
            self.size('100%');
            self.inner = self.create('.inner');
            self.inner.size('100%', 'auto');
            self.inner.css({
                position: 'relative',
                display: 'block'
            });
        }

        function initViews() {
            pages = [];
            for (let i = 0; i < data.config.length; i++) {
                if (data.overflow) data.config[i].overflow = data.overflow;
                const page = self.inner.initClass(PageView, data.config[i]);
                page.index = i;
                pages.push(page);
            }
            self.index = 0;
        }

        function checkPosition() {
            const scrollElement = document.scrollingElement || document.documentElement,
                scrolled = scrollElement.scrollTop + window.innerHeight;
            for (let i = 0; i < pages.length; i++) {
                const start = pages[i].element.offsetTop,
                    current = scrolled - start,
                    end = start + window.innerHeight * 2;
                if (scrolled > start && scrolled < end) {
                    const percent = current / (window.innerHeight * 2);
                    if (percent > 0.25 && percent < 0.75) {
                        if (!pages[i].isVisible) pages[i].animateIn();
                        self.index = i;
                    }
                }
            }
        }

        function loop() {
            checkPosition();
        }

        function checkHeight() {
            self.height = self.inner.element.offsetHeight;
            self.css({ height: self.height });
            let parent = self.parent;
            while (parent) {
                parent.css({ height: self.height });
                parent = parent.parent;
            }
        }

        this.resize = () => {
            for (let i = 0; i < pages.length; i++) pages[i].resize();
            defer(checkHeight);
        };

        this.change = e => {
            const scrollElement = document.scrollingElement || document.documentElement;
            TweenManager.tween(scrollElement, { scrollTop: pages[e.innerPage].element.offsetTop }, 700, 'wipe');
        };

        this.animateIn = (direction, init) => {
            defer(() => {
                checkHeight();
                const scrollElement = document.scrollingElement || document.documentElement;
                scrollElement.scrollTop = pages[this.index].element.offsetTop;
                pages[this.index].animateIn();
                if (!init) this.transform({ y: window.innerHeight * direction }).tween({ y: 0 }, 700, 'wipe');
                else this.css({ opacity: 0 }).tween({ opacity: 1 }, 400, 'easeOutCubic', () => this.clearOpacity());
                this.startRender(loop);
            });
        };

        this.animateOut = (direction, callback) => {
            this.tween({ opacity: 0 }, 400, 'easeInCubic');
            this.delayedCall(callback, 1000);
        };
    }
}

class Pages extends Interface {

    constructor() {
        super('Pages');
        const self = this;
        let page, next, data,
            direction = 1;

        initContainer();

        function initContainer() {
            self.size('100%');
            self.css({
                height: '',
                position: 'relative',
                display: 'block'
            });
        }

        function animateIn() {
            if (page) {
                page.animateOut(direction, () => {
                    page = page.destroy();
                    page = next;
                });
            } else {
                page = next;
            }
            next.animateIn(direction, data.init);
            data.init = false;
        }

        this.resize = () => {
            if (page) page.resize();
        };

        this.change = e => {
            data = e;
            direction = data.direction || direction;
            next = this.initClass(Page, data);
            if (page) page.setZ(1);
            next.setZ(5);
            next.resize();
            animateIn();
        };
    }
}

class Container extends Interface {

    static instance() {
        if (!this.singleton) this.singleton = new Container();
        return this.singleton;
    }

    constructor() {
        super('Container');
        const self = this;
        let pages;

        initContainer();
        initControllers();
        addListeners();

        function initContainer() {
            self.size('100%');
            self.css({
                height: '',
                position: 'relative',
                display: 'block'
            });
            Stage.add(self);
        }

        function initControllers() {
            pages = self.initClass(Pages);
        }

        function addListeners() {
            self.events.add(Events.RESIZE, resize);
            self.events.add(Events.PAGE_CHANGE, pageChange);
            resize();
        }

        function resize() {
            pages.resize();
        }

        function pageChange(e) {
            pages.change(e);
        }
    }
}

class AlienKitty extends Interface {

    constructor() {
        super('AlienKitty');
        const self = this;
        let alienkitty, eyelid1, eyelid2;

        initHTML();

        function initHTML() {
            self.size(90, 86).css({ opacity: 0, overflow: 'hidden' });
            alienkitty = self.create('.alienkitty').size(90, 86).transform({ y: 86 });
            eyelid1 = alienkitty.create('.eyelid1').size(24, 14).css({ left: 35, top: 25 }).transformPoint('50%', 0).transform({ scaleX: 1.5, scaleY: 0.01 });
            eyelid2 = alienkitty.create('.eyelid2').size(24, 14).css({ left: 53, top: 26 }).transformPoint(0, 0).transform({ scaleX: 1, scaleY: 0.01 });
        }

        function initImages() {
            return Promise.all([
                Assets.loadImage('assets/images/alienkitty.svg'),
                Assets.loadImage('assets/images/alienkitty_eyelid.svg')
            ]).then(finishSetup);
        }

        function finishSetup() {
            alienkitty.bg('assets/images/alienkitty.svg');
            eyelid1.bg('assets/images/alienkitty_eyelid.svg');
            eyelid2.bg('assets/images/alienkitty_eyelid.svg');
        }

        function blink() {
            self.delayedCall(Utils.headsTails(blink1, blink2), Utils.random(0, 10000));
        }

        function blink1() {
            eyelid1.tween({ scaleY: 1.5 }, 120, 'easeOutCubic', () => {
                eyelid1.tween({ scaleY: 0.01 }, 180, 'easeOutCubic');
            });
            eyelid2.tween({ scaleX: 1.3, scaleY: 1.3 }, 120, 'easeOutCubic', () => {
                eyelid2.tween({ scaleX: 1, scaleY: 0.01 }, 180, 'easeOutCubic', () => {
                    blink();
                });
            });
        }

        function blink2() {
            eyelid1.tween({ scaleY: 1.5 }, 120, 'easeOutCubic', () => {
                eyelid1.tween({ scaleY: 0.01 }, 180, 'easeOutCubic');
            });
            eyelid2.tween({ scaleX: 1.3, scaleY: 1.3 }, 180, 'easeOutCubic', () => {
                eyelid2.tween({ scaleX: 1, scaleY: 0.01 }, 240, 'easeOutCubic', () => {
                    blink();
                });
            });
        }

        this.animateIn = () => {
            blink();
            this.tween({ opacity: 1 }, 1000, 'easeOutSine');
            alienkitty.tween({ y: 0 }, 1000, 'easeOutCubic', 500);
        };

        this.animateOut = callback => {
            this.tween({ opacity: 0 }, 500, 'easeInOutQuad', () => {
                this.clearTimers();
                if (callback) callback();
            });
        };

        this.ready = initImages;
    }
}

class Loader extends Interface {

    constructor() {
        super('Loader');
        const self = this;
        let alienkitty;

        initHTML();
        initView();
        initLoader();

        function initHTML() {
            self.size('100%').mouseEnabled(false);
            self.css({
                position: 'fixed',
                left: 0,
                top: 0,
                overflow: 'hidden'
            });
            self.bg('#111');
        }

        function initView() {
            alienkitty = self.initClass(AlienKitty);
            alienkitty.center().css({ marginTop: -108 });
            alienkitty.ready().then(alienkitty.animateIn);
        }

        function initLoader() {
            Promise.all([
                FontLoader.loadFonts([
                    { font: 'Neue Haas Grotesk', style: 'normal', weight: 'normal' },
                    { font: 'Neue Haas Grotesk', style: 'normal', weight: 'bold' }
                ]),
                AssetLoader.loadAssets([`assets/data/config.json?${Utils.timestamp()}`])
            ]).then(loadComplete);
        }

        function loadComplete() {
            self.loaded = true;
            self.events.fire(Events.COMPLETE);
        }

        this.animateOut = callback => alienkitty.animateOut(callback);
    }
}

class Main {

    constructor() {
        let loader;

        initStage();
        initLoader();
        addListeners();

        function initStage() {
            Stage.size('100%');
            Stage.css({
                height: '',
                position: 'relative',
                display: 'block'
            });
            Stage.element.scrollParent = true;
        }

        function initLoader() {
            loader = Stage.initClass(Loader);
            Stage.events.add(loader, Events.COMPLETE, complete);
            Stage.delayedCall(init, 3000);
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
                loader.animateOut(() => {
                    loader = loader.destroy();
                    Container.instance();
                    Stage.events.fire(Events.PAGE_CHANGE, Config.PAGES[0]);
                });
            }
        }
    }
}

new Main();
