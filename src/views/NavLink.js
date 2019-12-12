import { Device, Interface } from '../../alien.js/src/Alien.js';

export class NavLink extends Interface {
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
                title.fontStyle('Inter', data.group ? 18.5 : 13.5, data.group ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 1)');
                title.css({
                    position: 'relative',
                    fontWeight: '700',
                    lineHeight: '1.2'
                });
                title.html(data.group ? data.group : data.title);
            }
            if (data.description) {
                description = container.create('.description');
                description.fontStyle('Inter', !data.title ? 13.5 : 12.5, 'rgba(255, 255, 255, 1)');
                description.css({
                    position: 'relative',
                    display: 'inline-block',
                    fontWeight: '400',
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
            open(e.object.link, '_self');
        }
    }
}
