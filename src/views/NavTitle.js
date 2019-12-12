import { Interface } from '../../alien.js/src/Alien.js';

export class NavTitle extends Interface {
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
            title.fontStyle('Inter', 37, 'rgba(255, 255, 255, 0.9)');
            title.css({
                position: 'relative',
                fontWeight: '700',
                lineHeight: '1.1',
                letterSpacing: -0.2,
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
