import { Config } from '../config/Config.js';
import { Interface } from '../utils/Interface.js';
import { Stage } from '../utils/Stage.js';
import { NavHeadline } from './NavHeadline.js';
import { NavLinks } from './NavLinks.js';

export class NavLayout extends Interface {
    constructor() {
        super('.nav');

        this.initHTML();
        this.initViews();
    }

    initHTML() {
        this.css({
            position: 'relative',
            width: '55%',
            marginLeft: 80,
            marginTop: 80 - 5,
            marginRight: 0,
            marginBottom: 80
        });
    }

    initViews() {
        this.headline = new NavHeadline();
        this.add(this.headline);

        this.links = new NavLinks();
        this.add(this.links);
    }

    /**
     * Public methods
     */

    resize = () => {
        if (Stage.width < Config.BREAKPOINT) {
            this.css({
                width: '',
                marginLeft: 20 - 5,
                marginTop: 20,
                marginRight: 20,
                marginBottom: 20
            });
        } else {
            this.css({
                width: '55%',
                marginLeft: 80,
                marginTop: 80 - 5,
                marginRight: 0,
                marginBottom: 80
            });
        }

        this.links.resize();
    };

    animateIn = () => {
        this.headline.animateIn();
        this.links.animateIn();
    };

    animateOut = () => {
    };
}
