(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["xduce"] = factory();
	else
		root["xduce"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

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

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 103);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isArray = undefined;

var _slicedToArray2 = __webpack_require__(5);

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _getPrototypeOf = __webpack_require__(62);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

exports.isFunction = isFunction;
exports.isObject = isObject;
exports.isNumber = isNumber;
exports.isString = isString;
exports.bmpCharAt = bmpCharAt;
exports.bmpLength = bmpLength;
exports.range = range;
exports.complement = complement;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright (c) 2017 Thomas Otterson
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// Object's toString is explicitly used throughout because it could be redefined in any subclass of Object
var toString = Object.prototype.toString;

// Determines whether an object is an array. This is a completely unnecessary function that is here only for
// consistency with the other type-checking functions below.

var isArray = Array.isArray;

// Determines whether an object is a function.

exports.isArray = isArray;
function isFunction(x) {
  return toString.call(x) === '[object Function]';
}

// Determines whether an object is a plain object. This returns `true` only for object literals and those created with
// the Object constructor; objects of other types will return `false`.
function isObject(x) {
  // This check is true on all objects, but also on all objects created by custom constructors (which we don't want)
  if (toString.call(x) !== '[object Object]') {
    return false;
  }

  // The Object prototype itself passes, along with objects created without a prototype from Object.create(null);
  var proto = (0, _getPrototypeOf2.default)(x);
  if (proto === null) {
    return true;
  }

  // Check to see whether the constructor of the tested object is the Object constructor, using the Function toString to
  // compare the constuctors' source code
  var functionToString = Function.prototype.toString;
  var ctor = Object.prototype.hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof ctor === 'function' && ctor instanceof ctor && functionToString.call(ctor) === functionToString.call(Object);
}

// Determines whether an object is a number. It must be either an actual number or a Number object to return `true`;
// strings that happen to be numbers still return `false`. Also, `NaN` and `Infinity` return `false`.
function isNumber(x) {
  return toString.call(x) === '[object Number]' && isFinite(x);
}

// Determines whether an object is a string.
function isString(x) {
  return toString.call(x) === '[object String]';
}

// The same as the basic JavaScript charAt function, except that it takes into account double-wide characters in the
// Basic Multilingual Plane (BMP). The index is adjusted to take into account such characters in the input string, and
// if the result character is double-wide, it will be returned in full (as a two-character string).
function bmpCharAt(str, index) {
  var s = str + '';
  var i = index;
  var end = s.length;

  var pairs = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
  while (pairs.exec(s)) {
    var li = pairs.lastIndex;
    if (li - 2 < i) {
      i++;
    } else {
      break;
    }
  }

  if (i >= end || i < 0) {
    return '';
  }

  var result = s.charAt(i);

  if (/[\uD800-\uDBFF]/.test(result) && /[\uDC00-\uDFFF]/.test(s.charAt(i + 1))) {
    result += s.charAt(i + 1);
  }

  return result;
}

// Returns the length of a string, taking into account any double-wide BMP characters that may be in the string. For
// example, if the string has one double-wide character, this function will return a number that is one less than the
// regular string `.length` property would.
function bmpLength(str) {
  var s = str + '';

  var matches = s.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g);
  var count = matches ? matches.length : 0;
  return s.length - count;
}

// Creates an array of integers from start to end - 1, where `start` is the first parameter and `end` is the second. If
// only one parameter is given, it's the end, and the start becomes 0. If a third parameter is supplied, it's the step
// between successive elements of the array. If the step is negative, or if the start is greater than the end, the array
// elements descend.
function range(start, end, step) {
  var _ref = end == null ? [0, start] : [start, end],
      _ref2 = (0, _slicedToArray3.default)(_ref, 2),
      s = _ref2[0],
      e = _ref2[1];

  var t = step || (s > e ? -1 : 1);

  var result = [];
  for (var i = s; t < 0 ? i > e : i < e; i += t) {
    result.push(i);
  }
  return result;
}

