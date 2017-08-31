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
