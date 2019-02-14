(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 Version: 1.0.0
 Author: lemehovskiy
 Website: http://lemehovskiy.github.io
 Repo: https://github.com/lemehovskiy/pixi-masking
 */



var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function ($) {
    var PixiMasking = function () {
        function PixiMasking(element, options) {
            _classCallCheck(this, PixiMasking);

            var self = this;

            //extend by function call
            this.settings = $.extend(true, {
                background: null,
                bars: [{
                    width: 50,
                    from: 20,
                    to: 60,
                    duration: 1.8
                }, {
                    width: 50,
                    from: 20,
                    to: 80,
                    duration: 2.2
                }]

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
                backgroundImageSizeOriginal: {
                    width: 0,
                    height: 0
                }
            };

            self.init();
        }

        _createClass(PixiMasking, [{
            key: 'init',
            value: function init() {
                var self = this;

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
                self.state.animationStarted = false;
                self.handleUpdateProgress();

                console.log(this.state);

                $(window).on('resize', self.onResize.bind(this));
            }
        }, {
            key: 'animate',
            value: function animate() {
                var self = this;

                self.mask.clear();
                self.state.bars.forEach(function (bar, index) {
                    self.mask.beginFill();
                    self.mask.moveTo(bar.left, 0);
                    self.mask.lineTo(bar.left + bar.width, 0);
                    self.mask.lineTo(bar.left + bar.width, bar.height);
                    self.mask.lineTo(bar.left, bar.height);
                    self.mask.endFill();
                });

                self.renderer.render(self.stage);
                requestAnimationFrame(this.animate.bind(this));
            }
        }, {
            key: 'initBarConfig',
            value: function initBarConfig() {
                var self = this,
                    left = 0;
                self.settings.bars.forEach(function (bar, index) {
                    self.state.bars.push({
                        width: self.renderer.width / 100 * bar.width,
                        height: self.renderer.height / 100 * bar.from,
                        left: left
                    });

                    left += self.renderer.width / 100 * self.settings.bars[index].width;
                });
                self.state.isInit = true;
            }
        }, {
            key: 'updateBarConfig',
            value: function updateBarConfig() {
                var self = this,
                    left = 0;

                self.settings.bars.forEach(function (bar, index) {
                    self.state.bars[index].width = self.renderer.width / 100 * bar.width;
                    self.state.bars[index].height = self.renderer.height / 100 * bar.from;
                    self.state.bars[index].left = left;

                    left += self.renderer.width / 100 * self.settings.bars[index].width;
                });
            }
        }, {
            key: 'handleUpdateProgress',
            value: function handleUpdateProgress() {

                console.log('handleUpdateProgress');
                if (!this.state.isInit) return;

                var self = this;
                self.settings.bars.forEach(function (bar, index) {
                    var fromHeight = bar.from,
                        toHeight = bar.to,
                        renderProgress = fromHeight + (toHeight - fromHeight) / 100 * self.state.progress;

                    TweenLite.to(self.state.bars[index], bar.duration, { height: self.renderer.height / 100 * renderProgress });
                });
            }
        }, {
            key: 'setProgress',
            value: function setProgress(progress) {
                this.state.progress = progress;
                this.handleUpdateProgress();
            }
        }, {
            key: 'onResize',
            value: function onResize() {
                var self = this;

                var elementWidth = self.$element.outerWidth(),
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
        }]);

        return PixiMasking;
    }();

    $.fn.pixiMasking = function () {
        var $this = this,
            opt = arguments[0],
            args = Array.prototype.slice.call(arguments, 1),
            length = $this.length,
            i = void 0,
            ret = void 0;
        for (i = 0; i < length; i++) {
            if ((typeof opt === 'undefined' ? 'undefined' : _typeof(opt)) == 'object' || typeof opt == 'undefined') $this[i].pixi_masking = new PixiMasking($this[i], opt);else ret = $this[i].pixi_masking[opt].apply($this[i].pixi_masking, args);
            if (typeof ret != 'undefined') return ret;
        }
        return $this;
    };
})(jQuery);

/***/ })
/******/ ]);
});