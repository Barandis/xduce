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
/******/ 	return __webpack_require__(__webpack_require__.s = 14);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

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

/**
 * A whole bunch of utility functions. These are all used by the library itself in places, but many of them are
 * suitable for general use as well.
 ^
 * @module util
 * @private
 */

/**
 * `Object`'s `toString` is explicitly used throughout because it could be redefined in any subtype of `Object`.
 *
 * @function toString
 * @private
 */
const toString = Object.prototype.toString;

/**
 * **Determines whether a value is an array.**
 *
 * This function merely delegates to `Array.isArray`. It is provided for consistency in calling style only.
 *
 * @function isArray
 * @memberof module:xduce.util
 *
 * @param {*} x The value being tested to see if it is an array.
 * @return {boolean} Either `true` if the test value is an array or `false` if it is not.
 */
const isArray = Array.isArray;

/**
 * **Determines whether a value is a function.**
 *
 * @memberof module:xduce.util
 *
 * @param {*} x The value being tested to see if it is a function.
 * @return {boolean} Either `true` if the test value is a function or `false` if it is not.
 */
function isFunction(x) {
  return toString.call(x) === '[object Function]';
}

/**
 * **Determines whether a value is a plain object.**
 *
 * This function returns `false` if the value is any other sort of built-in object (such as an array or a string). It
 * also returns `false` for any object that is created by a constructor that is not `Object`'s constructor, meaning that
 * "instances" of custom "classes" will return `false`. Therefore it's only going to return `true` for literal objects
 * or those created with `Object.create()`.
 *
 * @memberof module:xduce.util
 *
 * @param {*} x The value being tested to see if it is a plain object.
 * @return {boolean} Either `true` if the test value is a plain object or `false` if it is not.
 */
function isObject(x) {
  // This check is true on all objects, but also on all objects created by custom constructors (which we don't want).
  // Note that in ES2015 and later, objects created by using `new` on a `class` will return false directly right here.
  if (toString.call(x) !== '[object Object]') {
    return false;
  }

  // The Object prototype itself passes, along with objects created without a prototype from Object.create(null);
  const proto = Object.getPrototypeOf(x);
  if (proto === null) {
    return true;
  }

  // Check to see whether the constructor of the tested object is the Object constructor,
  const ctor = Object.prototype.hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof ctor === 'function' && ctor === Object;
}

/**
 * **Determines whether a value is a number.**
 *
 * This function will return `true` for any number literal or instance of `Number` except for `Infinity` or `NaN`. It
 * will return `false` for strings that happen to also be numbers; the value must be an actual `Number` instance or
 * number literal to return `true`.
 *
 * @memberof module:xduce.util
 *
 * @param {*} x The value being tested to see if it is a number.
 * @return {boolean} Either `true` if the test value is a finite number (not including string representations of
 *     numbers) or `false` if it is not.
 */
function isNumber(x) {
  return toString.call(x) === '[object Number]' && isFinite(x);
}

/**
 * **Determines whether a value is a string.**
 *
 * Literal strings will return `true`, as will instances of the `String` object.
 *
 * @memberof module:xduce.util
 *
 * @param {*} x The value being tested to see if it is a string.
 * @return {boolean} Either `true` if the test value is a string or `false` if it is not.
 */
function isString(x) {
  return toString.call(x) === '[object String]';
}

/**
 * **Returns the character at a particular index in a string, taking double-width
 * <abbr title="Basic Multilingual Plane">BMP</abbr> characters into account.**
 *
 * This is a BMP version of the standard JavaScript `string.charAt` function. The index is adjusted to account for
 * double-width characters in the input string, and if the resulting character is double-width, it will be returned as a
 * two-character string. The second half of these double-width characters don't get assigned an index at all, so it
 * works seemlessly between character widths.
 *
 * @function charAt
 * @memberof module:xduce.util.bmp
 *
 * @param {string} str The input string whose character at the given index is sought.
 * @param {number} index The index in the input string of the character being sought.
 * @return {string} The character at the given index in the provided string. If this character is a BMP character,
 *     the full character will be returned as a two-character string.
 */
function bmpCharAt(str, index) {
  const s = str + '';
  let i = index;
  const end = s.length;

  const pairs = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
  while (pairs.exec(s)) {
    const li = pairs.lastIndex;
    if (li - 2 < i) {
      i++;
    } else {
      break;
    }
  }

  if (i >= end || i < 0) {
    return '';
  }

  let result = s.charAt(i);

  if (/[\uD800-\uDBFF]/.test(result) && /[\uDC00-\uDFFF]/.test(s.charAt(i + 1))) {
    result += s.charAt(i + 1);
  }

  return result;
}

/**
 * **Calculates the length of a string, taking double-width <abbr title="Basic Multilingual Plane">BMP</abbr>
 * characters into account.**
 *
 * Since this function takes double-width characters into account and the build in string `length` property does not,
 * it is entirely possible for this function to provide a different result than querying the same string's `length`
 * property.
 *
 * @function length
 * @memberof module:xduce.util.bmp
 *
 * @param {string} str The string whose length is being determined.
 * @return {number} The number of characters in the string, counting double-width BMP characters as single characters.
 */
function bmpLength(str) {
  const s = str + '';

  const matches = s.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g);
  const count = matches ? matches.length : 0;
  return s.length - count;
}

/**
 * **Creates an array of values between the specified ranges.**
 *
 * The actual range is `[start, end)`, meaning that the start value is a part of the array, but the end value is not.
 *
 * If only one parameter is supplied, it is taken to be `end`, and `start` is set to 0. If there is a third parameter,
 * it defines the distance between each successive element of the array; if this is missing, it's set to 1 if `start` is
 * less than `end` (an ascending range) or -1 if `end` is less than `start` (a descending range).
 *
 * If the step is going in the wrong direction - it's negative while `start` is less than `end`, or vice versa - then
 * the `start` value will be the only element in the returned array. This prevents the function from trying to
 * generate infinite ranges.
 *
 * ```
 * const { range } = xduce.util;
 *
 * console.log(range(5));         // -> [0, 1, 2, 3, 4]
 * console.log(range(1, 5));      // -> [1, 2, 3, 4]
 * console.log(range(0, 5, 2));   // -> [0, 2, 4]
 * console.log(range(5, 0, -1));  // -> [5, 4, 3, 2, 1]
 * console.log(range(5, 0));      // -> [5, 4, 3, 2, 1]
 * console.log(range(0, 5, -2));  // -> [0]
 * ```
 *
 * @memberof module:xduce.util
 *
 * @param {number} [start=0] The starting point, inclusive, of the array. This value will be the first value of the
 *     array.
 * @param {number} end The ending point, exclusive, of the array. This value will *not* be a part of the array; it will
 *     simply define the upper (or lower, if the array is descending) bound.
 * @param {number} [step=1|-1] The amount that each element of the array increases over the previous element. If this is
 *     not present, it will default to `1` if `end` is greater than `start`, or `-1` if `start` is greater than `end`.
 * @return {number[]} An array starting at `start`, with each element increasing by `step` until it reaches the last
 *     number before `end`.
 */
function range(start, end, step) {
  const [s, e] = end == null ? [0, start] : [start, end];
  const t = step || (s > e ? -1 : 1);

  // This aborts the production if a bad step is given; i.e., if the step is going in a direction that does not lead
  // to the end. This prevents the function from never reaching the end value and trying to create an infinite range.
  if (Math.sign(t) !== Math.sign(e - s)) {
    return [s];
  }

  const result = [];
  for (let i = s; t < 0 ? i > e : i < e; i += t) {
    result.push(i);
  }
  return result;
}

/**
 * **Creates a function that returns the opposite of the supplied predicate function.**
 *
 * The parameter lists of the input and output functions are exactly the same. The only difference is that the two
 * functions will return opposite results. If a non-predicate function is passed into this function, the resulting
 * function will still return a boolean that is the opposite of the truthiness of the original.
 *
 * ```
 * const even = x => x % 2 === 0;
 * const odd = xduce.util.complement(even);
 *
 * console.log(even(2));      // -> true
 * console.log(odd(2));       // -> false
 * ```
 *
 * @memberof module:xduce.util
 *
 * @param {function} fn A predicate function.
 * @return {function} A new function that takes the same arguments as the input function but returns the opposite
 *     result.
 */
function complement(fn) {
  return (...args) => !fn(...args);
}

module.exports = {
  isArray,
  isObject,
  isFunction,
  isString,
  isNumber,
  bmpCharAt,
  bmpLength,
  range,
  complement
};


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

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

/**
 * Protocols for iteration and reduction. The source for these protocols depends on which protocol it is.
 *
 * Iteration: a part of the ES6 standard.
 * Transduction: agreed to by several parties who maintain transducer libraries in the comment thread for an issue on
 *     one of them ({@link https://github.com/cognitect-labs/transducers-js/issues/20}).
 *
 * @module protocol
 * @private
 */

const { isFunction } = __webpack_require__(0);

/**
 * Whether or not to use symbols for protocol property names if they're available. Even if this is set to `true`,
 * strings will be used for the names if symbols are not available.
 *
 * @private
 * @type {boolean}
 */
const USE_SYMBOLS = true;

/**
 * Whether or not symbols are available in the environment.
 *
 * @private
 * @type {boolean}
 */
const symbol = typeof Symbol !== 'undefined';

/**
 * Generation of the key used on an object to store a protocol function. This is a symbol if symbols are available and
 * {@link module:protocol~USE_SYMBOLS} is set to true; if not, it's a regular string. If a symbol of the supplied name
 * already exists, it'll be used instead of having a new one generated.
 *
 * @private
 *
 * @param {name} name The name of the protocol to generate a key name for.
 * @return {(string|Symbol)} The property key name to use. This is a Symbol if configured to use symbols and if they're
 *     available; otherwise it's a string.
 */
function generateKey(name) {
  return USE_SYMBOLS && symbol ? Symbol.for(name) : `@@${name}`;
}

/**
 * **The mapping of protocol names to their respective property key names.**
 *
 * The values of this map will depend on whether symbols are available, whatever is present here will be used as key
 * names for protocol properties throughout the library.
 *
 * @memberof module:xduce
 * @type {module:xduce~protocolMap}
 */
const protocols = {
  // Since this one is built in, it already has a custom Symbol property, so we don't need to generate a symbol for a
  // key when symbols are supported.
  iterator: symbol ? Symbol.iterator : '@@iterator',

  // Reduction protocols
  init: generateKey('transducer/init'),
  step: generateKey('transducer/step'),
  result: generateKey('transducer/result'),
  reduced: generateKey('transducer/reduced'),
  value: generateKey('transducer/value')
};

/**
 * Determines whether an object implements a given protocol. Generally, a protocol is implemented if the object has a
 * function property with the name of that protocol (as given in the protocol object). For iteration, it's accepted that
 * an object with a `next` function is also an iterator, so we make a specific check for that.
 *
 * For the reduced and value protocols, the requirement that the property be a function is waived.
 *
 * @private
 *
 * @param {*} obj The value to be checked to see if it implements a protocol.
 * @param {string} protocol The short name of the protocol, as reflected in {@link module:xduce.protocols|protocols}.
 *     This is one of `iterator`, `init`, `step`, `result`, `reduced`, or `value`.
 * @return {boolean} Either `true` if the value implements the protocol or `false` if it does not.
 */
