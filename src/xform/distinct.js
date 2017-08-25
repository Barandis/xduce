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

const { protocols } = require('../modules/protocol');
const { sequence } = require('../modules/transformation');
const { isFunction } = require('../modules/util');
const { sameValueZero } = require('./core');

const p = protocols;
const NO_VALUE = Symbol('NO_VALUE');

const distinctTransformer = (fn, xform) => ({
  fn,
  xform,
  last: NO_VALUE,

  [p.init]() {
    return this.xform[p.init]();
  },

  [p.step](acc, input) {
    if (this.last !== NO_VALUE && this.fn(input, this.last)) {
      return acc;
    }
    this.last = input;
    return this.xform[p.step](acc, input);
  },

  [p.result](value) {
    return this.xform[p.result](value);
  }
});

// Returns a collection that removes any consecutive equal values from the input collection. Equality is determined by
// the provided function; if two consecutive elements produce the same result from the function, then the second of
// them is suppressed.
//
// By default, the function is run without context. If a context object is provided, it will become `this` within the
// function.
//
// If no collection is provided, a function is returned that can be passed to a transducer function (sequence, etc.).
function distinctWith(collection, fn, ctx) {
  const [col, func] = isFunction(collection) ? [null, fn::collection] : [collection, ctx::fn];
  return col ? sequence(col, distinctWith(func)) : (xform) => distinctTransformer(func, xform);
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
  const [col, func] = isFunction(collection) ? [null, fn::collection] : [collection, ctx::fn];
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
