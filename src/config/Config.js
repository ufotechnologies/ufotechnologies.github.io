import { Device, Events } from '../../alien.js/src/Alien.js';

Config.UI_OFFSET = Device.phone ? 20 : 80;

Config.ASSETS = [
    'assets/js/lib/three.min.js'
];

Events.GLITCH_IN = 'glitch_in';
Events.GLITCH_OUT = 'glitch_out';
Events.GLITCH_LOADER = 'glitch_loader';
