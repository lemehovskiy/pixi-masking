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
            self.settings = $.extend(true, {
                bars: [{
                    width: 20,
                    from: 40,
                    to: 80
                }, {
                    width: 20,
                    from: 55,
                    to: 90
                }, {
                    width: 20,
                    from: 65,
                    to: 100
                }, {
                    width: 20,
                    from: 55,
                    to: 85
                }, {
                    width: 20,
                    from: 40,
                    to: 75
                }]

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
            };

            self.init();
        }

        _createClass(PixiMasking, [{
            key: 'init',
            value: function init() {
                var self = this;
                this.initBarConfig();

                var renderer = PIXI.autoDetectRenderer(this.state.canvas.width, this.state.canvas.height, { antialias: true, transparent: true });
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
                    self.state.bars.forEach(function (bar, index) {
                        thing.beginFill();
                        thing.moveTo(bar.left, 0);
                        thing.lineTo(bar.left + bar.width, 0);
                        thing.lineTo(bar.left + bar.width, bar.height);
                        thing.lineTo(bar.left, bar.height);
                        thing.endFill();
                    });

                    renderer.render(stage);
                    requestAnimationFrame(animate);
                }
            }
        }, {
            key: 'initBarConfig',
            value: function initBarConfig() {
                var self = this,
                    left = 0;

                self.settings.bars.forEach(function (bar, index) {
                    self.state.bars.push({
                        width: 0,
                        height: 0,
                        left: left
                    });

                    left += self.state.canvas.width / 100 * self.settings.bars[index].width;
                });

                self.updateBarConfig();

                self.state.isInit = true;
            }
        }, {
            key: 'updateBarConfig',
            value: function updateBarConfig() {
                var self = this;

                if (!this.state.isInit) return;

                self.settings.bars.forEach(function (bar, index) {
                    var fromHeight = bar.from,
                        toHeight = bar.to,
                        renderProgress = fromHeight + (toHeight - fromHeight) / 100 * self.state.progress;

                    self.state.bars[index].width = self.state.canvas.width / 100 * bar.width;
                    self.state.bars[index].height = self.state.canvas.height / 100 * renderProgress;
                });
            }
        }, {
            key: 'setProgress',
            value: function setProgress(progress) {
                this.state.progress = progress;
                this.updateBarConfig();
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