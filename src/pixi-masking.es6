/*
 Version: 1.0.0
 Author: lemehovskiy
 Website: http://lemehovskiy.github.io
 Repo: https://github.com/lemehovskiy/pixi-masking
 */

'use strict';

(function ($) {

    class PixiMasking {

        constructor(element, options) {

            let self = this;
            
            //extend by function call
            self.settings = $.extend(true, {
               
                test_property: false
                
            }, options);

            self.$element = $(element);

            this.state = {
                progress: 0
            }


            self.init();
        }

        init() {
            let self = this;

            var renderer = PIXI.autoDetectRenderer(800, 600, { antialias: true});
            this.$element[0].appendChild(renderer.view);

// create the root of the scene graph
            var stage = new PIXI.Container();

            stage.interactive = true;

            var container = new PIXI.Container();
            container.position.x = renderer.width / 2;
            container.position.y = renderer.height / 2;

// add a bunch of sprites

            var light1 = PIXI.Sprite.fromImage('imgs/sample-img-4.jpg');
            light1.anchor.x = 0.5;
            light1.anchor.y = 0.5;
            container.addChild(light1);


            stage.addChild(container);

// let's create a moving shape
            var thing = new PIXI.Graphics();
            stage.addChild(thing);
            thing.position.x = 0;
            thing.position.y = 0;

            container.mask = thing;

            let height = 600;
            let width = 50;

            let fromHeight = 30;
            let toHeight= 90;


            animate();

            function animate()
            {
                let renderProgress = fromHeight + (toHeight - fromHeight) / 100 * self.state.progress;
                let renderHeight = height / 100 * renderProgress;

                thing.clear();

                thing.beginFill();
                thing.moveTo(0, 0);
                thing.lineTo(width, 0);
                thing.lineTo(width, renderHeight);
                thing.lineTo(0, renderHeight);
                thing.lineTo(0, 0);

                renderer.render(stage);
                requestAnimationFrame(animate);
            }

        }

        setProgress(progress){
            this.state.progress = progress;
        }
    }


    $.fn.pixiMasking = function() {
        let $this = this,
            opt = arguments[0],
            args = Array.prototype.slice.call(arguments, 1),
            length = $this.length,
            i,
            ret;
        for (i = 0; i < length; i++) {
            if (typeof opt == 'object' || typeof opt == 'undefined')
                $this[i].pixi_masking = new PixiMasking($this[i], opt);
        else
            ret = $this[i].pixi_masking[opt].apply($this[i].pixi_masking, args);
            if (typeof ret != 'undefined') return ret;
        }
        return $this;
    };

})(jQuery);