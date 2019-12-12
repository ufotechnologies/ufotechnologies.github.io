import { Device, Interface } from '../../alien.js/src/Alien.js';

import { NavTitle } from './NavTitle.js';
import { NavLinks } from './NavLinks.js';

export class NavLayout extends Interface {
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
