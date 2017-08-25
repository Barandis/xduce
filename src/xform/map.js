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

const { protocols } = require('../modules/protocol');
const { sequence, compose } = require('../modules/transformation');
const { isFunction } = require('../modules/util');
const { flatten } = require('./core');

const p = protocols;

const mapTransformer = (fn, xform) => ({
  fn,
  xform,

  [p.init]() {
    return this.xform[p.init]();
  },

  [p.step](acc, input) {
    return this.xform[p.step](acc, this.fn(input));
  },

  [p.result](value) {
    return this.xform[p.result](value);
  }
});

// Maps the elements of a collection over a function. The output collection consists of the return values from that
// function when the elements of the input function are fed into it.
//
// By default, the function is run without context. If a context object is provided, it will become `this` within the
// function.
//
// If no collection is provided, a function is returned that can be passed to a transducer function (sequence, etc.).
function map(collection, fn, ctx) {
  const [col, func] = isFunction(collection) ? [null, fn::collection] : [collection, ctx::fn];
  return col ? sequence(col, map(func)) : (xform) => mapTransformer(func, xform);
}

// Maps the elements of a collection over a function, flattening any collections that are returned from that function.
//
// By default, the function is run without context. If a context object is provided, it will become `this` within the
// function.
//
// If no collection is provided, a function is returned that can be passed to a transducer function (sequence, etc.).
function flatMap(collection, fn, ctx) {
  const [col, func] = isFunction(collection) ? [null, fn::collection] : [collection, ctx::fn];
  return col ? sequence(col, compose(map(func), flatten())) : compose(map(func), flatten());
}

module.exports = {
  map,
  flatMap
};