function isImplemented(obj, protocol) {
  if (obj == null) {
    return false;
  }
  switch (protocol) {
    case 'iterator':
      return isFunction(obj[protocols.iterator] || obj.next);
    case 'reduced':
    case 'value':
      return protocols[protocol] in obj;
    default:
      return isFunction(obj[protocols[protocol]]);
  }
}

module.exports = {
  protocols,
  isImplemented
};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

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

/**
 * @module transformation
 * @private
 */

const { protocols, isImplemented } = __webpack_require__(1);
const { isKvFormObject, iterator } = __webpack_require__(5);
const { isReduced, reduce, arrayReducer, objectReducer, stringReducer } = __webpack_require__(3);
const { isArray, isObject, isString } = __webpack_require__(0);
const p = protocols;

// An iterator that also acts as a transformer, transforming its collection one element at a time. This is the actual
// output of the sequence function (when the input collection is an iterator) and the asIterator function.
//
// This object supports non-1-to-1 correspondences between input and output values. For example, a filter transformation
// might return fewer output elements than were in the input collection, while a repeat transformation will return more.
// In either case, `next` in this class will return one element per call.
/**
 * Creates an iterator that is also a transducer, transforming its collection one element at a time. This is the
 * actual output of the {@link module:xduce.asIterator|asIterator} function, as well as the output of the
 * {@link module:xduce.sequence|sequence} function when the input is an iterator.
 *
 * The end user need not be concerned with the type of the output iterator in these circumstances; the end user need
 * only care that the output is, in fact, an iterator and can be expected to act like one. For this reason, this
 * function and the type it returns are not exported.
 *
 * This object supports non-1-to-1 correspondences between input and output values. For example, a filter transformation
 * might return fewer output elements than were in the input collection, while a repeat transformation will return more.
 * In either case, `next` in this class will return one element per call.
 *
 * @private
 *
 * @param {*} collection the input collection that the produced iterator will be iterating over.
 * @param {module:xduce~transducer} xform The transducer function defining the transformation that the generated
 *     iterator will perform on its elements.
 * @return {module:xduce~iterator} An iterator that will transform its input elements using the transducer function as
 *     its `{@link module:xduce~next|next}` function is called.
 */
function transducingIterator(collection, xform) {
  const stepReducer = {
    [p.step]: (xiter, input) => {
      const value = isKvFormObject(input) ? { [input.k]: input.v } : input;
      xiter.items.unshift(value);
      return xiter;
    },
    [p.result]: value => value
  };

  const iter = iterator(collection, null, true);
  const xf = xform(stepReducer);
  let reduced = false;

  return {
    // This array is the key to working properly with step functions that return more than one value. All of them are
    // put into the items array. As long as this array has values in it, the `next` function will return one value
    // popped from it rather than running the step function again.
    items: [],

    // This object is an iterator itself, so just return this. This function serves to make the iterator work right in
    // ES2015, so it can be used in for...of expressions, for instance.
    [p.iterator]() {
      return this;
    },

    // The next function here is rather simple. If there is already something in the items array, it's returned. If not,
    // the step function is run and, if that results in a value in the items array, it's returned. Otherwise an object
    // with {done: true} is returned.
    next() {
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
    },

    // This is where most of the work happens. It gets the next value from the input collection and runs it through the
    // reduction step functions. If that results in a value, it's given to the stepper object (which adds it to the
    // items array); otherwise the while loop continues to the next element of the input collection. This ensures that
    // there's something for the `next` function to return each time it's called.
    //
    // If the collection has completed or if the step function returns a reduced object (which take will do after its
    // limit of elements has been reached, for instance), the iteration is completed by calling the result function.
    step() {
      const count = this.items.length;
      while (this.items.length === count) {
        const step = iter.next();
        if (step.done || reduced) {
          xf[p.result](this);
          break;
        }
        reduced = isReduced(xf[p.step](this, step.value));
      }
    }
  };
}

/**
 * **Transforms the elements of the input collection and reduces them into an output collection.**
 *
 * This is the lowest-level of the transduction functions that is likely to see regular use. It does not assume anything
 * about the reducer, as it asks for it to be passed explicitly. This means that any kind of collection can be produced,
 * since the reducer is not tied to the input collection in any way.
 *
 * `transduce` also will accept an initial value for the resulting collection as the optional last parameter. If this
 * parameter isn't present, then the initial value is determined from the transducer init protocol property on the
 * reducer. Note however that many reducers may not provide an initial value, and in those cases it will *have* to be
 * passed as a parameter.
 *
 * ```
 * const xform = map(x => x + 1);
 *
 * const arrayReducer = {
 *   [protocols.init]() { return []; },
 *   [protocols.result](x) { return x; },
 *   [protocols.step](acc, x) {
 *     acc.push(x);
 *     return acc;
 *   }
 * };
 *
 * const stringReducer = {
 *   [protocols.init]() { return ''; },
 *   [protocols.result](x) { return x; },
 *   [protocols.step](acc, x) { return acc + x; }
 * };
 *
 * let result = transduce([1, 2, 3, 4, 5], xform, arrayReducer);
 * // result = [2, 3, 4, 5, 6]
 *
 * result = transduce([1, 2, 3, 4, 5], xform, stringReducer);
 * // result = '23456'
 *
 * result = transduce('12345', xform, arrayReducer);
 * // result = [2, 3, 4, 5, 6]
 *
 * result = transduce('12345', xform, stringReducer);
 * // result = '23456'
 * ```
 *
 * These examples illustrate a number of important concepts. First of all, the transducer function is independent of the
 * type of the collection; the same transducer function is used no matter the type of input or output collections.
 * Secondly, two reducers are defined. These are objects that conform to the transducer protocol (see the documentation
 * on `{@link module:xduce.protocols}`) and that know how to produce the output collection of choice. In this case, the
 * reducers know how to create new arrays and strings (the `init` protocol) and how to add elements to arrays and
 * strings (the `step` protocol). Because these reducers do have `init` protocol properties, the `transduce` calls do
 * not require explicit initial collections.
 *
 * The final point is that `transduce` can accept any kind of iterable collection, and by passing in the proper reducer,
 * it can produce any kind of output collection. The same `transduce` function and the same map transformer is used in
 * all four examples, despite the input/output combination being different in all four.
 *
 * The `init` collection doesn't have to be empty. If it isn't, the elements that are already in it are retained and the
 * transformed input elements are reduced into the collection normally.
 *
 * Of course, the examples are not really necessary - the same thing could be accomplished using
 * `{@link module:xduce.into|into}` without having to create the reducers (strings and arrays passed to
 * `{@link module:xduce.into|into}` as targets know how to reduce themselves already).
 *
 * @memberof module:xduce
 *
 * @param {*} collection The input collection. The only requirement of this collection is that it implement the
 *     `iterator` protocol. Special support is provided by the library for objects and pre-ES2015 arrays and strings
 *     (ES2015 arrays and strings already implement `iterator`), so any of those can also be used.
 * @param {module:xduce~transducer} xform The function used to transform the input collection elements before they're
 *     reduced into the output collection. This must be a function that takes one parameter, expected to be another
 *     transducer function for chaining, and returns an object that implements the transducer protocols (`init`, `step`,
 *     and `result`). Any of the transducer functions in this library are suitable.
 * @param {object} reducer An object that implements the transducer protocols (`init` is only required if the `init`
 *     parameter is not present). This object must know how to produce an output collection through its `step` and
 *     `result` protocol functions.
 * @param {*} [init] aAcollection of the same type as the output collection. If this is not present, then the reducer's
 *     `init` protocol function is called instead to get the initial collection. If it is present and not empty, then
 *     the existing elements remain and the transformed input collection elements are added to it.
 * @return {*} A collection of a type determined by the passed reducer. The elements of this collection are the results
 *     from the transformer function being applied to each element of the input collection.
 */
function transduce(collection, xform, reducer, init = reducer[p.init]()) {
  const xf = xform ? xform(reducer) : reducer;
  return reduce(collection, xf, init);
}

/**
 * **Transforms the elements of the input collection and reduces them into a new array.**
 *
 * The transformer is optional. If it isn't present, this function just converts the input collection into an array.
 *
 * ```
 * const xform = map(x => x + 1);
 *
 * let result = asArray([1, 2, 3, 4, 5], xform);
 * // result = [2, 3, 4, 5, 6]
 *
 * result = asArray('12345', xform);
 * // result = [2, 3, 4, 5, 6]
 *
 * result = asArray('12345');
 * // result = [1, 2, 3, 4, 5]
 *
 * result = asArray({a: 1, b: 2});
 * // result = [{a: 1}, {b: 2}]
 * ```
 *
 * @memberof module:xduce
 *
 * @param {*} collection The input collection. The only requirement of this collection is that it implement the
 *     `iterator` protocol. Special support is provided by the library for objects and pre-ES2015 arrays and strings
 *     (ES2015 arrays and strings already implement `iterator`), so any of those can also be used.
 * @param {module:xduce~transducer} [xform] The function used to transform the input collection elements before they're
 *     reduced into the output array. This must be a function that takes one parameter, expected to be another
 *     transducer function for chaining, and returns an object that implements the transducer protocols (`init`, `step`,
 *     and `result`). Any of the transducers in this library are suitable functions. If this isn't present, the input
 *     collection will simply be reduced into an array without transformation.
 * @return {array} An array containing all of the transformed values from the input collection elements.
 */
function asArray(collection, xform) {
  return transduce(collection, xform, arrayReducer);
}

/**
 * **Transforms the elements of the input collection and reduces them into a new object.**
 *
 * The transformer is optional. If it isn't present, this function just converts the input collection into an object.
 *
 * ```
 * const xform = map(({ k, v }) => ({ [k]: v + 1 }));
 *
 * let result = asObject({a: 1, b: 2}, xform);
 * // result = {a: 2, b: 3}
 *
 * result = asObject([{a: 1}, {b: 2}], xform);
 * // result = {a: 2, b: 3}
 *
 * result = asObject([1, 2, 3, 4, 5]);
 * // result = {0: 1, 1: 2, 2: 3, 3: 4, 4: 5}
 *
 * result = asObject('hello');
 * // result = {0: 'h', 1: 'e', 2: 'l', 3: 'l', 4: 'o'}
 * ```
 *
 * @memberof module:xduce
 *
 * @param {*} collection The input collection. The only requirement of this collection is that it implement the
 *     `iterator` protocol. Special support is provided by the library for objects and pre-ES2015 arrays and strings
 *     (ES2015 arrays and strings already implement `iterator`), so any of those can also be used.
 * @param {module:xduce~tranducer} [xform] The function used to transform the input collection elements before they're
 *     reduced into the output object. This must be a function that takes one parameter, expected to be another
 *     transducer function for chaining, and returns an object that implements the transducer protocols (`init`, `step`,
 *     and `result`). Any of the transducers in this library are suitable functions. If this isn't present, the input
 *     collection will simply be reduced into an object without transformation.
 * @return {object} An object containing all of the transformed values from the input collection elements.
 */
function asObject(collection, xform) {
  return transduce(collection, xform, objectReducer);
}

