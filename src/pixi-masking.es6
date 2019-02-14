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
                bars: [
                    {
                        width: 20,
                        from: 40,
                        to: 80
                    },
                    {
                        width: 20,
                        from: 55,
                        to: 90
                    },
                    {
                        width: 20,
                        from: 65,
                        to: 100
                    },
                    {
                        width: 20,
                        from: 55,
                        to: 85
                    },
                    {
                        width: 20,
                        from: 40,
                        to: 75
                    }
                ]

            }, options);

            self.$element = $(element);

            this.state = {
                canvas: {
                    width: 800,
                    height: 800
                },
                progress: 0,
                bars: [],
                isInit: false
            }

            self.init();
        }

        init() {
            let self = this;
            this.initBarConfig();

            var renderer = PIXI.autoDetectRenderer(this.state.canvas.width, this.state.canvas.height, {antialias: true, transparent: true});
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


            animate();


            function animate() {
                thing.clear();
                self.state.bars.forEach((bar, index) => {
                    thing.beginFill();
                    thing.moveTo(bar.left, 0);
                    thing.lineTo(bar.left + bar.width, 0);
                    thing.lineTo(bar.left + bar.width, bar.height);
                    thing.lineTo(bar.left, bar.height);
                    thing.endFill();
                })


                renderer.render(stage);
                requestAnimationFrame(animate);
            }

        }

        initBarConfig() {
            let self = this,
                left = 0;

            self.settings.bars.forEach((bar, index) => {
                self.state.bars.push({
                    width: 0,
                    height: 0,
                    left: left
                })

                left += self.state.canvas.width / 100 * self.settings.bars[index].width;
            })

            self.updateBarConfig();

            self.state.isInit = true;
        }

        updateBarConfig() {
            let self = this;

            if (!this.state.isInit) return;

            self.settings.bars.forEach(function (bar, index) {
                let fromHeight = bar.from,
                    toHeight = bar.to,
                    renderProgress = fromHeight + (toHeight - fromHeight) / 100 * self.state.progress;

                self.state.bars[index].width = self.state.canvas.width / 100 * bar.width;
                self.state.bars[index].height = self.state.canvas.height / 100 * renderProgress;

            })
        }

        setProgress(progress) {
            this.state.progress = progress;
            this.updateBarConfig();
        }
    }


    $.fn.pixiMasking = function () {
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