// Takes a predicate function and returns a function that takes the same arguments and returns the opposite result.
function complement(fn) {
  return function () {
    return !fn.apply(undefined, arguments);
  };
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.protocols = undefined;

var _iterator = __webpack_require__(66);

var _iterator2 = _interopRequireDefault(_iterator);

var _for = __webpack_require__(65);

var _for2 = _interopRequireDefault(_for);

var _symbol = __webpack_require__(64);

var _symbol2 = _interopRequireDefault(_symbol);

exports.isImplemented = isImplemented;

var _util = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var USE_SYMBOLS = false; /*
                          * Copyright (c) 2017 Thomas Otterson
                          *
                          * Permission is hereby granted, free of charge, to any person obtaining a copy of
                          * this software and associated documentation files (the "Software"), to deal in
                          * the Software without restriction, including without limitation the rights to
                          * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
                          * the Software, and to permit persons to whom the Software is furnished to do so,
                          * subject to the following conditions:
                          *
                          * The above copyright notice and this permission notice shall be included in all
                          * copies or substantial portions of the Software.
                          *
                          * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
                          * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
                          * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
                          * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
                          * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
                          * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
                          */

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// protocol.js
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Protocols for iteration and reduction. The source for these protocols depends on which protocol it is.
//
// Iteration: a part of the ES6 standard.
// Transduction: agreed to by several parties who maintain transducer libraries in the comment thread for an issue on
//     one of them (https://github.com/cognitect-labs/transducers-js/issues/20).

var symbol = typeof _symbol2.default !== 'undefined';

// Generation of the key used on an object to store a protocol function. This is a symbol if symbols are available and
// USE_SYMBOLS (above) is set to true; if not, it's a regular string. If a symbol of the supplied name already exists,
// it'll be used instead of having a new one generated.
function generateKey(name) {
  return USE_SYMBOLS && symbol ? (0, _for2.default)(name) : '@@' + name;
}

var protocols = exports.protocols = {
  // Since this one is built in, it already has a custom Symbol property, so we don't need to generate a symbol for a
  // key when symbols are supported.
  iterator: symbol ? _iterator2.default : '@@iterator',

  // Reduction protocols
  init: generateKey('transducer/init'),
  step: generateKey('transducer/step'),
  result: generateKey('transducer/result'),
  reduced: generateKey('transducer/reduced'),
  value: generateKey('transducer/value')
};

// Determines whether an object implements a given protocol. Generally, a protocol is implemented if the object has a
// function property with the name of that protocol (as given in the protocol object). For iteration, it's accepted that
// an object with a next() function is also an iterator, so we make a specific check for that.
//
// For the reduced and value protocols, the requirement that the property be a function is waived.
function isImplemented(obj, protocol) {
  if (obj == null) {
    return false;
  }
  switch (protocol) {
    case 'iterator':
      return (0, _util.isFunction)(obj[protocols.iterator] || obj.next);
    case 'reduced':
    case 'value':
      return protocols[protocol] in obj;
    default:
      return (0, _util.isFunction)(obj[protocols[protocol]]);
  }
}

/***/ }),
/* 2 */
/***/ (function(module, exports) {

var core = module.exports = {version: '2.4.0'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _defineProperty = __webpack_require__(61);

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (obj, key, value) {
  if (key in obj) {
    (0, _defineProperty2.default)(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = __webpack_require__(3);

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

exports.transduce = transduce;
exports.asArray = asArray;
exports.asObject = asObject;
exports.asString = asString;
exports.asIterator = asIterator;
exports.asReducible = asReducible;
exports.sequence = sequence;
exports.into = into;
exports.compose = compose;

var _protocol = __webpack_require__(1);

var _iteration = __webpack_require__(19);

var _reduction = __webpack_require__(13);

var _util = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// An iterator that also acts as a transformer, transforming its collection one element at a time. This is the actual
// output of the sequence function (when the input collection is an iterator) and the asIterator function.
//
// This object supports non-1-to-1 correspondences between input and output values. For example, a filter transformation
// might return fewer output elements than were in the input collection, while a repeat transformation will return more.
// In either case, `next` in this class will return one element per call.
/*
 * Copyright (c) 2017 Thomas Otterson
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// transformation.js
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var transformingIterator = function transformingIterator(collection, xform) {
  var _stepReducer, _ref2;

  var stepReducer = (_stepReducer = {}, (0, _defineProperty3.default)(_stepReducer, _protocol.protocols.step, function (xiter, input) {
    var value = (0, _iteration.isKvFormObject)(input) ? (0, _defineProperty3.default)({}, input.k, input.v) : input;
    xiter.items.unshift(value);
    return xiter;
  }), (0, _defineProperty3.default)(_stepReducer, _protocol.protocols.result, function (value) {
    return value;
  }), _stepReducer);

  return _ref2 = {
    // This array is the key to working properly with step functions that return more than one value. All of them are
    // put into the items array. As long as this array has values in it, the `next` function will return one value
    // popped from it rather than running the step function again.
    items: [],
    reduced: false,
    iter: (0, _iteration.iterator)(collection),
    xform: xform(stepReducer)

  }, (0, _defineProperty3.default)(_ref2, _protocol.protocols.iterator, function () {
    return this;
  }), (0, _defineProperty3.default)(_ref2, 'next', function next() {
    if (this.items.length === 0) {
      this.step();
    }
    if (this.items.length === 0) {
      return {
        done: true
      };
    }
    return {
      value: this.items.pop(),
      done: false
    };
  }), (0, _defineProperty3.default)(_ref2, 'step', function step() {
    var count = this.items.length;
    while (this.items.length === count) {
      var step = this.iter.next();
      if (step.done || this.reduced) {
        this.xform[_protocol.protocols.result](this);
        break;
      }
      this.reduced = (0, _reduction.isReduced)(this.xform[_protocol.protocols.step](this, step.value));
    }
  }), _ref2;
};

// While `reduce` is the core function, this is the one that will be called the most often. This one takes a transformer
// function and a reducer object and combines them into a transformer object suitable for `reduce`. It also ensures that
// there is a legitimate init object to reduce into.
//
// If the transformer function is null, the reducer will be used as the transformer. If no initial collection is
// supplied, it'll be taken from the reducers `init` protocol function.
//
// Without the transformer, this function basically becomes `reduce` with the ability to determine an initial collection
// from its reducer.
function transduce(collection, xform, reducer) {
  var init = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : reducer[_protocol.protocols.init]();

  var xf = xform ? xform(reducer) : reducer;
  return (0, _reduction.reduce)(collection, xf, init);
}

// Runs a collection through the supplied transformer, reducing the results into an array. If no transformer is
// supplied, the collection is simply reduced into an array as-is.
function asArray(collection, xform) {
  return transduce(collection, xform, _reduction.arrayReducer);
}

// Runs a collection through the supplied transformer, reducing the results into an object. In order for this to work,
// the object reducer assumes that it will be receiving elements that are objects in one of two forms: {key: value} or
// {k: key, v:value} (kv-form). Either will be reduced into {key: value}.
//
// If no transformer is supplied, the collection is simply reduced into an object, though there aren't many instances
// where this would make a lot of sense because no other collections can be converted into the format required here.
function asObject(collection, xform) {
  return transduce(collection, xform, _reduction.objectReducer);
}

// Runs a collection through the supplied transformer, reducing the results into a string. If no transformer is
// supplied, the collection is simply reduced into a string as-is.
function asString(collection, xform) {
  return transduce(collection, xform, _reduction.stringReducer);
}

// Runs a collection through the supplied transformer, reducing the results into an iterator. If no transformer is
// supplied, the collection is simply turned into an iterator as-is.
function asIterator(collection, xform) {
  return xform ? transformingIterator(collection, xform) : (0, _iteration.iterator)(collection, null, false);
}

// Runs a collection through the supplied transformer, reducing the results into a collection of the same kind. Since
// this function depends on the collection to determine the output collection type, this can't be used for conversion
// into a different type of collection.
function asReducible(collection, xform) {
  return transduce(collection, xform, collection);
}

// Takes a collection and a transformer and performs a transduction, returning a collection of the same kind.
function sequence(collection, xform) {
  switch (true) {
    case (0, _util.isArray)(collection):
      return asArray(collection, xform);
    case (0, _util.isObject)(collection):
      return asObject(collection, xform);
    case (0, _util.isString)(collection):
      return asString(collection, xform);
    case (0, _protocol.isImplemented)(collection, 'step'):
      return asReducible(collection, xform);
    case (0, _protocol.isImplemented)(collection, 'iterator'):
      return asIterator(collection, xform);
    default:
      throw Error('Cannot sequence collection: ' + collection);
  }
}

// Takes a collection and a transformer and performs a transduction, returning the result by appending it to the
// supplied target collection. In most cases, this will be an empty collection, but if a non-empty target is passed, its
// elements will remain in place and the value of the transduction appended.
function into(target, collection, xform) {
  switch (true) {
    case (0, _util.isArray)(target):
      return transduce(collection, xform, _reduction.arrayReducer, target);
    case (0, _util.isObject)(target):
      return transduce(collection, xform, _reduction.objectReducer, target);
    case (0, _util.isString)(target):
      return transduce(collection, xform, _reduction.stringReducer, target);
    case (0, _protocol.isImplemented)(target, 'step'):
      return transduce(collection, xform, target, target);
    default:
      throw Error('Cannot reduce collection into ' + target + ': ' + collection);
  }
}

// Composes multiple transformer functions into a single transformer function. Unlike most compose functions, this one
// works first-to-last: the first function is run first, passing its result to the second function, etc. This is because
// that's much more natural in working with transformers.
//
// This function is designed to work specifically with transformer functions. It depends on those functions taking
// another transformer function and chaining them together.
//
// Note that when using this with transduction functions, the result must be passed to a sequencing function (sequence,
// into, as-array, etc.). The composed function can only take one parameter, so it can't be used like the shortcut
// transducer functions.
function compose() {
  for (var _len = arguments.length, fns = Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  var reversedFns = fns.reverse();
  return function (value) {
    return reversedFns.reduce(function (acc, fn) {
      return fn(acc);
    }, value);
  };
}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _isIterable2 = __webpack_require__(60);

var _isIterable3 = _interopRequireDefault(_isIterable2);

var _getIterator2 = __webpack_require__(59);

var _getIterator3 = _interopRequireDefault(_getIterator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = (0, _getIterator3.default)(arr), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if ((0, _isIterable3.default)(Object(arr))) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var store      = __webpack_require__(31)('wks')
  , uid        = __webpack_require__(23)
  , Symbol     = __webpack_require__(7).Symbol
  , USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function(name){
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

/***/ }),
/* 7 */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(16)(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});

/***/ }),
/* 9 */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

var anObject       = __webpack_require__(15)
  , IE8_DOM_DEFINE = __webpack_require__(41)
  , toPrimitive    = __webpack_require__(34)
  , dP             = Object.defineProperty;

exports.f = __webpack_require__(8) ? Object.defineProperty : function defineProperty(O, P, Attributes){
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if(IE8_DOM_DEFINE)try {
    return dP(O, P, Attributes);
  } catch(e){ /* empty */ }
  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
  if('value' in Attributes)O[P] = Attributes.value;
  return O;
};

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(81)
  , defined = __webpack_require__(25);
module.exports = function(it){
  return IObject(defined(it));
};

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var dP         = __webpack_require__(10)
  , createDesc = __webpack_require__(22);
module.exports = __webpack_require__(8) ? function(object, key, value){
  return dP.f(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stringReducer = exports.objectReducer = exports.arrayReducer = undefined;

var _defineProperty2 = __webpack_require__(3);

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

exports.init = init;
exports.step = step;
exports.result = result;
exports.toReducer = toReducer;
exports.toFunction = toFunction;
exports.reduced = reduced;
exports.unreduced = unreduced;
exports.isReduced = isReduced;
exports.ensureReduced = ensureReduced;
exports.ensureUnreduced = ensureUnreduced;
exports.reduce = reduce;

var _util = __webpack_require__(0);

var _protocol = __webpack_require__(1);

var _iteration = __webpack_require__(19);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Returns an init function for a collection. This is a function that returns a new, empty instance of the collection in
// question. If the collection doesn't support reduction, `null` is returned. This makes conditionals a bit easier to
// work with.
//
// In order to support the conversion of functions into reducers, function support is also provided.
function init(collection) {
  switch (true) {
    case (0, _protocol.isImplemented)(collection, 'init'):
      return collection[_protocol.protocols.init];
    case (0, _util.isString)(collection):
      return function () {
        return '';
      };
    case (0, _util.isArray)(collection):
      return function () {
        return [];
      };
    case (0, _util.isObject)(collection):
      return function () {
        return {};
      };
    case (0, _util.isFunction)(collection):
      return function () {
        throw Error('init not available');
      };
    default:
      return null;
  }
}

// Returns a step function for a collection. This is a function that takes an accumulator and a value and returns the
// result of reducing the value into the accumulator. If the collection doesn't support reduction, `null` is returned.
//
// In order to support the conversion of functions into reducers, function support is also provided.
/*
 * Copyright (c) 2017 Thomas Otterson
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// reduction.js
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function step(collection) {
  switch (true) {

    case (0, _protocol.isImplemented)(collection, 'step'):
      return collection[_protocol.protocols.step];

    case (0, _util.isString)(collection):
      return function (acc, input) {
        var value = (0, _iteration.isKvFormObject)(input) ? input.v : input;
        return acc + value;
      };

    case (0, _util.isArray)(collection):
      return function (acc, input) {
        var value = (0, _iteration.isKvFormObject)(input) ? (0, _defineProperty3.default)({}, input.k, input.v) : input;
        acc.push(value);
        return acc;
      };

    case (0, _util.isObject)(collection):
      return function (acc, input) {
        // Would love to use a do expression here, but they don't currently play nice with object literals
        var value = input;

        if ((0, _iteration.isKvFormObject)(input)) {
          // if the object is kv-form, change the object from { k: key, v: value } to { key: value }
          value = (0, _defineProperty3.default)({}, input.k, input.v);
        } else if (!(0, _util.isObject)(input)) {
          // if the input isn't an object at all, turn it into an object with a key based on what's already in the
          // accumulator
          var max = -1;
          for (var k1 in acc) {
            var knum = parseInt(k1);
            if (knum > max) {
              max = knum;
            }
          }
          value = (0, _defineProperty3.default)({}, max + 1, input);
        }

        for (var k2 in value) {
          if (value.hasOwnProperty(k2)) {
            acc[k2] = value[k2];
          }
        }
        return acc;
      };

    case (0, _util.isFunction)(collection):
      return function (acc, input) {
        return collection(acc, input);
      };

    default:
      return null;
  }
}

// Returns a result function for a collection. This is a function that performs any final processing that should be done
// on the result of a reduction. If the collection doesn't support reduction, `null` is returned.
//
// In order to support the conversion of functions into reducers, function support is also provided.
function result(collection) {
  switch (true) {
    case (0, _protocol.isImplemented)(collection, 'result'):
      return collection[_protocol.protocols.result];
    case (0, _util.isString)(collection):
    case (0, _util.isArray)(collection):
    case (0, _util.isObject)(collection):
    case (0, _util.isFunction)(collection):
      return function (value) {
        return value;
      };
    default:
      return null;
  }
}

// Creates a reducer object for a collection. This object is suitable for being passed to a transduce or reduce call. If
// a function is passed, a reducer version of that function is returned.
function toReducer(collection) {
  var _ref2;

  return _ref2 = {}, (0, _defineProperty3.default)(_ref2, _protocol.protocols.init, init(collection)), (0, _defineProperty3.default)(_ref2, _protocol.protocols.step, step(collection)), (0, _defineProperty3.default)(_ref2, _protocol.protocols.result, result(collection)), _ref2;
}

// Reducer functions for the three common built-in iterable types.
var arrayReducer = exports.arrayReducer = toReducer([]);
var objectReducer = exports.objectReducer = toReducer({});
var stringReducer = exports.stringReducer = toReducer('');

// Turns a transformer along with a specific reducer into a function that can be used with other reduce implementations
// like the native Array.prototype.reduce function or the reduce functions in Underscore or Lodash. Since our
// transformers rely on the object being reduced to supply information on how to reduce, and since these other
// implementations are not coded to read that information, we must explicitly supply the reducer.
function toFunction(xform, reducer) {
  var r = typeof reducer === 'function' ? toReducer(reducer) : reducer;
  var result = xform(r);
  return result[_protocol.protocols.step].bind(result);
}

// Returns a reduced version of a value, regardless of whether the value is already reduced.
function reduced(value) {
  var _ref3;

  return _ref3 = {}, (0, _defineProperty3.default)(_ref3, _protocol.protocols.reduced, true), (0, _defineProperty3.default)(_ref3, _protocol.protocols.value, value), _ref3;
}

// Returns the unreduced value of a reduced value.
function unreduced(value) {
  if (value == null) {
    return;
  }
  return value[_protocol.protocols.value];
}

// Determines whether a value is reduced.
function isReduced(value) {
  if (value == null) {
    return false;
  }
  return !!value[_protocol.protocols.reduced];
}

// Returns a reduced version of a value, though if the supplied value is already reduced, it won't be reduced again.
function ensureReduced(value) {
  return isReduced(value) ? value : reduced(value);
}

// Returns an unreduced value. If the supplied value isn't reduced in the first place, it is simply returned.
function ensureUnreduced(value) {
  return isReduced(value) ? unreduced(value) : value;
}

// The core function of the entire library. This reduces a collection by applying a reduction step function to every
// element of the collection and adding it to the initial collection provided (the step function is assumed to know how
// to build on the initial collection). The final collection is then passed through the result function to get the final
// output.
//
// The `reducer` object contains these step and result functions. The collection must be iterable; if it is not, an
// error is thrown.
function reduce(collection, reducer, init) {
  if (collection == null) {
    return null;
  }

  var iter = (0, _iteration.iterator)(collection);
  if (!iter) {
    throw Error('Cannot reduce an instance of ' + collection.constructor.name);
  }

  var acc = init;
  var step = iter.next();

  while (!step.done) {
    acc = reducer[_protocol.protocols.step](acc, step.value);
    if (isReduced(acc)) {
      acc = unreduced(acc);
      break;
    }
    step = iter.next();
  }

  return reducer[_protocol.protocols.result](acc);
}

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = __webpack_require__(5);

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _defineProperty2 = __webpack_require__(3);

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

exports.sameValueZero = sameValueZero;
exports.identity = identity;
exports.flatten = flatten;
exports.repeat = repeat;

var _protocol = __webpack_require__(1);

var _transformation = __webpack_require__(4);

var _iteration = __webpack_require__(19);

var _util = __webpack_require__(0);

var _reduction = __webpack_require__(13);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Function for defining equality in some of the transducers, like uniq and distinct. This is based on the definition of
// SameValueZero in the JS spec,and this is the comparison used in similar situations by Lodash and other libraries.
// It's the same as === in JavaScript, except that NaN is equal to itself.
function sameValueZero(a, b) {
  return a === b || isNaN(a) && isNaN(b);
} /*
   * Copyright (c) 2017 Thomas Otterson
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy of
   * this software and associated documentation files (the "Software"), to deal in
   * the Software without restriction, including without limitation the rights to
   * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
   * the Software, and to permit persons to whom the Software is furnished to do so,
   * subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in all
   * copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
   * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
   * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
   * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
   * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   */

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// core.js
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var identityTransformer = function identityTransformer(xform) {
  var _ref;

  return _ref = {
    xform: xform

  }, (0, _defineProperty3.default)(_ref, _protocol.protocols.init, function () {
    return this.xform[_protocol.protocols.init]();
  }), (0, _defineProperty3.default)(_ref, _protocol.protocols.step, function (acc, input) {
    return this.xform[_protocol.protocols.step](acc, input);
  }), (0, _defineProperty3.default)(_ref, _protocol.protocols.result, function (value) {
    return this.xform[_protocol.protocols.result](value);
  }), _ref;
};

// Returns the collection as-is, without transforming any of its elements. The collection's iteration and reduction
// protocols are invoked, which means that this function cannot guarantee that the output collection is the same as
// the input collection unless those protocols are well-behaved.
//
// If no collection is provided, a function is returned that can be passed to a transducer function (sequence, etc.).
function identity(collection) {
  return collection ? (0, _transformation.sequence)(collection, identity()) : function (xform) {
    return identityTransformer(xform);
  };
}

var flattenTransformer = function flattenTransformer(xform) {
  var _ref2;

  return _ref2 = {
    xform: xform

  }, (0, _defineProperty3.default)(_ref2, _protocol.protocols.init, function () {
    return this.xform[_protocol.protocols.init]();
  }), (0, _defineProperty3.default)(_ref2, _protocol.protocols.step, function (acc, input) {
    var _subXform;

    var xform = this.xform;


    var subXform = (_subXform = {}, (0, _defineProperty3.default)(_subXform, _protocol.protocols.init, function () {
      return xform[_protocol.protocols.init]();
    }), (0, _defineProperty3.default)(_subXform, _protocol.protocols.step, function (acc, input) {
      var v = xform[_protocol.protocols.step](acc, input);
      return (0, _reduction.isReduced)(v) ? (0, _reduction.reduced)(v) : v;
    }), (0, _defineProperty3.default)(_subXform, _protocol.protocols.result, function (value) {
      return xform[_protocol.protocols.result](value);
    }), _subXform);

    return (0, _iteration.isIterable)(input) ? (0, _reduction.reduce)(input, subXform, acc) : subXform[_protocol.protocols.step](acc, input);
  }), (0, _defineProperty3.default)(_ref2, _protocol.protocols.result, function (value) {
    return this.xform[_protocol.protocols.result](value);
  }), _ref2;
};

// Flattens any sub-collections in the input collection, returning a flat collection. Any element in the input
// collection that is iterable will be flattened. This includes strings and objects, types of collections that don't
// make much sense to flatten on their own.
//
// If no collection is provided, a function is returned that can be passed to a transducer function (sequence, etc.).
function flatten(collection) {
  return collection ? (0, _transformation.sequence)(collection, flatten()) : function (xform) {
    return flattenTransformer(xform);
  };
}

var repeatTransformer = function repeatTransformer(n, xform) {
  var _ref3;

  return _ref3 = {
    n: n,
    xform: xform

  }, (0, _defineProperty3.default)(_ref3, _protocol.protocols.init, function () {
    return this.xform[_protocol.protocols.init]();
  }), (0, _defineProperty3.default)(_ref3, _protocol.protocols.step, function (acc, input) {
    var result = acc;
    for (var i = 0, count = this.n; i < count; ++i) {
      result = this.xform[_protocol.protocols.step](result, input);
      if ((0, _reduction.isReduced)(result)) {
        break;
      }
    }
    return result;
  }), (0, _defineProperty3.default)(_ref3, _protocol.protocols.result, function (value) {
    return this.xform[_protocol.protocols.result](value);
  }), _ref3;
};

// Duplicates the elements of the input collection n times in the output collection.
//
// If no collection is provided, a function is returned that can be passed to a transducer function (sequence, etc.).
function repeat(collection, n) {
  var _ref4 = (0, _util.isNumber)(collection) ? [null, collection] : [collection, n],
      _ref5 = (0, _slicedToArray3.default)(_ref4, 2),
      col = _ref5[0],
      num = _ref5[1];

  return col ? (0, _transformation.sequence)(col, repeat(num)) : function (xform) {
    return repeatTransformer(num, xform);
  };
}

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(21);
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = {};

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys       = __webpack_require__(47)
  , enumBugKeys = __webpack_require__(26);

module.exports = Object.keys || function keys(O){
  return $keys(O, enumBugKeys);
};

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = __webpack_require__(63);

var _keys2 = _interopRequireDefault(_keys);

exports.isKvFormObject = isKvFormObject;
exports.iterator = iterator;
exports.isIterable = isIterable;

var _util = __webpack_require__(0);

var _protocol = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// An iterator over strings. As of ES6 strings already satisfy the iterator protocol, so this is for pre-ES6
// environments where the iterator protocol doesn't exist. Like ES6 iterators, it takes into account double-wide Basic
// Multilingual Plane characters and will return the entire character as a two-character string.
/*
 * Copyright (c) 2017 Thomas Otterson
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// iteration.js
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function stringIterator(str) {
  var index = 0;
  return {
    next: function next() {
      return index < (0, _util.bmpLength)(str) ? {
        value: (0, _util.bmpCharAt)(str, index++),
        done: false
      } : {
        done: true
      };
    }
  };
}

// An iterator over arrays. ES6 arrays already satisfy the iterator protocol, so this is intended to make pre-ES6
// arrays iterable.
function arrayIterator(array) {
  var index = 0;
  return {
    next: function next() {
      return index < array.length ? {
        value: array[index++],
        done: false
      } : {
        done: true
      };
    }
  };
}

// Objects are not generally iterable, as there is no defined order for an object, and each "element" of an object
// actually has two values, unlike any other collection (a key and a property). However, it's tremendously useful to
// be able to use at least some transformers with objects as well. This iterator adds support in two different
// ways to make that possible.
//
// The first is that a sort order is defined. Quite simply, it's done alphabetically by key. There is also an option -
// through the second parameter `sort` - to provide a different sort function. This should be a function in the style
// of `Array.prototype.sort`, where two parameters are compared and -1 is returned if the first is larger, 1 is returned
// if the second is larger, and 0 is returned if they're equal. This is applied ONLY TO THE KEYS of the object. If you
// wish to sort on values, consider iterating into an array and then sorting the elements by value.
//
// In the public API, this sort function can only be passed through the `iterator` function. If you wish to use an
// object sorted in a non-default order, you should create an iterator out of it and transform that iterator. For
// example:
//
// DEFAULT ORDER                               CUSTOM ORDER
// var result = sequence(obj, xform);          var result = asObject(iterator(obj, sort), xform);
//
// The second support feature is the alternative "kv-form" objects. A reasonable way to iterate over objects would be to
// produce single-property objects, one per property on the original object (i.e., {a: 1, b: 2} would become two
// elements: {a: 1} and {b: 2}). This is fine for straight iteration and reduction, but it can present a challenge to
// use a transformer with. Consider this example code, which uppercases the key and adds one to the value.
//
// function doObjectSingle(obj) {
//   var key = Object.keys(obj)[0];
//   var result = {};
//   result[key.toUpperCase()] = obj[key] + 1;
//   return result;
// }
//
// This is a little unwieldy, so the iterator provides for another kind of iteration. Setting the third parameter,
// `kv`, to `true` (which is the default), objects will be iterated into two-property objects with `k` and `v` as the
// property names. For example, {a: 1, b: 2} will become two elements: {k: 'a', v: 1} and {k: 'b', v: 2}. This turns the
// mapping function shown above into something simpler.
//
// function doObjectKv(obj) {
//   var result = {};
//   result[obj.k.toUpperCase()]: obj.v + 1;
//   return result;
// }
//
// This is the default iteration form for objects internally. If you want to iterate an object into the {key: value}
// form, for which you would have to use the `doObjectSingle` style transformer, you must call `iterator` with the
// third parameter explicitly set to `false` and then pass that iterator to the transducing function. This is availabe
// in particular for those writing their own transducers.
//
// Still, while this is nice, we can do better. The built-in reducers for arrays, objects, strings, and iterators
// recognize the kv-form and know how to reduce it back into a regular key-value form for output. So instead of that
// first `doObjectKv`, we could write it this way.
//
// function doObjectKvImproved(obj) {
//   return {k: obj.k.toUpperCase(), v: obj.v + 1};
// }
//
// The reducer will recognize the form and reduce it correctly. The upshot is that in this library, `doObjectKv` and
// `doObjectKvImproved` will produce the SAME RESULT. Which function to use is purely a matter of preference. IMPORTANT
// NOTE: If you're adding transducer support to non-supported types, remember that you must decide whether to have your
// `step` function recognize kv-form objects and reduce them into key-value. If you don't, then the style of
// `doObjectKvImproved` will not be available.
//
// ANOTHER IMPORTANT NOTE: The internal reducers recognize kv-form very explicitly. The object must have exactly two
// enumerable properties, and those properties must be named 'k' and 'v'. This is to reduce the chance as much as
// possible of having errors because an object that was meant to be two properties was turned into one. (It is possible
// to have a transformation function return an object of more than one property; if that happens, and if that object is
// not a kv-form object, then all of the properties will be merged into the final object.)
//
// One final consideration: you have your choice of mapping function styles, but the better choice may depend on
// language. The above examples are in ES5. If you're using ES6, however, you have access to destructuring and dynamic
// object keys. That may make `doObjectKv` look better, because with those features it can be written like this:
//
// doObjectKv = ({k, v}) => {[k.toUpperCase()]: v + 1};
//
// And that's about as concise as it gets. Note that some languages that compile into JavaScript, like CoffeeScript and
// LiveScript, also support these features.
//
// TL;DR:
// 1. Iteration order of objects is alphabetical by key, though that can be changed by passing a sort funciton to
//    `iterator`.
// 2. Iteration is done internally in kv-form.
// 3. Transformation functions can output objects in key-value, which is easier in ES6.
// 4. Transformation functions can output objects in kv-form, which is easier in ES5.
function objectIterator(obj, sort) {
  var kv = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  var keys = (0, _keys2.default)(obj);
  keys = typeof sort === 'function' ? keys.sort(sort) : keys.sort();
  var index = 0;

  return {
    next: function next() {
      if (index < keys.length) {
        var k = keys[index++];
        var value = {};
        if (kv) {
          value.k = k;
          value.v = obj[k];
        } else {
          value[k] = obj[k];
        }
        return {
          value: value,
          done: false
        };
      }
      return {
        done: true
      };
    }
  };
}

// Determines whether an object is in kv-form. This used by the reducers that must recognize this form and reduce those
// elements back into key-value form.
function isKvFormObject(obj) {
  var keys = (0, _keys2.default)(obj);
  if (keys.length !== 2) {
    return false;
  }
  return !!~keys.indexOf('k') && !!~keys.indexOf('v');
}

// Creates an iterator for the supplied object. An iterator, as per the protocol, is an object with a `next` function
// that returns elements of that object one at a time in a specific format. This will either be the return value of the
// function that implements the iterator protocol on the object, the object itself if it has a `next` method, or custom
// iterators for pre-protocol arrays and objects. If none of these are relevant, `null` is returned.
//
// IMPORTANT: if there is no iterator protocol but there is an iterator pseudo-protocol (i.e., there is a `next`
// property), then the passed object is already an iterator and is returned. Otherwise, the iterator that is returned
// is a NEW iterator each time the call is made.
function iterator(obj, sort, kv) {
  switch (true) {
    case (0, _util.isFunction)(obj[_protocol.protocols.iterator]):
      return obj[_protocol.protocols.iterator].call(obj);
    case (0, _util.isFunction)(obj.next):
      return obj;
    case (0, _util.isString)(obj):
      return stringIterator(obj);
    case (0, _util.isArray)(obj):
      return arrayIterator(obj);
    case (0, _util.isObject)(obj):
      return objectIterator(obj, sort, kv);
    default:
      return null;
  }
}

// Determines whether the passed object is iterable, in terms of what 'iterable' means to this library. In other words,
// objects and ES5 arrays and strings will return `true`, as will objects with a `next` function. For that reason this
// function is only really useful within the library and therefore isn't exported.
function isIterable(obj) {
  return (0, _protocol.isImplemented)(obj, 'iterator') || (0, _util.isString)(obj) || (0, _util.isArray)(obj) || (0, _util.isObject)(obj);
}

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

var global    = __webpack_require__(7)
  , core      = __webpack_require__(2)
  , ctx       = __webpack_require__(78)
  , hide      = __webpack_require__(12)
  , PROTOTYPE = 'prototype';

var $export = function(type, name, source){
  var IS_FORCED = type & $export.F
    , IS_GLOBAL = type & $export.G
    , IS_STATIC = type & $export.S
    , IS_PROTO  = type & $export.P
    , IS_BIND   = type & $export.B
    , IS_WRAP   = type & $export.W
    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
    , expProto  = exports[PROTOTYPE]
    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
    , key, own, out;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if(own && key in exports)continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function(C){
      var F = function(a, b, c){
        if(this instanceof C){
          switch(arguments.length){
            case 0: return new C;
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if(IS_PROTO){
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library` 
module.exports = $export;

/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};

/***/ }),
/* 23 */
/***/ (function(module, exports) {

var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

/***/ }),
/* 24 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};

/***/ }),
/* 25 */
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};

