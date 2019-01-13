/**
 * Patrick Schroen — Web 3.0 technologist.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import * as THREE from 'three';

import { Events, Stage, Interface, Component, Canvas, CanvasGraphics, CanvasTexture, Device, Utils,
    Assets, AssetLoader, FontLoader, Shader, Effects } from '../alien.js/src/Alien.js';

import vertBasicShader from './shaders/basic_shader.vert';
import fragBasicShader from './shaders/basic_shader.frag';
import vertBadTV from './shaders/post/badtv.vert';
import fragBadTV from './shaders/post/badtv.frag';
import vertRGB from './shaders/post/rgb.vert';
import fragRGB from './shaders/post/rgb.frag';

Config.UI_OFFSET = Device.phone ? 20 : 80;

Config.ASSETS = [
    'assets/js/lib/three.min.js'
];

Events.GLITCH_IN = 'glitch_in';
Events.GLITCH_OUT = 'glitch_out';
Events.GLITCH_LOADER = 'glitch_loader';


class GridLayout extends Interface {

    constructor() {
        super('GridLayout');
        const self = this;
        let pos = 0,
            last = 0,
            delta = 0;

        initHTML();
        this.startRender(loop);

        function initHTML() {
            self.css({
                position: 'relative'
            });
        }

        function checkPosition() {
            const scrollElement = document.scrollingElement || document.documentElement,
                scrolled = scrollElement.scrollTop + window.innerHeight;
            pos = scrollElement.scrollTop;
            delta = pos - last;
            last = pos;
            const start = self.element.offsetTop,
                current = scrolled - start,
                end = start + window.innerHeight * 2;
            if (scrolled > start && scrolled < end) {
                const percent = current / (window.innerHeight * 2);
                if (percent > 0.25 && percent < 0.75) {
                    if (!self.animatedIn) {
                        self.animatedIn = true;
                        self.animateIn(delta);
                    }
                } else {
                    if (self.animatedIn) {
                        self.animatedIn = false;
                        self.animateOut(delta);
                    }
                }
            }
        }

        function loop() {
            checkPosition();
        }

        this.resize = () => {
            this.size('100%', window.innerHeight);
        };

        this.animateIn = delta => {
            this.events.fire(Events.GLITCH_IN, delta);
        };

        this.animateOut = delta => {
            this.events.fire(Events.GLITCH_OUT, delta);
        };
    }
}

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
            self.size('100%', 'auto');
            self.css({
                position: 'relative'
            });
        }

        function initLinks() {
            Config.DATA.forEach(createLink);
            links.forEach(link => {
                link.transform({ y: 50 }).css({ opacity: 0 });
            });
        }

        function createLink(link) {
            links.push(self.initClass(NavLink, link));
        }

        this.animateIn = () => {
            links.forEach((link, i) => {
                link.tween({ y: 0, opacity: 1 }, 1000, 'easeOutCubic', 3500 + i * 80);
            });
        };
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
            words.forEach(word => {
                word.css({ overflow: 'hidden' });
                word.inner = word.split(' ')[0];
                word.inner.transform({ y: 50 });
            });
        }

        this.animateIn = () => {
            words.forEach((word, i) => {
                word.inner.tween({ y: 0 }, 1000, 'easeOutCubic', 500 + i * 80);
            });
        };
    }
}

class NavLayout extends Interface {

    constructor() {
        super('NavLayout');
        const self = this;
        let title, links;

        initHTML();
        initViews();

        function initHTML() {
            self.size(Device.phone ? 'auto' : '55%', 'auto');
            self.css({
                position: 'relative',
                marginTop: Device.phone ? Config.UI_OFFSET : Config.UI_OFFSET - 5,
                marginLeft: Device.phone ? Config.UI_OFFSET - 5 : Config.UI_OFFSET,
                marginRight: Device.phone ? Config.UI_OFFSET + 5 : 0,
                marginBottom: Config.UI_OFFSET
            });
        }

        function initViews() {
            title = self.initClass(NavTitle);
            links = self.initClass(NavLinks);
        }

        this.resize = () => {
        };

        this.animateIn = () => {
            title.animateIn();
            links.animateIn();
        };

        this.animateOut = () => {
        };
    }
}

class CanvasGridTexture extends Component {

    constructor() {
        super();
        const self = this;
        let canvas, fill, dots, alienkitty, alienkittygraphics, texture, timeout;

        this.needsUpdate = false;

        initCanvas();
        initFill();
        initDots();
        initAlienKitty();

        function initCanvas() {
            canvas = self.initClass(Canvas, window.innerWidth, window.innerHeight, true, true);
            self.canvas = canvas;
            texture = new THREE.Texture(canvas.element);
            texture.minFilter = texture.magFilter = THREE.LinearFilter;
            texture.generateMipmaps = false;
            self.texture = texture;
        }

        function initFill() {
            fill = self.initClass(CanvasGraphics);
            fill.fillStyle = '#111';
            canvas.add(fill);
        }

        function initDots() {
            dots = self.initClass(CanvasGraphics);
            dots.fillStyle = 'rgba(255, 255, 255, 0.1)';
            canvas.add(dots);
        }

        function initAlienKitty() {
            alienkitty = self.initClass(AlienKittyCanvas);
            self.alienkitty = alienkitty;
            alienkittygraphics = self.initClass(CanvasTexture, alienkitty.element, 90, 86);
            alienkittygraphics.opacity = 1;
            canvas.add(alienkittygraphics);
        }

        function drawFill() {
            fill.clear();
            fill.fillRect(0, 0, canvas.width, canvas.height);
        }

        function drawDots() {
            dots.clear();
            const size = canvas.height / 10;
            for (let j = 0; j < 10; j++) {
                for (let i = 0; i < canvas.width / 10; i++) {
                    dots.beginPath();
                    dots.arc(size * (i + 0.5), size * (j + 0.5), 2.5 / Math.PI, 0, 2 * Math.PI, false);
                    dots.fill();
                }
            }
        }

        function drawAlienKitty() {
            alienkittygraphics.transform({ x: (canvas.width - alienkittygraphics.width) / 2, y: (canvas.height - alienkittygraphics.height) / 2 - 65 });
        }

        this.update = () => {
            canvas.size(window.innerWidth, window.innerHeight);
            drawFill();
            drawDots();
            drawAlienKitty();
            canvas.render();
            texture.needsUpdate = true;
        };

        this.showAlienKitty = time => {
            this.clearTimeout(timeout);
            this.needsUpdate = true;
            tween(alienkittygraphics, { opacity: 1 }, time, 'easeInOutExpo');
            timeout = this.delayedCall(() => this.needsUpdate = false, 500);
        };

        this.hideAlienKitty = () => {
            this.clearTimeout(timeout);
            this.needsUpdate = true;
            tween(alienkittygraphics, { opacity: 0 }, 250, 'easeOutSine');
            timeout = this.delayedCall(() => this.needsUpdate = false, 500);
        };

        this.animateIn = alienkitty.animateIn;

        this.ready = alienkitty.ready;
    }
}

class CanvasGrid extends Component {

    constructor() {
        super();
        const self = this;
        let grid, shader, mesh;

        this.object3D = new THREE.Object3D();

        initCanvasTexture();
        initMesh();

        function initCanvasTexture() {
            grid = self.initClass(CanvasGridTexture);
        }

        function initMesh() {
            self.object3D.visible = false;
            shader = self.initClass(Shader, vertBasicShader, fragBasicShader, {
                uTime: World.time,
                uResolution: World.resolution,
                uTexture: { value: grid.texture },
                uAlpha: { value: 0 },
                depthWrite: false,
                depthTest: false
            });
            mesh = new THREE.Mesh(World.quad, shader.material);
            self.object3D.add(mesh);
        }

        function loop() {
            if (!self.object3D.visible) return;
            if (grid.needsUpdate || grid.alienkitty.needsUpdate) {
                grid.canvas.render();
                grid.texture.needsUpdate = true;
            }
        }

        this.resize = () => {
            grid.update();
            mesh.scale.set(window.innerWidth, window.innerHeight, 1);
        };

        this.showAlienKitty = grid.showAlienKitty;

        this.hideAlienKitty = grid.hideAlienKitty;

        this.animateIn = () => {
            grid.update();
            grid.animateIn();
            grid.canvas.render();
            grid.texture.needsUpdate = true;
            this.startRender(loop);
            this.object3D.visible = true;
        };

        this.ready = grid.ready;
    }
}

class Scene extends Component {

    constructor() {
        super();
        const self = this;
        let grid;

        initViews();
        addListeners();

        function initViews() {
            grid = self.initClass(CanvasGrid);
            World.scene.add(grid.object3D);
        }

        function addListeners() {
            self.events.add(Events.GLITCH_IN, glitchIn);
            self.events.add(Events.GLITCH_OUT, glitchOut);
        }

        function glitchIn(delta = 0) {
            const time = Math.range(delta, 0, 400, 300, 50);
            grid.showAlienKitty(time);
        }

        function glitchOut() {
            grid.hideAlienKitty();
        }

        this.resize = grid.resize;

        this.animateIn = grid.animateIn;

        this.ready = grid.ready;
    }
}

class World extends Component {

    static instance() {
        if (!this.singleton) this.singleton = new World();
        return this.singleton;
    }

    constructor() {
        super();
        const self = this;
        const multiplier = Device.mobile ? 2 : 1;
        let renderer, scene, camera, effects, badtv, rgb, timeout;

        World.dpr = Math.min(2, Device.pixelRatio);

        initWorld();
        addListeners();
        this.startRender(loop);

        function initWorld() {
            renderer = new THREE.WebGLRenderer({ powerPreference: 'high-performance' });
            renderer.setPixelRatio(World.dpr);
            renderer.domElement.style.position = 'fixed';
            scene = new THREE.Scene();
            camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
            World.scene = scene;
            World.renderer = renderer;
            World.element = renderer.domElement;
            World.camera = camera;
            World.quad = new THREE.PlaneBufferGeometry(1, 1);
            World.time = { value: 0 };
            World.resolution = { value: new THREE.Vector2() };
            effects = self.initClass(Effects, Stage, {
                renderer,
                scene,
                camera,
                dpr: World.dpr
            });
            badtv = self.initClass(Shader, vertBadTV, fragBadTV, {
                uTime: World.time,
                uResolution: World.resolution,
                tDiffuse: { type: 't', value: null },
                uDistortion: { value: 0 },
                uDistortion2: { value: 0 },
                depthWrite: false,
                depthTest: false
            });
            rgb = self.initClass(Shader, vertRGB, fragRGB, {
                uTime: World.time,
                uResolution: World.resolution,
                tDiffuse: { type: 't', value: null },
                uDistortion: { value: 0 },
                depthWrite: false,
                depthTest: false
            });
            effects.add(badtv);
            effects.add(rgb);
            World.effects = effects;
        }

        function addListeners() {
            self.events.add(Events.RESIZE, resize);
            self.events.add(Events.GLITCH_IN, glitchIn);
            self.events.add(Events.GLITCH_OUT, glitchOut);
            self.events.add(Events.GLITCH_LOADER, glitchLoader);
            resize();
        }

        function resize() {
            renderer.setSize(window.innerWidth, window.innerHeight);
            effects.setSize(window.innerWidth, window.innerHeight);
            camera.left = -window.innerWidth / 2;
            camera.right = window.innerWidth / 2;
            camera.top = window.innerHeight / 2;
            camera.bottom = -window.innerHeight / 2;
            camera.updateProjectionMatrix();
            World.resolution.value.set(window.innerWidth * World.dpr, window.innerHeight * World.dpr);
        }

        function glitchIn(delta = 0) {
            const time = Math.range(delta, 0, 400, 300, 50);
            self.clearTimeout(timeout);
            World.effects.enabled = true;
            tween(badtv.uniforms.uDistortion, { value: Math.range(delta, 0, 400, 0, 8) * multiplier }, time, 'easeInOutExpo');
            tween(badtv.uniforms.uDistortion2, { value: Math.range(delta, 0, 400, 0, 2) * multiplier }, time, 'easeInOutExpo');
            tween(rgb.uniforms.uDistortion, { value: Math.range(delta, 0, 400, 0, 0.02) * multiplier }, time, 'easeInOutExpo');
            timeout = self.delayedCall(() => {
                tween(badtv.uniforms.uDistortion, { value: 1 * multiplier }, 300, 'easeInOutExpo');
                tween(badtv.uniforms.uDistortion2, { value: 1 * multiplier }, 300, 'easeInOutExpo');
                tween(rgb.uniforms.uDistortion, { value: 0.002 * multiplier }, 300, 'easeInOutExpo');
            }, time);
        }

        function glitchOut() {
            self.clearTimeout(timeout);
            tween(badtv.uniforms.uDistortion, { value: 0 }, 300, 'easeOutSine');
            tween(badtv.uniforms.uDistortion2, { value: 0 }, 300, 'easeOutSine');
            tween(rgb.uniforms.uDistortion, { value: 0 }, 300, 'easeOutSine');
            timeout = self.delayedCall(() => World.effects.enabled = false, 500);
        }

        function glitchLoader() {
            tween(badtv.uniforms.uDistortion, { value: 4 * multiplier }, 300, 'easeInOutExpo');
            tween(badtv.uniforms.uDistortion2, { value: 1 * multiplier }, 300, 'easeInOutExpo');
            tween(rgb.uniforms.uDistortion, { value: 0.01 * multiplier }, 300, 'easeInOutExpo');
            timeout = self.delayedCall(() => self.events.fire(Events.GLITCH_OUT), 500);
        }

        function loop(t, delta) {
            World.time.value += delta * 0.001;
            effects.render();
        }
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
        let scene, nav, grid;

        initContainer();
        initViews();
        addListeners();

        function initContainer() {
            self.size('100%', 'auto');
            Stage.add(self);
            World.instance();
            self.add(World);
        }

        function initViews() {
            scene = self.initClass(Scene);
            nav = self.initClass(NavLayout);
            grid = self.initClass(GridLayout);
            self.scene = scene;
            self.nav = nav;
        }

        function addListeners() {
            self.events.add(Events.RESIZE, resize);
            resize();
        }

        function resize() {
            scene.resize();
            nav.resize();
            grid.resize();
        }

        this.preload = scene.ready;
    }
}

class AlienKittyCanvas extends Component {

    constructor() {
        super();
        const self = this;
        let canvas, alienkitty, eyelid1, eyelid2;

        this.needsUpdate = false;

        initCanvas();
        initImages();

        function initCanvas() {
            canvas = self.initClass(Canvas, 90, 86, true, true);
            self.canvas = canvas;
            self.element = canvas.element;
        }

        function initImages() {
            return Promise.all([
                Assets.loadImage('assets/images/alienkitty.svg'),
                Assets.loadImage('assets/images/alienkitty_eyelid.svg')
            ]).then(finishSetup);
        }

        function finishSetup(img) {
            alienkitty = self.initClass(CanvasTexture, img[0], 90, 86);
            eyelid1 = self.initClass(CanvasTexture, img[1], 24, 14);
            eyelid1.transformPoint('50%', 0).transform({ x: 35, y: 25, scaleX: 1.5, scaleY: 0.01 });
            eyelid2 = self.initClass(CanvasTexture, img[1], 24, 14);
            eyelid2.transformPoint(0, 0).transform({ x: 53, y: 26, scaleX: 1, scaleY: 0.01 });
            alienkitty.add(eyelid1);
            alienkitty.add(eyelid2);
            canvas.add(alienkitty);
        }

        function blink() {
            self.delayedCall(Utils.headsTails(blink1, blink2), Utils.random(0, 10000));
        }

        function blink1() {
            self.needsUpdate = true;
            tween(eyelid1, { scaleY: 1.5 }, 120, 'easeOutCubic', () => {
                tween(eyelid1, { scaleY: 0.01 }, 180, 'easeOutCubic');
            });
            tween(eyelid2, { scaleX: 1.3, scaleY: 1.3 }, 120, 'easeOutCubic', () => {
                tween(eyelid2, { scaleX: 1, scaleY: 0.01 }, 180, 'easeOutCubic', () => {
                    self.needsUpdate = false;
                    blink();
                });
            });
        }

        function blink2() {
            self.needsUpdate = true;
            tween(eyelid1, { scaleY: 1.5 }, 120, 'easeOutCubic', () => {
                tween(eyelid1, { scaleY: 0.01 }, 180, 'easeOutCubic');
            });
            tween(eyelid2, { scaleX: 1.3, scaleY: 1.3 }, 180, 'easeOutCubic', () => {
                tween(eyelid2, { scaleX: 1, scaleY: 0.01 }, 240, 'easeOutCubic', () => {
                    self.needsUpdate = false;
                    blink();
                });
            });
        }

        function loop() {
            if (self.needsUpdate) canvas.render();
        }

        this.animateIn = () => {
            canvas.render();
            this.startRender(loop);
            blink();
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
                    { family: 'Neue Haas Grotesk', style: 'normal', weight: 'normal' },
                    { family: 'Neue Haas Grotesk', style: 'normal', weight: 'bold' }
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

class Main {

    constructor() {

        if (!Device.webgl) return window.location = 'fallback.html';

        let loader;

        initStage();
        initLoader();
        addListeners();

        function initStage() {
            Stage.allowScroll();
            Stage.css({ position: '', overflow: '' });
            window.history.scrollRestoration = 'manual';
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
                        Container.instance().nav.animateIn();
                    });
                    Stage.events.fire(Events.GLITCH_LOADER);
                }, 1000);
            }
        }
    }
}

new Main();