/**
 * **Transforms the elements of the input collection and reduces them into a new string.**
 *
 * The transformer is optional. If it isn't present, this function just converts the input collection into an string.
 *
 * ```
 * const xform = map(x => x.toUpperCase());
 *
 * let result = asString('hello', xform);
 * // result = 'HELLO'
 *
 * result = asString(['h', 'e', 'l', 'l', 'o'], xform);
 * // result = 'HELLO'
 *
 * result = asString([1, 2, 3, 4, 5]);
 * // result = '12345'
 *
 * result = asString({a: 1, b: 2});
 * // result = '12'
 * ```
 *
 * @memberof module:xduce
 *
 * @param {*} collection The input collection. The only requirement of this collection is that it implement the
 *     `iterator` protocol. Special support is provided by the library for objects and pre-ES2015 arrays and strings
 *     (ES2015 arrays and strings already implement `iterator`), so any of those can also be used.
 * @param {module:xduce~transducer} [xform] The function used to transform the input collection elements before they're
 *     reduced into the output string. This must be a function that takes one parameter, expected to be another
 *     transducer function for chaining, and returns an object that implements the transducer protocols (`init`, `step`,
 *     and `result`). Any of the transducers in this library are suitable functions. If this isn't present, the input
 *     collection will simply be reduced into a string without transformation.
 * @return {string} A string containing all of the transformed values from the input collection elements.
 */
function asString(collection, xform) {
  return transduce(collection, xform, stringReducer);
}

/**
 * **Transforms the elements of the input collection and reduces them into a new iterator.**
 *
 * The transformer is optional. If it isn't present, this function just converts the input collection into an iterator.
 *
 * *(The results here are shown passed through `asArray` because there's no literal interpretation of an iterator to
 * show. The `asArray` calls are for demonstration purposes only.)*
 *
 * ```
 * const xform = map(x => x + 1);
 * function* five() {
 *   for (let i = 1; i <= 5; ++i) {
 *     yield i;
 *   }
 * };
 *
 * let result = asIterator(five(), xform);
 * // asArray(result) = [2, 3, 4, 5, 6]
 *
 * result = asIterator([1, 2, 3, 4, 5], xform);
 * // asArray(result) = [2, 3, 4, 5, 6]
 *
 * result = asIterator([1, 2, 3, 4, 5]);
 * // asArray(result) = [1, 2, 3, 4, 5]
 *
 * result = asIterator({a: 1, b: 2});
 * // asArray(result) = [{a: 1}, {b: 2}]
 * ```
 *
 * @memberof module:xduce
 *
 * @param {*} collection The input collection. The only requirement of this collection is that it implement the
 *     `iterator` protocol. Special support is provided by the library for objects and pre-ES2015 arrays and strings
 *     (ES2015 arrays and strings already implement `iterator`), so any of those can also be used.
 * @param {module:xduce~transducer} [xform] The function used to transform the input collection elements before they're
 *     reduced into the output iterator. This must be a function that takes one parameter, expected to be another
 *     transducer function for chaining, and returns an object that implements the transducer protocols (`init`, `step`,
 *     and `result`). Any of the transducers in this library are suitable functions. If this isn't present, the input
 *     collection will simply be reduced into an iterator without transformation.
 * @return {module:xduce~iterator} An iterator containing all of the transformed values from the input collection
 *     elements.
 */
function asIterator(collection, xform) {
  return xform ? transducingIterator(collection, xform) : iterator(collection);
}

/**
 * **Transforms the elements of the input collection and reduces them into a new collection of the same type.**
 *
 * This is the highest level of the three main transduction functions (`sequence`, `{@link module:xduce.into|into}`,
 * and `{@link module:xduce.transduce|transduce}`). It creates a new collection of the same type as the input collection
 * and reduces the transformed elements into it. Additionally, unlike `{@link module:xduce.into|into}` and
 * `{@link module:xduce.transduce|transduce}`, this function is capable of producing an iterator (as long as the input
 * is an iterator).
 *
 * The input collection must not only implement the `iterator` protocol (as in the last two functions) but also the
 * `init`, `result`, and `step` transducer protocols. Special support is provided for arrays, strings, objects, and
 * iterators, so they need not implement any protocol.
 *
 * The obvious limitation of this function is that the type of output collection cannot be chosen. Since it is always
 * the same as the input collection, this function cannot be used to convert a collection into a different type.
 *
 * ```
 * const xform = map(x => x + 1);
 *
 * let result = sequence([1, 2, 3, 4, 5], xform);
 * // result = [2, 3, 4, 5, 6]
 *
 * result = sequence('12345', xform);
 * // result = '23456'
 * ```
 *
 * These examples are identical to two of the four examples from the `asX` functions. The other two examples are not
 * possible with `sequence` because they have different input and output collection types.
 *
 * @memberof module:xduce
 *
 * @param {*} collection The input collection. This must implement the `iterator`, `init`, `result`, and `step`
 *     protocols. Special support is provided for arrays, strings, objects, and iterators, so they do not have to
 *     implement any protocols.
 * @param {module:xduce~transducer} xform The transducer function used to transform the input collection elements before
 *     they're reduced into the target collection. This must be a function that takes one parameter, expected to be
 *     another transformer function for chaining, and returns an object that implements the transducer protocols
 *     (`init`, `step`, and `result`). Any of the transfducrs in this library are suitable functions.
 * @return {*} A collection of the same type as the input collection, containing all of the transformed values from the
 *     input collection elements.
 */
function sequence(collection, xform) {
  switch (true) {
    case isArray(collection):
      return asArray(collection, xform);
    case isObject(collection):
      return asObject(collection, xform);
    case isString(collection):
      return asString(collection, xform);
    case isImplemented(collection, 'step'):
      return transduce(collection, xform, collection);
    case isImplemented(collection, 'iterator'):
      return asIterator(collection, xform);
    default:
      throw Error(`Cannot sequence collection: ${collection}`);
  }
}

/**
 * **Transforms the elements of the input collection and reduces them into the target collection.**
 *
 * This is much like `{@link module:xduce.transduce|transduce}`, except that instead of explicitly providing a reducer
 * (and perhaps an initial collection), the target collection acts as a reducer itself. This requires that the
 * collection implement the `init`, `result`, and `step` transducer protocol functions.
 *
 * If no transducer function is provided, the input collection elements are reduced into the target collection without
 * being transformed. This can be used to convert one kind of collection into another.
 *
 * ```
 * const xform = map(x => x + 1);
 *
 * let result = into([], [1, 2, 3, 4, 5], xform);
 * // result = [2, 3, 4, 5, 6]
 *
 * result = into('', [1, 2, 3, 4, 5], xform);
 * // result = '23456'
 *
 * result = into([], '12345', xform);
 * // result = [2, 3, 4, 5, 6]
 *
 * result = into('', '12345', xform);
 * // result = '23456'
 * ```
 *
 * These examples are exactly equivalent to the four examples under `{@link module:xduce.transduce|transduce}`, but
 * using `into` instead.
 *
 * @memberof module:xduce
 *
 * @param {*} target The collection into which all of the transformed input collection elements will be reduced. This
 *     collection must implement the `init`, `result`, and `step` protocol functions from the transducer protocol.
 *     Special support is provided for arrays, strings, and objects, so they need not implement the protocol.
 * @param {*} collection The input collection. The only requirement of this collection is that it implement the
 *     `iterator` protocol. Special support is provided by the library for objects and pre-ES2015 arrays and strings
 *     (ES2015 arrays and strings already implement `iterator`), so any of those can also be used.
 * @param {module:xduce~transducer} [xform] The transducer function used to transform the input collection elements
 *     before they're reduced into the target collection. This must be a function that takes one parameter, expected to
 *     be another transducer function for chaining, and returns an object that implements the transducer protocols
 *     (`init`, `step`, and `result`). Any of the transducers in this library are suitable functions. If this isn't
 *     present, the input collection will simply be reduced into the target collection without transformation.
 * @return {*} The `target` collection, with all of the tranformed input collection elements reduced onto it.
 */
function into(target, collection, xform) {
  switch (true) {
    case isArray(target):
      return transduce(collection, xform, arrayReducer, target);
    case isObject(target):
      return transduce(collection, xform, objectReducer, target);
    case isString(target):
      return transduce(collection, xform, stringReducer, target);
    case isImplemented(target, 'step'):
      return transduce(collection, xform, target, target);
    default:
      throw Error(`Cannot reduce collection into ${target}: ${collection}`);
  }
}

/**
 * **Composes two or more transducer functions into a single transducer function.**
 *
 * Each function that takes a transducer function is only capable of accepting one of them. If there is a need to have
 * several transducers chained together, then use `compose` to create a transducer function that does what all of them
 * do.
 *
 * Note that while the transducers have shortcut functions, this composition is not a shortcut function. It cannot be
 * called with a collection parameter. Instead, pass it like any transformer function would be passed to
 * `{@link module:xduce.sequence|sequence}`, `{@link module:xduce.into|into}`, and the like.
 *
 * NOTE: In functional programming, a compose function is generally ordered so that the first-executed function is
 * listed last. This is done in the opposite way, with the first transducer executing first, etc. This is more sensible
 * for transducer functions.
 *
 * ```
 * const add1 = x => x + 1;
 * const odd = x => x % 2 !== 0;
 *
 * const xform = compose(map(add1), filter(odd), take(3));
 *
 * const result = sequence([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], xform);
 * // result = [3, 5, 7];
 * ```
 *
 * @memberof module:xduce
 *
 * @param {...module:xduce~transducer} fns One or more functions used to transform the input collection elements before
 *     they're reduced into the output collection. These must be functions that take one parameter, expected to be
 *     another transducer function for chaining, and return an object that implements the transducer protocols (`init`,
 *     `step`, and `result`). Any of the transducers in this library are suitable functions.
 * @return {module:xduce~transducer} A transducer function that performs all of the transformations of the input
 *     functions, in the order that they're given.
 */
function compose(...fns) {
  const reversedFns = fns.reverse();
  return value => reversedFns.reduce((acc, fn) => fn(acc), value);
}

module.exports = {
  transduce,
  asArray,
  asObject,
  asString,
  asIterator,
  sequence,
  into,
  compose
};


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

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

/**
 * A set of functions related to the producing reducer objects, marking reduced objects, and performing general
 * reduction operations.
 *
 * @module reduction
 * @private
 */

const { isArray, isFunction, isObject, isString } = __webpack_require__(0);
const { isKvFormObject, iterator } = __webpack_require__(5);
const { protocols, isImplemented } = __webpack_require__(1);
const p = protocols;

/**
 * Returns an init function for a collection. This is a function that returns a new, empty instance of the collection in
 * question. If the collection doesn't support reduction, `null` is returned. This makes conditionals a bit easier to
 * work with.
 *
 * In order to support the conversion of functions into reducers, function support is also provided.
 *
 * @private
 *
 * @param {*} collection A collection to create an init function for. This can be anything that supports the ES2015
 *     iteration protocol, a plain object, a pre-ES2015 string or array, or a function.
 * @return {module:xduce~init} A function that, when called, returns an initial version of the provided collection. If
 *     the provided collection is not iterable, then `null` is returned.
 */
function init(collection) {
  switch (true) {
    case isImplemented(collection, 'init'):
      return collection[p.init];
    case isString(collection):
      return () => '';
    case isArray(collection):
      return () => [];
    case isObject(collection):
      return () => ({});
    case isFunction(collection):
      return () => {
        throw Error('init not available');
      };
    default:
      return null;
  }
}

