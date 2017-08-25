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

const { protocols } = require('../modules/protocol');
const { sequence } = require('../modules/transformation');
const { isFunction, complement } = require('../modules/util');
const p = protocols;

const filterTransformer = (fn, xform) => ({
  fn,
  xform,

  [p.init]() {
    return this.xform[p.init]();
  },

  [p.step](acc, input) {
    return this.fn(input) ? this.xform[p.step](acc, input) : acc;
  },

  [p.result](value) {
    return this.xform[p.result](value);
  }
});

// Filters the elements of the input collection by only passing the ones that pass the predicate function on into the
// output collection.
//
// By default, the function is run without context. If a context object is provided, it will become `this` within the
// function.
//
// If no collection is provided, a function is returned that can be passed to a transducer function (sequence, etc.).
function filter(collection, fn, ctx) {
  const [col, func] = isFunction(collection) ? [null, collection.bind(fn)] : [collection, fn.bind(ctx)];
  return col ? sequence(col, filter(func)) : xform => filterTransformer(func, xform);
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
