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

// Object's toString is explicitly used throughout because it could be redefined in any subclass of Object
const { toString } = Object.prototype;

// Determines whether an object is an array. This is a completely unnecessary function that is here only for
// consistency with the other type-checking functions below.
const { isArray } = Array;

// Determines whether an object is a function.
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
  const proto = Object.getPrototypeOf(x);
  if (proto === null) {
    return true;
  }

  // Check to see whether the constructor of the tested object is the Object constructor, using the Function toString to
  // compare the constuctors' source code
  const functionToString = Function.prototype.toString;
  const ctor = Object.prototype.hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return (
    typeof ctor === 'function' && ctor instanceof ctor && functionToString.call(ctor) === functionToString.call(Object)
  );
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

// Returns the length of a string, taking into account any double-wide BMP characters that may be in the string. For
// example, if the string has one double-wide character, this function will return a number that is one less than the
// regular string `.length` property would.
function bmpLength(str) {
  const s = str + '';

  const matches = s.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g);
  const count = matches ? matches.length : 0;
  return s.length - count;
}

// Creates an array of integers from start to end - 1, where `start` is the first parameter and `end` is the second. If
// only one parameter is given, it's the end, and the start becomes 0. If a third parameter is supplied, it's the step
// between successive elements of the array. If the step is negative, or if the start is greater than the end, the array
// elements descend.
function range(start, end, step) {
  const [s, e] = end == null ? [0, start] : [start, end];
  const t = step || (s > e ? -1 : 1);

  const result = [];
  for (let i = s; t < 0 ? i > e : i < e; i += t) {
    result.push(i);
  }
  return result;
}

// Takes a predicate function and returns a function that takes the same arguments and returns the opposite result.
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

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// protocol.js
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Protocols for iteration and reduction. The source for these protocols depends on which protocol it is.
//
// Iteration: a part of the ES6 standard.
// Transduction: agreed to by several parties who maintain transducer libraries in the comment thread for an issue on
//     one of them (https://github.com/cognitect-labs/transducers-js/issues/20).

const { isFunction } = __webpack_require__(0);

const USE_SYMBOLS = true;
const symbol = typeof Symbol !== 'undefined';

// Generation of the key used on an object to store a protocol function. This is a symbol if symbols are available and
// USE_SYMBOLS (above) is set to true; if not, it's a regular string. If a symbol of the supplied name already exists,
// it'll be used instead of having a new one generated.
function generateKey(name) {
  return USE_SYMBOLS && symbol ? Symbol.for(name) : `@@${name}`;
}

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

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// transformation.js
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
function transducingIterator(collection, xform) {
  const stepReducer = {
    [p.step]: (xiter, input) => {
      const value = isKvFormObject(input) ? { [input.k]: input.v } : input;
      xiter.items.unshift(value);
      return xiter;
    },
    [p.result]: value => value
  };

  const iter = iterator(collection);
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

// While `reduce` is the core function, this is the one that will be called the most often. This one takes a transformer
// function and a reducer object and combines them into a transformer object suitable for `reduce`. It also ensures that
// there is a legitimate init object to reduce into.
//
// If the transformer function is null, the reducer will be used as the transformer. If no initial collection is
// supplied, it'll be taken from the reducers `init` protocol function.
//
// Without the transformer, this function basically becomes `reduce` with the ability to determine an initial collection
// from its reducer.
function transduce(collection, xform, reducer, init = reducer[p.init]()) {
  const xf = xform ? xform(reducer) : reducer;
  return reduce(collection, xf, init);
}

// Runs a collection through the supplied transformer, reducing the results into an array. If no transformer is
// supplied, the collection is simply reduced into an array as-is.
function asArray(collection, xform) {
  return transduce(collection, xform, arrayReducer);
}

// Runs a collection through the supplied transformer, reducing the results into an object. In order for this to work,
// the object reducer assumes that it will be receiving elements that are objects in one of two forms: {key: value} or
// {k: key, v:value} (kv-form). Either will be reduced into {key: value}.
//
// If no transformer is supplied, the collection is simply reduced into an object, though there aren't many instances
// where this would make a lot of sense because no other collections can be converted into the format required here.
function asObject(collection, xform) {
  return transduce(collection, xform, objectReducer);
}

// Runs a collection through the supplied transformer, reducing the results into a string. If no transformer is
// supplied, the collection is simply reduced into a string as-is.
function asString(collection, xform) {
  return transduce(collection, xform, stringReducer);
}

// Runs a collection through the supplied transformer, reducing the results into an iterator. If no transformer is
// supplied, the collection is simply turned into an iterator as-is.
function asIterator(collection, xform) {
  return xform ? transducingIterator(collection, xform) : iterator(collection, null, false);
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
    case isArray(collection):
      return asArray(collection, xform);
    case isObject(collection):
      return asObject(collection, xform);
    case isString(collection):
      return asString(collection, xform);
    case isImplemented(collection, 'step'):
      return asReducible(collection, xform);
    case isImplemented(collection, 'iterator'):
      return asIterator(collection, xform);
    default:
      throw Error(`Cannot sequence collection: ${collection}`);
  }
}