/***/ }),
/* 26 */
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

/***/ }),
/* 27 */
/***/ (function(module, exports) {

module.exports = true;

/***/ }),
/* 28 */
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__(10).f
  , has = __webpack_require__(9)
  , TAG = __webpack_require__(6)('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(31)('keys')
  , uid    = __webpack_require__(23);
module.exports = function(key){
  return shared[key] || (shared[key] = uid(key));
};

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(7)
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};

/***/ }),
/* 32 */
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(25);
module.exports = function(it){
  return Object(defined(it));
};

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(21);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function(it, S){
  if(!isObject(it))return it;
  var fn, val;
  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  throw TypeError("Can't convert object to primitive value");
};

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

var global         = __webpack_require__(7)
  , core           = __webpack_require__(2)
  , LIBRARY        = __webpack_require__(27)
  , wksExt         = __webpack_require__(36)
  , defineProperty = __webpack_require__(10).f;
module.exports = function(name){
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
};

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

exports.f = __webpack_require__(6);

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $at  = __webpack_require__(90)(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__(42)(String, 'String', function(iterated){
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , index = this._i
    , point;
  if(index >= O.length)return {value: undefined, done: true};
  point = $at(O, index);
  this._i += point.length;
  return {value: point, done: false};
});

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(96);
var global        = __webpack_require__(7)
  , hide          = __webpack_require__(12)
  , Iterators     = __webpack_require__(17)
  , TO_STRING_TAG = __webpack_require__(6)('toStringTag');

for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
  var NAME       = collections[i]
    , Collection = global[NAME]
    , proto      = Collection && Collection.prototype;
  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__(24)
  , TAG = __webpack_require__(6)('toStringTag')
  // ES3 wrong here
  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function(it, key){
  try {
    return it[key];
  } catch(e){ /* empty */ }
};

module.exports = function(it){
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(21)
  , document = __webpack_require__(7).document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(8) && !__webpack_require__(16)(function(){
  return Object.defineProperty(__webpack_require__(40)('div'), 'a', {get: function(){ return 7; }}).a != 7;
});

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY        = __webpack_require__(27)
  , $export        = __webpack_require__(20)
  , redefine       = __webpack_require__(49)
  , hide           = __webpack_require__(12)
  , has            = __webpack_require__(9)
  , Iterators      = __webpack_require__(17)
  , $iterCreate    = __webpack_require__(83)
  , setToStringTag = __webpack_require__(29)
  , getPrototypeOf = __webpack_require__(46)
  , ITERATOR       = __webpack_require__(6)('iterator')
  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
  , FF_ITERATOR    = '@@iterator'
  , KEYS           = 'keys'
  , VALUES         = 'values';

var returnThis = function(){ return this; };

module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
  $iterCreate(Constructor, NAME, next);
  var getMethod = function(kind){
    if(!BUGGY && kind in proto)return proto[kind];
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG        = NAME + ' Iterator'
    , DEF_VALUES = DEFAULT == VALUES
    , VALUES_BUG = false
    , proto      = Base.prototype
    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , $default   = $native || getMethod(DEFAULT)
    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
    , methods, key, IteratorPrototype;
  // Fix native
  if($anyNative){
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
    if(IteratorPrototype !== Object.prototype){
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if(DEF_VALUES && $native && $native.name !== VALUES){
    VALUES_BUG = true;
    $default = function values(){ return $native.call(this); };
  }
  // Define iterator
  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      values:  DEF_VALUES ? $default : getMethod(VALUES),
      keys:    IS_SET     ? $default : getMethod(KEYS),
      entries: $entries
    };
    if(FORCED)for(key in methods){
      if(!(key in proto))redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject    = __webpack_require__(15)
  , dPs         = __webpack_require__(87)
  , enumBugKeys = __webpack_require__(26)
  , IE_PROTO    = __webpack_require__(30)('IE_PROTO')
  , Empty       = function(){ /* empty */ }
  , PROTOTYPE   = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function(){
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__(40)('iframe')
    , i      = enumBugKeys.length
    , lt     = '<'
    , gt     = '>'
    , iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__(80).appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties){
  var result;
  if(O !== null){
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty;
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys      = __webpack_require__(47)
  , hiddenKeys = __webpack_require__(26).concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
  return $keys(O, hiddenKeys);
};

/***/ }),
/* 45 */
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has         = __webpack_require__(9)
  , toObject    = __webpack_require__(33)
  , IE_PROTO    = __webpack_require__(30)('IE_PROTO')
  , ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function(O){
  O = toObject(O);
  if(has(O, IE_PROTO))return O[IE_PROTO];
  if(typeof O.constructor == 'function' && O instanceof O.constructor){
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

var has          = __webpack_require__(9)
  , toIObject    = __webpack_require__(11)
  , arrayIndexOf = __webpack_require__(77)(false)
  , IE_PROTO     = __webpack_require__(30)('IE_PROTO');

module.exports = function(object, names){
  var O      = toIObject(object)
    , i      = 0
    , result = []
    , key;
  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while(names.length > i)if(has(O, key = names[i++])){
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

// most Object methods by ES6 should accept primitives
var $export = __webpack_require__(20)
  , core    = __webpack_require__(2)
  , fails   = __webpack_require__(16);
module.exports = function(KEY, exec){
  var fn  = (core.Object || {})[KEY] || Object[KEY]
    , exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
};

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(12);

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// ECMAScript 6 symbols shim
var global         = __webpack_require__(7)
  , has            = __webpack_require__(9)
  , DESCRIPTORS    = __webpack_require__(8)
  , $export        = __webpack_require__(20)
  , redefine       = __webpack_require__(49)
  , META           = __webpack_require__(86).KEY
  , $fails         = __webpack_require__(16)
  , shared         = __webpack_require__(31)
  , setToStringTag = __webpack_require__(29)
  , uid            = __webpack_require__(23)
  , wks            = __webpack_require__(6)
  , wksExt         = __webpack_require__(36)
  , wksDefine      = __webpack_require__(35)
  , keyOf          = __webpack_require__(85)
  , enumKeys       = __webpack_require__(79)
  , isArray        = __webpack_require__(82)
  , anObject       = __webpack_require__(15)
  , toIObject      = __webpack_require__(11)
  , toPrimitive    = __webpack_require__(34)
  , createDesc     = __webpack_require__(22)
  , _create        = __webpack_require__(43)
  , gOPNExt        = __webpack_require__(89)
  , $GOPD          = __webpack_require__(88)
  , $DP            = __webpack_require__(10)
  , $keys          = __webpack_require__(18)
  , gOPD           = $GOPD.f
  , dP             = $DP.f
  , gOPN           = gOPNExt.f
  , $Symbol        = global.Symbol
  , $JSON          = global.JSON
  , _stringify     = $JSON && $JSON.stringify
  , PROTOTYPE      = 'prototype'
  , HIDDEN         = wks('_hidden')
  , TO_PRIMITIVE   = wks('toPrimitive')
  , isEnum         = {}.propertyIsEnumerable
  , SymbolRegistry = shared('symbol-registry')
  , AllSymbols     = shared('symbols')
  , OPSymbols      = shared('op-symbols')
  , ObjectProto    = Object[PROTOTYPE]
  , USE_NATIVE     = typeof $Symbol == 'function'
  , QObject        = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function(){
  return _create(dP({}, 'a', {
    get: function(){ return dP(this, 'a', {value: 7}).a; }
  })).a != 7;
}) ? function(it, key, D){
  var protoDesc = gOPD(ObjectProto, key);
  if(protoDesc)delete ObjectProto[key];
  dP(it, key, D);
  if(protoDesc && it !== ObjectProto)dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function(tag){
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function(it){
  return typeof it == 'symbol';
} : function(it){
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D){
  if(it === ObjectProto)$defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if(has(AllSymbols, key)){
    if(!D.enumerable){
      if(!has(it, HIDDEN))dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
      D = _create(D, {enumerable: createDesc(0, false)});
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P){
  anObject(it);
  var keys = enumKeys(P = toIObject(P))
    , i    = 0
    , l = keys.length
    , key;
  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P){
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key){
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if(this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
  it  = toIObject(it);
  key = toPrimitive(key, true);
  if(it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return;
  var D = gOPD(it, key);
  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it){
  var names  = gOPN(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
  var IS_OP  = it === ObjectProto
    , names  = gOPN(IS_OP ? OPSymbols : toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true))result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if(!USE_NATIVE){
  $Symbol = function Symbol(){
    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function(value){
      if(this === ObjectProto)$set.call(OPSymbols, value);
      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if(DESCRIPTORS && setter)setSymbolDesc(ObjectProto, tag, {configurable: true, set: $set});
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString(){
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f   = $defineProperty;
  __webpack_require__(44).f = gOPNExt.f = $getOwnPropertyNames;
  __webpack_require__(28).f  = $propertyIsEnumerable;
  __webpack_require__(45).f = $getOwnPropertySymbols;

  if(DESCRIPTORS && !__webpack_require__(27)){
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function(name){
    return wrap(wks(name));
  }
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, {Symbol: $Symbol});

for(var symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), i = 0; symbols.length > i; )wks(symbols[i++]);

for(var symbols = $keys(wks.store), i = 0; symbols.length > i; )wksDefine(symbols[i++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function(key){
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(key){
    if(isSymbol(key))return keyOf(SymbolRegistry, key);
    throw TypeError(key + ' is not a symbol!');
  },
  useSetter: function(){ setter = true; },
  useSimple: function(){ setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function(){
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it){
    if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
    var args = [it]
      , i    = 1
      , replacer, $replacer;
    while(arguments.length > i)args.push(arguments[i++]);
    replacer = args[1];
    if(typeof replacer == 'function')$replacer = replacer;
    if($replacer || !isArray(replacer))replacer = function(key, value){
      if($replacer)value = $replacer.call(this, key, value);
      if(!isSymbol(value))return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(12)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uniqWith = exports.uniqBy = exports.uniq = exports.takeNth = exports.takeWhile = exports.take = exports.flatMap = exports.map = exports.compact = exports.reject = exports.filter = exports.dropWhile = exports.drop = exports.distinctWith = exports.distinctBy = exports.distinct = exports.repeat = exports.flatten = exports.identity = exports.chunkBy = exports.chunk = exports.compose = exports.asString = exports.asObject = exports.asIterator = exports.asArray = exports.sequence = exports.into = exports.transduce = exports.reduce = exports.toFunction = exports.toReducer = exports.iterator = exports.protocols = exports.util = undefined;

var _protocol = __webpack_require__(1);

Object.defineProperty(exports, 'protocols', {
  enumerable: true,
  get: function get() {
    return _protocol.protocols;
  }
});

var _iteration = __webpack_require__(19);

Object.defineProperty(exports, 'iterator', {
  enumerable: true,
  get: function get() {
    return _iteration.iterator;
  }
});

var _reduction = __webpack_require__(13);

Object.defineProperty(exports, 'toReducer', {
  enumerable: true,
  get: function get() {
    return _reduction.toReducer;
  }
});
Object.defineProperty(exports, 'toFunction', {
  enumerable: true,
  get: function get() {
    return _reduction.toFunction;
  }
});
Object.defineProperty(exports, 'reduce', {
  enumerable: true,
  get: function get() {
    return _reduction.reduce;
  }
});

var _transformation = __webpack_require__(4);

Object.defineProperty(exports, 'transduce', {
  enumerable: true,
  get: function get() {
    return _transformation.transduce;
  }
});
Object.defineProperty(exports, 'into', {
  enumerable: true,
  get: function get() {
    return _transformation.into;
  }
});
Object.defineProperty(exports, 'sequence', {
  enumerable: true,
  get: function get() {
    return _transformation.sequence;
  }
});
Object.defineProperty(exports, 'asArray', {
  enumerable: true,
  get: function get() {
    return _transformation.asArray;
  }
});
Object.defineProperty(exports, 'asIterator', {
  enumerable: true,
  get: function get() {
    return _transformation.asIterator;
  }
});
Object.defineProperty(exports, 'asObject', {
  enumerable: true,
  get: function get() {
    return _transformation.asObject;
  }
});
Object.defineProperty(exports, 'asString', {
  enumerable: true,
  get: function get() {
    return _transformation.asString;
  }
});
Object.defineProperty(exports, 'compose', {
  enumerable: true,
  get: function get() {
    return _transformation.compose;
  }
});

var _chunk = __webpack_require__(52);

Object.defineProperty(exports, 'chunk', {
  enumerable: true,
  get: function get() {
    return _chunk.chunk;
  }
});
Object.defineProperty(exports, 'chunkBy', {
  enumerable: true,
  get: function get() {
    return _chunk.chunkBy;
  }
});

var _core = __webpack_require__(14);

Object.defineProperty(exports, 'identity', {
  enumerable: true,
  get: function get() {
    return _core.identity;
  }
});
Object.defineProperty(exports, 'flatten', {
  enumerable: true,
  get: function get() {
    return _core.flatten;
  }
});
Object.defineProperty(exports, 'repeat', {
  enumerable: true,
  get: function get() {
    return _core.repeat;
  }
});

var _distinct = __webpack_require__(53);

Object.defineProperty(exports, 'distinct', {
  enumerable: true,
  get: function get() {
    return _distinct.distinct;
  }
});
Object.defineProperty(exports, 'distinctBy', {
  enumerable: true,
  get: function get() {
    return _distinct.distinctBy;
  }
});
Object.defineProperty(exports, 'distinctWith', {
  enumerable: true,
  get: function get() {
    return _distinct.distinctWith;
  }
});

var _drop = __webpack_require__(54);

Object.defineProperty(exports, 'drop', {
  enumerable: true,
  get: function get() {
    return _drop.drop;
  }
});
Object.defineProperty(exports, 'dropWhile', {
  enumerable: true,
  get: function get() {
    return _drop.dropWhile;
  }
});

var _filter = __webpack_require__(55);

Object.defineProperty(exports, 'filter', {
  enumerable: true,
  get: function get() {
    return _filter.filter;
  }
});
Object.defineProperty(exports, 'reject', {
  enumerable: true,
  get: function get() {
    return _filter.reject;
  }
});
Object.defineProperty(exports, 'compact', {
  enumerable: true,
  get: function get() {
    return _filter.compact;
  }
});

var _map = __webpack_require__(56);

Object.defineProperty(exports, 'map', {
  enumerable: true,
  get: function get() {
    return _map.map;
  }
});
Object.defineProperty(exports, 'flatMap', {
  enumerable: true,
  get: function get() {
    return _map.flatMap;
  }
});

var _take = __webpack_require__(57);

Object.defineProperty(exports, 'take', {
  enumerable: true,
  get: function get() {
    return _take.take;
  }
});
Object.defineProperty(exports, 'takeWhile', {
  enumerable: true,
  get: function get() {
    return _take.takeWhile;
  }
});
Object.defineProperty(exports, 'takeNth', {
  enumerable: true,
  get: function get() {
    return _take.takeNth;
  }
});

var _uniq = __webpack_require__(58);

Object.defineProperty(exports, 'uniq', {
  enumerable: true,
  get: function get() {
    return _uniq.uniq;
  }
});
Object.defineProperty(exports, 'uniqBy', {
  enumerable: true,
  get: function get() {
    return _uniq.uniqBy;
  }
});
Object.defineProperty(exports, 'uniqWith', {
  enumerable: true,
  get: function get() {
    return _uniq.uniqWith;
  }
});

var _util = __webpack_require__(0);

/*
 * Copyright (c) 2017 Thomas Otterson
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var util = exports.util = {
  bmp: {
    charAt: _util.bmpCharAt,
    length: _util.bmpLength
  },
  range: _util.range,
  complement: _util.complement,

  isArray: _util.isArray,
  isFunction: _util.isFunction,
  isNumber: _util.isNumber,
  isObject: _util.isObject,
  isString: _util.isString,

  reduced: _reduction.reduced,
  unreduced: _reduction.unreduced,
  isReduced: _reduction.isReduced,
  ensureReduced: _reduction.ensureReduced,
  ensureUnreduced: _reduction.ensureUnreduced
};

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = __webpack_require__(5);

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _defineProperty2 = __webpack_require__(3);

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

exports.chunk = chunk;
exports.chunkBy = chunkBy;

var _protocol = __webpack_require__(1);

var _transformation = __webpack_require__(4);

var _reduction = __webpack_require__(13);

var _util = __webpack_require__(0);

var _core = __webpack_require__(14);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NO_VALUE = {}; /*
                    * Copyright (c) 2017 Thomas Otterson
                    *
                    * Permission is hereby granted, free of charge, to any person obtaining a copy of
                    * this software and associated documentation files (the "Software"), to deal in
                    * the Software without restriction, including without limitation the rights to
                    * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
                    * the Software, and to permit persons to whom the Software is furnished to do so,
                    * subject to the following conditions:
                    *
                    * The above copyright notice and this permission notice shall be included in all
                    * copies or substantial portions of the Software.
                    *
                    * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
                    * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
                    * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
                    * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
                    * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
                    * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
                    */

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// chunk.js
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var chunkTransformer = function chunkTransformer(n, xform) {
  var _ref;

  return _ref = {
    n: n,
    xform: xform,
    count: 0,
    part: []

  }, (0, _defineProperty3.default)(_ref, _protocol.protocols.init, function () {
    return this.xform[_protocol.protocols.init]();
  }), (0, _defineProperty3.default)(_ref, _protocol.protocols.step, function (acc, input) {
    this.part[this.count++] = input;
    if (this.count === this.n) {
      var out = this.part.slice(0, this.n);
      this.part = [];
      this.count = 0;
      return this.xform[_protocol.protocols.step](acc, out);
    }
    return acc;
  }), (0, _defineProperty3.default)(_ref, _protocol.protocols.result, function (value) {
    if (this.count > 0) {
      return (0, _reduction.ensureUnreduced)(this.xform[_protocol.protocols.step](value, this.part.slice(0, this.count)));
    }
    return this.xform[_protocol.protocols.result](value);
  }), _ref;
};

// Splits the input collection into chunks of `n` elements each. Each of these chunks is an array, no matter what the
// type of the input collection.
//
// If no collection is provided, a function is returned that can be passed to a transducer function (sequence, etc.).
function chunk(collection, n) {
  var _ref2 = (0, _util.isNumber)(collection) ? [null, collection] : [collection, n],
      _ref3 = (0, _slicedToArray3.default)(_ref2, 2),
      col = _ref3[0],
      num = _ref3[1];

  return col ? (0, _transformation.sequence)(col, chunk(num)) : function (xform) {
    return chunkTransformer(num, xform);
  };
}

var chunkByTransformer = function chunkByTransformer(fn, xform) {
  var _ref4;

  return _ref4 = {
    fn: fn,
    xform: xform,
    part: [],
    last: NO_VALUE

  }, (0, _defineProperty3.default)(_ref4, _protocol.protocols.init, function () {
    return this.xform[_protocol.protocols.init]();
  }), (0, _defineProperty3.default)(_ref4, _protocol.protocols.step, function (acc, input) {
    var current = this.fn(input);
    var result = acc;
    if (this.last === NO_VALUE || (0, _core.sameValueZero)(current, this.last)) {
      this.part.push(input);
    } else {
      result = this.xform[_protocol.protocols.step](result, this.part);
      this.part = [input];
    }
    this.last = current;
    return result;
  }), (0, _defineProperty3.default)(_ref4, _protocol.protocols.result, function (value) {
    var count = this.part.length;
    if (count > 0) {
      return (0, _reduction.ensureUnreduced)(this.xform[_protocol.protocols.step](value, this.part.slice(0, count)));
    }
    return this.xform[_protocol.protocols.result](value);
  }), _ref4;
};

// Splits the input collection into chunks whose boundaries are defined by the supplied function. One chunk ends and
// the next begins when the function returns a different value for an input element than it did for the prior element.
//
// By default, the function is run without context. If a context object is provided, it will become `this` within the
// function.
//
// If no collection is provided, a function is returned that can be passed to a transducer function (sequence, etc.).
function chunkBy(collection, fn, ctx) {
  var _ref5 = (0, _util.isFunction)(collection) ? [null, collection.bind(fn)] : [collection, fn.bind(ctx)],
      _ref6 = (0, _slicedToArray3.default)(_ref5, 2),
      col = _ref6[0],
      func = _ref6[1];

  return col ? (0, _transformation.sequence)(col, chunkBy(func)) : function (xform) {
    return chunkByTransformer(func, xform);
  };
}

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = __webpack_require__(5);

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _defineProperty2 = __webpack_require__(3);

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

exports.distinctWith = distinctWith;
exports.distinctBy = distinctBy;
exports.distinct = distinct;

var _protocol = __webpack_require__(1);

var _transformation = __webpack_require__(4);

var _util = __webpack_require__(0);

var _core = __webpack_require__(14);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright (c) 2017 Thomas Otterson
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// distinct.js
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var NO_VALUE = {};

var distinctTransformer = function distinctTransformer(fn, xform) {
  var _ref;

  return _ref = {
    fn: fn,
    xform: xform,
    last: NO_VALUE

  }, (0, _defineProperty3.default)(_ref, _protocol.protocols.init, function () {
    return this.xform[_protocol.protocols.init]();
  }), (0, _defineProperty3.default)(_ref, _protocol.protocols.step, function (acc, input) {
    if (this.last !== NO_VALUE && this.fn(input, this.last)) {
      return acc;
    }
    this.last = input;
    return this.xform[_protocol.protocols.step](acc, input);
  }), (0, _defineProperty3.default)(_ref, _protocol.protocols.result, function (value) {
    return this.xform[_protocol.protocols.result](value);
  }), _ref;
};

// Returns a collection that removes any consecutive equal values from the input collection. Equality is determined by
// the provided function; if two consecutive elements produce the same result from the function, then the second of
// them is suppressed.
//
// By default, the function is run without context. If a context object is provided, it will become `this` within the
// function.
//
// If no collection is provided, a function is returned that can be passed to a transducer function (sequence, etc.).
function distinctWith(collection, fn, ctx) {
  var _ref2 = (0, _util.isFunction)(collection) ? [null, collection.bind(fn)] : [collection, fn.bind(ctx)],
      _ref3 = (0, _slicedToArray3.default)(_ref2, 2),
      col = _ref3[0],
      func = _ref3[1];

  return col ? (0, _transformation.sequence)(col, distinctWith(func)) : function (xform) {
    return distinctTransformer(func, xform);
  };
}

// Returns a collection that removes any consecutive equal values from the input collection. Equality is determined by
// comparing the return values of the provided function (with SameValueZero) when pairs of input elements are passed
// into it. If the return values are equal for two elements, then the second is suppressed.
//
// By default, the function is run without context. If a context object is provided, it will become `this` within the
// function.
//
// If no collection is provided, a function is returned that can be passed to a transducer function (sequence, etc.).
function distinctBy(collection, fn, ctx) {
  var _ref4 = (0, _util.isFunction)(collection) ? [null, collection.bind(fn)] : [collection, fn.bind(ctx)],
      _ref5 = (0, _slicedToArray3.default)(_ref4, 2),
      col = _ref5[0],
      func = _ref5[1];

  return distinctWith(col, function (a, b) {
    return (0, _core.sameValueZero)(func(a), func(b));
  });
}

// Returns a collection that removes any consecutive equal values from the input collection. Equality is determined by
// comparing consecutive elements using SameValueZero. If two consecutive elements are the same, then the second will
// be suppressed.
//
// If no collection is provided, a function is returned that can be passed to a transducer function (sequence, etc.).
function distinct(collection) {
  return distinctWith(collection, _core.sameValueZero);
}

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = __webpack_require__(5);

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _defineProperty2 = __webpack_require__(3);

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

exports.drop = drop;
exports.dropWhile = dropWhile;

var _protocol = __webpack_require__(1);

var _transformation = __webpack_require__(4);

var _util = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dropTransformer = function dropTransformer(n, xform) {
  var _ref;

  return _ref = {
    n: n,
    xform: xform,
    i: 0

  }, (0, _defineProperty3.default)(_ref, _protocol.protocols.init, function () {
    return this.xform[_protocol.protocols.init]();
  }), (0, _defineProperty3.default)(_ref, _protocol.protocols.step, function (acc, input) {
    return this.i++ < this.n ? acc : this.xform[_protocol.protocols.step](acc, input);
  }), (0, _defineProperty3.default)(_ref, _protocol.protocols.result, function (value) {
    return this.xform[_protocol.protocols.result](value);
  }), _ref;
};

// Returns a collection containing all of the elements of the input collection except for the first `n` of them.
//
// If no collection is provided, a function is returned that can be passed to a transducer function (sequence, etc.).
/*
 * Copyright (c) 2017 Thomas Otterson
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// drop.js
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function drop(collection, n) {
  var _ref2 = (0, _util.isNumber)(collection) ? [null, collection] : [collection, n],
      _ref3 = (0, _slicedToArray3.default)(_ref2, 2),
      col = _ref3[0],
      num = _ref3[1];

  return col ? (0, _transformation.sequence)(col, drop(num)) : function (xform) {
    return dropTransformer(num, xform);
  };
}

var dropWhileTransformer = function dropWhileTransformer(fn, xform) {
  var _ref4;

  return _ref4 = {
    fn: fn,
    xform: xform,
    dropping: true

  }, (0, _defineProperty3.default)(_ref4, _protocol.protocols.init, function () {
    return this.xform[_protocol.protocols.init]();
  }), (0, _defineProperty3.default)(_ref4, _protocol.protocols.step, function (acc, input) {
    if (this.dropping) {
      if (this.fn(input)) {
        return acc;
      }
      this.dropping = false;
    }
    return this.xform[_protocol.protocols.step](acc, input);
  }), (0, _defineProperty3.default)(_ref4, _protocol.protocols.result, function (value) {
    return this.xform[_protocol.protocols.result](value);
  }), _ref4;
};

// Returns a collection containing all of the elements of the input collection starting from the first one that returns
// `false` from the supplied predicate function. After the first element that fails this test, no further elements are
// tested.
//
// By default, the function is run without context. If a context object is provided, it will become `this` within the
// function.
//
// If no collection is provided, a function is returned that can be passed to a transducer function (sequence, etc.).
function dropWhile(collection, fn, ctx) {
  var _ref5 = (0, _util.isFunction)(collection) ? [null, collection.bind(fn)] : [collection, fn.bind(ctx)],
      _ref6 = (0, _slicedToArray3.default)(_ref5, 2),
      col = _ref6[0],
      func = _ref6[1];

  return col ? (0, _transformation.sequence)(col, dropWhile(func)) : function (xform) {
    return dropWhileTransformer(func, xform);
  };
}

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = __webpack_require__(5);

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _defineProperty2 = __webpack_require__(3);

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

exports.filter = filter;
exports.reject = reject;
exports.compact = compact;

var _protocol = __webpack_require__(1);

var _transformation = __webpack_require__(4);

var _util = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var filterTransformer = function filterTransformer(fn, xform) {
  var _ref;

  return _ref = {
    fn: fn,
    xform: xform

  }, (0, _defineProperty3.default)(_ref, _protocol.protocols.init, function () {
    return this.xform[_protocol.protocols.init]();
  }), (0, _defineProperty3.default)(_ref, _protocol.protocols.step, function (acc, input) {
    return this.fn(input) ? this.xform[_protocol.protocols.step](acc, input) : acc;
  }), (0, _defineProperty3.default)(_ref, _protocol.protocols.result, function (value) {
    return this.xform[_protocol.protocols.result](value);
  }), _ref;
};

// Filters the elements of the input collection by only passing the ones that pass the predicate function on into the
// output collection.
//
// By default, the function is run without context. If a context object is provided, it will become `this` within the
// function.
//
// If no collection is provided, a function is returned that can be passed to a transducer function (sequence, etc.).
/*
 * Copyright (c) 2017 Thomas Otterson
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// filter.js
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function filter(collection, fn, ctx) {
  var _ref2 = (0, _util.isFunction)(collection) ? [null, collection.bind(fn)] : [collection, fn.bind(ctx)],
      _ref3 = (0, _slicedToArray3.default)(_ref2, 2),
      col = _ref3[0],
      func = _ref3[1];

  return col ? (0, _transformation.sequence)(col, filter(func)) : function (xform) {
    return filterTransformer(func, xform);
  };
}

// Filters the elements of the input collection by rejecting the ones that pass the predicate function, preventing them
// from being in the output collection.
//
// By default, the function is run without context. If a context object is provided, it will become `this` within the
// function.
//
// If no collection is provided, a function is returned that can be passed to a transducer function (sequence, etc.).
function reject(collection, fn, ctx) {
  var _ref4 = (0, _util.isFunction)(collection) ? [null, collection.bind(fn)] : [collection, fn.bind(ctx)],
      _ref5 = (0, _slicedToArray3.default)(_ref4, 2),
      col = _ref5[0],
      func = _ref5[1];

  return filter(col, (0, _util.complement)(func));
}

// Filters out any falsey (0, false, null, undefined) values in the input collection, letting the rest join the output
// collection.
//
// If no collection is provided, a function is returned that can be passed to a transducer function (sequence, etc.).
function compact(collection) {
  return filter(collection, function (x) {
    return !!x;
  });
}

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = __webpack_require__(5);

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _defineProperty2 = __webpack_require__(3);

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

exports.map = map;
exports.flatMap = flatMap;

var _protocol = __webpack_require__(1);

var _transformation = __webpack_require__(4);

var _util = __webpack_require__(0);

var _core = __webpack_require__(14);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright (c) 2017 Thomas Otterson
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// map.js
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var mapTransformer = function mapTransformer(fn, xform) {
  var _ref;

  return _ref = {
    fn: fn,
    xform: xform

  }, (0, _defineProperty3.default)(_ref, _protocol.protocols.init, function () {
    return this.xform[_protocol.protocols.init]();
  }), (0, _defineProperty3.default)(_ref, _protocol.protocols.step, function (acc, input) {
    return this.xform[_protocol.protocols.step](acc, this.fn(input));
  }), (0, _defineProperty3.default)(_ref, _protocol.protocols.result, function (value) {
    return this.xform[_protocol.protocols.result](value);
  }), _ref;
};

// Maps the elements of a collection over a function. The output collection consists of the return values from that
// function when the elements of the input function are fed into it.
//
// By default, the function is run without context. If a context object is provided, it will become `this` within the
// function.
//
// If no collection is provided, a function is returned that can be passed to a transducer function (sequence, etc.).
function map(collection, fn, ctx) {
  var _ref2 = (0, _util.isFunction)(collection) ? [null, collection.bind(fn)] : [collection, fn.bind(ctx)],
      _ref3 = (0, _slicedToArray3.default)(_ref2, 2),
      col = _ref3[0],
      func = _ref3[1];

  return col ? (0, _transformation.sequence)(col, map(func)) : function (xform) {
    return mapTransformer(func, xform);
  };
}

// Maps the elements of a collection over a function, flattening any collections that are returned from that function.
//
// By default, the function is run without context. If a context object is provided, it will become `this` within the
// function.
//
// If no collection is provided, a function is returned that can be passed to a transducer function (sequence, etc.).
function flatMap(collection, fn, ctx) {
  var _ref4 = (0, _util.isFunction)(collection) ? [null, collection.bind(fn)] : [collection, fn.bind(ctx)],
      _ref5 = (0, _slicedToArray3.default)(_ref4, 2),
      col = _ref5[0],
      func = _ref5[1];

  return col ? (0, _transformation.sequence)(col, (0, _transformation.compose)(map(func), (0, _core.flatten)())) : (0, _transformation.compose)(map(func), (0, _core.flatten)());
}

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = __webpack_require__(5);

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _defineProperty2 = __webpack_require__(3);

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

exports.take = take;
exports.takeWhile = takeWhile;
exports.takeNth = takeNth;

var _protocol = __webpack_require__(1);

var _reduction = __webpack_require__(13);

var _transformation = __webpack_require__(4);

var _util = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright (c) 2017 Thomas Otterson
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// take.js
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var takeTransformer = function takeTransformer(n, xform) {
  var _ref;

  return _ref = {
    n: n,
    xform: xform,
    i: 0

  }, (0, _defineProperty3.default)(_ref, _protocol.protocols.init, function () {
    return this.xform[_protocol.protocols.init]();
  }), (0, _defineProperty3.default)(_ref, _protocol.protocols.step, function (acc, input) {
    var result = acc;

    if (this.i < this.n) {
      result = this.xform[_protocol.protocols.step](acc, input);
      if (this.i === this.n - 1) {
        result = (0, _reduction.ensureReduced)(result);
      }
    }
    this.i++;
    return result;
  }), (0, _defineProperty3.default)(_ref, _protocol.protocols.result, function (value) {
    return this.xform[_protocol.protocols.result](value);
  }), _ref;
};

// Returns a collection that contains only the first `count` elements from the input collection.
//
// If no collection is provided, a function is returned that can be passed to a transducer function (sequence, etc.).
function take(collection, n) {
  var _ref2 = (0, _util.isNumber)(collection) ? [null, collection] : [collection, n],
      _ref3 = (0, _slicedToArray3.default)(_ref2, 2),
      col = _ref3[0],
      num = _ref3[1];

  return col ? (0, _transformation.sequence)(col, take(num)) : function (xform) {
    return takeTransformer(num, xform);
  };
}

var takeWhileTransformer = function takeWhileTransformer(fn, xform) {
  var _ref4;

  return _ref4 = {
    fn: fn,
    xform: xform

  }, (0, _defineProperty3.default)(_ref4, _protocol.protocols.init, function () {
    return this.xform[_protocol.protocols.init]();
  }), (0, _defineProperty3.default)(_ref4, _protocol.protocols.step, function (acc, input) {
    return this.fn(input) ? this.xform[_protocol.protocols.step](acc, input) : (0, _reduction.ensureReduced)(acc);
  }), (0, _defineProperty3.default)(_ref4, _protocol.protocols.result, function (value) {
    return this.xform[_protocol.protocols.result](value);
  }), _ref4;
};

// Returns a collection that contains all of the elements from the input collection up until the first one that returns
// `false` from the supplied predicate function.
//
// By default, the function is run without context. If a context object is provided, it will become `this` within the
// function.
//
// If no collection is provided, a function is returned that can be passed to a transducer function (sequence, etc.).
function takeWhile(collection, fn, ctx) {
  var _ref5 = (0, _util.isFunction)(collection) ? [null, collection.bind(fn)] : [collection, fn.bind(ctx)],
      _ref6 = (0, _slicedToArray3.default)(_ref5, 2),
      col = _ref6[0],
      func = _ref6[1];

  return col ? (0, _transformation.sequence)(col, takeWhile(func)) : function (xform) {
    return takeWhileTransformer(func, xform);
  };
}

var takeNthTransformer = function takeNthTransformer(n, xform) {
  var _ref7;

  return _ref7 = {
    n: n,
    xform: xform,
    i: -1

  }, (0, _defineProperty3.default)(_ref7, _protocol.protocols.init, function () {
    return this.xform[_protocol.protocols.init]();
  }), (0, _defineProperty3.default)(_ref7, _protocol.protocols.step, function (acc, input) {
    return ++this.i % this.n === 0 ? this.xform[_protocol.protocols.step](acc, input) : acc;
  }), (0, _defineProperty3.default)(_ref7, _protocol.protocols.result, function (value) {
    return this.xform[_protocol.protocols.result](value);
  }), _ref7;
};

// Returns a collection containing the first and then every nth element after that of the input collection.
//
// If no collection is provided, a function is returned that can be passed to a transducer function (sequence, etc.).
function takeNth(collection, n) {
  var _ref8 = (0, _util.isNumber)(collection) ? [null, collection] : [collection, n],
      _ref9 = (0, _slicedToArray3.default)(_ref8, 2),
      col = _ref9[0],
      num = _ref9[1];

  return col ? (0, _transformation.sequence)(col, takeNth(num)) : function (xform) {
    return takeNthTransformer(num, xform);
  };
}

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = __webpack_require__(5);

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _defineProperty2 = __webpack_require__(3);

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

exports.uniqWith = uniqWith;
exports.uniqBy = uniqBy;
exports.uniq = uniq;

var _protocol = __webpack_require__(1);

var _transformation = __webpack_require__(4);

var _util = __webpack_require__(0);

var _core = __webpack_require__(14);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright (c) 2017 Thomas Otterson
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// uniq.js
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var uniqTransformer = function uniqTransformer(fn, xform) {
  var _ref;

  return _ref = {
    fn: fn,
    xform: xform,
    uniques: []

  }, (0, _defineProperty3.default)(_ref, _protocol.protocols.init, function () {
    return this.xform[_protocol.protocols.init]();
  }), (0, _defineProperty3.default)(_ref, _protocol.protocols.step, function (acc, input) {
    var _this = this;

    if (this.uniques.some(function (u) {
      return _this.fn(input, u);
    })) {
      return acc;
    }
    this.uniques.push(input);
    return this.xform[_protocol.protocols.step](acc, input);
  }), (0, _defineProperty3.default)(_ref, _protocol.protocols.result, function (value) {
    return this.xform[_protocol.protocols.result](value);
  }), _ref;
};

// Returns a collection containing only unique elements from the input collection. Uniqueness is determined by passing
// each pair of elements through the provided function; those that return the same value from this function are
// considered equal (and therefore only one of them will make its way to the output collection).
//
// By default, the function is run without context. If a context object is provided, it will become `this` within the
// function.
//
// If no collection is provided, a function is returned that can be passed to a transducer function (sequence, etc.).
function uniqWith(collection, fn, ctx) {
  var _ref2 = (0, _util.isFunction)(collection) ? [null, collection.bind(fn)] : [collection, fn.bind(ctx)],
      _ref3 = (0, _slicedToArray3.default)(_ref2, 2),
      col = _ref3[0],
      func = _ref3[1];

  return col ? (0, _transformation.sequence)(col, uniqWith(func)) : function (xform) {
    return uniqTransformer(func, xform);
  };
}

// Returns a collection containing only unique elements from the input collection. Uniqueness is determined by passing
// each pair of elements through the provided function; the values that are returned from this function are
// compared (using SameValueZero) to determine whether they're unique.
//
// By default, the function is run without context. If a context object is provided, it will become `this` within the
// function.
//
// If no collection is provided, a function is returned that can be passed to a transducer function (sequence, etc.).
function uniqBy(collection, fn, ctx) {
  var _ref4 = (0, _util.isFunction)(collection) ? [null, collection.bind(fn)] : [collection, fn.bind(ctx)],
      _ref5 = (0, _slicedToArray3.default)(_ref4, 2),
      col = _ref5[0],
      func = _ref5[1];

  return uniqWith(col, function (a, b) {
    return (0, _core.sameValueZero)(func(a), func(b));
  });
}

// Returns a collection containing only unique elements from the input collection. Unique elements are those that are
// not equal (using SameValueZero) to any other element in the collection.
//
// If no collection is provided, a function is returned that can be passed to a transducer function (sequence, etc.).
function uniq(collection) {
  return uniqWith(collection, _core.sameValueZero);
}

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(67), __esModule: true };

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(68), __esModule: true };

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(69), __esModule: true };

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(70), __esModule: true };

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(71), __esModule: true };

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(73), __esModule: true };

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(72), __esModule: true };

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(74), __esModule: true };

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(38);
__webpack_require__(37);
module.exports = __webpack_require__(94);

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(38);
__webpack_require__(37);
module.exports = __webpack_require__(95);

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(97);
var $Object = __webpack_require__(2).Object;
module.exports = function defineProperty(it, key, desc){
  return $Object.defineProperty(it, key, desc);
};

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(98);
module.exports = __webpack_require__(2).Object.getPrototypeOf;

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(99);
module.exports = __webpack_require__(2).Object.keys;

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(50);
module.exports = __webpack_require__(2).Symbol['for'];

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(50);
__webpack_require__(100);
__webpack_require__(101);
__webpack_require__(102);
module.exports = __webpack_require__(2).Symbol;

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(37);
__webpack_require__(38);
module.exports = __webpack_require__(36).f('iterator');

/***/ }),
/* 75 */
/***/ (function(module, exports) {

module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};

/***/ }),
/* 76 */
/***/ (function(module, exports) {

module.exports = function(){ /* empty */ };

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(11)
  , toLength  = __webpack_require__(92)
  , toIndex   = __webpack_require__(91);
module.exports = function(IS_INCLUDES){
  return function($this, el, fromIndex){
    var O      = toIObject($this)
      , length = toLength(O.length)
      , index  = toIndex(fromIndex, length)
      , value;
    // Array#includes uses SameValueZero equality algorithm
    if(IS_INCLUDES && el != el)while(length > index){
      value = O[index++];
      if(value != value)return true;
    // Array#toIndex ignores holes, Array#includes - not
    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
      if(O[index] === el)return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(75);
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

// all enumerable object keys, includes symbols
var getKeys = __webpack_require__(18)
  , gOPS    = __webpack_require__(45)
  , pIE     = __webpack_require__(28);
module.exports = function(it){
  var result     = getKeys(it)
    , getSymbols = gOPS.f;
  if(getSymbols){
    var symbols = getSymbols(it)
      , isEnum  = pIE.f
      , i       = 0
      , key;
    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))result.push(key);
  } return result;
};

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(7).document && document.documentElement;

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(24);
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

// 7.2.2 IsArray(argument)
var cof = __webpack_require__(24);
module.exports = Array.isArray || function isArray(arg){
  return cof(arg) == 'Array';
};

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create         = __webpack_require__(43)
  , descriptor     = __webpack_require__(22)
  , setToStringTag = __webpack_require__(29)
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__(12)(IteratorPrototype, __webpack_require__(6)('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
  setToStringTag(Constructor, NAME + ' Iterator');
};

/***/ }),
/* 84 */
/***/ (function(module, exports) {

module.exports = function(done, value){
  return {value: value, done: !!done};
};

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

var getKeys   = __webpack_require__(18)
  , toIObject = __webpack_require__(11);
module.exports = function(object, el){
  var O      = toIObject(object)
    , keys   = getKeys(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
};

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

var META     = __webpack_require__(23)('meta')
  , isObject = __webpack_require__(21)
  , has      = __webpack_require__(9)
  , setDesc  = __webpack_require__(10).f
  , id       = 0;
var isExtensible = Object.isExtensible || function(){
  return true;
};
var FREEZE = !__webpack_require__(16)(function(){
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function(it){
  setDesc(it, META, {value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  }});
};
var fastKey = function(it, create){
  // return primitive with prefix
  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return 'F';
    // not necessary to add metadata
    if(!create)return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function(it, create){
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return true;
    // not necessary to add metadata
    if(!create)return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function(it){
  if(FREEZE && meta.NEED && isExtensible(it) && !has(it, META))setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY:      META,
  NEED:     false,
  fastKey:  fastKey,
  getWeak:  getWeak,
  onFreeze: onFreeze
};

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

var dP       = __webpack_require__(10)
  , anObject = __webpack_require__(15)
  , getKeys  = __webpack_require__(18);

module.exports = __webpack_require__(8) ? Object.defineProperties : function defineProperties(O, Properties){
  anObject(O);
  var keys   = getKeys(Properties)
    , length = keys.length
    , i = 0
    , P;
  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
  return O;
};

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

var pIE            = __webpack_require__(28)
  , createDesc     = __webpack_require__(22)
  , toIObject      = __webpack_require__(11)
  , toPrimitive    = __webpack_require__(34)
  , has            = __webpack_require__(9)
  , IE8_DOM_DEFINE = __webpack_require__(41)
  , gOPD           = Object.getOwnPropertyDescriptor;

exports.f = __webpack_require__(8) ? gOPD : function getOwnPropertyDescriptor(O, P){
  O = toIObject(O);
  P = toPrimitive(P, true);
  if(IE8_DOM_DEFINE)try {
    return gOPD(O, P);
  } catch(e){ /* empty */ }
  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
};

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = __webpack_require__(11)
  , gOPN      = __webpack_require__(44).f
  , toString  = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function(it){
  try {
    return gOPN(it);
  } catch(e){
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it){
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};


/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(32)
  , defined   = __webpack_require__(25);
// true  -> String#at
// false -> String#codePointAt
module.exports = function(TO_STRING){
  return function(that, pos){
    var s = String(defined(that))
      , i = toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(32)
  , max       = Math.max
  , min       = Math.min;
module.exports = function(index, length){
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(32)
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

var classof   = __webpack_require__(39)
  , ITERATOR  = __webpack_require__(6)('iterator')
  , Iterators = __webpack_require__(17);
module.exports = __webpack_require__(2).getIteratorMethod = function(it){
  if(it != undefined)return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(15)
  , get      = __webpack_require__(93);
module.exports = __webpack_require__(2).getIterator = function(it){
  var iterFn = get(it);
  if(typeof iterFn != 'function')throw TypeError(it + ' is not iterable!');
  return anObject(iterFn.call(it));
};

/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

var classof   = __webpack_require__(39)
  , ITERATOR  = __webpack_require__(6)('iterator')
  , Iterators = __webpack_require__(17);
module.exports = __webpack_require__(2).isIterable = function(it){
  var O = Object(it);
  return O[ITERATOR] !== undefined
    || '@@iterator' in O
    || Iterators.hasOwnProperty(classof(O));
};

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__(76)
  , step             = __webpack_require__(84)
  , Iterators        = __webpack_require__(17)
  , toIObject        = __webpack_require__(11);

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__(42)(Array, 'Array', function(iterated, kind){
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , kind  = this._k
    , index = this._i++;
  if(!O || index >= O.length){
    this._t = undefined;
    return step(1);
  }
  if(kind == 'keys'  )return step(0, index);
  if(kind == 'values')return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(20);
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !__webpack_require__(8), 'Object', {defineProperty: __webpack_require__(10).f});

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 Object.getPrototypeOf(O)
var toObject        = __webpack_require__(33)
  , $getPrototypeOf = __webpack_require__(46);

__webpack_require__(48)('getPrototypeOf', function(){
  return function getPrototypeOf(it){
    return $getPrototypeOf(toObject(it));
  };
});

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 Object.keys(O)
var toObject = __webpack_require__(33)
  , $keys    = __webpack_require__(18);

__webpack_require__(48)('keys', function(){
  return function keys(it){
    return $keys(toObject(it));
  };
});

/***/ }),
/* 100 */
/***/ (function(module, exports) {



/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(35)('asyncIterator');

/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(35)('observable');

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(51);


/***/ })
/******/ ]);
});