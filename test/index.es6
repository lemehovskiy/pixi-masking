require("./sass/style.scss");

require ("jquery");

require('../build/pixi-masking.js');
import * as PIXI from 'pixi.js'

require('./scroller');

$(document).ready(function () {
    $('.pixi-masking-demo').pixiMasking();



    $('.pixi-masking-demo').on('progress.scroller', function(element, progress){
        $('.pixi-masking-demo').pixiMasking('setProgress', progress);

    });

    $('.pixi-masking-demo').scroller();

});