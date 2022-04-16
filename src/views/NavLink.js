import { Config } from '../config/Config.js';
import { Interface } from '../utils/Interface.js';
import { Stage } from '../utils/Stage.js';
import { NavLinkUnderline } from './NavLinkUnderline.js';

export class NavLink extends Interface {
    constructor(data) {
        super('.link');

        this.data = data;

        this.initHTML();
    }

    initHTML() {
        const data = this.data;

        this.css({
            position: 'relative',
            marginBottom: data.group ? 32 : 16
        });

        this.wrapper = new Interface('.wrapper');
        this.wrapper.css({
            position: 'relative',
            display: 'inline-block'
        });
        this.add(this.wrapper);

        if (data.group || data.title) {
            this.title = new Interface('.title');
            this.title.css({
                position: 'relative',
                fontWeight: '700',
                fontSize: data.group ? 19 : 14,
                lineHeight: '1.2em',
                color: data.group ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 1)',
                marginTop: 4,
                marginBottom: 4
            });
            this.title.html(data.group ? data.group : data.title);
            this.wrapper.add(this.title);
        }

        if (data.description) {
            this.description = new Interface('.description');
            this.description.css({
                position: 'relative',
                display: 'inline-block',
                fontWeight: '400',
                fontSize: !data.title ? 14 : 13,
                lineHeight: '1.5em',
                color: 'rgba(255, 255, 255, 1)'
            });
            this.description.html(data.description);
            this.wrapper.add(this.description);

            this.descriptionLinks = this.description.element.querySelectorAll('a');
            this.descriptionLinks.forEach(element => new NavLinkUnderline(element));

            if (data.link) {
                this.line = new Interface('.line');
                this.line.css({
                    position: 'relative',
                    display: 'inline-block',
                    fontWeight: '900'
                });
                this.line.html('&nbsp;&nbsp;&nbsp;&nbsp;—');
                this.description.add(this.line);

                this.wrapper.css({
                    cursor: 'pointer'
                });

                this.link = data.link;

                this.wrapper.element.addEventListener('mouseenter', this.onHover);
                this.wrapper.element.addEventListener('mouseleave', this.onHover);
                this.wrapper.element.addEventListener('click', this.onClick);
            }
        }
    }

    /**
     * Event handlers
     */

    onHover = ({ type }) => {
        this.line.tween({ x: type === 'mouseenter' ? 10 : 0 }, 200, 'easeOutCubic');
    };

    onClick = () => {
        open(this.link, '_self');
        //Stage.setPath(this.link);
    };

    /**
     * Public methods
     */

    resize = () => {
        if (this.data.link) {
            if (Stage.width < Config.BREAKPOINT) {
                this.line.css({
                    display: 'block'
                });
                this.line.html('—');
            } else {
                this.line.css({
                    display: 'inline-block'
                });
                this.line.html('&nbsp;&nbsp;&nbsp;&nbsp;—');
            }
        }
    };
}
