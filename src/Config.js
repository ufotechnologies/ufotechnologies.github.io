/**
 * Patrick Schroen –– Web 3.0 technologist.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Events, Device, TweenManager } from '../alien.js/src/Alien';


Config.UI_OFFSET = Device.phone ? 20 : 80;

Config.ASSETS = [
    'assets/js/lib/three.min.js'
];

Config.PAGES = [
    {
        config: [
            { view: 'NavPage' },
            { view: 'GridPage' }
        ],
        overflow: true
    }
];

Events.PAGE_CHANGE = 'page_change';
Events.GLITCH_IN = 'glitch_in';
Events.GLITCH_OUT = 'glitch_out';

TweenManager.CSS_EASES.wipe = Device.mobile
    ? 'cubic-bezier(0.210, 0.280, 0.170, 1.000)'
    : 'cubic-bezier(0.410, 0.250, 0.080, 1.000)';
