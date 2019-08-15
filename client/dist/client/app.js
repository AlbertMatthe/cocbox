/******/ (function(modules) { // webpackBootstrap
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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
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
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*!
built in 2018-2-7:20:17 version 2.2.10 by 司徒正美
https://github.com/RubyLouvre/avalon/tree/2.2.9
修复ms-for循环生成option与ms-deplex的联动问题
解决 IE8 html 属性中的中文被转成 unicode 字符串问题 
修复多个计算属性不更新的问题

*/(function (global, factory) {
    ( false ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : global.avalon = factory();
})(undefined, function () {
    'use strict';

    var win = (typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' ? window : (typeof global === 'undefined' ? 'undefined' : _typeof(global)) === 'object' ? global : {};

    var inBrowser = !!win.location && win.navigator;
    /* istanbul ignore if  */

    var document$1 = inBrowser ? win.document : {
        createElement: Object,
        createElementNS: Object,
        documentElement: 'xx',
        contains: Boolean
    };
    var root = inBrowser ? document$1.documentElement : {
        outerHTML: 'x'
    };

    var versions = {
        objectobject: 7, //IE7-8
        objectundefined: 6, //IE6
        undefinedfunction: NaN, // other modern browsers
        undefinedobject: NaN //Mobile Safari 8.0.0 (iOS 8.4.0) 
        //objectfunction chrome 47
    };
    /* istanbul ignore next  */
    var msie$1 = document$1.documentMode || versions[_typeof(document$1.all) + (typeof XMLHttpRequest === 'undefined' ? 'undefined' : _typeof(XMLHttpRequest))];

    var modern = /NaN|undefined/.test(msie$1) || msie$1 > 8;

    /*
     https://github.com/rsms/js-lru
     entry             entry             entry             entry        
     ______            ______            ______            ______       
     | head |.newer => |      |.newer => |      |.newer => | tail |      
     |  A   |          |  B   |          |  C   |          |  D   |      
     |______| <= older.|______| <= older.|______| <= older.|______|      
     
     removed  <--  <--  <--  <--  <--  <--  <--  <--  <--  <--  <--  added 
     */
    function Cache(maxLength) {
        // 标识当前缓存数组的大小
        this.size = 0;
        // 标识缓存数组能达到的最大长度
        this.limit = maxLength;
        //  head（最不常用的项），tail（最常用的项）全部初始化为undefined

        this.head = this.tail = void 0;
        this._keymap = {};
    }

    Cache.prototype = {
        put: function put(key, value) {
            var entry = {
                key: key,
                value: value
            };
            this._keymap[key] = entry;
            if (this.tail) {
                // 如果存在tail（缓存数组的长度不为0），将tail指向新的 entry
                this.tail.newer = entry;
                entry.older = this.tail;
            } else {
                // 如果缓存数组的长度为0，将head指向新的entry
                this.head = entry;
            }
            this.tail = entry;
            // 如果缓存数组达到上限，则先删除 head 指向的缓存对象
            /* istanbul ignore if */
            if (this.size === this.limit) {
                this.shift();
            } else {
                this.size++;
            }
            return value;
        },
        shift: function shift() {
            /* istanbul ignore next */
            var entry = this.head;
            /* istanbul ignore if */
            if (entry) {
                // 删除 head ，并改变指向
                this.head = this.head.newer;
                // 同步更新 _keymap 里面的属性值
                this.head.older = entry.newer = entry.older = this._keymap[entry.key] = void 0;
                delete this._keymap[entry.key]; //#1029
                // 同步更新 缓存数组的长度
                this.size--;
            }
        },
        get: function get(key) {
            var entry = this._keymap[key];
            // 如果查找不到含有`key`这个属性的缓存对象
            if (entry === void 0) return;
            // 如果查找到的缓存对象已经是 tail (最近使用过的)
            /* istanbul ignore if */
            if (entry === this.tail) {
                return entry.value;
            }
            // HEAD--------------TAIL
            //   <.older   .newer>
            //  <--- add direction --
            //   A  B  C  <D>  E
            if (entry.newer) {
                // 处理 newer 指向
                if (entry === this.head) {
                    // 如果查找到的缓存对象是 head (最近最少使用过的)
                    // 则将 head 指向原 head 的 newer 所指向的缓存对象
                    this.head = entry.newer;
                }
                // 将所查找的缓存对象的下一级的 older 指向所查找的缓存对象的older所指向的值
                // 例如：A B C D E
                // 如果查找到的是D，那么将E指向C，不再指向D
                entry.newer.older = entry.older; // C <-- E.
            }
            if (entry.older) {
                // 处理 older 指向
                // 如果查找到的是D，那么C指向E，不再指向D
                entry.older.newer = entry.newer; // C. --> E
            }
            // 处理所查找到的对象的 newer 以及 older 指向
            entry.newer = void 0; // D --x
            // older指向之前使用过的变量，即D指向E
            entry.older = this.tail; // D. --> E
            if (this.tail) {
                // 将E的newer指向D
                this.tail.newer = entry; // E. <-- D
            }
            // 改变 tail 为D 
            this.tail = entry;
            return entry.value;
        }
    };

    var delayCompile = {};

    var directives = {};

    function directive(name, opts) {
        if (directives[name]) {
            avalon.warn(name, 'directive have defined! ');
        }
        directives[name] = opts;
        if (!opts.update) {
            opts.update = function () {};
        }
        if (opts.delay) {
            delayCompile[name] = 1;
        }
        return opts;
    }

    function delayCompileNodes(dirs) {
        for (var i in delayCompile) {
            if ('ms-' + i in dirs) {
                return true;
            }
        }
    }

    var window$1 = win;
    function avalon(el) {
        return new avalon.init(el);
    }

    avalon.init = function (el) {
        this[0] = this.element = el;
    };

    avalon.fn = avalon.prototype = avalon.init.prototype;

    function shadowCopy(destination, source) {
        for (var property in source) {
            destination[property] = source[property];
        }
        return destination;
    }
    var rword = /[^, ]+/g;
    var rnowhite = /\S+/g; //存在非空字符
    var platform = {}; //用于放置平台差异的方法与属性


    function oneObject(array, val) {
        if (typeof array === 'string') {
            array = array.match(rword) || [];
        }
        var result = {},
            value = val !== void 0 ? val : 1;
        for (var i = 0, n = array.length; i < n; i++) {
            result[array[i]] = value;
        }
        return result;
    }

    var op = Object.prototype;
    function quote(str) {
        return avalon._quote(str);
    }
    var inspect = op.toString;
    var ohasOwn = op.hasOwnProperty;
    var ap = Array.prototype;

    var hasConsole = (typeof console === 'undefined' ? 'undefined' : _typeof(console)) === 'object';
    avalon.config = { debug: true };
    function log() {
        if (hasConsole && avalon.config.debug) {
            Function.apply.call(console.log, console, arguments);
        }
    }
    function warn() {
        if (hasConsole && avalon.config.debug) {
            var method = console.warn || console.log;
            // http://qiang106.iteye.com/blog/1721425
            Function.apply.call(method, console, arguments);
        }
    }
    function error(str, e) {
        throw (e || Error)(str);
    }
    function noop() {}
    function isObject(a) {
        return a !== null && (typeof a === 'undefined' ? 'undefined' : _typeof(a)) === 'object';
    }

    function range(start, end, step) {
        // 用于生成整数数组
        step || (step = 1);
        if (end == null) {
            end = start || 0;
            start = 0;
        }
        var index = -1,
            length = Math.max(0, Math.ceil((end - start) / step)),
            result = new Array(length);
        while (++index < length) {
            result[index] = start;
            start += step;
        }
        return result;
    }

    var rhyphen = /([a-z\d])([A-Z]+)/g;
    function hyphen(target) {
        //转换为连字符线风格
        return target.replace(rhyphen, '$1-$2').toLowerCase();
    }

    var rcamelize = /[-_][^-_]/g;
    function camelize(target) {
        //提前判断，提高getStyle等的效率
        if (!target || target.indexOf('-') < 0 && target.indexOf('_') < 0) {
            return target;
        }
        //转换为驼峰风格
        return target.replace(rcamelize, function (match) {
            return match.charAt(1).toUpperCase();
        });
    }

    var _slice = ap.slice;
    function slice(nodes, start, end) {
        return _slice.call(nodes, start, end);
    }

    var rhashcode = /\d\.\d{4}/;
    //生成UUID http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
    function makeHashCode(prefix) {
        /* istanbul ignore next*/
        prefix = prefix || 'avalon';
        /* istanbul ignore next*/
        return String(Math.random() + Math.random()).replace(rhashcode, prefix);
    }
    //生成事件回调的UUID(用户通过ms-on指令)
    function getLongID(fn) {
        /* istanbul ignore next */
        return fn.uuid || (fn.uuid = makeHashCode('e'));
    }
    var UUID = 1;
    //生成事件回调的UUID(用户通过avalon.bind)
    function getShortID(fn) {
        /* istanbul ignore next */
        return fn.uuid || (fn.uuid = '_' + ++UUID);
    }

    var rescape = /[-.*+?^${}()|[\]\/\\]/g;
    function escapeRegExp(target) {
        //http://stevenlevithan.com/regex/xregexp/
        //将字符串安全格式化为正则表达式的源码
        return (target + '').replace(rescape, '\\$&');
    }

    var eventHooks = {};
    var eventListeners = {};
    var validators = {};
    var cssHooks = {};

    window$1.avalon = avalon;

    function createFragment() {
        /* istanbul ignore next  */
        return document$1.createDocumentFragment();
    }

    var rentities = /&[a-z0-9#]{2,10};/;
    var temp = document$1.createElement('div');
    shadowCopy(avalon, {
        Array: {
            merge: function merge(target, other) {
                //合并两个数组 avalon2新增
                target.push.apply(target, other);
            },
            ensure: function ensure(target, item) {
                //只有当前数组不存在此元素时只添加它
                if (target.indexOf(item) === -1) {
                    return target.push(item);
                }
            },
            removeAt: function removeAt(target, index) {
                //移除数组中指定位置的元素，返回布尔表示成功与否
                return !!target.splice(index, 1).length;
            },
            remove: function remove(target, item) {
                //移除数组中第一个匹配传参的那个元素，返回布尔表示成功与否
                var index = target.indexOf(item);
                if (~index) return avalon.Array.removeAt(target, index);
                return false;
            }
        },
        evaluatorPool: new Cache(888),
        parsers: {
            number: function number(a) {
                return a === '' ? '' : parseFloat(a) || 0;
            },
            string: function string(a) {
                return a === null || a === void 0 ? '' : a + '';
            },
            "boolean": function boolean(a) {
                if (a === '') return a;
                return a === 'true' || a === '1';
            }
        },
        _decode: function _decode(str) {
            if (rentities.test(str)) {
                temp.innerHTML = str;
                return temp.innerText || temp.textContent;
            }
            return str;
        }
    });

    //============== config ============
    function config(settings) {
        for (var p in settings) {
            var val = settings[p];
            if (typeof config.plugins[p] === 'function') {
                config.plugins[p](val);
            } else {
                config[p] = val;
            }
        }
        return this;
    }

    var plugins = {
        interpolate: function interpolate(array) {
            var openTag = array[0];
            var closeTag = array[1];
            if (openTag === closeTag) {
                throw new SyntaxError('interpolate openTag cannot equal to closeTag');
            }
            var str = openTag + 'test' + closeTag;

            if (/[<>]/.test(str)) {
                throw new SyntaxError('interpolate cannot contains "<" or ">"');
            }

            config.openTag = openTag;
            config.closeTag = closeTag;
            var o = escapeRegExp(openTag);
            var c = escapeRegExp(closeTag);

            config.rtext = new RegExp(o + '(.+?)' + c, 'g');
            config.rexpr = new RegExp(o + '([\\s\\S]*)' + c);
        }
    };
    function createAnchor(nodeValue) {
        return document$1.createComment(nodeValue);
    }
    config.plugins = plugins;
    config({
        interpolate: ['{{', '}}'],
        debug: true
    });
    //============  config ============

    shadowCopy(avalon, {
        shadowCopy: shadowCopy,

        oneObject: oneObject,
        inspect: inspect,
        ohasOwn: ohasOwn,
        rword: rword,
        version: "2.2.10",
        vmodels: {},

        directives: directives,
        directive: directive,

        eventHooks: eventHooks,
        eventListeners: eventListeners,
        validators: validators,
        cssHooks: cssHooks,

        log: log,
        noop: noop,
        warn: warn,
        error: error,
        config: config,

        modern: modern,
        msie: msie$1,
        root: root,
        document: document$1,
        window: window$1,
        inBrowser: inBrowser,

        isObject: isObject,
        range: range,
        slice: slice,
        hyphen: hyphen,
        camelize: camelize,
        escapeRegExp: escapeRegExp,
        quote: quote,

        makeHashCode: makeHashCode

    });

    /**
     * 此模块用于修复语言的底层缺陷
     */
    function isNative(fn) {
        return (/\[native code\]/.test(fn)
        );
    }

    /* istanbul ignore if*/
    if (!isNative('司徒正美'.trim)) {
        var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
        String.prototype.trim = function () {
            return this.replace(rtrim, '');
        };
    }
    if (!Object.create) {
        Object.create = function () {
            function F() {}

            return function (o) {
                if (arguments.length != 1) {
                    throw new Error('Object.create implementation only accepts one parameter.');
                }
                F.prototype = o;
                return new F();
            };
        }();
    }
    var hasDontEnumBug = !{
        'toString': null
    }.propertyIsEnumerable('toString');
    var hasProtoEnumBug = function () {}.propertyIsEnumerable('prototype');
    var dontEnums = ['toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor'];
    var dontEnumsLength = dontEnums.length;
    /* istanbul ignore if*/
    if (!isNative(Object.keys)) {
        Object.keys = function (object) {
            //ecma262v5 15.2.3.14
            var theKeys = [];
            var skipProto = hasProtoEnumBug && typeof object === 'function';
            if (typeof object === 'string' || object && object.callee) {
                for (var i = 0; i < object.length; ++i) {
                    theKeys.push(String(i));
                }
            } else {
                for (var name in object) {
                    if (!(skipProto && name === 'prototype') && ohasOwn.call(object, name)) {
                        theKeys.push(String(name));
                    }
                }
            }

            if (hasDontEnumBug) {
                var ctor = object.constructor,
                    skipConstructor = ctor && ctor.prototype === object;
                for (var j = 0; j < dontEnumsLength; j++) {
                    var dontEnum = dontEnums[j];
                    if (!(skipConstructor && dontEnum === 'constructor') && ohasOwn.call(object, dontEnum)) {
                        theKeys.push(dontEnum);
                    }
                }
            }
            return theKeys;
        };
    }
    /* istanbul ignore if*/
    if (!isNative(Array.isArray)) {
        Array.isArray = function (a) {
            return Object.prototype.toString.call(a) === '[object Array]';
        };
    }

    /* istanbul ignore if*/
    if (!isNative(isNative.bind)) {
        /* istanbul ignore next*/
        Function.prototype.bind = function (scope) {
            if (arguments.length < 2 && scope === void 0) return this;
            var fn = this,
                argv = arguments;
            return function () {
                var args = [],
                    i;
                for (i = 1; i < argv.length; i++) {
                    args.push(argv[i]);
                }for (i = 0; i < arguments.length; i++) {
                    args.push(arguments[i]);
                }return fn.apply(scope, args);
            };
        };
    }
    //https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/slice
    /**
     * Shim for "fixing" IE's lack of support (IE < 9) for applying slice
     * on host objects like NamedNodeMap, NodeList, and HTMLCollection
     * (technically, since host objects have been implementation-dependent,
     * at least before ES6, IE hasn't needed to work this way).
     * Also works on strings, fixes IE < 9 to allow an explicit undefined
     * for the 2nd argument (as in Firefox), and prevents errors when
     * called on other DOM objects.
     */

    try {
        // Can't be used with DOM elements in IE < 9
        _slice.call(avalon.document.documentElement);
    } catch (e) {
        // Fails in IE < 9
        // This will work for genuine arrays, array-like objects,
        // NamedNodeMap (attributes, entities, notations),
        // NodeList (e.g., getElementsByTagName), HTMLCollection (e.g., childNodes),
        // and will not fail on other DOM objects (as do DOM elements in IE < 9)
        /* istanbul ignore next*/
        ap.slice = function (begin, end) {
            // IE < 9 gets unhappy with an undefined end argument
            end = typeof end !== 'undefined' ? end : this.length;

            // For native Array objects, we use the native slice function
            if (Array.isArray(this)) {
                return _slice.call(this, begin, end);
            }

            // For array like object we handle it ourselves.
            var i,
                cloned = [],
                size,
                len = this.length;

            // Handle negative value for "begin"
            var start = begin || 0;
            start = start >= 0 ? start : len + start;

            // Handle negative value for "end"
            var upTo = end ? end : len;
            if (end < 0) {
                upTo = len + end;
            }

            // Actual expected size of the slice
            size = upTo - start;

            if (size > 0) {
                cloned = new Array(size);
                if (this.charAt) {
                    for (i = 0; i < size; i++) {
                        cloned[i] = this.charAt(start + i);
                    }
                } else {
                    for (i = 0; i < size; i++) {
                        cloned[i] = this[start + i];
                    }
                }
            }

            return cloned;
        };
    }
    /* istanbul ignore next*/
    function iterator(vars, body, ret) {
        var fun = 'for(var ' + vars + 'i=0,n = this.length; i < n; i++){' + body.replace('_', '((i in this) && fn.call(scope,this[i],i,this))') + '}' + ret;
        /* jshint ignore:start */
        return Function('fn,scope', fun);
        /* jshint ignore:end */
    }
    /* istanbul ignore if*/
    if (!isNative(ap.map)) {
        avalon.shadowCopy(ap, {
            //定位操作，返回数组中第一个等于给定参数的元素的索引值。
            indexOf: function indexOf(item, index) {
                var n = this.length,
                    i = ~~index;
                if (i < 0) i += n;
                for (; i < n; i++) {
                    if (this[i] === item) return i;
                }return -1;
            },
            //定位操作，同上，不过是从后遍历。
            lastIndexOf: function lastIndexOf(item, index) {
                var n = this.length,
                    i = index == null ? n - 1 : index;
                if (i < 0) i = Math.max(0, n + i);
                for (; i >= 0; i--) {
                    if (this[i] === item) return i;
                }return -1;
            },
            //迭代操作，将数组的元素挨个儿传入一个函数中执行。Prototype.js的对应名字为each。
            forEach: iterator('', '_', ''),
            //迭代类 在数组中的每个项上运行一个函数，如果此函数的值为真，则此元素作为新数组的元素收集起来，并返回新数组
            filter: iterator('r=[],j=0,', 'if(_)r[j++]=this[i]', 'return r'),
            //收集操作，将数组的元素挨个儿传入一个函数中执行，然后把它们的返回值组成一个新数组返回。Prototype.js的对应名字为collect。
            map: iterator('r=[],', 'r[i]=_', 'return r'),
            //只要数组中有一个元素满足条件（放进给定函数返回true），那么它就返回true。Prototype.js的对应名字为any。
            some: iterator('', 'if(_)return true', 'return false'),
            //只有数组中的元素都满足条件（放进给定函数返回true），它才返回true。Prototype.js的对应名字为all。
            every: iterator('', 'if(!_)return false', 'return true')
        });
    }

    //这里放置存在异议的方法
    var compaceQuote = function () {
        //https://github.com/bestiejs/json3/blob/master/lib/json3.js
        var Escapes = {
            92: "\\\\",
            34: '\\"',
            8: "\\b",
            12: "\\f",
            10: "\\n",
            13: "\\r",
            9: "\\t"
        };

        var leadingZeroes = '000000';
        var toPaddedString = function toPaddedString(width, value) {
            return (leadingZeroes + (value || 0)).slice(-width);
        };
        var unicodePrefix = '\\u00';
        var escapeChar = function escapeChar(character) {
            var charCode = character.charCodeAt(0),
                escaped = Escapes[charCode];
            if (escaped) {
                return escaped;
            }
            return unicodePrefix + toPaddedString(2, charCode.toString(16));
        };
        var reEscape = /[\x00-\x1f\x22\x5c]/g;
        return function (value) {
            /* istanbul ignore next */
            reEscape.lastIndex = 0;
            /* istanbul ignore next */
            return '"' + (reEscape.test(value) ? String(value).replace(reEscape, escapeChar) : value) + '"';
        };
    }();
    try {
        avalon._quote = msie <= 8 ? compaceQuote : JSON.stringify;
    } catch (e) {
        /* istanbul ignore next  */
        avalon._quote = compaceQuote;
    }

    var class2type = {};
    'Boolean Number String Function Array Date RegExp Object Error'.replace(avalon.rword, function (name) {
        class2type['[object ' + name + ']'] = name.toLowerCase();
    });

    avalon.type = function (obj) {
        //取得目标的类型
        if (obj == null) {
            return String(obj);
        }
        // 早期的webkit内核浏览器实现了已废弃的ecma262v4标准，可以将正则字面量当作函数使用，因此typeof在判定正则时会返回function
        return (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' || typeof obj === 'function' ? class2type[inspect.call(obj)] || 'object' : typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
    };

    var rfunction = /^\s*\bfunction\b/;

    avalon.isFunction = /* istanbul ignore if */(typeof alert === 'undefined' ? 'undefined' : _typeof(alert)) === 'object' ? function (fn) {
        /* istanbul ignore next */
        try {
            /* istanbul ignore next */
            return rfunction.test(fn + '');
        } catch (e) {
            /* istanbul ignore next */
            return false;
        }
    } : function (fn) {
        return inspect.call(fn) === '[object Function]';
    };

    // 利用IE678 window == document为true,document == window竟然为false的神奇特性
    // 标准浏览器及IE9，IE10等使用 正则检测
    /* istanbul ignore next */
    function isWindowCompact(obj) {
        if (!obj) {
            return false;
        }
        return obj == obj.document && obj.document != obj; //jshint ignore:line
    }

    var rwindow = /^\[object (?:Window|DOMWindow|global)\]$/;

    function isWindowModern(obj) {
        return rwindow.test(inspect.call(obj));
    }

    avalon.isWindow = isWindowModern(avalon.window) ? isWindowModern : isWindowCompact;

    var enu;
    var enumerateBUG;
    for (enu in avalon({})) {
        break;
    }

    enumerateBUG = enu !== '0'; //IE6下为true, 其他为false

    /*判定是否是一个朴素的javascript对象（Object），不是DOM对象，不是BOM对象，不是自定义类的实例*/
    /* istanbul ignore next */
    function isPlainObjectCompact(obj, key) {
        if (!obj || avalon.type(obj) !== 'object' || obj.nodeType || avalon.isWindow(obj)) {
            return false;
        }
        try {
            //IE内置对象没有constructor
            if (obj.constructor && !ohasOwn.call(obj, 'constructor') && !ohasOwn.call(obj.constructor.prototype, 'isPrototypeOf')) {
                return false;
            }
            var isVBscript = obj.$vbthis;
        } catch (e) {
            //IE8 9会在这里抛错
            return false;
        }
        /* istanbul ignore if */
        if (enumerateBUG) {
            for (key in obj) {
                return ohasOwn.call(obj, key);
            }
        }
        for (key in obj) {}
        return key === undefined$1 || ohasOwn.call(obj, key);
    }

    /* istanbul ignore next */
    function isPlainObjectModern(obj) {
        // 简单的 typeof obj === 'object'检测，会致使用isPlainObject(window)在opera下通不过
        return inspect.call(obj) === '[object Object]' && Object.getPrototypeOf(obj) === Object.prototype;
    }
    /* istanbul ignore next */
    avalon.isPlainObject = /\[native code\]/.test(Object.getPrototypeOf) ? isPlainObjectModern : isPlainObjectCompact;

    var rcanMix = /object|function/;

    //与jQuery.extend方法，可用于浅拷贝，深拷贝
    /* istanbul ignore next */
    avalon.mix = avalon.fn.mix = function () {
        var n = arguments.length,
            isDeep = false,
            i = 0,
            array = [];
        if (arguments[0] === true) {
            isDeep = true;
            i = 1;
        }
        //将所有非空对象变成空对象
        for (; i < n; i++) {
            var el = arguments[i];
            el = el && rcanMix.test(typeof el === 'undefined' ? 'undefined' : _typeof(el)) ? el : {};
            array.push(el);
        }
        if (array.length === 1) {
            array.unshift(this);
        }
        return innerExtend(isDeep, array);
    };
    var undefined$1;

    function innerExtend(isDeep, array) {
        var target = array[0],
            copyIsArray,
            clone,
            name;
        for (var i = 1, length = array.length; i < length; i++) {
            //只处理非空参数
            var options = array[i];
            var noCloneArrayMethod = Array.isArray(options);
            for (name in options) {
                if (noCloneArrayMethod && !options.hasOwnProperty(name)) {
                    continue;
                }
                try {
                    var src = target[name];
                    var copy = options[name]; //当options为VBS对象时报错
                } catch (e) {
                    continue;
                }

                // 防止环引用
                if (target === copy) {
                    continue;
                }
                if (isDeep && copy && (avalon.isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {

                    if (copyIsArray) {
                        copyIsArray = false;
                        clone = src && Array.isArray(src) ? src : [];
                    } else {
                        clone = src && avalon.isPlainObject(src) ? src : {};
                    }

                    target[name] = innerExtend(isDeep, [clone, copy]);
                } else if (copy !== undefined$1) {
                    target[name] = copy;
                }
            }
        }
        return target;
    }

    var rarraylike = /(Array|List|Collection|Map|Arguments)\]$/;
    /*判定是否类数组，如节点集合，纯数组，arguments与拥有非负整数的length属性的纯JS对象*/
    /* istanbul ignore next */
    function isArrayLike(obj) {
        if (!obj) return false;
        var n = obj.length;
        if (n === n >>> 0) {
            //检测length属性是否为非负整数
            var type = inspect.call(obj);
            if (rarraylike.test(type)) return true;
            if (type !== '[object Object]') return false;
            try {
                if ({}.propertyIsEnumerable.call(obj, 'length') === false) {
                    //如果是原生对象
                    return rfunction.test(obj.item || obj.callee);
                }
                return true;
            } catch (e) {
                //IE的NodeList直接抛错
                return !obj.window; //IE6-8 window
            }
        }
        return false;
    }

    avalon.each = function (obj, fn) {
        if (obj) {
            //排除null, undefined
            var i = 0;
            if (isArrayLike(obj)) {
                for (var n = obj.length; i < n; i++) {
                    if (fn(i, obj[i]) === false) break;
                }
            } else {
                for (i in obj) {
                    if (obj.hasOwnProperty(i) && fn(i, obj[i]) === false) {
                        break;
                    }
                }
            }
        }
    };
    (function () {
        var welcomeIntro = ["%cavalon.js %c" + avalon.version + " %cin debug mode, %cmore...", "color: rgb(114, 157, 52); font-weight: normal;", "color: rgb(85, 85, 85); font-weight: normal;", "color: rgb(85, 85, 85); font-weight: normal;", "color: rgb(82, 140, 224); font-weight: normal; text-decoration: underline;"];
        var welcomeMessage = "You're running avalon in debug mode - messages will be printed to the console to help you fix problems and optimise your application.\n\n" + 'To disable debug mode, add this line at the start of your app:\n\n  avalon.config({debug: false});\n\n' + 'Debug mode also automatically shut down amicably when your app is minified.\n\n' + "Get help and support:\n  https://segmentfault.com/t/avalon\n  http://avalonjs.coding.me/\n  http://www.baidu-x.com/?q=avalonjs\n  http://www.avalon.org.cn/\n\nFound a bug? Raise an issue:\n  https://github.com/RubyLouvre/avalon/issues\n\n";
        if ((typeof console === 'undefined' ? 'undefined' : _typeof(console)) === 'object') {
            var con = console;
            var method = con.groupCollapsed || con.log;
            Function.apply.call(method, con, welcomeIntro);
            con.log(welcomeMessage);
            if (method !== console.log) {
                con.groupEnd(welcomeIntro);
            }
        }
    })();

    function toFixedFix(n, prec) {
        var k = Math.pow(10, prec);
        return '' + (Math.round(n * k) / k).toFixed(prec);
    }
    function numberFilter(number, decimals, point, thousands) {
        //https://github.com/txgruppi/number_format
        //form http://phpjs.org/functions/number_format/
        //number 必需，要格式化的数字
        //decimals 可选，规定多少个小数位。
        //point 可选，规定用作小数点的字符串（默认为 . ）。
        //thousands 可选，规定用作千位分隔符的字符串（默认为 , ），如果设置了该参数，那么所有其他参数都是必需的。
        number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
        var n = !isFinite(+number) ? 0 : +number,
            prec = !isFinite(+decimals) ? 3 : Math.abs(decimals),
            sep = typeof thousands === 'string' ? thousands : ",",
            dec = point || ".",
            s = '';

        // Fix for IE parseFloat(0.55).toFixed(0) = 0;
        s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
        if (s[0].length > 3) {
            s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
        }
        /** //好像没有用
         var s1 = s[1] || ''
        
          if (s1.length < prec) {
                  s1 += new Array(prec - s[1].length + 1).join('0')
                  s[1] = s1
          }
          **/
        return s.join(dec);
    }

    var rscripts = /<script[^>]*>([\S\s]*?)<\/script\s*>/gim;
    var ron = /\s+(on[^=\s]+)(?:=("[^"]*"|'[^']*'|[^\s>]+))?/g;
    var ropen = /<\w+\b(?:(["'])[^"]*?(\1)|[^>])*>/ig;
    var rsanitize = {
        a: /\b(href)\=("javascript[^"]*"|'javascript[^']*')/ig,
        img: /\b(src)\=("javascript[^"]*"|'javascript[^']*')/ig,
        form: /\b(action)\=("javascript[^"]*"|'javascript[^']*')/ig
    };

    //https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet
    //    <a href="javasc&NewLine;ript&colon;alert('XSS')">chrome</a> 
    //    <a href="data:text/html;base64, PGltZyBzcmM9eCBvbmVycm9yPWFsZXJ0KDEpPg==">chrome</a>
    //    <a href="jav	ascript:alert('XSS');">IE67chrome</a>
    //    <a href="jav&#x09;ascript:alert('XSS');">IE67chrome</a>
    //    <a href="jav&#x0A;ascript:alert('XSS');">IE67chrome</a>
    function sanitizeFilter(str) {
        return str.replace(rscripts, "").replace(ropen, function (a, b) {
            var match = a.toLowerCase().match(/<(\w+)\s/);
            if (match) {
                //处理a标签的href属性，img标签的src属性，form标签的action属性
                var reg = rsanitize[match[1]];
                if (reg) {
                    a = a.replace(reg, function (s, name, value) {
                        var quote = value.charAt(0);
                        return name + "=" + quote + "javascript:void(0)" + quote; // jshint ignore:line
                    });
                }
            }
            return a.replace(ron, " ").replace(/\s+/g, " "); //移除onXXX事件
        });
    }

    /*
     'yyyy': 4 digit representation of year (e.g. AD 1 => 0001, AD 2010 => 2010)
     'yy': 2 digit representation of year, padded (00-99). (e.g. AD 2001 => 01, AD 2010 => 10)
     'y': 1 digit representation of year, e.g. (AD 1 => 1, AD 199 => 199)
     'MMMM': Month in year (January-December)
     'MMM': Month in year (Jan-Dec)
     'MM': Month in year, padded (01-12)
     'M': Month in year (1-12)
     'dd': Day in month, padded (01-31)
     'd': Day in month (1-31)
     'EEEE': Day in Week,(Sunday-Saturday)
     'EEE': Day in Week, (Sun-Sat)
     'HH': Hour in day, padded (00-23)
     'H': Hour in day (0-23)
     'hh': Hour in am/pm, padded (01-12)
     'h': Hour in am/pm, (1-12)
     'mm': Minute in hour, padded (00-59)
     'm': Minute in hour (0-59)
     'ss': Second in minute, padded (00-59)
     's': Second in minute (0-59)
     'a': am/pm marker
     'Z': 4 digit (+sign) representation of the timezone offset (-1200-+1200)
     format string can also be one of the following predefined localizable formats:
     
     'medium': equivalent to 'MMM d, y h:mm:ss a' for en_US locale (e.g. Sep 3, 2010 12:05:08 pm)
     'short': equivalent to 'M/d/yy h:mm a' for en_US locale (e.g. 9/3/10 12:05 pm)
     'fullDate': equivalent to 'EEEE, MMMM d,y' for en_US locale (e.g. Friday, September 3, 2010)
     'longDate': equivalent to 'MMMM d, y' for en_US locale (e.g. September 3, 2010
     'mediumDate': equivalent to 'MMM d, y' for en_US locale (e.g. Sep 3, 2010)
     'shortDate': equivalent to 'M/d/yy' for en_US locale (e.g. 9/3/10)
     'mediumTime': equivalent to 'h:mm:ss a' for en_US locale (e.g. 12:05:08 pm)
     'shortTime': equivalent to 'h:mm a' for en_US locale (e.g. 12:05 pm)
     */

    function toInt(str) {
        return parseInt(str, 10) || 0;
    }

    function padNumber(num, digits, trim) {
        var neg = '';
        /* istanbul ignore if*/
        if (num < 0) {
            neg = '-';
            num = -num;
        }
        num = '' + num;
        while (num.length < digits) {
            num = '0' + num;
        }if (trim) num = num.substr(num.length - digits);
        return neg + num;
    }

    function dateGetter(name, size, offset, trim) {
        return function (date) {
            var value = date["get" + name]();
            if (offset > 0 || value > -offset) value += offset;
            if (value === 0 && offset === -12) {
                /* istanbul ignore next*/
                value = 12;
            }
            return padNumber(value, size, trim);
        };
    }

    function dateStrGetter(name, shortForm) {
        return function (date, formats) {
            var value = date["get" + name]();
            var get = (shortForm ? "SHORT" + name : name).toUpperCase();
            return formats[get][value];
        };
    }

    function timeZoneGetter(date) {
        var zone = -1 * date.getTimezoneOffset();
        var paddedZone = zone >= 0 ? "+" : "";
        paddedZone += padNumber(Math[zone > 0 ? "floor" : "ceil"](zone / 60), 2) + padNumber(Math.abs(zone % 60), 2);
        return paddedZone;
    }
    //取得上午下午
    function ampmGetter(date, formats) {
        return date.getHours() < 12 ? formats.AMPMS[0] : formats.AMPMS[1];
    }
    var DATE_FORMATS = {
        yyyy: dateGetter("FullYear", 4),
        yy: dateGetter("FullYear", 2, 0, true),
        y: dateGetter("FullYear", 1),
        MMMM: dateStrGetter("Month"),
        MMM: dateStrGetter("Month", true),
        MM: dateGetter("Month", 2, 1),
        M: dateGetter("Month", 1, 1),
        dd: dateGetter("Date", 2),
        d: dateGetter("Date", 1),
        HH: dateGetter("Hours", 2),
        H: dateGetter("Hours", 1),
        hh: dateGetter("Hours", 2, -12),
        h: dateGetter("Hours", 1, -12),
        mm: dateGetter("Minutes", 2),
        m: dateGetter("Minutes", 1),
        ss: dateGetter("Seconds", 2),
        s: dateGetter("Seconds", 1),
        sss: dateGetter("Milliseconds", 3),
        EEEE: dateStrGetter("Day"),
        EEE: dateStrGetter("Day", true),
        a: ampmGetter,
        Z: timeZoneGetter
    };
    var rdateFormat = /((?:[^yMdHhmsaZE']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|d+|H+|h+|m+|s+|a|Z))(.*)/;
    var raspnetjson = /^\/Date\((\d+)\)\/$/;
    function dateFilter(date, format) {
        var locate = dateFilter.locate,
            text = "",
            parts = [],
            fn,
            match;
        format = format || "mediumDate";
        format = locate[format] || format;
        if (typeof date === "string") {
            if (/^\d+$/.test(date)) {
                date = toInt(date);
            } else if (raspnetjson.test(date)) {
                date = +RegExp.$1;
            } else {
                var trimDate = date.trim();
                var dateArray = [0, 0, 0, 0, 0, 0, 0];
                var oDate = new Date(0);
                //取得年月日
                trimDate = trimDate.replace(/^(\d+)\D(\d+)\D(\d+)/, function (_, a, b, c) {
                    var array = c.length === 4 ? [c, a, b] : [a, b, c];
                    dateArray[0] = toInt(array[0]); //年
                    dateArray[1] = toInt(array[1]) - 1; //月
                    dateArray[2] = toInt(array[2]); //日
                    return "";
                });
                var dateSetter = oDate.setFullYear;
                var timeSetter = oDate.setHours;
                trimDate = trimDate.replace(/[T\s](\d+):(\d+):?(\d+)?\.?(\d)?/, function (_, a, b, c, d) {
                    dateArray[3] = toInt(a); //小时
                    dateArray[4] = toInt(b); //分钟
                    dateArray[5] = toInt(c); //秒
                    if (d) {
                        //毫秒
                        dateArray[6] = Math.round(parseFloat("0." + d) * 1000);
                    }
                    return "";
                });
                var tzHour = 0;
                var tzMin = 0;
                trimDate = trimDate.replace(/Z|([+-])(\d\d):?(\d\d)/, function (z, symbol, c, d) {
                    dateSetter = oDate.setUTCFullYear;
                    timeSetter = oDate.setUTCHours;
                    if (symbol) {
                        tzHour = toInt(symbol + c);
                        tzMin = toInt(symbol + d);
                    }
                    return '';
                });

                dateArray[3] -= tzHour;
                dateArray[4] -= tzMin;
                dateSetter.apply(oDate, dateArray.slice(0, 3));
                timeSetter.apply(oDate, dateArray.slice(3));
                date = oDate;
            }
        }
        if (typeof date === 'number') {
            date = new Date(date);
        }

        while (format) {
            match = rdateFormat.exec(format);
            /* istanbul ignore else */
            if (match) {
                parts = parts.concat(match.slice(1));
                format = parts.pop();
            } else {
                parts.push(format);
                format = null;
            }
        }
        parts.forEach(function (value) {
            fn = DATE_FORMATS[value];
            text += fn ? fn(date, locate) : value.replace(/(^'|'$)/g, "").replace(/''/g, "'");
        });
        return text;
    }

    var locate = {
        AMPMS: {
            0: '上午',
            1: '下午'
        },
        DAY: {
            0: '星期日',
            1: '星期一',
            2: '星期二',
            3: '星期三',
            4: '星期四',
            5: '星期五',
            6: '星期六'
        },
        MONTH: {
            0: '1月',
            1: '2月',
            2: '3月',
            3: '4月',
            4: '5月',
            5: '6月',
            6: '7月',
            7: '8月',
            8: '9月',
            9: '10月',
            10: '11月',
            11: '12月'
        },
        SHORTDAY: {
            '0': '周日',
            '1': '周一',
            '2': '周二',
            '3': '周三',
            '4': '周四',
            '5': '周五',
            '6': '周六'
        },
        fullDate: 'y年M月d日EEEE',
        longDate: 'y年M月d日',
        medium: 'yyyy-M-d H:mm:ss',
        mediumDate: 'yyyy-M-d',
        mediumTime: 'H:mm:ss',
        'short': 'yy-M-d ah:mm',
        shortDate: 'yy-M-d',
        shortTime: 'ah:mm'
    };
    locate.SHORTMONTH = locate.MONTH;
    dateFilter.locate = locate;

    /**
    $$skipArray:是系统级通用的不可监听属性
    $skipArray: 是当前对象特有的不可监听属性
    
     不同点是
     $$skipArray被hasOwnProperty后返回false
     $skipArray被hasOwnProperty后返回true
     */
    var falsy;
    var $$skipArray = {
        $id: falsy,
        $render: falsy,
        $track: falsy,
        $element: falsy,
        $computed: falsy,
        $watch: falsy,
        $fire: falsy,
        $events: falsy,
        $accessors: falsy,
        $hashcode: falsy,
        $mutations: falsy,
        $vbthis: falsy,
        $vbsetter: falsy
    };

    /*
    https://github.com/hufyhang/orderBy/blob/master/index.js
    */

    function orderBy(array, by, decend) {
        var type = avalon.type(array);
        if (type !== 'array' && type !== 'object') throw 'orderBy只能处理对象或数组';
        var criteria = typeof by == 'string' ? function (el) {
            return el && el[by];
        } : typeof by === 'function' ? by : function (el) {
            return el;
        };
        var mapping = {};
        var temp = [];
        __repeat(array, Array.isArray(array), function (key) {
            var val = array[key];
            var k = criteria(val, key);
            if (k in mapping) {
                mapping[k].push(key);
            } else {
                mapping[k] = [key];
            }
            temp.push(k);
        });

        temp.sort();
        if (decend < 0) {
            temp.reverse();
        }
        var _array = type === 'array';
        var target = _array ? [] : {};
        return recovery(target, temp, function (k) {
            var key = mapping[k].shift();
            if (_array) {
                target.push(array[key]);
            } else {
                target[key] = array[key];
            }
        });
    }

    function __repeat(array, isArray$$1, cb) {
        if (isArray$$1) {
            array.forEach(function (val, index) {
                cb(index);
            });
        } else if (typeof array.$track === 'string') {
            array.$track.replace(/[^☥]+/g, function (k) {
                cb(k);
            });
        } else {
            for (var i in array) {
                if (array.hasOwnProperty(i)) {
                    cb(i);
                }
            }
        }
    }
    function filterBy(array, search) {
        var type = avalon.type(array);
        if (type !== 'array' && type !== 'object') throw 'filterBy只能处理对象或数组';
        var args = avalon.slice(arguments, 2);
        var stype = avalon.type(search);
        if (stype === 'function') {
            var criteria = search._orig || search;
        } else if (stype === 'string' || stype === 'number') {
            if (search === '') {
                return array;
            } else {
                var reg = new RegExp(avalon.escapeRegExp(search), 'i');
                criteria = function criteria(el) {
                    return reg.test(el);
                };
            }
        } else {
            return array;
        }
        var isArray$$1 = type === 'array';
        var target = isArray$$1 ? [] : {};
        __repeat(array, isArray$$1, function (key) {
            var val = array[key];
            if (criteria.apply({
                key: key
            }, [val, key].concat(args))) {
                if (isArray$$1) {
                    target.push(val);
                } else {
                    target[key] = val;
                }
            }
        });
        return target;
    }

    function selectBy(data, array, defaults) {
        if (avalon.isObject(data) && !Array.isArray(data)) {
            var target = [];
            return recovery(target, array, function (name) {
                target.push(data.hasOwnProperty(name) ? data[name] : defaults ? defaults[name] : '');
            });
        } else {
            return data;
        }
    }

    function limitBy(input, limit, begin) {
        var type = avalon.type(input);
        if (type !== 'array' && type !== 'object') throw 'limitBy只能处理对象或数组';
        //必须是数值
        if (typeof limit !== 'number') {
            return input;
        }
        //不能为NaN
        if (limit !== limit) {
            return input;
        }
        //将目标转换为数组
        if (type === 'object') {
            input = convertArray(input, false);
        }
        var n = input.length;
        limit = Math.floor(Math.min(n, limit));
        begin = typeof begin === 'number' ? begin : 0;
        if (begin < 0) {
            begin = Math.max(0, n + begin);
        }
        var data = [];
        for (var i = begin; i < n; i++) {
            if (data.length === limit) {
                break;
            }
            data.push(input[i]);
        }
        var isArray$$1 = type === 'array';
        if (isArray$$1) {
            return data;
        }
        var target = {};
        return recovery(target, data, function (el) {
            target[el.key] = el.value;
        });
    }

    function recovery(ret, array, callback) {
        for (var i = 0, n = array.length; i < n; i++) {
            callback(array[i]);
        }
        return ret;
    }

    //Chrome谷歌浏览器中js代码Array.sort排序的bug乱序解决办法
    //http://www.cnblogs.com/yzeng/p/3949182.html
    function convertArray(array, isArray$$1) {
        var ret = [],
            i = 0;
        __repeat(array, isArray$$1, function (key) {
            ret[i] = {
                oldIndex: i,
                value: array[key],
                key: key
            };
            i++;
        });
        return ret;
    }

    var eventFilters = {
        stop: function stop(e) {
            e.stopPropagation();
            return e;
        },
        prevent: function prevent(e) {
            e.preventDefault();
            return e;
        }
    };
    var keys = {
        esc: 27,
        tab: 9,
        enter: 13,
        space: 32,
        del: 46,
        up: 38,
        left: 37,
        right: 39,
        down: 40
    };
    for (var name$1 in keys) {
        (function (filter, key) {
            eventFilters[filter] = function (e) {
                if (e.which !== key) {
                    e.$return = true;
                }
                return e;
            };
        })(name$1, keys[name$1]);
    }

    //https://github.com/teppeis/htmlspecialchars
    function escapeFilter(str) {
        if (str == null) return '';

        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    var filters = avalon.filters = {};

    avalon.composeFilters = function () {
        var args = arguments;
        return function (value) {
            for (var i = 0, arr; arr = args[i++];) {
                var name = arr[0];
                var filter = avalon.filters[name];
                if (typeof filter === 'function') {
                    arr[0] = value;
                    try {
                        value = filter.apply(0, arr);
                    } catch (e) {}
                }
            }
            return value;
        };
    };

    avalon.escapeHtml = escapeFilter;

    avalon.mix(filters, {
        uppercase: function uppercase(str) {
            return String(str).toUpperCase();
        },
        lowercase: function lowercase(str) {
            return String(str).toLowerCase();
        },
        truncate: function truncate(str, length, end) {
            //length，新字符串长度，truncation，新字符串的结尾的字段,返回新字符串
            if (!str) {
                return '';
            }
            str = String(str);
            if (isNaN(length)) {
                length = 30;
            }
            end = typeof end === "string" ? end : "...";
            return str.length > length ? str.slice(0, length - end.length) + end : /* istanbul ignore else*/
            str;
        },

        camelize: avalon.camelize,
        date: dateFilter,
        escape: escapeFilter,
        sanitize: sanitizeFilter,
        number: numberFilter,
        currency: function currency(amount, symbol, fractionSize) {
            return (symbol || '\xA5') + numberFilter(amount, isFinite(fractionSize) ? /* istanbul ignore else*/fractionSize : 2);
        }
    }, { filterBy: filterBy, orderBy: orderBy, selectBy: selectBy, limitBy: limitBy }, eventFilters);

    var rcheckedType = /^(?:checkbox|radio)$/;

    /* istanbul ignore next */
    function fixElement(dest, src) {
        if (dest.nodeType !== 1) {
            return;
        }
        var nodeName = dest.nodeName.toLowerCase();

        if (nodeName === "script") {
            if (dest.text !== src.text) {
                dest.type = "noexec";
                dest.text = src.text;
                dest.type = src.type || "";
            }
        } else if (nodeName === 'object') {
            var params = src.childNodes;
            if (dest.childNodes.length !== params.length) {
                avalon.clearHTML(dest);
                for (var i = 0, el; el = params[i++];) {
                    dest.appendChild(el.cloneNode(true));
                }
            }
        } else if (nodeName === 'input' && rcheckedType.test(src.nodeName)) {

            dest.defaultChecked = dest.checked = src.checked;
            if (dest.value !== src.value) {
                dest.value = src.value;
            }
        } else if (nodeName === 'option') {
            dest.defaultSelected = dest.selected = src.defaultSelected;
        } else if (nodeName === 'input' || nodeName === 'textarea') {
            dest.defaultValue = src.defaultValue;
        }
    }

    /* istanbul ignore next */
    function getAll(context) {
        return typeof context.getElementsByTagName !== 'undefined' ? context.getElementsByTagName('*') : typeof context.querySelectorAll !== 'undefined' ? context.querySelectorAll('*') : [];
    }

    /* istanbul ignore next */
    function fixClone(src) {
        var target = src.cloneNode(true);
        //http://www.myexception.cn/web/665613.html
        // target.expando = null
        var t = getAll(target);
        var s = getAll(src);
        for (var i = 0; i < s.length; i++) {
            fixElement(t[i], s[i]);
        }
        return target;
    }

    /* istanbul ignore next */
    function fixContains(root, el) {
        try {
            //IE6-8,游离于DOM树外的文本节点，访问parentNode有时会抛错
            while (el = el.parentNode) {
                if (el === root) return true;
            }
        } catch (e) {}
        return false;
    }

    avalon.contains = fixContains;

    avalon.cloneNode = function (a) {
        return a.cloneNode(true);
    };

    //IE6-11的文档对象没有contains
    /* istanbul ignore next */
    function shimHack() {
        if (msie$1 < 10) {
            avalon.cloneNode = fixClone;
        }
        if (!document$1.contains) {
            document$1.contains = function (b) {
                return fixContains(document$1, b);
            };
        }
        if (avalon.modern) {
            if (!document$1.createTextNode('x').contains) {
                Node.prototype.contains = function (child) {
                    //IE6-8没有Node对象
                    return fixContains(this, child);
                };
            }
        }
        //firefox 到11时才有outerHTML
        function fixFF(prop, cb) {
            if (!(prop in root) && HTMLElement.prototype.__defineGetter__) {
                HTMLElement.prototype.__defineGetter__(prop, cb);
            }
        }
        fixFF('outerHTML', function () {
            var div = document$1.createElement('div');
            div.appendChild(this);
            return div.innerHTML;
        });
        fixFF('children', function () {
            var children = [];
            for (var i = 0, el; el = this.childNodes[i++];) {
                if (el.nodeType === 1) {
                    children.push(el);
                }
            }
            return children;
        });
        fixFF('innerText', function () {
            //firefox45+, chrome4+ http://caniuse.com/#feat=innertext
            return this.textContent;
        });
    }

    if (inBrowser) {
        shimHack();
    }

    function ClassList(node) {
        this.node = node;
    }

    ClassList.prototype = {
        toString: function toString() {
            var node = this.node;
            var cls = node.className;
            var str = typeof cls === 'string' ? cls : cls.baseVal;
            var match = str.match(rnowhite);
            return match ? match.join(' ') : '';
        },
        contains: function contains(cls) {
            return (' ' + this + ' ').indexOf(' ' + cls + ' ') > -1;
        },
        add: function add(cls) {
            if (!this.contains(cls)) {
                this.set(this + ' ' + cls);
            }
        },
        remove: function remove(cls) {
            this.set((' ' + this + ' ').replace(' ' + cls + ' ', ' '));
        },
        set: function set(cls) {
            cls = cls.trim();
            var node = this.node;
            if (_typeof(node.className) === 'object') {
                //SVG元素的className是一个对象 SVGAnimatedString { baseVal='', animVal=''}，只能通过set/getAttribute操作
                node.setAttribute('class', cls);
            } else {
                node.className = cls;
            }
            if (!cls) {
                node.removeAttribute('class');
            }
            //toggle存在版本差异，因此不使用它
        }
    };

    function classListFactory(node) {
        if (!('classList' in node)) {
            node.classList = new ClassList(node);
        }
        return node.classList;
    }

    'add,remove'.replace(rword, function (method) {
        avalon.fn[method + 'Class'] = function (cls) {
            var el = this[0] || {};
            //https://developer.mozilla.org/zh-CN/docs/Mozilla/Firefox/Releases/26
            if (cls && typeof cls === 'string' && el.nodeType === 1) {
                cls.replace(rnowhite, function (c) {
                    classListFactory(el)[method](c);
                });
            }
            return this;
        };
    });

    avalon.shadowCopy(avalon.fn, {
        hasClass: function hasClass(cls) {
            var el = this[0] || {};
            return el.nodeType === 1 && classListFactory(el).contains(cls);
        },
        toggleClass: function toggleClass(value, stateVal) {
            var isBool = typeof stateVal === 'boolean';
            var me = this;
            String(value).replace(rnowhite, function (c) {
                var state = isBool ? stateVal : !me.hasClass(c);
                me[state ? 'addClass' : 'removeClass'](c);
            });
            return this;
        }
    });

    var propMap = {}; //不规则的属性名映射


    //防止压缩时出错
    'accept-charset,acceptCharset|char,ch|charoff,chOff|class,className|for,htmlFor|http-equiv,httpEquiv'.replace(/[^\|]+/g, function (a) {
        var k = a.split(',');
        propMap[k[0]] = k[1];
    });
    /*
    contenteditable不是布尔属性
    http://www.zhangxinxu.com/wordpress/2016/01/contenteditable-plaintext-only/
    contenteditable=''
    contenteditable='events'
    contenteditable='caret'
    contenteditable='plaintext-only'
    contenteditable='true'
    contenteditable='false'
     */
    var bools = ['autofocus,autoplay,async,allowTransparency,checked,controls', 'declare,disabled,defer,defaultChecked,defaultSelected,', 'isMap,loop,multiple,noHref,noResize,noShade', 'open,readOnly,selected'].join(',');

    bools.replace(/\w+/g, function (name) {
        propMap[name.toLowerCase()] = name;
    });

    var anomaly = ['accessKey,bgColor,cellPadding,cellSpacing,codeBase,codeType,colSpan', 'dateTime,defaultValue,contentEditable,frameBorder,longDesc,maxLength,' + 'marginWidth,marginHeight,rowSpan,tabIndex,useMap,vSpace,valueType,vAlign'].join(',');

    anomaly.replace(/\w+/g, function (name) {
        propMap[name.toLowerCase()] = name;
    });

    //module.exports = propMap

    function isVML(src) {
        var nodeName = src.nodeName;
        return nodeName.toLowerCase() === nodeName && !!src.scopeName && src.outerText === '';
    }

    var rvalidchars = /^[\],:{}\s]*$/;
    var rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g;
    var rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g;
    var rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g;

    function compactParseJSON(data) {
        if (typeof data === 'string') {
            data = data.trim();
            if (data) {
                if (rvalidchars.test(data.replace(rvalidescape, '@').replace(rvalidtokens, ']').replace(rvalidbraces, ''))) {
                    return new Function('return ' + data)(); // jshint ignore:line
                }
            }
            throw TypeError('Invalid JSON: [' + data + ']');
        }
        return data;
    }

    var rsvg = /^\[object SVG\w*Element\]$/;
    var ramp = /&amp;/g;
    function updateAttrs(node, attrs) {
        for (var attrName in attrs) {
            try {
                var val = attrs[attrName];
                // 处理路径属性
                /* istanbul ignore if*/

                //处理HTML5 data-*属性 SVG
                if (attrName.indexOf('data-') === 0 || rsvg.test(node)) {
                    node.setAttribute(attrName, val);
                } else {
                    var propName = propMap[attrName] || attrName;
                    /* istanbul ignore if */
                    if (typeof node[propName] === 'boolean') {
                        if (propName === 'checked') {
                            node.defaultChecked = !!val;
                        }
                        node[propName] = !!val;
                        //布尔属性必须使用el.xxx = true|false方式设值
                        //如果为false, IE全系列下相当于setAttribute(xxx,''),
                        //会影响到样式,需要进一步处理
                    }

                    if (val === false) {
                        //移除属性
                        node.removeAttribute(propName);
                        continue;
                    }
                    //IE6中classNamme, htmlFor等无法检测它们为内建属性　
                    if (avalon.msie < 8 && /[A-Z]/.test(propName)) {
                        node[propName] = val + '';
                        continue;
                    }
                    //SVG只能使用setAttribute(xxx, yyy), VML只能使用node.xxx = yyy ,
                    //HTML的固有属性必须node.xxx = yyy
                    /* istanbul ignore next */
                    var isInnate = !avalon.modern && isVML(node) ? true : isInnateProps(node.nodeName, attrName);
                    if (isInnate) {
                        if (attrName === 'href' || attrName === 'src') {
                            /* istanbul ignore if */
                            if (avalon.msie < 8) {
                                val = String(val).replace(ramp, '&'); //处理IE67自动转义的问题
                            }
                        }
                        node[propName] = val + '';
                    } else {
                        node.setAttribute(attrName, val);
                    }
                }
            } catch (e) {
                // 对象不支持此属性或方法 src https://github.com/ecomfe/zrender 
                // 未知名称。\/n
                // e.message大概这样,需要trim
                //IE6-8,元素节点不支持其他元素节点的内置属性,如src, href, for
                /* istanbul ignore next */
                avalon.log(String(e.message).trim(), attrName, val);
            }
        }
    }
    var innateMap = {};

    function isInnateProps(nodeName, attrName) {
        var key = nodeName + ":" + attrName;
        if (key in innateMap) {
            return innateMap[key];
        }
        return innateMap[key] = attrName in document$1.createElement(nodeName);
    }
    try {
        avalon.parseJSON = JSON.parse;
    } catch (e) {
        /* istanbul ignore next */
        avalon.parseJSON = compactParseJSON;
    }

    avalon.fn.attr = function (name, value) {
        if (arguments.length === 2) {
            this[0].setAttribute(name, value);
            return this;
        } else {
            return this[0].getAttribute(name);
        }
    };

    var cssMap = oneObject('float', 'cssFloat');
    avalon.cssNumber = oneObject('animationIterationCount,columnCount,order,flex,flexGrow,flexShrink,fillOpacity,fontWeight,lineHeight,opacity,orphans,widows,zIndex,zoom');
    var prefixes = ['', '-webkit-', '-o-', '-moz-', '-ms-'];
    /* istanbul ignore next */
    avalon.cssName = function (name, host, camelCase) {
        if (cssMap[name]) {
            return cssMap[name];
        }
        host = host || avalon.root.style || {};
        for (var i = 0, n = prefixes.length; i < n; i++) {
            camelCase = avalon.camelize(prefixes[i] + name);
            if (camelCase in host) {
                return cssMap[name] = camelCase;
            }
        }
        return null;
    };
    /* istanbul ignore next */
    avalon.css = function (node, name, value, fn) {
        //读写删除元素节点的样式
        if (node instanceof avalon) {
            node = node[0];
        }
        if (node.nodeType !== 1) {
            return;
        }
        var prop = avalon.camelize(name);
        name = avalon.cssName(prop) || /* istanbul ignore next*/prop;
        if (value === void 0 || typeof value === 'boolean') {
            //获取样式
            fn = cssHooks[prop + ':get'] || cssHooks['@:get'];
            if (name === 'background') {
                name = 'backgroundColor';
            }
            var val = fn(node, name);
            return value === true ? parseFloat(val) || 0 : val;
        } else if (value === '') {
            //请除样式
            node.style[name] = '';
        } else {
            //设置样式
            if (value == null || value !== value) {
                return;
            }
            if (isFinite(value) && !avalon.cssNumber[prop]) {
                value += 'px';
            }
            fn = cssHooks[prop + ':set'] || cssHooks['@:set'];
            fn(node, name, value);
        }
    };
    /* istanbul ignore next */
    avalon.fn.css = function (name, value) {
        if (avalon.isPlainObject(name)) {
            for (var i in name) {
                avalon.css(this, i, name[i]);
            }
        } else {
            var ret = avalon.css(this, name, value);
        }
        return ret !== void 0 ? ret : this;
    };
    /* istanbul ignore next */
    avalon.fn.position = function () {
        var offsetParent,
            offset,
            elem = this[0],
            parentOffset = {
            top: 0,
            left: 0
        };
        if (!elem) {
            return parentOffset;
        }
        if (this.css('position') === 'fixed') {
            offset = elem.getBoundingClientRect();
        } else {
            offsetParent = this.offsetParent(); //得到真正的offsetParent
            offset = this.offset(); // 得到正确的offsetParent
            if (offsetParent[0].tagName !== 'HTML') {
                parentOffset = offsetParent.offset();
            }
            parentOffset.top += avalon.css(offsetParent[0], 'borderTopWidth', true);
            parentOffset.left += avalon.css(offsetParent[0], 'borderLeftWidth', true);

            // Subtract offsetParent scroll positions
            parentOffset.top -= offsetParent.scrollTop();
            parentOffset.left -= offsetParent.scrollLeft();
        }
        return {
            top: offset.top - parentOffset.top - avalon.css(elem, 'marginTop', true),
            left: offset.left - parentOffset.left - avalon.css(elem, 'marginLeft', true)
        };
    };
    /* istanbul ignore next */
    avalon.fn.offsetParent = function () {
        var offsetParent = this[0].offsetParent;
        while (offsetParent && avalon.css(offsetParent, 'position') === 'static') {
            offsetParent = offsetParent.offsetParent;
        }
        return avalon(offsetParent || avalon.root);
    };

    /* istanbul ignore next */
    cssHooks['@:set'] = function (node, name, value) {
        try {
            //node.style.width = NaN;node.style.width = 'xxxxxxx';
            //node.style.width = undefine 在旧式IE下会抛异常
            node.style[name] = value;
        } catch (e) {}
    };
    /* istanbul ignore next */
    cssHooks['@:get'] = function (node, name) {
        if (!node || !node.style) {
            throw new Error('getComputedStyle要求传入一个节点 ' + node);
        }
        var ret,
            styles = window$1.getComputedStyle(node, null);
        if (styles) {
            ret = name === 'filter' ? styles.getPropertyValue(name) : styles[name];
            if (ret === '') {
                ret = node.style[name]; //其他浏览器需要我们手动取内联样式
            }
        }
        return ret;
    };

    cssHooks['opacity:get'] = function (node) {
        var ret = cssHooks['@:get'](node, 'opacity');
        return ret === '' ? '1' : ret;
    };

    'top,left'.replace(avalon.rword, function (name) {
        cssHooks[name + ':get'] = function (node) {
            var computed = cssHooks['@:get'](node, name);
            return (/px$/.test(computed) ? computed : avalon(node).position()[name] + 'px'
            );
        };
    });

    var cssShow = {
        position: 'absolute',
        visibility: 'hidden',
        display: 'block'
    };

    var rdisplayswap = /^(none|table(?!-c[ea]).+)/;
    /* istanbul ignore next */
    function showHidden(node, array) {
        //http://www.cnblogs.com/rubylouvre/archive/2012/10/27/2742529.html
        if (node.offsetWidth <= 0) {
            //opera.offsetWidth可能小于0
            if (rdisplayswap.test(cssHooks['@:get'](node, 'display'))) {
                var obj = {
                    node: node
                };
                for (var name in cssShow) {
                    obj[name] = node.style[name];
                    node.style[name] = cssShow[name];
                }
                array.push(obj);
            }
            var parent = node.parentNode;
            if (parent && parent.nodeType === 1) {
                showHidden(parent, array);
            }
        }
    }
    /* istanbul ignore next*/
    avalon.each({
        Width: 'width',
        Height: 'height'
    }, function (name, method) {
        var clientProp = 'client' + name,
            scrollProp = 'scroll' + name,
            offsetProp = 'offset' + name;
        cssHooks[method + ':get'] = function (node, which, override) {
            var boxSizing = -4;
            if (typeof override === 'number') {
                boxSizing = override;
            }
            which = name === 'Width' ? ['Left', 'Right'] : ['Top', 'Bottom'];
            var ret = node[offsetProp]; // border-box 0
            if (boxSizing === 2) {
                // margin-box 2
                return ret + avalon.css(node, 'margin' + which[0], true) + avalon.css(node, 'margin' + which[1], true);
            }
            if (boxSizing < 0) {
                // padding-box  -2
                ret = ret - avalon.css(node, 'border' + which[0] + 'Width', true) - avalon.css(node, 'border' + which[1] + 'Width', true);
            }
            if (boxSizing === -4) {
                // content-box -4
                ret = ret - avalon.css(node, 'padding' + which[0], true) - avalon.css(node, 'padding' + which[1], true);
            }
            return ret;
        };
        cssHooks[method + '&get'] = function (node) {
            var hidden = [];
            showHidden(node, hidden);
            var val = cssHooks[method + ':get'](node);
            for (var i = 0, obj; obj = hidden[i++];) {
                node = obj.node;
                for (var n in obj) {
                    if (typeof obj[n] === 'string') {
                        node.style[n] = obj[n];
                    }
                }
            }
            return val;
        };
        avalon.fn[method] = function (value) {
            //会忽视其display
            var node = this[0];
            if (arguments.length === 0) {
                if (node.setTimeout) {
                    //取得窗口尺寸
                    return node['inner' + name] || node.document.documentElement[clientProp] || node.document.body[clientProp]; //IE6下前两个分别为undefined,0
                }
                if (node.nodeType === 9) {
                    //取得页面尺寸
                    var doc = node.documentElement;
                    //FF chrome    html.scrollHeight< body.scrollHeight
                    //IE 标准模式 : html.scrollHeight> body.scrollHeight
                    //IE 怪异模式 : html.scrollHeight 最大等于可视窗口多一点？
                    return Math.max(node.body[scrollProp], doc[scrollProp], node.body[offsetProp], doc[offsetProp], doc[clientProp]);
                }
                return cssHooks[method + '&get'](node);
            } else {
                return this.css(method, value);
            }
        };
        avalon.fn['inner' + name] = function () {
            return cssHooks[method + ':get'](this[0], void 0, -2);
        };
        avalon.fn['outer' + name] = function (includeMargin) {
            return cssHooks[method + ':get'](this[0], void 0, includeMargin === true ? 2 : 0);
        };
    });

    function getWindow(node) {
        return node.window || node.defaultView || node.parentWindow || false;
    }

    /* istanbul ignore if */
    if (msie$1 < 9) {
        avalon.shadowCopy(cssMap, oneObject('float', 'styleFloat'));
        var rnumnonpx = /^-?(?:\d*\.)?\d+(?!px)[^\d\s]+$/i;
        var rposition = /^(top|right|bottom|left)$/;
        var ralpha = /alpha\([^)]+\)/i;
        var ropactiy = /(opacity|\d(\d|\.)*)/g;
        var ie8 = msie$1 === 8;
        var salpha = 'DXImageTransform.Microsoft.Alpha';
        var border = {
            thin: ie8 ? '1px' : '2px',
            medium: ie8 ? '3px' : '4px',
            thick: ie8 ? '5px' : '6px'
        };
        cssHooks['@:get'] = function (node, name) {
            //取得精确值，不过它有可能是带em,pc,mm,pt,%等单位
            var currentStyle = node.currentStyle;
            var ret = currentStyle[name];
            if (rnumnonpx.test(ret) && !rposition.test(ret)) {
                //①，保存原有的style.left, runtimeStyle.left,
                var style = node.style,
                    left = style.left,
                    rsLeft = node.runtimeStyle.left;
                //②由于③处的style.left = xxx会影响到currentStyle.left，
                //因此把它currentStyle.left放到runtimeStyle.left，
                //runtimeStyle.left拥有最高优先级，不会style.left影响
                node.runtimeStyle.left = currentStyle.left;
                //③将精确值赋给到style.left，然后通过IE的另一个私有属性 style.pixelLeft
                //得到单位为px的结果；fontSize的分支见http://bugs.jquery.com/ticket/760
                style.left = name === 'fontSize' ? '1em' : ret || 0;
                ret = style.pixelLeft + 'px';
                //④还原 style.left，runtimeStyle.left
                style.left = left;
                node.runtimeStyle.left = rsLeft;
            }
            if (ret === 'medium') {
                name = name.replace('Width', 'Style');
                //border width 默认值为medium，即使其为0'
                if (currentStyle[name] === 'none') {
                    ret = '0px';
                }
            }
            return ret === '' ? 'auto' : border[ret] || ret;
        };
        cssHooks['opacity:set'] = function (node, name, value) {
            var style = node.style;

            var opacity = Number(value) <= 1 ? 'alpha(opacity=' + value * 100 + ')' : '';
            var filter = style.filter || '';
            style.zoom = 1;
            //不能使用以下方式设置透明度
            //node.filters.alpha.opacity = value * 100
            style.filter = (ralpha.test(filter) ? filter.replace(ralpha, opacity) : filter + ' ' + opacity).trim();

            if (!style.filter) {
                style.removeAttribute('filter');
            }
        };
        cssHooks['opacity:get'] = function (node) {
            var match = node.style.filter.match(ropactiy) || [];
            var ret = false;
            for (var i = 0, el; el = match[i++];) {
                if (el === 'opacity') {
                    ret = true;
                } else if (ret) {
                    return el / 100 + '';
                }
            }
            return '1'; //确保返回的是字符串
        };
    }

    /* istanbul ignore next */
    avalon.fn.offset = function () {
        //取得距离页面左右角的坐标
        var node = this[0],
            box = {
            left: 0,
            top: 0
        };
        if (!node || !node.tagName || !node.ownerDocument) {
            return box;
        }
        var doc = node.ownerDocument;
        var body = doc.body;
        var root$$1 = doc.documentElement;
        var win = doc.defaultView || doc.parentWindow;
        if (!avalon.contains(root$$1, node)) {
            return box;
        }
        //http://hkom.blog1.fc2.com/?mode=m&no=750 body的偏移量是不包含margin的
        //我们可以通过getBoundingClientRect来获得元素相对于client的rect.
        //http://msdn.microsoft.com/en-us/library/ms536433.aspx
        if (node.getBoundingClientRect) {
            box = node.getBoundingClientRect(); // BlackBerry 5, iOS 3 (original iPhone)
        }
        //chrome/IE6: body.scrollTop, firefox/other: root.scrollTop
        var clientTop = root$$1.clientTop || body.clientTop,
            clientLeft = root$$1.clientLeft || body.clientLeft,
            scrollTop = Math.max(win.pageYOffset || 0, root$$1.scrollTop, body.scrollTop),
            scrollLeft = Math.max(win.pageXOffset || 0, root$$1.scrollLeft, body.scrollLeft);
        // 把滚动距离加到left,top中去。
        // IE一些版本中会自动为HTML元素加上2px的border，我们需要去掉它
        // http://msdn.microsoft.com/en-us/library/ms533564(VS.85).aspx
        return {
            top: box.top + scrollTop - clientTop,
            left: box.left + scrollLeft - clientLeft
        };
    };

    //生成avalon.fn.scrollLeft, avalon.fn.scrollTop方法
    /* istanbul ignore next */
    avalon.each({
        scrollLeft: 'pageXOffset',
        scrollTop: 'pageYOffset'
    }, function (method, prop) {
        avalon.fn[method] = function (val) {
            var node = this[0] || {};
            var win = getWindow(node);
            var root$$1 = avalon.root;
            var top = method === 'scrollTop';
            if (!arguments.length) {
                return win ? prop in win ? win[prop] : root$$1[method] : node[method];
            } else {
                if (win) {
                    win.scrollTo(!top ? val : avalon(win).scrollLeft(), top ? val : avalon(win).scrollTop());
                } else {
                    node[method] = val;
                }
            }
        };
    });

    function getDuplexType(elem) {
        var ret = elem.tagName.toLowerCase();
        if (ret === 'input') {
            return rcheckedType.test(elem.type) ? 'checked' : elem.type;
        }
        return ret;
    }

    /**
     * IE6/7/8中，如果option没有value值，那么将返回空字符串。
     * IE9/Firefox/Safari/Chrome/Opera 中先取option的value值，如果没有value属性，则取option的innerText值。
     * IE11及W3C，如果没有指定value，那么node.value默认为node.text（存在trim作），但IE9-10则是取innerHTML(没trim操作)
     */

    function getOption(node) {
        if (node.hasAttribute && node.hasAttribute('value')) {
            return node.getAttribute('value');
        }
        var attr = node.getAttributeNode('value');
        if (attr && attr.specified) {
            return attr.value;
        }
        return node.innerHTML.trim();
    }

    var valHooks = {
        'option:get': msie$1 ? getOption : function (node) {
            return node.value;
        },
        'select:get': function selectGet(node, value) {
            var option,
                options = node.options,
                index = node.selectedIndex,
                getter = valHooks['option:get'],
                one = node.type === 'select-one' || index < 0,
                values = one ? null : [],
                max = one ? index + 1 : options.length,
                i = index < 0 ? max : one ? index : 0;
            for (; i < max; i++) {
                option = options[i];
                //IE6-9在reset后不会改变selected，需要改用i === index判定
                //我们过滤所有disabled的option元素，但在safari5下，
                //如果设置optgroup为disable，那么其所有孩子都disable
                //因此当一个元素为disable，需要检测其是否显式设置了disable及其父节点的disable情况
                if ((option.selected || i === index) && !option.disabled && (!option.parentNode.disabled || option.parentNode.tagName !== 'OPTGROUP')) {
                    value = getter(option);
                    if (one) {
                        return value;
                    }
                    //收集所有selected值组成数组返回
                    values.push(value);
                }
            }
            return values;
        },
        'select:set': function selectSet(node, values, optionSet) {
            values = [].concat(values); //强制转换为数组
            var getter = valHooks['option:get'];
            for (var i = 0, el; el = node.options[i++];) {
                if (el.selected = values.indexOf(getter(el)) > -1) {
                    optionSet = true;
                }
            }
            if (!optionSet) {
                node.selectedIndex = -1;
            }
        }
    };

    avalon.fn.val = function (value) {
        var node = this[0];
        if (node && node.nodeType === 1) {
            var get = arguments.length === 0;
            var access = get ? ':get' : ':set';
            var fn = valHooks[getDuplexType(node) + access];
            if (fn) {
                var val = fn(node, value);
            } else if (get) {
                return (node.value || '').replace(/\r/g, '');
            } else {
                node.value = value;
            }
        }
        return get ? val : this;
    };

    var voidTag = {
        area: 1,
        base: 1,
        basefont: 1,
        bgsound: 1,
        br: 1,
        col: 1,
        command: 1,
        embed: 1,
        frame: 1,
        hr: 1,
        img: 1,
        input: 1,
        keygen: 1,
        link: 1,
        meta: 1,
        param: 1,
        source: 1,
        track: 1,
        wbr: 1
    };

    function makeObject(str) {
        return oneObject(str + ',template,#document-fragment,#comment');
    }
    var pNestChild = oneObject('div,ul,ol,dl,table,h1,h2,h3,h4,h5,h6,form,fieldset');
    var tNestChild = makeObject('tr,style,script');
    var nestObject = {
        p: pNestChild,
        // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-inselect
        select: makeObject('option,optgroup,#text'),
        optgroup: makeObject('option,#text'),
        option: makeObject('#text'),
        // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-intd
        // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-incaption
        // No special behavior since these rules fall back to "in body" mode for
        // all except special table nodes which cause bad parsing behavior anyway.

        // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-intr
        tr: makeObject('th,td,style,script'),

        // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-intbody
        tbody: tNestChild,
        tfoot: tNestChild,
        thead: tNestChild,
        // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-incolgroup
        colgroup: makeObject('col'),
        // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-intable
        // table: oneObject('caption,colgroup,tbody,thead,tfoot,style,script,template,#document-fragment'),
        // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-inhead
        head: makeObject('base,basefont,bgsound,link,style,script,meta,title,noscript,noframes'),
        // https://html.spec.whatwg.org/multipage/semantics.html#the-html-element
        html: oneObject('head,body')
    };

    /**
     * ------------------------------------------------------------
     * avalon2.2.6的新式lexer
     * 将字符串变成一个虚拟DOM树,方便以后进一步变成模板函数
     * 此阶段只会生成VElement,VText,VComment
     * ------------------------------------------------------------
     */
    var specalTag = { xmp: 1, style: 1, script: 1, noscript: 1, textarea: 1, '#comment': 1, template: 1 };
    var hiddenTag = { style: 1, script: 1, noscript: 1, template: 1 };
    var rcontent = /\S/; //判定里面有没有内容
    var rsp = /\s/;
    function fromString(str) {
        return from(str);
    }
    avalon.lexer = fromString;

    var strCache = new Cache(100);

    function from(str) {
        var cacheKey = str;
        var cached = strCache.get(cacheKey);
        if (cached) {
            return avalon.mix(true, [], cached);
        }

        var ret = parse(str, false);
        strCache.put(cacheKey, avalon.mix(true, [], ret));
        return ret;
    }

    /**
     * 
     * 
     * @param {any} string 
     * @param {any} getOne 只返回一个节点
     * @returns 
     */
    function parse(string, getOne) {
        getOne = getOne === void 666 || getOne === true;
        var ret = lexer(string, getOne);
        if (getOne) {
            return typeof ret[0] === 'string' ? ret[1] : ret[0];
        }
        return ret;
    }

    function lexer(string, getOne) {
        var tokens = [];
        var breakIndex = 9990;
        var stack = [];
        var origString = string;
        var origLength = string.length;

        stack.last = function () {
            return stack[stack.length - 1];
        };
        var ret = [];

        function addNode(node) {
            var p = stack.last();
            if (p && p.children) {
                p.children.push(node);
            } else {
                ret.push(node);
            }
        }

        var lastNode;
        do {
            if (--breakIndex === 0) {
                break;
            }
            var arr = getCloseTag(string);

            if (arr) {
                //处理关闭标签
                string = string.replace(arr[0], '');
                var _node = stack.pop();
                if (!_node) {
                    throw '是不是有属性值没有用引号括起';
                }
                //处理下面两种特殊情况：
                //1. option会自动移除元素节点，将它们的nodeValue组成新的文本节点
                //2. table会将没有被thead, tbody, tfoot包起来的tr或文本节点，收集到一个新的tbody元素中

                if (_node.nodeName === 'option') {
                    _node.children = [{
                        nodeName: '#text',
                        nodeValue: getText(_node)
                    }];
                } else if (_node.nodeName === 'table') {
                    insertTbody(_node.children);
                }
                lastNode = null;
                if (getOne && ret.length === 1 && !stack.length) {
                    return [origString.slice(0, origLength - string.length), ret[0]];
                }
                continue;
            }

            var arr = getOpenTag(string);
            if (arr) {
                string = string.replace(arr[0], '');
                var node = arr[1];
                addNode(node);
                var selfClose = !!(node.isVoidTag || specalTag[node.nodeName]);
                if (!selfClose) {
                    //放到这里可以添加孩子
                    stack.push(node);
                }
                if (getOne && selfClose && !stack.length) {
                    return [origString.slice(0, origLength - string.length), node];
                }
                lastNode = node;
                continue;
            }

            var text = '';
            do {
                //处理<div><<<<<<div>的情况
                var _index = string.indexOf('<');
                if (_index === 0) {
                    text += string.slice(0, 1);
                    string = string.slice(1);
                } else {
                    break;
                }
            } while (string.length);

            //处理<div>{aaa}</div>,<div>xxx{aaa}xxx</div>,<div>xxx</div>{aaa}sss的情况
            var index = string.indexOf('<'); //判定它后面是否存在标签
            if (index === -1) {
                text = string;
                string = '';
            } else {
                var openIndex = string.indexOf(config.openTag);

                if (openIndex !== -1 && openIndex < index) {
                    if (openIndex !== 0) {
                        text += string.slice(0, openIndex);
                    }
                    var dirString = string.slice(openIndex);
                    var textDir = parseTextDir(dirString);
                    text += textDir;
                    string = dirString.slice(textDir.length);
                } else {
                    text += string.slice(0, index);
                    string = string.slice(index);
                }
            }
            var mayNode = addText(lastNode, text, addNode);
            if (mayNode) {
                lastNode = mayNode;
            }
        } while (string.length);
        return ret;
    }

    function addText(lastNode, text, addNode) {
        if (rcontent.test(text)) {
            if (lastNode && lastNode.nodeName === '#text') {
                lastNode.nodeValue += text;
                return lastNode;
            } else {
                lastNode = {
                    nodeName: '#text',
                    nodeValue: text
                };
                addNode(lastNode);
                return lastNode;
            }
        }
    }

    function parseTextDir(string) {
        var closeTag = config.closeTag;
        var openTag = config.openTag;
        var closeTagFirst = closeTag.charAt(0);
        var closeTagLength = closeTag.length;
        var state = 'code',
            quote$$1,
            escape;
        for (var i = openTag.length, n = string.length; i < n; i++) {

            var c = string.charAt(i);
            switch (state) {
                case 'code':
                    if (c === '"' || c === "'") {
                        state = 'string';
                        quote$$1 = c;
                    } else if (c === closeTagFirst) {
                        //如果遇到}
                        if (string.substr(i, closeTagLength) === closeTag) {
                            return string.slice(0, i + closeTagLength);
                        }
                    }
                    break;
                case 'string':
                    if (c === '\\' && /"'/.test(string.charAt(i + 1))) {
                        escape = !escape;
                    }
                    if (c === quote$$1 && !escape) {
                        state = 'code';
                    }
                    break;
            }
        }
        throw '找不到界定符' + closeTag;
    }

    var rtbody = /^(tbody|thead|tfoot)$/;

    function insertTbody(nodes) {
        var tbody = false;
        for (var i = 0, n = nodes.length; i < n; i++) {
            var node = nodes[i];
            if (rtbody.test(node.nodeName)) {
                tbody = false;
                continue;
            }

            if (node.nodeName === 'tr') {
                if (tbody) {
                    nodes.splice(i, 1);
                    tbody.children.push(node);
                    n--;
                    i--;
                } else {
                    tbody = {
                        nodeName: 'tbody',
                        props: {},
                        children: [node]
                    };
                    nodes.splice(i, 1, tbody);
                }
            } else {
                if (tbody) {
                    nodes.splice(i, 1);
                    tbody.children.push(node);
                    n--;
                    i--;
                }
            }
        }
    }

    //<div>{{<div/>}}</div>
    function getCloseTag(string) {
        if (string.indexOf("</") === 0) {
            var match = string.match(/\<\/(\w+[^\s\/\>]*)>/);
            if (match) {
                var tag = match[1];
                string = string.slice(3 + tag.length);
                return [match[0], {
                    nodeName: tag
                }];
            }
        }
        return null;
    }
    var ropenTag = /\<(\w[^\s\/\>]*)/;

    function getOpenTag(string) {
        if (string.indexOf("<") === 0) {
            var i = string.indexOf('<!--'); //处理注释节点
            if (i === 0) {
                var l = string.indexOf('-->');
                if (l === -1) {
                    thow('注释节点没有闭合 ' + string.slice(0, 100));
                }
                var node = {
                    nodeName: '#comment',
                    nodeValue: string.slice(4, l)
                };
                return [string.slice(0, l + 3), node];
            }
            var match = string.match(ropenTag); //处理元素节点
            if (match) {
                var leftContent = match[0],
                    tag = match[1];
                var node = {
                    nodeName: tag,
                    props: {},
                    children: []
                };

                string = string.replace(leftContent, ''); //去掉标签名(rightContent)
                try {
                    var arr = getAttrs(string); //处理属性
                } catch (e) {}
                if (arr) {
                    node.props = arr[1];
                    string = string.replace(arr[0], '');
                    leftContent += arr[0];
                }

                if (string.charAt(0) === '>') {
                    //处理开标签的边界符
                    leftContent += '>';
                    string = string.slice(1);
                    if (voidTag[node.nodeName]) {
                        node.isVoidTag = true;
                    }
                } else if (string.slice(0, 2) === '/>') {
                    //处理开标签的边界符
                    leftContent += '/>';
                    string = string.slice(2);
                    node.isVoidTag = true;
                }

                if (!node.isVoidTag && specalTag[tag]) {
                    //如果是script, style, xmp等元素
                    var closeTag = '</' + tag + '>';
                    var j = string.indexOf(closeTag);
                    var nodeValue = string.slice(0, j);
                    leftContent += nodeValue + closeTag;
                    node.children.push({
                        nodeName: '#text',
                        nodeValue: nodeValue
                    });
                    if (tag === 'textarea') {
                        node.props.type = tag;
                        node.props.value = nodeValue;
                    }
                }
                return [leftContent, node];
            }
        }
    }

    function getText(node) {
        var ret = '';
        node.children.forEach(function (el) {
            if (el.nodeName === '#text') {
                ret += el.nodeValue;
            } else if (el.children && !hiddenTag[el.nodeName]) {
                ret += getText(el);
            }
        });
        return ret;
    }

    function getAttrs(string) {
        var state = 'AttrName',
            attrName = '',
            attrValue = '',
            quote$$1,
            escape,
            props = {};
        for (var i = 0, n = string.length; i < n; i++) {
            var c = string.charAt(i);
            switch (state) {
                case 'AttrName':
                    if (c === '/' && string.charAt(i + 1) === '>' || c === '>') {
                        if (attrName) props[attrName] = attrName;
                        return [string.slice(0, i), props];
                    }
                    if (rsp.test(c)) {
                        if (attrName) {
                            state = 'AttrEqual';
                        }
                    } else if (c === '=') {
                        if (!attrName) {
                            throw '必须指定属性名';
                        }
                        state = 'AttrQuote';
                    } else {
                        attrName += c;
                    }
                    break;
                case 'AttrEqual':
                    if (c === '=') {
                        state = 'AttrQuote';
                    } else if (rcontent.test(c)) {
                        props[attrName] = attrName;
                        attrName = c;
                        state = 'AttrName';
                    }
                    break;
                case 'AttrQuote':
                    if (c === '"' || c === "'") {
                        quote$$1 = c;
                        state = 'AttrValue';
                        escape = false;
                    }
                    break;
                case 'AttrValue':
                    if (c === '\\' && /"'/.test(string.charAt(i + 1))) {
                        escape = !escape;
                    }
                    if (c === '\n') {
                        break;
                    }
                    if (c !== quote$$1) {
                        attrValue += c;
                    } else if (c === quote$$1 && !escape) {
                        props[attrName] = attrValue;
                        attrName = attrValue = '';
                        state = 'AttrName';
                    }
                    break;
            }
        }
        throw '必须关闭标签';
    }

    var rhtml = /<|&#?\w+;/;
    var htmlCache = new Cache(128);
    var rxhtml = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig;

    avalon.parseHTML = function (html) {
        var fragment = createFragment();
        //处理非字符串
        if (typeof html !== 'string') {
            return fragment;
        }
        //处理非HTML字符串
        if (!rhtml.test(html)) {
            return document$1.createTextNode(html);
        }

        html = html.replace(rxhtml, '<$1></$2>').trim();
        var hasCache = htmlCache.get(html);
        if (hasCache) {
            return avalon.cloneNode(hasCache);
        }
        var vnodes = fromString(html);
        for (var i = 0, el; el = vnodes[i++];) {
            var child = avalon.vdom(el, 'toDOM');
            fragment.appendChild(child);
        }
        if (html.length < 1024) {
            htmlCache.put(html, fragment);
        }
        return fragment;
    };

    avalon.innerHTML = function (node, html) {
        var parsed = avalon.parseHTML(html);
        this.clearHTML(node);
        node.appendChild(parsed);
    };

    //https://github.com/karloespiritu/escapehtmlent/blob/master/index.js
    avalon.unescapeHTML = function (html) {
        return String(html).replace(/&quot;/g, '"').replace(/&#39;/g, '\'').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
    };

    avalon.clearHTML = function (node) {
        /* istanbul ignore next */
        while (node.lastChild) {
            node.removeChild(node.lastChild);
        }
        return node;
    };

    //http://www.feiesoft.com/html/events.html
    //http://segmentfault.com/q/1010000000687977/a-1020000000688757
    var canBubbleUp = {
        click: true,
        dblclick: true,
        keydown: true,
        keypress: true,
        keyup: true,
        mousedown: true,
        mousemove: true,
        mouseup: true,
        mouseover: true,
        mouseout: true,
        wheel: true,
        mousewheel: true,
        input: true,
        change: true,
        beforeinput: true,
        compositionstart: true,
        compositionupdate: true,
        compositionend: true,
        select: true,
        //http://blog.csdn.net/lee_magnum/article/details/17761441
        cut: true,
        copy: true,
        paste: true,
        beforecut: true,
        beforecopy: true,
        beforepaste: true,
        focusin: true,
        focusout: true,
        DOMFocusIn: true,
        DOMFocusOut: true,
        DOMActivate: true,
        dragend: true,
        datasetchanged: true
    };

    /* istanbul ignore if */
    var hackSafari = avalon.modern && document$1.ontouchstart;

    //添加fn.bind, fn.unbind, bind, unbind
    avalon.fn.bind = function (type, fn, phase) {
        if (this[0]) {
            //此方法不会链
            return avalon.bind(this[0], type, fn, phase);
        }
    };

    avalon.fn.unbind = function (type, fn, phase) {
        if (this[0]) {
            var args = _slice.call(arguments);
            args.unshift(this[0]);
            avalon.unbind.apply(0, args);
        }
        return this;
    };

    /*绑定事件*/
    avalon.bind = function (elem, type, fn) {
        if (elem.nodeType === 1) {
            var value = elem.getAttribute('avalon-events') || '';
            //如果是使用ms-on-*绑定的回调,其uuid格式为e12122324,
            //如果是使用bind方法绑定的回调,其uuid格式为_12
            var uuid = getShortID(fn);
            var hook = eventHooks[type];
            /* istanbul ignore if */
            if (type === 'click' && hackSafari) {
                elem.addEventListener('click', avalon.noop);
            }
            /* istanbul ignore if */
            if (hook) {
                type = hook.type || type;
                if (hook.fix) {
                    fn = hook.fix(elem, fn);
                    fn.uuid = uuid;
                }
            }
            var key = type + ':' + uuid;
            avalon.eventListeners[fn.uuid] = fn;
            /* istanbul ignore if */
            if (value.indexOf(type + ':') === -1) {
                //同一种事件只绑定一次
                if (canBubbleUp[type] || avalon.modern && focusBlur[type]) {
                    delegateEvent(type);
                } else {
                    avalon._nativeBind(elem, type, dispatch);
                }
            }
            var keys = value.split(',');
            /* istanbul ignore if */
            if (keys[0] === '') {
                keys.shift();
            }
            if (keys.indexOf(key) === -1) {
                keys.push(key);
                setEventId(elem, keys.join(','));
                //将令牌放进avalon-events属性中
            }
            return fn;
        } else {
            /* istanbul ignore next */
            var cb = function cb(e) {
                fn.call(elem, new avEvent(e));
            };

            avalon._nativeBind(elem, type, cb);
            return cb;
        }
    };

    function setEventId(node, value) {
        node.setAttribute('avalon-events', value);
    }
    /* istanbul ignore next */
    avalon.unbind = function (elem, type, fn) {
        if (elem.nodeType === 1) {
            var value = elem.getAttribute('avalon-events') || '';
            switch (arguments.length) {
                case 1:
                    avalon._nativeUnBind(elem, type, dispatch);
                    elem.removeAttribute('avalon-events');
                    break;
                case 2:
                    value = value.split(',').filter(function (str) {
                        return str.indexOf(type + ':') === -1;
                    }).join(',');
                    setEventId(elem, value);
                    break;
                default:
                    var search = type + ':' + fn.uuid;
                    value = value.split(',').filter(function (str) {
                        return str !== search;
                    }).join(',');
                    setEventId(elem, value);
                    delete avalon.eventListeners[fn.uuid];
                    break;
            }
        } else {
            avalon._nativeUnBind(elem, type, fn);
        }
    };

    var typeRegExp = {};

    function collectHandlers(elem, type, handlers) {
        var value = elem.getAttribute('avalon-events');
        if (value && (elem.disabled !== true || type !== 'click')) {
            var uuids = [];
            var reg = typeRegExp[type] || (typeRegExp[type] = new RegExp("\\b" + type + '\\:([^,\\s]+)', 'g'));
            value.replace(reg, function (a, b) {
                uuids.push(b);
                return a;
            });
            if (uuids.length) {
                handlers.push({
                    elem: elem,
                    uuids: uuids
                });
            }
        }
        elem = elem.parentNode;
        var g = avalon.gestureEvents || {};
        if (elem && elem.getAttribute && (canBubbleUp[type] || g[type])) {
            collectHandlers(elem, type, handlers);
        }
    }

    var rhandleHasVm = /^e/;

    function dispatch(event) {
        event = new avEvent(event);
        var type = event.type;
        var elem = event.target;
        var handlers = [];
        collectHandlers(elem, type, handlers);
        var i = 0,
            j,
            uuid,
            handler;
        while ((handler = handlers[i++]) && !event.cancelBubble) {
            var host = event.currentTarget = handler.elem;
            j = 0;
            while (uuid = handler.uuids[j++]) {
                if (event.stopImmediate) {
                    break;
                }
                var fn = avalon.eventListeners[uuid];
                if (fn) {
                    var vm = rhandleHasVm.test(uuid) ? handler.elem._ms_context_ : 0;
                    if (vm && vm.$hashcode === false) {
                        return avalon.unbind(elem, type, fn);
                    }
                    var ret = fn.call(vm || elem, event);

                    if (ret === false) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                }
            }
        }
    }

    var focusBlur = {
        focus: true,
        blur: true
    };

    function delegateEvent(type) {
        var value = root.getAttribute('delegate-events') || '';
        if (value.indexOf(type) === -1) {
            //IE6-8会多次绑定同种类型的同一个函数,其他游览器不会
            var arr = value.match(avalon.rword) || [];
            arr.push(type);
            root.setAttribute('delegate-events', arr.join(','));
            avalon._nativeBind(root, type, dispatch, !!focusBlur[type]);
        }
    }

    var eventProto = {
        webkitMovementY: 1,
        webkitMovementX: 1,
        keyLocation: 1,
        fixEvent: function fixEvent() {},
        preventDefault: function preventDefault() {
            var e = this.originalEvent || {};
            e.returnValue = this.returnValue = false;
            if (modern && e.preventDefault) {
                e.preventDefault();
            }
        },
        stopPropagation: function stopPropagation() {
            var e = this.originalEvent || {};
            e.cancelBubble = this.cancelBubble = true;
            if (modern && e.stopPropagation) {
                e.stopPropagation();
            }
        },
        stopImmediatePropagation: function stopImmediatePropagation() {
            this.stopPropagation();
            this.stopImmediate = true;
        },
        toString: function toString() {
            return '[object Event]'; //#1619
        }
    };

    function avEvent(event) {
        if (event.originalEvent) {
            return event;
        }
        for (var i in event) {
            if (!eventProto[i]) {
                this[i] = event[i];
            }
        }
        if (!this.target) {
            this.target = event.srcElement;
        }
        var target = this.target;
        this.fixEvent();
        this.timeStamp = new Date() - 0;
        this.originalEvent = event;
    }
    avEvent.prototype = eventProto;
    //针对firefox, chrome修正mouseenter, mouseleave
    /* istanbul ignore if */
    if (!('onmouseenter' in root)) {
        avalon.each({
            mouseenter: 'mouseover',
            mouseleave: 'mouseout'
        }, function (origType, fixType) {
            eventHooks[origType] = {
                type: fixType,
                fix: function fix(elem, fn) {
                    return function (e) {
                        var t = e.relatedTarget;
                        if (!t || t !== elem && !(elem.compareDocumentPosition(t) & 16)) {
                            delete e.type;
                            e.type = origType;
                            return fn.apply(this, arguments);
                        }
                    };
                }
            };
        });
    }
    //针对IE9+, w3c修正animationend
    avalon.each({
        AnimationEvent: 'animationend',
        WebKitAnimationEvent: 'webkitAnimationEnd'
    }, function (construct, fixType) {
        if (window$1[construct] && !eventHooks.animationend) {
            eventHooks.animationend = {
                type: fixType
            };
        }
    });

    /* istanbul ignore if */
    if (!("onmousewheel" in document$1)) {
        /* IE6-11 chrome mousewheel wheelDetla 下 -120 上 120
         firefox DOMMouseScroll detail 下3 上-3
         firefox wheel detlaY 下3 上-3
         IE9-11 wheel deltaY 下40 上-40
         chrome wheel deltaY 下100 上-100 */
        var fixWheelType = document$1.onwheel !== void 0 ? 'wheel' : 'DOMMouseScroll';
        var fixWheelDelta = fixWheelType === 'wheel' ? 'deltaY' : 'detail';
        eventHooks.mousewheel = {
            type: fixWheelType,
            fix: function fix(elem, fn) {
                return function (e) {
                    var delta = e[fixWheelDelta] > 0 ? -120 : 120;
                    e.wheelDelta = ~~elem._ms_wheel_ + delta;
                    elem._ms_wheel_ = e.wheelDeltaY = e.wheelDelta;
                    e.wheelDeltaX = 0;
                    if (Object.defineProperty) {
                        Object.defineProperty(e, 'type', {
                            value: 'mousewheel'
                        });
                    }
                    return fn.apply(this, arguments);
                };
            }
        };
    }

    /* istanbul ignore if */
    if (!modern) {
        delete canBubbleUp.change;
        delete canBubbleUp.select;
    }
    /* istanbul ignore next */
    avalon._nativeBind = modern ? function (el, type, fn, capture) {
        el.addEventListener(type, fn, !!capture);
    } : function (el, type, fn) {
        el.attachEvent('on' + type, fn);
    };
    /* istanbul ignore next */
    avalon._nativeUnBind = modern ? function (el, type, fn, a) {
        el.removeEventListener(type, fn, !!a);
    } : function (el, type, fn) {
        el.detachEvent('on' + type, fn);
    };
    /* istanbul ignore next */
    avalon.fireDom = function (elem, type, opts) {
        if (document$1.createEvent) {
            var hackEvent = document$1.createEvent('Events');
            hackEvent.initEvent(type, true, true, opts);
            avalon.shadowCopy(hackEvent, opts);
            elem.dispatchEvent(hackEvent);
        } else if (root.contains(elem)) {
            //IE6-8触发事件必须保证在DOM树中,否则报'SCRIPT16389: 未指明的错误'
            hackEvent = document$1.createEventObject();
            if (opts) avalon.shadowCopy(hackEvent, opts);
            try {
                elem.fireEvent('on' + type, hackEvent);
            } catch (e) {
                avalon.log('fireDom', type, 'args error');
            }
        }
    };

    var rmouseEvent = /^(?:mouse|contextmenu|drag)|click/;
    /* istanbul ignore next */
    avEvent.prototype.fixEvent = function () {
        var event = this;
        if (event.which == null && event.type.indexOf('key') === 0) {
            event.which = event.charCode != null ? event.charCode : event.keyCode;
        }
        if (rmouseEvent.test(event.type) && !('pageX' in event)) {
            var DOC = event.target.ownerDocument || document$1;
            var box = DOC.compatMode === 'BackCompat' ? DOC.body : DOC.documentElement;
            event.pageX = event.clientX + (box.scrollLeft >> 0) - (box.clientLeft >> 0);
            event.pageY = event.clientY + (box.scrollTop >> 0) - (box.clientTop >> 0);
            event.wheelDeltaY = ~~event.wheelDelta;
            event.wheelDeltaX = 0;
        }
    };

    //针对IE6-8修正input
    /* istanbul ignore if */
    if (!('oninput' in document$1.createElement('input'))) {
        eventHooks.input = {
            type: 'propertychange',
            fix: function fix(elem, fn) {
                return function (e) {
                    if (e.propertyName === 'value') {
                        e.type = 'input';
                        return fn.apply(this, arguments);
                    }
                };
            }
        };
    }

    var readyList = [];

    function fireReady(fn) {
        avalon.isReady = true;
        while (fn = readyList.shift()) {
            fn(avalon);
        }
    }

    avalon.ready = function (fn) {
        readyList.push(fn);
        if (avalon.isReady) {
            fireReady();
        }
    };

    avalon.ready(function () {
        avalon.scan && avalon.scan(document$1.body);
    });

    /* istanbul ignore next */
    function bootstrap() {
        function doScrollCheck() {
            try {
                //IE下通过doScrollCheck检测DOM树是否建完
                root.doScroll('left');
                fireReady();
            } catch (e) {
                setTimeout(doScrollCheck);
            }
        }
        if (document$1.readyState === 'complete') {
            setTimeout(fireReady); //如果在domReady之外加载
        } else if (document$1.addEventListener) {
            document$1.addEventListener('DOMContentLoaded', fireReady, false);
        } else if (document$1.attachEvent) {
            //必须传入三个参数，否则在firefox4-26中报错
            //caught exception: [Exception... "Not enough arguments"  nsresult: "0x
            document$1.attachEvent('onreadystatechange', function () {
                if (document$1.readyState === 'complete') {
                    fireReady();
                }
            });
            try {
                var isTop = window$1.frameElement === null;
            } catch (e) {}
            if (root.doScroll && isTop && window$1.external) {
                //fix IE iframe BUG
                doScrollCheck();
            }
        }

        avalon.bind(window$1, 'load', fireReady);
    }
    if (inBrowser) {
        bootstrap();
    }

    /**
     * ------------------------------------------------------------
     *                          DOM Api
     * shim,class,data,css,val,html,event,ready  
     * ------------------------------------------------------------
     */

    var orphanTag = {
        script: 1,
        style: 1,
        textarea: 1,
        xmp: 1,
        noscript: 1,
        template: 1
    };

    /* 
     *  此模块只用于文本转虚拟DOM, 
     *  因为在真实浏览器会对我们的HTML做更多处理,
     *  如, 添加额外属性, 改变结构
     *  此模块就是用于模拟这些行为
     */
    function makeOrphan(node, nodeName, innerHTML) {
        switch (nodeName) {
            case 'style':
            case 'script':
            case 'noscript':
            case 'template':
            case 'xmp':
                node.children = [{
                    nodeName: '#text',
                    nodeValue: innerHTML
                }];
                break;
            case 'textarea':
                var props = node.props;
                props.type = nodeName;
                props.value = innerHTML;
                node.children = [{
                    nodeName: '#text',
                    nodeValue: innerHTML
                }];
                break;
            case 'option':
                node.children = [{
                    nodeName: '#text',
                    nodeValue: trimHTML(innerHTML)
                }];
                break;
        }
    }

    //专门用于处理option标签里面的标签
    var rtrimHTML = /<\w+(\s+("[^"]*"|'[^']*'|[^>])+)?>|<\/\w+>/gi;
    function trimHTML(v) {
        return String(v).replace(rtrimHTML, '').trim();
    }

    //widget rule duplex validate

    function fromDOM(dom) {
        return [from$1(dom)];
    }

    function from$1(node) {
        var type = node.nodeName.toLowerCase();
        switch (type) {
            case '#text':
            case '#comment':
                return {
                    nodeName: type,
                    dom: node,
                    nodeValue: node.nodeValue
                };
            default:
                var props = markProps(node, node.attributes || []);
                var vnode = {
                    nodeName: type,
                    dom: node,
                    isVoidTag: !!voidTag[type],
                    props: props
                };
                if (type === 'option') {
                    //即便你设置了option.selected = true,
                    //option.attributes也找不到selected属性
                    props.selected = node.selected;
                }
                if (orphanTag[type] || type === 'option') {
                    makeOrphan(vnode, type, node.text || node.innerHTML);
                    if (node.childNodes.length === 1) {
                        vnode.children[0].dom = node.firstChild;
                    }
                } else if (!vnode.isVoidTag) {
                    vnode.children = [];
                    for (var i = 0, el; el = node.childNodes[i++];) {
                        var child = from$1(el);
                        if (/\S/.test(child.nodeValue)) {
                            vnode.children.push(child);
                        }
                    }
                }
                return vnode;
        }
    }

    var rformElement = /input|textarea|select/i;

    function markProps(node, attrs) {
        var ret = {};
        for (var i = 0, n = attrs.length; i < n; i++) {
            var attr = attrs[i];
            if (attr.specified) {
                //IE6-9不会将属性名变小写,比如它会将用户的contenteditable变成contentEditable
                ret[attr.name.toLowerCase()] = attr.value;
            }
        }
        if (rformElement.test(node.nodeName)) {
            ret.type = node.type;
            var a = node.getAttributeNode('value');
            if (a && /\S/.test(a.value)) {
                //IE6,7中无法取得checkbox,radio的value
                ret.value = a.value;
            }
        }
        var style = node.style.cssText;
        if (style) {
            ret.style = style;
        }
        //类名 = 去重(静态类名+动态类名+ hover类名? + active类名)
        if (ret.type === 'select-one') {
            ret.selectedIndex = node.selectedIndex;
        }
        return ret;
    }

    function VText(text) {
        this.nodeName = '#text';
        this.nodeValue = text;
    }

    VText.prototype = {
        constructor: VText,
        toDOM: function toDOM() {
            /* istanbul ignore if*/
            if (this.dom) return this.dom;
            var v = avalon._decode(this.nodeValue);
            return this.dom = document$1.createTextNode(v);
        },
        toHTML: function toHTML() {
            return this.nodeValue;
        }
    };

    function VComment(text) {
        this.nodeName = '#comment';
        this.nodeValue = text;
    }
    VComment.prototype = {
        constructor: VComment,
        toDOM: function toDOM() {
            if (this.dom) return this.dom;
            return this.dom = document$1.createComment(this.nodeValue);
        },
        toHTML: function toHTML() {
            return '<!--' + this.nodeValue + '-->';
        }
    };

    function VElement(type, props, children, isVoidTag) {
        this.nodeName = type;
        this.props = props;
        this.children = children;
        this.isVoidTag = isVoidTag;
    }
    VElement.prototype = {
        constructor: VElement,
        toDOM: function toDOM() {
            if (this.dom) return this.dom;
            var dom,
                tagName = this.nodeName;
            if (avalon.modern && svgTags[tagName]) {
                dom = createSVG(tagName);
                /* istanbul ignore next*/
            } else if (!avalon.modern && (VMLTags[tagName] || rvml.test(tagName))) {
                dom = createVML(tagName);
            } else {
                dom = document$1.createElement(tagName);
            }

            var props = this.props || {};

            for (var i in props) {
                var val = props[i];
                if (skipFalseAndFunction(val)) {
                    /* istanbul ignore if*/
                    if (specalAttrs[i] && avalon.msie < 8) {
                        specalAttrs[i](dom, val);
                    } else {
                        dom.setAttribute(i, val + '');
                    }
                }
            }
            var c = this.children || [];
            var template = c[0] ? c[0].nodeValue : '';
            switch (this.nodeName) {
                case 'script':
                    dom.type = 'noexec';
                    dom.text = template;
                    try {
                        dom.innerHTML = template;
                    } catch (e) {}
                    dom.type = props.type || '';
                    break;
                case 'noscript':
                    dom.textContent = template;
                case 'style':
                case 'xmp':
                case 'template':
                    try {
                        dom.innerHTML = template;
                    } catch (e) {
                        /* istanbul ignore next*/
                        hackIE(dom, this.nodeName, template);
                    }
                    break;
                case 'option':
                    //IE6-8,为option添加文本子节点,不会同步到text属性中
                    /* istanbul ignore next */
                    if (msie$1 < 9) dom.text = template;
                default:
                    /* istanbul ignore next */
                    if (!this.isVoidTag && this.children) {
                        this.children.forEach(function (el) {
                            return c && dom.appendChild(avalon.vdom(c, 'toDOM'));
                        });
                    }
                    break;
            }
            return this.dom = dom;
        },

        /* istanbul ignore next */

        toHTML: function toHTML() {
            var arr = [];
            var props = this.props || {};
            for (var i in props) {
                var val = props[i];
                if (skipFalseAndFunction(val)) {
                    arr.push(i + '=' + avalon.quote(props[i] + ''));
                }
            }
            arr = arr.length ? ' ' + arr.join(' ') : '';
            var str = '<' + this.nodeName + arr;
            if (this.isVoidTag) {
                return str + '/>';
            }
            str += '>';
            if (this.children) {
                str += this.children.map(function (el) {
                    return el ? avalon.vdom(el, 'toHTML') : '';
                }).join('');
            }
            return str + '</' + this.nodeName + '>';
        }
    };
    function hackIE(dom, nodeName, template) {
        switch (nodeName) {
            case 'style':
                dom.setAttribute('type', 'text/css');
                dom.styleSheet.cssText = template;
                break;
            case 'xmp': //IE6-8,XMP元素里面只能有文本节点,不能使用innerHTML
            case 'noscript':
                dom.textContent = template;
                break;
        }
    }
    function skipFalseAndFunction(a) {
        return a !== false && Object(a) !== a;
    }
    /* istanbul ignore next */
    var specalAttrs = {
        "class": function _class(dom, val) {
            dom.className = val;
        },
        style: function style(dom, val) {
            dom.style.cssText = val;
        },
        type: function type(dom, val) {
            try {
                //textarea,button 元素在IE6,7设置 type 属性会抛错
                dom.type = val;
            } catch (e) {}
        },
        'for': function _for(dom, val) {
            dom.setAttribute('for', val);
            dom.htmlFor = val;
        }
    };

    function createSVG(type) {
        return document$1.createElementNS('http://www.w3.org/2000/svg', type);
    }
    var svgTags = avalon.oneObject('circle,defs,ellipse,image,line,' + 'path,polygon,polyline,rect,symbol,text,use,g,svg');

    var rvml = /^\w+\:\w+/;
    /* istanbul ignore next*/
    function createVML(type) {
        if (document$1.styleSheets.length < 31) {
            document$1.createStyleSheet().addRule(".rvml", "behavior:url(#default#VML)");
        } else {
            // no more room, add to the existing one
            // http://msdn.microsoft.com/en-us/library/ms531194%28VS.85%29.aspx
            document$1.styleSheets[0].addRule(".rvml", "behavior:url(#default#VML)");
        }
        var arr = type.split(':');
        if (arr.length === 1) {
            arr.unshift('v');
        }
        var tag = arr[1];
        var ns = arr[0];
        if (!document$1.namespaces[ns]) {
            document$1.namespaces.add(ns, "urn:schemas-microsoft-com:vml");
        }
        return document$1.createElement('<' + ns + ':' + tag + ' class="rvml">');
    }

    var VMLTags = avalon.oneObject('shape,line,polyline,rect,roundrect,oval,arc,' + 'curve,background,image,shapetype,group,fill,' + 'stroke,shadow, extrusion, textbox, imagedata, textpath');

    function VFragment(children, key, val, index) {
        this.nodeName = '#document-fragment';
        this.children = children;
        this.key = key;
        this.val = val;
        this.index = index;
        this.props = {};
    }
    VFragment.prototype = {
        constructor: VFragment,
        toDOM: function toDOM() {
            if (this.dom) return this.dom;
            var f = this.toFragment();
            //IE6-11 docment-fragment都没有children属性 
            this.split = f.lastChild;
            return this.dom = f;
        },
        dispose: function dispose() {
            this.toFragment();
            this.innerRender && this.innerRender.dispose();
            for (var i in this) {
                this[i] = null;
            }
        },
        toFragment: function toFragment() {
            var f = createFragment();
            this.children.forEach(function (el) {
                return f.appendChild(avalon.vdom(el, 'toDOM'));
            });
            return f;
        },
        toHTML: function toHTML() {
            var c = this.children;
            return c.map(function (el) {
                return avalon.vdom(el, 'toHTML');
            }).join('');
        }
    };

    /**
     * 虚拟DOM的4大构造器
     */
    avalon.mix(avalon, {
        VText: VText,
        VComment: VComment,
        VElement: VElement,
        VFragment: VFragment
    });

    var constNameMap = {
        '#text': 'VText',
        '#document-fragment': 'VFragment',
        '#comment': 'VComment'
    };

    var vdom = avalon.vdomAdaptor = avalon.vdom = function (obj, method) {
        if (!obj) {
            //obj在ms-for循环里面可能是null
            return method === "toHTML" ? '' : createFragment();
        }
        var nodeName = obj.nodeName;
        if (!nodeName) {
            return new avalon.VFragment(obj)[method]();
        }
        var constName = constNameMap[nodeName] || 'VElement';
        return avalon[constName].prototype[method].call(obj);
    };

    avalon.domize = function (a) {
        return avalon.vdom(a, 'toDOM');
    };

    avalon.pendingActions = [];
    avalon.uniqActions = {};
    avalon.inTransaction = 0;
    config.trackDeps = false;
    avalon.track = function () {
        if (config.trackDeps) {
            avalon.log.apply(avalon, arguments);
        }
    };

    /**
     * Batch is a pseudotransaction, just for purposes of memoizing ComputedValues when nothing else does.
     * During a batch `onBecomeUnobserved` will be called at most once per observable.
     * Avoids unnecessary recalculations.
     */

    function runActions() {
        if (avalon.isRunningActions === true || avalon.inTransaction > 0) return;
        avalon.isRunningActions = true;
        var tasks = avalon.pendingActions.splice(0, avalon.pendingActions.length);
        for (var i = 0, task; task = tasks[i++];) {
            task.update();
            delete avalon.uniqActions[task.uuid];
        }
        avalon.isRunningActions = false;
    }

    function propagateChanged(target) {
        var list = target.observers;
        for (var i = 0, el; el = list[i++];) {
            el.schedule(); //通知action, computed做它们该做的事
        }
    }

    //将自己抛到市场上卖
    function reportObserved(target) {
        var action = avalon.trackingAction || null;
        if (action !== null) {

            avalon.track('征收到', target.expr);
            action.mapIDs[target.uuid] = target;
        }
    }

    var targetStack = [];

    function collectDeps(action, getter) {
        if (!action.observers) return;
        var preAction = avalon.trackingAction;
        if (preAction) {
            targetStack.push(preAction);
        }
        avalon.trackingAction = action;
        avalon.track('【action】', action.type, action.expr, '开始征收依赖项');
        //多个observe持有同一个action
        action.mapIDs = {}; //重新收集依赖
        var hasError = true,
            result;
        try {
            result = getter.call(action);
            hasError = false;
        } finally {
            if (hasError) {
                avalon.warn('collectDeps fail', getter + '');
                action.mapIDs = {};
                avalon.trackingAction = preAction;
            } else {
                // 确保它总是为null
                avalon.trackingAction = targetStack.pop();
                try {
                    resetDeps(action);
                } catch (e) {
                    avalon.warn(e);
                }
            }
            return result;
        }
    }

    function resetDeps(action) {
        var prev = action.observers,
            curr = [],
            checked = {},
            ids = [];
        for (var i in action.mapIDs) {
            var dep = action.mapIDs[i];
            if (!dep.isAction) {
                if (!dep.observers) {
                    //如果它已经被销毁
                    delete action.mapIDs[i];
                    continue;
                }
                ids.push(dep.uuid);
                curr.push(dep);
                checked[dep.uuid] = 1;
                if (dep.lastAccessedBy === action.uuid) {
                    continue;
                }
                dep.lastAccessedBy = action.uuid;
                avalon.Array.ensure(dep.observers, action);
            }
        }
        var ids = ids.sort().join(',');
        if (ids === action.ids) {
            return;
        }
        action.ids = ids;
        if (!action.isComputed) {
            action.observers = curr;
        } else {
            action.depsCount = curr.length;
            action.deps = avalon.mix({}, action.mapIDs);
            action.depsVersion = {};
            for (var _i in action.mapIDs) {
                var _dep = action.mapIDs[_i];
                action.depsVersion[_dep.uuid] = _dep.version;
            }
        }

        for (var _i2 = 0, _dep2; _dep2 = prev[_i2++];) {
            if (!checked[_dep2.uuid]) {
                avalon.Array.remove(_dep2.observers, action);
            }
        }
    }

    function transaction(action, thisArg, args) {
        args = args || [];
        var name = 'transaction ' + (action.name || action.displayName || 'noop');
        transactionStart(name);
        var res = action.apply(thisArg, args);
        transactionEnd(name);
        return res;
    }
    avalon.transaction = transaction;

    function transactionStart(name) {
        avalon.inTransaction += 1;
    }

    function transactionEnd(name) {
        if (--avalon.inTransaction === 0) {
            avalon.isRunningActions = false;
            runActions();
        }
    }

    /* 
     * 将要检测的字符串的字符串替换成??123这样的格式
     */
    var stringNum = 0;
    var stringPool = {
        map: {}
    };
    var rfill = /\?\?\d+/g;
    function dig(a) {
        var key = '??' + stringNum++;
        stringPool.map[key] = a;
        return key + ' ';
    }
    function fill(a) {
        var val = stringPool.map[a];
        return val;
    }
    function clearString(str) {
        var array = readString(str);
        for (var i = 0, n = array.length; i < n; i++) {
            str = str.replace(array[i], dig);
        }
        return str;
    }
    //https://github.com/RubyLouvre/avalon/issues/1944
    function readString(str, i, ret) {
        var end = false,
            s = 0,
            i = i || 0;
        ret = ret || [];
        for (var n = str.length; i < n; i++) {
            var c = str.charAt(i);
            if (!end) {
                if (c === "'") {
                    end = "'";
                    s = i;
                } else if (c === '"') {
                    end = '"';
                    s = i;
                }
            } else {
                if (c === end) {
                    ret.push(str.slice(s, i + 1));
                    end = false;
                }
            }
        }
        if (end !== false) {
            return readString(str, s + 1, ret);
        }
        return ret;
    }

    var keyMap = avalon.oneObject("break,case,catch,continue,debugger,default,delete,do,else,false," + "finally,for,function,if,in,instanceof,new,null,return,switch,this," + "throw,true,try,typeof,var,void,while,with," + /* 关键字*/
    "abstract,boolean,byte,char,class,const,double,enum,export,extends," + "final,float,goto,implements,import,int,interface,long,native," + "package,private,protected,public,short,static,super,synchronized," + "throws,transient,volatile,arguments");

    var skipMap = avalon.mix({
        Math: 1,
        Date: 1,
        $event: 1,
        window: 1,
        __vmodel__: 1,
        avalon: 1
    }, keyMap);

    var rvmKey = /(^|[^\w\u00c0-\uFFFF_])(@|##)(?=[$\w])/g;
    var ruselessSp = /\s*(\.|\|)\s*/g;
    var rshortCircuit = /\|\|/g;
    var brackets = /\(([^)]*)\)/;
    var rpipeline = /\|(?=\?\?)/;
    var rregexp = /(^|[^/])\/(?!\/)(\[.+?]|\\.|[^/\\\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})]))/g;
    var robjectProp = /\.[\w\.\$]+/g; //对象的属性 el.xxx 中的xxx
    var robjectKey = /(\{|\,)\s*([\$\w]+)\s*:/g; //对象的键名与冒号 {xxx:1,yyy: 2}中的xxx, yyy
    var rfilterName = /\|(\w+)/g;
    var rlocalVar = /[$a-zA-Z_][$a-zA-Z0-9_]*/g;

    var exprCache = new Cache(300);

    function addScopeForLocal(str) {
        return str.replace(robjectProp, dig).replace(rlocalVar, function (el) {
            if (!skipMap[el]) {
                return "__vmodel__." + el;
            }
            return el;
        });
    }

    function addScope(expr, type) {
        var cacheKey = expr + ':' + type;
        var cache = exprCache.get(cacheKey);
        if (cache) {
            return cache.slice(0);
        }

        stringPool.map = {};
        //https://github.com/RubyLouvre/avalon/issues/1849
        var input = expr.replace(rregexp, function (a, b) {
            return b + dig(a.slice(b.length));
        }); //移除所有正则
        input = clearString(input); //移除所有字符串
        input = input.replace(rshortCircuit, dig). //移除所有短路运算符
        replace(ruselessSp, '$1'). //移除.|两端空白

        replace(robjectKey, function (_, a, b) {
            //移除所有键名
            return a + dig(b) + ':'; //比如 ms-widget="[{is:'ms-address-wrap', $id:'address'}]"这样极端的情况 
        }).replace(rvmKey, '$1__vmodel__.'). //转换@与##为__vmodel__
        replace(rfilterName, function (a, b) {
            //移除所有过滤器的名字
            return '|' + dig(b);
        });
        input = addScopeForLocal(input); //在本地变量前添加__vmodel__

        var filters = input.split(rpipeline); //根据管道符切割表达式
        var body = filters.shift().replace(rfill, fill).trim();
        if (/\?\?\d/.test(body)) {
            body = body.replace(rfill, fill);
        }
        if (filters.length) {
            filters = filters.map(function (filter) {
                var bracketArgs = '';
                filter = filter.replace(brackets, function (a, b) {
                    if (/\S/.test(b)) {
                        bracketArgs += ',' + b; //还原字符串,正则,短路运算符
                    }
                    return '';
                });
                var arg = '[' + avalon.quote(filter.trim()) + bracketArgs + ']';
                return arg;
            });
            filters = 'avalon.composeFilters(' + filters + ')(__value__)';
            filters = filters.replace(rfill, fill);
        } else {
            filters = '';
        }
        return exprCache.put(cacheKey, [body, filters]);
    }
    var rhandleName = /^__vmodel__\.[$\w\.]+$/;
    var rfixIE678 = /__vmodel__\.([^(]+)\(([^)]*)\)/;
    function makeHandle(body) {
        if (rhandleName.test(body)) {
            body = body + '($event)';
        }
        /* istanbul ignore if */
        if (msie$1 < 9) {
            body = body.replace(rfixIE678, function (a, b, c) {
                return '__vmodel__.' + b + '.call(__vmodel__' + (/\S/.test(c) ? ',' + c : '') + ')';
            });
        }
        return body;
    }
    function createGetter(expr, type) {
        var arr = addScope(expr, type),
            body;
        if (!arr[1]) {
            body = arr[0];
        } else {
            body = arr[1].replace(/__value__\)$/, arr[0] + ')');
        }
        try {
            return new Function('__vmodel__', 'return ' + body + ';');
            /* istanbul ignore next */
        } catch (e) {
            avalon.log('parse getter: [', expr, body, ']error');
            return avalon.noop;
        }
    }

    /**
     * 生成表达式设值函数
     * @param  {String}  expr
     */
    function createSetter(expr, type) {
        var arr = addScope(expr, type);
        var body = 'try{ ' + arr[0] + ' = __value__}catch(e){avalon.log(e, "in on dir")}';
        try {
            return new Function('__vmodel__', '__value__', body + ';');
            /* istanbul ignore next */
        } catch (e) {
            avalon.log('parse setter: ', expr, ' error');
            return avalon.noop;
        }
    }

    var actionUUID = 1;
    //需要重构
    function Action(vm, options, callback) {
        for (var i in options) {
            if (protectedMenbers[i] !== 1) {
                this[i] = options[i];
            }
        }

        this.vm = vm;
        this.observers = [];
        this.callback = callback;
        this.uuid = ++actionUUID;
        this.ids = '';
        this.mapIDs = {}; //这个用于去重
        this.isAction = true;
        var expr = this.expr;
        // 缓存取值函数
        if (typeof this.getter !== 'function') {
            this.getter = createGetter(expr, this.type);
        }
        // 缓存设值函数（双向数据绑定）
        if (this.type === 'duplex') {
            this.setter = createSetter(expr, this.type);
        }
        // 缓存表达式旧值
        this.value = NaN;
        // 表达式初始值 & 提取依赖
        if (!this.node) {
            this.value = this.get();
        }
    }

    Action.prototype = {
        getValue: function getValue() {
            var scope = this.vm;
            try {
                return this.getter.call(scope, scope);
            } catch (e) {
                avalon.log(this.getter + ' exec error');
            }
        },
        setValue: function setValue(value) {
            var scope = this.vm;
            if (this.setter) {
                this.setter.call(scope, scope, value);
            }
        },

        // get --> getValue --> getter
        get: function get(fn) {
            var name = 'action track ' + this.type;

            if (this.deep) {
                avalon.deepCollect = true;
            }

            var value = collectDeps(this, this.getValue);
            if (this.deep && avalon.deepCollect) {
                avalon.deepCollect = false;
            }

            return value;
        },

        /**
         * 在更新视图前保存原有的value
         */
        beforeUpdate: function beforeUpdate() {
            return this.oldValue = getPlainObject(this.value);
        },
        update: function update(args, uuid) {
            var oldVal = this.beforeUpdate();
            var newVal = this.value = this.get();
            var callback = this.callback;
            if (callback && this.diff(newVal, oldVal, args)) {
                callback.call(this.vm, this.value, oldVal, this.expr);
            }
            this._isScheduled = false;
        },
        schedule: function schedule() {
            if (!this._isScheduled) {
                this._isScheduled = true;
                if (!avalon.uniqActions[this.uuid]) {
                    avalon.uniqActions[this.uuid] = 1;
                    avalon.pendingActions.push(this);
                }

                runActions(); //这里会还原_isScheduled
            }
        },
        removeDepends: function removeDepends() {
            var self = this;
            this.observers.forEach(function (depend) {
                avalon.Array.remove(depend.observers, self);
            });
        },

        /**
         * 比较两个计算值是否,一致,在for, class等能复杂数据类型的指令中,它们会重写diff复法
         */
        diff: function diff(a, b) {
            return a !== b;
        },

        /**
         * 销毁指令
         */
        dispose: function dispose() {
            this.value = null;
            this.removeDepends();
            if (this.beforeDispose) {
                this.beforeDispose();
            }
            for (var i in this) {
                delete this[i];
            }
        }
    };

    function getPlainObject(v) {
        if (v && (typeof v === 'undefined' ? 'undefined' : _typeof(v)) === 'object') {
            if (v && v.$events) {
                return v.$model;
            } else if (Array.isArray(v)) {
                var ret = [];
                for (var i = 0, n = v.length; i < n; i++) {
                    ret.push(getPlainObject(v[i]));
                }
                return ret;
            } else {
                var _ret = {};
                for (var _i3 in v) {
                    _ret[_i3] = getPlainObject(v[_i3]);
                }
                return _ret;
            }
        } else {
            return v;
        }
    }

    var protectedMenbers = {
        vm: 1,
        callback: 1,

        observers: 1,
        oldValue: 1,
        value: 1,
        getValue: 1,
        setValue: 1,
        get: 1,

        removeDepends: 1,
        beforeUpdate: 1,
        update: 1,
        //diff
        //getter
        //setter
        //expr
        //vdom
        //type: "for"
        //name: "ms-for"
        //attrName: ":for"
        //param: "click"
        //beforeDispose
        dispose: 1
    };

    /**
    * 
     与Computed等共享UUID
    */
    var obid = 1;
    function Mutation(expr, value, vm) {
        //构造函数
        this.expr = expr;
        if (value) {
            var childVm = platform.createProxy(value, this);
            if (childVm) {
                value = childVm;
            }
        }
        this.value = value;
        this.vm = vm;
        try {
            vm.$mutations[expr] = this;
        } catch (ignoreIE) {}
        this.uuid = ++obid;
        this.updateVersion();
        this.mapIDs = {};
        this.observers = [];
    }

    Mutation.prototype = {
        get: function get() {
            if (avalon.trackingAction) {
                this.collect(); //被收集
                var childOb = this.value;
                if (childOb && childOb.$events) {
                    if (Array.isArray(childOb)) {
                        childOb.forEach(function (item) {
                            if (item && item.$events) {
                                item.$events.__dep__.collect();
                            }
                        });
                    } else if (avalon.deepCollect) {
                        for (var key in childOb) {
                            if (childOb.hasOwnProperty(key)) {
                                var collectIt = childOb[key];
                            }
                        }
                    }
                }
            }
            return this.value;
        },
        collect: function collect() {
            avalon.track(name, '被收集');
            reportObserved(this);
        },
        updateVersion: function updateVersion() {
            this.version = Math.random() + Math.random();
        },
        notify: function notify() {
            transactionStart();
            propagateChanged(this);
            transactionEnd();
        },
        set: function set(newValue) {
            var oldValue = this.value;
            if (newValue !== oldValue) {
                if (avalon.isObject(newValue)) {
                    var hash = oldValue && oldValue.$hashcode;
                    var childVM = platform.createProxy(newValue, this);
                    if (childVM) {
                        if (hash) {
                            childVM.$hashcode = hash;
                        }
                        newValue = childVM;
                    }
                }
                this.value = newValue;
                this.updateVersion();
                this.notify();
            }
        }
    };

    function getBody(fn) {
        var entire = fn.toString();
        return entire.substring(entire.indexOf('{}') + 1, entire.lastIndexOf('}'));
    }
    //如果不存在三目,if,方法
    var instability = /(\?|if\b|\(.+\))/;

    function __create(o) {
        var __ = function __() {};
        __.prototype = o;
        return new __();
    }

    function __extends(child, parent) {
        if (typeof parent === 'function') {
            var proto = child.prototype = __create(parent.prototype);
            proto.constructor = child;
        }
    }
    var Computed = function (_super) {
        __extends(Computed, _super);

        function Computed(name, options, vm) {
            //构造函数
            _super.call(this, name, undefined, vm);
            delete options.get;
            delete options.set;

            avalon.mix(this, options);
            this.deps = {};
            this.type = 'computed';
            this.depsVersion = {};
            this.isComputed = true;
            this.trackAndCompute();
            if (!('isStable' in this)) {
                this.isStable = !instability.test(getBody(this.getter));
            }
        }
        var cp = Computed.prototype;
        cp.trackAndCompute = function () {
            if (this.isStable && this.depsCount > 0) {
                this.getValue();
            } else {
                collectDeps(this, this.getValue.bind(this));
            }
        };

        cp.getValue = function () {
            return this.value = this.getter.call(this.vm);
        };

        cp.schedule = function () {
            var observers = this.observers;
            var i = observers.length;
            while (i--) {
                var d = observers[i];
                if (d.schedule) {
                    d.schedule();
                }
            }
        };

        cp.shouldCompute = function () {
            if (this.isStable) {
                //如果变动因子确定,那么只比较变动因子的版本
                var toComputed = false;
                for (var i in this.deps) {
                    if (this.deps[i].version !== this.depsVersion[i]) {
                        toComputed = true;
                        this.depsVersion[i] = this.deps[i].version;
                    }
                }
                return toComputed;
            }
            return true;
        };
        cp.set = function () {
            if (this.setter) {
                avalon.transaction(this.setter, this.vm, arguments);
            }
        };
        cp.get = function () {

            //当被设置了就不稳定,当它被访问了一次就是稳定
            this.collect();

            if (this.shouldCompute()) {
                this.trackAndCompute();
                // console.log('computed 2 分支')
                this.updateVersion();
                //  this.reportChanged()
            }

            //下面这一行好像没用
            return this.value;
        };
        return Computed;
    }(Mutation);

    /**
     * 这里放置ViewModel模块的共用方法
     * avalon.define: 全框架最重要的方法,生成用户VM
     * IProxy, 基本用户数据产生的一个数据对象,基于$model与vmodel之间的形态
     * modelFactory: 生成用户VM
     * canHijack: 判定此属性是否该被劫持,加入数据监听与分发的的逻辑
     * createProxy: listFactory与modelFactory的封装
     * createAccessor: 实现数据监听与分发的重要对象
     * itemFactory: ms-for循环中产生的代理VM的生成工厂
     * fuseFactory: 两个ms-controller间产生的代理VM的生成工厂
     */

    avalon.define = function (definition) {
        var $id = definition.$id;
        if (!$id) {
            avalon.error('vm.$id must be specified');
        }
        if (avalon.vmodels[$id]) {
            avalon.warn('error:[' + $id + '] had defined!');
        }
        var vm = platform.modelFactory(definition);
        return avalon.vmodels[$id] = vm;
    };

    /**
     * 在未来的版本,avalon改用Proxy来创建VM,因此
     */

    function IProxy(definition, dd) {
        avalon.mix(this, definition);
        avalon.mix(this, $$skipArray);
        this.$hashcode = avalon.makeHashCode('$');
        this.$id = this.$id || this.$hashcode;
        this.$events = {
            __dep__: dd || new Mutation(this.$id)
        };
        if (avalon.config.inProxyMode) {
            delete this.$mutations;
            this.$accessors = {};
            this.$computed = {};
            this.$track = '';
        } else {
            this.$accessors = {
                $model: modelAccessor
            };
        }
        if (dd === void 0) {
            this.$watch = platform.watchFactory(this.$events);
            this.$fire = platform.fireFactory(this.$events);
        } else {
            delete this.$watch;
            delete this.$fire;
        }
    }

    platform.modelFactory = function modelFactory(definition, dd) {
        var $computed = definition.$computed || {};
        delete definition.$computed;
        var core = new IProxy(definition, dd);
        var $accessors = core.$accessors;
        var keys = [];

        platform.hideProperty(core, '$mutations', {});

        for (var key in definition) {
            if (key in $$skipArray) continue;
            var val = definition[key];
            keys.push(key);
            if (canHijack(key, val)) {
                $accessors[key] = createAccessor(key, val);
            }
        }
        for (var _key in $computed) {
            if (_key in $$skipArray) continue;
            var val = $computed[_key];
            if (typeof val === 'function') {
                val = {
                    get: val
                };
            }
            if (val && val.get) {
                val.getter = val.get;
                val.setter = val.set;
                avalon.Array.ensure(keys, _key);
                $accessors[_key] = createAccessor(_key, val, true);
            }
        }
        //将系统API以unenumerable形式加入vm,
        //添加用户的其他不可监听属性或方法
        //重写$track
        //并在IE6-8中增添加不存在的hasOwnPropert方法
        var vm = platform.createViewModel(core, $accessors, core);
        platform.afterCreate(vm, core, keys, !dd);
        return vm;
    };
    var $proxyItemBackdoorMap = {};

    function canHijack(key, val, $proxyItemBackdoor) {
        if (key in $$skipArray) return false;
        if (key.charAt(0) === '$') {
            if ($proxyItemBackdoor) {
                if (!$proxyItemBackdoorMap[key]) {
                    $proxyItemBackdoorMap[key] = 1;
                    avalon.warn('ms-for\u4E2D\u7684\u53D8\u91CF' + key + '\u4E0D\u518D\u5EFA\u8BAE\u4EE5$\u4E3A\u524D\u7F00');
                }
                return true;
            }
            return false;
        }
        if (val == null) {
            avalon.warn('定义vmodel时' + key + '的属性值不能为null undefine');
            return true;
        }
        if (/error|date|function|regexp/.test(avalon.type(val))) {
            return false;
        }
        return !(val && val.nodeName && val.nodeType);
    }

    function createProxy(target, dd) {
        if (target && target.$events) {
            return target;
        }
        var vm;
        if (Array.isArray(target)) {
            vm = platform.listFactory(target, false, dd);
        } else if (isObject(target)) {
            vm = platform.modelFactory(target, dd);
        }
        return vm;
    }

    platform.createProxy = createProxy;

    platform.itemFactory = function itemFactory(before, after) {
        var keyMap = before.$model;
        var core = new IProxy(keyMap);
        var state = avalon.shadowCopy(core.$accessors, before.$accessors); //防止互相污染
        var data = after.data;
        //core是包含系统属性的对象
        //keyMap是不包含系统属性的对象, keys
        for (var key in data) {
            var val = keyMap[key] = core[key] = data[key];
            state[key] = createAccessor(key, val);
        }
        var keys = Object.keys(keyMap);
        var vm = platform.createViewModel(core, state, core);
        platform.afterCreate(vm, core, keys);
        return vm;
    };

    function createAccessor(key, val, isComputed) {
        var mutation = null;
        var Accessor = isComputed ? Computed : Mutation;
        return {
            get: function Getter() {
                if (!mutation) {
                    mutation = new Accessor(key, val, this);
                }
                return mutation.get();
            },
            set: function Setter(newValue) {
                if (!mutation) {
                    mutation = new Accessor(key, val, this);
                }
                mutation.set(newValue);
            },
            enumerable: true,
            configurable: true
        };
    }

    platform.fuseFactory = function fuseFactory(before, after) {
        var keyMap = avalon.mix(before.$model, after.$model);
        var core = new IProxy(avalon.mix(keyMap, {
            $id: before.$id + after.$id
        }));
        var state = avalon.mix(core.$accessors, before.$accessors, after.$accessors); //防止互相污染

        var keys = Object.keys(keyMap);
        //将系统API以unenumerable形式加入vm,并在IE6-8中添加hasOwnPropert方法
        var vm = platform.createViewModel(core, state, core);
        platform.afterCreate(vm, core, keys, false);
        return vm;
    };

    function toJson(val) {
        var xtype = avalon.type(val);
        if (xtype === 'array') {
            var array = [];
            for (var i = 0; i < val.length; i++) {
                array[i] = toJson(val[i]);
            }
            return array;
        } else if (xtype === 'object') {
            if (typeof val.$track === 'string') {
                var obj = {};
                var arr = val.$track.match(/[^☥]+/g) || [];
                arr.forEach(function (i) {
                    var value = val[i];
                    obj[i] = value && value.$events ? toJson(value) : value;
                });
                return obj;
            }
        }
        return val;
    }

    var modelAccessor = {
        get: function get() {
            return toJson(this);
        },
        set: avalon.noop,
        enumerable: false,
        configurable: true
    };

    platform.toJson = toJson;
    platform.modelAccessor = modelAccessor;

    var _splice = ap.splice;
    var __array__ = {
        set: function set(index, val) {
            if (index >>> 0 === index && this[index] !== val) {
                if (index > this.length) {
                    throw Error(index + 'set方法的第一个参数不能大于原数组长度');
                }
                this.splice(index, 1, val);
            }
        },
        toJSON: function toJSON() {
            //为了解决IE6-8的解决,通过此方法显式地求取数组的$model
            return this.$model = platform.toJson(this);
        },
        contains: function contains(el) {
            //判定是否包含
            return this.indexOf(el) !== -1;
        },
        ensure: function ensure(el) {
            if (!this.contains(el)) {
                //只有不存在才push
                this.push(el);
                return true;
            }
            return false;
        },
        pushArray: function pushArray(arr) {
            return this.push.apply(this, arr);
        },
        remove: function remove(el) {
            //移除第一个等于给定值的元素
            return this.removeAt(this.indexOf(el));
        },
        removeAt: function removeAt(index) {
            //移除指定索引上的元素
            if (index >>> 0 === index) {
                return this.splice(index, 1);
            }
            return [];
        },
        clear: function clear() {
            this.removeAll();
            return this;
        },
        removeAll: function removeAll(all) {
            //移除N个元素
            var size = this.length;
            var eliminate = Array.isArray(all) ? function (el) {
                return all.indexOf(el) !== -1;
            } : typeof all === 'function' ? all : false;

            if (eliminate) {
                for (var i = this.length - 1; i >= 0; i--) {
                    if (eliminate(this[i], i)) {
                        _splice.call(this, i, 1);
                    }
                }
            } else {
                _splice.call(this, 0, this.length);
            }
            this.toJSON();
            this.$events.__dep__.notify();
        }
    };
    function hijackMethods(array) {
        for (var i in __array__) {
            platform.hideProperty(array, i, __array__[i]);
        }
    }
    var __method__ = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];

    __method__.forEach(function (method) {
        var original = ap[method];
        __array__[method] = function () {
            // 继续尝试劫持数组元素的属性
            var core = this.$events;

            var args = platform.listFactory(arguments, true, core.__dep__);
            var result = original.apply(this, args);

            this.toJSON();
            core.__dep__.notify(method);
            return result;
        };
    });

    function listFactory(array, stop, dd) {
        if (!stop) {
            hijackMethods(array);
            if (modern) {
                Object.defineProperty(array, '$model', platform.modelAccessor);
            }
            platform.hideProperty(array, '$hashcode', avalon.makeHashCode('$'));
            platform.hideProperty(array, '$events', { __dep__: dd || new Mutation() });
        }
        var _dd = array.$events && array.$events.__dep__;
        for (var i = 0, n = array.length; i < n; i++) {
            var item = array[i];
            if (isObject(item)) {
                array[i] = platform.createProxy(item, _dd);
            }
        }
        return array;
    }

    platform.listFactory = listFactory;

    //如果浏览器不支持ecma262v5的Object.defineProperties或者存在BUG，比如IE8
    //标准浏览器使用__defineGetter__, __defineSetter__实现
    var canHideProperty = true;
    try {
        Object.defineProperty({}, '_', {
            value: 'x'
        });
        delete $$skipArray.$vbsetter;
        delete $$skipArray.$vbthis;
    } catch (e) {
        /* istanbul ignore next*/
        canHideProperty = false;
    }

    var protectedVB = { $vbthis: 1, $vbsetter: 1 };
    /* istanbul ignore next */
    function hideProperty(host, name, value) {
        if (canHideProperty) {
            Object.defineProperty(host, name, {
                value: value,
                writable: true,
                enumerable: false,
                configurable: true
            });
        } else if (!protectedVB[name]) {
            /* istanbul ignore next */
            host[name] = value;
        }
    }

    function watchFactory(core) {
        return function $watch(expr, callback, deep) {
            var w = new Action(core.__proxy__, {
                deep: deep,
                type: 'user',
                expr: expr
            }, callback);
            if (!core[expr]) {
                core[expr] = [w];
            } else {
                core[expr].push(w);
            }

            return function () {
                w.dispose();
                avalon.Array.remove(core[expr], w);
                if (core[expr].length === 0) {
                    delete core[expr];
                }
            };
        };
    }

    function fireFactory(core) {
        return function $fire(expr, a) {
            var list = core[expr];
            if (Array.isArray(list)) {
                for (var i = 0, w; w = list[i++];) {
                    w.callback.call(w.vm, a, w.value, w.expr);
                }
            }
        };
    }

    function wrapIt(str) {
        return '☥' + str + '☥';
    }

    function afterCreate(vm, core, keys, bindThis) {
        var ac = vm.$accessors;
        //隐藏系统属性
        for (var key in $$skipArray) {
            if (avalon.msie < 9 && core[key] === void 0) continue;
            hideProperty(vm, key, core[key]);
        }
        //为不可监听的属性或方法赋值
        for (var i = 0; i < keys.length; i++) {
            var _key2 = keys[i];
            if (!(_key2 in ac)) {
                var val = core[_key2];
                if (bindThis && typeof val === 'function') {
                    vm[_key2] = val.bind(vm);
                    vm[_key2]._orig = val;
                    continue;
                }
                vm[_key2] = val;
            }
        }
        vm.$track = keys.join('☥');

        function hasOwnKey(key) {
            return wrapIt(vm.$track).indexOf(wrapIt(key)) > -1;
        }
        if (avalon.msie < 9) {
            vm.hasOwnProperty = hasOwnKey;
        }
        vm.$events.__proxy__ = vm;
    }

    platform.hideProperty = hideProperty;
    platform.fireFactory = fireFactory;
    platform.watchFactory = watchFactory;
    platform.afterCreate = afterCreate;

    var createViewModel = Object.defineProperties;
    var defineProperty;

    var timeBucket = new Date() - 0;
    /* istanbul ignore if*/
    if (!canHideProperty) {
        if ('__defineGetter__' in avalon) {
            defineProperty = function defineProperty(obj, prop, desc) {
                if ('value' in desc) {
                    obj[prop] = desc.value;
                }
                if ('get' in desc) {
                    obj.__defineGetter__(prop, desc.get);
                }
                if ('set' in desc) {
                    obj.__defineSetter__(prop, desc.set);
                }
                return obj;
            };
            createViewModel = function createViewModel(obj, descs) {
                for (var prop in descs) {
                    if (descs.hasOwnProperty(prop)) {
                        defineProperty(obj, prop, descs[prop]);
                    }
                }
                return obj;
            };
        }
        /* istanbul ignore if*/
        if (msie$1 < 9) {
            var VBClassPool = {};
            window.execScript([// jshint ignore:line
            'Function parseVB(code)', '\tExecuteGlobal(code)', 'End Function' //转换一段文本为VB代码
            ].join('\n'), 'VBScript');

            var VBMediator = function VBMediator(instance, accessors, name, value) {
                // jshint ignore:line
                var accessor = accessors[name];
                if (arguments.length === 4) {
                    accessor.set.call(instance, value);
                } else {
                    return accessor.get.call(instance);
                }
            };
            createViewModel = function createViewModel(name, accessors, properties) {
                // jshint ignore:line
                var buffer = [];
                buffer.push('\tPrivate [$vbsetter]', '\tPublic  [$accessors]', '\tPublic Default Function [$vbthis](ac' + timeBucket + ', s' + timeBucket + ')', '\t\tSet  [$accessors] = ac' + timeBucket + ': set [$vbsetter] = s' + timeBucket, '\t\tSet  [$vbthis]    = Me', //链式调用
                '\tEnd Function');
                //添加普通属性,因为VBScript对象不能像JS那样随意增删属性，必须在这里预先定义好
                var uniq = {
                    $vbthis: true,
                    $vbsetter: true,
                    $accessors: true
                };
                for (name in $$skipArray) {
                    if (!uniq[name]) {
                        buffer.push('\tPublic [' + name + ']');
                        uniq[name] = true;
                    }
                }
                //添加访问器属性 
                for (name in accessors) {
                    if (uniq[name]) {
                        continue;
                    }
                    uniq[name] = true;
                    buffer.push(
                    //由于不知对方会传入什么,因此set, let都用上
                    '\tPublic Property Let [' + name + '](val' + timeBucket + ')', //setter
                    '\t\tCall [$vbsetter](Me, [$accessors], "' + name + '", val' + timeBucket + ')', '\tEnd Property', '\tPublic Property Set [' + name + '](val' + timeBucket + ')', //setter
                    '\t\tCall [$vbsetter](Me, [$accessors], "' + name + '", val' + timeBucket + ')', '\tEnd Property', '\tPublic Property Get [' + name + ']', //getter
                    '\tOn Error Resume Next', //必须优先使用set语句,否则它会误将数组当字符串返回
                    '\t\tSet[' + name + '] = [$vbsetter](Me, [$accessors],"' + name + '")', '\tIf Err.Number <> 0 Then', '\t\t[' + name + '] = [$vbsetter](Me, [$accessors],"' + name + '")', '\tEnd If', '\tOn Error Goto 0', '\tEnd Property');
                }

                for (name in properties) {
                    if (!uniq[name]) {
                        uniq[name] = true;
                        buffer.push('\tPublic [' + name + ']');
                    }
                }

                buffer.push('\tPublic [hasOwnProperty]');
                buffer.push('End Class');
                var body = buffer.join('\r\n');
                var className = VBClassPool[body];
                if (!className) {
                    className = avalon.makeHashCode('VBClass');
                    window.parseVB('Class ' + className + body);
                    window.parseVB(['Function ' + className + 'Factory(acc, vbm)', //创建实例并传入两个关键的参数
                    '\tDim o', '\tSet o = (New ' + className + ')(acc, vbm)', '\tSet ' + className + 'Factory = o', 'End Function'].join('\r\n'));
                    VBClassPool[body] = className;
                }
                var ret = window[className + 'Factory'](accessors, VBMediator); //得到其产品
                return ret; //得到其产品
            };
        }
    }

    platform.createViewModel = createViewModel;

    var impDir = avalon.directive('important', {
        priority: 1,
        getScope: function getScope(name, scope) {
            var v = avalon.vmodels[name];
            if (v) return v;
            throw 'error! no vmodel called ' + name;
        },
        update: function update(node, attrName, $id) {
            if (!avalon.inBrowser) return;
            var dom = avalon.vdom(node, 'toDOM');
            if (dom.nodeType === 1) {
                dom.removeAttribute(attrName);
                avalon(dom).removeClass('ms-controller');
            }
            var vm = avalon.vmodels[$id];
            if (vm) {
                vm.$element = dom;
                vm.$render = this;
                vm.$fire('onReady');
                delete vm.$events.onReady;
            }
        }
    });

    var impCb = impDir.update;

    avalon.directive('controller', {
        priority: 2,
        getScope: function getScope(name, scope) {
            var v = avalon.vmodels[name];
            if (v) {
                v.$render = this;
                if (scope && scope !== v) {
                    return platform.fuseFactory(scope, v);
                }
                return v;
            }
            return scope;
        },
        update: impCb
    });

    avalon.directive('skip', {
        delay: true
    });

    var arrayWarn = {};
    var cssDir = avalon.directive('css', {
        diff: function diff(newVal, oldVal) {
            if (Object(newVal) === newVal) {
                newVal = platform.toJson(newVal); //安全的遍历VBscript
                if (Array.isArray(newVal)) {
                    //转换成对象
                    var b = {};
                    newVal.forEach(function (el) {
                        el && avalon.shadowCopy(b, el);
                    });
                    newVal = b;
                    if (!arrayWarn[this.type]) {
                        avalon.warn('ms-' + this.type + '指令的值不建议使用数组形式了！');
                        arrayWarn[this.type] = 1;
                    }
                }

                var hasChange = false;
                var patch = {};
                if (!oldVal) {
                    //如果一开始为空
                    patch = newVal;
                    hasChange = true;
                } else {
                    if (this.deep) {
                        var deep = typeof this.deep === 'number' ? this.deep : 6;
                        for (var i in newVal) {
                            //diff差异点  
                            if (!deepEquals(newVal[i], oldVal[i], 4)) {
                                this.value = newVal;
                                return true;
                            }
                            patch[i] = newVal[i];
                        }
                    } else {
                        for (var _i4 in newVal) {
                            //diff差异点
                            if (newVal[_i4] !== oldVal[_i4]) {
                                hasChange = true;
                            }
                            patch[_i4] = newVal[_i4];
                        }
                    }

                    for (var _i5 in oldVal) {
                        if (!(_i5 in patch)) {
                            hasChange = true;
                            patch[_i5] = '';
                        }
                    }
                }
                if (hasChange) {
                    this.value = patch;
                    return true;
                }
            }
            return false;
        },
        update: function update(vdom, value) {

            var dom = vdom.dom;
            if (dom && dom.nodeType === 1) {
                var wrap = avalon(dom);
                for (var name in value) {
                    wrap.css(name, value[name]);
                }
            }
        }
    });

    var cssDiff = cssDir.diff;

    function getEnumerableKeys(obj) {
        var res = [];
        for (var key in obj) {
            res.push(key);
        }return res;
    }

    function deepEquals(a, b, level) {
        if (level === 0) return a === b;
        if (a === null && b === null) return true;
        if (a === undefined && b === undefined) return true;
        var aIsArray = Array.isArray(a);
        if (aIsArray !== Array.isArray(b)) {
            return false;
        }
        if (aIsArray) {
            return equalArray(a, b, level);
        } else if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) === "object" && (typeof b === 'undefined' ? 'undefined' : _typeof(b)) === "object") {
            return equalObject(a, b, level);
        }
        return a === b;
    }

    function equalArray(a, b, level) {
        if (a.length !== b.length) {
            return false;
        }
        for (var i = a.length - 1; i >= 0; i--) {
            try {
                if (!deepEquals(a[i], b[i], level - 1)) {
                    return false;
                }
            } catch (noThisPropError) {
                return false;
            }
        }
        return true;
    }

    function equalObject(a, b, level) {
        if (a === null || b === null) return false;
        if (getEnumerableKeys(a).length !== getEnumerableKeys(b).length) return false;
        for (var prop in a) {
            if (!(prop in b)) return false;
            try {
                if (!deepEquals(a[prop], b[prop], level - 1)) {
                    return false;
                }
            } catch (noThisPropError) {
                return false;
            }
        }
        return true;
    }

    /**
     * ------------------------------------------------------------
     * 检测浏览器对CSS动画的支持与API名
     * ------------------------------------------------------------
     */

    var checker = {
        TransitionEvent: 'transitionend',
        WebKitTransitionEvent: 'webkitTransitionEnd',
        OTransitionEvent: 'oTransitionEnd',
        otransitionEvent: 'otransitionEnd'
    };
    var css3 = void 0;
    var tran = void 0;
    var ani = void 0;
    var name$2 = void 0;
    var animationEndEvent = void 0;
    var transitionEndEvent = void 0;
    var transition = false;
    var animation = false;
    //有的浏览器同时支持私有实现与标准写法，比如webkit支持前两种，Opera支持1、3、4
    for (name$2 in checker) {
        if (window$1[name$2]) {
            tran = checker[name$2];
            break;
        }
        /* istanbul ignore next */
        try {
            var a = document.createEvent(name$2);
            tran = checker[name$2];
            break;
        } catch (e) {}
    }
    if (typeof tran === 'string') {
        transition = css3 = true;
        transitionEndEvent = tran;
    }

    //animationend有两个可用形态
    //IE10+, Firefox 16+ & Opera 12.1+: animationend
    //Chrome/Safari: webkitAnimationEnd
    //http://blogs.msdn.com/b/davrous/archive/2011/12/06/introduction-to-css3-animat ions.aspx
    //IE10也可以使用MSAnimationEnd监听，但是回调里的事件 type依然为animationend
    //  el.addEventListener('MSAnimationEnd', function(e) {
    //     alert(e.type)// animationend！！！
    // })
    checker = {
        'AnimationEvent': 'animationend',
        'WebKitAnimationEvent': 'webkitAnimationEnd'
    };
    for (name$2 in checker) {
        if (window$1[name$2]) {
            ani = checker[name$2];
            break;
        }
    }
    if (typeof ani === 'string') {
        animation = css3 = true;
        animationEndEvent = ani;
    }

    var effectDir = avalon.directive('effect', {
        priority: 5,
        diff: function diff(effect) {
            var vdom = this.node;
            if (typeof effect === 'string') {
                this.value = effect = {
                    is: effect
                };
                avalon.warn('ms-effect的指令值不再支持字符串,必须是一个对象');
            }
            this.value = vdom.effect = effect;
            var ok = cssDiff.call(this, effect, this.oldValue);
            var me = this;
            if (ok) {
                setTimeout(function () {
                    vdom.animating = true;
                    effectDir.update.call(me, vdom, vdom.effect);
                });
                vdom.animating = false;
                return true;
            }
            return false;
        },

        update: function update(vdom, change, opts) {
            var dom = vdom.dom;
            if (dom && dom.nodeType === 1) {
                //要求配置对象必须指定is属性，action必须是布尔或enter,leave,move
                var option = change || opts;
                var is = option.is;

                var globalOption = avalon.effects[is];
                if (!globalOption) {
                    //如果没有定义特效
                    avalon.warn(is + ' effect is undefined');
                    return;
                }
                var finalOption = {};
                var action = actionMaps[option.action];
                if (typeof Effect.prototype[action] !== 'function') {
                    avalon.warn('action is undefined');
                    return;
                }
                //必须预定义特效

                var effect = new avalon.Effect(dom);
                avalon.mix(finalOption, globalOption, option, { action: action });

                if (finalOption.queue) {
                    animationQueue.push(function () {
                        effect[action](finalOption);
                    });
                    callNextAnimation();
                } else {

                    effect[action](finalOption);
                }
                return true;
            }
        }
    });

    var move = 'move';
    var leave = 'leave';
    var enter = 'enter';
    var actionMaps = {
        'true': enter,
        'false': leave,
        enter: enter,
        leave: leave,
        move: move,
        'undefined': enter
    };

    var animationQueue = [];
    function callNextAnimation() {
        var fn = animationQueue[0];
        if (fn) {
            fn();
        }
    }

    avalon.effects = {};
    avalon.effect = function (name, opts) {
        var definition = avalon.effects[name] = opts || {};
        if (css3 && definition.css !== false) {
            patchObject(definition, 'enterClass', name + '-enter');
            patchObject(definition, 'enterActiveClass', definition.enterClass + '-active');
            patchObject(definition, 'leaveClass', name + '-leave');
            patchObject(definition, 'leaveActiveClass', definition.leaveClass + '-active');
        }
        return definition;
    };

    function patchObject(obj, name, value) {
        if (!obj[name]) {
            obj[name] = value;
        }
    }

    var Effect = function Effect(dom) {
        this.dom = dom;
    };

    avalon.Effect = Effect;

    Effect.prototype = {
        enter: createAction('Enter'),
        leave: createAction('Leave'),
        move: createAction('Move')
    };

    function execHooks(options, name, el) {
        var fns = [].concat(options[name]);
        for (var i = 0, fn; fn = fns[i++];) {
            if (typeof fn === 'function') {
                fn(el);
            }
        }
    }
    var staggerCache = new Cache(128);

    function createAction(action) {
        var lower = action.toLowerCase();
        return function (option) {
            var dom = this.dom;
            var elem = avalon(dom);
            //处理与ms-for指令相关的stagger
            //========BEGIN=====
            var staggerTime = isFinite(option.stagger) ? option.stagger * 1000 : 0;
            if (staggerTime) {
                if (option.staggerKey) {
                    var stagger = staggerCache.get(option.staggerKey) || staggerCache.put(option.staggerKey, {
                        count: 0,
                        items: 0
                    });
                    stagger.count++;
                    stagger.items++;
                }
            }
            var staggerIndex = stagger && stagger.count || 0;
            //=======END==========
            var stopAnimationID;
            var animationDone = function animationDone(e) {
                var isOk = e !== false;
                if (--dom.__ms_effect_ === 0) {
                    avalon.unbind(dom, transitionEndEvent);
                    avalon.unbind(dom, animationEndEvent);
                }
                clearTimeout(stopAnimationID);
                var dirWord = isOk ? 'Done' : 'Abort';
                execHooks(option, 'on' + action + dirWord, dom);
                if (stagger) {
                    if (--stagger.items === 0) {
                        stagger.count = 0;
                    }
                }
                if (option.queue) {
                    animationQueue.shift();
                    callNextAnimation();
                }
            };
            //执行开始前的钩子
            execHooks(option, 'onBefore' + action, dom);

            if (option[lower]) {
                //使用JS方式执行动画
                option[lower](dom, function (ok) {
                    animationDone(ok !== false);
                });
            } else if (css3) {
                //使用CSS3方式执行动画
                elem.addClass(option[lower + 'Class']);
                elem.removeClass(getNeedRemoved(option, lower));

                if (!dom.__ms_effect_) {
                    //绑定动画结束事件
                    elem.bind(transitionEndEvent, animationDone);
                    elem.bind(animationEndEvent, animationDone);
                    dom.__ms_effect_ = 1;
                } else {
                    dom.__ms_effect_++;
                }
                setTimeout(function () {
                    //用xxx-active代替xxx类名的方式 触发CSS3动画
                    var time = avalon.root.offsetWidth === NaN;
                    elem.addClass(option[lower + 'ActiveClass']);
                    //计算动画时长
                    time = getAnimationTime(dom);
                    if (!time === 0) {
                        //立即结束动画
                        animationDone(false);
                    } else if (!staggerTime) {
                        //如果动画超出时长还没有调用结束事件,这可能是元素被移除了
                        //如果强制结束动画
                        stopAnimationID = setTimeout(function () {
                            animationDone(false);
                        }, time + 32);
                    }
                }, 17 + staggerTime * staggerIndex); // = 1000/60
            }
        };
    }

    avalon.applyEffect = function (dom, vdom, opts) {
        var cb = opts.cb;
        var curEffect = vdom.effect;
        if (curEffect && dom && dom.nodeType === 1) {
            var hook = opts.hook;
            var old = curEffect[hook];
            if (cb) {
                if (Array.isArray(old)) {
                    old.push(cb);
                } else if (old) {
                    curEffect[hook] = [old, cb];
                } else {
                    curEffect[hook] = [cb];
                }
            }
            getAction(opts);
            avalon.directives.effect.update(vdom, curEffect, avalon.shadowCopy({}, opts));
        } else if (cb) {
            cb(dom);
        }
    };
    /**
     * 获取方向
     */
    function getAction(opts) {
        if (!opts.action) {
            return opts.action = opts.hook.replace(/^on/, '').replace(/Done$/, '').toLowerCase();
        }
    }
    /**
     * 需要移除的类名
     */
    function getNeedRemoved(options, name) {
        var name = name === 'leave' ? 'enter' : 'leave';
        return Array(name + 'Class', name + 'ActiveClass').map(function (cls) {
            return options[cls];
        }).join(' ');
    }
    /**
     * 计算动画长度
     */
    var transitionDuration = avalon.cssName('transition-duration');
    var animationDuration = avalon.cssName('animation-duration');
    var rsecond = /\d+s$/;
    function toMillisecond(str) {
        var ratio = rsecond.test(str) ? 1000 : 1;
        return parseFloat(str) * ratio;
    }

    function getAnimationTime(dom) {
        var computedStyles = window$1.getComputedStyle(dom, null);
        var tranDuration = computedStyles[transitionDuration];
        var animDuration = computedStyles[animationDuration];
        return toMillisecond(tranDuration) || toMillisecond(animDuration);
    }
    /**
     * 
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="dist/avalon.js"></script>
            <script>
                avalon.effect('animate')
                var vm = avalon.define({
                    $id: 'ani',
                    a: true
                })
            </script>
            <style>
                .animate-enter, .animate-leave{
                    width:100px;
                    height:100px;
                    background: #29b6f6;
                    transition:all 2s;
                    -moz-transition: all 2s; 
                    -webkit-transition: all 2s;
                    -o-transition:all 2s;
                }  
                .animate-enter-active, .animate-leave{
                    width:300px;
                    height:300px;
                }
                .animate-leave-active{
                    width:100px;
                    height:100px;
                }
            </style>
        </head>
        <body>
            <div :controller='ani' >
                <p><input type='button' value='click' :click='@a =!@a'></p>
                <div :effect="{is:'animate',action:@a}"></div>
            </div>
    </body>
    </html>
     * 
     */

    var none = 'none';
    function parseDisplay(elem, val) {
        //用于取得此类标签的默认display值
        var doc = elem.ownerDocument;
        var nodeName = elem.nodeName;
        var key = '_' + nodeName;
        if (!parseDisplay[key]) {
            var temp = doc.body.appendChild(doc.createElement(nodeName));
            val = avalon.css(temp, 'display');
            doc.body.removeChild(temp);
            if (val === none) {
                val = 'block';
            }
            parseDisplay[key] = val;
        }
        return parseDisplay[key];
    }

    avalon.parseDisplay = parseDisplay;
    avalon.directive('visible', {
        diff: function diff(newVal, oldVal) {
            var n = !!newVal;
            if (oldVal === void 0 || n !== oldVal) {
                this.value = n;
                return true;
            }
        },
        ready: true,
        update: function update(vdom, show) {
            var dom = vdom.dom;
            if (dom && dom.nodeType === 1) {
                var display = dom.style.display;
                var value;
                if (show) {
                    if (display === none) {
                        value = vdom.displayValue;
                        if (!value) {
                            dom.style.display = '';
                            if (dom.style.cssText === '') {
                                dom.removeAttribute('style');
                            }
                        }
                    }
                    if (dom.style.display === '' && avalon(dom).css('display') === none &&
                    // fix firefox BUG,必须挂到页面上
                    avalon.contains(dom.ownerDocument, dom)) {
                        value = parseDisplay(dom);
                    }
                } else {

                    if (display !== none) {
                        value = none;
                        vdom.displayValue = display;
                    }
                }
                var cb = function cb() {
                    if (value !== void 0) {
                        dom.style.display = value;
                    }
                };

                avalon.applyEffect(dom, vdom, {
                    hook: show ? 'onEnterDone' : 'onLeaveDone',
                    cb: cb
                });
            }
        }
    });

    avalon.directive('text', {
        delay: true,
        init: function init() {

            var node = this.node;
            if (node.isVoidTag) {
                avalon.error('自闭合元素不能使用ms-text');
            }
            var child = { nodeName: '#text', nodeValue: this.getValue() };
            node.children.splice(0, node.children.length, child);
            if (inBrowser) {
                avalon.clearHTML(node.dom);
                node.dom.appendChild(avalon.vdom(child, 'toDOM'));
            }
            this.node = child;
            var type = 'expr';
            this.type = this.name = type;
            var directive$$1 = avalon.directives[type];
            var me = this;
            this.callback = function (value) {
                directive$$1.update.call(me, me.node, value);
            };
        }
    });

    avalon.directive('expr', {
        update: function update(vdom, value) {
            value = value == null || value === '' ? '\u200B' : value;
            vdom.nodeValue = value;
            //https://github.com/RubyLouvre/avalon/issues/1834
            if (vdom.dom) vdom.dom.data = value;
        }
    });

    avalon.directive('attr', {
        diff: cssDiff,
        update: function update(vdom, value) {
            var props = vdom.props;
            for (var i in value) {
                if (!!value[i] === false) {
                    delete props[i];
                } else {
                    props[i] = value[i];
                }
            }
            var dom = vdom.dom;
            if (dom && dom.nodeType === 1) {
                updateAttrs(dom, value);
            }
        }
    });

    avalon.directive('html', {

        update: function update(vdom, value) {
            this.beforeDispose();

            this.innerRender = avalon.scan('<div class="ms-html-container">' + value + '</div>', this.vm, function () {
                var oldRoot = this.root;
                if (vdom.children) vdom.children.length = 0;
                vdom.children = oldRoot.children;
                this.root = vdom;
                if (vdom.dom) avalon.clearHTML(vdom.dom);
            });
        },
        beforeDispose: function beforeDispose() {
            if (this.innerRender) {
                this.innerRender.dispose();
            }
        },
        delay: true
    });

    avalon.directive('if', {
        delay: true,
        priority: 5,
        init: function init() {
            this.placeholder = createAnchor('if');
            var props = this.node.props;
            delete props['ms-if'];
            delete props[':if'];
            this.fragment = avalon.vdom(this.node, 'toHTML');
        },
        diff: function diff(newVal, oldVal) {
            var n = !!newVal;
            if (oldVal === void 0 || n !== oldVal) {
                this.value = n;
                return true;
            }
        },
        update: function update(vdom, value) {
            if (this.isShow === void 0 && value) {
                continueScan(this, vdom);
                return;
            }
            this.isShow = value;
            var placeholder = this.placeholder;

            if (value) {
                var p = placeholder.parentNode;
                continueScan(this, vdom);
                p && p.replaceChild(vdom.dom, placeholder);
            } else {
                //移除DOM
                this.beforeDispose();
                vdom.nodeValue = 'if';
                vdom.nodeName = '#comment';
                delete vdom.children;
                var dom = vdom.dom;
                var p = dom && dom.parentNode;
                vdom.dom = placeholder;
                if (p) {
                    p.replaceChild(placeholder, dom);
                }
            }
        },
        beforeDispose: function beforeDispose() {
            if (this.innerRender) {
                this.innerRender.dispose();
            }
        }
    });

    function continueScan(instance, vdom) {
        var innerRender = instance.innerRender = avalon.scan(instance.fragment, instance.vm);
        avalon.shadowCopy(vdom, innerRender.root);
        delete vdom.nodeValue;
    }

    avalon.directive('on', {
        beforeInit: function beforeInit() {
            this.getter = avalon.noop;
        },
        init: function init() {
            var vdom = this.node;
            var underline = this.name.replace('ms-on-', 'e').replace('-', '_');
            var uuid = underline + '_' + this.expr.replace(/\s/g, '').replace(/[^$a-z]/ig, function (e) {
                return e.charCodeAt(0);
            });
            var fn = avalon.eventListeners[uuid];
            if (!fn) {
                var arr = addScope(this.expr);
                var body = arr[0],
                    filters = arr[1];
                body = makeHandle(body);

                if (filters) {
                    filters = filters.replace(/__value__/g, '$event');
                    filters += '\nif($event.$return){\n\treturn;\n}';
                }
                var ret = ['try{', '\tvar __vmodel__ = this;', '\t' + filters, '\treturn ' + body, '}catch(e){avalon.log(e, "in on dir")}'].filter(function (el) {
                    return (/\S/.test(el)
                    );
                });
                fn = new Function('$event', ret.join('\n'));
                fn.uuid = uuid;
                avalon.eventListeners[uuid] = fn;
            }

            var dom = avalon.vdom(vdom, 'toDOM');
            dom._ms_context_ = this.vm;

            this.eventType = this.param.replace(/\-(\d)$/, '');
            delete this.param;
            avalon(dom).bind(this.eventType, fn);
        },

        beforeDispose: function beforeDispose() {
            avalon(this.node.dom).unbind(this.eventType);
        }
    });

    function lookupOption(vdom, values) {
        vdom.children && vdom.children.forEach(function (el) {
            if (el.nodeName === 'option') {
                setOption(el, values);
            } else {
                lookupOption(el, values);
            }
        });
    }

    function setOption(vdom, values) {
        var props = vdom.props;
        if (!('disabled' in props)) {
            var value = getOptionValue(vdom, props);
            value = String(value || '').trim();
            if (typeof values === 'string') {
                props.selected = value === values;
            } else {
                props.selected = values.indexOf(value) !== -1;
            }

            if (vdom.dom) {
                vdom.dom.selected = props.selected;
                var v = vdom.dom.selected; //必须加上这个,防止移出节点selected失效
            }
        }
    }

    function getOptionValue(vdom, props) {
        if (props && 'value' in props) {
            return props.value + '';
        }
        var arr = [];
        vdom.children.forEach(function (el) {
            if (el.nodeName === '#text') {
                arr.push(el.nodeValue);
            } else if (el.nodeName === '#document-fragment') {
                arr.push(getOptionValue(el));
            }
        });
        return arr.join('');
    }

    function getSelectedValue(vdom, arr) {
        vdom.children.forEach(function (el) {
            if (el.nodeName === 'option') {
                if (el.props.selected === true) arr.push(getOptionValue(el, el.props));
            } else if (el.children) {
                getSelectedValue(el, arr);
            }
        });
        return arr;
    }

    var updateDataActions = {
        input: function input(prop) {
            //处理单个value值处理
            var field = this;
            prop = prop || 'value';
            var dom = field.dom;
            var rawValue = dom[prop];
            var parsedValue = field.parseValue(rawValue);

            //有时候parse后一致,vm不会改变,但input里面的值
            field.value = rawValue;
            field.setValue(parsedValue);
            duplexCb(field);
            var pos = field.pos;
            /* istanbul ignore if */
            if (dom.caret) {
                field.setCaret(dom, pos);
            }
            //vm.aaa = '1234567890'
            //处理 <input ms-duplex='@aaa|limitBy(8)'/>{{@aaa}} 这种格式化同步不一致的情况 
        },
        radio: function radio() {
            var field = this;
            if (field.isChecked) {
                var val = !field.value;
                field.setValue(val);
                duplexCb(field);
            } else {
                updateDataActions.input.call(field);
                field.value = NaN;
            }
        },
        checkbox: function checkbox() {
            var field = this;
            var array = field.value;
            if (!Array.isArray(array)) {
                avalon.warn('ms-duplex应用于checkbox上要对应一个数组');
                array = [array];
            }
            var method = field.dom.checked ? 'ensure' : 'remove';
            if (array[method]) {
                var val = field.parseValue(field.dom.value);
                array[method](val);
                duplexCb(field);
            }
            this.__test__ = array;
        },
        select: function select() {
            var field = this;
            var val = avalon(field.dom).val(); //字符串或字符串数组
            if (val + '' !== this.value + '') {
                if (Array.isArray(val)) {
                    //转换布尔数组或其他
                    val = val.map(function (v) {
                        return field.parseValue(v);
                    });
                } else {
                    val = field.parseValue(val);
                }
                field.setValue(val);
                duplexCb(field);
            }
        },
        contenteditable: function contenteditable() {
            updateDataActions.input.call(this, 'innerHTML');
        }
    };

    function duplexCb(field) {
        if (field.userCb) {
            field.userCb.call(field.vm, {
                type: 'changed',
                target: field.dom
            });
        }
    }

    function updateDataHandle(event) {
        var elem = this;
        var field = elem._ms_duplex_;
        if (elem.composing) {
            //防止onpropertychange引发爆栈
            return;
        }
        if (elem.value === field.value) {
            return;
        }
        /* istanbul ignore if*/
        if (elem.caret) {
            try {
                var pos = field.getCaret(elem);
                field.pos = pos;
            } catch (e) {}
        }
        /* istanbul ignore if*/
        if (field.debounceTime > 4) {
            var timestamp = new Date();
            var left = timestamp - field.time || 0;
            field.time = timestamp;
            /* istanbul ignore if*/
            if (left >= field.debounceTime) {
                updateDataActions[field.dtype].call(field);
                /* istanbul ignore else*/
            } else {
                clearTimeout(field.debounceID);
                field.debounceID = setTimeout(function () {
                    updateDataActions[field.dtype].call(field);
                }, left);
            }
        } else if (field.isChanged) {
            setTimeout(function () {
                //https://github.com/RubyLouvre/avalon/issues/1908
                updateDataActions[field.dtype].call(field);
            }, 4);
        } else {
            updateDataActions[field.dtype].call(field);
        }
    }

    var rchangeFilter = /\|\s*change\b/;
    var rdebounceFilter = /\|\s*debounce(?:\(([^)]+)\))?/;
    function duplexBeforeInit() {
        var expr = this.expr;
        if (rchangeFilter.test(expr)) {
            this.isChanged = true;
            expr = expr.replace(rchangeFilter, '');
        }
        var match = expr.match(rdebounceFilter);
        if (match) {
            expr = expr.replace(rdebounceFilter, '');
            if (!this.isChanged) {
                this.debounceTime = parseInt(match[1], 10) || 300;
            }
        }
        this.expr = expr;
    }
    function duplexInit() {
        var expr = this.expr;
        var node = this.node;
        var etype = node.props.type;
        this.parseValue = parseValue;
        //处理数据转换器
        var parsers = this.param,
            dtype;
        var isChecked = false;
        parsers = parsers ? parsers.split('-').map(function (a) {
            if (a === 'checked') {
                isChecked = true;
            }
            return a;
        }) : [];
        node.duplex = this;
        if (rcheckedType.test(etype) && isChecked) {
            //如果是radio, checkbox,判定用户使用了checked格式函数没有
            parsers = [];
            dtype = 'radio';
            this.isChecked = isChecked;
        }
        this.parsers = parsers;
        if (!/input|textarea|select/.test(node.nodeName)) {
            if ('contenteditable' in node.props) {
                dtype = 'contenteditable';
            }
        } else if (!dtype) {
            dtype = node.nodeName === 'select' ? 'select' : etype === 'checkbox' ? 'checkbox' : etype === 'radio' ? 'radio' : 'input';
        }
        this.dtype = dtype;

        //判定是否使用了 change debounce 过滤器
        // this.isChecked = /boolean/.test(parsers)
        if (dtype !== 'input' && dtype !== 'contenteditable') {
            delete this.isChanged;
            delete this.debounceTime;
        } else if (!this.isChecked) {
            this.isString = true;
        }

        var cb = node.props['data-duplex-changed'];
        if (cb) {
            var arr = addScope(cb, 'xx');
            var body = makeHandle(arr[0]);
            this.userCb = new Function('$event', 'var __vmodel__ = this\nreturn ' + body);
        }
    }
    function duplexDiff(newVal, oldVal) {
        if (Array.isArray(newVal)) {
            if (newVal + '' !== this.compareVal) {
                this.compareVal = newVal + '';
                return true;
            }
        } else {
            newVal = this.parseValue(newVal);
            if (!this.isChecked) {
                this.value = newVal += '';
            }
            if (newVal !== this.compareVal) {
                this.compareVal = newVal;
                return true;
            }
        }
    }

    function duplexBind(vdom, addEvent) {
        var dom = vdom.dom;
        this.dom = dom;
        this.vdom = vdom;
        this.duplexCb = updateDataHandle;
        dom._ms_duplex_ = this;
        //绑定事件
        addEvent(dom, this);
    }

    var valueHijack = true;
    try {
        //#272 IE9-IE11, firefox
        var setters = {};
        var aproto = HTMLInputElement.prototype;
        var bproto = HTMLTextAreaElement.prototype;
        var newSetter = function newSetter(value) {
            // jshint ignore:line
            setters[this.tagName].call(this, value);
            var data = this._ms_duplex_;
            if (!this.caret && data && data.isString) {
                data.duplexCb.call(this, { type: 'setter' });
            }
        };
        var inputProto = HTMLInputElement.prototype;
        Object.getOwnPropertyNames(inputProto); //故意引发IE6-8等浏览器报错
        setters['INPUT'] = Object.getOwnPropertyDescriptor(aproto, 'value').set;

        Object.defineProperty(aproto, 'value', {
            set: newSetter
        });
        setters['TEXTAREA'] = Object.getOwnPropertyDescriptor(bproto, 'value').set;
        Object.defineProperty(bproto, 'value', {
            set: newSetter
        });
        valueHijack = false;
    } catch (e) {
        //在chrome 43中 ms-duplex终于不需要使用定时器实现双向绑定了
        // http://updates.html5rocks.com/2015/04/DOM-attributes-now-on-the-prototype
        // https://docs.google.com/document/d/1jwA8mtClwxI-QJuHT7872Z0pxpZz8PBkf2bGAbsUtqs/edit?pli=1
    }

    function parseValue(val) {
        for (var i = 0, k; k = this.parsers[i++];) {
            var fn = avalon.parsers[k];
            if (fn) {
                val = fn.call(this, val);
            }
        }
        return val;
    }

    var updateView = {
        input: function input() {
            //处理单个value值处理
            var vdom = this.node;
            var value = this.value + '';
            vdom.dom.value = vdom.props.value = value;
        },
        updateChecked: function updateChecked(vdom, checked) {
            if (vdom.dom) {
                vdom.dom.defaultChecked = vdom.dom.checked = checked;
            }
        },
        radio: function radio() {
            //处理单个checked属性
            var node = this.node;
            var nodeValue = node.props.value;
            var checked;
            if (this.isChecked) {
                checked = !!this.value;
            } else {
                checked = this.value + '' === nodeValue;
            }
            node.props.checked = checked;
            updateView.updateChecked(node, checked);
        },
        checkbox: function checkbox() {
            //处理多个checked属性
            var node = this.node;
            var props = node.props;
            var value = props.value + '';
            var values = [].concat(this.value);
            var checked = values.some(function (el) {
                return el + '' === value;
            });

            props.defaultChecked = props.checked = checked;
            updateView.updateChecked(node, checked);
        },
        select: function select() {
            //处理子级的selected属性
            var a = Array.isArray(this.value) ? this.value.map(String) : this.value + '';
            lookupOption(this.node, a);
        },
        contenteditable: function contenteditable() {
            //处理单个innerHTML 

            var vnodes = fromString(this.value);
            var fragment = createFragment();
            for (var i = 0, el; el = vnodes[i++];) {
                var child = avalon.vdom(el, 'toDOM');
                fragment.appendChild(child);
            }
            avalon.clearHTML(this.dom).appendChild(fragment);
            var list = this.node.children;
            list.length = 0;
            Array.prototype.push.apply(list, vnodes);

            this.duplexCb.call(this.dom);
        }
    };

    var rforAs = /\s+as\s+([$\w]+)/;
    var rident = /^[$a-zA-Z_][$a-zA-Z0-9_]*$/;
    var rinvalid = /^(null|undefined|NaN|window|this|\$index|\$id)$/;
    var rargs = /[$\w_]+/g;
    avalon.directive('for', {
        delay: true,
        priority: 3,
        beforeInit: function beforeInit() {
            var str = this.expr,
                asName;
            str = str.replace(rforAs, function (a, b) {
                /* istanbul ignore if */
                if (!rident.test(b) || rinvalid.test(b)) {
                    avalon.error('alias ' + b + ' is invalid --- must be a valid JS identifier which is not a reserved name.');
                } else {
                    asName = b;
                }
                return '';
            });

            var arr = str.split(' in ');
            var kv = arr[0].match(rargs);
            if (kv.length === 1) {
                //确保avalon._each的回调有三个参数
                kv.unshift('$key');
            }
            this.expr = arr[1];
            this.keyName = kv[0];
            this.valName = kv[1];
            this.signature = avalon.makeHashCode('for');
            if (asName) {
                this.asName = asName;
            }

            delete this.param;
        },
        init: function init() {
            var cb = this.userCb;
            if (typeof cb === 'string' && cb) {
                var arr = addScope(cb, 'for');
                var body = makeHandle(arr[0]);
                this.userCb = new Function('$event', 'var __vmodel__ = this\nreturn ' + body);
            }
            this.node.forDir = this; //暴露给component/index.js中的resetParentChildren方法使用
            this.fragment = ['<div>', this.fragment, '<!--', this.signature, '--></div>'].join('');
            this.cache = {};
        },
        diff: function diff(newVal, oldVal) {
            /* istanbul ignore if */
            if (this.updating) {
                return;
            }
            this.updating = true;
            var traceIds = createFragments(this, newVal);

            if (this.oldTrackIds === void 0) return true;

            if (this.oldTrackIds !== traceIds) {
                this.oldTrackIds = traceIds;
                return true;
            }
        },
        update: function update() {

            if (!this.preFragments) {
                this.fragments = this.fragments || [];
                mountList(this);
            } else {
                diffList(this);
                updateList(this);
            }

            if (this.userCb) {
                var me = this;
                setTimeout(function () {
                    me.userCb.call(me.vm, {
                        type: 'rendered',
                        target: me.begin.dom,
                        signature: me.signature
                    });
                }, 0);
            }
            delete this.updating;
        },
        beforeDispose: function beforeDispose() {
            this.fragments.forEach(function (el) {
                el.dispose();
            });
        }
    });

    function getTraceKey(item) {
        var type = typeof item === 'undefined' ? 'undefined' : _typeof(item);
        return item && type === 'object' ? item.$hashcode : type + ':' + item;
    }

    //创建一组fragment的虚拟DOM
    function createFragments(instance, obj) {
        if (isObject(obj)) {
            var array = Array.isArray(obj);
            var ids = [];
            var fragments = [],
                i = 0;

            instance.isArray = array;
            if (instance.fragments) {
                instance.preFragments = instance.fragments;
                avalon.each(obj, function (key, value) {
                    var k = array ? getTraceKey(value) : key;

                    fragments.push({
                        key: k,
                        val: value,
                        index: i++
                    });
                    ids.push(k);
                });
                instance.fragments = fragments;
            } else {
                avalon.each(obj, function (key, value) {
                    if (!(key in $$skipArray)) {
                        var k = array ? getTraceKey(value) : key;
                        fragments.push(new VFragment([], k, value, i++));
                        ids.push(k);
                    }
                });
                instance.fragments = fragments;
            }
            return ids.join(';;');
        } else {
            return NaN;
        }
    }

    function mountList(instance) {
        var args = instance.fragments.map(function (fragment, index) {
            FragmentDecorator(fragment, instance, index);
            saveInCache(instance.cache, fragment);
            return fragment;
        });
        var list = instance.parentChildren;
        var i = list.indexOf(instance.begin);
        list.splice.apply(list, [i + 1, 0].concat(args));
    }

    function diffList(instance) {
        var cache = instance.cache;
        var newCache = {};
        var fuzzy = [];
        var list = instance.preFragments;

        list.forEach(function (el) {
            el._dispose = true;
        });

        instance.fragments.forEach(function (c, index) {
            var fragment = isInCache(cache, c.key);
            //取出之前的文档碎片
            if (fragment) {
                delete fragment._dispose;
                fragment.oldIndex = fragment.index;
                fragment.index = index; // 相当于 c.index

                resetVM(fragment.vm, instance.keyName);
                fragment.vm[instance.valName] = c.val;
                fragment.vm[instance.keyName] = instance.isArray ? index : fragment.key;
                saveInCache(newCache, fragment);
            } else {
                //如果找不到就进行模糊搜索
                fuzzy.push(c);
            }
        });
        fuzzy.forEach(function (c) {
            var fragment = fuzzyMatchCache(cache, c.key);
            if (fragment) {
                //重复利用
                fragment.oldIndex = fragment.index;
                fragment.key = c.key;
                var val = fragment.val = c.val;
                var index = fragment.index = c.index;

                fragment.vm[instance.valName] = val;
                fragment.vm[instance.keyName] = instance.isArray ? index : fragment.key;
                delete fragment._dispose;
            } else {

                c = new VFragment([], c.key, c.val, c.index);
                fragment = FragmentDecorator(c, instance, c.index);
                list.push(fragment);
            }
            saveInCache(newCache, fragment);
        });

        instance.fragments = list;
        list.sort(function (a, b) {
            return a.index - b.index;
        });
        instance.cache = newCache;
    }

    function resetVM(vm, a, b) {
        if (avalon.config.inProxyMode) {
            vm.$accessors[a].value = NaN;
        } else {
            vm.$accessors[a].set(NaN);
        }
    }

    function updateList(instance) {
        var before = instance.begin.dom;
        var parent = before.parentNode;
        var list = instance.fragments;
        var end = instance.end.dom;

        for (var i = 0, item; item = list[i]; i++) {
            if (item._dispose) {
                list.splice(i, 1);
                i--;
                item.dispose();
                continue;
            }
            if (item.oldIndex !== item.index) {
                var f = item.toFragment();
                var isEnd = before.nextSibling === null;
                parent.insertBefore(f, before.nextSibling);
                if (isEnd && !parent.contains(end)) {
                    parent.insertBefore(end, before.nextSibling);
                }
            }
            before = item.split;
        }
        var ch = instance.parentChildren;
        var startIndex = ch.indexOf(instance.begin);
        var endIndex = ch.indexOf(instance.end);

        list.splice.apply(ch, [startIndex + 1, endIndex - startIndex].concat(list));
        if (parent.nodeName === 'SELECT' && parent._ms_duplex_) {
            updateView['select'].call(parent._ms_duplex_);
        }
    }

    /**
     * 
     * @param {type} fragment
     * @param {type} this
     * @param {type} index
     * @returns { key, val, index, oldIndex, this, dom, split, vm}
     */
    function FragmentDecorator(fragment, instance, index) {
        var data = {};
        data[instance.keyName] = instance.isArray ? index : fragment.key;
        data[instance.valName] = fragment.val;
        if (instance.asName) {
            data[instance.asName] = instance.value;
        }
        var vm = fragment.vm = platform.itemFactory(instance.vm, {
            data: data
        });
        if (instance.isArray) {
            vm.$watch(instance.valName, function (a) {
                if (instance.value && instance.value.set) {
                    instance.value.set(vm[instance.keyName], a);
                }
            });
        } else {
            vm.$watch(instance.valName, function (a) {
                instance.value[fragment.key] = a;
            });
        }

        fragment.index = index;
        fragment.innerRender = avalon.scan(instance.fragment, vm, function () {
            var oldRoot = this.root;
            ap.push.apply(fragment.children, oldRoot.children);
            this.root = fragment;
        });
        return fragment;
    }
    // 新位置: 旧位置
    function isInCache(cache, id) {
        var c = cache[id];
        if (c) {
            var arr = c.arr;
            /* istanbul ignore if*/
            if (arr) {
                var r = arr.pop();
                if (!arr.length) {
                    c.arr = 0;
                }
                return r;
            }
            delete cache[id];
            return c;
        }
    }
    //[1,1,1] number1 number1_ number1__
    function saveInCache(cache, component) {
        var trackId = component.key;
        if (!cache[trackId]) {
            cache[trackId] = component;
        } else {
            var c = cache[trackId];
            var arr = c.arr || (c.arr = []);
            arr.push(component);
        }
    }

    function fuzzyMatchCache(cache) {
        var key;
        for (var id in cache) {
            var key = id;
            break;
        }
        if (key) {
            return isInCache(cache, key);
        }
    }

    //根据VM的属性值或表达式的值切换类名，ms-class='xxx yyy zzz:flag'
    //http://www.cnblogs.com/rubylouvre/archive/2012/12/17/2818540.html
    function classNames() {
        var classes = [];
        for (var i = 0; i < arguments.length; i++) {
            var arg = arguments[i];
            var argType = typeof arg === 'undefined' ? 'undefined' : _typeof(arg);
            if (argType === 'string' || argType === 'number' || arg === true) {
                classes.push(arg);
            } else if (Array.isArray(arg)) {
                classes.push(classNames.apply(null, arg));
            } else if (argType === 'object') {
                for (var key in arg) {
                    if (arg.hasOwnProperty(key) && arg[key]) {
                        classes.push(key);
                    }
                }
            }
        }

        return classes.join(' ');
    }

    avalon.directive('class', {
        diff: function diff(newVal, oldVal) {
            var type = this.type;
            var vdom = this.node;
            var classEvent = vdom.classEvent || {};
            if (type === 'hover') {
                //在移出移入时切换类名
                classEvent.mouseenter = activateClass;
                classEvent.mouseleave = abandonClass;
            } else if (type === 'active') {
                //在获得焦点时切换类名
                classEvent.tabIndex = vdom.props.tabindex || -1;
                classEvent.mousedown = activateClass;
                classEvent.mouseup = abandonClass;
                classEvent.mouseleave = abandonClass;
            }
            vdom.classEvent = classEvent;

            var className = classNames(newVal);

            if ((typeof oldVal === 'undefined' ? 'undefined' : _typeof(oldVal)) === void 0 || oldVal !== className) {
                this.value = className;

                vdom['change-' + type] = className;
                return true;
            }
        },
        update: function update(vdom, value) {
            var dom = vdom.dom;
            if (dom && dom.nodeType == 1) {

                var dirType = this.type;
                var change = 'change-' + dirType;
                var classEvent = vdom.classEvent;
                if (classEvent) {
                    for (var i in classEvent) {
                        if (i === 'tabIndex') {
                            dom[i] = classEvent[i];
                        } else {
                            avalon.bind(dom, i, classEvent[i]);
                        }
                    }
                    vdom.classEvent = {};
                }
                var names = ['class', 'hover', 'active'];
                names.forEach(function (type) {
                    if (dirType !== type) return;
                    if (type === 'class') {
                        dom && setClass(dom, value);
                    } else {
                        var oldClass = dom.getAttribute(change);
                        if (oldClass) {
                            avalon(dom).removeClass(oldClass);
                        }
                        var name = 'change-' + type;
                        dom.setAttribute(name, value);
                    }
                });
            }
        }
    });

    directives.active = directives.hover = directives['class'];

    var classMap = {
        mouseenter: 'change-hover',
        mouseleave: 'change-hover',
        mousedown: 'change-active',
        mouseup: 'change-active'
    };

    function activateClass(e) {
        var elem = e.target;
        avalon(elem).addClass(elem.getAttribute(classMap[e.type]) || '');
    }

    function abandonClass(e) {
        var elem = e.target;
        var name = classMap[e.type];
        avalon(elem).removeClass(elem.getAttribute(name) || '');
        if (name !== 'change-active') {
            avalon(elem).removeClass(elem.getAttribute('change-active') || '');
        }
    }

    function setClass(dom, neo) {
        var old = dom.getAttribute('change-class');
        if (old !== neo) {
            avalon(dom).removeClass(old).addClass(neo);
            dom.setAttribute('change-class', neo);
        }
    }

    getLongID(activateClass);
    getLongID(abandonClass);

    /* 
     * 通过绑定事件同步vmodel
     * 总共有三种方式同步视图
     * 1. 各种事件 input, change, click, propertychange, keydown...
     * 2. value属性重写
     * 3. 定时器轮询
     */

    function updateDataEvents(dom, data) {
        var events = {};
        //添加需要监听的事件
        switch (data.dtype) {
            case 'radio':
            case 'checkbox':
                events.click = updateDataHandle;
                break;
            case 'select':
                events.change = updateDataHandle;
                break;
            case 'contenteditable':
                /* istanbul ignore if */
                if (data.isChanged) {
                    events.blur = updateDataHandle;
                    /* istanbul ignore else */
                } else {
                    /* istanbul ignore if*/

                    if (avalon.modern) {
                        if (window$1.webkitURL) {
                            // http://code.metager.de/source/xref/WebKit/LayoutTests/fast/events/
                            // https://bugs.webkit.org/show_bug.cgi?id=110742
                            events.webkitEditableContentChanged = updateDataHandle;
                        } else if (window$1.MutationEvent) {
                            events.DOMCharacterDataModified = updateDataHandle;
                        }
                        events.input = updateDataHandle;
                        /* istanbul ignore else */
                    } else {
                        events.keydown = updateModelKeyDown;
                        events.paste = updateModelDelay;
                        events.cut = updateModelDelay;
                        events.focus = closeComposition;
                        events.blur = openComposition;
                    }
                }
                break;
            case 'input':
                /* istanbul ignore if */
                if (data.isChanged) {
                    events.change = updateDataHandle;
                    /* istanbul ignore else */
                } else {
                    //http://www.cnblogs.com/rubylouvre/archive/2013/02/17/2914604.html
                    //http://www.matts411.com/post/internet-explorer-9-oninput/
                    if (msie$1 < 10) {
                        //IE6-8的propertychange有问题,第一次用JS修改值时不会触发,而且你是全部清空value也不会触发
                        //IE9的propertychange不支持自动完成,退格,删除,复制,贴粘,剪切或点击右边的小X的清空操作
                        events.propertychange = updateModelHack;
                        events.paste = updateModelDelay;
                        events.cut = updateModelDelay;
                        //IE9在第一次删除字符时不会触发oninput
                        events.keyup = updateModelKeyDown;
                    } else {
                        events.input = updateDataHandle;
                        events.compositionstart = openComposition;
                        //微软拼音输入法的问题需要在compositionend事件中处理
                        events.compositionend = closeComposition;
                        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray
                        //处理低版本的标准浏览器,通过Int8Array进行区分
                        if (!/\[native code\]/.test(window$1.Int8Array)) {
                            events.keydown = updateModelKeyDown; //safari < 5 opera < 11
                            events.paste = updateModelDelay; //safari < 5
                            events.cut = updateModelDelay; //safari < 5 
                            if (window$1.netscape) {
                                // Firefox <= 3.6 doesn't fire the 'input' event when text is filled in through autocomplete
                                events.DOMAutoComplete = updateDataHandle;
                            }
                        }
                    }
                }
                break;
        }

        if (/password|text/.test(dom.type)) {
            events.focus = openCaret; //判定是否使用光标修正功能 
            events.blur = closeCaret;
            data.getCaret = getCaret;
            data.setCaret = setCaret;
        }

        for (var name in events) {
            avalon.bind(dom, name, events[name]);
        }
    }

    function updateModelHack(e) {
        if (e.propertyName === 'value') {
            updateDataHandle.call(this, e);
        }
    }

    function updateModelDelay(e) {
        var elem = this;
        setTimeout(function () {
            updateDataHandle.call(elem, e);
        }, 0);
    }

    function openCaret() {
        this.caret = true;
    }
    /* istanbul ignore next */
    function closeCaret() {
        this.caret = false;
    }
    /* istanbul ignore next */
    function openComposition() {
        this.composing = true;
    }
    /* istanbul ignore next */
    function closeComposition(e) {
        this.composing = false;
        updateModelDelay.call(this, e);
    }
    /* istanbul ignore next */
    function updateModelKeyDown(e) {
        var key = e.keyCode;
        // ignore
        //    command            modifiers                   arrows
        if (key === 91 || 15 < key && key < 19 || 37 <= key && key <= 40) return;
        updateDataHandle.call(this, e);
    }

    getShortID(openCaret);
    getShortID(closeCaret);
    getShortID(openComposition);
    getShortID(closeComposition);
    getShortID(updateDataHandle);
    getShortID(updateModelHack);
    getShortID(updateModelDelay);
    getShortID(updateModelKeyDown);

    //IE6-8要处理光标时需要异步
    var mayBeAsync = function mayBeAsync(fn) {
        setTimeout(fn, 0);
    };
    /* istanbul ignore next */
    function setCaret(target, cursorPosition) {
        var range$$1;
        if (target.createTextRange) {
            mayBeAsync(function () {
                target.focus();
                range$$1 = target.createTextRange();
                range$$1.collapse(true);
                range$$1.moveEnd('character', cursorPosition);
                range$$1.moveStart('character', cursorPosition);
                range$$1.select();
            });
        } else {
            target.focus();
            if (target.selectionStart !== undefined) {
                target.setSelectionRange(cursorPosition, cursorPosition);
            }
        }
    }
    /* istanbul ignore next*/
    function getCaret(target) {
        var start = 0;
        var normalizedValue;
        var range$$1;
        var textInputRange;
        var len;
        var endRange;

        if (target.selectionStart + target.selectionEnd > -1) {
            start = target.selectionStart;
        } else {
            range$$1 = document$1.selection.createRange();

            if (range$$1 && range$$1.parentElement() === target) {
                len = target.value.length;
                normalizedValue = target.value.replace(/\r\n/g, '\n');

                textInputRange = target.createTextRange();
                textInputRange.moveToBookmark(range$$1.getBookmark());

                endRange = target.createTextRange();
                endRange.collapse(false);

                if (textInputRange.compareEndPoints('StartToEnd', endRange) > -1) {
                    start = len;
                } else {
                    start = -textInputRange.moveStart('character', -len);
                    start += normalizedValue.slice(0, start).split('\n').length - 1;
                }
            }
        }

        return start;
    }

    avalon.directive('duplex', {
        priority: 9999999,
        beforeInit: duplexBeforeInit,
        init: duplexInit,
        diff: duplexDiff,
        update: function update(vdom, value) {
            if (!this.dom) {
                duplexBind.call(this, vdom, updateDataEvents);
            }
            //如果不支持input.value的Object.defineProperty的属性支持,
            //需要通过轮询同步, chrome 42及以下版本需要这个hack
            pollValue.call(this, avalon.msie, valueHijack);
            //更新视图

            updateView[this.dtype].call(this);
        }
    });

    function pollValue(isIE, valueHijack$$1) {
        var dom = this.dom;
        if (this.isString && valueHijack$$1 && !isIE && !dom.valueHijack) {
            dom.valueHijack = updateDataHandle;
            var intervalID = setInterval(function () {
                if (!avalon.contains(avalon.root, dom)) {
                    clearInterval(intervalID);
                } else {
                    dom.valueHijack({ type: 'poll' });
                }
            }, 30);
            return intervalID;
        }
    }
    avalon.__pollValue = pollValue; //export to test
    /* istanbul ignore if */
    if (avalon.msie < 8) {
        var oldUpdate = updateView.updateChecked;
        updateView.updateChecked = function (vdom, checked) {
            var dom = vdom.dom;
            if (dom) {
                setTimeout(function () {
                    oldUpdate(vdom, checked);
                    dom.firstCheckedIt = 1;
                }, dom.firstCheckedIt ? 31 : 16);
                //IE6,7 checkbox, radio是使用defaultChecked控制选中状态，
                //并且要先设置defaultChecked后设置checked
                //并且必须设置延迟(因为必须插入DOM树才生效)
            }
        };
    }

    avalon.directive('rules', {
        diff: function diff(rules) {
            if (isObject(rules)) {
                var vdom = this.node;
                vdom.rules = platform.toJson(rules);
                return true;
            }
        }
    });
    function isRegExp(value) {
        return avalon.type(value) === 'regexp';
    }
    var rmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/i;
    var rurl = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/;
    function isCorrectDate(value) {
        if (typeof value === "string" && value) {
            //是字符串但不能是空字符
            var arr = value.split("-"); //可以被-切成3份，并且第1个是4个字符
            if (arr.length === 3 && arr[0].length === 4) {
                var year = ~~arr[0]; //全部转换为非负整数
                var month = ~~arr[1] - 1;
                var date = ~~arr[2];
                var d = new Date(year, month, date);
                return d.getFullYear() === year && d.getMonth() === month && d.getDate() === date;
            }
        }
        return false;
    }
    //https://github.com/adform/validator.js/blob/master/validator.js
    avalon.shadowCopy(avalon.validators, {
        pattern: {
            message: '必须匹配{{pattern}}这样的格式',
            get: function get(value, field, next) {
                var elem = field.dom;
                var data = field.data;
                if (!isRegExp(data.pattern)) {
                    var h5pattern = elem.getAttribute("pattern");
                    data.pattern = new RegExp('^(?:' + h5pattern + ')$');
                }
                next(data.pattern.test(value));
                return value;
            }
        },
        digits: {
            message: '必须整数',
            get: function get(value, field, next) {
                //整数
                next(/^\-?\d+$/.test(value));
                return value;
            }
        },
        number: {
            message: '必须数字',
            get: function get(value, field, next) {
                //数值
                next(!!value && isFinite(value)); // isFinite('') --> true
                return value;
            }
        },
        norequired: {
            message: '',
            get: function get(value, field, next) {
                next(true);
                return value;
            }
        },
        required: {
            message: '必须填写',
            get: function get(value, field, next) {
                next(value !== '');
                return value;
            }
        },
        equalto: {
            message: '密码输入不一致',
            get: function get(value, field, next) {
                var id = String(field.data.equalto);
                var other = avalon(document.getElementById(id)).val() || "";
                next(value === other);
                return value;
            }
        },
        date: {
            message: '日期格式不正确',
            get: function get(value, field, next) {
                var data = field.data;
                if (isRegExp(data.date)) {
                    next(data.date.test(value));
                } else {
                    next(isCorrectDate(value));
                }
                return value;
            }
        },
        url: {
            message: 'URL格式不正确',
            get: function get(value, field, next) {
                next(rurl.test(value));
                return value;
            }
        },
        email: {
            message: 'email格式不正确',
            get: function get(value, field, next) {
                next(rmail.test(value));
                return value;
            }
        },
        minlength: {
            message: '最少输入{{minlength}}个字',
            get: function get(value, field, next) {
                var num = parseInt(field.data.minlength, 10);
                next(value.length >= num);
                return value;
            }
        },
        maxlength: {
            message: '最多输入{{maxlength}}个字',
            get: function get(value, field, next) {
                var num = parseInt(field.data.maxlength, 10);
                next(value.length <= num);
                return value;
            }
        },
        min: {
            message: '输入值不能小于{{min}}',
            get: function get(value, field, next) {
                var num = parseInt(field.data.min, 10);
                next(parseFloat(value) >= num);
                return value;
            }
        },
        max: {
            message: '输入值不能大于{{max}}',
            get: function get(value, field, next) {
                var num = parseInt(field.data.max, 10);
                next(parseFloat(value) <= num);
                return value;
            }
        },
        chs: {
            message: '必须是中文字符',
            get: function get(value, field, next) {
                next(/^[\u4e00-\u9fa5]+$/.test(value));
                return value;
            }
        }
    });

    var valiDir = avalon.directive('validate', {
        diff: function diff(validator) {
            var vdom = this.node;
            if (vdom.validator) {
                return;
            }
            if (isObject(validator)) {
                //注意，这个Form标签的虚拟DOM有两个验证对象
                //一个是vmValidator，它是用户VM上的那个原始子对象，也是一个VM
                //一个是validator，它是vmValidator.$model， 这是为了防止IE6－8添加子属性时添加的hack
                //也可以称之为safeValidate
                vdom.validator = validator;
                validator = platform.toJson(validator);
                validator.vdom = vdom;
                validator.dom = vdom.dom;

                for (var name in valiDir.defaults) {
                    if (!validator.hasOwnProperty(name)) {
                        validator[name] = valiDir.defaults[name];
                    }
                }
                validator.fields = validator.fields || [];
                vdom.vmValidator = validator;
                return true;
            }
        },
        update: function update(vdom) {

            var vmValidator = vdom.vmValidator;
            var validator = vdom.validator;
            var dom = vdom.dom;
            dom._ms_validate_ = vmValidator;

            collectFeild(vdom.children, vmValidator.fields, vmValidator);
            var type = window.netscape ? 'keypress' : 'focusin';
            avalon.bind(document, type, findValidator);
            //为了方便用户手动执行验证，我们需要为原始vmValidate上添加一个onManual方法
            function onManual() {
                var v = this;
                v && valiDir.validateAll.call(v, v.onValidateAll);
            }

            try {
                var fn = vmValidator.onManual = onManual.bind(vmValidator);
                validator.onManual = fn;
            } catch (e) {
                avalon.warn('要想使用onManual方法，必须在validate对象预定义一个空的onManual函数');
            }
            delete vdom.vmValidator;

            dom.setAttribute('novalidate', 'novalidate');

            /* istanbul ignore if */
            if (vmValidator.validateAllInSubmit) {
                avalon.bind(dom, 'submit', validateAllInSubmitFn);
            }
        },
        validateAll: function validateAll(callback) {
            var validator = this;
            var vdom = this.vdom;
            var fields = validator.fields = [];
            collectFeild(vdom.children, fields, validator);
            var fn = typeof callback === 'function' ? callback : validator.onValidateAll;
            var promises = validator.fields.filter(function (field) {
                var el = field.dom;
                return el && !el.disabled && validator.dom.contains(el);
            }).map(function (field) {
                return valiDir.validate(field, true);
            });
            var uniq = {};
            return Promise.all(promises).then(function (array) {
                var reasons = array.concat.apply([], array);
                if (validator.deduplicateInValidateAll) {
                    reasons = reasons.filter(function (reason) {
                        var el = reason.element;
                        var uuid = el.uniqueID || (el.uniqueID = setTimeout('1'));
                        if (uniq[uuid]) {
                            return false;
                        } else {
                            return uniq[uuid] = true;
                        }
                    });
                }
                fn.call(vdom.dom, reasons); //这里只放置未通过验证的组件
            });
        },

        validate: function validate(field, isValidateAll, event) {

            var promises = [];
            var value = field.value;
            var elem = field.dom;
            /* istanbul ignore if */
            if (typeof Promise !== 'function') {
                //avalon-promise不支持phantomjs
                avalon.warn('浏览器不支持原生Promise,请下载并<script src=url>引入\nhttps://github.com/RubyLouvre/avalon/blob/master/test/promise.js');
            }
            /* istanbul ignore if */
            if (elem.disabled) return;
            var rules = field.vdom.rules;
            var ngs = [],
                isOk = true;
            if (!(rules.norequired && value === '')) {
                for (var ruleName in rules) {
                    var ruleValue = rules[ruleName];
                    if (ruleValue === false) continue;
                    var hook = avalon.validators[ruleName];
                    var resolve;
                    promises.push(new Promise(function (a, b) {
                        resolve = a;
                    }));
                    var next = function next(a) {
                        var reason = {
                            element: elem,
                            data: field.data,
                            message: elem.getAttribute('data-' + ruleName + '-message') || elem.getAttribute('data-message') || hook.message,
                            validateRule: ruleName,
                            getMessage: getMessage
                        };
                        if (a) {
                            resolve(true);
                        } else {
                            isOk = false;
                            ngs.push(reason);
                            resolve(false);
                        }
                    };
                    field.data = {};
                    field.data[ruleName] = ruleValue;
                    hook.get(value, field, next);
                }
            }

            //如果promises不为空，说明经过验证拦截器
            return Promise.all(promises).then(function (array) {
                if (!isValidateAll) {
                    var validator = field.validator;
                    if (isOk) {
                        validator.onSuccess.call(elem, [{
                            data: field.data,
                            element: elem
                        }], event);
                    } else {
                        validator.onError.call(elem, ngs, event);
                    }
                    validator.onComplete.call(elem, ngs, event);
                }
                return ngs;
            });
        }
    });

    //https://github.com/RubyLouvre/avalon/issues/1977
    function getValidate(dom) {
        while (dom.tagName !== 'FORM') {
            dom = dom.parentNode;
        }
        return dom._ms_validate_;
    }

    function validateAllInSubmitFn(e) {
        e.preventDefault();
        var v = getValidate(e.target);
        if (v && v.onManual) {
            v.onManual();
        }
    }

    function collectFeild(nodes, fields, validator) {
        for (var i = 0, vdom; vdom = nodes[i++];) {
            var duplex = vdom.rules && vdom.duplex;
            if (duplex) {
                fields.push(duplex);
                bindValidateEvent(duplex, validator);
            } else if (vdom.children) {
                collectFeild(vdom.children, fields, validator);
            } else if (Array.isArray(vdom)) {
                collectFeild(vdom, fields, validator);
            }
        }
    }

    function findValidator(e) {
        var dom = e.target;
        var duplex = dom._ms_duplex_;
        var vdom = (duplex || {}).vdom;
        if (duplex && vdom.rules && !duplex.validator) {
            var msValidator = getValidate(dom);
            if (msValidator && avalon.Array.ensure(msValidator.fields, duplex)) {
                bindValidateEvent(duplex, msValidator);
            }
        }
    }

    function singleValidate(e) {
        var dom = e.target;
        var duplex = dom._ms_duplex_;
        var msValidator = getValidate(e.target);
        msValidator && msValidator.validate(duplex, 0, e);
    }

    function bindValidateEvent(field, validator) {

        var node = field.dom;
        if (field.validator) {
            return;
        }
        field.validator = validator;
        /* istanbul ignore if */
        if (validator.validateInKeyup && !field.isChanged && !field.debounceTime) {
            avalon.bind(node, 'keyup', singleValidate);
        }
        /* istanbul ignore if */
        if (validator.validateInBlur) {
            avalon.bind(node, 'blur', singleValidate);
        }
        /* istanbul ignore if */
        if (validator.resetInFocus) {
            avalon.bind(node, 'focus', function (e) {
                var dom = e.target;
                var field = dom._ms_duplex_;
                var validator = getValidate(e.target);
                validator && validator.onReset.call(dom, e, field);
            });
        }
    }
    var rformat = /\\?{{([^{}]+)\}}/gm;

    function getMessage() {
        var data = this.data || {};
        return this.message.replace(rformat, function (_, name) {
            return data[name] == null ? '' : data[name];
        });
    }
    valiDir.defaults = {
        validate: valiDir.validate,
        onError: avalon.noop,
        onSuccess: avalon.noop,
        onComplete: avalon.noop,
        onManual: avalon.noop,
        onReset: avalon.noop,
        onValidateAll: avalon.noop,
        validateInBlur: true, //@config {Boolean} true，在blur事件中进行验证,触发onSuccess, onError, onComplete回调
        validateInKeyup: true, //@config {Boolean} true，在keyup事件中进行验证,触发onSuccess, onError, onComplete回调
        validateAllInSubmit: true, //@config {Boolean} true，在submit事件中执行onValidateAll回调
        resetInFocus: true, //@config {Boolean} true，在focus事件中执行onReset回调,
        deduplicateInValidateAll: false //@config {Boolean} false，在validateAll回调中对reason数组根据元素节点进行去重
    };

    /**
     * 一个directive装饰器
     * @returns {directive}
     */
    // DirectiveDecorator(scope, binding, vdom, this)
    // Decorator(vm, options, callback)
    function Directive(vm, binding, vdom, render) {
        var type = binding.type;
        var decorator = avalon.directives[type];
        if (inBrowser) {
            var dom = avalon.vdom(vdom, 'toDOM');
            if (dom.nodeType === 1) {
                dom.removeAttribute(binding.attrName);
            }
            vdom.dom = dom;
        }
        var callback = decorator.update ? function (value) {
            if (!render.mount && /css|visible|duplex/.test(type)) {
                render.callbacks.push(function () {
                    decorator.update.call(directive$$1, directive$$1.node, value);
                });
            } else {
                decorator.update.call(directive$$1, directive$$1.node, value);
            }
        } : avalon.noop;
        for (var key in decorator) {
            binding[key] = decorator[key];
        }
        binding.node = vdom;
        var directive$$1 = new Action(vm, binding, callback);
        if (directive$$1.init) {
            //这里可能会重写node, callback, type, name
            directive$$1.init();
        }
        directive$$1.update();
        return directive$$1;
    }

    var eventMap = avalon.oneObject('animationend,blur,change,input,' + 'click,dblclick,focus,keydown,keypress,keyup,mousedown,mouseenter,' + 'mouseleave,mousemove,mouseout,mouseover,mouseup,scan,scroll,submit', 'on');
    function parseAttributes(dirs, tuple) {
        var node = tuple[0],
            uniq = {},
            bindings = [];
        var hasIf = false;
        for (var name in dirs) {
            var value = dirs[name];
            var arr = name.split('-');
            // ms-click
            if (name in node.props) {
                var attrName = name;
            } else {
                attrName = ':' + name.slice(3);
            }
            if (eventMap[arr[1]]) {
                arr.splice(1, 0, 'on');
            }
            //ms-on-click
            if (arr[1] === 'on') {
                arr[3] = parseFloat(arr[3]) || 0;
            }

            var type = arr[1];
            if (type === 'controller' || type === 'important') continue;
            if (directives[type]) {

                var binding = {
                    type: type,
                    param: arr[2],
                    attrName: attrName,
                    name: arr.join('-'),
                    expr: value,
                    priority: directives[type].priority || type.charCodeAt(0) * 100
                };
                if (type === 'if') {
                    hasIf = true;
                }
                if (type === 'on') {
                    binding.priority += arr[3];
                }
                if (!uniq[binding.name]) {
                    uniq[binding.name] = value;
                    bindings.push(binding);
                    if (type === 'for') {
                        return [avalon.mix(binding, tuple[3])];
                    }
                }
            }
        }
        bindings.sort(byPriority);

        if (hasIf) {
            var ret = [];
            for (var i = 0, el; el = bindings[i++];) {
                ret.push(el);
                if (el.type === 'if') {
                    return ret;
                }
            }
        }
        return bindings;
    }
    function byPriority(a, b) {
        return a.priority - b.priority;
    }

    var rimprovePriority = /[+-\?]/;
    var rinnerValue = /__value__\)$/;
    function parseInterpolate(dir) {
        var rlineSp = /\n\r?/g;
        var str = dir.nodeValue.trim().replace(rlineSp, '');
        var tokens = [];
        do {
            //aaa{{@bbb}}ccc
            var index = str.indexOf(config.openTag);
            index = index === -1 ? str.length : index;
            var value = str.slice(0, index);
            if (/\S/.test(value)) {
                tokens.push(avalon.quote(avalon._decode(value)));
            }
            str = str.slice(index + config.openTag.length);
            if (str) {
                index = str.indexOf(config.closeTag);
                var value = str.slice(0, index);
                var expr = avalon.unescapeHTML(value);
                if (/\|\s*\w/.test(expr)) {
                    //如果存在过滤器，优化干掉
                    var arr = addScope(expr, 'expr');
                    if (arr[1]) {
                        expr = arr[1].replace(rinnerValue, arr[0] + ')');
                    }
                }
                if (rimprovePriority) {
                    expr = '(' + expr + ')';
                }
                tokens.push(expr);

                str = str.slice(index + config.closeTag.length);
            }
        } while (str.length);
        return [{
            expr: tokens.join('+'),
            name: 'expr',
            type: 'expr'
        }];
    }

    function getChildren(arr) {
        var count = 0;
        for (var i = 0, el; el = arr[i++];) {
            if (el.nodeName === '#document-fragment') {
                count += getChildren(el.children);
            } else {
                count += 1;
            }
        }
        return count;
    }
    function groupTree(parent, children) {
        children && children.forEach(function (vdom) {
            if (!vdom) return;
            var vlength = vdom.children && getChildren(vdom.children);
            if (vdom.nodeName === '#document-fragment') {
                var dom = createFragment();
            } else {
                dom = avalon.vdom(vdom, 'toDOM');
                var domlength = dom.childNodes && dom.childNodes.length;
                if (domlength && vlength && domlength > vlength) {
                    if (!appendChildMayThrowError[dom.nodeName]) {
                        avalon.clearHTML(dom);
                    }
                }
            }
            if (vlength) {
                groupTree(dom, vdom.children);
                if (vdom.nodeName === 'select') {
                    var values = [];
                    getSelectedValue(vdom, values);
                    lookupOption(vdom, values);
                }
            }
            //高级版本可以尝试 querySelectorAll

            try {
                if (!appendChildMayThrowError[parent.nodeName]) {
                    parent.appendChild(dom);
                }
            } catch (e) {}
        });
    }

    function dumpTree(elem) {
        if (elem) {
            var firstChild;
            while (firstChild = elem.firstChild) {
                if (firstChild.nodeType === 1) {
                    dumpTree(firstChild);
                }
                elem.removeChild(firstChild);
            }
        }
    }

    function getRange(childNodes, node) {
        var i = childNodes.indexOf(node) + 1;
        var deep = 1,
            nodes = [],
            end;
        nodes.start = i;
        while (node = childNodes[i++]) {
            nodes.push(node);
            if (node.nodeName === '#comment') {
                if (startWith(node.nodeValue, 'ms-for:')) {
                    deep++;
                } else if (node.nodeValue === 'ms-for-end:') {
                    deep--;
                    if (deep === 0) {
                        end = node;
                        nodes.pop();
                        break;
                    }
                }
            }
        }
        nodes.end = end;
        return nodes;
    }

    function startWith(long, short) {
        return long.indexOf(short) === 0;
    }

    var appendChildMayThrowError = {
        '#text': 1,
        '#comment': 1,
        script: 1,
        style: 1,
        noscript: 1
    };

    /**
     * 生成一个渲染器,并作为它第一个遇到的ms-controller对应的VM的$render属性
     * @param {String|DOM} node
     * @param {ViewModel|Undefined} vm
     * @param {Function|Undefined} beforeReady
     * @returns {Render}
     */
    avalon.scan = function (node, vm, beforeReady) {
        return new Render(node, vm, beforeReady || avalon.noop);
    };

    /**
     * avalon.scan 的内部实现
     */
    function Render(node, vm, beforeReady) {
        this.root = node; //如果传入的字符串,确保只有一个标签作为根节点
        this.vm = vm;
        this.beforeReady = beforeReady;
        this.bindings = []; //收集待加工的绑定属性
        this.callbacks = [];
        this.directives = [];
        this.init();
    }

    Render.prototype = {
        /**
         * 开始扫描指定区域
         * 收集绑定属性
         * 生成指令并建立与VM的关联
         */
        init: function init() {
            var vnodes;
            if (this.root && this.root.nodeType > 0) {
                vnodes = fromDOM(this.root); //转换虚拟DOM
                //将扫描区域的每一个节点与其父节点分离,更少指令对DOM操作时,对首屏输出造成的频繁重绘
                dumpTree(this.root);
            } else if (typeof this.root === 'string') {
                vnodes = fromString(this.root); //转换虚拟DOM
            } else {
                return avalon.warn('avalon.scan first argument must element or HTML string');
            }

            this.root = vnodes[0];
            this.vnodes = vnodes;
            this.scanChildren(vnodes, this.vm, true);
        },
        scanChildren: function scanChildren(children, scope, isRoot) {
            for (var i = 0; i < children.length; i++) {
                var vdom = children[i];
                switch (vdom.nodeName) {
                    case '#text':
                        scope && this.scanText(vdom, scope);
                        break;
                    case '#comment':
                        scope && this.scanComment(vdom, scope, children);
                        break;
                    case '#document-fragment':
                        this.scanChildren(vdom.children, scope, false);
                        break;
                    default:
                        this.scanTag(vdom, scope, children, false);
                        break;
                }
            }
            if (isRoot) {
                this.complete();
            }
        },

        /**
         * 从文本节点获取指令
         * @param {type} vdom 
         * @param {type} scope
         * @returns {undefined}
         */
        scanText: function scanText(vdom, scope) {
            if (config.rexpr.test(vdom.nodeValue)) {
                this.bindings.push([vdom, scope, {
                    nodeValue: vdom.nodeValue
                }]);
            }
        },

        /**
         * 从注释节点获取指令
         * @param {type} vdom 
         * @param {type} scope
         * @param {type} parentChildren
         * @returns {undefined}
         */
        scanComment: function scanComment(vdom, scope, parentChildren) {
            if (startWith(vdom.nodeValue, 'ms-for:')) {
                this.getForBinding(vdom, scope, parentChildren);
            }
        },

        /**
         * 从元素节点的nodeName与属性中获取指令
         * @param {type} vdom 
         * @param {type} scope
         * @param {type} parentChildren
         * @param {type} isRoot 用于执行complete方法
         * @returns {undefined}
         */
        scanTag: function scanTag(vdom, scope, parentChildren, isRoot) {
            var dirs = {},
                attrs = vdom.props,
                hasDir,
                hasFor;
            for (var attr in attrs) {
                var value = attrs[attr];
                var oldName = attr;
                if (attr.charAt(0) === ':') {
                    attr = 'ms-' + attr.slice(1);
                }
                if (startWith(attr, 'ms-')) {
                    dirs[attr] = value;
                    var type = attr.match(/\w+/g)[1];
                    type = eventMap[type] || type;
                    if (!directives[type]) {
                        avalon.warn(attr + ' has not registered!');
                    }
                    hasDir = true;
                }
                if (attr === 'ms-for') {
                    hasFor = value;
                    delete attrs[oldName];
                }
            }
            var $id = dirs['ms-important'] || dirs['ms-controller'];
            if ($id) {
                /**
                 * 后端渲染
                 * serverTemplates后端给avalon添加的对象,里面都是模板,
                 * 将原来后端渲染好的区域再还原成原始样子,再被扫描
                 */
                var templateCaches = avalon.serverTemplates;
                var temp = templateCaches && templateCaches[$id];
                if (temp) {
                    avalon.log('前端再次渲染后端传过来的模板');
                    var node = fromString(temp)[0];
                    for (var i in node) {
                        vdom[i] = node[i];
                    }
                    delete templateCaches[$id];
                    this.scanTag(vdom, scope, parentChildren, isRoot);
                    return;
                }
                //推算出指令类型
                var type = dirs['ms-important'] === $id ? 'important' : 'controller';
                //推算出用户定义时属性名,是使用ms-属性还是:属性
                var attrName = 'ms-' + type in attrs ? 'ms-' + type : ':' + type;

                if (inBrowser) {
                    delete attrs[attrName];
                }
                var dir = directives[type];
                scope = dir.getScope.call(this, $id, scope);
                if (!scope) {
                    return;
                } else {
                    var clazz = attrs['class'];
                    if (clazz) {
                        attrs['class'] = (' ' + clazz + ' ').replace(' ms-controller ', '').trim();
                    }
                }
                var render = this;
                scope.$render = render;
                this.callbacks.push(function () {
                    //用于删除ms-controller
                    dir.update.call(render, vdom, attrName, $id);
                });
            }
            if (hasFor) {
                if (vdom.dom) {
                    vdom.dom.removeAttribute(oldName);
                }
                return this.getForBindingByElement(vdom, scope, parentChildren, hasFor);
            }

            if (/^ms\-/.test(vdom.nodeName)) {
                attrs.is = vdom.nodeName;
            }

            if (attrs['is']) {
                if (!dirs['ms-widget']) {
                    dirs['ms-widget'] = '{}';
                }
                hasDir = true;
            }
            if (hasDir) {
                this.bindings.push([vdom, scope, dirs]);
            }
            var children = vdom.children;
            //如果存在子节点,并且不是容器元素(script, stype, textarea, xmp...)
            if (!orphanTag[vdom.nodeName] && children && children.length && !delayCompileNodes(dirs)) {
                this.scanChildren(children, scope, false);
            }
        },

        /**
         * 将绑定属性转换为指令
         * 执行各种回调与优化指令
         * @returns {undefined}
         */
        complete: function complete() {
            this.yieldDirectives();
            this.beforeReady();
            if (inBrowser) {
                var root$$1 = this.root;
                if (inBrowser) {
                    var rootDom = avalon.vdom(root$$1, 'toDOM');
                    groupTree(rootDom, root$$1.children);
                }
            }

            this.mount = true;
            var fn;
            while (fn = this.callbacks.pop()) {
                fn();
            }
            this.optimizeDirectives();
        },

        /**
         * 将收集到的绑定属性进行深加工,最后转换指令
         * @returns {Array<tuple>}
         */
        yieldDirectives: function yieldDirectives() {
            var tuple;
            while (tuple = this.bindings.shift()) {
                var vdom = tuple[0],
                    scope = tuple[1],
                    dirs = tuple[2],
                    bindings = [];
                if ('nodeValue' in dirs) {
                    bindings = parseInterpolate(dirs);
                } else if (!('ms-skip' in dirs)) {
                    bindings = parseAttributes(dirs, tuple);
                }
                for (var i = 0, binding; binding = bindings[i++];) {
                    var dir = directives[binding.type];
                    if (!inBrowser && /on|duplex|active|hover/.test(binding.type)) {
                        continue;
                    }
                    if (dir.beforeInit) {
                        dir.beforeInit.call(binding);
                    }

                    var directive$$1 = new Directive(scope, binding, vdom, this);
                    this.directives.push(directive$$1);
                }
            }
        },

        /**
         * 修改指令的update与callback方法,让它们以后执行时更加高效
         * @returns {undefined}
         */
        optimizeDirectives: function optimizeDirectives() {
            for (var i = 0, el; el = this.directives[i++];) {
                el.callback = directives[el.type].update;
                el.update = newUpdate;
                el._isScheduled = false;
            }
        },

        update: function update() {
            for (var i = 0, el; el = this.directives[i++];) {
                el.update();
            }
        },

        /**
         * 销毁所有指令
         * @returns {undefined}
         */
        dispose: function dispose() {
            var list = this.directives || [];
            for (var i = 0, el; el = list[i++];) {
                el.dispose();
            }
            //防止其他地方的this.innerRender && this.innerRender.dispose报错
            for (var _i6 in this) {
                if (_i6 !== 'dispose') delete this[_i6];
            }
        },

        /**
         * 将循环区域转换为for指令
         * @param {type} begin 注释节点
         * @param {type} scope
         * @param {type} parentChildren
         * @param {type} userCb 循环结束回调
         * @returns {undefined}
         */
        getForBinding: function getForBinding(begin, scope, parentChildren, userCb) {
            var expr = begin.nodeValue.replace('ms-for:', '').trim();
            begin.nodeValue = 'ms-for:' + expr;
            var nodes = getRange(parentChildren, begin);
            var end = nodes.end;
            var fragment = avalon.vdom(nodes, 'toHTML');
            parentChildren.splice(nodes.start, nodes.length);
            begin.props = {};
            this.bindings.push([begin, scope, {
                'ms-for': expr
            }, {
                begin: begin,
                end: end,
                expr: expr,
                userCb: userCb,
                fragment: fragment,
                parentChildren: parentChildren
            }]);
        },

        /**
         * 在带ms-for元素节点旁添加两个注释节点,组成循环区域
         * @param {type} vdom
         * @param {type} scope
         * @param {type} parentChildren
         * @param {type} expr
         * @returns {undefined}
         */
        getForBindingByElement: function getForBindingByElement(vdom, scope, parentChildren, expr) {
            var index = parentChildren.indexOf(vdom); //原来带ms-for的元素节点
            var props = vdom.props;
            var begin = {
                nodeName: '#comment',
                nodeValue: 'ms-for:' + expr
            };
            if (props.slot) {
                begin.slot = props.slot;
                delete props.slot;
            }
            var end = {
                nodeName: '#comment',
                nodeValue: 'ms-for-end:'
            };
            parentChildren.splice(index, 1, begin, vdom, end);
            this.getForBinding(begin, scope, parentChildren, props['data-for-rendered']);
        }
    };
    var viewID;

    function newUpdate() {
        var oldVal = this.beforeUpdate();
        var newVal = this.value = this.get();
        if (this.callback && this.diff(newVal, oldVal)) {
            this.callback(this.node, this.value);
            var vm = this.vm;
            var $render = vm.$render;
            var list = vm.$events['onViewChange'];
            /* istanbul ignore if */
            if (list && $render && $render.root && !avalon.viewChanging) {
                if (viewID) {
                    clearTimeout(viewID);
                    viewID = null;
                }
                viewID = setTimeout(function () {
                    list.forEach(function (el) {
                        el.callback.call(vm, {
                            type: 'viewchange',
                            target: $render.root,
                            vmodel: vm
                        });
                    });
                });
            }
        }
        this._isScheduled = false;
    }

    var events = 'onInit,onReady,onViewChange,onDispose,onEnter,onLeave';
    var componentEvents = avalon.oneObject(events);

    function toObject(value) {
        var value = platform.toJson(value);
        if (Array.isArray(value)) {
            var v = {};
            value.forEach(function (el) {
                el && avalon.shadowCopy(v, el);
            });
            return v;
        }
        return value;
    }
    var componentQueue = [];
    avalon.directive('widget', {
        delay: true,
        priority: 4,
        deep: true,
        init: function init() {
            //cached属性必须定义在组件容器里面,不是template中
            var vdom = this.node;
            this.cacheVm = !!vdom.props.cached;
            if (vdom.dom && vdom.nodeName === '#comment') {
                var comment = vdom.dom;
            }
            var oldValue = this.getValue();
            var value = toObject(oldValue);
            //外部VM与内部VM
            // ＝＝＝创建组件的VM＝＝BEGIN＝＝＝
            var is = vdom.props.is || value.is;
            this.is = is;
            var component = avalon.components[is];
            //外部传入的总大于内部
            if (!('fragment' in this)) {
                if (!vdom.isVoidTag) {
                    //提取组件容器内部的东西作为模板
                    var text = vdom.children[0];
                    if (text && text.nodeValue) {
                        this.fragment = text.nodeValue;
                    } else {
                        this.fragment = avalon.vdom(vdom.children, 'toHTML');
                    }
                } else {
                    this.fragment = false;
                }
            }
            //如果组件还没有注册，那么将原元素变成一个占位用的注释节点
            if (!component) {
                this.readyState = 0;
                vdom.nodeName = '#comment';
                vdom.nodeValue = 'unresolved component placeholder';
                delete vdom.dom;
                avalon.Array.ensure(componentQueue, this);
                return;
            }

            //如果是非空元素，比如说xmp, ms-*, template
            var id = value.id || value.$id;
            var hasCache = avalon.vmodels[id];
            var fromCache = false;
            // this.readyState = 1
            if (hasCache) {
                comVm = hasCache;
                this.comVm = comVm;
                replaceRoot(this, comVm.$render);
                fromCache = true;
            } else {
                if (typeof component === 'function') {
                    component = new component(value);
                }
                var comVm = createComponentVm(component, value, is);
                this.readyState = 1;
                fireComponentHook(comVm, vdom, 'Init');
                this.comVm = comVm;

                // ＝＝＝创建组件的VM＝＝END＝＝＝
                var innerRender = avalon.scan(component.template, comVm);
                comVm.$render = innerRender;
                replaceRoot(this, innerRender);
                var nodesWithSlot = [];
                var directives$$1 = [];
                if (this.fragment || component.soleSlot) {
                    var curVM = this.fragment ? this.vm : comVm;
                    var curText = this.fragment || '{{##' + component.soleSlot + '}}';
                    var childBoss = avalon.scan('<div>' + curText + '</div>', curVM, function () {
                        nodesWithSlot = this.root.children;
                    });
                    directives$$1 = childBoss.directives;
                    this.childBoss = childBoss;
                    for (var i in childBoss) {
                        delete childBoss[i];
                    }
                }
                Array.prototype.push.apply(innerRender.directives, directives$$1);

                var arraySlot = [],
                    objectSlot = {};
                //从用户写的元素内部 收集要移动到 新创建的组件内部的元素
                if (component.soleSlot) {
                    arraySlot = nodesWithSlot;
                } else {
                    nodesWithSlot.forEach(function (el, i) {
                        //要求带slot属性
                        if (el.slot) {
                            var nodes = getRange(nodesWithSlot, el);
                            nodes.push(nodes.end);
                            nodes.unshift(el);
                            objectSlot[el.slot] = nodes;
                        } else if (el.props) {
                            var name = el.props.slot;
                            if (name) {
                                delete el.props.slot;
                                if (Array.isArray(objectSlot[name])) {
                                    objectSlot[name].push(el);
                                } else {
                                    objectSlot[name] = [el];
                                }
                            }
                        }
                    });
                }
                //将原来元素的所有孩子，全部移动新的元素的第一个slot的位置上
                if (component.soleSlot) {
                    insertArraySlot(innerRender.vnodes, arraySlot);
                } else {
                    insertObjectSlot(innerRender.vnodes, objectSlot);
                }
            }

            if (comment) {
                var dom = avalon.vdom(vdom, 'toDOM');
                comment.parentNode.replaceChild(dom, comment);
                comVm.$element = innerRender.root.dom = dom;
                delete this.reInit;
            }

            //处理DOM节点

            dumpTree(vdom.dom);
            comVm.$element = vdom.dom;
            groupTree(vdom.dom, vdom.children);
            if (fromCache) {
                fireComponentHook(comVm, vdom, 'Enter');
            } else {
                fireComponentHook(comVm, vdom, 'Ready');
            }
        },
        diff: function diff(newVal, oldVal) {
            if (cssDiff.call(this, newVal, oldVal)) {
                return true;
            }
        },

        update: function update(vdom, value) {
            //this.oldValue = value //★★防止递归

            switch (this.readyState) {
                case 0:
                    if (this.reInit) {
                        this.init();
                        this.readyState++;
                    }
                    break;
                case 1:
                    this.readyState++;
                    break;
                default:
                    this.readyState++;
                    var comVm = this.comVm;
                    avalon.viewChanging = true;
                    avalon.transaction(function () {
                        for (var i in value) {
                            if (comVm.hasOwnProperty(i)) {
                                if (Array.isArray(value[i])) {
                                    comVm[i] = value[i].concat();
                                } else {
                                    comVm[i] = value[i];
                                }
                            }
                        }
                    });

                    //要保证要先触发孩子的ViewChange 然后再到它自己的ViewChange
                    fireComponentHook(comVm, vdom, 'ViewChange');
                    delete avalon.viewChanging;
                    break;
            }
            this.value = avalon.mix(true, {}, value);
        },
        beforeDispose: function beforeDispose() {
            var comVm = this.comVm;
            if (!this.cacheVm) {
                fireComponentHook(comVm, this.node, 'Dispose');
                comVm.$hashcode = false;
                delete avalon.vmodels[comVm.$id];
                this.innerRender && this.innerRender.dispose();
            } else {
                fireComponentHook(comVm, this.node, 'Leave');
            }
        }
    });

    function replaceRoot(instance, innerRender) {
        instance.innerRender = innerRender;
        var root$$1 = innerRender.root;
        var vdom = instance.node;
        var slot = vdom.props.slot;
        for (var i in root$$1) {
            vdom[i] = root$$1[i];
        }
        if (vdom.props && slot) {
            vdom.props.slot = slot;
        }
        innerRender.root = vdom;
        innerRender.vnodes[0] = vdom;
    }

    function fireComponentHook(vm, vdom, name) {
        var list = vm.$events['on' + name];
        if (list) {
            list.forEach(function (el) {
                setTimeout(function () {
                    el.callback.call(vm, {
                        type: name.toLowerCase(),
                        target: vdom.dom,
                        vmodel: vm
                    });
                }, 0);
            });
        }
    }

    function createComponentVm(component, value, is) {
        var hooks = [];
        var defaults = component.defaults;
        collectHooks(defaults, hooks);
        collectHooks(value, hooks);
        var obj = {};
        for (var i in defaults) {
            var val = value[i];
            if (val == null) {
                obj[i] = defaults[i];
            } else {
                obj[i] = val;
            }
        }
        obj.$id = value.id || value.$id || avalon.makeHashCode(is);
        delete obj.id;
        var def = avalon.mix(true, {}, obj);
        var vm = avalon.define(def);
        hooks.forEach(function (el) {
            vm.$watch(el.type, el.cb);
        });
        return vm;
    }

    function collectHooks(a, list) {
        for (var i in a) {
            if (componentEvents[i]) {
                if (typeof a[i] === 'function' && i.indexOf('on') === 0) {
                    list.unshift({
                        type: i,
                        cb: a[i]
                    });
                }
                //delete a[i] 这里不能删除,会导致再次切换时没有onReady
            }
        }
    }

    function resetParentChildren(nodes, arr) {
        var dir = arr && arr[0] && arr[0].forDir;
        if (dir) {
            dir.parentChildren = nodes;
        }
    }

    function insertArraySlot(nodes, arr) {
        for (var i = 0, el; el = nodes[i]; i++) {
            if (el.nodeName === 'slot') {
                resetParentChildren(nodes, arr);
                nodes.splice.apply(nodes, [i, 1].concat(arr));
                break;
            } else if (el.children) {
                insertArraySlot(el.children, arr);
            }
        }
    }

    function insertObjectSlot(nodes, obj) {
        for (var i = 0, el; el = nodes[i]; i++) {
            if (el.nodeName === 'slot') {
                var name = el.props.name;
                resetParentChildren(nodes, obj[name]);
                nodes.splice.apply(nodes, [i, 1].concat(obj[name]));
                continue;
            } else if (el.children) {
                insertObjectSlot(el.children, obj);
            }
        }
    }

    avalon.components = {};
    avalon.component = function (name, component) {

        component.extend = componentExtend;
        return addToQueue(name, component);
    };
    function addToQueue(name, component) {
        avalon.components[name] = component;
        for (var el, i = 0; el = componentQueue[i]; i++) {
            if (el.is === name) {
                componentQueue.splice(i, 1);
                el.reInit = true;
                delete el.value;
                el.update();
                i--;
            }
        }
        return component;
    }

    function componentExtend(child) {
        var name = child.displayName;
        delete child.displayName;
        var obj = { defaults: avalon.mix(true, {}, this.defaults, child.defaults) };
        if (child.soleSlot) {
            obj.soleSlot = child.soleSlot;
        }
        obj.template = child.template || this.template;
        return avalon.component(name, obj);
    }

    return avalon;
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*!
 * jQuery JavaScript Library v3.4.1
 * https://jquery.com/
 *
 * Includes Sizzle.js
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2019-05-01T21:04Z
 */
(function (global, factory) {

	"use strict";

	if (( false ? "undefined" : _typeof(module)) === "object" && _typeof(module.exports) === "object") {

		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ? factory(global, true) : function (w) {
			if (!w.document) {
				throw new Error("jQuery requires a window with a document");
			}
			return factory(w);
		};
	} else {
		factory(global);
	}

	// Pass this if window is not defined yet
})(typeof window !== "undefined" ? window : undefined, function (window, noGlobal) {

	// Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
	// throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses strict mode
	// arguments.callee.caller (trac-13335). But as of jQuery 3.0 (2016), strict mode should be common
	// enough that all such attempts are guarded in a try block.
	"use strict";

	var arr = [];

	var document = window.document;

	var getProto = Object.getPrototypeOf;

	var _slice = arr.slice;

	var concat = arr.concat;

	var push = arr.push;

	var indexOf = arr.indexOf;

	var class2type = {};

	var toString = class2type.toString;

	var hasOwn = class2type.hasOwnProperty;

	var fnToString = hasOwn.toString;

	var ObjectFunctionString = fnToString.call(Object);

	var support = {};

	var isFunction = function isFunction(obj) {

		// Support: Chrome <=57, Firefox <=52
		// In some browsers, typeof returns "function" for HTML <object> elements
		// (i.e., `typeof document.createElement( "object" ) === "function"`).
		// We don't want to classify *any* DOM node as a function.
		return typeof obj === "function" && typeof obj.nodeType !== "number";
	};

	var isWindow = function isWindow(obj) {
		return obj != null && obj === obj.window;
	};

	var preservedScriptAttributes = {
		type: true,
		src: true,
		nonce: true,
		noModule: true
	};

	function DOMEval(code, node, doc) {
		doc = doc || document;

		var i,
		    val,
		    script = doc.createElement("script");

		script.text = code;
		if (node) {
			for (i in preservedScriptAttributes) {

				// Support: Firefox 64+, Edge 18+
				// Some browsers don't support the "nonce" property on scripts.
				// On the other hand, just using `getAttribute` is not enough as
				// the `nonce` attribute is reset to an empty string whenever it
				// becomes browsing-context connected.
				// See https://github.com/whatwg/html/issues/2369
				// See https://html.spec.whatwg.org/#nonce-attributes
				// The `node.getAttribute` check was added for the sake of
				// `jQuery.globalEval` so that it can fake a nonce-containing node
				// via an object.
				val = node[i] || node.getAttribute && node.getAttribute(i);
				if (val) {
					script.setAttribute(i, val);
				}
			}
		}
		doc.head.appendChild(script).parentNode.removeChild(script);
	}

	function toType(obj) {
		if (obj == null) {
			return obj + "";
		}

		// Support: Android <=2.3 only (functionish RegExp)
		return (typeof obj === "undefined" ? "undefined" : _typeof(obj)) === "object" || typeof obj === "function" ? class2type[toString.call(obj)] || "object" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
	}
	/* global Symbol */
	// Defining this global in .eslintrc.json would create a danger of using the global
	// unguarded in another place, it seems safer to define global only for this module


	var version = "3.4.1",


	// Define a local copy of jQuery
	jQuery = function jQuery(selector, context) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init(selector, context);
	},


	// Support: Android <=4.0 only
	// Make sure we trim BOM and NBSP
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

	jQuery.fn = jQuery.prototype = {

		// The current version of jQuery being used
		jquery: version,

		constructor: jQuery,

		// The default length of a jQuery object is 0
		length: 0,

		toArray: function toArray() {
			return _slice.call(this);
		},

		// Get the Nth element in the matched element set OR
		// Get the whole matched element set as a clean array
		get: function get(num) {

			// Return all the elements in a clean array
			if (num == null) {
				return _slice.call(this);
			}

			// Return just the one element from the set
			return num < 0 ? this[num + this.length] : this[num];
		},

		// Take an array of elements and push it onto the stack
		// (returning the new matched element set)
		pushStack: function pushStack(elems) {

			// Build a new jQuery matched element set
			var ret = jQuery.merge(this.constructor(), elems);

			// Add the old object onto the stack (as a reference)
			ret.prevObject = this;

			// Return the newly-formed element set
			return ret;
		},

		// Execute a callback for every element in the matched set.
		each: function each(callback) {
			return jQuery.each(this, callback);
		},

		map: function map(callback) {
			return this.pushStack(jQuery.map(this, function (elem, i) {
				return callback.call(elem, i, elem);
			}));
		},

		slice: function slice() {
			return this.pushStack(_slice.apply(this, arguments));
		},

		first: function first() {
			return this.eq(0);
		},

		last: function last() {
			return this.eq(-1);
		},

		eq: function eq(i) {
			var len = this.length,
			    j = +i + (i < 0 ? len : 0);
			return this.pushStack(j >= 0 && j < len ? [this[j]] : []);
		},

		end: function end() {
			return this.prevObject || this.constructor();
		},

		// For internal use only.
		// Behaves like an Array's method, not like a jQuery method.
		push: push,
		sort: arr.sort,
		splice: arr.splice
	};

	jQuery.extend = jQuery.fn.extend = function () {
		var options,
		    name,
		    src,
		    copy,
		    copyIsArray,
		    clone,
		    target = arguments[0] || {},
		    i = 1,
		    length = arguments.length,
		    deep = false;

		// Handle a deep copy situation
		if (typeof target === "boolean") {
			deep = target;

			// Skip the boolean and the target
			target = arguments[i] || {};
			i++;
		}

		// Handle case when target is a string or something (possible in deep copy)
		if ((typeof target === "undefined" ? "undefined" : _typeof(target)) !== "object" && !isFunction(target)) {
			target = {};
		}

		// Extend jQuery itself if only one argument is passed
		if (i === length) {
			target = this;
			i--;
		}

		for (; i < length; i++) {

			// Only deal with non-null/undefined values
			if ((options = arguments[i]) != null) {

				// Extend the base object
				for (name in options) {
					copy = options[name];

					// Prevent Object.prototype pollution
					// Prevent never-ending loop
					if (name === "__proto__" || target === copy) {
						continue;
					}

					// Recurse if we're merging plain objects or arrays
					if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
						src = target[name];

						// Ensure proper type for the source value
						if (copyIsArray && !Array.isArray(src)) {
							clone = [];
						} else if (!copyIsArray && !jQuery.isPlainObject(src)) {
							clone = {};
						} else {
							clone = src;
						}
						copyIsArray = false;

						// Never move original objects, clone them
						target[name] = jQuery.extend(deep, clone, copy);

						// Don't bring in undefined values
					} else if (copy !== undefined) {
						target[name] = copy;
					}
				}
			}
		}

		// Return the modified object
		return target;
	};

	jQuery.extend({

		// Unique for each copy of jQuery on the page
		expando: "jQuery" + (version + Math.random()).replace(/\D/g, ""),

		// Assume jQuery is ready without the ready module
		isReady: true,

		error: function error(msg) {
			throw new Error(msg);
		},

		noop: function noop() {},

		isPlainObject: function isPlainObject(obj) {
			var proto, Ctor;

			// Detect obvious negatives
			// Use toString instead of jQuery.type to catch host objects
			if (!obj || toString.call(obj) !== "[object Object]") {
				return false;
			}

			proto = getProto(obj);

			// Objects with no prototype (e.g., `Object.create( null )`) are plain
			if (!proto) {
				return true;
			}

			// Objects with prototype are plain iff they were constructed by a global Object function
			Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
			return typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString;
		},

		isEmptyObject: function isEmptyObject(obj) {
			var name;

			for (name in obj) {
				return false;
			}
			return true;
		},

		// Evaluates a script in a global context
		globalEval: function globalEval(code, options) {
			DOMEval(code, { nonce: options && options.nonce });
		},

		each: function each(obj, callback) {
			var length,
			    i = 0;

			if (isArrayLike(obj)) {
				length = obj.length;
				for (; i < length; i++) {
					if (callback.call(obj[i], i, obj[i]) === false) {
						break;
					}
				}
			} else {
				for (i in obj) {
					if (callback.call(obj[i], i, obj[i]) === false) {
						break;
					}
				}
			}

			return obj;
		},

		// Support: Android <=4.0 only
		trim: function trim(text) {
			return text == null ? "" : (text + "").replace(rtrim, "");
		},

		// results is for internal usage only
		makeArray: function makeArray(arr, results) {
			var ret = results || [];

			if (arr != null) {
				if (isArrayLike(Object(arr))) {
					jQuery.merge(ret, typeof arr === "string" ? [arr] : arr);
				} else {
					push.call(ret, arr);
				}
			}

			return ret;
		},

		inArray: function inArray(elem, arr, i) {
			return arr == null ? -1 : indexOf.call(arr, elem, i);
		},

		// Support: Android <=4.0 only, PhantomJS 1 only
		// push.apply(_, arraylike) throws on ancient WebKit
		merge: function merge(first, second) {
			var len = +second.length,
			    j = 0,
			    i = first.length;

			for (; j < len; j++) {
				first[i++] = second[j];
			}

			first.length = i;

			return first;
		},

		grep: function grep(elems, callback, invert) {
			var callbackInverse,
			    matches = [],
			    i = 0,
			    length = elems.length,
			    callbackExpect = !invert;

			// Go through the array, only saving the items
			// that pass the validator function
			for (; i < length; i++) {
				callbackInverse = !callback(elems[i], i);
				if (callbackInverse !== callbackExpect) {
					matches.push(elems[i]);
				}
			}

			return matches;
		},

		// arg is for internal usage only
		map: function map(elems, callback, arg) {
			var length,
			    value,
			    i = 0,
			    ret = [];

			// Go through the array, translating each of the items to their new values
			if (isArrayLike(elems)) {
				length = elems.length;
				for (; i < length; i++) {
					value = callback(elems[i], i, arg);

					if (value != null) {
						ret.push(value);
					}
				}

				// Go through every key on the object,
			} else {
				for (i in elems) {
					value = callback(elems[i], i, arg);

					if (value != null) {
						ret.push(value);
					}
				}
			}

			// Flatten any nested arrays
			return concat.apply([], ret);
		},

		// A global GUID counter for objects
		guid: 1,

		// jQuery.support is not used in Core but other projects attach their
		// properties to it so it needs to exist.
		support: support
	});

	if (typeof Symbol === "function") {
		jQuery.fn[Symbol.iterator] = arr[Symbol.iterator];
	}

	// Populate the class2type map
	jQuery.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function (i, name) {
		class2type["[object " + name + "]"] = name.toLowerCase();
	});

	function isArrayLike(obj) {

		// Support: real iOS 8.2 only (not reproducible in simulator)
		// `in` check used to prevent JIT error (gh-2145)
		// hasOwn isn't used here due to false negatives
		// regarding Nodelist length in IE
		var length = !!obj && "length" in obj && obj.length,
		    type = toType(obj);

		if (isFunction(obj) || isWindow(obj)) {
			return false;
		}

		return type === "array" || length === 0 || typeof length === "number" && length > 0 && length - 1 in obj;
	}
	var Sizzle =
	/*!
  * Sizzle CSS Selector Engine v2.3.4
  * https://sizzlejs.com/
  *
  * Copyright JS Foundation and other contributors
  * Released under the MIT license
  * https://js.foundation/
  *
  * Date: 2019-04-08
  */
	function (window) {

		var i,
		    support,
		    Expr,
		    getText,
		    isXML,
		    tokenize,
		    compile,
		    select,
		    outermostContext,
		    sortInput,
		    hasDuplicate,


		// Local document vars
		setDocument,
		    document,
		    docElem,
		    documentIsHTML,
		    rbuggyQSA,
		    rbuggyMatches,
		    matches,
		    contains,


		// Instance-specific data
		expando = "sizzle" + 1 * new Date(),
		    preferredDoc = window.document,
		    dirruns = 0,
		    done = 0,
		    classCache = createCache(),
		    tokenCache = createCache(),
		    compilerCache = createCache(),
		    nonnativeSelectorCache = createCache(),
		    sortOrder = function sortOrder(a, b) {
			if (a === b) {
				hasDuplicate = true;
			}
			return 0;
		},


		// Instance methods
		hasOwn = {}.hasOwnProperty,
		    arr = [],
		    pop = arr.pop,
		    push_native = arr.push,
		    push = arr.push,
		    slice = arr.slice,

		// Use a stripped-down indexOf as it's faster than native
		// https://jsperf.com/thor-indexof-vs-for/5
		indexOf = function indexOf(list, elem) {
			var i = 0,
			    len = list.length;
			for (; i < len; i++) {
				if (list[i] === elem) {
					return i;
				}
			}
			return -1;
		},
		    booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",


		// Regular expressions

		// http://www.w3.org/TR/css3-selectors/#whitespace
		whitespace = "[\\x20\\t\\r\\n\\f]",


		// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
		identifier = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",


		// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
		attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +
		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace + "*\\]",
		    pseudos = ":(" + identifier + ")(?:\\((" +
		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
		// 3. anything else (capture 2)
		".*" + ")\\)|)",


		// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
		rwhitespace = new RegExp(whitespace + "+", "g"),
		    rtrim = new RegExp("^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g"),
		    rcomma = new RegExp("^" + whitespace + "*," + whitespace + "*"),
		    rcombinators = new RegExp("^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*"),
		    rdescend = new RegExp(whitespace + "|>"),
		    rpseudo = new RegExp(pseudos),
		    ridentifier = new RegExp("^" + identifier + "$"),
		    matchExpr = {
			"ID": new RegExp("^#(" + identifier + ")"),
			"CLASS": new RegExp("^\\.(" + identifier + ")"),
			"TAG": new RegExp("^(" + identifier + "|[*])"),
			"ATTR": new RegExp("^" + attributes),
			"PSEUDO": new RegExp("^" + pseudos),
			"CHILD": new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace + "*(\\d+)|))" + whitespace + "*\\)|)", "i"),
			"bool": new RegExp("^(?:" + booleans + ")$", "i"),
			// For use in libraries implementing .is()
			// We use this for POS matching in `select`
			"needsContext": new RegExp("^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i")
		},
		    rhtml = /HTML$/i,
		    rinputs = /^(?:input|select|textarea|button)$/i,
		    rheader = /^h\d$/i,
		    rnative = /^[^{]+\{\s*\[native \w/,


		// Easily-parseable/retrievable ID or TAG or CLASS selectors
		rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
		    rsibling = /[+~]/,


		// CSS escapes
		// http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
		runescape = new RegExp("\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig"),
		    funescape = function funescape(_, escaped, escapedWhitespace) {
			var high = "0x" + escaped - 0x10000;
			// NaN means non-codepoint
			// Support: Firefox<24
			// Workaround erroneous numeric interpretation of +"0x"
			return high !== high || escapedWhitespace ? escaped : high < 0 ?
			// BMP codepoint
			String.fromCharCode(high + 0x10000) :
			// Supplemental Plane codepoint (surrogate pair)
			String.fromCharCode(high >> 10 | 0xD800, high & 0x3FF | 0xDC00);
		},


		// CSS string/identifier serialization
		// https://drafts.csswg.org/cssom/#common-serializing-idioms
		rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
		    fcssescape = function fcssescape(ch, asCodePoint) {
			if (asCodePoint) {

				// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
				if (ch === "\0") {
					return "\uFFFD";
				}

				// Control characters and (dependent upon position) numbers get escaped as code points
				return ch.slice(0, -1) + "\\" + ch.charCodeAt(ch.length - 1).toString(16) + " ";
			}

			// Other potentially-special ASCII characters get backslash-escaped
			return "\\" + ch;
		},


		// Used for iframes
		// See setDocument()
		// Removing the function wrapper causes a "Permission Denied"
		// error in IE
		unloadHandler = function unloadHandler() {
			setDocument();
		},
		    inDisabledFieldset = addCombinator(function (elem) {
			return elem.disabled === true && elem.nodeName.toLowerCase() === "fieldset";
		}, { dir: "parentNode", next: "legend" });

		// Optimize for push.apply( _, NodeList )
		try {
			push.apply(arr = slice.call(preferredDoc.childNodes), preferredDoc.childNodes);
			// Support: Android<4.0
			// Detect silently failing push.apply
			arr[preferredDoc.childNodes.length].nodeType;
		} catch (e) {
			push = { apply: arr.length ?

				// Leverage slice if possible
				function (target, els) {
					push_native.apply(target, slice.call(els));
				} :

				// Support: IE<9
				// Otherwise append directly
				function (target, els) {
					var j = target.length,
					    i = 0;
					// Can't trust NodeList.length
					while (target[j++] = els[i++]) {}
					target.length = j - 1;
				}
			};
		}

		function Sizzle(selector, context, results, seed) {
			var m,
			    i,
			    elem,
			    nid,
			    match,
			    groups,
			    newSelector,
			    newContext = context && context.ownerDocument,


			// nodeType defaults to 9, since context defaults to document
			nodeType = context ? context.nodeType : 9;

			results = results || [];

			// Return early from calls with invalid selector or context
			if (typeof selector !== "string" || !selector || nodeType !== 1 && nodeType !== 9 && nodeType !== 11) {

				return results;
			}

			// Try to shortcut find operations (as opposed to filters) in HTML documents
			if (!seed) {

				if ((context ? context.ownerDocument || context : preferredDoc) !== document) {
					setDocument(context);
				}
				context = context || document;

				if (documentIsHTML) {

					// If the selector is sufficiently simple, try using a "get*By*" DOM method
					// (excepting DocumentFragment context, where the methods don't exist)
					if (nodeType !== 11 && (match = rquickExpr.exec(selector))) {

						// ID selector
						if (m = match[1]) {

							// Document context
							if (nodeType === 9) {
								if (elem = context.getElementById(m)) {

									// Support: IE, Opera, Webkit
									// TODO: identify versions
									// getElementById can match elements by name instead of ID
									if (elem.id === m) {
										results.push(elem);
										return results;
									}
								} else {
									return results;
								}

								// Element context
							} else {

								// Support: IE, Opera, Webkit
								// TODO: identify versions
								// getElementById can match elements by name instead of ID
								if (newContext && (elem = newContext.getElementById(m)) && contains(context, elem) && elem.id === m) {

									results.push(elem);
									return results;
								}
							}

							// Type selector
						} else if (match[2]) {
							push.apply(results, context.getElementsByTagName(selector));
							return results;

							// Class selector
						} else if ((m = match[3]) && support.getElementsByClassName && context.getElementsByClassName) {

							push.apply(results, context.getElementsByClassName(m));
							return results;
						}
					}

					// Take advantage of querySelectorAll
					if (support.qsa && !nonnativeSelectorCache[selector + " "] && (!rbuggyQSA || !rbuggyQSA.test(selector)) && (

					// Support: IE 8 only
					// Exclude object elements
					nodeType !== 1 || context.nodeName.toLowerCase() !== "object")) {

						newSelector = selector;
						newContext = context;

						// qSA considers elements outside a scoping root when evaluating child or
						// descendant combinators, which is not what we want.
						// In such cases, we work around the behavior by prefixing every selector in the
						// list with an ID selector referencing the scope context.
						// Thanks to Andrew Dupont for this technique.
						if (nodeType === 1 && rdescend.test(selector)) {

							// Capture the context ID, setting it first if necessary
							if (nid = context.getAttribute("id")) {
								nid = nid.replace(rcssescape, fcssescape);
							} else {
								context.setAttribute("id", nid = expando);
							}

							// Prefix every selector in the list
							groups = tokenize(selector);
							i = groups.length;
							while (i--) {
								groups[i] = "#" + nid + " " + toSelector(groups[i]);
							}
							newSelector = groups.join(",");

							// Expand context for sibling selectors
							newContext = rsibling.test(selector) && testContext(context.parentNode) || context;
						}

						try {
							push.apply(results, newContext.querySelectorAll(newSelector));
							return results;
						} catch (qsaError) {
							nonnativeSelectorCache(selector, true);
						} finally {
							if (nid === expando) {
								context.removeAttribute("id");
							}
						}
					}
				}
			}

			// All others
			return select(selector.replace(rtrim, "$1"), context, results, seed);
		}

		/**
   * Create key-value caches of limited size
   * @returns {function(string, object)} Returns the Object data after storing it on itself with
   *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
   *	deleting the oldest entry
   */
		function createCache() {
			var keys = [];

			function cache(key, value) {
				// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
				if (keys.push(key + " ") > Expr.cacheLength) {
					// Only keep the most recent entries
					delete cache[keys.shift()];
				}
				return cache[key + " "] = value;
			}
			return cache;
		}

		/**
   * Mark a function for special use by Sizzle
   * @param {Function} fn The function to mark
   */
		function markFunction(fn) {
			fn[expando] = true;
			return fn;
		}

		/**
   * Support testing using an element
   * @param {Function} fn Passed the created element and returns a boolean result
   */
		function assert(fn) {
			var el = document.createElement("fieldset");

			try {
				return !!fn(el);
			} catch (e) {
				return false;
			} finally {
				// Remove from its parent by default
				if (el.parentNode) {
					el.parentNode.removeChild(el);
				}
				// release memory in IE
				el = null;
			}
		}

		/**
   * Adds the same handler for all of the specified attrs
   * @param {String} attrs Pipe-separated list of attributes
   * @param {Function} handler The method that will be applied
   */
		function addHandle(attrs, handler) {
			var arr = attrs.split("|"),
			    i = arr.length;

			while (i--) {
				Expr.attrHandle[arr[i]] = handler;
			}
		}

		/**
   * Checks document order of two siblings
   * @param {Element} a
   * @param {Element} b
   * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
   */
		function siblingCheck(a, b) {
			var cur = b && a,
			    diff = cur && a.nodeType === 1 && b.nodeType === 1 && a.sourceIndex - b.sourceIndex;

			// Use IE sourceIndex if available on both nodes
			if (diff) {
				return diff;
			}

			// Check if b follows a
			if (cur) {
				while (cur = cur.nextSibling) {
					if (cur === b) {
						return -1;
					}
				}
			}

			return a ? 1 : -1;
		}

		/**
   * Returns a function to use in pseudos for input types
   * @param {String} type
   */
		function createInputPseudo(type) {
			return function (elem) {
				var name = elem.nodeName.toLowerCase();
				return name === "input" && elem.type === type;
			};
		}

		/**
   * Returns a function to use in pseudos for buttons
   * @param {String} type
   */
		function createButtonPseudo(type) {
			return function (elem) {
				var name = elem.nodeName.toLowerCase();
				return (name === "input" || name === "button") && elem.type === type;
			};
		}

		/**
   * Returns a function to use in pseudos for :enabled/:disabled
   * @param {Boolean} disabled true for :disabled; false for :enabled
   */
		function createDisabledPseudo(disabled) {

			// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
			return function (elem) {

				// Only certain elements can match :enabled or :disabled
				// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
				// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
				if ("form" in elem) {

					// Check for inherited disabledness on relevant non-disabled elements:
					// * listed form-associated elements in a disabled fieldset
					//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
					//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
					// * option elements in a disabled optgroup
					//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
					// All such elements have a "form" property.
					if (elem.parentNode && elem.disabled === false) {

						// Option elements defer to a parent optgroup if present
						if ("label" in elem) {
							if ("label" in elem.parentNode) {
								return elem.parentNode.disabled === disabled;
							} else {
								return elem.disabled === disabled;
							}
						}

						// Support: IE 6 - 11
						// Use the isDisabled shortcut property to check for disabled fieldset ancestors
						return elem.isDisabled === disabled ||

						// Where there is no isDisabled, check manually
						/* jshint -W018 */
						elem.isDisabled !== !disabled && inDisabledFieldset(elem) === disabled;
					}

					return elem.disabled === disabled;

					// Try to winnow out elements that can't be disabled before trusting the disabled property.
					// Some victims get caught in our net (label, legend, menu, track), but it shouldn't
					// even exist on them, let alone have a boolean value.
				} else if ("label" in elem) {
					return elem.disabled === disabled;
				}

				// Remaining elements are neither :enabled nor :disabled
				return false;
			};
		}

		/**
   * Returns a function to use in pseudos for positionals
   * @param {Function} fn
   */
		function createPositionalPseudo(fn) {
			return markFunction(function (argument) {
				argument = +argument;
				return markFunction(function (seed, matches) {
					var j,
					    matchIndexes = fn([], seed.length, argument),
					    i = matchIndexes.length;

					// Match elements found at the specified indexes
					while (i--) {
						if (seed[j = matchIndexes[i]]) {
							seed[j] = !(matches[j] = seed[j]);
						}
					}
				});
			});
		}

		/**
   * Checks a node for validity as a Sizzle context
   * @param {Element|Object=} context
   * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
   */
		function testContext(context) {
			return context && typeof context.getElementsByTagName !== "undefined" && context;
		}

		// Expose support vars for convenience
		support = Sizzle.support = {};

		/**
   * Detects XML nodes
   * @param {Element|Object} elem An element or a document
   * @returns {Boolean} True iff elem is a non-HTML XML node
   */
		isXML = Sizzle.isXML = function (elem) {
			var namespace = elem.namespaceURI,
			    docElem = (elem.ownerDocument || elem).documentElement;

			// Support: IE <=8
			// Assume HTML when documentElement doesn't yet exist, such as inside loading iframes
			// https://bugs.jquery.com/ticket/4833
			return !rhtml.test(namespace || docElem && docElem.nodeName || "HTML");
		};

		/**
   * Sets document-related variables once based on the current document
   * @param {Element|Object} [doc] An element or document object to use to set the document
   * @returns {Object} Returns the current document
   */
		setDocument = Sizzle.setDocument = function (node) {
			var hasCompare,
			    subWindow,
			    doc = node ? node.ownerDocument || node : preferredDoc;

			// Return early if doc is invalid or already selected
			if (doc === document || doc.nodeType !== 9 || !doc.documentElement) {
				return document;
			}

			// Update global variables
			document = doc;
			docElem = document.documentElement;
			documentIsHTML = !isXML(document);

			// Support: IE 9-11, Edge
			// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
			if (preferredDoc !== document && (subWindow = document.defaultView) && subWindow.top !== subWindow) {

				// Support: IE 11, Edge
				if (subWindow.addEventListener) {
					subWindow.addEventListener("unload", unloadHandler, false);

					// Support: IE 9 - 10 only
				} else if (subWindow.attachEvent) {
					subWindow.attachEvent("onunload", unloadHandler);
				}
			}

			/* Attributes
   ---------------------------------------------------------------------- */

			// Support: IE<8
			// Verify that getAttribute really returns attributes and not properties
			// (excepting IE8 booleans)
			support.attributes = assert(function (el) {
				el.className = "i";
				return !el.getAttribute("className");
			});

			/* getElement(s)By*
   ---------------------------------------------------------------------- */

			// Check if getElementsByTagName("*") returns only elements
			support.getElementsByTagName = assert(function (el) {
				el.appendChild(document.createComment(""));
				return !el.getElementsByTagName("*").length;
			});

			// Support: IE<9
			support.getElementsByClassName = rnative.test(document.getElementsByClassName);

			// Support: IE<10
			// Check if getElementById returns elements by name
			// The broken getElementById methods don't pick up programmatically-set names,
			// so use a roundabout getElementsByName test
			support.getById = assert(function (el) {
				docElem.appendChild(el).id = expando;
				return !document.getElementsByName || !document.getElementsByName(expando).length;
			});

			// ID filter and find
			if (support.getById) {
				Expr.filter["ID"] = function (id) {
					var attrId = id.replace(runescape, funescape);
					return function (elem) {
						return elem.getAttribute("id") === attrId;
					};
				};
				Expr.find["ID"] = function (id, context) {
					if (typeof context.getElementById !== "undefined" && documentIsHTML) {
						var elem = context.getElementById(id);
						return elem ? [elem] : [];
					}
				};
			} else {
				Expr.filter["ID"] = function (id) {
					var attrId = id.replace(runescape, funescape);
					return function (elem) {
						var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");
						return node && node.value === attrId;
					};
				};

				// Support: IE 6 - 7 only
				// getElementById is not reliable as a find shortcut
				Expr.find["ID"] = function (id, context) {
					if (typeof context.getElementById !== "undefined" && documentIsHTML) {
						var node,
						    i,
						    elems,
						    elem = context.getElementById(id);

						if (elem) {

							// Verify the id attribute
							node = elem.getAttributeNode("id");
							if (node && node.value === id) {
								return [elem];
							}

							// Fall back on getElementsByName
							elems = context.getElementsByName(id);
							i = 0;
							while (elem = elems[i++]) {
								node = elem.getAttributeNode("id");
								if (node && node.value === id) {
									return [elem];
								}
							}
						}

						return [];
					}
				};
			}

			// Tag
			Expr.find["TAG"] = support.getElementsByTagName ? function (tag, context) {
				if (typeof context.getElementsByTagName !== "undefined") {
					return context.getElementsByTagName(tag);

					// DocumentFragment nodes don't have gEBTN
				} else if (support.qsa) {
					return context.querySelectorAll(tag);
				}
			} : function (tag, context) {
				var elem,
				    tmp = [],
				    i = 0,

				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName(tag);

				// Filter out possible comments
				if (tag === "*") {
					while (elem = results[i++]) {
						if (elem.nodeType === 1) {
							tmp.push(elem);
						}
					}

					return tmp;
				}
				return results;
			};

			// Class
			Expr.find["CLASS"] = support.getElementsByClassName && function (className, context) {
				if (typeof context.getElementsByClassName !== "undefined" && documentIsHTML) {
					return context.getElementsByClassName(className);
				}
			};

			/* QSA/matchesSelector
   ---------------------------------------------------------------------- */

			// QSA and matchesSelector support

			// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
			rbuggyMatches = [];

			// qSa(:focus) reports false when true (Chrome 21)
			// We allow this because of a bug in IE8/9 that throws an error
			// whenever `document.activeElement` is accessed on an iframe
			// So, we allow :focus to pass through QSA all the time to avoid the IE error
			// See https://bugs.jquery.com/ticket/13378
			rbuggyQSA = [];

			if (support.qsa = rnative.test(document.querySelectorAll)) {
				// Build QSA regex
				// Regex strategy adopted from Diego Perini
				assert(function (el) {
					// Select is set to empty string on purpose
					// This is to test IE's treatment of not explicitly
					// setting a boolean content attribute,
					// since its presence should be enough
					// https://bugs.jquery.com/ticket/12359
					docElem.appendChild(el).innerHTML = "<a id='" + expando + "'></a>" + "<select id='" + expando + "-\r\\' msallowcapture=''>" + "<option selected=''></option></select>";

					// Support: IE8, Opera 11-12.16
					// Nothing should be selected when empty strings follow ^= or $= or *=
					// The test attribute must be unknown in Opera but "safe" for WinRT
					// https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
					if (el.querySelectorAll("[msallowcapture^='']").length) {
						rbuggyQSA.push("[*^$]=" + whitespace + "*(?:''|\"\")");
					}

					// Support: IE8
					// Boolean attributes and "value" are not treated correctly
					if (!el.querySelectorAll("[selected]").length) {
						rbuggyQSA.push("\\[" + whitespace + "*(?:value|" + booleans + ")");
					}

					// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
					if (!el.querySelectorAll("[id~=" + expando + "-]").length) {
						rbuggyQSA.push("~=");
					}

					// Webkit/Opera - :checked should return selected option elements
					// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
					// IE8 throws error here and will not see later tests
					if (!el.querySelectorAll(":checked").length) {
						rbuggyQSA.push(":checked");
					}

					// Support: Safari 8+, iOS 8+
					// https://bugs.webkit.org/show_bug.cgi?id=136851
					// In-page `selector#id sibling-combinator selector` fails
					if (!el.querySelectorAll("a#" + expando + "+*").length) {
						rbuggyQSA.push(".#.+[+~]");
					}
				});

				assert(function (el) {
					el.innerHTML = "<a href='' disabled='disabled'></a>" + "<select disabled='disabled'><option/></select>";

					// Support: Windows 8 Native Apps
					// The type and name attributes are restricted during .innerHTML assignment
					var input = document.createElement("input");
					input.setAttribute("type", "hidden");
					el.appendChild(input).setAttribute("name", "D");

					// Support: IE8
					// Enforce case-sensitivity of name attribute
					if (el.querySelectorAll("[name=d]").length) {
						rbuggyQSA.push("name" + whitespace + "*[*^$|!~]?=");
					}

					// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
					// IE8 throws error here and will not see later tests
					if (el.querySelectorAll(":enabled").length !== 2) {
						rbuggyQSA.push(":enabled", ":disabled");
					}

					// Support: IE9-11+
					// IE's :disabled selector does not pick up the children of disabled fieldsets
					docElem.appendChild(el).disabled = true;
					if (el.querySelectorAll(":disabled").length !== 2) {
						rbuggyQSA.push(":enabled", ":disabled");
					}

					// Opera 10-11 does not throw on post-comma invalid pseudos
					el.querySelectorAll("*,:x");
					rbuggyQSA.push(",.*:");
				});
			}

			if (support.matchesSelector = rnative.test(matches = docElem.matches || docElem.webkitMatchesSelector || docElem.mozMatchesSelector || docElem.oMatchesSelector || docElem.msMatchesSelector)) {

				assert(function (el) {
					// Check to see if it's possible to do matchesSelector
					// on a disconnected node (IE 9)
					support.disconnectedMatch = matches.call(el, "*");

					// This should fail with an exception
					// Gecko does not error, returns false instead
					matches.call(el, "[s!='']:x");
					rbuggyMatches.push("!=", pseudos);
				});
			}

			rbuggyQSA = rbuggyQSA.length && new RegExp(rbuggyQSA.join("|"));
			rbuggyMatches = rbuggyMatches.length && new RegExp(rbuggyMatches.join("|"));

			/* Contains
   ---------------------------------------------------------------------- */
			hasCompare = rnative.test(docElem.compareDocumentPosition);

			// Element contains another
			// Purposefully self-exclusive
			// As in, an element does not contain itself
			contains = hasCompare || rnative.test(docElem.contains) ? function (a, b) {
				var adown = a.nodeType === 9 ? a.documentElement : a,
				    bup = b && b.parentNode;
				return a === bup || !!(bup && bup.nodeType === 1 && (adown.contains ? adown.contains(bup) : a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16));
			} : function (a, b) {
				if (b) {
					while (b = b.parentNode) {
						if (b === a) {
							return true;
						}
					}
				}
				return false;
			};

			/* Sorting
   ---------------------------------------------------------------------- */

			// Document order sorting
			sortOrder = hasCompare ? function (a, b) {

				// Flag for duplicate removal
				if (a === b) {
					hasDuplicate = true;
					return 0;
				}

				// Sort on method existence if only one input has compareDocumentPosition
				var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
				if (compare) {
					return compare;
				}

				// Calculate position if both inputs belong to the same document
				compare = (a.ownerDocument || a) === (b.ownerDocument || b) ? a.compareDocumentPosition(b) :

				// Otherwise we know they are disconnected
				1;

				// Disconnected nodes
				if (compare & 1 || !support.sortDetached && b.compareDocumentPosition(a) === compare) {

					// Choose the first element that is related to our preferred document
					if (a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a)) {
						return -1;
					}
					if (b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b)) {
						return 1;
					}

					// Maintain original order
					return sortInput ? indexOf(sortInput, a) - indexOf(sortInput, b) : 0;
				}

				return compare & 4 ? -1 : 1;
			} : function (a, b) {
				// Exit early if the nodes are identical
				if (a === b) {
					hasDuplicate = true;
					return 0;
				}

				var cur,
				    i = 0,
				    aup = a.parentNode,
				    bup = b.parentNode,
				    ap = [a],
				    bp = [b];

				// Parentless nodes are either documents or disconnected
				if (!aup || !bup) {
					return a === document ? -1 : b === document ? 1 : aup ? -1 : bup ? 1 : sortInput ? indexOf(sortInput, a) - indexOf(sortInput, b) : 0;

					// If the nodes are siblings, we can do a quick check
				} else if (aup === bup) {
					return siblingCheck(a, b);
				}

				// Otherwise we need full lists of their ancestors for comparison
				cur = a;
				while (cur = cur.parentNode) {
					ap.unshift(cur);
				}
				cur = b;
				while (cur = cur.parentNode) {
					bp.unshift(cur);
				}

				// Walk down the tree looking for a discrepancy
				while (ap[i] === bp[i]) {
					i++;
				}

				return i ?
				// Do a sibling check if the nodes have a common ancestor
				siblingCheck(ap[i], bp[i]) :

				// Otherwise nodes in our document sort first
				ap[i] === preferredDoc ? -1 : bp[i] === preferredDoc ? 1 : 0;
			};

			return document;
		};

		Sizzle.matches = function (expr, elements) {
			return Sizzle(expr, null, null, elements);
		};

		Sizzle.matchesSelector = function (elem, expr) {
			// Set document vars if needed
			if ((elem.ownerDocument || elem) !== document) {
				setDocument(elem);
			}

			if (support.matchesSelector && documentIsHTML && !nonnativeSelectorCache[expr + " "] && (!rbuggyMatches || !rbuggyMatches.test(expr)) && (!rbuggyQSA || !rbuggyQSA.test(expr))) {

				try {
					var ret = matches.call(elem, expr);

					// IE 9's matchesSelector returns false on disconnected nodes
					if (ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11) {
						return ret;
					}
				} catch (e) {
					nonnativeSelectorCache(expr, true);
				}
			}

			return Sizzle(expr, document, null, [elem]).length > 0;
		};

		Sizzle.contains = function (context, elem) {
			// Set document vars if needed
			if ((context.ownerDocument || context) !== document) {
				setDocument(context);
			}
			return contains(context, elem);
		};

		Sizzle.attr = function (elem, name) {
			// Set document vars if needed
			if ((elem.ownerDocument || elem) !== document) {
				setDocument(elem);
			}

			var fn = Expr.attrHandle[name.toLowerCase()],

			// Don't get fooled by Object.prototype properties (jQuery #13807)
			val = fn && hasOwn.call(Expr.attrHandle, name.toLowerCase()) ? fn(elem, name, !documentIsHTML) : undefined;

			return val !== undefined ? val : support.attributes || !documentIsHTML ? elem.getAttribute(name) : (val = elem.getAttributeNode(name)) && val.specified ? val.value : null;
		};

		Sizzle.escape = function (sel) {
			return (sel + "").replace(rcssescape, fcssescape);
		};

		Sizzle.error = function (msg) {
			throw new Error("Syntax error, unrecognized expression: " + msg);
		};

		/**
   * Document sorting and removing duplicates
   * @param {ArrayLike} results
   */
		Sizzle.uniqueSort = function (results) {
			var elem,
			    duplicates = [],
			    j = 0,
			    i = 0;

			// Unless we *know* we can detect duplicates, assume their presence
			hasDuplicate = !support.detectDuplicates;
			sortInput = !support.sortStable && results.slice(0);
			results.sort(sortOrder);

			if (hasDuplicate) {
				while (elem = results[i++]) {
					if (elem === results[i]) {
						j = duplicates.push(i);
					}
				}
				while (j--) {
					results.splice(duplicates[j], 1);
				}
			}

			// Clear input after sorting to release objects
			// See https://github.com/jquery/sizzle/pull/225
			sortInput = null;

			return results;
		};

		/**
   * Utility function for retrieving the text value of an array of DOM nodes
   * @param {Array|Element} elem
   */
		getText = Sizzle.getText = function (elem) {
			var node,
			    ret = "",
			    i = 0,
			    nodeType = elem.nodeType;

			if (!nodeType) {
				// If no nodeType, this is expected to be an array
				while (node = elem[i++]) {
					// Do not traverse comment nodes
					ret += getText(node);
				}
			} else if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
				// Use textContent for elements
				// innerText usage removed for consistency of new lines (jQuery #11153)
				if (typeof elem.textContent === "string") {
					return elem.textContent;
				} else {
					// Traverse its children
					for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
						ret += getText(elem);
					}
				}
			} else if (nodeType === 3 || nodeType === 4) {
				return elem.nodeValue;
			}
			// Do not include comment or processing instruction nodes

			return ret;
		};

		Expr = Sizzle.selectors = {

			// Can be adjusted by the user
			cacheLength: 50,

			createPseudo: markFunction,

			match: matchExpr,

			attrHandle: {},

			find: {},

			relative: {
				">": { dir: "parentNode", first: true },
				" ": { dir: "parentNode" },
				"+": { dir: "previousSibling", first: true },
				"~": { dir: "previousSibling" }
			},

			preFilter: {
				"ATTR": function ATTR(match) {
					match[1] = match[1].replace(runescape, funescape);

					// Move the given value to match[3] whether quoted or unquoted
					match[3] = (match[3] || match[4] || match[5] || "").replace(runescape, funescape);

					if (match[2] === "~=") {
						match[3] = " " + match[3] + " ";
					}

					return match.slice(0, 4);
				},

				"CHILD": function CHILD(match) {
					/* matches from matchExpr["CHILD"]
     	1 type (only|nth|...)
     	2 what (child|of-type)
     	3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
     	4 xn-component of xn+y argument ([+-]?\d*n|)
     	5 sign of xn-component
     	6 x of xn-component
     	7 sign of y-component
     	8 y of y-component
     */
					match[1] = match[1].toLowerCase();

					if (match[1].slice(0, 3) === "nth") {
						// nth-* requires argument
						if (!match[3]) {
							Sizzle.error(match[0]);
						}

						// numeric x and y parameters for Expr.filter.CHILD
						// remember that false/true cast respectively to 0/1
						match[4] = +(match[4] ? match[5] + (match[6] || 1) : 2 * (match[3] === "even" || match[3] === "odd"));
						match[5] = +(match[7] + match[8] || match[3] === "odd");

						// other types prohibit arguments
					} else if (match[3]) {
						Sizzle.error(match[0]);
					}

					return match;
				},

				"PSEUDO": function PSEUDO(match) {
					var excess,
					    unquoted = !match[6] && match[2];

					if (matchExpr["CHILD"].test(match[0])) {
						return null;
					}

					// Accept quoted arguments as-is
					if (match[3]) {
						match[2] = match[4] || match[5] || "";

						// Strip excess characters from unquoted arguments
					} else if (unquoted && rpseudo.test(unquoted) && (
					// Get excess from tokenize (recursively)
					excess = tokenize(unquoted, true)) && (
					// advance to the next closing parenthesis
					excess = unquoted.indexOf(")", unquoted.length - excess) - unquoted.length)) {

						// excess is a negative index
						match[0] = match[0].slice(0, excess);
						match[2] = unquoted.slice(0, excess);
					}

					// Return only captures needed by the pseudo filter method (type and argument)
					return match.slice(0, 3);
				}
			},

			filter: {

				"TAG": function TAG(nodeNameSelector) {
					var nodeName = nodeNameSelector.replace(runescape, funescape).toLowerCase();
					return nodeNameSelector === "*" ? function () {
						return true;
					} : function (elem) {
						return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
					};
				},

				"CLASS": function CLASS(className) {
					var pattern = classCache[className + " "];

					return pattern || (pattern = new RegExp("(^|" + whitespace + ")" + className + "(" + whitespace + "|$)")) && classCache(className, function (elem) {
						return pattern.test(typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "");
					});
				},

				"ATTR": function ATTR(name, operator, check) {
					return function (elem) {
						var result = Sizzle.attr(elem, name);

						if (result == null) {
							return operator === "!=";
						}
						if (!operator) {
							return true;
						}

						result += "";

						return operator === "=" ? result === check : operator === "!=" ? result !== check : operator === "^=" ? check && result.indexOf(check) === 0 : operator === "*=" ? check && result.indexOf(check) > -1 : operator === "$=" ? check && result.slice(-check.length) === check : operator === "~=" ? (" " + result.replace(rwhitespace, " ") + " ").indexOf(check) > -1 : operator === "|=" ? result === check || result.slice(0, check.length + 1) === check + "-" : false;
					};
				},

				"CHILD": function CHILD(type, what, argument, first, last) {
					var simple = type.slice(0, 3) !== "nth",
					    forward = type.slice(-4) !== "last",
					    ofType = what === "of-type";

					return first === 1 && last === 0 ?

					// Shortcut for :nth-*(n)
					function (elem) {
						return !!elem.parentNode;
					} : function (elem, context, xml) {
						var cache,
						    uniqueCache,
						    outerCache,
						    node,
						    nodeIndex,
						    start,
						    dir = simple !== forward ? "nextSibling" : "previousSibling",
						    parent = elem.parentNode,
						    name = ofType && elem.nodeName.toLowerCase(),
						    useCache = !xml && !ofType,
						    diff = false;

						if (parent) {

							// :(first|last|only)-(child|of-type)
							if (simple) {
								while (dir) {
									node = elem;
									while (node = node[dir]) {
										if (ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1) {

											return false;
										}
									}
									// Reverse direction for :only-* (if we haven't yet done so)
									start = dir = type === "only" && !start && "nextSibling";
								}
								return true;
							}

							start = [forward ? parent.firstChild : parent.lastChild];

							// non-xml :nth-child(...) stores cache data on `parent`
							if (forward && useCache) {

								// Seek `elem` from a previously-cached index

								// ...in a gzip-friendly way
								node = parent;
								outerCache = node[expando] || (node[expando] = {});

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[node.uniqueID] || (outerCache[node.uniqueID] = {});

								cache = uniqueCache[type] || [];
								nodeIndex = cache[0] === dirruns && cache[1];
								diff = nodeIndex && cache[2];
								node = nodeIndex && parent.childNodes[nodeIndex];

								while (node = ++nodeIndex && node && node[dir] || (

								// Fallback to seeking `elem` from the start
								diff = nodeIndex = 0) || start.pop()) {

									// When found, cache indexes on `parent` and break
									if (node.nodeType === 1 && ++diff && node === elem) {
										uniqueCache[type] = [dirruns, nodeIndex, diff];
										break;
									}
								}
							} else {
								// Use previously-cached element index if available
								if (useCache) {
									// ...in a gzip-friendly way
									node = elem;
									outerCache = node[expando] || (node[expando] = {});

									// Support: IE <9 only
									// Defend against cloned attroperties (jQuery gh-1709)
									uniqueCache = outerCache[node.uniqueID] || (outerCache[node.uniqueID] = {});

									cache = uniqueCache[type] || [];
									nodeIndex = cache[0] === dirruns && cache[1];
									diff = nodeIndex;
								}

								// xml :nth-child(...)
								// or :nth-last-child(...) or :nth(-last)?-of-type(...)
								if (diff === false) {
									// Use the same loop as above to seek `elem` from the start
									while (node = ++nodeIndex && node && node[dir] || (diff = nodeIndex = 0) || start.pop()) {

										if ((ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1) && ++diff) {

											// Cache the index of each encountered element
											if (useCache) {
												outerCache = node[expando] || (node[expando] = {});

												// Support: IE <9 only
												// Defend against cloned attroperties (jQuery gh-1709)
												uniqueCache = outerCache[node.uniqueID] || (outerCache[node.uniqueID] = {});

												uniqueCache[type] = [dirruns, diff];
											}

											if (node === elem) {
												break;
											}
										}
									}
								}
							}

							// Incorporate the offset, then check against cycle size
							diff -= last;
							return diff === first || diff % first === 0 && diff / first >= 0;
						}
					};
				},

				"PSEUDO": function PSEUDO(pseudo, argument) {
					// pseudo-class names are case-insensitive
					// http://www.w3.org/TR/selectors/#pseudo-classes
					// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
					// Remember that setFilters inherits from pseudos
					var args,
					    fn = Expr.pseudos[pseudo] || Expr.setFilters[pseudo.toLowerCase()] || Sizzle.error("unsupported pseudo: " + pseudo);

					// The user may use createPseudo to indicate that
					// arguments are needed to create the filter function
					// just as Sizzle does
					if (fn[expando]) {
						return fn(argument);
					}

					// But maintain support for old signatures
					if (fn.length > 1) {
						args = [pseudo, pseudo, "", argument];
						return Expr.setFilters.hasOwnProperty(pseudo.toLowerCase()) ? markFunction(function (seed, matches) {
							var idx,
							    matched = fn(seed, argument),
							    i = matched.length;
							while (i--) {
								idx = indexOf(seed, matched[i]);
								seed[idx] = !(matches[idx] = matched[i]);
							}
						}) : function (elem) {
							return fn(elem, 0, args);
						};
					}

					return fn;
				}
			},

			pseudos: {
				// Potentially complex pseudos
				"not": markFunction(function (selector) {
					// Trim the selector passed to compile
					// to avoid treating leading and trailing
					// spaces as combinators
					var input = [],
					    results = [],
					    matcher = compile(selector.replace(rtrim, "$1"));

					return matcher[expando] ? markFunction(function (seed, matches, context, xml) {
						var elem,
						    unmatched = matcher(seed, null, xml, []),
						    i = seed.length;

						// Match elements unmatched by `matcher`
						while (i--) {
							if (elem = unmatched[i]) {
								seed[i] = !(matches[i] = elem);
							}
						}
					}) : function (elem, context, xml) {
						input[0] = elem;
						matcher(input, null, xml, results);
						// Don't keep the element (issue #299)
						input[0] = null;
						return !results.pop();
					};
				}),

				"has": markFunction(function (selector) {
					return function (elem) {
						return Sizzle(selector, elem).length > 0;
					};
				}),

				"contains": markFunction(function (text) {
					text = text.replace(runescape, funescape);
					return function (elem) {
						return (elem.textContent || getText(elem)).indexOf(text) > -1;
					};
				}),

				// "Whether an element is represented by a :lang() selector
				// is based solely on the element's language value
				// being equal to the identifier C,
				// or beginning with the identifier C immediately followed by "-".
				// The matching of C against the element's language value is performed case-insensitively.
				// The identifier C does not have to be a valid language name."
				// http://www.w3.org/TR/selectors/#lang-pseudo
				"lang": markFunction(function (lang) {
					// lang value must be a valid identifier
					if (!ridentifier.test(lang || "")) {
						Sizzle.error("unsupported lang: " + lang);
					}
					lang = lang.replace(runescape, funescape).toLowerCase();
					return function (elem) {
						var elemLang;
						do {
							if (elemLang = documentIsHTML ? elem.lang : elem.getAttribute("xml:lang") || elem.getAttribute("lang")) {

								elemLang = elemLang.toLowerCase();
								return elemLang === lang || elemLang.indexOf(lang + "-") === 0;
							}
						} while ((elem = elem.parentNode) && elem.nodeType === 1);
						return false;
					};
				}),

				// Miscellaneous
				"target": function target(elem) {
					var hash = window.location && window.location.hash;
					return hash && hash.slice(1) === elem.id;
				},

				"root": function root(elem) {
					return elem === docElem;
				},

				"focus": function focus(elem) {
					return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
				},

				// Boolean properties
				"enabled": createDisabledPseudo(false),
				"disabled": createDisabledPseudo(true),

				"checked": function checked(elem) {
					// In CSS3, :checked should return both checked and selected elements
					// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
					var nodeName = elem.nodeName.toLowerCase();
					return nodeName === "input" && !!elem.checked || nodeName === "option" && !!elem.selected;
				},

				"selected": function selected(elem) {
					// Accessing this property makes selected-by-default
					// options in Safari work properly
					if (elem.parentNode) {
						elem.parentNode.selectedIndex;
					}

					return elem.selected === true;
				},

				// Contents
				"empty": function empty(elem) {
					// http://www.w3.org/TR/selectors/#empty-pseudo
					// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
					//   but not by others (comment: 8; processing instruction: 7; etc.)
					// nodeType < 6 works because attributes (2) do not appear as children
					for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
						if (elem.nodeType < 6) {
							return false;
						}
					}
					return true;
				},

				"parent": function parent(elem) {
					return !Expr.pseudos["empty"](elem);
				},

				// Element/input types
				"header": function header(elem) {
					return rheader.test(elem.nodeName);
				},

				"input": function input(elem) {
					return rinputs.test(elem.nodeName);
				},

				"button": function button(elem) {
					var name = elem.nodeName.toLowerCase();
					return name === "input" && elem.type === "button" || name === "button";
				},

				"text": function text(elem) {
					var attr;
					return elem.nodeName.toLowerCase() === "input" && elem.type === "text" && (

					// Support: IE<8
					// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
					(attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text");
				},

				// Position-in-collection
				"first": createPositionalPseudo(function () {
					return [0];
				}),

				"last": createPositionalPseudo(function (matchIndexes, length) {
					return [length - 1];
				}),

				"eq": createPositionalPseudo(function (matchIndexes, length, argument) {
					return [argument < 0 ? argument + length : argument];
				}),

				"even": createPositionalPseudo(function (matchIndexes, length) {
					var i = 0;
					for (; i < length; i += 2) {
						matchIndexes.push(i);
					}
					return matchIndexes;
				}),

				"odd": createPositionalPseudo(function (matchIndexes, length) {
					var i = 1;
					for (; i < length; i += 2) {
						matchIndexes.push(i);
					}
					return matchIndexes;
				}),

				"lt": createPositionalPseudo(function (matchIndexes, length, argument) {
					var i = argument < 0 ? argument + length : argument > length ? length : argument;
					for (; --i >= 0;) {
						matchIndexes.push(i);
					}
					return matchIndexes;
				}),

				"gt": createPositionalPseudo(function (matchIndexes, length, argument) {
					var i = argument < 0 ? argument + length : argument;
					for (; ++i < length;) {
						matchIndexes.push(i);
					}
					return matchIndexes;
				})
			}
		};

		Expr.pseudos["nth"] = Expr.pseudos["eq"];

		// Add button/input type pseudos
		for (i in { radio: true, checkbox: true, file: true, password: true, image: true }) {
			Expr.pseudos[i] = createInputPseudo(i);
		}
		for (i in { submit: true, reset: true }) {
			Expr.pseudos[i] = createButtonPseudo(i);
		}

		// Easy API for creating new setFilters
		function setFilters() {}
		setFilters.prototype = Expr.filters = Expr.pseudos;
		Expr.setFilters = new setFilters();

		tokenize = Sizzle.tokenize = function (selector, parseOnly) {
			var matched,
			    match,
			    tokens,
			    type,
			    soFar,
			    groups,
			    preFilters,
			    cached = tokenCache[selector + " "];

			if (cached) {
				return parseOnly ? 0 : cached.slice(0);
			}

			soFar = selector;
			groups = [];
			preFilters = Expr.preFilter;

			while (soFar) {

				// Comma and first run
				if (!matched || (match = rcomma.exec(soFar))) {
					if (match) {
						// Don't consume trailing commas as valid
						soFar = soFar.slice(match[0].length) || soFar;
					}
					groups.push(tokens = []);
				}

				matched = false;

				// Combinators
				if (match = rcombinators.exec(soFar)) {
					matched = match.shift();
					tokens.push({
						value: matched,
						// Cast descendant combinators to space
						type: match[0].replace(rtrim, " ")
					});
					soFar = soFar.slice(matched.length);
				}

				// Filters
				for (type in Expr.filter) {
					if ((match = matchExpr[type].exec(soFar)) && (!preFilters[type] || (match = preFilters[type](match)))) {
						matched = match.shift();
						tokens.push({
							value: matched,
							type: type,
							matches: match
						});
						soFar = soFar.slice(matched.length);
					}
				}

				if (!matched) {
					break;
				}
			}

			// Return the length of the invalid excess
			// if we're just parsing
			// Otherwise, throw an error or return tokens
			return parseOnly ? soFar.length : soFar ? Sizzle.error(selector) :
			// Cache the tokens
			tokenCache(selector, groups).slice(0);
		};

		function toSelector(tokens) {
			var i = 0,
			    len = tokens.length,
			    selector = "";
			for (; i < len; i++) {
				selector += tokens[i].value;
			}
			return selector;
		}

		function addCombinator(matcher, combinator, base) {
			var dir = combinator.dir,
			    skip = combinator.next,
			    key = skip || dir,
			    checkNonElements = base && key === "parentNode",
			    doneName = done++;

			return combinator.first ?
			// Check against closest ancestor/preceding element
			function (elem, context, xml) {
				while (elem = elem[dir]) {
					if (elem.nodeType === 1 || checkNonElements) {
						return matcher(elem, context, xml);
					}
				}
				return false;
			} :

			// Check against all ancestor/preceding elements
			function (elem, context, xml) {
				var oldCache,
				    uniqueCache,
				    outerCache,
				    newCache = [dirruns, doneName];

				// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
				if (xml) {
					while (elem = elem[dir]) {
						if (elem.nodeType === 1 || checkNonElements) {
							if (matcher(elem, context, xml)) {
								return true;
							}
						}
					}
				} else {
					while (elem = elem[dir]) {
						if (elem.nodeType === 1 || checkNonElements) {
							outerCache = elem[expando] || (elem[expando] = {});

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[elem.uniqueID] || (outerCache[elem.uniqueID] = {});

							if (skip && skip === elem.nodeName.toLowerCase()) {
								elem = elem[dir] || elem;
							} else if ((oldCache = uniqueCache[key]) && oldCache[0] === dirruns && oldCache[1] === doneName) {

								// Assign to newCache so results back-propagate to previous elements
								return newCache[2] = oldCache[2];
							} else {
								// Reuse newcache so results back-propagate to previous elements
								uniqueCache[key] = newCache;

								// A match means we're done; a fail means we have to keep checking
								if (newCache[2] = matcher(elem, context, xml)) {
									return true;
								}
							}
						}
					}
				}
				return false;
			};
		}

		function elementMatcher(matchers) {
			return matchers.length > 1 ? function (elem, context, xml) {
				var i = matchers.length;
				while (i--) {
					if (!matchers[i](elem, context, xml)) {
						return false;
					}
				}
				return true;
			} : matchers[0];
		}

		function multipleContexts(selector, contexts, results) {
			var i = 0,
			    len = contexts.length;
			for (; i < len; i++) {
				Sizzle(selector, contexts[i], results);
			}
			return results;
		}

		function condense(unmatched, map, filter, context, xml) {
			var elem,
			    newUnmatched = [],
			    i = 0,
			    len = unmatched.length,
			    mapped = map != null;

			for (; i < len; i++) {
				if (elem = unmatched[i]) {
					if (!filter || filter(elem, context, xml)) {
						newUnmatched.push(elem);
						if (mapped) {
							map.push(i);
						}
					}
				}
			}

			return newUnmatched;
		}

		function setMatcher(preFilter, selector, matcher, postFilter, postFinder, postSelector) {
			if (postFilter && !postFilter[expando]) {
				postFilter = setMatcher(postFilter);
			}
			if (postFinder && !postFinder[expando]) {
				postFinder = setMatcher(postFinder, postSelector);
			}
			return markFunction(function (seed, results, context, xml) {
				var temp,
				    i,
				    elem,
				    preMap = [],
				    postMap = [],
				    preexisting = results.length,


				// Get initial elements from seed or context
				elems = seed || multipleContexts(selector || "*", context.nodeType ? [context] : context, []),


				// Prefilter to get matcher input, preserving a map for seed-results synchronization
				matcherIn = preFilter && (seed || !selector) ? condense(elems, preMap, preFilter, context, xml) : elems,
				    matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || (seed ? preFilter : preexisting || postFilter) ?

				// ...intermediate processing is necessary
				[] :

				// ...otherwise use results directly
				results : matcherIn;

				// Find primary matches
				if (matcher) {
					matcher(matcherIn, matcherOut, context, xml);
				}

				// Apply postFilter
				if (postFilter) {
					temp = condense(matcherOut, postMap);
					postFilter(temp, [], context, xml);

					// Un-match failing elements by moving them back to matcherIn
					i = temp.length;
					while (i--) {
						if (elem = temp[i]) {
							matcherOut[postMap[i]] = !(matcherIn[postMap[i]] = elem);
						}
					}
				}

				if (seed) {
					if (postFinder || preFilter) {
						if (postFinder) {
							// Get the final matcherOut by condensing this intermediate into postFinder contexts
							temp = [];
							i = matcherOut.length;
							while (i--) {
								if (elem = matcherOut[i]) {
									// Restore matcherIn since elem is not yet a final match
									temp.push(matcherIn[i] = elem);
								}
							}
							postFinder(null, matcherOut = [], temp, xml);
						}

						// Move matched elements from seed to results to keep them synchronized
						i = matcherOut.length;
						while (i--) {
							if ((elem = matcherOut[i]) && (temp = postFinder ? indexOf(seed, elem) : preMap[i]) > -1) {

								seed[temp] = !(results[temp] = elem);
							}
						}
					}

					// Add elements to results, through postFinder if defined
				} else {
					matcherOut = condense(matcherOut === results ? matcherOut.splice(preexisting, matcherOut.length) : matcherOut);
					if (postFinder) {
						postFinder(null, results, matcherOut, xml);
					} else {
						push.apply(results, matcherOut);
					}
				}
			});
		}

		function matcherFromTokens(tokens) {
			var checkContext,
			    matcher,
			    j,
			    len = tokens.length,
			    leadingRelative = Expr.relative[tokens[0].type],
			    implicitRelative = leadingRelative || Expr.relative[" "],
			    i = leadingRelative ? 1 : 0,


			// The foundational matcher ensures that elements are reachable from top-level context(s)
			matchContext = addCombinator(function (elem) {
				return elem === checkContext;
			}, implicitRelative, true),
			    matchAnyContext = addCombinator(function (elem) {
				return indexOf(checkContext, elem) > -1;
			}, implicitRelative, true),
			    matchers = [function (elem, context, xml) {
				var ret = !leadingRelative && (xml || context !== outermostContext) || ((checkContext = context).nodeType ? matchContext(elem, context, xml) : matchAnyContext(elem, context, xml));
				// Avoid hanging onto element (issue #299)
				checkContext = null;
				return ret;
			}];

			for (; i < len; i++) {
				if (matcher = Expr.relative[tokens[i].type]) {
					matchers = [addCombinator(elementMatcher(matchers), matcher)];
				} else {
					matcher = Expr.filter[tokens[i].type].apply(null, tokens[i].matches);

					// Return special upon seeing a positional matcher
					if (matcher[expando]) {
						// Find the next relative operator (if any) for proper handling
						j = ++i;
						for (; j < len; j++) {
							if (Expr.relative[tokens[j].type]) {
								break;
							}
						}
						return setMatcher(i > 1 && elementMatcher(matchers), i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice(0, i - 1).concat({ value: tokens[i - 2].type === " " ? "*" : "" })).replace(rtrim, "$1"), matcher, i < j && matcherFromTokens(tokens.slice(i, j)), j < len && matcherFromTokens(tokens = tokens.slice(j)), j < len && toSelector(tokens));
					}
					matchers.push(matcher);
				}
			}

			return elementMatcher(matchers);
		}

		function matcherFromGroupMatchers(elementMatchers, setMatchers) {
			var bySet = setMatchers.length > 0,
			    byElement = elementMatchers.length > 0,
			    superMatcher = function superMatcher(seed, context, xml, results, outermost) {
				var elem,
				    j,
				    matcher,
				    matchedCount = 0,
				    i = "0",
				    unmatched = seed && [],
				    setMatched = [],
				    contextBackup = outermostContext,

				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find["TAG"]("*", outermost),

				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = dirruns += contextBackup == null ? 1 : Math.random() || 0.1,
				    len = elems.length;

				if (outermost) {
					outermostContext = context === document || context || outermost;
				}

				// Add elements passing elementMatchers directly to results
				// Support: IE<9, Safari
				// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
				for (; i !== len && (elem = elems[i]) != null; i++) {
					if (byElement && elem) {
						j = 0;
						if (!context && elem.ownerDocument !== document) {
							setDocument(elem);
							xml = !documentIsHTML;
						}
						while (matcher = elementMatchers[j++]) {
							if (matcher(elem, context || document, xml)) {
								results.push(elem);
								break;
							}
						}
						if (outermost) {
							dirruns = dirrunsUnique;
						}
					}

					// Track unmatched elements for set filters
					if (bySet) {
						// They will have gone through all possible matchers
						if (elem = !matcher && elem) {
							matchedCount--;
						}

						// Lengthen the array for every element, matched or not
						if (seed) {
							unmatched.push(elem);
						}
					}
				}

				// `i` is now the count of elements visited above, and adding it to `matchedCount`
				// makes the latter nonnegative.
				matchedCount += i;

				// Apply set filters to unmatched elements
				// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
				// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
				// no element matchers and no seed.
				// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
				// case, which will result in a "00" `matchedCount` that differs from `i` but is also
				// numerically zero.
				if (bySet && i !== matchedCount) {
					j = 0;
					while (matcher = setMatchers[j++]) {
						matcher(unmatched, setMatched, context, xml);
					}

					if (seed) {
						// Reintegrate element matches to eliminate the need for sorting
						if (matchedCount > 0) {
							while (i--) {
								if (!(unmatched[i] || setMatched[i])) {
									setMatched[i] = pop.call(results);
								}
							}
						}

						// Discard index placeholder values to get only actual matches
						setMatched = condense(setMatched);
					}

					// Add matches to results
					push.apply(results, setMatched);

					// Seedless set matches succeeding multiple successful matchers stipulate sorting
					if (outermost && !seed && setMatched.length > 0 && matchedCount + setMatchers.length > 1) {

						Sizzle.uniqueSort(results);
					}
				}

				// Override manipulation of globals by nested matchers
				if (outermost) {
					dirruns = dirrunsUnique;
					outermostContext = contextBackup;
				}

				return unmatched;
			};

			return bySet ? markFunction(superMatcher) : superMatcher;
		}

		compile = Sizzle.compile = function (selector, match /* Internal Use Only */) {
			var i,
			    setMatchers = [],
			    elementMatchers = [],
			    cached = compilerCache[selector + " "];

			if (!cached) {
				// Generate a function of recursive functions that can be used to check each element
				if (!match) {
					match = tokenize(selector);
				}
				i = match.length;
				while (i--) {
					cached = matcherFromTokens(match[i]);
					if (cached[expando]) {
						setMatchers.push(cached);
					} else {
						elementMatchers.push(cached);
					}
				}

				// Cache the compiled function
				cached = compilerCache(selector, matcherFromGroupMatchers(elementMatchers, setMatchers));

				// Save selector and tokenization
				cached.selector = selector;
			}
			return cached;
		};

		/**
   * A low-level selection function that works with Sizzle's compiled
   *  selector functions
   * @param {String|Function} selector A selector or a pre-compiled
   *  selector function built with Sizzle.compile
   * @param {Element} context
   * @param {Array} [results]
   * @param {Array} [seed] A set of elements to match against
   */
		select = Sizzle.select = function (selector, context, results, seed) {
			var i,
			    tokens,
			    token,
			    type,
			    find,
			    compiled = typeof selector === "function" && selector,
			    match = !seed && tokenize(selector = compiled.selector || selector);

			results = results || [];

			// Try to minimize operations if there is only one selector in the list and no seed
			// (the latter of which guarantees us context)
			if (match.length === 1) {

				// Reduce context if the leading compound selector is an ID
				tokens = match[0] = match[0].slice(0);
				if (tokens.length > 2 && (token = tokens[0]).type === "ID" && context.nodeType === 9 && documentIsHTML && Expr.relative[tokens[1].type]) {

					context = (Expr.find["ID"](token.matches[0].replace(runescape, funescape), context) || [])[0];
					if (!context) {
						return results;

						// Precompiled matchers will still verify ancestry, so step up a level
					} else if (compiled) {
						context = context.parentNode;
					}

					selector = selector.slice(tokens.shift().value.length);
				}

				// Fetch a seed set for right-to-left matching
				i = matchExpr["needsContext"].test(selector) ? 0 : tokens.length;
				while (i--) {
					token = tokens[i];

					// Abort if we hit a combinator
					if (Expr.relative[type = token.type]) {
						break;
					}
					if (find = Expr.find[type]) {
						// Search, expanding context for leading sibling combinators
						if (seed = find(token.matches[0].replace(runescape, funescape), rsibling.test(tokens[0].type) && testContext(context.parentNode) || context)) {

							// If seed is empty or no tokens remain, we can return early
							tokens.splice(i, 1);
							selector = seed.length && toSelector(tokens);
							if (!selector) {
								push.apply(results, seed);
								return results;
							}

							break;
						}
					}
				}
			}

			// Compile and execute a filtering function if one is not provided
			// Provide `match` to avoid retokenization if we modified the selector above
			(compiled || compile(selector, match))(seed, context, !documentIsHTML, results, !context || rsibling.test(selector) && testContext(context.parentNode) || context);
			return results;
		};

		// One-time assignments

		// Sort stability
		support.sortStable = expando.split("").sort(sortOrder).join("") === expando;

		// Support: Chrome 14-35+
		// Always assume duplicates if they aren't passed to the comparison function
		support.detectDuplicates = !!hasDuplicate;

		// Initialize against the default document
		setDocument();

		// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
		// Detached nodes confoundingly follow *each other*
		support.sortDetached = assert(function (el) {
			// Should return 1, but returns 4 (following)
			return el.compareDocumentPosition(document.createElement("fieldset")) & 1;
		});

		// Support: IE<8
		// Prevent attribute/property "interpolation"
		// https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
		if (!assert(function (el) {
			el.innerHTML = "<a href='#'></a>";
			return el.firstChild.getAttribute("href") === "#";
		})) {
			addHandle("type|href|height|width", function (elem, name, isXML) {
				if (!isXML) {
					return elem.getAttribute(name, name.toLowerCase() === "type" ? 1 : 2);
				}
			});
		}

		// Support: IE<9
		// Use defaultValue in place of getAttribute("value")
		if (!support.attributes || !assert(function (el) {
			el.innerHTML = "<input/>";
			el.firstChild.setAttribute("value", "");
			return el.firstChild.getAttribute("value") === "";
		})) {
			addHandle("value", function (elem, name, isXML) {
				if (!isXML && elem.nodeName.toLowerCase() === "input") {
					return elem.defaultValue;
				}
			});
		}

		// Support: IE<9
		// Use getAttributeNode to fetch booleans when getAttribute lies
		if (!assert(function (el) {
			return el.getAttribute("disabled") == null;
		})) {
			addHandle(booleans, function (elem, name, isXML) {
				var val;
				if (!isXML) {
					return elem[name] === true ? name.toLowerCase() : (val = elem.getAttributeNode(name)) && val.specified ? val.value : null;
				}
			});
		}

		return Sizzle;
	}(window);

	jQuery.find = Sizzle;
	jQuery.expr = Sizzle.selectors;

	// Deprecated
	jQuery.expr[":"] = jQuery.expr.pseudos;
	jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
	jQuery.text = Sizzle.getText;
	jQuery.isXMLDoc = Sizzle.isXML;
	jQuery.contains = Sizzle.contains;
	jQuery.escapeSelector = Sizzle.escape;

	var dir = function dir(elem, _dir, until) {
		var matched = [],
		    truncate = until !== undefined;

		while ((elem = elem[_dir]) && elem.nodeType !== 9) {
			if (elem.nodeType === 1) {
				if (truncate && jQuery(elem).is(until)) {
					break;
				}
				matched.push(elem);
			}
		}
		return matched;
	};

	var _siblings = function _siblings(n, elem) {
		var matched = [];

		for (; n; n = n.nextSibling) {
			if (n.nodeType === 1 && n !== elem) {
				matched.push(n);
			}
		}

		return matched;
	};

	var rneedsContext = jQuery.expr.match.needsContext;

	function nodeName(elem, name) {

		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	};
	var rsingleTag = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;

	// Implement the identical functionality for filter and not
	function winnow(elements, qualifier, not) {
		if (isFunction(qualifier)) {
			return jQuery.grep(elements, function (elem, i) {
				return !!qualifier.call(elem, i, elem) !== not;
			});
		}

		// Single element
		if (qualifier.nodeType) {
			return jQuery.grep(elements, function (elem) {
				return elem === qualifier !== not;
			});
		}

		// Arraylike of elements (jQuery, arguments, Array)
		if (typeof qualifier !== "string") {
			return jQuery.grep(elements, function (elem) {
				return indexOf.call(qualifier, elem) > -1 !== not;
			});
		}

		// Filtered directly for both simple and complex selectors
		return jQuery.filter(qualifier, elements, not);
	}

	jQuery.filter = function (expr, elems, not) {
		var elem = elems[0];

		if (not) {
			expr = ":not(" + expr + ")";
		}

		if (elems.length === 1 && elem.nodeType === 1) {
			return jQuery.find.matchesSelector(elem, expr) ? [elem] : [];
		}

		return jQuery.find.matches(expr, jQuery.grep(elems, function (elem) {
			return elem.nodeType === 1;
		}));
	};

	jQuery.fn.extend({
		find: function find(selector) {
			var i,
			    ret,
			    len = this.length,
			    self = this;

			if (typeof selector !== "string") {
				return this.pushStack(jQuery(selector).filter(function () {
					for (i = 0; i < len; i++) {
						if (jQuery.contains(self[i], this)) {
							return true;
						}
					}
				}));
			}

			ret = this.pushStack([]);

			for (i = 0; i < len; i++) {
				jQuery.find(selector, self[i], ret);
			}

			return len > 1 ? jQuery.uniqueSort(ret) : ret;
		},
		filter: function filter(selector) {
			return this.pushStack(winnow(this, selector || [], false));
		},
		not: function not(selector) {
			return this.pushStack(winnow(this, selector || [], true));
		},
		is: function is(selector) {
			return !!winnow(this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test(selector) ? jQuery(selector) : selector || [], false).length;
		}
	});

	// Initialize a jQuery object


	// A central reference to the root jQuery(document)
	var rootjQuery,


	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	// Shortcut simple #id case for speed
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,
	    init = jQuery.fn.init = function (selector, context, root) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if (!selector) {
			return this;
		}

		// Method init() accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if (typeof selector === "string") {
			if (selector[0] === "<" && selector[selector.length - 1] === ">" && selector.length >= 3) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [null, selector, null];
			} else {
				match = rquickExpr.exec(selector);
			}

			// Match html or make sure no context is specified for #id
			if (match && (match[1] || !context)) {

				// HANDLE: $(html) -> $(array)
				if (match[1]) {
					context = context instanceof jQuery ? context[0] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge(this, jQuery.parseHTML(match[1], context && context.nodeType ? context.ownerDocument || context : document, true));

					// HANDLE: $(html, props)
					if (rsingleTag.test(match[1]) && jQuery.isPlainObject(context)) {
						for (match in context) {

							// Properties of context are called as methods if possible
							if (isFunction(this[match])) {
								this[match](context[match]);

								// ...and otherwise set as attributes
							} else {
								this.attr(match, context[match]);
							}
						}
					}

					return this;

					// HANDLE: $(#id)
				} else {
					elem = document.getElementById(match[2]);

					if (elem) {

						// Inject the element directly into the jQuery object
						this[0] = elem;
						this.length = 1;
					}
					return this;
				}

				// HANDLE: $(expr, $(...))
			} else if (!context || context.jquery) {
				return (context || root).find(selector);

				// HANDLE: $(expr, context)
				// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor(context).find(selector);
			}

			// HANDLE: $(DOMElement)
		} else if (selector.nodeType) {
			this[0] = selector;
			this.length = 1;
			return this;

			// HANDLE: $(function)
			// Shortcut for document ready
		} else if (isFunction(selector)) {
			return root.ready !== undefined ? root.ready(selector) :

			// Execute immediately if ready is not present
			selector(jQuery);
		}

		return jQuery.makeArray(selector, this);
	};

	// Give the init function the jQuery prototype for later instantiation
	init.prototype = jQuery.fn;

	// Initialize central reference
	rootjQuery = jQuery(document);

	var rparentsprev = /^(?:parents|prev(?:Until|All))/,


	// Methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

	jQuery.fn.extend({
		has: function has(target) {
			var targets = jQuery(target, this),
			    l = targets.length;

			return this.filter(function () {
				var i = 0;
				for (; i < l; i++) {
					if (jQuery.contains(this, targets[i])) {
						return true;
					}
				}
			});
		},

		closest: function closest(selectors, context) {
			var cur,
			    i = 0,
			    l = this.length,
			    matched = [],
			    targets = typeof selectors !== "string" && jQuery(selectors);

			// Positional selectors never match, since there's no _selection_ context
			if (!rneedsContext.test(selectors)) {
				for (; i < l; i++) {
					for (cur = this[i]; cur && cur !== context; cur = cur.parentNode) {

						// Always skip document fragments
						if (cur.nodeType < 11 && (targets ? targets.index(cur) > -1 :

						// Don't pass non-elements to Sizzle
						cur.nodeType === 1 && jQuery.find.matchesSelector(cur, selectors))) {

							matched.push(cur);
							break;
						}
					}
				}
			}

			return this.pushStack(matched.length > 1 ? jQuery.uniqueSort(matched) : matched);
		},

		// Determine the position of an element within the set
		index: function index(elem) {

			// No argument, return index in parent
			if (!elem) {
				return this[0] && this[0].parentNode ? this.first().prevAll().length : -1;
			}

			// Index in selector
			if (typeof elem === "string") {
				return indexOf.call(jQuery(elem), this[0]);
			}

			// Locate the position of the desired element
			return indexOf.call(this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem);
		},

		add: function add(selector, context) {
			return this.pushStack(jQuery.uniqueSort(jQuery.merge(this.get(), jQuery(selector, context))));
		},

		addBack: function addBack(selector) {
			return this.add(selector == null ? this.prevObject : this.prevObject.filter(selector));
		}
	});

	function sibling(cur, dir) {
		while ((cur = cur[dir]) && cur.nodeType !== 1) {}
		return cur;
	}

	jQuery.each({
		parent: function parent(elem) {
			var parent = elem.parentNode;
			return parent && parent.nodeType !== 11 ? parent : null;
		},
		parents: function parents(elem) {
			return dir(elem, "parentNode");
		},
		parentsUntil: function parentsUntil(elem, i, until) {
			return dir(elem, "parentNode", until);
		},
		next: function next(elem) {
			return sibling(elem, "nextSibling");
		},
		prev: function prev(elem) {
			return sibling(elem, "previousSibling");
		},
		nextAll: function nextAll(elem) {
			return dir(elem, "nextSibling");
		},
		prevAll: function prevAll(elem) {
			return dir(elem, "previousSibling");
		},
		nextUntil: function nextUntil(elem, i, until) {
			return dir(elem, "nextSibling", until);
		},
		prevUntil: function prevUntil(elem, i, until) {
			return dir(elem, "previousSibling", until);
		},
		siblings: function siblings(elem) {
			return _siblings((elem.parentNode || {}).firstChild, elem);
		},
		children: function children(elem) {
			return _siblings(elem.firstChild);
		},
		contents: function contents(elem) {
			if (typeof elem.contentDocument !== "undefined") {
				return elem.contentDocument;
			}

			// Support: IE 9 - 11 only, iOS 7 only, Android Browser <=4.3 only
			// Treat the template element as a regular one in browsers that
			// don't support it.
			if (nodeName(elem, "template")) {
				elem = elem.content || elem;
			}

			return jQuery.merge([], elem.childNodes);
		}
	}, function (name, fn) {
		jQuery.fn[name] = function (until, selector) {
			var matched = jQuery.map(this, fn, until);

			if (name.slice(-5) !== "Until") {
				selector = until;
			}

			if (selector && typeof selector === "string") {
				matched = jQuery.filter(selector, matched);
			}

			if (this.length > 1) {

				// Remove duplicates
				if (!guaranteedUnique[name]) {
					jQuery.uniqueSort(matched);
				}

				// Reverse order for parents* and prev-derivatives
				if (rparentsprev.test(name)) {
					matched.reverse();
				}
			}

			return this.pushStack(matched);
		};
	});
	var rnothtmlwhite = /[^\x20\t\r\n\f]+/g;

	// Convert String-formatted options into Object-formatted ones
	function createOptions(options) {
		var object = {};
		jQuery.each(options.match(rnothtmlwhite) || [], function (_, flag) {
			object[flag] = true;
		});
		return object;
	}

	/*
  * Create a callback list using the following parameters:
  *
  *	options: an optional list of space-separated options that will change how
  *			the callback list behaves or a more traditional option object
  *
  * By default a callback list will act like an event callback list and can be
  * "fired" multiple times.
  *
  * Possible options:
  *
  *	once:			will ensure the callback list can only be fired once (like a Deferred)
  *
  *	memory:			will keep track of previous values and will call any callback added
  *					after the list has been fired right away with the latest "memorized"
  *					values (like a Deferred)
  *
  *	unique:			will ensure a callback can only be added once (no duplicate in the list)
  *
  *	stopOnFalse:	interrupt callings when a callback returns false
  *
  */
	jQuery.Callbacks = function (options) {

		// Convert options from String-formatted to Object-formatted if needed
		// (we check in cache first)
		options = typeof options === "string" ? createOptions(options) : jQuery.extend({}, options);

		var // Flag to know if list is currently firing
		firing,


		// Last fire value for non-forgettable lists
		memory,


		// Flag to know if list was already fired
		_fired,


		// Flag to prevent firing
		_locked,


		// Actual callback list
		list = [],


		// Queue of execution data for repeatable lists
		queue = [],


		// Index of currently firing callback (modified by add/remove as needed)
		firingIndex = -1,


		// Fire callbacks
		fire = function fire() {

			// Enforce single-firing
			_locked = _locked || options.once;

			// Execute callbacks for all pending executions,
			// respecting firingIndex overrides and runtime changes
			_fired = firing = true;
			for (; queue.length; firingIndex = -1) {
				memory = queue.shift();
				while (++firingIndex < list.length) {

					// Run callback and check for early termination
					if (list[firingIndex].apply(memory[0], memory[1]) === false && options.stopOnFalse) {

						// Jump to end and forget the data so .add doesn't re-fire
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// Forget the data if we're done with it
			if (!options.memory) {
				memory = false;
			}

			firing = false;

			// Clean up if we're done firing for good
			if (_locked) {

				// Keep an empty list if we have data for future add calls
				if (memory) {
					list = [];

					// Otherwise, this object is spent
				} else {
					list = "";
				}
			}
		},


		// Actual Callbacks object
		self = {

			// Add a callback or a collection of callbacks to the list
			add: function add() {
				if (list) {

					// If we have memory from a past run, we should fire after adding
					if (memory && !firing) {
						firingIndex = list.length - 1;
						queue.push(memory);
					}

					(function add(args) {
						jQuery.each(args, function (_, arg) {
							if (isFunction(arg)) {
								if (!options.unique || !self.has(arg)) {
									list.push(arg);
								}
							} else if (arg && arg.length && toType(arg) !== "string") {

								// Inspect recursively
								add(arg);
							}
						});
					})(arguments);

					if (memory && !firing) {
						fire();
					}
				}
				return this;
			},

			// Remove a callback from the list
			remove: function remove() {
				jQuery.each(arguments, function (_, arg) {
					var index;
					while ((index = jQuery.inArray(arg, list, index)) > -1) {
						list.splice(index, 1);

						// Handle firing indexes
						if (index <= firingIndex) {
							firingIndex--;
						}
					}
				});
				return this;
			},

			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function has(fn) {
				return fn ? jQuery.inArray(fn, list) > -1 : list.length > 0;
			},

			// Remove all callbacks from the list
			empty: function empty() {
				if (list) {
					list = [];
				}
				return this;
			},

			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function disable() {
				_locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function disabled() {
				return !list;
			},

			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function lock() {
				_locked = queue = [];
				if (!memory && !firing) {
					list = memory = "";
				}
				return this;
			},
			locked: function locked() {
				return !!_locked;
			},

			// Call all callbacks with the given context and arguments
			fireWith: function fireWith(context, args) {
				if (!_locked) {
					args = args || [];
					args = [context, args.slice ? args.slice() : args];
					queue.push(args);
					if (!firing) {
						fire();
					}
				}
				return this;
			},

			// Call all the callbacks with the given arguments
			fire: function fire() {
				self.fireWith(this, arguments);
				return this;
			},

			// To know if the callbacks have already been called at least once
			fired: function fired() {
				return !!_fired;
			}
		};

		return self;
	};

	function Identity(v) {
		return v;
	}
	function Thrower(ex) {
		throw ex;
	}

	function adoptValue(value, resolve, reject, noValue) {
		var method;

		try {

			// Check for promise aspect first to privilege synchronous behavior
			if (value && isFunction(method = value.promise)) {
				method.call(value).done(resolve).fail(reject);

				// Other thenables
			} else if (value && isFunction(method = value.then)) {
				method.call(value, resolve, reject);

				// Other non-thenables
			} else {

				// Control `resolve` arguments by letting Array#slice cast boolean `noValue` to integer:
				// * false: [ value ].slice( 0 ) => resolve( value )
				// * true: [ value ].slice( 1 ) => resolve()
				resolve.apply(undefined, [value].slice(noValue));
			}

			// For Promises/A+, convert exceptions into rejections
			// Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
			// Deferred#then to conditionally suppress rejection.
		} catch (value) {

			// Support: Android 4.0 only
			// Strict mode functions invoked without .call/.apply get global-object context
			reject.apply(undefined, [value]);
		}
	}

	jQuery.extend({

		Deferred: function Deferred(func) {
			var tuples = [

			// action, add listener, callbacks,
			// ... .then handlers, argument index, [final state]
			["notify", "progress", jQuery.Callbacks("memory"), jQuery.Callbacks("memory"), 2], ["resolve", "done", jQuery.Callbacks("once memory"), jQuery.Callbacks("once memory"), 0, "resolved"], ["reject", "fail", jQuery.Callbacks("once memory"), jQuery.Callbacks("once memory"), 1, "rejected"]],
			    _state = "pending",
			    _promise = {
				state: function state() {
					return _state;
				},
				always: function always() {
					deferred.done(arguments).fail(arguments);
					return this;
				},
				"catch": function _catch(fn) {
					return _promise.then(null, fn);
				},

				// Keep pipe for back-compat
				pipe: function pipe() /* fnDone, fnFail, fnProgress */{
					var fns = arguments;

					return jQuery.Deferred(function (newDefer) {
						jQuery.each(tuples, function (i, tuple) {

							// Map tuples (progress, done, fail) to arguments (done, fail, progress)
							var fn = isFunction(fns[tuple[4]]) && fns[tuple[4]];

							// deferred.progress(function() { bind to newDefer or newDefer.notify })
							// deferred.done(function() { bind to newDefer or newDefer.resolve })
							// deferred.fail(function() { bind to newDefer or newDefer.reject })
							deferred[tuple[1]](function () {
								var returned = fn && fn.apply(this, arguments);
								if (returned && isFunction(returned.promise)) {
									returned.promise().progress(newDefer.notify).done(newDefer.resolve).fail(newDefer.reject);
								} else {
									newDefer[tuple[0] + "With"](this, fn ? [returned] : arguments);
								}
							});
						});
						fns = null;
					}).promise();
				},
				then: function then(onFulfilled, onRejected, onProgress) {
					var maxDepth = 0;
					function resolve(depth, deferred, handler, special) {
						return function () {
							var that = this,
							    args = arguments,
							    mightThrow = function mightThrow() {
								var returned, then;

								// Support: Promises/A+ section 2.3.3.3.3
								// https://promisesaplus.com/#point-59
								// Ignore double-resolution attempts
								if (depth < maxDepth) {
									return;
								}

								returned = handler.apply(that, args);

								// Support: Promises/A+ section 2.3.1
								// https://promisesaplus.com/#point-48
								if (returned === deferred.promise()) {
									throw new TypeError("Thenable self-resolution");
								}

								// Support: Promises/A+ sections 2.3.3.1, 3.5
								// https://promisesaplus.com/#point-54
								// https://promisesaplus.com/#point-75
								// Retrieve `then` only once
								then = returned && (

								// Support: Promises/A+ section 2.3.4
								// https://promisesaplus.com/#point-64
								// Only check objects and functions for thenability
								(typeof returned === "undefined" ? "undefined" : _typeof(returned)) === "object" || typeof returned === "function") && returned.then;

								// Handle a returned thenable
								if (isFunction(then)) {

									// Special processors (notify) just wait for resolution
									if (special) {
										then.call(returned, resolve(maxDepth, deferred, Identity, special), resolve(maxDepth, deferred, Thrower, special));

										// Normal processors (resolve) also hook into progress
									} else {

										// ...and disregard older resolution values
										maxDepth++;

										then.call(returned, resolve(maxDepth, deferred, Identity, special), resolve(maxDepth, deferred, Thrower, special), resolve(maxDepth, deferred, Identity, deferred.notifyWith));
									}

									// Handle all other returned values
								} else {

									// Only substitute handlers pass on context
									// and multiple values (non-spec behavior)
									if (handler !== Identity) {
										that = undefined;
										args = [returned];
									}

									// Process the value(s)
									// Default process is resolve
									(special || deferred.resolveWith)(that, args);
								}
							},


							// Only normal processors (resolve) catch and reject exceptions
							process = special ? mightThrow : function () {
								try {
									mightThrow();
								} catch (e) {

									if (jQuery.Deferred.exceptionHook) {
										jQuery.Deferred.exceptionHook(e, process.stackTrace);
									}

									// Support: Promises/A+ section 2.3.3.3.4.1
									// https://promisesaplus.com/#point-61
									// Ignore post-resolution exceptions
									if (depth + 1 >= maxDepth) {

										// Only substitute handlers pass on context
										// and multiple values (non-spec behavior)
										if (handler !== Thrower) {
											that = undefined;
											args = [e];
										}

										deferred.rejectWith(that, args);
									}
								}
							};

							// Support: Promises/A+ section 2.3.3.3.1
							// https://promisesaplus.com/#point-57
							// Re-resolve promises immediately to dodge false rejection from
							// subsequent errors
							if (depth) {
								process();
							} else {

								// Call an optional hook to record the stack, in case of exception
								// since it's otherwise lost when execution goes async
								if (jQuery.Deferred.getStackHook) {
									process.stackTrace = jQuery.Deferred.getStackHook();
								}
								window.setTimeout(process);
							}
						};
					}

					return jQuery.Deferred(function (newDefer) {

						// progress_handlers.add( ... )
						tuples[0][3].add(resolve(0, newDefer, isFunction(onProgress) ? onProgress : Identity, newDefer.notifyWith));

						// fulfilled_handlers.add( ... )
						tuples[1][3].add(resolve(0, newDefer, isFunction(onFulfilled) ? onFulfilled : Identity));

						// rejected_handlers.add( ... )
						tuples[2][3].add(resolve(0, newDefer, isFunction(onRejected) ? onRejected : Thrower));
					}).promise();
				},

				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function promise(obj) {
					return obj != null ? jQuery.extend(obj, _promise) : _promise;
				}
			},
			    deferred = {};

			// Add list-specific methods
			jQuery.each(tuples, function (i, tuple) {
				var list = tuple[2],
				    stateString = tuple[5];

				// promise.progress = list.add
				// promise.done = list.add
				// promise.fail = list.add
				_promise[tuple[1]] = list.add;

				// Handle state
				if (stateString) {
					list.add(function () {

						// state = "resolved" (i.e., fulfilled)
						// state = "rejected"
						_state = stateString;
					},

					// rejected_callbacks.disable
					// fulfilled_callbacks.disable
					tuples[3 - i][2].disable,

					// rejected_handlers.disable
					// fulfilled_handlers.disable
					tuples[3 - i][3].disable,

					// progress_callbacks.lock
					tuples[0][2].lock,

					// progress_handlers.lock
					tuples[0][3].lock);
				}

				// progress_handlers.fire
				// fulfilled_handlers.fire
				// rejected_handlers.fire
				list.add(tuple[3].fire);

				// deferred.notify = function() { deferred.notifyWith(...) }
				// deferred.resolve = function() { deferred.resolveWith(...) }
				// deferred.reject = function() { deferred.rejectWith(...) }
				deferred[tuple[0]] = function () {
					deferred[tuple[0] + "With"](this === deferred ? undefined : this, arguments);
					return this;
				};

				// deferred.notifyWith = list.fireWith
				// deferred.resolveWith = list.fireWith
				// deferred.rejectWith = list.fireWith
				deferred[tuple[0] + "With"] = list.fireWith;
			});

			// Make the deferred a promise
			_promise.promise(deferred);

			// Call given func if any
			if (func) {
				func.call(deferred, deferred);
			}

			// All done!
			return deferred;
		},

		// Deferred helper
		when: function when(singleValue) {
			var

			// count of uncompleted subordinates
			remaining = arguments.length,


			// count of unprocessed arguments
			i = remaining,


			// subordinate fulfillment data
			resolveContexts = Array(i),
			    resolveValues = _slice.call(arguments),


			// the master Deferred
			master = jQuery.Deferred(),


			// subordinate callback factory
			updateFunc = function updateFunc(i) {
				return function (value) {
					resolveContexts[i] = this;
					resolveValues[i] = arguments.length > 1 ? _slice.call(arguments) : value;
					if (! --remaining) {
						master.resolveWith(resolveContexts, resolveValues);
					}
				};
			};

			// Single- and empty arguments are adopted like Promise.resolve
			if (remaining <= 1) {
				adoptValue(singleValue, master.done(updateFunc(i)).resolve, master.reject, !remaining);

				// Use .then() to unwrap secondary thenables (cf. gh-3000)
				if (master.state() === "pending" || isFunction(resolveValues[i] && resolveValues[i].then)) {

					return master.then();
				}
			}

			// Multiple arguments are aggregated like Promise.all array elements
			while (i--) {
				adoptValue(resolveValues[i], updateFunc(i), master.reject);
			}

			return master.promise();
		}
	});

	// These usually indicate a programmer mistake during development,
	// warn about them ASAP rather than swallowing them by default.
	var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

	jQuery.Deferred.exceptionHook = function (error, stack) {

		// Support: IE 8 - 9 only
		// Console exists when dev tools are open, which can happen at any time
		if (window.console && window.console.warn && error && rerrorNames.test(error.name)) {
			window.console.warn("jQuery.Deferred exception: " + error.message, error.stack, stack);
		}
	};

	jQuery.readyException = function (error) {
		window.setTimeout(function () {
			throw error;
		});
	};

	// The deferred used on DOM ready
	var readyList = jQuery.Deferred();

	jQuery.fn.ready = function (fn) {

		readyList.then(fn)

		// Wrap jQuery.readyException in a function so that the lookup
		// happens at the time of error handling instead of callback
		// registration.
		.catch(function (error) {
			jQuery.readyException(error);
		});

		return this;
	};

	jQuery.extend({

		// Is the DOM ready to be used? Set to true once it occurs.
		isReady: false,

		// A counter to track how many items to wait for before
		// the ready event fires. See #6781
		readyWait: 1,

		// Handle when the DOM is ready
		ready: function ready(wait) {

			// Abort if there are pending holds or we're already ready
			if (wait === true ? --jQuery.readyWait : jQuery.isReady) {
				return;
			}

			// Remember that the DOM is ready
			jQuery.isReady = true;

			// If a normal DOM Ready event fired, decrement, and wait if need be
			if (wait !== true && --jQuery.readyWait > 0) {
				return;
			}

			// If there are functions bound, to execute
			readyList.resolveWith(document, [jQuery]);
		}
	});

	jQuery.ready.then = readyList.then;

	// The ready event handler and self cleanup method
	function completed() {
		document.removeEventListener("DOMContentLoaded", completed);
		window.removeEventListener("load", completed);
		jQuery.ready();
	}

	// Catch cases where $(document).ready() is called
	// after the browser event has already occurred.
	// Support: IE <=9 - 10 only
	// Older IE sometimes signals "interactive" too soon
	if (document.readyState === "complete" || document.readyState !== "loading" && !document.documentElement.doScroll) {

		// Handle it asynchronously to allow scripts the opportunity to delay ready
		window.setTimeout(jQuery.ready);
	} else {

		// Use the handy event callback
		document.addEventListener("DOMContentLoaded", completed);

		// A fallback to window.onload, that will always work
		window.addEventListener("load", completed);
	}

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	var access = function access(elems, fn, key, value, chainable, emptyGet, raw) {
		var i = 0,
		    len = elems.length,
		    bulk = key == null;

		// Sets many values
		if (toType(key) === "object") {
			chainable = true;
			for (i in key) {
				access(elems, fn, i, key[i], true, emptyGet, raw);
			}

			// Sets one value
		} else if (value !== undefined) {
			chainable = true;

			if (!isFunction(value)) {
				raw = true;
			}

			if (bulk) {

				// Bulk operations run against the entire set
				if (raw) {
					fn.call(elems, value);
					fn = null;

					// ...except when executing function values
				} else {
					bulk = fn;
					fn = function fn(elem, key, value) {
						return bulk.call(jQuery(elem), value);
					};
				}
			}

			if (fn) {
				for (; i < len; i++) {
					fn(elems[i], key, raw ? value : value.call(elems[i], i, fn(elems[i], key)));
				}
			}
		}

		if (chainable) {
			return elems;
		}

		// Gets
		if (bulk) {
			return fn.call(elems);
		}

		return len ? fn(elems[0], key) : emptyGet;
	};

	// Matches dashed string for camelizing
	var rmsPrefix = /^-ms-/,
	    rdashAlpha = /-([a-z])/g;

	// Used by camelCase as callback to replace()
	function fcamelCase(all, letter) {
		return letter.toUpperCase();
	}

	// Convert dashed to camelCase; used by the css and data modules
	// Support: IE <=9 - 11, Edge 12 - 15
	// Microsoft forgot to hump their vendor prefix (#9572)
	function camelCase(string) {
		return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase);
	}
	var acceptData = function acceptData(owner) {

		// Accepts only:
		//  - Node
		//    - Node.ELEMENT_NODE
		//    - Node.DOCUMENT_NODE
		//  - Object
		//    - Any
		return owner.nodeType === 1 || owner.nodeType === 9 || !+owner.nodeType;
	};

	function Data() {
		this.expando = jQuery.expando + Data.uid++;
	}

	Data.uid = 1;

	Data.prototype = {

		cache: function cache(owner) {

			// Check if the owner object already has a cache
			var value = owner[this.expando];

			// If not, create one
			if (!value) {
				value = {};

				// We can accept data for non-element nodes in modern browsers,
				// but we should not, see #8335.
				// Always return an empty object.
				if (acceptData(owner)) {

					// If it is a node unlikely to be stringify-ed or looped over
					// use plain assignment
					if (owner.nodeType) {
						owner[this.expando] = value;

						// Otherwise secure it in a non-enumerable property
						// configurable must be true to allow the property to be
						// deleted when data is removed
					} else {
						Object.defineProperty(owner, this.expando, {
							value: value,
							configurable: true
						});
					}
				}
			}

			return value;
		},
		set: function set(owner, data, value) {
			var prop,
			    cache = this.cache(owner);

			// Handle: [ owner, key, value ] args
			// Always use camelCase key (gh-2257)
			if (typeof data === "string") {
				cache[camelCase(data)] = value;

				// Handle: [ owner, { properties } ] args
			} else {

				// Copy the properties one-by-one to the cache object
				for (prop in data) {
					cache[camelCase(prop)] = data[prop];
				}
			}
			return cache;
		},
		get: function get(owner, key) {
			return key === undefined ? this.cache(owner) :

			// Always use camelCase key (gh-2257)
			owner[this.expando] && owner[this.expando][camelCase(key)];
		},
		access: function access(owner, key, value) {

			// In cases where either:
			//
			//   1. No key was specified
			//   2. A string key was specified, but no value provided
			//
			// Take the "read" path and allow the get method to determine
			// which value to return, respectively either:
			//
			//   1. The entire cache object
			//   2. The data stored at the key
			//
			if (key === undefined || key && typeof key === "string" && value === undefined) {

				return this.get(owner, key);
			}

			// When the key is not a string, or both a key and value
			// are specified, set or extend (existing objects) with either:
			//
			//   1. An object of properties
			//   2. A key and value
			//
			this.set(owner, key, value);

			// Since the "set" path can have two possible entry points
			// return the expected data based on which path was taken[*]
			return value !== undefined ? value : key;
		},
		remove: function remove(owner, key) {
			var i,
			    cache = owner[this.expando];

			if (cache === undefined) {
				return;
			}

			if (key !== undefined) {

				// Support array or space separated string of keys
				if (Array.isArray(key)) {

					// If key is an array of keys...
					// We always set camelCase keys, so remove that.
					key = key.map(camelCase);
				} else {
					key = camelCase(key);

					// If a key with the spaces exists, use it.
					// Otherwise, create an array by matching non-whitespace
					key = key in cache ? [key] : key.match(rnothtmlwhite) || [];
				}

				i = key.length;

				while (i--) {
					delete cache[key[i]];
				}
			}

			// Remove the expando if there's no more data
			if (key === undefined || jQuery.isEmptyObject(cache)) {

				// Support: Chrome <=35 - 45
				// Webkit & Blink performance suffers when deleting properties
				// from DOM nodes, so set to undefined instead
				// https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
				if (owner.nodeType) {
					owner[this.expando] = undefined;
				} else {
					delete owner[this.expando];
				}
			}
		},
		hasData: function hasData(owner) {
			var cache = owner[this.expando];
			return cache !== undefined && !jQuery.isEmptyObject(cache);
		}
	};
	var dataPriv = new Data();

	var dataUser = new Data();

	//	Implementation Summary
	//
	//	1. Enforce API surface and semantic compatibility with 1.9.x branch
	//	2. Improve the module's maintainability by reducing the storage
	//		paths to a single mechanism.
	//	3. Use the same single mechanism to support "private" and "user" data.
	//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
	//	5. Avoid exposing implementation details on user objects (eg. expando properties)
	//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

	var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	    rmultiDash = /[A-Z]/g;

	function getData(data) {
		if (data === "true") {
			return true;
		}

		if (data === "false") {
			return false;
		}

		if (data === "null") {
			return null;
		}

		// Only convert to a number if it doesn't change the string
		if (data === +data + "") {
			return +data;
		}

		if (rbrace.test(data)) {
			return JSON.parse(data);
		}

		return data;
	}

	function dataAttr(elem, key, data) {
		var name;

		// If nothing was found internally, try to fetch any
		// data from the HTML5 data-* attribute
		if (data === undefined && elem.nodeType === 1) {
			name = "data-" + key.replace(rmultiDash, "-$&").toLowerCase();
			data = elem.getAttribute(name);

			if (typeof data === "string") {
				try {
					data = getData(data);
				} catch (e) {}

				// Make sure we set the data so it isn't changed later
				dataUser.set(elem, key, data);
			} else {
				data = undefined;
			}
		}
		return data;
	}

	jQuery.extend({
		hasData: function hasData(elem) {
			return dataUser.hasData(elem) || dataPriv.hasData(elem);
		},

		data: function data(elem, name, _data) {
			return dataUser.access(elem, name, _data);
		},

		removeData: function removeData(elem, name) {
			dataUser.remove(elem, name);
		},

		// TODO: Now that all calls to _data and _removeData have been replaced
		// with direct calls to dataPriv methods, these can be deprecated.
		_data: function _data(elem, name, data) {
			return dataPriv.access(elem, name, data);
		},

		_removeData: function _removeData(elem, name) {
			dataPriv.remove(elem, name);
		}
	});

	jQuery.fn.extend({
		data: function data(key, value) {
			var i,
			    name,
			    data,
			    elem = this[0],
			    attrs = elem && elem.attributes;

			// Gets all values
			if (key === undefined) {
				if (this.length) {
					data = dataUser.get(elem);

					if (elem.nodeType === 1 && !dataPriv.get(elem, "hasDataAttrs")) {
						i = attrs.length;
						while (i--) {

							// Support: IE 11 only
							// The attrs elements can be null (#14894)
							if (attrs[i]) {
								name = attrs[i].name;
								if (name.indexOf("data-") === 0) {
									name = camelCase(name.slice(5));
									dataAttr(elem, name, data[name]);
								}
							}
						}
						dataPriv.set(elem, "hasDataAttrs", true);
					}
				}

				return data;
			}

			// Sets multiple values
			if ((typeof key === "undefined" ? "undefined" : _typeof(key)) === "object") {
				return this.each(function () {
					dataUser.set(this, key);
				});
			}

			return access(this, function (value) {
				var data;

				// The calling jQuery object (element matches) is not empty
				// (and therefore has an element appears at this[ 0 ]) and the
				// `value` parameter was not undefined. An empty jQuery object
				// will result in `undefined` for elem = this[ 0 ] which will
				// throw an exception if an attempt to read a data cache is made.
				if (elem && value === undefined) {

					// Attempt to get data from the cache
					// The key will always be camelCased in Data
					data = dataUser.get(elem, key);
					if (data !== undefined) {
						return data;
					}

					// Attempt to "discover" the data in
					// HTML5 custom data-* attrs
					data = dataAttr(elem, key);
					if (data !== undefined) {
						return data;
					}

					// We tried really hard, but the data doesn't exist.
					return;
				}

				// Set the data...
				this.each(function () {

					// We always store the camelCased key
					dataUser.set(this, key, value);
				});
			}, null, value, arguments.length > 1, null, true);
		},

		removeData: function removeData(key) {
			return this.each(function () {
				dataUser.remove(this, key);
			});
		}
	});

	jQuery.extend({
		queue: function queue(elem, type, data) {
			var queue;

			if (elem) {
				type = (type || "fx") + "queue";
				queue = dataPriv.get(elem, type);

				// Speed up dequeue by getting out quickly if this is just a lookup
				if (data) {
					if (!queue || Array.isArray(data)) {
						queue = dataPriv.access(elem, type, jQuery.makeArray(data));
					} else {
						queue.push(data);
					}
				}
				return queue || [];
			}
		},

		dequeue: function dequeue(elem, type) {
			type = type || "fx";

			var queue = jQuery.queue(elem, type),
			    startLength = queue.length,
			    fn = queue.shift(),
			    hooks = jQuery._queueHooks(elem, type),
			    next = function next() {
				jQuery.dequeue(elem, type);
			};

			// If the fx queue is dequeued, always remove the progress sentinel
			if (fn === "inprogress") {
				fn = queue.shift();
				startLength--;
			}

			if (fn) {

				// Add a progress sentinel to prevent the fx queue from being
				// automatically dequeued
				if (type === "fx") {
					queue.unshift("inprogress");
				}

				// Clear up the last queue stop function
				delete hooks.stop;
				fn.call(elem, next, hooks);
			}

			if (!startLength && hooks) {
				hooks.empty.fire();
			}
		},

		// Not public - generate a queueHooks object, or return the current one
		_queueHooks: function _queueHooks(elem, type) {
			var key = type + "queueHooks";
			return dataPriv.get(elem, key) || dataPriv.access(elem, key, {
				empty: jQuery.Callbacks("once memory").add(function () {
					dataPriv.remove(elem, [type + "queue", key]);
				})
			});
		}
	});

	jQuery.fn.extend({
		queue: function queue(type, data) {
			var setter = 2;

			if (typeof type !== "string") {
				data = type;
				type = "fx";
				setter--;
			}

			if (arguments.length < setter) {
				return jQuery.queue(this[0], type);
			}

			return data === undefined ? this : this.each(function () {
				var queue = jQuery.queue(this, type, data);

				// Ensure a hooks for this queue
				jQuery._queueHooks(this, type);

				if (type === "fx" && queue[0] !== "inprogress") {
					jQuery.dequeue(this, type);
				}
			});
		},
		dequeue: function dequeue(type) {
			return this.each(function () {
				jQuery.dequeue(this, type);
			});
		},
		clearQueue: function clearQueue(type) {
			return this.queue(type || "fx", []);
		},

		// Get a promise resolved when queues of a certain type
		// are emptied (fx is the type by default)
		promise: function promise(type, obj) {
			var tmp,
			    count = 1,
			    defer = jQuery.Deferred(),
			    elements = this,
			    i = this.length,
			    resolve = function resolve() {
				if (! --count) {
					defer.resolveWith(elements, [elements]);
				}
			};

			if (typeof type !== "string") {
				obj = type;
				type = undefined;
			}
			type = type || "fx";

			while (i--) {
				tmp = dataPriv.get(elements[i], type + "queueHooks");
				if (tmp && tmp.empty) {
					count++;
					tmp.empty.add(resolve);
				}
			}
			resolve();
			return defer.promise(obj);
		}
	});
	var pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source;

	var rcssNum = new RegExp("^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i");

	var cssExpand = ["Top", "Right", "Bottom", "Left"];

	var documentElement = document.documentElement;

	var isAttached = function isAttached(elem) {
		return jQuery.contains(elem.ownerDocument, elem);
	},
	    composed = { composed: true };

	// Support: IE 9 - 11+, Edge 12 - 18+, iOS 10.0 - 10.2 only
	// Check attachment across shadow DOM boundaries when possible (gh-3504)
	// Support: iOS 10.0-10.2 only
	// Early iOS 10 versions support `attachShadow` but not `getRootNode`,
	// leading to errors. We need to check for `getRootNode`.
	if (documentElement.getRootNode) {
		isAttached = function isAttached(elem) {
			return jQuery.contains(elem.ownerDocument, elem) || elem.getRootNode(composed) === elem.ownerDocument;
		};
	}
	var isHiddenWithinTree = function isHiddenWithinTree(elem, el) {

		// isHiddenWithinTree might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;

		// Inline style trumps all
		return elem.style.display === "none" || elem.style.display === "" &&

		// Otherwise, check computed style
		// Support: Firefox <=43 - 45
		// Disconnected elements can have computed display: none, so first confirm that elem is
		// in the document.
		isAttached(elem) && jQuery.css(elem, "display") === "none";
	};

	var swap = function swap(elem, options, callback, args) {
		var ret,
		    name,
		    old = {};

		// Remember the old values, and insert the new ones
		for (name in options) {
			old[name] = elem.style[name];
			elem.style[name] = options[name];
		}

		ret = callback.apply(elem, args || []);

		// Revert the old values
		for (name in options) {
			elem.style[name] = old[name];
		}

		return ret;
	};

	function adjustCSS(elem, prop, valueParts, tween) {
		var adjusted,
		    scale,
		    maxIterations = 20,
		    currentValue = tween ? function () {
			return tween.cur();
		} : function () {
			return jQuery.css(elem, prop, "");
		},
		    initial = currentValue(),
		    unit = valueParts && valueParts[3] || (jQuery.cssNumber[prop] ? "" : "px"),


		// Starting value computation is required for potential unit mismatches
		initialInUnit = elem.nodeType && (jQuery.cssNumber[prop] || unit !== "px" && +initial) && rcssNum.exec(jQuery.css(elem, prop));

		if (initialInUnit && initialInUnit[3] !== unit) {

			// Support: Firefox <=54
			// Halve the iteration target value to prevent interference from CSS upper bounds (gh-2144)
			initial = initial / 2;

			// Trust units reported by jQuery.css
			unit = unit || initialInUnit[3];

			// Iteratively approximate from a nonzero starting point
			initialInUnit = +initial || 1;

			while (maxIterations--) {

				// Evaluate and update our best guess (doubling guesses that zero out).
				// Finish if the scale equals or crosses 1 (making the old*new product non-positive).
				jQuery.style(elem, prop, initialInUnit + unit);
				if ((1 - scale) * (1 - (scale = currentValue() / initial || 0.5)) <= 0) {
					maxIterations = 0;
				}
				initialInUnit = initialInUnit / scale;
			}

			initialInUnit = initialInUnit * 2;
			jQuery.style(elem, prop, initialInUnit + unit);

			// Make sure we update the tween properties later on
			valueParts = valueParts || [];
		}

		if (valueParts) {
			initialInUnit = +initialInUnit || +initial || 0;

			// Apply relative offset (+=/-=) if specified
			adjusted = valueParts[1] ? initialInUnit + (valueParts[1] + 1) * valueParts[2] : +valueParts[2];
			if (tween) {
				tween.unit = unit;
				tween.start = initialInUnit;
				tween.end = adjusted;
			}
		}
		return adjusted;
	}

	var defaultDisplayMap = {};

	function getDefaultDisplay(elem) {
		var temp,
		    doc = elem.ownerDocument,
		    nodeName = elem.nodeName,
		    display = defaultDisplayMap[nodeName];

		if (display) {
			return display;
		}

		temp = doc.body.appendChild(doc.createElement(nodeName));
		display = jQuery.css(temp, "display");

		temp.parentNode.removeChild(temp);

		if (display === "none") {
			display = "block";
		}
		defaultDisplayMap[nodeName] = display;

		return display;
	}

	function showHide(elements, show) {
		var display,
		    elem,
		    values = [],
		    index = 0,
		    length = elements.length;

		// Determine new display value for elements that need to change
		for (; index < length; index++) {
			elem = elements[index];
			if (!elem.style) {
				continue;
			}

			display = elem.style.display;
			if (show) {

				// Since we force visibility upon cascade-hidden elements, an immediate (and slow)
				// check is required in this first loop unless we have a nonempty display value (either
				// inline or about-to-be-restored)
				if (display === "none") {
					values[index] = dataPriv.get(elem, "display") || null;
					if (!values[index]) {
						elem.style.display = "";
					}
				}
				if (elem.style.display === "" && isHiddenWithinTree(elem)) {
					values[index] = getDefaultDisplay(elem);
				}
			} else {
				if (display !== "none") {
					values[index] = "none";

					// Remember what we're overwriting
					dataPriv.set(elem, "display", display);
				}
			}
		}

		// Set the display of the elements in a second loop to avoid constant reflow
		for (index = 0; index < length; index++) {
			if (values[index] != null) {
				elements[index].style.display = values[index];
			}
		}

		return elements;
	}

	jQuery.fn.extend({
		show: function show() {
			return showHide(this, true);
		},
		hide: function hide() {
			return showHide(this);
		},
		toggle: function toggle(state) {
			if (typeof state === "boolean") {
				return state ? this.show() : this.hide();
			}

			return this.each(function () {
				if (isHiddenWithinTree(this)) {
					jQuery(this).show();
				} else {
					jQuery(this).hide();
				}
			});
		}
	});
	var rcheckableType = /^(?:checkbox|radio)$/i;

	var rtagName = /<([a-z][^\/\0>\x20\t\r\n\f]*)/i;

	var rscriptType = /^$|^module$|\/(?:java|ecma)script/i;

	// We have to close these tags to support XHTML (#13200)
	var wrapMap = {

		// Support: IE <=9 only
		option: [1, "<select multiple='multiple'>", "</select>"],

		// XHTML parsers do not magically insert elements in the
		// same way that tag soup parsers do. So we cannot shorten
		// this by omitting <tbody> or other required elements.
		thead: [1, "<table>", "</table>"],
		col: [2, "<table><colgroup>", "</colgroup></table>"],
		tr: [2, "<table><tbody>", "</tbody></table>"],
		td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],

		_default: [0, "", ""]
	};

	// Support: IE <=9 only
	wrapMap.optgroup = wrapMap.option;

	wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
	wrapMap.th = wrapMap.td;

	function getAll(context, tag) {

		// Support: IE <=9 - 11 only
		// Use typeof to avoid zero-argument method invocation on host objects (#15151)
		var ret;

		if (typeof context.getElementsByTagName !== "undefined") {
			ret = context.getElementsByTagName(tag || "*");
		} else if (typeof context.querySelectorAll !== "undefined") {
			ret = context.querySelectorAll(tag || "*");
		} else {
			ret = [];
		}

		if (tag === undefined || tag && nodeName(context, tag)) {
			return jQuery.merge([context], ret);
		}

		return ret;
	}

	// Mark scripts as having already been evaluated
	function setGlobalEval(elems, refElements) {
		var i = 0,
		    l = elems.length;

		for (; i < l; i++) {
			dataPriv.set(elems[i], "globalEval", !refElements || dataPriv.get(refElements[i], "globalEval"));
		}
	}

	var rhtml = /<|&#?\w+;/;

	function buildFragment(elems, context, scripts, selection, ignored) {
		var elem,
		    tmp,
		    tag,
		    wrap,
		    attached,
		    j,
		    fragment = context.createDocumentFragment(),
		    nodes = [],
		    i = 0,
		    l = elems.length;

		for (; i < l; i++) {
			elem = elems[i];

			if (elem || elem === 0) {

				// Add nodes directly
				if (toType(elem) === "object") {

					// Support: Android <=4.0 only, PhantomJS 1 only
					// push.apply(_, arraylike) throws on ancient WebKit
					jQuery.merge(nodes, elem.nodeType ? [elem] : elem);

					// Convert non-html into a text node
				} else if (!rhtml.test(elem)) {
					nodes.push(context.createTextNode(elem));

					// Convert html into DOM nodes
				} else {
					tmp = tmp || fragment.appendChild(context.createElement("div"));

					// Deserialize a standard representation
					tag = (rtagName.exec(elem) || ["", ""])[1].toLowerCase();
					wrap = wrapMap[tag] || wrapMap._default;
					tmp.innerHTML = wrap[1] + jQuery.htmlPrefilter(elem) + wrap[2];

					// Descend through wrappers to the right content
					j = wrap[0];
					while (j--) {
						tmp = tmp.lastChild;
					}

					// Support: Android <=4.0 only, PhantomJS 1 only
					// push.apply(_, arraylike) throws on ancient WebKit
					jQuery.merge(nodes, tmp.childNodes);

					// Remember the top-level container
					tmp = fragment.firstChild;

					// Ensure the created nodes are orphaned (#12392)
					tmp.textContent = "";
				}
			}
		}

		// Remove wrapper from fragment
		fragment.textContent = "";

		i = 0;
		while (elem = nodes[i++]) {

			// Skip elements already in the context collection (trac-4087)
			if (selection && jQuery.inArray(elem, selection) > -1) {
				if (ignored) {
					ignored.push(elem);
				}
				continue;
			}

			attached = isAttached(elem);

			// Append to fragment
			tmp = getAll(fragment.appendChild(elem), "script");

			// Preserve script evaluation history
			if (attached) {
				setGlobalEval(tmp);
			}

			// Capture executables
			if (scripts) {
				j = 0;
				while (elem = tmp[j++]) {
					if (rscriptType.test(elem.type || "")) {
						scripts.push(elem);
					}
				}
			}
		}

		return fragment;
	}

	(function () {
		var fragment = document.createDocumentFragment(),
		    div = fragment.appendChild(document.createElement("div")),
		    input = document.createElement("input");

		// Support: Android 4.0 - 4.3 only
		// Check state lost if the name is set (#11217)
		// Support: Windows Web Apps (WWA)
		// `name` and `type` must use .setAttribute for WWA (#14901)
		input.setAttribute("type", "radio");
		input.setAttribute("checked", "checked");
		input.setAttribute("name", "t");

		div.appendChild(input);

		// Support: Android <=4.1 only
		// Older WebKit doesn't clone checked state correctly in fragments
		support.checkClone = div.cloneNode(true).cloneNode(true).lastChild.checked;

		// Support: IE <=11 only
		// Make sure textarea (and checkbox) defaultValue is properly cloned
		div.innerHTML = "<textarea>x</textarea>";
		support.noCloneChecked = !!div.cloneNode(true).lastChild.defaultValue;
	})();

	var rkeyEvent = /^key/,
	    rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
	    rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

	function returnTrue() {
		return true;
	}

	function returnFalse() {
		return false;
	}

	// Support: IE <=9 - 11+
	// focus() and blur() are asynchronous, except when they are no-op.
	// So expect focus to be synchronous when the element is already active,
	// and blur to be synchronous when the element is not already active.
	// (focus and blur are always synchronous in other supported browsers,
	// this just defines when we can count on it).
	function expectSync(elem, type) {
		return elem === safeActiveElement() === (type === "focus");
	}

	// Support: IE <=9 only
	// Accessing document.activeElement can throw unexpectedly
	// https://bugs.jquery.com/ticket/13393
	function safeActiveElement() {
		try {
			return document.activeElement;
		} catch (err) {}
	}

	function _on(elem, types, selector, data, fn, one) {
		var origFn, type;

		// Types can be a map of types/handlers
		if ((typeof types === "undefined" ? "undefined" : _typeof(types)) === "object") {

			// ( types-Object, selector, data )
			if (typeof selector !== "string") {

				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for (type in types) {
				_on(elem, type, selector, data, types[type], one);
			}
			return elem;
		}

		if (data == null && fn == null) {

			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if (fn == null) {
			if (typeof selector === "string") {

				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {

				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if (fn === false) {
			fn = returnFalse;
		} else if (!fn) {
			return elem;
		}

		if (one === 1) {
			origFn = fn;
			fn = function fn(event) {

				// Can use an empty set, since event contains the info
				jQuery().off(event);
				return origFn.apply(this, arguments);
			};

			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || (origFn.guid = jQuery.guid++);
		}
		return elem.each(function () {
			jQuery.event.add(this, types, fn, data, selector);
		});
	}

	/*
  * Helper functions for managing events -- not part of the public interface.
  * Props to Dean Edwards' addEvent library for many of the ideas.
  */
	jQuery.event = {

		global: {},

		add: function add(elem, types, handler, data, selector) {

			var handleObjIn,
			    eventHandle,
			    tmp,
			    events,
			    t,
			    handleObj,
			    special,
			    handlers,
			    type,
			    namespaces,
			    origType,
			    elemData = dataPriv.get(elem);

			// Don't attach events to noData or text/comment nodes (but allow plain objects)
			if (!elemData) {
				return;
			}

			// Caller can pass in an object of custom data in lieu of the handler
			if (handler.handler) {
				handleObjIn = handler;
				handler = handleObjIn.handler;
				selector = handleObjIn.selector;
			}

			// Ensure that invalid selectors throw exceptions at attach time
			// Evaluate against documentElement in case elem is a non-element node (e.g., document)
			if (selector) {
				jQuery.find.matchesSelector(documentElement, selector);
			}

			// Make sure that the handler has a unique ID, used to find/remove it later
			if (!handler.guid) {
				handler.guid = jQuery.guid++;
			}

			// Init the element's event structure and main handler, if this is the first
			if (!(events = elemData.events)) {
				events = elemData.events = {};
			}
			if (!(eventHandle = elemData.handle)) {
				eventHandle = elemData.handle = function (e) {

					// Discard the second event of a jQuery.event.trigger() and
					// when an event is called after a page has unloaded
					return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ? jQuery.event.dispatch.apply(elem, arguments) : undefined;
				};
			}

			// Handle multiple events separated by a space
			types = (types || "").match(rnothtmlwhite) || [""];
			t = types.length;
			while (t--) {
				tmp = rtypenamespace.exec(types[t]) || [];
				type = origType = tmp[1];
				namespaces = (tmp[2] || "").split(".").sort();

				// There *must* be a type, no attaching namespace-only handlers
				if (!type) {
					continue;
				}

				// If event changes its type, use the special event handlers for the changed type
				special = jQuery.event.special[type] || {};

				// If selector defined, determine special event api type, otherwise given type
				type = (selector ? special.delegateType : special.bindType) || type;

				// Update special based on newly reset type
				special = jQuery.event.special[type] || {};

				// handleObj is passed to all event handlers
				handleObj = jQuery.extend({
					type: type,
					origType: origType,
					data: data,
					handler: handler,
					guid: handler.guid,
					selector: selector,
					needsContext: selector && jQuery.expr.match.needsContext.test(selector),
					namespace: namespaces.join(".")
				}, handleObjIn);

				// Init the event handler queue if we're the first
				if (!(handlers = events[type])) {
					handlers = events[type] = [];
					handlers.delegateCount = 0;

					// Only use addEventListener if the special events handler returns false
					if (!special.setup || special.setup.call(elem, data, namespaces, eventHandle) === false) {

						if (elem.addEventListener) {
							elem.addEventListener(type, eventHandle);
						}
					}
				}

				if (special.add) {
					special.add.call(elem, handleObj);

					if (!handleObj.handler.guid) {
						handleObj.handler.guid = handler.guid;
					}
				}

				// Add to the element's handler list, delegates in front
				if (selector) {
					handlers.splice(handlers.delegateCount++, 0, handleObj);
				} else {
					handlers.push(handleObj);
				}

				// Keep track of which events have ever been used, for event optimization
				jQuery.event.global[type] = true;
			}
		},

		// Detach an event or set of events from an element
		remove: function remove(elem, types, handler, selector, mappedTypes) {

			var j,
			    origCount,
			    tmp,
			    events,
			    t,
			    handleObj,
			    special,
			    handlers,
			    type,
			    namespaces,
			    origType,
			    elemData = dataPriv.hasData(elem) && dataPriv.get(elem);

			if (!elemData || !(events = elemData.events)) {
				return;
			}

			// Once for each type.namespace in types; type may be omitted
			types = (types || "").match(rnothtmlwhite) || [""];
			t = types.length;
			while (t--) {
				tmp = rtypenamespace.exec(types[t]) || [];
				type = origType = tmp[1];
				namespaces = (tmp[2] || "").split(".").sort();

				// Unbind all events (on this namespace, if provided) for the element
				if (!type) {
					for (type in events) {
						jQuery.event.remove(elem, type + types[t], handler, selector, true);
					}
					continue;
				}

				special = jQuery.event.special[type] || {};
				type = (selector ? special.delegateType : special.bindType) || type;
				handlers = events[type] || [];
				tmp = tmp[2] && new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)");

				// Remove matching events
				origCount = j = handlers.length;
				while (j--) {
					handleObj = handlers[j];

					if ((mappedTypes || origType === handleObj.origType) && (!handler || handler.guid === handleObj.guid) && (!tmp || tmp.test(handleObj.namespace)) && (!selector || selector === handleObj.selector || selector === "**" && handleObj.selector)) {
						handlers.splice(j, 1);

						if (handleObj.selector) {
							handlers.delegateCount--;
						}
						if (special.remove) {
							special.remove.call(elem, handleObj);
						}
					}
				}

				// Remove generic event handler if we removed something and no more handlers exist
				// (avoids potential for endless recursion during removal of special event handlers)
				if (origCount && !handlers.length) {
					if (!special.teardown || special.teardown.call(elem, namespaces, elemData.handle) === false) {

						jQuery.removeEvent(elem, type, elemData.handle);
					}

					delete events[type];
				}
			}

			// Remove data and the expando if it's no longer used
			if (jQuery.isEmptyObject(events)) {
				dataPriv.remove(elem, "handle events");
			}
		},

		dispatch: function dispatch(nativeEvent) {

			// Make a writable jQuery.Event from the native event object
			var event = jQuery.event.fix(nativeEvent);

			var i,
			    j,
			    ret,
			    matched,
			    handleObj,
			    handlerQueue,
			    args = new Array(arguments.length),
			    handlers = (dataPriv.get(this, "events") || {})[event.type] || [],
			    special = jQuery.event.special[event.type] || {};

			// Use the fix-ed jQuery.Event rather than the (read-only) native event
			args[0] = event;

			for (i = 1; i < arguments.length; i++) {
				args[i] = arguments[i];
			}

			event.delegateTarget = this;

			// Call the preDispatch hook for the mapped type, and let it bail if desired
			if (special.preDispatch && special.preDispatch.call(this, event) === false) {
				return;
			}

			// Determine handlers
			handlerQueue = jQuery.event.handlers.call(this, event, handlers);

			// Run delegates first; they may want to stop propagation beneath us
			i = 0;
			while ((matched = handlerQueue[i++]) && !event.isPropagationStopped()) {
				event.currentTarget = matched.elem;

				j = 0;
				while ((handleObj = matched.handlers[j++]) && !event.isImmediatePropagationStopped()) {

					// If the event is namespaced, then each handler is only invoked if it is
					// specially universal or its namespaces are a superset of the event's.
					if (!event.rnamespace || handleObj.namespace === false || event.rnamespace.test(handleObj.namespace)) {

						event.handleObj = handleObj;
						event.data = handleObj.data;

						ret = ((jQuery.event.special[handleObj.origType] || {}).handle || handleObj.handler).apply(matched.elem, args);

						if (ret !== undefined) {
							if ((event.result = ret) === false) {
								event.preventDefault();
								event.stopPropagation();
							}
						}
					}
				}
			}

			// Call the postDispatch hook for the mapped type
			if (special.postDispatch) {
				special.postDispatch.call(this, event);
			}

			return event.result;
		},

		handlers: function handlers(event, _handlers) {
			var i,
			    handleObj,
			    sel,
			    matchedHandlers,
			    matchedSelectors,
			    handlerQueue = [],
			    delegateCount = _handlers.delegateCount,
			    cur = event.target;

			// Find delegate handlers
			if (delegateCount &&

			// Support: IE <=9
			// Black-hole SVG <use> instance trees (trac-13180)
			cur.nodeType &&

			// Support: Firefox <=42
			// Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
			// https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
			// Support: IE 11 only
			// ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
			!(event.type === "click" && event.button >= 1)) {

				for (; cur !== this; cur = cur.parentNode || this) {

					// Don't check non-elements (#13208)
					// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
					if (cur.nodeType === 1 && !(event.type === "click" && cur.disabled === true)) {
						matchedHandlers = [];
						matchedSelectors = {};
						for (i = 0; i < delegateCount; i++) {
							handleObj = _handlers[i];

							// Don't conflict with Object.prototype properties (#13203)
							sel = handleObj.selector + " ";

							if (matchedSelectors[sel] === undefined) {
								matchedSelectors[sel] = handleObj.needsContext ? jQuery(sel, this).index(cur) > -1 : jQuery.find(sel, this, null, [cur]).length;
							}
							if (matchedSelectors[sel]) {
								matchedHandlers.push(handleObj);
							}
						}
						if (matchedHandlers.length) {
							handlerQueue.push({ elem: cur, handlers: matchedHandlers });
						}
					}
				}
			}

			// Add the remaining (directly-bound) handlers
			cur = this;
			if (delegateCount < _handlers.length) {
				handlerQueue.push({ elem: cur, handlers: _handlers.slice(delegateCount) });
			}

			return handlerQueue;
		},

		addProp: function addProp(name, hook) {
			Object.defineProperty(jQuery.Event.prototype, name, {
				enumerable: true,
				configurable: true,

				get: isFunction(hook) ? function () {
					if (this.originalEvent) {
						return hook(this.originalEvent);
					}
				} : function () {
					if (this.originalEvent) {
						return this.originalEvent[name];
					}
				},

				set: function set(value) {
					Object.defineProperty(this, name, {
						enumerable: true,
						configurable: true,
						writable: true,
						value: value
					});
				}
			});
		},

		fix: function fix(originalEvent) {
			return originalEvent[jQuery.expando] ? originalEvent : new jQuery.Event(originalEvent);
		},

		special: {
			load: {

				// Prevent triggered image.load events from bubbling to window.load
				noBubble: true
			},
			click: {

				// Utilize native event to ensure correct state for checkable inputs
				setup: function setup(data) {

					// For mutual compressibility with _default, replace `this` access with a local var.
					// `|| data` is dead code meant only to preserve the variable through minification.
					var el = this || data;

					// Claim the first handler
					if (rcheckableType.test(el.type) && el.click && nodeName(el, "input")) {

						// dataPriv.set( el, "click", ... )
						leverageNative(el, "click", returnTrue);
					}

					// Return false to allow normal processing in the caller
					return false;
				},
				trigger: function trigger(data) {

					// For mutual compressibility with _default, replace `this` access with a local var.
					// `|| data` is dead code meant only to preserve the variable through minification.
					var el = this || data;

					// Force setup before triggering a click
					if (rcheckableType.test(el.type) && el.click && nodeName(el, "input")) {

						leverageNative(el, "click");
					}

					// Return non-false to allow normal event-path propagation
					return true;
				},

				// For cross-browser consistency, suppress native .click() on links
				// Also prevent it if we're currently inside a leveraged native-event stack
				_default: function _default(event) {
					var target = event.target;
					return rcheckableType.test(target.type) && target.click && nodeName(target, "input") && dataPriv.get(target, "click") || nodeName(target, "a");
				}
			},

			beforeunload: {
				postDispatch: function postDispatch(event) {

					// Support: Firefox 20+
					// Firefox doesn't alert if the returnValue field is not set.
					if (event.result !== undefined && event.originalEvent) {
						event.originalEvent.returnValue = event.result;
					}
				}
			}
		}
	};

	// Ensure the presence of an event listener that handles manually-triggered
	// synthetic events by interrupting progress until reinvoked in response to
	// *native* events that it fires directly, ensuring that state changes have
	// already occurred before other listeners are invoked.
	function leverageNative(el, type, expectSync) {

		// Missing expectSync indicates a trigger call, which must force setup through jQuery.event.add
		if (!expectSync) {
			if (dataPriv.get(el, type) === undefined) {
				jQuery.event.add(el, type, returnTrue);
			}
			return;
		}

		// Register the controller as a special universal handler for all event namespaces
		dataPriv.set(el, type, false);
		jQuery.event.add(el, type, {
			namespace: false,
			handler: function handler(event) {
				var notAsync,
				    result,
				    saved = dataPriv.get(this, type);

				if (event.isTrigger & 1 && this[type]) {

					// Interrupt processing of the outer synthetic .trigger()ed event
					// Saved data should be false in such cases, but might be a leftover capture object
					// from an async native handler (gh-4350)
					if (!saved.length) {

						// Store arguments for use when handling the inner native event
						// There will always be at least one argument (an event object), so this array
						// will not be confused with a leftover capture object.
						saved = _slice.call(arguments);
						dataPriv.set(this, type, saved);

						// Trigger the native event and capture its result
						// Support: IE <=9 - 11+
						// focus() and blur() are asynchronous
						notAsync = expectSync(this, type);
						this[type]();
						result = dataPriv.get(this, type);
						if (saved !== result || notAsync) {
							dataPriv.set(this, type, false);
						} else {
							result = {};
						}
						if (saved !== result) {

							// Cancel the outer synthetic event
							event.stopImmediatePropagation();
							event.preventDefault();
							return result.value;
						}

						// If this is an inner synthetic event for an event with a bubbling surrogate
						// (focus or blur), assume that the surrogate already propagated from triggering the
						// native event and prevent that from happening again here.
						// This technically gets the ordering wrong w.r.t. to `.trigger()` (in which the
						// bubbling surrogate propagates *after* the non-bubbling base), but that seems
						// less bad than duplication.
					} else if ((jQuery.event.special[type] || {}).delegateType) {
						event.stopPropagation();
					}

					// If this is a native event triggered above, everything is now in order
					// Fire an inner synthetic event with the original arguments
				} else if (saved.length) {

					// ...and capture the result
					dataPriv.set(this, type, {
						value: jQuery.event.trigger(

						// Support: IE <=9 - 11+
						// Extend with the prototype to reset the above stopImmediatePropagation()
						jQuery.extend(saved[0], jQuery.Event.prototype), saved.slice(1), this)
					});

					// Abort handling of the native event
					event.stopImmediatePropagation();
				}
			}
		});
	}

	jQuery.removeEvent = function (elem, type, handle) {

		// This "if" is needed for plain objects
		if (elem.removeEventListener) {
			elem.removeEventListener(type, handle);
		}
	};

	jQuery.Event = function (src, props) {

		// Allow instantiation without the 'new' keyword
		if (!(this instanceof jQuery.Event)) {
			return new jQuery.Event(src, props);
		}

		// Event object
		if (src && src.type) {
			this.originalEvent = src;
			this.type = src.type;

			// Events bubbling up the document may have been marked as prevented
			// by a handler lower down the tree; reflect the correct value.
			this.isDefaultPrevented = src.defaultPrevented || src.defaultPrevented === undefined &&

			// Support: Android <=2.3 only
			src.returnValue === false ? returnTrue : returnFalse;

			// Create target properties
			// Support: Safari <=6 - 7 only
			// Target should not be a text node (#504, #13143)
			this.target = src.target && src.target.nodeType === 3 ? src.target.parentNode : src.target;

			this.currentTarget = src.currentTarget;
			this.relatedTarget = src.relatedTarget;

			// Event type
		} else {
			this.type = src;
		}

		// Put explicitly provided properties onto the event object
		if (props) {
			jQuery.extend(this, props);
		}

		// Create a timestamp if incoming event doesn't have one
		this.timeStamp = src && src.timeStamp || Date.now();

		// Mark it as fixed
		this[jQuery.expando] = true;
	};

	// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
	// https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
	jQuery.Event.prototype = {
		constructor: jQuery.Event,
		isDefaultPrevented: returnFalse,
		isPropagationStopped: returnFalse,
		isImmediatePropagationStopped: returnFalse,
		isSimulated: false,

		preventDefault: function preventDefault() {
			var e = this.originalEvent;

			this.isDefaultPrevented = returnTrue;

			if (e && !this.isSimulated) {
				e.preventDefault();
			}
		},
		stopPropagation: function stopPropagation() {
			var e = this.originalEvent;

			this.isPropagationStopped = returnTrue;

			if (e && !this.isSimulated) {
				e.stopPropagation();
			}
		},
		stopImmediatePropagation: function stopImmediatePropagation() {
			var e = this.originalEvent;

			this.isImmediatePropagationStopped = returnTrue;

			if (e && !this.isSimulated) {
				e.stopImmediatePropagation();
			}

			this.stopPropagation();
		}
	};

	// Includes all common event props including KeyEvent and MouseEvent specific props
	jQuery.each({
		altKey: true,
		bubbles: true,
		cancelable: true,
		changedTouches: true,
		ctrlKey: true,
		detail: true,
		eventPhase: true,
		metaKey: true,
		pageX: true,
		pageY: true,
		shiftKey: true,
		view: true,
		"char": true,
		code: true,
		charCode: true,
		key: true,
		keyCode: true,
		button: true,
		buttons: true,
		clientX: true,
		clientY: true,
		offsetX: true,
		offsetY: true,
		pointerId: true,
		pointerType: true,
		screenX: true,
		screenY: true,
		targetTouches: true,
		toElement: true,
		touches: true,

		which: function which(event) {
			var button = event.button;

			// Add which for key events
			if (event.which == null && rkeyEvent.test(event.type)) {
				return event.charCode != null ? event.charCode : event.keyCode;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			if (!event.which && button !== undefined && rmouseEvent.test(event.type)) {
				if (button & 1) {
					return 1;
				}

				if (button & 2) {
					return 3;
				}

				if (button & 4) {
					return 2;
				}

				return 0;
			}

			return event.which;
		}
	}, jQuery.event.addProp);

	jQuery.each({ focus: "focusin", blur: "focusout" }, function (type, delegateType) {
		jQuery.event.special[type] = {

			// Utilize native event if possible so blur/focus sequence is correct
			setup: function setup() {

				// Claim the first handler
				// dataPriv.set( this, "focus", ... )
				// dataPriv.set( this, "blur", ... )
				leverageNative(this, type, expectSync);

				// Return false to allow normal processing in the caller
				return false;
			},
			trigger: function trigger() {

				// Force setup before trigger
				leverageNative(this, type);

				// Return non-false to allow normal event-path propagation
				return true;
			},

			delegateType: delegateType
		};
	});

	// Create mouseenter/leave events using mouseover/out and event-time checks
	// so that event delegation works in jQuery.
	// Do the same for pointerenter/pointerleave and pointerover/pointerout
	//
	// Support: Safari 7 only
	// Safari sends mouseenter too often; see:
	// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
	// for the description of the bug (it existed in older Chrome versions as well).
	jQuery.each({
		mouseenter: "mouseover",
		mouseleave: "mouseout",
		pointerenter: "pointerover",
		pointerleave: "pointerout"
	}, function (orig, fix) {
		jQuery.event.special[orig] = {
			delegateType: fix,
			bindType: fix,

			handle: function handle(event) {
				var ret,
				    target = this,
				    related = event.relatedTarget,
				    handleObj = event.handleObj;

				// For mouseenter/leave call the handler if related is outside the target.
				// NB: No relatedTarget if the mouse left/entered the browser window
				if (!related || related !== target && !jQuery.contains(target, related)) {
					event.type = handleObj.origType;
					ret = handleObj.handler.apply(this, arguments);
					event.type = fix;
				}
				return ret;
			}
		};
	});

	jQuery.fn.extend({

		on: function on(types, selector, data, fn) {
			return _on(this, types, selector, data, fn);
		},
		one: function one(types, selector, data, fn) {
			return _on(this, types, selector, data, fn, 1);
		},
		off: function off(types, selector, fn) {
			var handleObj, type;
			if (types && types.preventDefault && types.handleObj) {

				// ( event )  dispatched jQuery.Event
				handleObj = types.handleObj;
				jQuery(types.delegateTarget).off(handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType, handleObj.selector, handleObj.handler);
				return this;
			}
			if ((typeof types === "undefined" ? "undefined" : _typeof(types)) === "object") {

				// ( types-object [, selector] )
				for (type in types) {
					this.off(type, selector, types[type]);
				}
				return this;
			}
			if (selector === false || typeof selector === "function") {

				// ( types [, fn] )
				fn = selector;
				selector = undefined;
			}
			if (fn === false) {
				fn = returnFalse;
			}
			return this.each(function () {
				jQuery.event.remove(this, types, fn, selector);
			});
		}
	});

	var

	/* eslint-disable max-len */

	// See https://github.com/eslint/eslint/issues/3229
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,


	/* eslint-enable */

	// Support: IE <=10 - 11, Edge 12 - 13 only
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml = /<script|<style|<link/i,


	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	    rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

	// Prefer a tbody over its parent table for containing new rows
	function manipulationTarget(elem, content) {
		if (nodeName(elem, "table") && nodeName(content.nodeType !== 11 ? content : content.firstChild, "tr")) {

			return jQuery(elem).children("tbody")[0] || elem;
		}

		return elem;
	}

	// Replace/restore the type attribute of script elements for safe DOM manipulation
	function disableScript(elem) {
		elem.type = (elem.getAttribute("type") !== null) + "/" + elem.type;
		return elem;
	}
	function restoreScript(elem) {
		if ((elem.type || "").slice(0, 5) === "true/") {
			elem.type = elem.type.slice(5);
		} else {
			elem.removeAttribute("type");
		}

		return elem;
	}

	function cloneCopyEvent(src, dest) {
		var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

		if (dest.nodeType !== 1) {
			return;
		}

		// 1. Copy private data: events, handlers, etc.
		if (dataPriv.hasData(src)) {
			pdataOld = dataPriv.access(src);
			pdataCur = dataPriv.set(dest, pdataOld);
			events = pdataOld.events;

			if (events) {
				delete pdataCur.handle;
				pdataCur.events = {};

				for (type in events) {
					for (i = 0, l = events[type].length; i < l; i++) {
						jQuery.event.add(dest, type, events[type][i]);
					}
				}
			}
		}

		// 2. Copy user data
		if (dataUser.hasData(src)) {
			udataOld = dataUser.access(src);
			udataCur = jQuery.extend({}, udataOld);

			dataUser.set(dest, udataCur);
		}
	}

	// Fix IE bugs, see support tests
	function fixInput(src, dest) {
		var nodeName = dest.nodeName.toLowerCase();

		// Fails to persist the checked state of a cloned checkbox or radio button.
		if (nodeName === "input" && rcheckableType.test(src.type)) {
			dest.checked = src.checked;

			// Fails to return the selected option to the default selected state when cloning options
		} else if (nodeName === "input" || nodeName === "textarea") {
			dest.defaultValue = src.defaultValue;
		}
	}

	function domManip(collection, args, callback, ignored) {

		// Flatten any nested arrays
		args = concat.apply([], args);

		var fragment,
		    first,
		    scripts,
		    hasScripts,
		    node,
		    doc,
		    i = 0,
		    l = collection.length,
		    iNoClone = l - 1,
		    value = args[0],
		    valueIsFunction = isFunction(value);

		// We can't cloneNode fragments that contain checked, in WebKit
		if (valueIsFunction || l > 1 && typeof value === "string" && !support.checkClone && rchecked.test(value)) {
			return collection.each(function (index) {
				var self = collection.eq(index);
				if (valueIsFunction) {
					args[0] = value.call(this, index, self.html());
				}
				domManip(self, args, callback, ignored);
			});
		}

		if (l) {
			fragment = buildFragment(args, collection[0].ownerDocument, false, collection, ignored);
			first = fragment.firstChild;

			if (fragment.childNodes.length === 1) {
				fragment = first;
			}

			// Require either new content or an interest in ignored elements to invoke the callback
			if (first || ignored) {
				scripts = jQuery.map(getAll(fragment, "script"), disableScript);
				hasScripts = scripts.length;

				// Use the original fragment for the last item
				// instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for (; i < l; i++) {
					node = fragment;

					if (i !== iNoClone) {
						node = jQuery.clone(node, true, true);

						// Keep references to cloned scripts for later restoration
						if (hasScripts) {

							// Support: Android <=4.0 only, PhantomJS 1 only
							// push.apply(_, arraylike) throws on ancient WebKit
							jQuery.merge(scripts, getAll(node, "script"));
						}
					}

					callback.call(collection[i], node, i);
				}

				if (hasScripts) {
					doc = scripts[scripts.length - 1].ownerDocument;

					// Reenable scripts
					jQuery.map(scripts, restoreScript);

					// Evaluate executable scripts on first document insertion
					for (i = 0; i < hasScripts; i++) {
						node = scripts[i];
						if (rscriptType.test(node.type || "") && !dataPriv.access(node, "globalEval") && jQuery.contains(doc, node)) {

							if (node.src && (node.type || "").toLowerCase() !== "module") {

								// Optional AJAX dependency, but won't run scripts if not present
								if (jQuery._evalUrl && !node.noModule) {
									jQuery._evalUrl(node.src, {
										nonce: node.nonce || node.getAttribute("nonce")
									});
								}
							} else {
								DOMEval(node.textContent.replace(rcleanScript, ""), node, doc);
							}
						}
					}
				}
			}
		}

		return collection;
	}

	function _remove(elem, selector, keepData) {
		var node,
		    nodes = selector ? jQuery.filter(selector, elem) : elem,
		    i = 0;

		for (; (node = nodes[i]) != null; i++) {
			if (!keepData && node.nodeType === 1) {
				jQuery.cleanData(getAll(node));
			}

			if (node.parentNode) {
				if (keepData && isAttached(node)) {
					setGlobalEval(getAll(node, "script"));
				}
				node.parentNode.removeChild(node);
			}
		}

		return elem;
	}

	jQuery.extend({
		htmlPrefilter: function htmlPrefilter(html) {
			return html.replace(rxhtmlTag, "<$1></$2>");
		},

		clone: function clone(elem, dataAndEvents, deepDataAndEvents) {
			var i,
			    l,
			    srcElements,
			    destElements,
			    clone = elem.cloneNode(true),
			    inPage = isAttached(elem);

			// Fix IE cloning issues
			if (!support.noCloneChecked && (elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem)) {

				// We eschew Sizzle here for performance reasons: https://jsperf.com/getall-vs-sizzle/2
				destElements = getAll(clone);
				srcElements = getAll(elem);

				for (i = 0, l = srcElements.length; i < l; i++) {
					fixInput(srcElements[i], destElements[i]);
				}
			}

			// Copy the events from the original to the clone
			if (dataAndEvents) {
				if (deepDataAndEvents) {
					srcElements = srcElements || getAll(elem);
					destElements = destElements || getAll(clone);

					for (i = 0, l = srcElements.length; i < l; i++) {
						cloneCopyEvent(srcElements[i], destElements[i]);
					}
				} else {
					cloneCopyEvent(elem, clone);
				}
			}

			// Preserve script evaluation history
			destElements = getAll(clone, "script");
			if (destElements.length > 0) {
				setGlobalEval(destElements, !inPage && getAll(elem, "script"));
			}

			// Return the cloned set
			return clone;
		},

		cleanData: function cleanData(elems) {
			var data,
			    elem,
			    type,
			    special = jQuery.event.special,
			    i = 0;

			for (; (elem = elems[i]) !== undefined; i++) {
				if (acceptData(elem)) {
					if (data = elem[dataPriv.expando]) {
						if (data.events) {
							for (type in data.events) {
								if (special[type]) {
									jQuery.event.remove(elem, type);

									// This is a shortcut to avoid jQuery.event.remove's overhead
								} else {
									jQuery.removeEvent(elem, type, data.handle);
								}
							}
						}

						// Support: Chrome <=35 - 45+
						// Assign undefined instead of using delete, see Data#remove
						elem[dataPriv.expando] = undefined;
					}
					if (elem[dataUser.expando]) {

						// Support: Chrome <=35 - 45+
						// Assign undefined instead of using delete, see Data#remove
						elem[dataUser.expando] = undefined;
					}
				}
			}
		}
	});

	jQuery.fn.extend({
		detach: function detach(selector) {
			return _remove(this, selector, true);
		},

		remove: function remove(selector) {
			return _remove(this, selector);
		},

		text: function text(value) {
			return access(this, function (value) {
				return value === undefined ? jQuery.text(this) : this.empty().each(function () {
					if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
						this.textContent = value;
					}
				});
			}, null, value, arguments.length);
		},

		append: function append() {
			return domManip(this, arguments, function (elem) {
				if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
					var target = manipulationTarget(this, elem);
					target.appendChild(elem);
				}
			});
		},

		prepend: function prepend() {
			return domManip(this, arguments, function (elem) {
				if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
					var target = manipulationTarget(this, elem);
					target.insertBefore(elem, target.firstChild);
				}
			});
		},

		before: function before() {
			return domManip(this, arguments, function (elem) {
				if (this.parentNode) {
					this.parentNode.insertBefore(elem, this);
				}
			});
		},

		after: function after() {
			return domManip(this, arguments, function (elem) {
				if (this.parentNode) {
					this.parentNode.insertBefore(elem, this.nextSibling);
				}
			});
		},

		empty: function empty() {
			var elem,
			    i = 0;

			for (; (elem = this[i]) != null; i++) {
				if (elem.nodeType === 1) {

					// Prevent memory leaks
					jQuery.cleanData(getAll(elem, false));

					// Remove any remaining nodes
					elem.textContent = "";
				}
			}

			return this;
		},

		clone: function clone(dataAndEvents, deepDataAndEvents) {
			dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
			deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

			return this.map(function () {
				return jQuery.clone(this, dataAndEvents, deepDataAndEvents);
			});
		},

		html: function html(value) {
			return access(this, function (value) {
				var elem = this[0] || {},
				    i = 0,
				    l = this.length;

				if (value === undefined && elem.nodeType === 1) {
					return elem.innerHTML;
				}

				// See if we can take a shortcut and just use innerHTML
				if (typeof value === "string" && !rnoInnerhtml.test(value) && !wrapMap[(rtagName.exec(value) || ["", ""])[1].toLowerCase()]) {

					value = jQuery.htmlPrefilter(value);

					try {
						for (; i < l; i++) {
							elem = this[i] || {};

							// Remove element nodes and prevent memory leaks
							if (elem.nodeType === 1) {
								jQuery.cleanData(getAll(elem, false));
								elem.innerHTML = value;
							}
						}

						elem = 0;

						// If using innerHTML throws an exception, use the fallback method
					} catch (e) {}
				}

				if (elem) {
					this.empty().append(value);
				}
			}, null, value, arguments.length);
		},

		replaceWith: function replaceWith() {
			var ignored = [];

			// Make the changes, replacing each non-ignored context element with the new content
			return domManip(this, arguments, function (elem) {
				var parent = this.parentNode;

				if (jQuery.inArray(this, ignored) < 0) {
					jQuery.cleanData(getAll(this));
					if (parent) {
						parent.replaceChild(elem, this);
					}
				}

				// Force callback invocation
			}, ignored);
		}
	});

	jQuery.each({
		appendTo: "append",
		prependTo: "prepend",
		insertBefore: "before",
		insertAfter: "after",
		replaceAll: "replaceWith"
	}, function (name, original) {
		jQuery.fn[name] = function (selector) {
			var elems,
			    ret = [],
			    insert = jQuery(selector),
			    last = insert.length - 1,
			    i = 0;

			for (; i <= last; i++) {
				elems = i === last ? this : this.clone(true);
				jQuery(insert[i])[original](elems);

				// Support: Android <=4.0 only, PhantomJS 1 only
				// .get() because push.apply(_, arraylike) throws on ancient WebKit
				push.apply(ret, elems.get());
			}

			return this.pushStack(ret);
		};
	});
	var rnumnonpx = new RegExp("^(" + pnum + ")(?!px)[a-z%]+$", "i");

	var getStyles = function getStyles(elem) {

		// Support: IE <=11 only, Firefox <=30 (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if (!view || !view.opener) {
			view = window;
		}

		return view.getComputedStyle(elem);
	};

	var rboxStyle = new RegExp(cssExpand.join("|"), "i");

	(function () {

		// Executing both pixelPosition & boxSizingReliable tests require only one layout
		// so they're executed at the same time to save the second computation.
		function computeStyleTests() {

			// This is a singleton, we need to execute it only once
			if (!div) {
				return;
			}

			container.style.cssText = "position:absolute;left:-11111px;width:60px;" + "margin-top:1px;padding:0;border:0";
			div.style.cssText = "position:relative;display:block;box-sizing:border-box;overflow:scroll;" + "margin:auto;border:1px;padding:1px;" + "width:60%;top:1%";
			documentElement.appendChild(container).appendChild(div);

			var divStyle = window.getComputedStyle(div);
			pixelPositionVal = divStyle.top !== "1%";

			// Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
			reliableMarginLeftVal = roundPixelMeasures(divStyle.marginLeft) === 12;

			// Support: Android 4.0 - 4.3 only, Safari <=9.1 - 10.1, iOS <=7.0 - 9.3
			// Some styles come back with percentage values, even though they shouldn't
			div.style.right = "60%";
			pixelBoxStylesVal = roundPixelMeasures(divStyle.right) === 36;

			// Support: IE 9 - 11 only
			// Detect misreporting of content dimensions for box-sizing:border-box elements
			boxSizingReliableVal = roundPixelMeasures(divStyle.width) === 36;

			// Support: IE 9 only
			// Detect overflow:scroll screwiness (gh-3699)
			// Support: Chrome <=64
			// Don't get tricked when zoom affects offsetWidth (gh-4029)
			div.style.position = "absolute";
			scrollboxSizeVal = roundPixelMeasures(div.offsetWidth / 3) === 12;

			documentElement.removeChild(container);

			// Nullify the div so it wouldn't be stored in the memory and
			// it will also be a sign that checks already performed
			div = null;
		}

		function roundPixelMeasures(measure) {
			return Math.round(parseFloat(measure));
		}

		var pixelPositionVal,
		    boxSizingReliableVal,
		    scrollboxSizeVal,
		    pixelBoxStylesVal,
		    reliableMarginLeftVal,
		    container = document.createElement("div"),
		    div = document.createElement("div");

		// Finish early in limited (non-browser) environments
		if (!div.style) {
			return;
		}

		// Support: IE <=9 - 11 only
		// Style of cloned element affects source element cloned (#8908)
		div.style.backgroundClip = "content-box";
		div.cloneNode(true).style.backgroundClip = "";
		support.clearCloneStyle = div.style.backgroundClip === "content-box";

		jQuery.extend(support, {
			boxSizingReliable: function boxSizingReliable() {
				computeStyleTests();
				return boxSizingReliableVal;
			},
			pixelBoxStyles: function pixelBoxStyles() {
				computeStyleTests();
				return pixelBoxStylesVal;
			},
			pixelPosition: function pixelPosition() {
				computeStyleTests();
				return pixelPositionVal;
			},
			reliableMarginLeft: function reliableMarginLeft() {
				computeStyleTests();
				return reliableMarginLeftVal;
			},
			scrollboxSize: function scrollboxSize() {
				computeStyleTests();
				return scrollboxSizeVal;
			}
		});
	})();

	function curCSS(elem, name, computed) {
		var width,
		    minWidth,
		    maxWidth,
		    ret,


		// Support: Firefox 51+
		// Retrieving style before computed somehow
		// fixes an issue with getting wrong values
		// on detached elements
		style = elem.style;

		computed = computed || getStyles(elem);

		// getPropertyValue is needed for:
		//   .css('filter') (IE 9 only, #12537)
		//   .css('--customProperty) (#3144)
		if (computed) {
			ret = computed.getPropertyValue(name) || computed[name];

			if (ret === "" && !isAttached(elem)) {
				ret = jQuery.style(elem, name);
			}

			// A tribute to the "awesome hack by Dean Edwards"
			// Android Browser returns percentage for some values,
			// but width seems to be reliably pixels.
			// This is against the CSSOM draft spec:
			// https://drafts.csswg.org/cssom/#resolved-values
			if (!support.pixelBoxStyles() && rnumnonpx.test(ret) && rboxStyle.test(name)) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		return ret !== undefined ?

		// Support: IE <=9 - 11 only
		// IE returns zIndex value as an integer.
		ret + "" : ret;
	}

	function addGetHookIf(conditionFn, hookFn) {

		// Define the hook, we'll check on the first run if it's really needed.
		return {
			get: function get() {
				if (conditionFn()) {

					// Hook not needed (or it's not possible to use it due
					// to missing dependency), remove it.
					delete this.get;
					return;
				}

				// Hook needed; redefine it so that the support test is not executed again.
				return (this.get = hookFn).apply(this, arguments);
			}
		};
	}

	var cssPrefixes = ["Webkit", "Moz", "ms"],
	    emptyStyle = document.createElement("div").style,
	    vendorProps = {};

	// Return a vendor-prefixed property or undefined
	function vendorPropName(name) {

		// Check for vendor prefixed names
		var capName = name[0].toUpperCase() + name.slice(1),
		    i = cssPrefixes.length;

		while (i--) {
			name = cssPrefixes[i] + capName;
			if (name in emptyStyle) {
				return name;
			}
		}
	}

	// Return a potentially-mapped jQuery.cssProps or vendor prefixed property
	function finalPropName(name) {
		var final = jQuery.cssProps[name] || vendorProps[name];

		if (final) {
			return final;
		}
		if (name in emptyStyle) {
			return name;
		}
		return vendorProps[name] = vendorPropName(name) || name;
	}

	var

	// Swappable if display is none or starts with table
	// except "table", "table-cell", or "table-caption"
	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	    rcustomProp = /^--/,
	    cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	    cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	};

	function setPositiveNumber(elem, value, subtract) {

		// Any relative (+/-) values have already been
		// normalized at this point
		var matches = rcssNum.exec(value);
		return matches ?

		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max(0, matches[2] - (subtract || 0)) + (matches[3] || "px") : value;
	}

	function boxModelAdjustment(elem, dimension, box, isBorderBox, styles, computedVal) {
		var i = dimension === "width" ? 1 : 0,
		    extra = 0,
		    delta = 0;

		// Adjustment may not be necessary
		if (box === (isBorderBox ? "border" : "content")) {
			return 0;
		}

		for (; i < 4; i += 2) {

			// Both box models exclude margin
			if (box === "margin") {
				delta += jQuery.css(elem, box + cssExpand[i], true, styles);
			}

			// If we get here with a content-box, we're seeking "padding" or "border" or "margin"
			if (!isBorderBox) {

				// Add padding
				delta += jQuery.css(elem, "padding" + cssExpand[i], true, styles);

				// For "border" or "margin", add border
				if (box !== "padding") {
					delta += jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);

					// But still keep track of it otherwise
				} else {
					extra += jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
				}

				// If we get here with a border-box (content + padding + border), we're seeking "content" or
				// "padding" or "margin"
			} else {

				// For "content", subtract padding
				if (box === "content") {
					delta -= jQuery.css(elem, "padding" + cssExpand[i], true, styles);
				}

				// For "content" or "padding", subtract border
				if (box !== "margin") {
					delta -= jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
				}
			}
		}

		// Account for positive content-box scroll gutter when requested by providing computedVal
		if (!isBorderBox && computedVal >= 0) {

			// offsetWidth/offsetHeight is a rounded sum of content, padding, scroll gutter, and border
			// Assuming integer scroll gutter, subtract the rest and round down
			delta += Math.max(0, Math.ceil(elem["offset" + dimension[0].toUpperCase() + dimension.slice(1)] - computedVal - delta - extra - 0.5

			// If offsetWidth/offsetHeight is unknown, then we can't determine content-box scroll gutter
			// Use an explicit zero to avoid NaN (gh-3964)
			)) || 0;
		}

		return delta;
	}

	function getWidthOrHeight(elem, dimension, extra) {

		// Start with computed style
		var styles = getStyles(elem),


		// To avoid forcing a reflow, only fetch boxSizing if we need it (gh-4322).
		// Fake content-box until we know it's needed to know the true value.
		boxSizingNeeded = !support.boxSizingReliable() || extra,
		    isBorderBox = boxSizingNeeded && jQuery.css(elem, "boxSizing", false, styles) === "border-box",
		    valueIsBorderBox = isBorderBox,
		    val = curCSS(elem, dimension, styles),
		    offsetProp = "offset" + dimension[0].toUpperCase() + dimension.slice(1);

		// Support: Firefox <=54
		// Return a confounding non-pixel value or feign ignorance, as appropriate.
		if (rnumnonpx.test(val)) {
			if (!extra) {
				return val;
			}
			val = "auto";
		}

		// Fall back to offsetWidth/offsetHeight when value is "auto"
		// This happens for inline elements with no explicit setting (gh-3571)
		// Support: Android <=4.1 - 4.3 only
		// Also use offsetWidth/offsetHeight for misreported inline dimensions (gh-3602)
		// Support: IE 9-11 only
		// Also use offsetWidth/offsetHeight for when box sizing is unreliable
		// We use getClientRects() to check for hidden/disconnected.
		// In those cases, the computed value can be trusted to be border-box
		if ((!support.boxSizingReliable() && isBorderBox || val === "auto" || !parseFloat(val) && jQuery.css(elem, "display", false, styles) === "inline") && elem.getClientRects().length) {

			isBorderBox = jQuery.css(elem, "boxSizing", false, styles) === "border-box";

			// Where available, offsetWidth/offsetHeight approximate border box dimensions.
			// Where not available (e.g., SVG), assume unreliable box-sizing and interpret the
			// retrieved value as a content box dimension.
			valueIsBorderBox = offsetProp in elem;
			if (valueIsBorderBox) {
				val = elem[offsetProp];
			}
		}

		// Normalize "" and auto
		val = parseFloat(val) || 0;

		// Adjust for the element's box model
		return val + boxModelAdjustment(elem, dimension, extra || (isBorderBox ? "border" : "content"), valueIsBorderBox, styles,

		// Provide the current computed size to request scroll gutter calculation (gh-3589)
		val) + "px";
	}

	jQuery.extend({

		// Add in style property hooks for overriding the default
		// behavior of getting and setting a style property
		cssHooks: {
			opacity: {
				get: function get(elem, computed) {
					if (computed) {

						// We should always get a number back from opacity
						var ret = curCSS(elem, "opacity");
						return ret === "" ? "1" : ret;
					}
				}
			}
		},

		// Don't automatically add "px" to these possibly-unitless properties
		cssNumber: {
			"animationIterationCount": true,
			"columnCount": true,
			"fillOpacity": true,
			"flexGrow": true,
			"flexShrink": true,
			"fontWeight": true,
			"gridArea": true,
			"gridColumn": true,
			"gridColumnEnd": true,
			"gridColumnStart": true,
			"gridRow": true,
			"gridRowEnd": true,
			"gridRowStart": true,
			"lineHeight": true,
			"opacity": true,
			"order": true,
			"orphans": true,
			"widows": true,
			"zIndex": true,
			"zoom": true
		},

		// Add in properties whose names you wish to fix before
		// setting or getting the value
		cssProps: {},

		// Get and set the style property on a DOM Node
		style: function style(elem, name, value, extra) {

			// Don't set styles on text and comment nodes
			if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) {
				return;
			}

			// Make sure that we're working with the right name
			var ret,
			    type,
			    hooks,
			    origName = camelCase(name),
			    isCustomProp = rcustomProp.test(name),
			    style = elem.style;

			// Make sure that we're working with the right name. We don't
			// want to query the value if it is a CSS custom property
			// since they are user-defined.
			if (!isCustomProp) {
				name = finalPropName(origName);
			}

			// Gets hook for the prefixed version, then unprefixed version
			hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];

			// Check if we're setting a value
			if (value !== undefined) {
				type = typeof value === "undefined" ? "undefined" : _typeof(value);

				// Convert "+=" or "-=" to relative numbers (#7345)
				if (type === "string" && (ret = rcssNum.exec(value)) && ret[1]) {
					value = adjustCSS(elem, name, ret);

					// Fixes bug #9237
					type = "number";
				}

				// Make sure that null and NaN values aren't set (#7116)
				if (value == null || value !== value) {
					return;
				}

				// If a number was passed in, add the unit (except for certain CSS properties)
				// The isCustomProp check can be removed in jQuery 4.0 when we only auto-append
				// "px" to a few hardcoded values.
				if (type === "number" && !isCustomProp) {
					value += ret && ret[3] || (jQuery.cssNumber[origName] ? "" : "px");
				}

				// background-* props affect original clone's values
				if (!support.clearCloneStyle && value === "" && name.indexOf("background") === 0) {
					style[name] = "inherit";
				}

				// If a hook was provided, use that value, otherwise just set the specified value
				if (!hooks || !("set" in hooks) || (value = hooks.set(elem, value, extra)) !== undefined) {

					if (isCustomProp) {
						style.setProperty(name, value);
					} else {
						style[name] = value;
					}
				}
			} else {

				// If a hook was provided get the non-computed value from there
				if (hooks && "get" in hooks && (ret = hooks.get(elem, false, extra)) !== undefined) {

					return ret;
				}

				// Otherwise just get the value from the style object
				return style[name];
			}
		},

		css: function css(elem, name, extra, styles) {
			var val,
			    num,
			    hooks,
			    origName = camelCase(name),
			    isCustomProp = rcustomProp.test(name);

			// Make sure that we're working with the right name. We don't
			// want to modify the value if it is a CSS custom property
			// since they are user-defined.
			if (!isCustomProp) {
				name = finalPropName(origName);
			}

			// Try prefixed name followed by the unprefixed name
			hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];

			// If a hook was provided get the computed value from there
			if (hooks && "get" in hooks) {
				val = hooks.get(elem, true, extra);
			}

			// Otherwise, if a way to get the computed value exists, use that
			if (val === undefined) {
				val = curCSS(elem, name, styles);
			}

			// Convert "normal" to computed value
			if (val === "normal" && name in cssNormalTransform) {
				val = cssNormalTransform[name];
			}

			// Make numeric if forced or a qualifier was provided and val looks numeric
			if (extra === "" || extra) {
				num = parseFloat(val);
				return extra === true || isFinite(num) ? num || 0 : val;
			}

			return val;
		}
	});

	jQuery.each(["height", "width"], function (i, dimension) {
		jQuery.cssHooks[dimension] = {
			get: function get(elem, computed, extra) {
				if (computed) {

					// Certain elements can have dimension info if we invisibly show them
					// but it must have a current display style that would benefit
					return rdisplayswap.test(jQuery.css(elem, "display")) && (

					// Support: Safari 8+
					// Table columns in Safari have non-zero offsetWidth & zero
					// getBoundingClientRect().width unless display is changed.
					// Support: IE <=11 only
					// Running getBoundingClientRect on a disconnected node
					// in IE throws an error.
					!elem.getClientRects().length || !elem.getBoundingClientRect().width) ? swap(elem, cssShow, function () {
						return getWidthOrHeight(elem, dimension, extra);
					}) : getWidthOrHeight(elem, dimension, extra);
				}
			},

			set: function set(elem, value, extra) {
				var matches,
				    styles = getStyles(elem),


				// Only read styles.position if the test has a chance to fail
				// to avoid forcing a reflow.
				scrollboxSizeBuggy = !support.scrollboxSize() && styles.position === "absolute",


				// To avoid forcing a reflow, only fetch boxSizing if we need it (gh-3991)
				boxSizingNeeded = scrollboxSizeBuggy || extra,
				    isBorderBox = boxSizingNeeded && jQuery.css(elem, "boxSizing", false, styles) === "border-box",
				    subtract = extra ? boxModelAdjustment(elem, dimension, extra, isBorderBox, styles) : 0;

				// Account for unreliable border-box dimensions by comparing offset* to computed and
				// faking a content-box to get border and padding (gh-3699)
				if (isBorderBox && scrollboxSizeBuggy) {
					subtract -= Math.ceil(elem["offset" + dimension[0].toUpperCase() + dimension.slice(1)] - parseFloat(styles[dimension]) - boxModelAdjustment(elem, dimension, "border", false, styles) - 0.5);
				}

				// Convert to pixels if value adjustment is needed
				if (subtract && (matches = rcssNum.exec(value)) && (matches[3] || "px") !== "px") {

					elem.style[dimension] = value;
					value = jQuery.css(elem, dimension);
				}

				return setPositiveNumber(elem, value, subtract);
			}
		};
	});

	jQuery.cssHooks.marginLeft = addGetHookIf(support.reliableMarginLeft, function (elem, computed) {
		if (computed) {
			return (parseFloat(curCSS(elem, "marginLeft")) || elem.getBoundingClientRect().left - swap(elem, { marginLeft: 0 }, function () {
				return elem.getBoundingClientRect().left;
			})) + "px";
		}
	});

	// These hooks are used by animate to expand properties
	jQuery.each({
		margin: "",
		padding: "",
		border: "Width"
	}, function (prefix, suffix) {
		jQuery.cssHooks[prefix + suffix] = {
			expand: function expand(value) {
				var i = 0,
				    expanded = {},


				// Assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [value];

				for (; i < 4; i++) {
					expanded[prefix + cssExpand[i] + suffix] = parts[i] || parts[i - 2] || parts[0];
				}

				return expanded;
			}
		};

		if (prefix !== "margin") {
			jQuery.cssHooks[prefix + suffix].set = setPositiveNumber;
		}
	});

	jQuery.fn.extend({
		css: function css(name, value) {
			return access(this, function (elem, name, value) {
				var styles,
				    len,
				    map = {},
				    i = 0;

				if (Array.isArray(name)) {
					styles = getStyles(elem);
					len = name.length;

					for (; i < len; i++) {
						map[name[i]] = jQuery.css(elem, name[i], false, styles);
					}

					return map;
				}

				return value !== undefined ? jQuery.style(elem, name, value) : jQuery.css(elem, name);
			}, name, value, arguments.length > 1);
		}
	});

	function Tween(elem, options, prop, end, easing) {
		return new Tween.prototype.init(elem, options, prop, end, easing);
	}
	jQuery.Tween = Tween;

	Tween.prototype = {
		constructor: Tween,
		init: function init(elem, options, prop, end, easing, unit) {
			this.elem = elem;
			this.prop = prop;
			this.easing = easing || jQuery.easing._default;
			this.options = options;
			this.start = this.now = this.cur();
			this.end = end;
			this.unit = unit || (jQuery.cssNumber[prop] ? "" : "px");
		},
		cur: function cur() {
			var hooks = Tween.propHooks[this.prop];

			return hooks && hooks.get ? hooks.get(this) : Tween.propHooks._default.get(this);
		},
		run: function run(percent) {
			var eased,
			    hooks = Tween.propHooks[this.prop];

			if (this.options.duration) {
				this.pos = eased = jQuery.easing[this.easing](percent, this.options.duration * percent, 0, 1, this.options.duration);
			} else {
				this.pos = eased = percent;
			}
			this.now = (this.end - this.start) * eased + this.start;

			if (this.options.step) {
				this.options.step.call(this.elem, this.now, this);
			}

			if (hooks && hooks.set) {
				hooks.set(this);
			} else {
				Tween.propHooks._default.set(this);
			}
			return this;
		}
	};

	Tween.prototype.init.prototype = Tween.prototype;

	Tween.propHooks = {
		_default: {
			get: function get(tween) {
				var result;

				// Use a property on the element directly when it is not a DOM element,
				// or when there is no matching style property that exists.
				if (tween.elem.nodeType !== 1 || tween.elem[tween.prop] != null && tween.elem.style[tween.prop] == null) {
					return tween.elem[tween.prop];
				}

				// Passing an empty string as a 3rd parameter to .css will automatically
				// attempt a parseFloat and fallback to a string if the parse fails.
				// Simple values such as "10px" are parsed to Float;
				// complex values such as "rotate(1rad)" are returned as-is.
				result = jQuery.css(tween.elem, tween.prop, "");

				// Empty strings, null, undefined and "auto" are converted to 0.
				return !result || result === "auto" ? 0 : result;
			},
			set: function set(tween) {

				// Use step hook for back compat.
				// Use cssHook if its there.
				// Use .style if available and use plain properties where available.
				if (jQuery.fx.step[tween.prop]) {
					jQuery.fx.step[tween.prop](tween);
				} else if (tween.elem.nodeType === 1 && (jQuery.cssHooks[tween.prop] || tween.elem.style[finalPropName(tween.prop)] != null)) {
					jQuery.style(tween.elem, tween.prop, tween.now + tween.unit);
				} else {
					tween.elem[tween.prop] = tween.now;
				}
			}
		}
	};

	// Support: IE <=9 only
	// Panic based approach to setting things on disconnected nodes
	Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
		set: function set(tween) {
			if (tween.elem.nodeType && tween.elem.parentNode) {
				tween.elem[tween.prop] = tween.now;
			}
		}
	};

	jQuery.easing = {
		linear: function linear(p) {
			return p;
		},
		swing: function swing(p) {
			return 0.5 - Math.cos(p * Math.PI) / 2;
		},
		_default: "swing"
	};

	jQuery.fx = Tween.prototype.init;

	// Back compat <1.8 extension point
	jQuery.fx.step = {};

	var fxNow,
	    inProgress,
	    rfxtypes = /^(?:toggle|show|hide)$/,
	    rrun = /queueHooks$/;

	function schedule() {
		if (inProgress) {
			if (document.hidden === false && window.requestAnimationFrame) {
				window.requestAnimationFrame(schedule);
			} else {
				window.setTimeout(schedule, jQuery.fx.interval);
			}

			jQuery.fx.tick();
		}
	}

	// Animations created synchronously will run synchronously
	function createFxNow() {
		window.setTimeout(function () {
			fxNow = undefined;
		});
		return fxNow = Date.now();
	}

	// Generate parameters to create a standard animation
	function genFx(type, includeWidth) {
		var which,
		    i = 0,
		    attrs = { height: type };

		// If we include width, step value is 1 to do all cssExpand values,
		// otherwise step value is 2 to skip over Left and Right
		includeWidth = includeWidth ? 1 : 0;
		for (; i < 4; i += 2 - includeWidth) {
			which = cssExpand[i];
			attrs["margin" + which] = attrs["padding" + which] = type;
		}

		if (includeWidth) {
			attrs.opacity = attrs.width = type;
		}

		return attrs;
	}

	function createTween(value, prop, animation) {
		var tween,
		    collection = (Animation.tweeners[prop] || []).concat(Animation.tweeners["*"]),
		    index = 0,
		    length = collection.length;
		for (; index < length; index++) {
			if (tween = collection[index].call(animation, prop, value)) {

				// We're done with this property
				return tween;
			}
		}
	}

	function defaultPrefilter(elem, props, opts) {
		var prop,
		    value,
		    toggle,
		    hooks,
		    oldfire,
		    propTween,
		    restoreDisplay,
		    display,
		    isBox = "width" in props || "height" in props,
		    anim = this,
		    orig = {},
		    style = elem.style,
		    hidden = elem.nodeType && isHiddenWithinTree(elem),
		    dataShow = dataPriv.get(elem, "fxshow");

		// Queue-skipping animations hijack the fx hooks
		if (!opts.queue) {
			hooks = jQuery._queueHooks(elem, "fx");
			if (hooks.unqueued == null) {
				hooks.unqueued = 0;
				oldfire = hooks.empty.fire;
				hooks.empty.fire = function () {
					if (!hooks.unqueued) {
						oldfire();
					}
				};
			}
			hooks.unqueued++;

			anim.always(function () {

				// Ensure the complete handler is called before this completes
				anim.always(function () {
					hooks.unqueued--;
					if (!jQuery.queue(elem, "fx").length) {
						hooks.empty.fire();
					}
				});
			});
		}

		// Detect show/hide animations
		for (prop in props) {
			value = props[prop];
			if (rfxtypes.test(value)) {
				delete props[prop];
				toggle = toggle || value === "toggle";
				if (value === (hidden ? "hide" : "show")) {

					// Pretend to be hidden if this is a "show" and
					// there is still data from a stopped show/hide
					if (value === "show" && dataShow && dataShow[prop] !== undefined) {
						hidden = true;

						// Ignore all other no-op show/hide data
					} else {
						continue;
					}
				}
				orig[prop] = dataShow && dataShow[prop] || jQuery.style(elem, prop);
			}
		}

		// Bail out if this is a no-op like .hide().hide()
		propTween = !jQuery.isEmptyObject(props);
		if (!propTween && jQuery.isEmptyObject(orig)) {
			return;
		}

		// Restrict "overflow" and "display" styles during box animations
		if (isBox && elem.nodeType === 1) {

			// Support: IE <=9 - 11, Edge 12 - 15
			// Record all 3 overflow attributes because IE does not infer the shorthand
			// from identically-valued overflowX and overflowY and Edge just mirrors
			// the overflowX value there.
			opts.overflow = [style.overflow, style.overflowX, style.overflowY];

			// Identify a display type, preferring old show/hide data over the CSS cascade
			restoreDisplay = dataShow && dataShow.display;
			if (restoreDisplay == null) {
				restoreDisplay = dataPriv.get(elem, "display");
			}
			display = jQuery.css(elem, "display");
			if (display === "none") {
				if (restoreDisplay) {
					display = restoreDisplay;
				} else {

					// Get nonempty value(s) by temporarily forcing visibility
					showHide([elem], true);
					restoreDisplay = elem.style.display || restoreDisplay;
					display = jQuery.css(elem, "display");
					showHide([elem]);
				}
			}

			// Animate inline elements as inline-block
			if (display === "inline" || display === "inline-block" && restoreDisplay != null) {
				if (jQuery.css(elem, "float") === "none") {

					// Restore the original display value at the end of pure show/hide animations
					if (!propTween) {
						anim.done(function () {
							style.display = restoreDisplay;
						});
						if (restoreDisplay == null) {
							display = style.display;
							restoreDisplay = display === "none" ? "" : display;
						}
					}
					style.display = "inline-block";
				}
			}
		}

		if (opts.overflow) {
			style.overflow = "hidden";
			anim.always(function () {
				style.overflow = opts.overflow[0];
				style.overflowX = opts.overflow[1];
				style.overflowY = opts.overflow[2];
			});
		}

		// Implement show/hide animations
		propTween = false;
		for (prop in orig) {

			// General show/hide setup for this element animation
			if (!propTween) {
				if (dataShow) {
					if ("hidden" in dataShow) {
						hidden = dataShow.hidden;
					}
				} else {
					dataShow = dataPriv.access(elem, "fxshow", { display: restoreDisplay });
				}

				// Store hidden/visible for toggle so `.stop().toggle()` "reverses"
				if (toggle) {
					dataShow.hidden = !hidden;
				}

				// Show elements before animating them
				if (hidden) {
					showHide([elem], true);
				}

				/* eslint-disable no-loop-func */

				anim.done(function () {

					/* eslint-enable no-loop-func */

					// The final step of a "hide" animation is actually hiding the element
					if (!hidden) {
						showHide([elem]);
					}
					dataPriv.remove(elem, "fxshow");
					for (prop in orig) {
						jQuery.style(elem, prop, orig[prop]);
					}
				});
			}

			// Per-property setup
			propTween = createTween(hidden ? dataShow[prop] : 0, prop, anim);
			if (!(prop in dataShow)) {
				dataShow[prop] = propTween.start;
				if (hidden) {
					propTween.end = propTween.start;
					propTween.start = 0;
				}
			}
		}
	}

	function propFilter(props, specialEasing) {
		var index, name, easing, value, hooks;

		// camelCase, specialEasing and expand cssHook pass
		for (index in props) {
			name = camelCase(index);
			easing = specialEasing[name];
			value = props[index];
			if (Array.isArray(value)) {
				easing = value[1];
				value = props[index] = value[0];
			}

			if (index !== name) {
				props[name] = value;
				delete props[index];
			}

			hooks = jQuery.cssHooks[name];
			if (hooks && "expand" in hooks) {
				value = hooks.expand(value);
				delete props[name];

				// Not quite $.extend, this won't overwrite existing keys.
				// Reusing 'index' because we have the correct "name"
				for (index in value) {
					if (!(index in props)) {
						props[index] = value[index];
						specialEasing[index] = easing;
					}
				}
			} else {
				specialEasing[name] = easing;
			}
		}
	}

	function Animation(elem, properties, options) {
		var result,
		    stopped,
		    index = 0,
		    length = Animation.prefilters.length,
		    deferred = jQuery.Deferred().always(function () {

			// Don't match elem in the :animated selector
			delete tick.elem;
		}),
		    tick = function tick() {
			if (stopped) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
			    remaining = Math.max(0, animation.startTime + animation.duration - currentTime),


			// Support: Android 2.3 only
			// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
			temp = remaining / animation.duration || 0,
			    percent = 1 - temp,
			    index = 0,
			    length = animation.tweens.length;

			for (; index < length; index++) {
				animation.tweens[index].run(percent);
			}

			deferred.notifyWith(elem, [animation, percent, remaining]);

			// If there's more to do, yield
			if (percent < 1 && length) {
				return remaining;
			}

			// If this was an empty animation, synthesize a final progress notification
			if (!length) {
				deferred.notifyWith(elem, [animation, 1, 0]);
			}

			// Resolve the animation and report its conclusion
			deferred.resolveWith(elem, [animation]);
			return false;
		},
		    animation = deferred.promise({
			elem: elem,
			props: jQuery.extend({}, properties),
			opts: jQuery.extend(true, {
				specialEasing: {},
				easing: jQuery.easing._default
			}, options),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function createTween(prop, end) {
				var tween = jQuery.Tween(elem, animation.opts, prop, end, animation.opts.specialEasing[prop] || animation.opts.easing);
				animation.tweens.push(tween);
				return tween;
			},
			stop: function stop(gotoEnd) {
				var index = 0,


				// If we are going to the end, we want to run all the tweens
				// otherwise we skip this part
				length = gotoEnd ? animation.tweens.length : 0;
				if (stopped) {
					return this;
				}
				stopped = true;
				for (; index < length; index++) {
					animation.tweens[index].run(1);
				}

				// Resolve when we played the last frame; otherwise, reject
				if (gotoEnd) {
					deferred.notifyWith(elem, [animation, 1, 0]);
					deferred.resolveWith(elem, [animation, gotoEnd]);
				} else {
					deferred.rejectWith(elem, [animation, gotoEnd]);
				}
				return this;
			}
		}),
		    props = animation.props;

		propFilter(props, animation.opts.specialEasing);

		for (; index < length; index++) {
			result = Animation.prefilters[index].call(animation, elem, props, animation.opts);
			if (result) {
				if (isFunction(result.stop)) {
					jQuery._queueHooks(animation.elem, animation.opts.queue).stop = result.stop.bind(result);
				}
				return result;
			}
		}

		jQuery.map(props, createTween, animation);

		if (isFunction(animation.opts.start)) {
			animation.opts.start.call(elem, animation);
		}

		// Attach callbacks from options
		animation.progress(animation.opts.progress).done(animation.opts.done, animation.opts.complete).fail(animation.opts.fail).always(animation.opts.always);

		jQuery.fx.timer(jQuery.extend(tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		}));

		return animation;
	}

	jQuery.Animation = jQuery.extend(Animation, {

		tweeners: {
			"*": [function (prop, value) {
				var tween = this.createTween(prop, value);
				adjustCSS(tween.elem, prop, rcssNum.exec(value), tween);
				return tween;
			}]
		},

		tweener: function tweener(props, callback) {
			if (isFunction(props)) {
				callback = props;
				props = ["*"];
			} else {
				props = props.match(rnothtmlwhite);
			}

			var prop,
			    index = 0,
			    length = props.length;

			for (; index < length; index++) {
				prop = props[index];
				Animation.tweeners[prop] = Animation.tweeners[prop] || [];
				Animation.tweeners[prop].unshift(callback);
			}
		},

		prefilters: [defaultPrefilter],

		prefilter: function prefilter(callback, prepend) {
			if (prepend) {
				Animation.prefilters.unshift(callback);
			} else {
				Animation.prefilters.push(callback);
			}
		}
	});

	jQuery.speed = function (speed, easing, fn) {
		var opt = speed && (typeof speed === "undefined" ? "undefined" : _typeof(speed)) === "object" ? jQuery.extend({}, speed) : {
			complete: fn || !fn && easing || isFunction(speed) && speed,
			duration: speed,
			easing: fn && easing || easing && !isFunction(easing) && easing
		};

		// Go to the end state if fx are off
		if (jQuery.fx.off) {
			opt.duration = 0;
		} else {
			if (typeof opt.duration !== "number") {
				if (opt.duration in jQuery.fx.speeds) {
					opt.duration = jQuery.fx.speeds[opt.duration];
				} else {
					opt.duration = jQuery.fx.speeds._default;
				}
			}
		}

		// Normalize opt.queue - true/undefined/null -> "fx"
		if (opt.queue == null || opt.queue === true) {
			opt.queue = "fx";
		}

		// Queueing
		opt.old = opt.complete;

		opt.complete = function () {
			if (isFunction(opt.old)) {
				opt.old.call(this);
			}

			if (opt.queue) {
				jQuery.dequeue(this, opt.queue);
			}
		};

		return opt;
	};

	jQuery.fn.extend({
		fadeTo: function fadeTo(speed, to, easing, callback) {

			// Show any hidden elements after setting opacity to 0
			return this.filter(isHiddenWithinTree).css("opacity", 0).show()

			// Animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback);
		},
		animate: function animate(prop, speed, easing, callback) {
			var empty = jQuery.isEmptyObject(prop),
			    optall = jQuery.speed(speed, easing, callback),
			    doAnimation = function doAnimation() {

				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation(this, jQuery.extend({}, prop), optall);

				// Empty animations, or finishing resolves immediately
				if (empty || dataPriv.get(this, "finish")) {
					anim.stop(true);
				}
			};
			doAnimation.finish = doAnimation;

			return empty || optall.queue === false ? this.each(doAnimation) : this.queue(optall.queue, doAnimation);
		},
		stop: function stop(type, clearQueue, gotoEnd) {
			var stopQueue = function stopQueue(hooks) {
				var stop = hooks.stop;
				delete hooks.stop;
				stop(gotoEnd);
			};

			if (typeof type !== "string") {
				gotoEnd = clearQueue;
				clearQueue = type;
				type = undefined;
			}
			if (clearQueue && type !== false) {
				this.queue(type || "fx", []);
			}

			return this.each(function () {
				var dequeue = true,
				    index = type != null && type + "queueHooks",
				    timers = jQuery.timers,
				    data = dataPriv.get(this);

				if (index) {
					if (data[index] && data[index].stop) {
						stopQueue(data[index]);
					}
				} else {
					for (index in data) {
						if (data[index] && data[index].stop && rrun.test(index)) {
							stopQueue(data[index]);
						}
					}
				}

				for (index = timers.length; index--;) {
					if (timers[index].elem === this && (type == null || timers[index].queue === type)) {

						timers[index].anim.stop(gotoEnd);
						dequeue = false;
						timers.splice(index, 1);
					}
				}

				// Start the next in the queue if the last step wasn't forced.
				// Timers currently will call their complete callbacks, which
				// will dequeue but only if they were gotoEnd.
				if (dequeue || !gotoEnd) {
					jQuery.dequeue(this, type);
				}
			});
		},
		finish: function finish(type) {
			if (type !== false) {
				type = type || "fx";
			}
			return this.each(function () {
				var index,
				    data = dataPriv.get(this),
				    queue = data[type + "queue"],
				    hooks = data[type + "queueHooks"],
				    timers = jQuery.timers,
				    length = queue ? queue.length : 0;

				// Enable finishing flag on private data
				data.finish = true;

				// Empty the queue first
				jQuery.queue(this, type, []);

				if (hooks && hooks.stop) {
					hooks.stop.call(this, true);
				}

				// Look for any active animations, and finish them
				for (index = timers.length; index--;) {
					if (timers[index].elem === this && timers[index].queue === type) {
						timers[index].anim.stop(true);
						timers.splice(index, 1);
					}
				}

				// Look for any animations in the old queue and finish them
				for (index = 0; index < length; index++) {
					if (queue[index] && queue[index].finish) {
						queue[index].finish.call(this);
					}
				}

				// Turn off finishing flag
				delete data.finish;
			});
		}
	});

	jQuery.each(["toggle", "show", "hide"], function (i, name) {
		var cssFn = jQuery.fn[name];
		jQuery.fn[name] = function (speed, easing, callback) {
			return speed == null || typeof speed === "boolean" ? cssFn.apply(this, arguments) : this.animate(genFx(name, true), speed, easing, callback);
		};
	});

	// Generate shortcuts for custom animations
	jQuery.each({
		slideDown: genFx("show"),
		slideUp: genFx("hide"),
		slideToggle: genFx("toggle"),
		fadeIn: { opacity: "show" },
		fadeOut: { opacity: "hide" },
		fadeToggle: { opacity: "toggle" }
	}, function (name, props) {
		jQuery.fn[name] = function (speed, easing, callback) {
			return this.animate(props, speed, easing, callback);
		};
	});

	jQuery.timers = [];
	jQuery.fx.tick = function () {
		var timer,
		    i = 0,
		    timers = jQuery.timers;

		fxNow = Date.now();

		for (; i < timers.length; i++) {
			timer = timers[i];

			// Run the timer and safely remove it when done (allowing for external removal)
			if (!timer() && timers[i] === timer) {
				timers.splice(i--, 1);
			}
		}

		if (!timers.length) {
			jQuery.fx.stop();
		}
		fxNow = undefined;
	};

	jQuery.fx.timer = function (timer) {
		jQuery.timers.push(timer);
		jQuery.fx.start();
	};

	jQuery.fx.interval = 13;
	jQuery.fx.start = function () {
		if (inProgress) {
			return;
		}

		inProgress = true;
		schedule();
	};

	jQuery.fx.stop = function () {
		inProgress = null;
	};

	jQuery.fx.speeds = {
		slow: 600,
		fast: 200,

		// Default speed
		_default: 400
	};

	// Based off of the plugin by Clint Helfers, with permission.
	// https://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
	jQuery.fn.delay = function (time, type) {
		time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
		type = type || "fx";

		return this.queue(type, function (next, hooks) {
			var timeout = window.setTimeout(next, time);
			hooks.stop = function () {
				window.clearTimeout(timeout);
			};
		});
	};

	(function () {
		var input = document.createElement("input"),
		    select = document.createElement("select"),
		    opt = select.appendChild(document.createElement("option"));

		input.type = "checkbox";

		// Support: Android <=4.3 only
		// Default value for a checkbox should be "on"
		support.checkOn = input.value !== "";

		// Support: IE <=11 only
		// Must access selectedIndex to make default options select
		support.optSelected = opt.selected;

		// Support: IE <=11 only
		// An input loses its value after becoming a radio
		input = document.createElement("input");
		input.value = "t";
		input.type = "radio";
		support.radioValue = input.value === "t";
	})();

	var boolHook,
	    attrHandle = jQuery.expr.attrHandle;

	jQuery.fn.extend({
		attr: function attr(name, value) {
			return access(this, jQuery.attr, name, value, arguments.length > 1);
		},

		removeAttr: function removeAttr(name) {
			return this.each(function () {
				jQuery.removeAttr(this, name);
			});
		}
	});

	jQuery.extend({
		attr: function attr(elem, name, value) {
			var ret,
			    hooks,
			    nType = elem.nodeType;

			// Don't get/set attributes on text, comment and attribute nodes
			if (nType === 3 || nType === 8 || nType === 2) {
				return;
			}

			// Fallback to prop when attributes are not supported
			if (typeof elem.getAttribute === "undefined") {
				return jQuery.prop(elem, name, value);
			}

			// Attribute hooks are determined by the lowercase version
			// Grab necessary hook if one is defined
			if (nType !== 1 || !jQuery.isXMLDoc(elem)) {
				hooks = jQuery.attrHooks[name.toLowerCase()] || (jQuery.expr.match.bool.test(name) ? boolHook : undefined);
			}

			if (value !== undefined) {
				if (value === null) {
					jQuery.removeAttr(elem, name);
					return;
				}

				if (hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== undefined) {
					return ret;
				}

				elem.setAttribute(name, value + "");
				return value;
			}

			if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null) {
				return ret;
			}

			ret = jQuery.find.attr(elem, name);

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ? undefined : ret;
		},

		attrHooks: {
			type: {
				set: function set(elem, value) {
					if (!support.radioValue && value === "radio" && nodeName(elem, "input")) {
						var val = elem.value;
						elem.setAttribute("type", value);
						if (val) {
							elem.value = val;
						}
						return value;
					}
				}
			}
		},

		removeAttr: function removeAttr(elem, value) {
			var name,
			    i = 0,


			// Attribute names can contain non-HTML whitespace characters
			// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
			attrNames = value && value.match(rnothtmlwhite);

			if (attrNames && elem.nodeType === 1) {
				while (name = attrNames[i++]) {
					elem.removeAttribute(name);
				}
			}
		}
	});

	// Hooks for boolean attributes
	boolHook = {
		set: function set(elem, value, name) {
			if (value === false) {

				// Remove boolean attributes when set to false
				jQuery.removeAttr(elem, name);
			} else {
				elem.setAttribute(name, name);
			}
			return name;
		}
	};

	jQuery.each(jQuery.expr.match.bool.source.match(/\w+/g), function (i, name) {
		var getter = attrHandle[name] || jQuery.find.attr;

		attrHandle[name] = function (elem, name, isXML) {
			var ret,
			    handle,
			    lowercaseName = name.toLowerCase();

			if (!isXML) {

				// Avoid an infinite loop by temporarily removing this function from the getter
				handle = attrHandle[lowercaseName];
				attrHandle[lowercaseName] = ret;
				ret = getter(elem, name, isXML) != null ? lowercaseName : null;
				attrHandle[lowercaseName] = handle;
			}
			return ret;
		};
	});

	var rfocusable = /^(?:input|select|textarea|button)$/i,
	    rclickable = /^(?:a|area)$/i;

	jQuery.fn.extend({
		prop: function prop(name, value) {
			return access(this, jQuery.prop, name, value, arguments.length > 1);
		},

		removeProp: function removeProp(name) {
			return this.each(function () {
				delete this[jQuery.propFix[name] || name];
			});
		}
	});

	jQuery.extend({
		prop: function prop(elem, name, value) {
			var ret,
			    hooks,
			    nType = elem.nodeType;

			// Don't get/set properties on text, comment and attribute nodes
			if (nType === 3 || nType === 8 || nType === 2) {
				return;
			}

			if (nType !== 1 || !jQuery.isXMLDoc(elem)) {

				// Fix name and attach hooks
				name = jQuery.propFix[name] || name;
				hooks = jQuery.propHooks[name];
			}

			if (value !== undefined) {
				if (hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== undefined) {
					return ret;
				}

				return elem[name] = value;
			}

			if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null) {
				return ret;
			}

			return elem[name];
		},

		propHooks: {
			tabIndex: {
				get: function get(elem) {

					// Support: IE <=9 - 11 only
					// elem.tabIndex doesn't always return the
					// correct value when it hasn't been explicitly set
					// https://web.archive.org/web/20141116233347/http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
					// Use proper attribute retrieval(#12072)
					var tabindex = jQuery.find.attr(elem, "tabindex");

					if (tabindex) {
						return parseInt(tabindex, 10);
					}

					if (rfocusable.test(elem.nodeName) || rclickable.test(elem.nodeName) && elem.href) {
						return 0;
					}

					return -1;
				}
			}
		},

		propFix: {
			"for": "htmlFor",
			"class": "className"
		}
	});

	// Support: IE <=11 only
	// Accessing the selectedIndex property
	// forces the browser to respect setting selected
	// on the option
	// The getter ensures a default option is selected
	// when in an optgroup
	// eslint rule "no-unused-expressions" is disabled for this code
	// since it considers such accessions noop
	if (!support.optSelected) {
		jQuery.propHooks.selected = {
			get: function get(elem) {

				/* eslint no-unused-expressions: "off" */

				var parent = elem.parentNode;
				if (parent && parent.parentNode) {
					parent.parentNode.selectedIndex;
				}
				return null;
			},
			set: function set(elem) {

				/* eslint no-unused-expressions: "off" */

				var parent = elem.parentNode;
				if (parent) {
					parent.selectedIndex;

					if (parent.parentNode) {
						parent.parentNode.selectedIndex;
					}
				}
			}
		};
	}

	jQuery.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function () {
		jQuery.propFix[this.toLowerCase()] = this;
	});

	// Strip and collapse whitespace according to HTML spec
	// https://infra.spec.whatwg.org/#strip-and-collapse-ascii-whitespace
	function stripAndCollapse(value) {
		var tokens = value.match(rnothtmlwhite) || [];
		return tokens.join(" ");
	}

	function getClass(elem) {
		return elem.getAttribute && elem.getAttribute("class") || "";
	}

	function classesToArray(value) {
		if (Array.isArray(value)) {
			return value;
		}
		if (typeof value === "string") {
			return value.match(rnothtmlwhite) || [];
		}
		return [];
	}

	jQuery.fn.extend({
		addClass: function addClass(value) {
			var classes,
			    elem,
			    cur,
			    curValue,
			    clazz,
			    j,
			    finalValue,
			    i = 0;

			if (isFunction(value)) {
				return this.each(function (j) {
					jQuery(this).addClass(value.call(this, j, getClass(this)));
				});
			}

			classes = classesToArray(value);

			if (classes.length) {
				while (elem = this[i++]) {
					curValue = getClass(elem);
					cur = elem.nodeType === 1 && " " + stripAndCollapse(curValue) + " ";

					if (cur) {
						j = 0;
						while (clazz = classes[j++]) {
							if (cur.indexOf(" " + clazz + " ") < 0) {
								cur += clazz + " ";
							}
						}

						// Only assign if different to avoid unneeded rendering.
						finalValue = stripAndCollapse(cur);
						if (curValue !== finalValue) {
							elem.setAttribute("class", finalValue);
						}
					}
				}
			}

			return this;
		},

		removeClass: function removeClass(value) {
			var classes,
			    elem,
			    cur,
			    curValue,
			    clazz,
			    j,
			    finalValue,
			    i = 0;

			if (isFunction(value)) {
				return this.each(function (j) {
					jQuery(this).removeClass(value.call(this, j, getClass(this)));
				});
			}

			if (!arguments.length) {
				return this.attr("class", "");
			}

			classes = classesToArray(value);

			if (classes.length) {
				while (elem = this[i++]) {
					curValue = getClass(elem);

					// This expression is here for better compressibility (see addClass)
					cur = elem.nodeType === 1 && " " + stripAndCollapse(curValue) + " ";

					if (cur) {
						j = 0;
						while (clazz = classes[j++]) {

							// Remove *all* instances
							while (cur.indexOf(" " + clazz + " ") > -1) {
								cur = cur.replace(" " + clazz + " ", " ");
							}
						}

						// Only assign if different to avoid unneeded rendering.
						finalValue = stripAndCollapse(cur);
						if (curValue !== finalValue) {
							elem.setAttribute("class", finalValue);
						}
					}
				}
			}

			return this;
		},

		toggleClass: function toggleClass(value, stateVal) {
			var type = typeof value === "undefined" ? "undefined" : _typeof(value),
			    isValidValue = type === "string" || Array.isArray(value);

			if (typeof stateVal === "boolean" && isValidValue) {
				return stateVal ? this.addClass(value) : this.removeClass(value);
			}

			if (isFunction(value)) {
				return this.each(function (i) {
					jQuery(this).toggleClass(value.call(this, i, getClass(this), stateVal), stateVal);
				});
			}

			return this.each(function () {
				var className, i, self, classNames;

				if (isValidValue) {

					// Toggle individual class names
					i = 0;
					self = jQuery(this);
					classNames = classesToArray(value);

					while (className = classNames[i++]) {

						// Check each className given, space separated list
						if (self.hasClass(className)) {
							self.removeClass(className);
						} else {
							self.addClass(className);
						}
					}

					// Toggle whole class name
				} else if (value === undefined || type === "boolean") {
					className = getClass(this);
					if (className) {

						// Store className if set
						dataPriv.set(this, "__className__", className);
					}

					// If the element has a class name or if we're passed `false`,
					// then remove the whole classname (if there was one, the above saved it).
					// Otherwise bring back whatever was previously saved (if anything),
					// falling back to the empty string if nothing was stored.
					if (this.setAttribute) {
						this.setAttribute("class", className || value === false ? "" : dataPriv.get(this, "__className__") || "");
					}
				}
			});
		},

		hasClass: function hasClass(selector) {
			var className,
			    elem,
			    i = 0;

			className = " " + selector + " ";
			while (elem = this[i++]) {
				if (elem.nodeType === 1 && (" " + stripAndCollapse(getClass(elem)) + " ").indexOf(className) > -1) {
					return true;
				}
			}

			return false;
		}
	});

	var rreturn = /\r/g;

	jQuery.fn.extend({
		val: function val(value) {
			var hooks,
			    ret,
			    valueIsFunction,
			    elem = this[0];

			if (!arguments.length) {
				if (elem) {
					hooks = jQuery.valHooks[elem.type] || jQuery.valHooks[elem.nodeName.toLowerCase()];

					if (hooks && "get" in hooks && (ret = hooks.get(elem, "value")) !== undefined) {
						return ret;
					}

					ret = elem.value;

					// Handle most common string cases
					if (typeof ret === "string") {
						return ret.replace(rreturn, "");
					}

					// Handle cases where value is null/undef or number
					return ret == null ? "" : ret;
				}

				return;
			}

			valueIsFunction = isFunction(value);

			return this.each(function (i) {
				var val;

				if (this.nodeType !== 1) {
					return;
				}

				if (valueIsFunction) {
					val = value.call(this, i, jQuery(this).val());
				} else {
					val = value;
				}

				// Treat null/undefined as ""; convert numbers to string
				if (val == null) {
					val = "";
				} else if (typeof val === "number") {
					val += "";
				} else if (Array.isArray(val)) {
					val = jQuery.map(val, function (value) {
						return value == null ? "" : value + "";
					});
				}

				hooks = jQuery.valHooks[this.type] || jQuery.valHooks[this.nodeName.toLowerCase()];

				// If set returns undefined, fall back to normal setting
				if (!hooks || !("set" in hooks) || hooks.set(this, val, "value") === undefined) {
					this.value = val;
				}
			});
		}
	});

	jQuery.extend({
		valHooks: {
			option: {
				get: function get(elem) {

					var val = jQuery.find.attr(elem, "value");
					return val != null ? val :

					// Support: IE <=10 - 11 only
					// option.text throws exceptions (#14686, #14858)
					// Strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					stripAndCollapse(jQuery.text(elem));
				}
			},
			select: {
				get: function get(elem) {
					var value,
					    option,
					    i,
					    options = elem.options,
					    index = elem.selectedIndex,
					    one = elem.type === "select-one",
					    values = one ? null : [],
					    max = one ? index + 1 : options.length;

					if (index < 0) {
						i = max;
					} else {
						i = one ? index : 0;
					}

					// Loop through all the selected options
					for (; i < max; i++) {
						option = options[i];

						// Support: IE <=9 only
						// IE8-9 doesn't update selected after form reset (#2551)
						if ((option.selected || i === index) &&

						// Don't return options that are disabled or in a disabled optgroup
						!option.disabled && (!option.parentNode.disabled || !nodeName(option.parentNode, "optgroup"))) {

							// Get the specific value for the option
							value = jQuery(option).val();

							// We don't need an array for one selects
							if (one) {
								return value;
							}

							// Multi-Selects return an array
							values.push(value);
						}
					}

					return values;
				},

				set: function set(elem, value) {
					var optionSet,
					    option,
					    options = elem.options,
					    values = jQuery.makeArray(value),
					    i = options.length;

					while (i--) {
						option = options[i];

						/* eslint-disable no-cond-assign */

						if (option.selected = jQuery.inArray(jQuery.valHooks.option.get(option), values) > -1) {
							optionSet = true;
						}

						/* eslint-enable no-cond-assign */
					}

					// Force browsers to behave consistently when non-matching value is set
					if (!optionSet) {
						elem.selectedIndex = -1;
					}
					return values;
				}
			}
		}
	});

	// Radios and checkboxes getter/setter
	jQuery.each(["radio", "checkbox"], function () {
		jQuery.valHooks[this] = {
			set: function set(elem, value) {
				if (Array.isArray(value)) {
					return elem.checked = jQuery.inArray(jQuery(elem).val(), value) > -1;
				}
			}
		};
		if (!support.checkOn) {
			jQuery.valHooks[this].get = function (elem) {
				return elem.getAttribute("value") === null ? "on" : elem.value;
			};
		}
	});

	// Return jQuery for attributes-only inclusion


	support.focusin = "onfocusin" in window;

	var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	    stopPropagationCallback = function stopPropagationCallback(e) {
		e.stopPropagation();
	};

	jQuery.extend(jQuery.event, {

		trigger: function trigger(event, data, elem, onlyHandlers) {

			var i,
			    cur,
			    tmp,
			    bubbleType,
			    ontype,
			    handle,
			    special,
			    lastElement,
			    eventPath = [elem || document],
			    type = hasOwn.call(event, "type") ? event.type : event,
			    namespaces = hasOwn.call(event, "namespace") ? event.namespace.split(".") : [];

			cur = lastElement = tmp = elem = elem || document;

			// Don't do events on text and comment nodes
			if (elem.nodeType === 3 || elem.nodeType === 8) {
				return;
			}

			// focus/blur morphs to focusin/out; ensure we're not firing them right now
			if (rfocusMorph.test(type + jQuery.event.triggered)) {
				return;
			}

			if (type.indexOf(".") > -1) {

				// Namespaced trigger; create a regexp to match event type in handle()
				namespaces = type.split(".");
				type = namespaces.shift();
				namespaces.sort();
			}
			ontype = type.indexOf(":") < 0 && "on" + type;

			// Caller can pass in a jQuery.Event object, Object, or just an event type string
			event = event[jQuery.expando] ? event : new jQuery.Event(type, (typeof event === "undefined" ? "undefined" : _typeof(event)) === "object" && event);

			// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
			event.isTrigger = onlyHandlers ? 2 : 3;
			event.namespace = namespaces.join(".");
			event.rnamespace = event.namespace ? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") : null;

			// Clean up the event in case it is being reused
			event.result = undefined;
			if (!event.target) {
				event.target = elem;
			}

			// Clone any incoming data and prepend the event, creating the handler arg list
			data = data == null ? [event] : jQuery.makeArray(data, [event]);

			// Allow special events to draw outside the lines
			special = jQuery.event.special[type] || {};
			if (!onlyHandlers && special.trigger && special.trigger.apply(elem, data) === false) {
				return;
			}

			// Determine event propagation path in advance, per W3C events spec (#9951)
			// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
			if (!onlyHandlers && !special.noBubble && !isWindow(elem)) {

				bubbleType = special.delegateType || type;
				if (!rfocusMorph.test(bubbleType + type)) {
					cur = cur.parentNode;
				}
				for (; cur; cur = cur.parentNode) {
					eventPath.push(cur);
					tmp = cur;
				}

				// Only add window if we got to document (e.g., not plain obj or detached DOM)
				if (tmp === (elem.ownerDocument || document)) {
					eventPath.push(tmp.defaultView || tmp.parentWindow || window);
				}
			}

			// Fire handlers on the event path
			i = 0;
			while ((cur = eventPath[i++]) && !event.isPropagationStopped()) {
				lastElement = cur;
				event.type = i > 1 ? bubbleType : special.bindType || type;

				// jQuery handler
				handle = (dataPriv.get(cur, "events") || {})[event.type] && dataPriv.get(cur, "handle");
				if (handle) {
					handle.apply(cur, data);
				}

				// Native handler
				handle = ontype && cur[ontype];
				if (handle && handle.apply && acceptData(cur)) {
					event.result = handle.apply(cur, data);
					if (event.result === false) {
						event.preventDefault();
					}
				}
			}
			event.type = type;

			// If nobody prevented the default action, do it now
			if (!onlyHandlers && !event.isDefaultPrevented()) {

				if ((!special._default || special._default.apply(eventPath.pop(), data) === false) && acceptData(elem)) {

					// Call a native DOM method on the target with the same name as the event.
					// Don't do default actions on window, that's where global variables be (#6170)
					if (ontype && isFunction(elem[type]) && !isWindow(elem)) {

						// Don't re-trigger an onFOO event when we call its FOO() method
						tmp = elem[ontype];

						if (tmp) {
							elem[ontype] = null;
						}

						// Prevent re-triggering of the same event, since we already bubbled it above
						jQuery.event.triggered = type;

						if (event.isPropagationStopped()) {
							lastElement.addEventListener(type, stopPropagationCallback);
						}

						elem[type]();

						if (event.isPropagationStopped()) {
							lastElement.removeEventListener(type, stopPropagationCallback);
						}

						jQuery.event.triggered = undefined;

						if (tmp) {
							elem[ontype] = tmp;
						}
					}
				}
			}

			return event.result;
		},

		// Piggyback on a donor event to simulate a different one
		// Used only for `focus(in | out)` events
		simulate: function simulate(type, elem, event) {
			var e = jQuery.extend(new jQuery.Event(), event, {
				type: type,
				isSimulated: true
			});

			jQuery.event.trigger(e, null, elem);
		}

	});

	jQuery.fn.extend({

		trigger: function trigger(type, data) {
			return this.each(function () {
				jQuery.event.trigger(type, data, this);
			});
		},
		triggerHandler: function triggerHandler(type, data) {
			var elem = this[0];
			if (elem) {
				return jQuery.event.trigger(type, data, elem, true);
			}
		}
	});

	// Support: Firefox <=44
	// Firefox doesn't have focus(in | out) events
	// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
	//
	// Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
	// focus(in | out) events fire after focus & blur events,
	// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
	// Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
	if (!support.focusin) {
		jQuery.each({ focus: "focusin", blur: "focusout" }, function (orig, fix) {

			// Attach a single capturing handler on the document while someone wants focusin/focusout
			var handler = function handler(event) {
				jQuery.event.simulate(fix, event.target, jQuery.event.fix(event));
			};

			jQuery.event.special[fix] = {
				setup: function setup() {
					var doc = this.ownerDocument || this,
					    attaches = dataPriv.access(doc, fix);

					if (!attaches) {
						doc.addEventListener(orig, handler, true);
					}
					dataPriv.access(doc, fix, (attaches || 0) + 1);
				},
				teardown: function teardown() {
					var doc = this.ownerDocument || this,
					    attaches = dataPriv.access(doc, fix) - 1;

					if (!attaches) {
						doc.removeEventListener(orig, handler, true);
						dataPriv.remove(doc, fix);
					} else {
						dataPriv.access(doc, fix, attaches);
					}
				}
			};
		});
	}
	var location = window.location;

	var nonce = Date.now();

	var rquery = /\?/;

	// Cross-browser xml parsing
	jQuery.parseXML = function (data) {
		var xml;
		if (!data || typeof data !== "string") {
			return null;
		}

		// Support: IE 9 - 11 only
		// IE throws on parseFromString with invalid input.
		try {
			xml = new window.DOMParser().parseFromString(data, "text/xml");
		} catch (e) {
			xml = undefined;
		}

		if (!xml || xml.getElementsByTagName("parsererror").length) {
			jQuery.error("Invalid XML: " + data);
		}
		return xml;
	};

	var rbracket = /\[\]$/,
	    rCRLF = /\r?\n/g,
	    rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	    rsubmittable = /^(?:input|select|textarea|keygen)/i;

	function buildParams(prefix, obj, traditional, add) {
		var name;

		if (Array.isArray(obj)) {

			// Serialize array item.
			jQuery.each(obj, function (i, v) {
				if (traditional || rbracket.test(prefix)) {

					// Treat each array item as a scalar.
					add(prefix, v);
				} else {

					// Item is non-scalar (array or object), encode its numeric index.
					buildParams(prefix + "[" + ((typeof v === "undefined" ? "undefined" : _typeof(v)) === "object" && v != null ? i : "") + "]", v, traditional, add);
				}
			});
		} else if (!traditional && toType(obj) === "object") {

			// Serialize object item.
			for (name in obj) {
				buildParams(prefix + "[" + name + "]", obj[name], traditional, add);
			}
		} else {

			// Serialize scalar item.
			add(prefix, obj);
		}
	}

	// Serialize an array of form elements or a set of
	// key/values into a query string
	jQuery.param = function (a, traditional) {
		var prefix,
		    s = [],
		    add = function add(key, valueOrFunction) {

			// If value is a function, invoke it and use its return value
			var value = isFunction(valueOrFunction) ? valueOrFunction() : valueOrFunction;

			s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value == null ? "" : value);
		};

		if (a == null) {
			return "";
		}

		// If an array was passed in, assume that it is an array of form elements.
		if (Array.isArray(a) || a.jquery && !jQuery.isPlainObject(a)) {

			// Serialize the form elements
			jQuery.each(a, function () {
				add(this.name, this.value);
			});
		} else {

			// If traditional, encode the "old" way (the way 1.3.2 or older
			// did it), otherwise encode params recursively.
			for (prefix in a) {
				buildParams(prefix, a[prefix], traditional, add);
			}
		}

		// Return the resulting serialization
		return s.join("&");
	};

	jQuery.fn.extend({
		serialize: function serialize() {
			return jQuery.param(this.serializeArray());
		},
		serializeArray: function serializeArray() {
			return this.map(function () {

				// Can add propHook for "elements" to filter or add form elements
				var elements = jQuery.prop(this, "elements");
				return elements ? jQuery.makeArray(elements) : this;
			}).filter(function () {
				var type = this.type;

				// Use .is( ":disabled" ) so that fieldset[disabled] works
				return this.name && !jQuery(this).is(":disabled") && rsubmittable.test(this.nodeName) && !rsubmitterTypes.test(type) && (this.checked || !rcheckableType.test(type));
			}).map(function (i, elem) {
				var val = jQuery(this).val();

				if (val == null) {
					return null;
				}

				if (Array.isArray(val)) {
					return jQuery.map(val, function (val) {
						return { name: elem.name, value: val.replace(rCRLF, "\r\n") };
					});
				}

				return { name: elem.name, value: val.replace(rCRLF, "\r\n") };
			}).get();
		}
	});

	var r20 = /%20/g,
	    rhash = /#.*$/,
	    rantiCache = /([?&])_=[^&]*/,
	    rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,


	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	    rnoContent = /^(?:GET|HEAD)$/,
	    rprotocol = /^\/\//,


	/* Prefilters
  * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
  * 2) These are called:
  *    - BEFORE asking for a transport
  *    - AFTER param serialization (s.data is a string if s.processData is true)
  * 3) key is the dataType
  * 4) the catchall symbol "*" can be used
  * 5) execution will start with transport dataType and THEN continue down to "*" if needed
  */
	prefilters = {},


	/* Transports bindings
  * 1) key is the dataType
  * 2) the catchall symbol "*" can be used
  * 3) selection will start with transport dataType and THEN go to "*" if needed
  */
	transports = {},


	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat("*"),


	// Anchor tag for parsing the document origin
	originAnchor = document.createElement("a");
	originAnchor.href = location.href;

	// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
	function addToPrefiltersOrTransports(structure) {

		// dataTypeExpression is optional and defaults to "*"
		return function (dataTypeExpression, func) {

			if (typeof dataTypeExpression !== "string") {
				func = dataTypeExpression;
				dataTypeExpression = "*";
			}

			var dataType,
			    i = 0,
			    dataTypes = dataTypeExpression.toLowerCase().match(rnothtmlwhite) || [];

			if (isFunction(func)) {

				// For each dataType in the dataTypeExpression
				while (dataType = dataTypes[i++]) {

					// Prepend if requested
					if (dataType[0] === "+") {
						dataType = dataType.slice(1) || "*";
						(structure[dataType] = structure[dataType] || []).unshift(func);

						// Otherwise append
					} else {
						(structure[dataType] = structure[dataType] || []).push(func);
					}
				}
			}
		};
	}

	// Base inspection function for prefilters and transports
	function inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR) {

		var inspected = {},
		    seekingTransport = structure === transports;

		function inspect(dataType) {
			var selected;
			inspected[dataType] = true;
			jQuery.each(structure[dataType] || [], function (_, prefilterOrFactory) {
				var dataTypeOrTransport = prefilterOrFactory(options, originalOptions, jqXHR);
				if (typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[dataTypeOrTransport]) {

					options.dataTypes.unshift(dataTypeOrTransport);
					inspect(dataTypeOrTransport);
					return false;
				} else if (seekingTransport) {
					return !(selected = dataTypeOrTransport);
				}
			});
			return selected;
		}

		return inspect(options.dataTypes[0]) || !inspected["*"] && inspect("*");
	}

	// A special extend for ajax options
	// that takes "flat" options (not to be deep extended)
	// Fixes #9887
	function ajaxExtend(target, src) {
		var key,
		    deep,
		    flatOptions = jQuery.ajaxSettings.flatOptions || {};

		for (key in src) {
			if (src[key] !== undefined) {
				(flatOptions[key] ? target : deep || (deep = {}))[key] = src[key];
			}
		}
		if (deep) {
			jQuery.extend(true, target, deep);
		}

		return target;
	}

	/* Handles responses to an ajax request:
  * - finds the right dataType (mediates between content-type and expected dataType)
  * - returns the corresponding response
  */
	function ajaxHandleResponses(s, jqXHR, responses) {

		var ct,
		    type,
		    finalDataType,
		    firstDataType,
		    contents = s.contents,
		    dataTypes = s.dataTypes;

		// Remove auto dataType and get content-type in the process
		while (dataTypes[0] === "*") {
			dataTypes.shift();
			if (ct === undefined) {
				ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
			}
		}

		// Check if we're dealing with a known content-type
		if (ct) {
			for (type in contents) {
				if (contents[type] && contents[type].test(ct)) {
					dataTypes.unshift(type);
					break;
				}
			}
		}

		// Check to see if we have a response for the expected dataType
		if (dataTypes[0] in responses) {
			finalDataType = dataTypes[0];
		} else {

			// Try convertible dataTypes
			for (type in responses) {
				if (!dataTypes[0] || s.converters[type + " " + dataTypes[0]]) {
					finalDataType = type;
					break;
				}
				if (!firstDataType) {
					firstDataType = type;
				}
			}

			// Or just use first one
			finalDataType = finalDataType || firstDataType;
		}

		// If we found a dataType
		// We add the dataType to the list if needed
		// and return the corresponding response
		if (finalDataType) {
			if (finalDataType !== dataTypes[0]) {
				dataTypes.unshift(finalDataType);
			}
			return responses[finalDataType];
		}
	}

	/* Chain conversions given the request and the original response
  * Also sets the responseXXX fields on the jqXHR instance
  */
	function ajaxConvert(s, response, jqXHR, isSuccess) {
		var conv2,
		    current,
		    conv,
		    tmp,
		    prev,
		    converters = {},


		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

		// Create converters map with lowercased keys
		if (dataTypes[1]) {
			for (conv in s.converters) {
				converters[conv.toLowerCase()] = s.converters[conv];
			}
		}

		current = dataTypes.shift();

		// Convert to each sequential dataType
		while (current) {

			if (s.responseFields[current]) {
				jqXHR[s.responseFields[current]] = response;
			}

			// Apply the dataFilter if provided
			if (!prev && isSuccess && s.dataFilter) {
				response = s.dataFilter(response, s.dataType);
			}

			prev = current;
			current = dataTypes.shift();

			if (current) {

				// There's only work to do if current dataType is non-auto
				if (current === "*") {

					current = prev;

					// Convert response if prev dataType is non-auto and differs from current
				} else if (prev !== "*" && prev !== current) {

					// Seek a direct converter
					conv = converters[prev + " " + current] || converters["* " + current];

					// If none found, seek a pair
					if (!conv) {
						for (conv2 in converters) {

							// If conv2 outputs current
							tmp = conv2.split(" ");
							if (tmp[1] === current) {

								// If prev can be converted to accepted input
								conv = converters[prev + " " + tmp[0]] || converters["* " + tmp[0]];
								if (conv) {

									// Condense equivalence converters
									if (conv === true) {
										conv = converters[conv2];

										// Otherwise, insert the intermediate dataType
									} else if (converters[conv2] !== true) {
										current = tmp[0];
										dataTypes.unshift(tmp[1]);
									}
									break;
								}
							}
						}
					}

					// Apply converter (if not an equivalence)
					if (conv !== true) {

						// Unless errors are allowed to bubble, catch and return them
						if (conv && s.throws) {
							response = conv(response);
						} else {
							try {
								response = conv(response);
							} catch (e) {
								return {
									state: "parsererror",
									error: conv ? e : "No conversion from " + prev + " to " + current
								};
							}
						}
					}
				}
			}
		}

		return { state: "success", data: response };
	}

	jQuery.extend({

		// Counter for holding the number of active queries
		active: 0,

		// Last-Modified header cache for next request
		lastModified: {},
		etag: {},

		ajaxSettings: {
			url: location.href,
			type: "GET",
			isLocal: rlocalProtocol.test(location.protocol),
			global: true,
			processData: true,
			async: true,
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",

			/*
   timeout: 0,
   data: null,
   dataType: null,
   username: null,
   password: null,
   cache: null,
   throws: false,
   traditional: false,
   headers: {},
   */

			accepts: {
				"*": allTypes,
				text: "text/plain",
				html: "text/html",
				xml: "application/xml, text/xml",
				json: "application/json, text/javascript"
			},

			contents: {
				xml: /\bxml\b/,
				html: /\bhtml/,
				json: /\bjson\b/
			},

			responseFields: {
				xml: "responseXML",
				text: "responseText",
				json: "responseJSON"
			},

			// Data converters
			// Keys separate source (or catchall "*") and destination types with a single space
			converters: {

				// Convert anything to text
				"* text": String,

				// Text to html (true = no transformation)
				"text html": true,

				// Evaluate text as a json expression
				"text json": JSON.parse,

				// Parse text as xml
				"text xml": jQuery.parseXML
			},

			// For options that shouldn't be deep extended:
			// you can add your own custom options here if
			// and when you create one that shouldn't be
			// deep extended (see ajaxExtend)
			flatOptions: {
				url: true,
				context: true
			}
		},

		// Creates a full fledged settings object into target
		// with both ajaxSettings and settings fields.
		// If target is omitted, writes into ajaxSettings.
		ajaxSetup: function ajaxSetup(target, settings) {
			return settings ?

			// Building a settings object
			ajaxExtend(ajaxExtend(target, jQuery.ajaxSettings), settings) :

			// Extending ajaxSettings
			ajaxExtend(jQuery.ajaxSettings, target);
		},

		ajaxPrefilter: addToPrefiltersOrTransports(prefilters),
		ajaxTransport: addToPrefiltersOrTransports(transports),

		// Main method
		ajax: function ajax(url, options) {

			// If url is an object, simulate pre-1.5 signature
			if ((typeof url === "undefined" ? "undefined" : _typeof(url)) === "object") {
				options = url;
				url = undefined;
			}

			// Force options to be an object
			options = options || {};

			var transport,


			// URL without anti-cache param
			cacheURL,


			// Response headers
			responseHeadersString,
			    responseHeaders,


			// timeout handle
			timeoutTimer,


			// Url cleanup var
			urlAnchor,


			// Request state (becomes false upon send and true upon completion)
			completed,


			// To know if global events are to be dispatched
			fireGlobals,


			// Loop variable
			i,


			// uncached part of the url
			uncached,


			// Create the final options object
			s = jQuery.ajaxSetup({}, options),


			// Callbacks context
			callbackContext = s.context || s,


			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && (callbackContext.nodeType || callbackContext.jquery) ? jQuery(callbackContext) : jQuery.event,


			// Deferreds
			deferred = jQuery.Deferred(),
			    completeDeferred = jQuery.Callbacks("once memory"),


			// Status-dependent callbacks
			_statusCode = s.statusCode || {},


			// Headers (they are sent all at once)
			requestHeaders = {},
			    requestHeadersNames = {},


			// Default abort message
			strAbort = "canceled",


			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function getResponseHeader(key) {
					var match;
					if (completed) {
						if (!responseHeaders) {
							responseHeaders = {};
							while (match = rheaders.exec(responseHeadersString)) {
								responseHeaders[match[1].toLowerCase() + " "] = (responseHeaders[match[1].toLowerCase() + " "] || []).concat(match[2]);
							}
						}
						match = responseHeaders[key.toLowerCase() + " "];
					}
					return match == null ? null : match.join(", ");
				},

				// Raw string
				getAllResponseHeaders: function getAllResponseHeaders() {
					return completed ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function setRequestHeader(name, value) {
					if (completed == null) {
						name = requestHeadersNames[name.toLowerCase()] = requestHeadersNames[name.toLowerCase()] || name;
						requestHeaders[name] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function overrideMimeType(type) {
					if (completed == null) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function statusCode(map) {
					var code;
					if (map) {
						if (completed) {

							// Execute the appropriate callbacks
							jqXHR.always(map[jqXHR.status]);
						} else {

							// Lazy-add the new callbacks in a way that preserves old ones
							for (code in map) {
								_statusCode[code] = [_statusCode[code], map[code]];
							}
						}
					}
					return this;
				},

				// Cancel the request
				abort: function abort(statusText) {
					var finalText = statusText || strAbort;
					if (transport) {
						transport.abort(finalText);
					}
					done(0, finalText);
					return this;
				}
			};

			// Attach deferreds
			deferred.promise(jqXHR);

			// Add protocol if not provided (prefilters might expect it)
			// Handle falsy url in the settings object (#10093: consistency with old signature)
			// We also use the url parameter if available
			s.url = ((url || s.url || location.href) + "").replace(rprotocol, location.protocol + "//");

			// Alias method option to type as per ticket #12004
			s.type = options.method || options.type || s.method || s.type;

			// Extract dataTypes list
			s.dataTypes = (s.dataType || "*").toLowerCase().match(rnothtmlwhite) || [""];

			// A cross-domain request is in order when the origin doesn't match the current origin.
			if (s.crossDomain == null) {
				urlAnchor = document.createElement("a");

				// Support: IE <=8 - 11, Edge 12 - 15
				// IE throws exception on accessing the href property if url is malformed,
				// e.g. http://example.com:80x/
				try {
					urlAnchor.href = s.url;

					// Support: IE <=8 - 11 only
					// Anchor's host property isn't correctly set when s.url is relative
					urlAnchor.href = urlAnchor.href;
					s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !== urlAnchor.protocol + "//" + urlAnchor.host;
				} catch (e) {

					// If there is an error parsing the URL, assume it is crossDomain,
					// it can be rejected by the transport if it is invalid
					s.crossDomain = true;
				}
			}

			// Convert data if not already a string
			if (s.data && s.processData && typeof s.data !== "string") {
				s.data = jQuery.param(s.data, s.traditional);
			}

			// Apply prefilters
			inspectPrefiltersOrTransports(prefilters, s, options, jqXHR);

			// If request was aborted inside a prefilter, stop there
			if (completed) {
				return jqXHR;
			}

			// We can fire global events as of now if asked to
			// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
			fireGlobals = jQuery.event && s.global;

			// Watch for a new set of requests
			if (fireGlobals && jQuery.active++ === 0) {
				jQuery.event.trigger("ajaxStart");
			}

			// Uppercase the type
			s.type = s.type.toUpperCase();

			// Determine if request has content
			s.hasContent = !rnoContent.test(s.type);

			// Save the URL in case we're toying with the If-Modified-Since
			// and/or If-None-Match header later on
			// Remove hash to simplify url manipulation
			cacheURL = s.url.replace(rhash, "");

			// More options handling for requests with no content
			if (!s.hasContent) {

				// Remember the hash so we can put it back
				uncached = s.url.slice(cacheURL.length);

				// If data is available and should be processed, append data to url
				if (s.data && (s.processData || typeof s.data === "string")) {
					cacheURL += (rquery.test(cacheURL) ? "&" : "?") + s.data;

					// #9682: remove data so that it's not used in an eventual retry
					delete s.data;
				}

				// Add or update anti-cache param if needed
				if (s.cache === false) {
					cacheURL = cacheURL.replace(rantiCache, "$1");
					uncached = (rquery.test(cacheURL) ? "&" : "?") + "_=" + nonce++ + uncached;
				}

				// Put hash and anti-cache on the URL that will be requested (gh-1732)
				s.url = cacheURL + uncached;

				// Change '%20' to '+' if this is encoded form body content (gh-2658)
			} else if (s.data && s.processData && (s.contentType || "").indexOf("application/x-www-form-urlencoded") === 0) {
				s.data = s.data.replace(r20, "+");
			}

			// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
			if (s.ifModified) {
				if (jQuery.lastModified[cacheURL]) {
					jqXHR.setRequestHeader("If-Modified-Since", jQuery.lastModified[cacheURL]);
				}
				if (jQuery.etag[cacheURL]) {
					jqXHR.setRequestHeader("If-None-Match", jQuery.etag[cacheURL]);
				}
			}

			// Set the correct header, if data is being sent
			if (s.data && s.hasContent && s.contentType !== false || options.contentType) {
				jqXHR.setRequestHeader("Content-Type", s.contentType);
			}

			// Set the Accepts header for the server, depending on the dataType
			jqXHR.setRequestHeader("Accept", s.dataTypes[0] && s.accepts[s.dataTypes[0]] ? s.accepts[s.dataTypes[0]] + (s.dataTypes[0] !== "*" ? ", " + allTypes + "; q=0.01" : "") : s.accepts["*"]);

			// Check for headers option
			for (i in s.headers) {
				jqXHR.setRequestHeader(i, s.headers[i]);
			}

			// Allow custom headers/mimetypes and early abort
			if (s.beforeSend && (s.beforeSend.call(callbackContext, jqXHR, s) === false || completed)) {

				// Abort if not done already and return
				return jqXHR.abort();
			}

			// Aborting is no longer a cancellation
			strAbort = "abort";

			// Install callbacks on deferreds
			completeDeferred.add(s.complete);
			jqXHR.done(s.success);
			jqXHR.fail(s.error);

			// Get transport
			transport = inspectPrefiltersOrTransports(transports, s, options, jqXHR);

			// If no transport, we auto-abort
			if (!transport) {
				done(-1, "No Transport");
			} else {
				jqXHR.readyState = 1;

				// Send global event
				if (fireGlobals) {
					globalEventContext.trigger("ajaxSend", [jqXHR, s]);
				}

				// If request was aborted inside ajaxSend, stop there
				if (completed) {
					return jqXHR;
				}

				// Timeout
				if (s.async && s.timeout > 0) {
					timeoutTimer = window.setTimeout(function () {
						jqXHR.abort("timeout");
					}, s.timeout);
				}

				try {
					completed = false;
					transport.send(requestHeaders, done);
				} catch (e) {

					// Rethrow post-completion exceptions
					if (completed) {
						throw e;
					}

					// Propagate others as results
					done(-1, e);
				}
			}

			// Callback for when everything is done
			function done(status, nativeStatusText, responses, headers) {
				var isSuccess,
				    success,
				    error,
				    response,
				    modified,
				    statusText = nativeStatusText;

				// Ignore repeat invocations
				if (completed) {
					return;
				}

				completed = true;

				// Clear timeout if it exists
				if (timeoutTimer) {
					window.clearTimeout(timeoutTimer);
				}

				// Dereference transport for early garbage collection
				// (no matter how long the jqXHR object will be used)
				transport = undefined;

				// Cache response headers
				responseHeadersString = headers || "";

				// Set readyState
				jqXHR.readyState = status > 0 ? 4 : 0;

				// Determine if successful
				isSuccess = status >= 200 && status < 300 || status === 304;

				// Get response data
				if (responses) {
					response = ajaxHandleResponses(s, jqXHR, responses);
				}

				// Convert no matter what (that way responseXXX fields are always set)
				response = ajaxConvert(s, response, jqXHR, isSuccess);

				// If successful, handle type chaining
				if (isSuccess) {

					// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
					if (s.ifModified) {
						modified = jqXHR.getResponseHeader("Last-Modified");
						if (modified) {
							jQuery.lastModified[cacheURL] = modified;
						}
						modified = jqXHR.getResponseHeader("etag");
						if (modified) {
							jQuery.etag[cacheURL] = modified;
						}
					}

					// if no content
					if (status === 204 || s.type === "HEAD") {
						statusText = "nocontent";

						// if not modified
					} else if (status === 304) {
						statusText = "notmodified";

						// If we have data, let's convert it
					} else {
						statusText = response.state;
						success = response.data;
						error = response.error;
						isSuccess = !error;
					}
				} else {

					// Extract error from statusText and normalize for non-aborts
					error = statusText;
					if (status || !statusText) {
						statusText = "error";
						if (status < 0) {
							status = 0;
						}
					}
				}

				// Set data for the fake xhr object
				jqXHR.status = status;
				jqXHR.statusText = (nativeStatusText || statusText) + "";

				// Success/Error
				if (isSuccess) {
					deferred.resolveWith(callbackContext, [success, statusText, jqXHR]);
				} else {
					deferred.rejectWith(callbackContext, [jqXHR, statusText, error]);
				}

				// Status-dependent callbacks
				jqXHR.statusCode(_statusCode);
				_statusCode = undefined;

				if (fireGlobals) {
					globalEventContext.trigger(isSuccess ? "ajaxSuccess" : "ajaxError", [jqXHR, s, isSuccess ? success : error]);
				}

				// Complete
				completeDeferred.fireWith(callbackContext, [jqXHR, statusText]);

				if (fireGlobals) {
					globalEventContext.trigger("ajaxComplete", [jqXHR, s]);

					// Handle the global AJAX counter
					if (! --jQuery.active) {
						jQuery.event.trigger("ajaxStop");
					}
				}
			}

			return jqXHR;
		},

		getJSON: function getJSON(url, data, callback) {
			return jQuery.get(url, data, callback, "json");
		},

		getScript: function getScript(url, callback) {
			return jQuery.get(url, undefined, callback, "script");
		}
	});

	jQuery.each(["get", "post"], function (i, method) {
		jQuery[method] = function (url, data, callback, type) {

			// Shift arguments if data argument was omitted
			if (isFunction(data)) {
				type = type || callback;
				callback = data;
				data = undefined;
			}

			// The url can be an options object (which then must have .url)
			return jQuery.ajax(jQuery.extend({
				url: url,
				type: method,
				dataType: type,
				data: data,
				success: callback
			}, jQuery.isPlainObject(url) && url));
		};
	});

	jQuery._evalUrl = function (url, options) {
		return jQuery.ajax({
			url: url,

			// Make this explicit, since user can override this through ajaxSetup (#11264)
			type: "GET",
			dataType: "script",
			cache: true,
			async: false,
			global: false,

			// Only evaluate the response if it is successful (gh-4126)
			// dataFilter is not invoked for failure responses, so using it instead
			// of the default converter is kludgy but it works.
			converters: {
				"text script": function textScript() {}
			},
			dataFilter: function dataFilter(response) {
				jQuery.globalEval(response, options);
			}
		});
	};

	jQuery.fn.extend({
		wrapAll: function wrapAll(html) {
			var wrap;

			if (this[0]) {
				if (isFunction(html)) {
					html = html.call(this[0]);
				}

				// The elements to wrap the target around
				wrap = jQuery(html, this[0].ownerDocument).eq(0).clone(true);

				if (this[0].parentNode) {
					wrap.insertBefore(this[0]);
				}

				wrap.map(function () {
					var elem = this;

					while (elem.firstElementChild) {
						elem = elem.firstElementChild;
					}

					return elem;
				}).append(this);
			}

			return this;
		},

		wrapInner: function wrapInner(html) {
			if (isFunction(html)) {
				return this.each(function (i) {
					jQuery(this).wrapInner(html.call(this, i));
				});
			}

			return this.each(function () {
				var self = jQuery(this),
				    contents = self.contents();

				if (contents.length) {
					contents.wrapAll(html);
				} else {
					self.append(html);
				}
			});
		},

		wrap: function wrap(html) {
			var htmlIsFunction = isFunction(html);

			return this.each(function (i) {
				jQuery(this).wrapAll(htmlIsFunction ? html.call(this, i) : html);
			});
		},

		unwrap: function unwrap(selector) {
			this.parent(selector).not("body").each(function () {
				jQuery(this).replaceWith(this.childNodes);
			});
			return this;
		}
	});

	jQuery.expr.pseudos.hidden = function (elem) {
		return !jQuery.expr.pseudos.visible(elem);
	};
	jQuery.expr.pseudos.visible = function (elem) {
		return !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
	};

	jQuery.ajaxSettings.xhr = function () {
		try {
			return new window.XMLHttpRequest();
		} catch (e) {}
	};

	var xhrSuccessStatus = {

		// File protocol always yields status code 0, assume 200
		0: 200,

		// Support: IE <=9 only
		// #1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	    xhrSupported = jQuery.ajaxSettings.xhr();

	support.cors = !!xhrSupported && "withCredentials" in xhrSupported;
	support.ajax = xhrSupported = !!xhrSupported;

	jQuery.ajaxTransport(function (options) {
		var _callback, errorCallback;

		// Cross domain only allowed if supported through XMLHttpRequest
		if (support.cors || xhrSupported && !options.crossDomain) {
			return {
				send: function send(headers, complete) {
					var i,
					    xhr = options.xhr();

					xhr.open(options.type, options.url, options.async, options.username, options.password);

					// Apply custom fields if provided
					if (options.xhrFields) {
						for (i in options.xhrFields) {
							xhr[i] = options.xhrFields[i];
						}
					}

					// Override mime type if needed
					if (options.mimeType && xhr.overrideMimeType) {
						xhr.overrideMimeType(options.mimeType);
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if (!options.crossDomain && !headers["X-Requested-With"]) {
						headers["X-Requested-With"] = "XMLHttpRequest";
					}

					// Set headers
					for (i in headers) {
						xhr.setRequestHeader(i, headers[i]);
					}

					// Callback
					_callback = function callback(type) {
						return function () {
							if (_callback) {
								_callback = errorCallback = xhr.onload = xhr.onerror = xhr.onabort = xhr.ontimeout = xhr.onreadystatechange = null;

								if (type === "abort") {
									xhr.abort();
								} else if (type === "error") {

									// Support: IE <=9 only
									// On a manual native abort, IE9 throws
									// errors on any property access that is not readyState
									if (typeof xhr.status !== "number") {
										complete(0, "error");
									} else {
										complete(

										// File: protocol always yields status 0; see #8605, #14207
										xhr.status, xhr.statusText);
									}
								} else {
									complete(xhrSuccessStatus[xhr.status] || xhr.status, xhr.statusText,

									// Support: IE <=9 only
									// IE9 has no XHR2 but throws on binary (trac-11426)
									// For XHR2 non-text, let the caller handle it (gh-2498)
									(xhr.responseType || "text") !== "text" || typeof xhr.responseText !== "string" ? { binary: xhr.response } : { text: xhr.responseText }, xhr.getAllResponseHeaders());
								}
							}
						};
					};

					// Listen to events
					xhr.onload = _callback();
					errorCallback = xhr.onerror = xhr.ontimeout = _callback("error");

					// Support: IE 9 only
					// Use onreadystatechange to replace onabort
					// to handle uncaught aborts
					if (xhr.onabort !== undefined) {
						xhr.onabort = errorCallback;
					} else {
						xhr.onreadystatechange = function () {

							// Check readyState before timeout as it changes
							if (xhr.readyState === 4) {

								// Allow onerror to be called first,
								// but that will not handle a native abort
								// Also, save errorCallback to a variable
								// as xhr.onerror cannot be accessed
								window.setTimeout(function () {
									if (_callback) {
										errorCallback();
									}
								});
							}
						};
					}

					// Create the abort callback
					_callback = _callback("abort");

					try {

						// Do send the request (this may raise an exception)
						xhr.send(options.hasContent && options.data || null);
					} catch (e) {

						// #14683: Only rethrow if this hasn't been notified as an error yet
						if (_callback) {
							throw e;
						}
					}
				},

				abort: function abort() {
					if (_callback) {
						_callback();
					}
				}
			};
		}
	});

	// Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)
	jQuery.ajaxPrefilter(function (s) {
		if (s.crossDomain) {
			s.contents.script = false;
		}
	});

	// Install script dataType
	jQuery.ajaxSetup({
		accepts: {
			script: "text/javascript, application/javascript, " + "application/ecmascript, application/x-ecmascript"
		},
		contents: {
			script: /\b(?:java|ecma)script\b/
		},
		converters: {
			"text script": function textScript(text) {
				jQuery.globalEval(text);
				return text;
			}
		}
	});

	// Handle cache's special case and crossDomain
	jQuery.ajaxPrefilter("script", function (s) {
		if (s.cache === undefined) {
			s.cache = false;
		}
		if (s.crossDomain) {
			s.type = "GET";
		}
	});

	// Bind script tag hack transport
	jQuery.ajaxTransport("script", function (s) {

		// This transport only deals with cross domain or forced-by-attrs requests
		if (s.crossDomain || s.scriptAttrs) {
			var script, _callback2;
			return {
				send: function send(_, complete) {
					script = jQuery("<script>").attr(s.scriptAttrs || {}).prop({ charset: s.scriptCharset, src: s.url }).on("load error", _callback2 = function callback(evt) {
						script.remove();
						_callback2 = null;
						if (evt) {
							complete(evt.type === "error" ? 404 : 200, evt.type);
						}
					});

					// Use native DOM manipulation to avoid our domManip AJAX trickery
					document.head.appendChild(script[0]);
				},
				abort: function abort() {
					if (_callback2) {
						_callback2();
					}
				}
			};
		}
	});

	var oldCallbacks = [],
	    rjsonp = /(=)\?(?=&|$)|\?\?/;

	// Default jsonp settings
	jQuery.ajaxSetup({
		jsonp: "callback",
		jsonpCallback: function jsonpCallback() {
			var callback = oldCallbacks.pop() || jQuery.expando + "_" + nonce++;
			this[callback] = true;
			return callback;
		}
	});

	// Detect, normalize options and install callbacks for jsonp requests
	jQuery.ajaxPrefilter("json jsonp", function (s, originalSettings, jqXHR) {

		var callbackName,
		    overwritten,
		    responseContainer,
		    jsonProp = s.jsonp !== false && (rjsonp.test(s.url) ? "url" : typeof s.data === "string" && (s.contentType || "").indexOf("application/x-www-form-urlencoded") === 0 && rjsonp.test(s.data) && "data");

		// Handle iff the expected data type is "jsonp" or we have a parameter to set
		if (jsonProp || s.dataTypes[0] === "jsonp") {

			// Get callback name, remembering preexisting value associated with it
			callbackName = s.jsonpCallback = isFunction(s.jsonpCallback) ? s.jsonpCallback() : s.jsonpCallback;

			// Insert callback into url or form data
			if (jsonProp) {
				s[jsonProp] = s[jsonProp].replace(rjsonp, "$1" + callbackName);
			} else if (s.jsonp !== false) {
				s.url += (rquery.test(s.url) ? "&" : "?") + s.jsonp + "=" + callbackName;
			}

			// Use data converter to retrieve json after script execution
			s.converters["script json"] = function () {
				if (!responseContainer) {
					jQuery.error(callbackName + " was not called");
				}
				return responseContainer[0];
			};

			// Force json dataType
			s.dataTypes[0] = "json";

			// Install callback
			overwritten = window[callbackName];
			window[callbackName] = function () {
				responseContainer = arguments;
			};

			// Clean-up function (fires after converters)
			jqXHR.always(function () {

				// If previous value didn't exist - remove it
				if (overwritten === undefined) {
					jQuery(window).removeProp(callbackName);

					// Otherwise restore preexisting value
				} else {
					window[callbackName] = overwritten;
				}

				// Save back as free
				if (s[callbackName]) {

					// Make sure that re-using the options doesn't screw things around
					s.jsonpCallback = originalSettings.jsonpCallback;

					// Save the callback name for future use
					oldCallbacks.push(callbackName);
				}

				// Call if it was a function and we have a response
				if (responseContainer && isFunction(overwritten)) {
					overwritten(responseContainer[0]);
				}

				responseContainer = overwritten = undefined;
			});

			// Delegate to script
			return "script";
		}
	});

	// Support: Safari 8 only
	// In Safari 8 documents created via document.implementation.createHTMLDocument
	// collapse sibling forms: the second one becomes a child of the first one.
	// Because of that, this security measure has to be disabled in Safari 8.
	// https://bugs.webkit.org/show_bug.cgi?id=137337
	support.createHTMLDocument = function () {
		var body = document.implementation.createHTMLDocument("").body;
		body.innerHTML = "<form></form><form></form>";
		return body.childNodes.length === 2;
	}();

	// Argument "data" should be string of html
	// context (optional): If specified, the fragment will be created in this context,
	// defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	jQuery.parseHTML = function (data, context, keepScripts) {
		if (typeof data !== "string") {
			return [];
		}
		if (typeof context === "boolean") {
			keepScripts = context;
			context = false;
		}

		var base, parsed, scripts;

		if (!context) {

			// Stop scripts or inline event handlers from being executed immediately
			// by using document.implementation
			if (support.createHTMLDocument) {
				context = document.implementation.createHTMLDocument("");

				// Set the base href for the created document
				// so any parsed elements with URLs
				// are based on the document's URL (gh-2965)
				base = context.createElement("base");
				base.href = document.location.href;
				context.head.appendChild(base);
			} else {
				context = document;
			}
		}

		parsed = rsingleTag.exec(data);
		scripts = !keepScripts && [];

		// Single tag
		if (parsed) {
			return [context.createElement(parsed[1])];
		}

		parsed = buildFragment([data], context, scripts);

		if (scripts && scripts.length) {
			jQuery(scripts).remove();
		}

		return jQuery.merge([], parsed.childNodes);
	};

	/**
  * Load a url into a page
  */
	jQuery.fn.load = function (url, params, callback) {
		var selector,
		    type,
		    response,
		    self = this,
		    off = url.indexOf(" ");

		if (off > -1) {
			selector = stripAndCollapse(url.slice(off));
			url = url.slice(0, off);
		}

		// If it's a function
		if (isFunction(params)) {

			// We assume that it's the callback
			callback = params;
			params = undefined;

			// Otherwise, build a param string
		} else if (params && (typeof params === "undefined" ? "undefined" : _typeof(params)) === "object") {
			type = "POST";
		}

		// If we have elements to modify, make the request
		if (self.length > 0) {
			jQuery.ajax({
				url: url,

				// If "type" variable is undefined, then "GET" method will be used.
				// Make value of this field explicit since
				// user can override it through ajaxSetup method
				type: type || "GET",
				dataType: "html",
				data: params
			}).done(function (responseText) {

				// Save response for use in complete callback
				response = arguments;

				self.html(selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append(jQuery.parseHTML(responseText)).find(selector) :

				// Otherwise use the full result
				responseText);

				// If the request succeeds, this function gets "data", "status", "jqXHR"
				// but they are ignored because response was set above.
				// If it fails, this function gets "jqXHR", "status", "error"
			}).always(callback && function (jqXHR, status) {
				self.each(function () {
					callback.apply(this, response || [jqXHR.responseText, status, jqXHR]);
				});
			});
		}

		return this;
	};

	// Attach a bunch of functions for handling common AJAX events
	jQuery.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function (i, type) {
		jQuery.fn[type] = function (fn) {
			return this.on(type, fn);
		};
	});

	jQuery.expr.pseudos.animated = function (elem) {
		return jQuery.grep(jQuery.timers, function (fn) {
			return elem === fn.elem;
		}).length;
	};

	jQuery.offset = {
		setOffset: function setOffset(elem, options, i) {
			var curPosition,
			    curLeft,
			    curCSSTop,
			    curTop,
			    curOffset,
			    curCSSLeft,
			    calculatePosition,
			    position = jQuery.css(elem, "position"),
			    curElem = jQuery(elem),
			    props = {};

			// Set position first, in-case top/left are set even on static elem
			if (position === "static") {
				elem.style.position = "relative";
			}

			curOffset = curElem.offset();
			curCSSTop = jQuery.css(elem, "top");
			curCSSLeft = jQuery.css(elem, "left");
			calculatePosition = (position === "absolute" || position === "fixed") && (curCSSTop + curCSSLeft).indexOf("auto") > -1;

			// Need to be able to calculate position if either
			// top or left is auto and position is either absolute or fixed
			if (calculatePosition) {
				curPosition = curElem.position();
				curTop = curPosition.top;
				curLeft = curPosition.left;
			} else {
				curTop = parseFloat(curCSSTop) || 0;
				curLeft = parseFloat(curCSSLeft) || 0;
			}

			if (isFunction(options)) {

				// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
				options = options.call(elem, i, jQuery.extend({}, curOffset));
			}

			if (options.top != null) {
				props.top = options.top - curOffset.top + curTop;
			}
			if (options.left != null) {
				props.left = options.left - curOffset.left + curLeft;
			}

			if ("using" in options) {
				options.using.call(elem, props);
			} else {
				curElem.css(props);
			}
		}
	};

	jQuery.fn.extend({

		// offset() relates an element's border box to the document origin
		offset: function offset(options) {

			// Preserve chaining for setter
			if (arguments.length) {
				return options === undefined ? this : this.each(function (i) {
					jQuery.offset.setOffset(this, options, i);
				});
			}

			var rect,
			    win,
			    elem = this[0];

			if (!elem) {
				return;
			}

			// Return zeros for disconnected and hidden (display: none) elements (gh-2310)
			// Support: IE <=11 only
			// Running getBoundingClientRect on a
			// disconnected node in IE throws an error
			if (!elem.getClientRects().length) {
				return { top: 0, left: 0 };
			}

			// Get document-relative position by adding viewport scroll to viewport-relative gBCR
			rect = elem.getBoundingClientRect();
			win = elem.ownerDocument.defaultView;
			return {
				top: rect.top + win.pageYOffset,
				left: rect.left + win.pageXOffset
			};
		},

		// position() relates an element's margin box to its offset parent's padding box
		// This corresponds to the behavior of CSS absolute positioning
		position: function position() {
			if (!this[0]) {
				return;
			}

			var offsetParent,
			    offset,
			    doc,
			    elem = this[0],
			    parentOffset = { top: 0, left: 0 };

			// position:fixed elements are offset from the viewport, which itself always has zero offset
			if (jQuery.css(elem, "position") === "fixed") {

				// Assume position:fixed implies availability of getBoundingClientRect
				offset = elem.getBoundingClientRect();
			} else {
				offset = this.offset();

				// Account for the *real* offset parent, which can be the document or its root element
				// when a statically positioned element is identified
				doc = elem.ownerDocument;
				offsetParent = elem.offsetParent || doc.documentElement;
				while (offsetParent && (offsetParent === doc.body || offsetParent === doc.documentElement) && jQuery.css(offsetParent, "position") === "static") {

					offsetParent = offsetParent.parentNode;
				}
				if (offsetParent && offsetParent !== elem && offsetParent.nodeType === 1) {

					// Incorporate borders into its offset, since they are outside its content origin
					parentOffset = jQuery(offsetParent).offset();
					parentOffset.top += jQuery.css(offsetParent, "borderTopWidth", true);
					parentOffset.left += jQuery.css(offsetParent, "borderLeftWidth", true);
				}
			}

			// Subtract parent offsets and element margins
			return {
				top: offset.top - parentOffset.top - jQuery.css(elem, "marginTop", true),
				left: offset.left - parentOffset.left - jQuery.css(elem, "marginLeft", true)
			};
		},

		// This method will return documentElement in the following cases:
		// 1) For the element inside the iframe without offsetParent, this method will return
		//    documentElement of the parent window
		// 2) For the hidden or detached element
		// 3) For body or html element, i.e. in case of the html node - it will return itself
		//
		// but those exceptions were never presented as a real life use-cases
		// and might be considered as more preferable results.
		//
		// This logic, however, is not guaranteed and can change at any point in the future
		offsetParent: function offsetParent() {
			return this.map(function () {
				var offsetParent = this.offsetParent;

				while (offsetParent && jQuery.css(offsetParent, "position") === "static") {
					offsetParent = offsetParent.offsetParent;
				}

				return offsetParent || documentElement;
			});
		}
	});

	// Create scrollLeft and scrollTop methods
	jQuery.each({ scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function (method, prop) {
		var top = "pageYOffset" === prop;

		jQuery.fn[method] = function (val) {
			return access(this, function (elem, method, val) {

				// Coalesce documents and windows
				var win;
				if (isWindow(elem)) {
					win = elem;
				} else if (elem.nodeType === 9) {
					win = elem.defaultView;
				}

				if (val === undefined) {
					return win ? win[prop] : elem[method];
				}

				if (win) {
					win.scrollTo(!top ? val : win.pageXOffset, top ? val : win.pageYOffset);
				} else {
					elem[method] = val;
				}
			}, method, val, arguments.length);
		};
	});

	// Support: Safari <=7 - 9.1, Chrome <=37 - 49
	// Add the top/left cssHooks using jQuery.fn.position
	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
	// getComputedStyle returns percent when specified for top/left/bottom/right;
	// rather than make the css module depend on the offset module, just check for it here
	jQuery.each(["top", "left"], function (i, prop) {
		jQuery.cssHooks[prop] = addGetHookIf(support.pixelPosition, function (elem, computed) {
			if (computed) {
				computed = curCSS(elem, prop);

				// If curCSS returns percentage, fallback to offset
				return rnumnonpx.test(computed) ? jQuery(elem).position()[prop] + "px" : computed;
			}
		});
	});

	// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
	jQuery.each({ Height: "height", Width: "width" }, function (name, type) {
		jQuery.each({ padding: "inner" + name, content: type, "": "outer" + name }, function (defaultExtra, funcName) {

			// Margin is only for outerHeight, outerWidth
			jQuery.fn[funcName] = function (margin, value) {
				var chainable = arguments.length && (defaultExtra || typeof margin !== "boolean"),
				    extra = defaultExtra || (margin === true || value === true ? "margin" : "border");

				return access(this, function (elem, type, value) {
					var doc;

					if (isWindow(elem)) {

						// $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
						return funcName.indexOf("outer") === 0 ? elem["inner" + name] : elem.document.documentElement["client" + name];
					}

					// Get document width or height
					if (elem.nodeType === 9) {
						doc = elem.documentElement;

						// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
						// whichever is greatest
						return Math.max(elem.body["scroll" + name], doc["scroll" + name], elem.body["offset" + name], doc["offset" + name], doc["client" + name]);
					}

					return value === undefined ?

					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css(elem, type, extra) :

					// Set width or height on the element
					jQuery.style(elem, type, value, extra);
				}, type, chainable ? margin : undefined, chainable);
			};
		});
	});

	jQuery.each(("blur focus focusin focusout resize scroll click dblclick " + "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " + "change select submit keydown keypress keyup contextmenu").split(" "), function (i, name) {

		// Handle event binding
		jQuery.fn[name] = function (data, fn) {
			return arguments.length > 0 ? this.on(name, null, data, fn) : this.trigger(name);
		};
	});

	jQuery.fn.extend({
		hover: function hover(fnOver, fnOut) {
			return this.mouseenter(fnOver).mouseleave(fnOut || fnOver);
		}
	});

	jQuery.fn.extend({

		bind: function bind(types, data, fn) {
			return this.on(types, null, data, fn);
		},
		unbind: function unbind(types, fn) {
			return this.off(types, null, fn);
		},

		delegate: function delegate(selector, types, data, fn) {
			return this.on(types, selector, data, fn);
		},
		undelegate: function undelegate(selector, types, fn) {

			// ( namespace ) or ( selector, types [, fn] )
			return arguments.length === 1 ? this.off(selector, "**") : this.off(types, selector || "**", fn);
		}
	});

	// Bind a function to a context, optionally partially applying any
	// arguments.
	// jQuery.proxy is deprecated to promote standards (specifically Function#bind)
	// However, it is not slated for removal any time soon
	jQuery.proxy = function (fn, context) {
		var tmp, args, proxy;

		if (typeof context === "string") {
			tmp = fn[context];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if (!isFunction(fn)) {
			return undefined;
		}

		// Simulated bind
		args = _slice.call(arguments, 2);
		proxy = function proxy() {
			return fn.apply(context || this, args.concat(_slice.call(arguments)));
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	};

	jQuery.holdReady = function (hold) {
		if (hold) {
			jQuery.readyWait++;
		} else {
			jQuery.ready(true);
		}
	};
	jQuery.isArray = Array.isArray;
	jQuery.parseJSON = JSON.parse;
	jQuery.nodeName = nodeName;
	jQuery.isFunction = isFunction;
	jQuery.isWindow = isWindow;
	jQuery.camelCase = camelCase;
	jQuery.type = toType;

	jQuery.now = Date.now;

	jQuery.isNumeric = function (obj) {

		// As of jQuery 3.0, isNumeric is limited to
		// strings and numbers (primitives or objects)
		// that can be coerced to finite numbers (gh-2662)
		var type = jQuery.type(obj);
		return (type === "number" || type === "string") &&

		// parseFloat NaNs numeric-cast false positives ("")
		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
		// subtraction forces infinities to NaN
		!isNaN(obj - parseFloat(obj));
	};

	// Register as a named AMD module, since jQuery can be concatenated with other
	// files that may use define, but not via a proper concatenation script that
	// understands anonymous AMD modules. A named AMD is safest and most robust
	// way to register. Lowercase jquery is used because AMD module names are
	// derived from file names, and jQuery is normally delivered in a lowercase
	// file name. Do this after creating the global so that if an AMD module wants
	// to call noConflict to hide this version of jQuery, it will work.

	// Note that for maximum portability, libraries that are not jQuery should
	// declare themselves as anonymous modules, and avoid setting a global if an
	// AMD loader is present. jQuery is a special case. For more information, see
	// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

	if (true) {
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
			return jQuery;
		}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}

	var

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,


	// Map over the $ in case of overwrite
	_$ = window.$;

	jQuery.noConflict = function (deep) {
		if (window.$ === jQuery) {
			window.$ = _$;
		}

		if (deep && window.jQuery === jQuery) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	};

	// Expose jQuery and $ identifiers, even in AMD
	// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
	// and CommonJS for browser emulators (#13566)
	if (!noGlobal) {
		window.jQuery = window.$ = jQuery;
	}

	return jQuery;
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)(module)))

/***/ }),
/* 2 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var g;

// This works in non-strict mode
g = function () {
	return this;
}();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
	// This works if the window reference is available
	if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function () {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function get() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function get() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(2);
var avalon = __webpack_require__(0);
var $ = __webpack_require__(1);

window.avalonRoot = avalon.define({
    $id: "app",
    user: {
        userid: "",
        status: "viewer",
        userData: {
            username: "游客",
            userImage: ""
        }
    },
    msgData: {
        color: "#333333",
        message: ""
    },
    dialog: {
        username: ""
    },
    userList: {
        kp: null,
        pcs: [],
        viewers: []
    },
    messageList: [],
    noteList: [],
    ws: "",
    roll: {
        time: "1",
        num: "100",
        stime: "1",
        snum: "100"
    },
    init: function init() {
        var self = this;
        window.ws = io('http://localhost:10080');
        // window.ws = io('http://'+window.location.host+':10080');
        ws.on('connect', function () {});
        ws.on('init', function (res) {
            self.user.userid = res.userid;
            self.joinRoom();
        });
        ws.on('freshUser', function (res) {
            self.user = res.data;
        });
        ws.on('message', function (res) {
            self.getMessage(res);
        });
        ws.on('userUpdate', function (res) {
            self.user = res;
        });
        ws.on('messageList', function (res) {
            self.messageList = res.data;
            $(".messageList").animate({ scrollTop: $(".messageList").prop("scrollHeight") }, 200);
        });
        ws.on('userList', function (res) {
            var list = res.data;
            var pcs = [];
            var viewers = [];
            var kp = null;
            for (var i = 0; i < list.length; i++) {
                if (list[i].status == 'kp') {
                    kp = list[i];
                } else if (list[i].status == 'pc') {
                    pcs.push(list[i]);
                } else {
                    viewers.push(list[i]);
                }
            }
            self.userList.kp = kp;
            self.userList.pcs = pcs;
            self.userList.viewers = viewers;
        });
        self.getUserList();
        self.getMessageList();
        self.resizeWindow();
        $(window).resize(self.resizeWindow);

        window.onpagehide = function () {
            alert(1);
        };
    },
    resizeWindow: function resizeWindow() {
        var htmlWidth = document.documentElement.clientWidth || document.body.clientWidth;
        var htmlDom = document.getElementsByTagName('html')[0];
        htmlDom.style.fontSize = htmlWidth / 24 + 'px';
    },
    joinRoom: function joinRoom() {
        var self = this;
        ws.emit('join', self.user);
    },
    joinGame: function joinGame() {
        var self = this;
        var params = {
            user: self.user,
            questType: "joinGame"
        };
        ws.emit('newQuest', self.user);
    },
    sendMessage: function sendMessage() {
        var self = this;
        if (self.msgData.message == "") {
            return false;
        }
        var param = {
            userid: self.user.userid,
            username: self.user.userData.username,
            message: self.msgData.message
        };

        ws.emit('message', param);
        setTimeout(function () {
            self.msgData.message = "";
        }, 50);
        return false;
    },
    getMessage: function getMessage(data) {
        this.messageList.push(data);
        $(".messageList").animate({ scrollTop: $(".messageList").prop("scrollHeight") }, 200);
    },
    getUserList: function getUserList() {
        ws.emit('userList', {});
    },
    getMessageList: function getMessageList() {
        ws.emit('messageList', {});
    },
    rd: function rd(num, sec) {
        var self = this;
        var param = {
            time: 1,
            userid: self.user.userid,
            username: self.user.userData.username,
            num: num,
            sec: sec
        };
        ws.emit('roll', param);
    },
    mrd: function mrd(e, sec) {
        var target = e.target;
        if (target.nodeName == "INPUT") {
            return;
        }
        var self = this;
        var time = void 0,
            num = void 0;
        if (sec == 1) {
            time = self.roll.stime;
            num = self.roll.snum;
        } else {
            time = self.roll.time;
            num = self.roll.num;
        }
        var param = {
            time: time,
            userid: self.user.userid,
            username: self.user.userData.username,
            num: num,
            sec: sec
        };
        ws.emit('roll', param);
    },
    rename: function rename() {

        var self = this;
        if (self.dialog.username == "") {
            return;
        }
        var param = {
            userid: self.user.userid,
            username: self.dialog.username
        };
        ws.emit('rename', param);
        self.hideDialog();
    },
    showUserMenu: function showUserMenu() {
        var self = this;
        $('.user-menu').slideDown();
        $('body').on('click', self.hideUserMenu);
    },
    hideUserMenu: function hideUserMenu() {
        $('.user-menu').slideUp();
        $('body').off('click');
    },
    showDialog: function showDialog() {
        this.hideUserMenu();
        $('.modal').show();
        $('.dialog').show();
        this.dialog.username = this.user.userData.username;
        $('#dialog-username').focus().select();
    },
    hideDialog: function hideDialog() {
        $('.modal').hide();
        $('.dialog').hide();
    },
    selectIpt: function selectIpt(e) {
        var target = e.target;
        $(target).select();
    }
});
avalonRoot.$watch('onReady', function () {
    var self = this;
    console.log(self.user);
    setTimeout(function () {
        self.init();
    }, 500);
});

/***/ })
/******/ ]);