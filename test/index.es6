require("./sass/style.scss");

require("jquery");

require('../build/pixi-masking.js');
import * as PIXI from 'pixi.js'
import {TweenLite} from 'gsap';

require('./scroller');

$(window).on('load', function(){
    $('.pixi-masking-demo').pixiMasking({
        bars: [
            {
                width: 20,
                from: 20,
                to: 60,
                duration: 1.8
            },
            {
                width: 20,
                from: 20,
                to: 80,
                duration: 2.2
            },
            {
                width: 20,
                from: 20,
                to: 100,
                duration: 3
            },
            {
                width: 20,
                from: 20,
                to: 75,
                duration: 2.2
            },
            {
                width: 20,
                from: 20,
                to: 65,
                duration: 1.6
            }
        ]
    });


    $('.pixi-masking-demo').on('visible.scroller progress.scroller', function (element, progress) {
        console.log(progress);
        $(this).pixiMasking('setProgress', progress);

    });

    $('.pixi-masking-demo').scroller();
})