// Takes a collection and a transformer and performs a transduction, returning the result by appending it to the
// supplied target collection. In most cases, this will be an empty collection, but if a non-empty target is passed, its
// elements will remain in place and the value of the transduction appended.
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
  asReducible,
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

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// reduction.js
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const { isArray, isFunction, isObject, isString } = __webpack_require__(0);
const { isKvFormObject, iterator } = __webpack_require__(5);
const { protocols, isImplemented } = __webpack_require__(1);
const p = protocols;

// Returns an init function for a collection. This is a function that returns a new, empty instance of the collection in
// question. If the collection doesn't support reduction, `null` is returned. This makes conditionals a bit easier to
// work with.
//
// In order to support the conversion of functions into reducers, function support is also provided.
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

// Returns a step function for a collection. This is a function that takes an accumulator and a value and returns the
// result of reducing the value into the accumulator. If the collection doesn't support reduction, `null` is returned.
//
// In order to support the conversion of functions into reducers, function support is also provided.
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

// Returns a result function for a collection. This is a function that performs any final processing that should be done
// on the result of a reduction. If the collection doesn't support reduction, `null` is returned.
//
// In order to support the conversion of functions into reducers, function support is also provided.
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

// Creates a reducer object for a collection. This object is suitable for being passed to a transduce or reduce call. If
// a function is passed, a reducer version of that function is returned.
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

// Turns a transformer along with a specific reducer into a function that can be used with other reduce implementations
// like the native Array.prototype.reduce function or the reduce functions in Underscore or Lodash. Since our
// transformers rely on the object being reduced to supply information on how to reduce, and since these other
// implementations are not coded to read that information, we must explicitly supply the reducer.
function toFunction(xform, reducer) {
  const r = typeof reducer === 'function' ? toReducer(reducer) : reducer;
  const result = xform(r);
  return result[p.step].bind(result);
}

// Returns a reduced version of a value, regardless of whether the value is already reduced.
function reduced(value) {
  return {
    [p.reduced]: true,
    [p.value]: value
  };
}

// Returns the unreduced value of a reduced value.
function unreduced(value) {
  if (value == null) {
    return;
  }
  return value[p.value];
}

// Determines whether a value is reduced.
function isReduced(value) {
  if (value == null) {
    return false;
  }
  return !!value[p.reduced];
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

  const iter = iterator(collection);
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

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// iteration.js
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const { bmpCharAt, bmpLength, isArray, isFunction, isObject, isString } = __webpack_require__(0);
const { protocols, isImplemented } = __webpack_require__(1);
const p = protocols;

// An iterator over strings. As of ES6 strings already satisfy the iterator protocol, so this is for pre-ES6
// environments where the iterator protocol doesn't exist. Like ES6 iterators, it takes into account double-wide Basic
// Multilingual Plane characters and will return the entire character as a two-character string.
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

// An iterator over arrays. ES6 arrays already satisfy the iterator protocol, so this is intended to make pre-ES6
// arrays iterable.
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
function objectIterator(obj, sort, kv = true) {
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

// Determines whether an object is in kv-form. This used by the reducers that must recognize this form and reduce those
// elements back into key-value form.
function isKvFormObject(obj) {
  const keys = Object.keys(obj);
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

// Determines whether the passed object is iterable, in terms of what 'iterable' means to this library. In other words,
// objects and ES5 arrays and strings will return `true`, as will objects with a `next` function. For that reason this
// function is only really useful within the library and therefore isn't exported.
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
  util: {
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