/**
 * Returns a step function for a collection. This is a function that takes an accumulator and a value and returns the
 * result of reducing the value into the accumulator. If the collection doesn't support reduction, `null` is returned.
 * The returned function itself simply reduces the input into the target collection without modifying it.
 *
 * In order to support the conversion of functions into reducers, function support is also provided.
 *
 * @private
 *
 * @param {*} collection A collection to create a step function for. This can be anything that supports the ES2015
 *     iteration protocol, a plain object, a pre-ES2015 string or array, or a function.
 * @return {module:xduce~step} A reduction function for the provided collection that simply adds an element to the
 *     target collection without modifying it. If the provided collection is not iterable, `null` is returned.
 */
function step(collection) {
  switch (true) {
    case isImplemented(collection, 'step'):
      return collection[p.step];

    case isString(collection):
      return (acc, input) => {
        const value = isKvFormObject(input) ? input.v : input;
        return acc + value;
      };

    case isArray(collection):
      return (acc, input) => {
        const value = isKvFormObject(input) ? { [input.k]: input.v } : input;
        acc.push(value);
        return acc;
      };

    case isObject(collection):
      return (acc, input) => {
        let value = input;

        if (isKvFormObject(input)) {
          // if the object is kv-form, change the object from { k: key, v: value } to { key: value }
          value = { [input.k]: input.v };
        } else if (!isObject(input)) {
          // if the input isn't an object at all, turn it into an object with a key based on what's already in the
          // accumulator
          let max = -1;
          for (const k1 in acc) {
            const knum = parseInt(k1);
            if (knum > max) {
              max = knum;
            }
          }
          value = { [max + 1]: input };
        }

        for (const k2 in value) {
          if (value.hasOwnProperty(k2)) {
            acc[k2] = value[k2];
          }
        }
        return acc;
      };

    case isFunction(collection):
      return (acc, input) => collection(acc, input);

    default:
      return null;
  }
}

/**
 * Returns a result function for a collection. This is a function that performs any final processing that should be done
 * on the result of a reduction. If the collection doesn't support reduction, `null` is returned.
 *
 * In order to support the conversion of functions into reducers, function support is also provided.
 *
 * @private
 *
 * @param {*} collection A collection to create a step function for. This can be anything that supports the ES2015
 *     iteration protocol, a plain object, a pre-ES2015 string or array, or a function.
 * @return {module:xduce~result} A function that, when given a reduced collection, produces the final output. If the
 *     provided collection is not iterable, `null` will be returned.
 */
function result(collection) {
  switch (true) {
    case isImplemented(collection, 'result'):
      return collection[p.result];
    case isString(collection):
    case isArray(collection):
    case isObject(collection):
    case isFunction(collection):
      return value => value;
    default:
      return null;
  }
}

/**
 * **Creates a reducer object from a function or from a built-in reducible type (array, object, or string).**
 *
 * To create a reducer for arrays, objects, or strings, simply pass an empty version of that collection to this function
 * (e.g., `toReducer([])`). These reducers support the kv-form for objects.
 *
 * The notable use for this function though is to turn a reduction function into a reducer object. The function is a
 * function oftwo parameters, an accumulator and a value, and returns the accumulator with the value in it. This is
 * exactly the same kind of function that is passed to reduction functions like JavaScript's `Array.prototype.reduce`
 * and Lodash's `_.reduce`.
 *
 * @memberof module:xduce
 *
 * @param {*} collection An iterable collection or a reducer function.
 * @return {object} An object containing protocol properties for init, step, and result. This object is suitable for
 *     use as a reducer object (one provided to `{@link xduce.reduce|reduce}` or `{@link xduce.transduce|transduce}`).
 *     If the provided collection is not iterable, all of the properties of this object will be `null`.
 */
function toReducer(collection) {
  return {
    [p.init]: init(collection),
    [p.step]: step(collection),
    [p.result]: result(collection)
  };
}

// Reducer functions for the three common built-in iterable types.
const arrayReducer = toReducer([]);
const objectReducer = toReducer({});
const stringReducer = toReducer('');

/**
 * **Creates a reduction function from a transducer and a reducer.**
 *
 * This produces a function that's suitable for being passed into other libraries' reduce functions, such as
 * JavaScript's `Array.prototype.reduce` or Lodash's `_.reduce`. It requires both a transformer and a reducer because
 * reduction functions for those libraries must know how to do both. The reducer can be a standard reducer object like
 * the ones sent to`{@link module:xduce.transduce|transduce}` or `{@link module:xduce.reduce|reduce}`, or it can be a
 * plain function that takes two parameters and returns the result of reducing the second parameter into the first.
 *
 * If there is no need for a transformation, then pass in the `{@link module:xduce.identity|identity}` transducer.
 *
 * @memberof module:xduce
 *
 * @param {module:xduce~transducer} xform A transducer whose step function will become the returned reduction function.
 * @param {module:xduce~step} reducer A function that reduces values into the target collection.
 * @return {module:xduce~step} A function that handles both the transformation and the reduction of a value onto a
 *     target function.
 */
function toFunction(xform, reducer) {
  const r = typeof reducer === 'function' ? toReducer(reducer) : reducer;
  const result = xform(r);
  return result[p.step].bind(result);
}

/**
 * **Marks a value as reduced.**
 *
 * This is done by wrapping the value. This means three things: first, a reduced obejct may be marked as reduced again;
 * second, a reduced value isn't usable without being unreduced first; and third any type of value (including
 * `undefined`) may be marked as reduced.
 *
 * @memberof module:xduce.util
 *
 * @param {*} value The value to be reduced.
 * @return {*} A reduced version of the provided value. This reduction is achieved by wrapping the value in a marker
 *     object.
 */
function reduced(value) {
  return {
    [p.reduced]: true,
    [p.value]: value
  };
}

/**
 * **Removes the reduced status from a reduced value.**
 *
 * This function is intended to be used when it's certain that a value is already marked as reduced. If it is not,
 * `undefined` will be returned instead of the value.
 *
 * @memberof module:xduce.util
 *
 * @param {*} value The value to be unreduced.
 * @return {*} An unreduced version of the provided value. If the value was not reduced in the first place, `undefined`
 *     will be returned instead.
 */
function unreduced(value) {
  if (value == null) {
    return;
  }
  return value[p.value];
}

/**
 * **Determines whether a value is marked as reduced.**
 *
 * @memberof module:xduce.util
 *
 * @param {*} value The value to test for its reduced status.
 * @return {boolean} Eitheehr `true` if the value is reduced, or `false` if it is not.
 */
function isReduced(value) {
  if (value == null) {
    return false;
  }
  return !!value[p.reduced];
}

/**
 * **Makes sure that a value is marked as reduced; if it is not, it will be marked as reduced.**
 *
 * This differs from {@link module:xduce.util.reduced|reduced} in that if the value is already reduced, this function
 * won't reduce it again. Therefore thus function can't be used to make a value reduced multiple times.
 *
 * @memberof module:xduce.util
 *
 * @param {*} value The value to be reduced.
 * @return {*} If the value is already reduced, then the value is simply returned. Otherwise, a reduced version of the
 *     value is returned.
 */
function ensureReduced(value) {
  return isReduced(value) ? value : reduced(value);
}

/**
 * **Removes the reduced status from a value, as long as it actually is reduced.**
 *
 * This does a check to make sure the value passed in actually is reduced. If it isn't, the value itself is returned.
 * It's meant to be used when the reduced status is uncertain.
 *
 * @memberof module:xduce.util
 *
 * @param {*} value The reduced value to be unreduced.
 * @return {*} If the value is already unreduced, the value is simply returned. Otherwise an unreduced version of the
 *     value is returned.
 */
function ensureUnreduced(value) {
  return isReduced(value) ? unreduced(value) : value;
}

/**
 * **Reduces the elements of the input collection through a reducer into an output collection.**
 *
 * This is the lowest-level of the transduction functions. In fact, this one is so low-level that it doesn't have a lot
 * of use in normal operation. It's more useful for writing your own transformation functions.
 *
 * `reduce` doesn't assume that there's even a transformation. It requires an initial collection and a reducer object
 * that is matched to that initial collection. The reducer object must implement the `step` and `result` protocols,
 * which instruct `reduce` on how to build up the collection. The reducer may implement a transformation as well, but
 * all that's important here is that it can do the reduction.
 *
 * The input collection need only implement `iterator`. It is not necessary for the input and output collections to be
 * of the same type; as long as the input implements `iterator` and the reducer implements `step` and `result`
 * appropriate to the type of the `init` collection, then any translation between collection types can occur.
 *
 * The normal course of operation will be to call {@link module:xduce.transduce|transduce} instead, as that function
 * makes it easy to combine transformations with reductions and can optionally figure out the initial collection itself.
 *
 * @memberof module:xduce
 *
 * @param {*} collection The input collection. The only requirement of this collection is that it implement the
 *     `iterator` protocol. Special support is provided by the library for objects and pre-ES2015 arrays and strings
 *     (ES2015 arrays and strings already implement `iterator`), so any of those can also be used.
 * @param {object} reducer An object that implements the `step` and `result` protocols. This object must know how to
 *     produce an output collection through those protocol functions.
 * @param {*} init a collection of the same type as the output collection. It need not be empty; if it is not, the
 *     existing elements are retained as the input collection is reduced into it.
 * @return {*} A new collection, consisting of the `init` collection with all of the elements of the `collection`
 *     collection reduced into it.
 */
function reduce(collection, reducer, init) {
  if (collection == null) {
    return null;
  }

  const iter = iterator(collection, null, true);
  if (!iter) {
    throw Error(`Cannot reduce an instance of ${collection.constructor.name}`);
  }

  let acc = init;
  let step = iter.next();

  while (!step.done) {
    acc = reducer[p.step](acc, step.value);
    if (isReduced(acc)) {
      acc = unreduced(acc);
      break;
    }
    step = iter.next();
  }

  return reducer[p.result](acc);
}

module.exports = {
  init,
  step,
  result,
  toReducer,
  arrayReducer,
  objectReducer,
  stringReducer,
  toFunction,
  reduced,
  unreduced,
  isReduced,
  ensureReduced,
  ensureUnreduced,
  reduce
};


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

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
// core.js
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const { protocols } = __webpack_require__(1);
const { sequence } = __webpack_require__(2);
const { isIterable } = __webpack_require__(5);
const { isNumber } = __webpack_require__(0);
const { isReduced, reduced, reduce } = __webpack_require__(3);
const p = protocols;

// Function for defining equality in some of the transducers, like uniq and distinct. This is based on the definition of
// SameValueZero in the JS spec,and this is the comparison used in similar situations by Lodash and other libraries.
// It's the same as === in JavaScript, except that NaN is equal to itself.
function sameValueZero(a, b) {
  return a === b || (isNaN(a) && isNaN(b));
}

function identityTransducer(xform) {
  return {
    [p.init]() {
      return xform[p.init]();
    },

    [p.step](acc, input) {
      return xform[p.step](acc, input);
    },

    [p.result](value) {
      return xform[p.result](value);
    }
  };
}

// Returns the collection as-is, without transforming any of its elements. The collection's iteration and reduction
// protocols are invoked, which means that this function cannot guarantee that the output collection is the same as
// the input collection unless those protocols are well-behaved.
//
// If no collection is provided, a function is returned that can be passed to a transducer function (sequence, etc.).
function identity(collection) {
  return collection ? sequence(collection, identity()) : xform => identityTransducer(xform);
}

