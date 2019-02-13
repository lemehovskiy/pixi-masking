require("./sass/style.scss");

require ("jquery");

require('../build/pixi-masking.js');
import * as PIXI from 'pixi.js'

$(document).ready(function () {
    $('.pixi-masking-demo').pixiMasking();

});