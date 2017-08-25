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

const { protocols } = require('../modules/protocol');
const { sequence } = require('../modules/transformation');
const { isFunction } = require('../modules/util');
const { sameValueZero } = require('./core');

const p = protocols;

const uniqTransformer = (fn, xform) => ({
  fn,
  xform,
  uniques: [],

  [p.init]() {
    return this.xform[p.init]();
  },

  [p.step](acc, input) {
    if (this.uniques.some((u) => this.fn(input, u))) {
      return acc;
    }
    this.uniques.push(input);
    return this.xform[p.step](acc, input);
  },

  [p.result](value) {
    return this.xform[p.result](value);
  }
});

// Returns a collection containing only unique elements from the input collection. Uniqueness is determined by passing
// each pair of elements through the provided function; those that return the same value from this function are
// considered equal (and therefore only one of them will make its way to the output collection).
//
// By default, the function is run without context. If a context object is provided, it will become `this` within the
// function.
//
// If no collection is provided, a function is returned that can be passed to a transducer function (sequence, etc.).
function uniqWith(collection, fn, ctx) {
  const [col, func] = isFunction(collection) ? [null, fn::collection] : [collection, ctx::fn];
  return col ? sequence(col, uniqWith(func)) : (xform) => uniqTransformer(func, xform);
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
  const [col, func] = isFunction(collection) ? [null, fn::collection] : [collection, ctx::fn];
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