function flattenTransducer(xform) {
  return {
    [p.init]() {
      return xform[p.init]();
    },

    [p.step](acc, input) {
      const subXform = {
        [p.init]() {
          return xform[p.init]();
        },

        [p.step](acc, input) {
          const v = xform[p.step](acc, input);
          return isReduced(v) ? reduced(v) : v;
        },

        [p.result](value) {
          return xform[p.result](value);
        }
      };

      return isIterable(input) ? reduce(input, subXform, acc) : subXform[p.step](acc, input);
    },

    [p.result](value) {
      return xform[p.result](value);
    }
  };
}

// Flattens any sub-collections in the input collection, returning a flat collection. Any element in the input
// collection that is iterable will be flattened. This includes strings and objects, types of collections that don't
// make much sense to flatten on their own.
//
// If no collection is provided, a function is returned that can be passed to a transducer function (sequence, etc.).
function flatten(collection) {
  return collection ? sequence(collection, flatten()) : xform => flattenTransducer(xform);
}

function repeatTransducer(n, xform) {
  return {
    [p.init]() {
      return xform[p.init]();
    },

    [p.step](acc, input) {
      let result = acc;
      for (let i = 0; i < n; ++i) {
        result = xform[p.step](result, input);
        if (isReduced(result)) {
          break;
        }
      }
      return result;
    },

    [p.result](value) {
      return xform[p.result](value);
    }
  };
}

// Duplicates the elements of the input collection n times in the output collection.
//
// If no collection is provided, a function is returned that can be passed to a transducer function (sequence, etc.).
function repeat(collection, n) {
  const [col, num] = isNumber(collection) ? [null, collection] : [collection, n];
  return col ? sequence(col, repeat(num)) : xform => repeatTransducer(num, xform);
}

