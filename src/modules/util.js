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
const {toString} = Object.prototype;

// Determines whether an object is an array. This is a completely unnecessary function that is here only for
// consistency with the other type-checking functions below.
const {isArray} = Array;

// Determines whether an object is a function.
function isFunction(x) {
  return x::toString() === '[object Function]';
}

// Determines whether an object is a plain object. This returns `true` only for object literals and those created with
// the Object constructor; objects of other types will return `false`.
function isObject(x) {
  // This check is true on all objects, but also on all objects created by custom constructors (which we don't want)
  if (x::toString() !== '[object Object]') {
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
  return typeof ctor === 'function' &&
         ctor instanceof ctor &&
         functionToString.call(ctor) === functionToString.call(Object);
}

// Determines whether an object is a number. It must be either an actual number or a Number object to return `true`;
// strings that happen to be numbers still return `false`. Also, `NaN` and `Infinity` return `false`.
function isNumber(x) {
  return x::toString() === '[object Number]' && isFinite(x);
}

// Determines whether an object is a string.
function isString(x) {
  return x::toString() === '[object String]';
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

  if (/[\uD800-\uDBFF]/.test(result) &&
      /[\uDC00-\uDFFF]/.test(s.charAt(i + 1))) {
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
