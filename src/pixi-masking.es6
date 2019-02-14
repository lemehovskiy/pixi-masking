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
            this.settings = $.extend(true, {
                background: null,
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

            }, options);

            this.$element = $(element);

            //extend by data options
            this.data_options = self.$element.data('pixi-masking');
            this.settings = $.extend(true, self.settings, self.data_options);

            if (this.settings.background === null) {
                throw new Error("No image defined");
            }

            this.state = {
                progress: 0,
                bars: [],
                isInit: false,
                backgroundImage: {},
                backgroundImageSizeOriginal: {
                    width: 0,
                    height: 0
                }
            }


            self.init();
        }

        init() {
            let self = this;

            self.renderer = PIXI.autoDetectRenderer(self.$element.outerWidth(), self.$element.outerHeight(), {
                antialias: true,
                transparent: true
            });

            self.initBarConfig();
            self.updateBarConfig();

            self.$element[0].appendChild(this.renderer.view);

            self.stage = new PIXI.Container();
            self.container = new PIXI.Container();

            self.backgroundImage = PIXI.Sprite.fromImage(self.settings.background);
            self.backgroundImage.texture.baseTexture.on('loaded', function () {
                self.state.backgroundImageSizeOriginal.width = self.backgroundImage.width;
                self.state.backgroundImageSizeOriginal.height = self.backgroundImage.height;

                self.onResize();
            });

            self.container.addChild(self.backgroundImage);
            self.stage.addChild(self.container);
            self.mask = new PIXI.Graphics();
            self.stage.addChild(self.mask);
            self.mask.position.x = 0;
            self.mask.position.y = 0;
            self.container.mask = self.mask;

            self.animate();

            $(window).on('resize', self.onResize.bind(this))
        }

        animate(){
            let self = this;

            self.mask.clear();
            self.state.bars.forEach((bar, index) => {
                self.mask.beginFill();
                self.mask.moveTo(bar.left, 0);
                self.mask.lineTo(bar.left + bar.width, 0);
                self.mask.lineTo(bar.left + bar.width, bar.height);
                self.mask.lineTo(bar.left, bar.height);
                self.mask.endFill();
            })


            self.renderer.render(self.stage);
            requestAnimationFrame(this.animate.bind(this));
        }

        initBarConfig() {
            let self = this;
            self.updateBarConfig();
            self.handleUpdateProgress();
            self.state.isInit = true;
        }

        updateBarConfig() {
            let self = this,
                left = 0;

            self.state.bars = [];

            self.settings.bars.forEach((bar, index) => {
                self.state.bars.push({
                    width: self.renderer.width / 100 * bar.width,
                    height: self.renderer.height / 100 * bar.from,
                    left: left
                })

                left += self.renderer.width / 100 * self.settings.bars[index].width;
            })
        }

        handleUpdateProgress() {
            let self = this;

            if (!this.state.isInit) return;

            self.settings.bars.forEach(function (bar, index) {
                let fromHeight = bar.from,
                    toHeight = bar.to,
                    renderProgress = fromHeight + (toHeight - fromHeight) / 100 * self.state.progress;

                TweenLite.to(self.state.bars[index], bar.duration, {height: self.renderer.height / 100 * renderProgress});

            })
        }


        setProgress(progress) {
            console.log('setProgress');
            this.state.progress = progress;
            this.handleUpdateProgress();
        }

        onResize() {
            let self = this;

            let elementWidth = self.$element.outerWidth(),
                elementHeight = self.$element.outerHeight();

            self.renderer.resize(elementWidth, elementHeight);

            self.updateBarConfig();

            self.backgroundImage.anchor.set(0.5);
            self.backgroundImage.x = self.renderer.width / 2;
            self.backgroundImage.y = self.renderer.height / 2;


            if (elementWidth / elementHeight > this.backgroundImage.width / this.backgroundImage.height) {
                self.backgroundImage.width = elementWidth;
                self.backgroundImage.height = elementWidth / self.state.backgroundImageSizeOriginal.width * self.state.backgroundImageSizeOriginal.height;
            } else {
                self.backgroundImage.width = elementHeight / self.state.backgroundImageSizeOriginal.height * self.state.backgroundImageSizeOriginal.width;
                self.backgroundImage.height = elementHeight;
            }
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