module.exports = {
  sameValueZero,
  identity,
  flatten,
  repeat
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

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

/**
 * Functions that deal with iteration - the first step in transduction, which is taking the input collection and
 * breaking it into its component parts.
 *
 * Iteration is the simplest to deal with because it's already well-supported natively by JavaScript. This file is
 * largely dedicated to implementing consistent iteration in pre-ES2015 environments, as well as adding iteration
 * possibilities for those objects not already supported natively.
 *
 * @module iteration
 * @private
 */

const { bmpCharAt, bmpLength, isArray, isFunction, isObject, isString } = __webpack_require__(0);
const { protocols, isImplemented } = __webpack_require__(1);
const p = protocols;

/**
 * Creates an iterator over strings. ES2015 strings already satisfy the iterator protocol, so this function will not
 * be used for them. This is for ES5 strings where the iterator protocol doesn't exist. As with ES2015 iterators, it
 * takes into account double-width BMP characters and will return the entire character as a two-character string.
 *
 * @private
 *
 * @param {string} str The string to be iterated over.@author [author]
 * @return {module:xduce~iterator} An iterator that returns one character per call to `next`.
 */
function stringIterator(str) {
  let index = 0;
  return {
    next() {
      return index < bmpLength(str)
        ? {
            value: bmpCharAt(str, index++),
            done: false
          }
        : {
            done: true
          };
    }
  };
}

/**
 * Creates an iterator over strings. ES2015 strings already satisfy the iterator protocol, so this function will not
 * be used for them. This is for ES5 strings where the iterator protocol doesn't exist.
 *
 * @private
 *
 * @param {array} array The array to be iterated over.
 * @return {module:xduce~iterator} An iterator that returns one element per call to `next`.
 */
function arrayIterator(array) {
  let index = 0;
  return {
    next() {
      return index < array.length
        ? {
            value: array[index++],
            done: false
          }
        : {
            done: true
          };
    }
  };
}

/**
 * Creates an iterator over objcts.
 *
 * Objects are not generally iterable, as there is no defined order for an object, and each "element" of an object
 * actually has two values, unlike any other collection (a key and a property). However, it's tremendously useful to
 * be able to use at least some transformers with objects as well. This iterator adds support in two different
 * ways to make that possible.
 *
 * The first is that a sort order is defined. Quite simply, it's done alphabetically by key. There is also an option -
 * through the second parameter `sort` - to provide a different sort function. This should be a function in the style
 * of `Array.prototype.sort`, where two parameters are compared and -1 is returned if the first is larger, 1 is returned
 * if the second is larger, and 0 is returned if they're equal. This is applied ONLY TO THE KEYS of the object. If you
 * wish to sort on values, consider iterating into an array and then sorting the elements by value.
 *
 * In the public API, this sort function can only be passed through the `{@link module:xduce.iterator|iterator}`
 * function. If you  wish to use an object sorted in a non-default order, you should create an iterator out of it and
 * transform that iterator. For example:
 *
 * | DEFAULT ORDER                        | CUSTOM ORDER                                         |
 * | ------------------------------------ | ---------------------------------------------------- |
 * | `var result = sequence(obj, xform);` | `var result = asObject(iterator(obj, sort), xform);` |
 *
 * The second support feature is the alternative "kv-form" objects. A reasonable way to iterate over objects would be to
 * produce single-property objects, one per property on the original object (i.e., `{a: 1, b: 2}` would become two
 * elements: `{a: 1}` and `{b: 2}`). This is fine for straight iteration and reduction, but it can present a challenge
 * to use a transformer with. Consider this example code, which uppercases the key and adds one to the value.
 *
 * ```
 * function doObjectSingle(obj) {
 *   var key = Object.keys(obj)[0];
 *   var result = {};
 *   result[key.toUpperCase()] = obj[key] + 1;
 *   return result;
 * }
 * ```
 *
 * This is a little unwieldy, so the iterator provides for another kind of iteration. Setting the third parameter,
 * `kv`, to `true` (which is the default), objects will be iterated into two-property objects with `k` and `v` as the
 * property names. For example, `{a: 1, b: 2}` will become two elements: `{k: 'a', v: 1}` and `{k: 'b', v: 2}`. This
 * turns the mapping function shown above into something simpler.
 *
 * ```
 * function doObjectKv(obj) {
 *   var result = {};
 *   result[obj.k.toUpperCase()]: obj.v + 1;
 *   return result;
 * }
 * ```
 *
 * This is the default iteration form for objects internally. If you want to iterate an object into the `{key: value}`
 * form, for which you would have to use the `doObjectSingle` style transformer, you must call
 * `{@link module:xduce.iterator|iterator}` with the third parameter explicitly set to `false` and then pass that
 * iterator to the transducing function. This is availabe in particular for those writing their own transducers.
 *
 * Still, while this is nice, we can do better. The built-in reducers for arrays, objects, strings, and iterators
 * recognize the kv-form and know how to reduce it back into a regular key-value form for output. So instead of that
 * first `doObjectKv`, we could write it this way.
 *
 * ```
 * function doObjectKvImproved(obj) {
 *   return {k: obj.k.toUpperCase(), v: obj.v + 1};
 * }
 * ```
 *
 * The reducer will recognize the form and reduce it correctly. The upshot is that in this library, `doObjectKv` and
 * `doObjectKvImproved` will produce the SAME RESULT. Which function to use is purely a matter of preference. IMPORTANT
 * NOTE: If you're adding transducer support to non-supported types, remember that you must decide whether to have your
 * `step` function recognize kv-form objects and reduce them into key-value. If you don't, then the style of
 * `doObjectKvImproved` will not be available.
 *
 * ANOTHER IMPORTANT NOTE: The internal reducers recognize kv-form very explicitly. The object must have exactly two
 * enumerable properties, and those properties must be named 'k' and 'v'. This is to reduce the chance as much as
 * possible of having errors because an object that was meant to be two properties was turned into one. (It is possible
 * to have a transformation function return an object of more than one property; if that happens, and if that object is
 * not a kv-form object, then all of the properties will be merged into the final object.)
 *
 * One final consideration: you have your choice of mapping function styles, but the better choice may depend on
 * language. The above examples are in ES5. If you're using ES2015, however, you have access to destructuring and
 * dynamic object keys. That may make `doObjectKv` look better, because with those features it can be written like this:
 *
 * ```
 * doObjectKv = ({k, v}) => {[k.toUpperCase()]: v + 1};
 * ```
 *
 * And that's about as concise as it gets. Note that some languages that compile into JavaScript, like CoffeeScript and
 * LiveScript, also support these features.
 *
 * TL;DR:
 * 1. Iteration order of objects is alphabetical by key, though that can be changed by passing a sort function to
 *    `{@link module:xduce.iterator|iterator}`.
 * 2. Iteration is done internally in kv-form.
 * 3. Transformation functions can output objects in key-value, which is easier in ES2015.
 * 4. Transformation functions can output objects in kv-form, which is easier in ES5.
 * @param {object} obj The object to iterate over.
 * @param {module:xduce~sort} [sort] An optional sort function. This is applied to the keys of the object to
 *     determine the order of iteration.
 * @param {boolean} [kv=false] Whether or not this object should be iterated into kv-form (if false, it remains in the
 *     normal key-value form).
 * @return {module:xduce~iterator} An iterator that returns one key-value pair per call to `next`.
 */
function objectIterator(obj, sort, kv = false) {
  let keys = Object.keys(obj);
  keys = typeof sort === 'function' ? keys.sort(sort) : keys.sort();
  let index = 0;

  return {
    next() {
      if (index < keys.length) {
        const k = keys[index++];
        const value = {};
        if (kv) {
          value.k = k;
          value.v = obj[k];
        } else {
          value[k] = obj[k];
        }
        return {
          value,
          done: false
        };
      }
      return {
        done: true
      };
    }
  };
}

/**
 * Determines whether an object is in kv-form. This used by the reducers that must recognize this form and reduce those
 * elements back into key-value form.
 *
 * This determination is made by simply checking that the object has exactly two properties and that they are named
 * `k` and `v`.
 *
 * @private
 *
 * @param {object} obj The object to be tested.
 * @return {boolean} Either `true` if the object is in kv-form or `false` if it isn't.
 */
function isKvFormObject(obj) {
  const keys = Object.keys(obj);
  if (keys.length !== 2) {
    return false;
  }
  return !!~keys.indexOf('k') && !!~keys.indexOf('v');
}

/**
 * **Creates an iterator over the provided collection.**
 *
 * For collections that are not objects, it's as simple as that. Pass in the collection, get an iterator over that
 * collection.
 *
 * Objects get special support though, as noted in the section above on iterating over objects. Objects are iterated in
 * alphabetical order by key, unless a second parameter is passed to `iterator`. This must be a function that takes two
 * parameters (which will be object keys) and returns `-1` if the first is less than the second, `1` if the second is
 * less than the first, and `0` if they're equal.
 *
 * Also, `iterator` by default iterates objects into kv-form. This is the form used internally by the xduce library. If
 * this is not appropriate for a particular use case, then a third parameter of `false` can be passed, which will result
 * in the iteration being into single-property form instead.
 *
 * The second and third parameters are ignored if the input collection is not an object.
 *
 * Note that if this function is passed an object that looks like an iterator (an object that has a `next` function),
 * the object itself is returned. It is assumed that a function called `next` conforms to the iteration protocol.
 *
 * @memberof module:xduce
 *
 * @param {*} obj The value to be iterated over.
 * @param {module:xduce~sort} [sort] A function used to determine the sorting of keys for an object iterator. It has
 *     no effect when iterating over anything that is not a plain object.
 * @param {boolean} [kv=false] Whether an object should be iterated into kv-form. This is only relevant when iterating
 *     over an object; otherwise its value is ignored.
 * @return {module:xduce~iterator} An iterator over the provided value. If the value is not iterable (it's not an
 *     array, object, or string, and it doesn't have a protocol-defined iterator), `null` is returned.
 */
function iterator(obj, sort, kv) {
  switch (true) {
    case isFunction(obj[p.iterator]):
      return obj[p.iterator]();
    case isFunction(obj.next):
      return obj;
    case isString(obj):
      return stringIterator(obj);
    case isArray(obj):
      return arrayIterator(obj);
    case isObject(obj):
      return objectIterator(obj, sort, kv);
    default:
      return null;
  }
}

/**
 * Determines whether the passed object is iterable, in terms of what 'iterable' means to this library. In other words,
 * objects and ES5 arrays and strings will return `true`, as will objects with a `next` function. For that reason this
 * function is only really useful within the library and therefore isn't exported.
 *
 * @private
 *
 * @param {*} obj The value to test for iterability.
 * @return {boolean} Either `true` if the value is iterable (`{@link module:xduce.iterator}` will return an iterator
 *     for it) or `false` if it is not.
 */
function isIterable(obj) {
  return isImplemented(obj, 'iterator') || isString(obj) || isArray(obj) || isObject(obj);
}

module.exports = {
  isKvFormObject,
  iterator,
  isIterable
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

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

/**
 * The central module that brings all of the separate parts of the library together into a public API. Everything
 * publicly available is available through this module or one of its child modules.
 *
 * All of the functions in this module deal directly with transducers. But first, let's talk about the protocols that
 * are going to be referred to throughout many of the function discussions.
 *
 * ## Protocols
 *
 * One of the key selling points for transducers is that the same transducer can be used on any type of collection.
 * Rather than having to write a new `map` function (for example) for every kind of collection - one for an array, one
 * for a string, one for an iterator, etc. - there is a single `map` transducer that will work with all of them, and
 * potentially with *any* kind of collection. This is possible implementing *protocols* on the collections.
 *
 * A protocol in JavaScript is much like an interface in languages like Java and C#. It is a commitment to providing a
 * certain functionality under a certain name. ES2015 has seen the introduction of an `iterator` protocol, for example,
 * and language support for it (the new `for...of` loop can work with any object that correctly implements the
 * `iterator` protocol).
 *
 * To support transduction, Xduce expects collections to implement four protocols.
 *
 * - `iterator`: a function that returns an iterator (this one is built in to ES6 JavaScript)
 * - `transducer/init`: a function that returns a new, empty instance of the output collection
 * - `transducer/step`: a function that takes an accumulator (the result of the reduction so far) and the next input
 *   value, and then returns the accumulator with the next input value added to it
 * - `transducer/result`: a function that takes the reduced collection and returns the final output collection
 *
 * `iterator` is the built-in JavaScript protocol. When called, it is expected to return an iterator over the
 * implementing collection. This iterator is an object that has a `next` function. Each call to `next` is expected to
 * return an object with `value` and `done` properties, which respectively hold the next value of the iterator and a
 * boolean to indicate whether the iteration has reached its end. (This is a simplified explanation; see
 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators|this MDN page} for more
 * detailed information.)
 *
 * `transducer/init` (referred to from now on as `init`) should be a function that takes no parameters and returns a
 * new, empty instance of the output collection. This is the function that defines how to create a new collection of the
 * correct type.
 *
 * `transducer/step` (referred to from now on as `step`) should be a function that takes two parameters. These
 * parameters are the result of the reduction so far (and so is a collection of the output type) and the next value from
 * the input collection. It must return the new reduction result, with the next value incorporated into it. This is the
 * function that defines how reduce a value onto the collection.
 *
 * `transducer/result` (referred to from now on as `result`) should be a function that takes one parameter, which is the
 * fully reduced collection. It should return the final output collection. This affords a chance to make any last-minute
 * adjustments to the reduced collection before returning it.
 *
 * Arrays, strings, and objects are all given support for all of these protocols. Other collections will have to provide
 * their own (though it should be noted that since `iterator` is built-in, many third-party collections will already
 * implement this protocol). As an example, let's add transducer support to a third-party collection, the
 * `Immutable.List` collection from {@link https://facebook.github.io/immutable-js/|immutable-js}.
 *
 * ```
 * Immutable.List.prototype[protocols.init] = () => Immutable.List().asMutable();
 * Immutable.List.prototype[protocols.step] = (acc, input) => acc.push(input);
 * Immutable.List.prototype[protocols.result] = (value) => value.asImmutable();
 * ```
 *
 * `Immutable.List` already implements `iterator`, so we don't have to do it ourselves.
 *
 * The `init` function returns an empty mutable list. This is important for immutable-js because its default lists are
 * immutable, and immutable lists mean that a new list has to be created with every reduction step. It would work fine,
 * but it's quite inefficient.
 *
 * The `step` function adds the next value to the already-created list. `Immutable.List` provides a `push` function that
 * works like an array's `push`, except that it returns the new list with the value pushed onto it. This is perfect for
 * our `step` function.
 *
 * The `result` function converts the now-finished mutable list into an immutable one, which is what's going to be
 * expected if we're transducing something into an `Immutable.List`. In most cases, `result` doesn't have to do any
 * work, but since we're creating an intermediate representation of our collection type here, this lets us create the
 * collection that we actually want to output. (Without `result`, we would have to use immutable lists all the way
 * through, creating a new one with each `step` function, since we wouldn't be able to make this converstion at the
 * end.)
 *
 * With those protocols implemented on the prototype, `Immutable.List` collections can now support any transduction we
 * can offer.
 *
 * ### Protocols
 *
 * After talking a lot about protocols and showing how they're properties added to an object, it's probably pretty
 * obvious that there's been no mention of what the actual names of those properties are. That's what
 * `{@link module:xduce.protocols|protocols}` is for.
 *
 * `{@link module:xduce.protocols|protocols}` means that the actual names aren't important, which is good because the
 * name might vary depending on whether or not the JavaScript environment has symbols defined. That unknown quantity can
 * be abstracted away by using the properties on the `{@link module:xduce.protocols|protocols}` object as property keys.
 * (Besides, the actual name of the protocol will either be a `Symbol` for the name of the protocol or a string like
 * `'@@transducer/init'`, depending on whether `Symbol`s are available, and those aren't a lot of fun to work with.)
 *
 * The best way to use these keys can be seen in the immutable-js example above. Instead of worrying about the name of
 * the key for the `init` protocol, the value of `protocols.init` is used.
 *
 * `{@link module:xduce.protocols|protocols}` defines these protocol property names.
 *
 * - `iterator`: if this is built in (like in later versions of node.js or in ES2015), this will match the built-in
 *   protocol name.
 * - `init`
 * - `step`
 * - `result`
 * - `reduced`: used internally to mark a collection as already reduced
 * - `value`: used internally to provide the actual value of a reduced collection
 *
 * The final two values don't have a lot of use outside the library unless you're writing your own transducers.
 *
 * ## How Objects Are Treated
 *
 * Before getting onto the core functions, let's talk about objects.
 *
 * Objects bear some thought because regularly, they aren't candidates for iteration. They don't have any inherent
 * order, normally something that's necessary for true iteration, and they have *two* pieces of data (key and value) for
 * every element instead of one. Yet it's undeniable that at least for most transformations, being able to apply them to
 * objects would be quite handy.
 *
 * For that reason, special support is provided end-to-end for objects.
 *
 * ### Object iteration
 *
 * Iterating over an object will produce one object per property of the original object. An order is imposed; by
 * default, this order is "alphabetical by key". The `{@link module:xduce.iterator|iterator}` function can be passed a
 * sorting function that can sort keys in any other way.
 *
 * The result of the iteration, by default, is a set of objects of the form `{k: key, v: value}`, called kv-form. The
 * reason for this form is that it's much easier to write transformation functions when you know the name of the key. In
 * the regular single-property `{key: value}` form (which is still available by passing `false` as the third parameter
 * to `{@link module:xduce.iterator|iterator}`), the name of the key is unknown; in kv-form, the names of the keys are
 * `k` and `v`.
 *
 * ```
 * var obj = {c: 1, a: 2, b: 3};
 * var reverseSort = function (a, b) { return a < b ? 1 : b > a ? -1 : 0; };
 *
 * var result = iterator(obj);
 * // asArray(result) = [{k: 'a', v: 2}, {k: 'b', v: 3}, {k: 'c', v: 1}]
 *
 * result = iterator(obj, reverseSort);
 * // asArray(result) = [{k: 'c', v: 1}, {k: 'b', v: 3}, {k: 'a', v: 2}]
 *
 * result = iterator(obj, null, false);
 * // asArray(result) = [{a: 2}, {b: 3}, {c: 1}]
 *
 * result = iterator(obj, reverseSort, false);
 * // asArray(result) = [{c: 1}, {b: 3}, {a: 2}]
 * ```
 *
 * Internally, every object is iterated into kv-form, so if you wish to have it in single-property, you must use
 * `{@link module:xduce.iterator|iterator}` in this way and pass that iterator into the transduction function.
 *
 * ### Object transformation
 *
 * The kv-form makes writing transformation functions a lot easier. For comparison, here's what a mapping function (for
 * a `{@link module:xduce.map|map}` transformer) would look like if we were using the single-property form.
 *
 * ```javascript
 * function doObjectSingle(obj) {
 *   var key = Object.keys(obj)[0];
 *   var result = {};
 *   result[key.toUpperCase()] = obj[key] + 1;
 *   return result;
 * }
 * ```
 *
 * Here's what the same function looks like using kv-form.
 *
 * ```javascript
 * function doObjectKv(obj) {
 *   var result = {};
 *   result[obj.k.toUpperCase()]: obj.v + 1;
 *   return result;
 * }
 * ```
 *
 * This is easier, but we can do better. The built-in reducers also recognize kv-form, which means that we can have our
 * mapping function produce kv-form objects as well.
 *
 * ```javascript
 * function doObjectKvImproved(obj) {
 *   return {k: obj.k.toUpperCase(), v: obj.v + 1};
 * }
 * ```
 *
 * This is clearly the easiest to read and write - if you're using ES5. If you're using ES2015, destructuring and
 * dynamic object keys allow you to write `doObjectKv` as
 *
 * ```javascript
 * doObjectKv = ({k, v}) => {[k.toUpperCase()]: v + 1};
 * ```
 *
 * ### Reducing objects
 *
 * The built-in reducers (for arrays, objects, strings, and iterators) understand kv-form and will reduce objects
 * properly whether they're in single-property or kv-form. If you're adding transducer support for non-supported types,
 * you will have to decide whether to support kv-form. It takes a little extra coding, while single-property form just
 * works.
 *
 * That's it for object-object reduction. Converting between objects and other types is another matter.
 *
 * Every transducer function except for `{@link module:xduce.sequence|sequence}` is capable of turning an object into a
 * different type of collection, turning a different type of collection into an object, or both. Objects are different
 * because they're the only "collections" that have two different pieces of data per element. Because of this, we have
 * to have a strategy on how to move from one to another.
 *
 * Transducing an object into a different type is generally pretty easy. If an object is converted into an array, for
 * instance, the array elements will each be single-property objects, one per property of the original object.
 *
 * Strings are a different story, since encoding a single-property object to a string isn't possible (because every
 * "element" of a string has to be a single character). Strings that are produced from objects will instead just be the
 * object values, concatenated. Because objects are iterated in a particular order, this conversion will always produce
 * the same string, but except in some very specific cases there really isn't a lot of use for this converstion.
 *
 * ```javascript
 * var obj = {a: 1, b: 2};
 *
 * var result = asArray(obj);
 * // result = [{a: 1}, {b: 2}]
 *
 * result = asIterator(obj);
 * // result is an iterator with two values: {a: 1} and {b: 2}
 *
 * result = into(Immutable.List(), obj)
 * // result is an immutable list with two elements: {a: 1} and {b: 2}
 *
 * result = asString(obj);
 * // result is '12'
 * ```
 *
 * The opposite conversion depends on the values inside the collections. If those values are objects, then the result is
 * an object with all of the objects combined (if more than one has the same key, the last one is the one that's kept).
 * Otherwise, keys are created for each of the elements, starting with `0` and increasing from there.
 *
 * This means that converting an object to any non-string collection and back produces the original object.
 *
 * ```javascript
 * var result = asObject([{a: 1}, {b: 2}]);
 * // result = {a: 1, b: 2}
 *
 * result = asObject([1, 2, 3]);
 * // result = {0: 1, 1: 2, 2: 3}
 *
 * result = asObject('hello');
 * // result = {0: 'h', 1: 'e', 2: 'l', 3: 'l', 4: 'o'}
 * ```
 *
 * @module xduce
 */

/**
 * A generic iterator. This conforms to the `iterator` protocol in that it has a `{@link module:xduce~next|next}`
 * function that produces {@link module:xduce~nextValue|`iterator`-compatible objects}.
 *
 * @typedef {object} iterator
 * @property {module:xduce~next} next A function that, when called, returns the next iterator value.
 */

/**
 * The function that makes an object an iterator. This can be called repeatedly, with each call returning one iterator
 * value, in order. This function must therefore keep state to know *which* of the values is the one to return next,
 * based on the values that have already been returned by prior calls.
 *
 * @callback next
 * @return {module:xduce~nextValue} An object containing the status and value of the next step of the iteration.
 */

/**
 * An object returned by an iterator's `next` function. It has two properties so one can be used as a flag, since
 * values like `false` and `undefined` can be legitimate iterator values.
 *
 * @typedef {object} nextValue
 * @property {boolean} done A flag to indicate whether there are any more values remaining in the iterator. Once this
 *     becomes `true`, there are no more iterator values (and the object may not even have a `value` property).
 * @property {*} [value] The value returned by the iterator on this step. As long as `done` is `false`, this will be a
 *     valid value. Once `done` returns `true`, if there will be no further valid values (the spec allows a "return
 *     value", but this library does not use that).
 */

/**
 * A function used for sorting a collection.
 *
 * @callback sort
 * @param {*} a The first item to compare.
 * @param {*} b The second item to compare.
 * @return {number} Either `1` if `a` is less than `b`, `-1` if `a` is greater than `b`, or `0` if `a` is equal to `b`.
 */

/**
 * The mapping of protocol names to their respective property key names. The values of this map will depend on whether
 * symbols are available.
 *
 * @typedef {object} protocolMap
 * @property {(string|Symbol)} init The `iterator` protocol. This is built-in in ES2015+ environments; in that case the
 *     built-in protocol will be the value of this property.
 * @property {(string|Symbol)} init The `transducer/init` protocol. This is used to mark functions that initialize a
 *     target collection before adding items to it.
 * @property {(string|Symbol)} step The `transducer/step` protocol. This is used to mark functions that are used in the
 *     transducer's step process, where objects are added to the target collection one at a time.
 * @property {(string|Symbol)} result The `transducer/result` protocol. This is used to mark functions that take the
 *     final result of the step process and return the final form to be output. This is optional; if the transducer does
 *     not want to transform the final result, it should just return the result of its chained transducer's `result`
 *     function.
 * @property {(string|Symbol)} reduced The `transducer/reduced` protocol. The presence of this key on an object
 *     indicates that its transformation has been completed. It is used internally to mark collections whose
 *     transformations conclude before every object is iterated over (as in `{@link xduce.take}` transducers.) It is of
 *     little use beyond transducer authoring.
 * @property {(string|Symbol)} value The `transducer/value` protocol. This is used internally to mark properties that
 *     contain the value of a reduced transformation. It is of little use beyond transducer authoring.
 */

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Transduction protocol function definitions

/**
 * Returns a new, blank, empty instance of the target collection.
 *
 * @callback init
 * @return {*} An initial instance of the target collection. This is usually, but is not required to be, an empty
 *     instance of the collection.``
 */

/**
 * Performs a transformation on a single element of a collection, adding it to the target collection at the end. Thus,
 * this function performs both the transformation *and* the reduction steps.
 *
 * @callback step
 * @param {*} acc The target collection into which the transformed value will be reduced.
 * @param {*} value A single element from the original collection, which is to be tranformed and reduced into the target
 *     collection.
 * @return {*} The resulting collection after the provided value is reduced into the target collection.
 */

/**
 * Performs any post-processing on the completely reduced target collection. This lets a transducer make a final,
 * whole-collection transformation, particularly useful when the step function has been used on an intermediate form
 * of the collection which is not meant to be the output.
 *
 * @callback result
 * @param {*} input The final, reduced collection derived from using {@link module:xduce~step} on each of the original
 *     collection's elements.
 * @return {*} The final collection that is the result of the transduction.
 */

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * A function that transforms data and can be chained to other transducers. This is handled by separate libraries; the
 * only involvement of this library is as a consumer of transducers. A transducer is stepped through each time a value
 * is taken from a channel.
 *
 * Transducers work by having step functions that are known via protocol, and it is these step functions that take the
 * data to be transformed as arguments. The arguments to the transducers themselves are other transducers that are then
 * composed into a single transducer, which is then returned. These values should not be a concern of a user of this
 * library; just pass a transducer to {@link module:cispy~chan|chan} and everything else will be handled.
 *
 * @callback transducer
 * @param {module:xduce~transducer} xform A transducer to chain this transducer to.
 * @return {module:xduce~transducer} A new transducer chaining this one to `xform`.
 */

const {
  bmpCharAt,
  bmpLength,
  range,
  complement,
  isArray,
  isFunction,
  isNumber,
  isObject,
  isString
} = __webpack_require__(0);
const { reduced, unreduced, isReduced, ensureReduced, ensureUnreduced } = __webpack_require__(3);

const { protocols } = __webpack_require__(1);
const { iterator } = __webpack_require__(5);
const { toReducer, toFunction, reduce } = __webpack_require__(3);
const {
  transduce,
  into,
  sequence,
  asArray,
  asIterator,
  asObject,
  asString,
  compose
} = __webpack_require__(2);

const { chunk, chunkBy } = __webpack_require__(7);
const { identity, flatten, repeat } = __webpack_require__(4);
const { distinct, distinctBy, distinctWith } = __webpack_require__(8);
const { drop, dropWhile } = __webpack_require__(9);
const { filter, reject, compact } = __webpack_require__(10);
const { map, flatMap } = __webpack_require__(11);
const { take, takeWhile, takeNth } = __webpack_require__(12);
const { uniq, uniqBy, uniqWith } = __webpack_require__(13);

module.exports = {
  /**
   * A series of utility functions that are used internally in Xduce. Most of them don't have a lot to do with
   * transducers themselves, but since they were already available and potentially useful, they're provided here. The
   * reduction-related functions *are* related to transducers, specifically to writing them, so they are also provided.
   *
   * @memberof module:xduce
   * @static
   * @namespace util
   * @type {object}
   */
  util: {
    /**
     * These functions are used by xduce to create iterators for strings in pre-ES2015 environments. String iterators in
     * ES2015+ account for double-width characters in the Basic Multilingual Plane, returning those double-wide
     * characters as one iterator value. Older environments do not do this; double-width characters would in that case
     * be returned as two distinct characters, but for Xduce's use of these functions.
     *
     * Note that the built-in `charAt` and `length` do *not* take double-width characters into account even in ES2015+
     * environments even though iterators do. These functions are still useful as utility functions in any environment.
     *
     * @memberof module:xduce.util
     * @static
     * @namespace bmp
     * @type {object}
     */
    bmp: {
      charAt: bmpCharAt,
      length: bmpLength
    },
    range,
    complement,

    isArray,
    isFunction,
    isNumber,
    isObject,
    isString,

    reduced,
    unreduced,
    isReduced,
    ensureReduced,
    ensureUnreduced
  },
  protocols,
  iterator,
  toReducer,
  toFunction,
  reduce,
  transduce,
  into,
  sequence,
  asArray,
  asIterator,
  asObject,
  asString,
  compose,
  chunk,
  chunkBy,
  identity,
  flatten,
  repeat,
  distinct,
  distinctBy,
  distinctWith,
  drop,
  dropWhile,
  filter,
  reject,
  compact,
  map,
  flatMap,
  take,
  takeWhile,
  takeNth,
  uniq,
  uniqBy,
  uniqWith
};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

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
// chunk.js
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const { protocols } = __webpack_require__(1);
const { sequence } = __webpack_require__(2);
const { ensureUnreduced } = __webpack_require__(3);
const { isFunction, isNumber } = __webpack_require__(0);
const { sameValueZero } = __webpack_require__(4);
const p = protocols;

const NO_VALUE = Symbol('NO_VALUE');

function chunkTransducer(n, xform) {
  let count = 0;
  let part = [];

  return {
    [p.init]() {
      return xform[p.init]();
    },

    [p.step](acc, input) {
      part[count++] = input;
      if (count === n) {
        const out = part.slice(0, n);
        part = [];
        count = 0;
        return xform[p.step](acc, out);
      }
      return acc;
    },

    [p.result](value) {
      if (count > 0) {
        return ensureUnreduced(xform[p.step](value, part.slice(0, count)));
      }
      return xform[p.result](value);
    }
  };
}

// Splits the input collection into chunks of `n` elements each. Each of these chunks is an array, no matter what the
// type of the input collection.
//
// If no collection is provided, a function is returned that can be passed to a transducer function (sequence, etc.).
function chunk(collection, n) {
  const [col, num] = isNumber(collection) ? [null, collection] : [collection, n];
  return col ? sequence(col, chunk(num)) : xform => chunkTransducer(num, xform);
}

function chunkByTransducer(fn, xform) {
  let part = [];
  let last = NO_VALUE;

  return {
    [p.init]() {
      return xform[p.init]();
    },

    [p.step](acc, input) {
      const current = fn(input);
      let result = acc;
      if (last === NO_VALUE || sameValueZero(current, last)) {
        part.push(input);
      } else {
        result = xform[p.step](result, part);
        part = [input];
      }
      last = current;
      return result;
    },

    [p.result](value) {
      const count = part.length;
      if (count > 0) {
        return ensureUnreduced(xform[p.step](value, part.slice(0, count)));
      }
      return xform[p.result](value);
    }
  };
}

// Splits the input collection into chunks whose boundaries are defined by the supplied function. One chunk ends and
// the next begins when the function returns a different value for an input element than it did for the prior element.
//
// By default, the function is run without context. If a context object is provided, it will become `this` within the
// function.
//
// If no collection is provided, a function is returned that can be passed to a transducer function (sequence, etc.).
function chunkBy(collection, fn, ctx) {
  const [col, func] = isFunction(collection) ? [null, collection.bind(fn)] : [collection, fn.bind(ctx)];
  return col ? sequence(col, chunkBy(func)) : xform => chunkByTransducer(func, xform);
}

module.exports = {
  chunk,
  chunkBy
};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

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

const { protocols } = __webpack_require__(1);
const { sequence } = __webpack_require__(2);
const { isFunction } = __webpack_require__(0);
const { sameValueZero } = __webpack_require__(4);
const p = protocols;

const NO_VALUE = Symbol('NO_VALUE');

function distinctTransducer(fn, xform) {
  let last = NO_VALUE;

  return {
    [p.init]() {
      return xform[p.init]();
    },

    [p.step](acc, input) {
      if (last !== NO_VALUE && fn(input, last)) {
        return acc;
      }
      last = input;
      return xform[p.step](acc, input);
    },

    [p.result](value) {
      return xform[p.result](value);
    }
  };
}

// Returns a collection that removes any consecutive equal values from the input collection. Equality is determined by
// the provided function; if two consecutive elements produce the same result from the function, then the second of
// them is suppressed.
//
// By default, the function is run without context. If a context object is provided, it will become `this` within the
// function.
//
// If no collection is provided, a function is returned that can be passed to a transducer function (sequence, etc.).
function distinctWith(collection, fn, ctx) {
  const [col, func] = isFunction(collection) ? [null, collection.bind(fn)] : [collection, fn.bind(ctx)];
  return col ? sequence(col, distinctWith(func)) : xform => distinctTransducer(func, xform);
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
  const [col, func] = isFunction(collection) ? [null, collection.bind(fn)] : [collection, fn.bind(ctx)];
  return distinctWith(col, (a, b) => sameValueZero(func(a), func(b)));
}

// Returns a collection that removes any consecutive equal values from the input collection. Equality is determined by
// comparing consecutive elements using SameValueZero. If two consecutive elements are the same, then the second will
// be suppressed.
//
// If no collection is provided, a function is returned that can be passed to a transducer function (sequence, etc.).
function distinct(collection) {
  return distinctWith(collection, sameValueZero);
}

module.exports = {
  distinct,
  distinctBy,
  distinctWith
};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

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

const { protocols } = __webpack_require__(1);
const { sequence } = __webpack_require__(2);
const { isNumber, isFunction } = __webpack_require__(0);
const p = protocols;

function dropTransducer(n, xform) {
  let i = 0;

  return {
    [p.init]() {
      return xform[p.init]();
    },

    [p.step](acc, input) {
      return i++ < n ? acc : xform[p.step](acc, input);
    },

    [p.result](value) {
      return xform[p.result](value);
    }
  };
}

// Returns a collection containing all of the elements of the input collection except for the first `n` of them.
//
// If no collection is provided, a function is returned that can be passed to a transducer function (sequence, etc.).
function drop(collection, n) {
  const [col, num] = isNumber(collection) ? [null, collection] : [collection, n];
  return col ? sequence(col, drop(num)) : xform => dropTransducer(num, xform);
}

function dropWhileTransducer(fn, xform) {
  let dropping = true;

  return {
    [p.init]() {
      return xform[p.init]();
    },

    [p.step](acc, input) {
      if (dropping) {
        if (fn(input)) {
          return acc;
        }
        dropping = false;
      }
      return xform[p.step](acc, input);
    },

    [p.result](value) {
      return xform[p.result](value);
    }
  };
}

// Returns a collection containing all of the elements of the input collection starting from the first one that returns
// `false` from the supplied predicate function. After the first element that fails this test, no further elements are
// tested.
//
// By default, the function is run without context. If a context object is provided, it will become `this` within the
// function.
//
// If no collection is provided, a function is returned that can be passed to a transducer function (sequence, etc.).
function dropWhile(collection, fn, ctx) {
  const [col, func] = isFunction(collection) ? [null, collection.bind(fn)] : [collection, fn.bind(ctx)];
  return col ? sequence(col, dropWhile(func)) : xform => dropWhileTransducer(func, xform);
}

module.exports = {
  drop,
  dropWhile
};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

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

const { protocols } = __webpack_require__(1);
const { sequence } = __webpack_require__(2);
const { isFunction, complement } = __webpack_require__(0);
const p = protocols;

function filterTransducer(fn, xform) {
  return {
    [p.init]() {
      return xform[p.init]();
    },

    [p.step](acc, input) {
      return fn(input) ? xform[p.step](acc, input) : acc;
    },

    [p.result](value) {
      return xform[p.result](value);
    }
  };
}

// Filters the elements of the input collection by only passing the ones that pass the predicate function on into the
// output collection.
//
// By default, the function is run without context. If a context object is provided, it will become `this` within the
// function.
//
// If no collection is provided, a function is returned that can be passed to a transducer function (sequence, etc.).
function filter(collection, fn, ctx) {
  const [col, func] = isFunction(collection) ? [null, collection.bind(fn)] : [collection, fn.bind(ctx)];
  return col ? sequence(col, filter(func)) : xform => filterTransducer(func, xform);
}

// Filters the elements of the input collection by rejecting the ones that pass the predicate function, preventing them
// from being in the output collection.
//
// By default, the function is run without context. If a context object is provided, it will become `this` within the
// function.
//
// If no collection is provided, a function is returned that can be passed to a transducer function (sequence, etc.).
function reject(collection, fn, ctx) {
  const [col, func] = isFunction(collection) ? [null, collection.bind(fn)] : [collection, fn.bind(ctx)];
  return filter(col, complement(func));
}

// Filters out any falsey (0, false, null, undefined) values in the input collection, letting the rest join the output
// collection.
//
// If no collection is provided, a function is returned that can be passed to a transducer function (sequence, etc.).
function compact(collection) {
  return filter(collection, x => !!x);
}

module.exports = {
  filter,
  reject,
  compact
};


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

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

const { protocols } = __webpack_require__(1);
const { sequence, compose } = __webpack_require__(2);
const { isFunction } = __webpack_require__(0);
const { flatten } = __webpack_require__(4);
const p = protocols;

function mapTransducer(fn, xform) {
  return {
    [p.init]() {
      return xform[p.init]();
    },

    [p.step](acc, input) {
      return xform[p.step](acc, fn(input));
    },

    [p.result](value) {
      return xform[p.result](value);
    }
  };
}

// Maps the elements of a collection over a function. The output collection consists of the return values from that
// function when the elements of the input function are fed into it.
//
// By default, the function is run without context. If a context object is provided, it will become `this` within the
// function.
//
// If no collection is provided, a function is returned that can be passed to a transducer function (sequence, etc.).
function map(collection, fn, ctx) {
  const [col, func] = isFunction(collection) ? [null, collection.bind(fn)] : [collection, fn.bind(ctx)];
  return col ? sequence(col, map(func)) : xform => mapTransducer(func, xform);
}

// Maps the elements of a collection over a function, flattening any collections that are returned from that function.
//
// By default, the function is run without context. If a context object is provided, it will become `this` within the
// function.
//
// If no collection is provided, a function is returned that can be passed to a transducer function (sequence, etc.).
function flatMap(collection, fn, ctx) {
  const [col, func] = isFunction(collection) ? [null, collection.bind(fn)] : [collection, fn.bind(ctx)];
  return col ? sequence(col, compose(map(func), flatten())) : compose(map(func), flatten());
}

module.exports = {
  map,
  flatMap
};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

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

const { protocols } = __webpack_require__(1);
const { ensureReduced } = __webpack_require__(3);
const { sequence } = __webpack_require__(2);
const { isNumber, isFunction } = __webpack_require__(0);
const p = protocols;

function takeTransducer(n, xform) {
  let i = 0;

  return {
    [p.init]() {
      return xform[p.init]();
    },

    [p.step](acc, input) {
      let result = acc;

      if (i < n) {
        result = xform[p.step](acc, input);
        if (i === n - 1) {
          result = ensureReduced(result);
        }
      }
      i++;
      return result;
    },

    [p.result](value) {
      return xform[p.result](value);
    }
  };
}

// Returns a collection that contains only the first `count` elements from the input collection.
//
// If no collection is provided, a function is returned that can be passed to a transducer function (sequence, etc.).
function take(collection, n) {
  const [col, num] = isNumber(collection) ? [null, collection] : [collection, n];
  return col ? sequence(col, take(num)) : xform => takeTransducer(num, xform);
}

function takeWhileTransducer(fn, xform) {
  return {
    [p.init]() {
      return xform[p.init]();
    },

    [p.step](acc, input) {
      return fn(input) ? xform[p.step](acc, input) : ensureReduced(acc);
    },

    [p.result](value) {
      return xform[p.result](value);
    }
  };
}

// Returns a collection that contains all of the elements from the input collection up until the first one that returns
// `false` from the supplied predicate function.
//
// By default, the function is run without context. If a context object is provided, it will become `this` within the
// function.
//
// If no collection is provided, a function is returned that can be passed to a transducer function (sequence, etc.).
function takeWhile(collection, fn, ctx) {
  const [col, func] = isFunction(collection) ? [null, collection.bind(fn)] : [collection, fn.bind(ctx)];
  return col ? sequence(col, takeWhile(func)) : xform => takeWhileTransducer(func, xform);
}

function takeNthTransducer(n, xform) {
  let i = -1;

  return {
    [p.init]() {
      return xform[p.init]();
    },

    [p.step](acc, input) {
      return ++i % n === 0 ? xform[p.step](acc, input) : acc;
    },

    [p.result](value) {
      return xform[p.result](value);
    }
  };
}

// Returns a collection containing the first and then every nth element after that of the input collection.
//
// If no collection is provided, a function is returned that can be passed to a transducer function (sequence, etc.).
function takeNth(collection, n) {
  const [col, num] = isNumber(collection) ? [null, collection] : [collection, n];
  return col ? sequence(col, takeNth(num)) : xform => takeNthTransducer(num, xform);
}

module.exports = {
  take,
  takeWhile,
  takeNth
};


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

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

const { protocols } = __webpack_require__(1);
const { sequence } = __webpack_require__(2);
const { isFunction } = __webpack_require__(0);
const { sameValueZero } = __webpack_require__(4);
const p = protocols;

function uniqTransducer(fn, xform) {
  const uniques = [];

  return {
    [p.init]() {
      return xform[p.init]();
    },

    [p.step](acc, input) {
      if (uniques.some(u => fn(input, u))) {
        return acc;
      }
      uniques.push(input);
      return xform[p.step](acc, input);
    },

    [p.result](value) {
      return xform[p.result](value);
    }
  };
}

// Returns a collection containing only unique elements from the input collection. Uniqueness is determined by passing
// each pair of elements through the provided function; those that return the same value from this function are
// considered equal (and therefore only one of them will make its way to the output collection).
//
// By default, the function is run without context. If a context object is provided, it will become `this` within the
// function.
//
// If no collection is provided, a function is returned that can be passed to a transducer function (sequence, etc.).
function uniqWith(collection, fn, ctx) {
  const [col, func] = isFunction(collection) ? [null, collection.bind(fn)] : [collection, fn.bind(ctx)];
  return col ? sequence(col, uniqWith(func)) : xform => uniqTransducer(func, xform);
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
  const [col, func] = isFunction(collection) ? [null, collection.bind(fn)] : [collection, fn.bind(ctx)];
  return uniqWith(col, (a, b) => sameValueZero(func(a), func(b)));
}

// Returns a collection containing only unique elements from the input collection. Unique elements are those that are
// not equal (using SameValueZero) to any other element in the collection.
//
// If no collection is provided, a function is returned that can be passed to a transducer function (sequence, etc.).
function uniq(collection) {
  return uniqWith(collection, sameValueZero);
}

module.exports = {
  uniq,
  uniqBy,
  uniqWith
};


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(6);


/***/ })
/******/ ]);
});