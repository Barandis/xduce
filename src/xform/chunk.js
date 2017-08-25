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

const { protocols } = require('../modules/protocol');
const { sequence } = require('../modules/transformation');
const { ensureUnreduced } = require('../modules/reduction');
const { isFunction, isNumber } = require('../modules/util');

const { sameValueZero } = require('./core');

const p = protocols;

const NO_VALUE = Symbol('NO_VALUE');

const chunkTransformer = (n, xform) => ({
  n,
  xform,
  count: 0,
  part: [],

  [p.init]() {
    return this.xform[p.init]();
  },

  [p.step](acc, input) {
    this.part[this.count++] = input;
    if (this.count === this.n) {
      const out = this.part.slice(0, this.n);
      this.part = [];
      this.count = 0;
      return this.xform[p.step](acc, out);
    }
    return acc;
  },

  [p.result](value) {
    if (this.count > 0) {
      return ensureUnreduced(this.xform[p.step](value, this.part.slice(0, this.count)));
    }
    return this.xform[p.result](value);
  }
});

// Splits the input collection into chunks of `n` elements each. Each of these chunks is an array, no matter what the
// type of the input collection.
//
// If no collection is provided, a function is returned that can be passed to a transducer function (sequence, etc.).
function chunk(collection, n) {
  const [col, num] = isNumber(collection) ? [null, collection] : [collection, n];
  return col ? sequence(col, chunk(num)) : (xform) => chunkTransformer(num, xform);
}

const chunkByTransformer = (fn, xform) => ({
  fn,
  xform,
  part: [],
  last: NO_VALUE,

  [p.init]() {
    return this.xform[p.init]();
  },

  [p.step](acc, input) {
    const current = this.fn(input);
    let result = acc;
    if (this.last === NO_VALUE || sameValueZero(current, this.last)) {
      this.part.push(input);
    } else {
      result = this.xform[p.step](result, this.part);
      this.part = [input];
    }
    this.last = current;
    return result;
  },

  [p.result](value) {
    const count = this.part.length;
    if (count > 0) {
      return ensureUnreduced(this.xform[p.step](value, this.part.slice(0, count)));
    }
    return this.xform[p.result](value);
  }
});

// Splits the input collection into chunks whose boundaries are defined by the supplied function. One chunk ends and
// the next begins when the function returns a different value for an input element than it did for the prior element.
//
// By default, the function is run without context. If a context object is provided, it will become `this` within the
// function.
//
// If no collection is provided, a function is returned that can be passed to a transducer function (sequence, etc.).
function chunkBy(collection, fn, ctx) {
  const [col, func] = isFunction(collection) ? [null, fn::collection] : [collection, ctx::fn];
  return col ? sequence(col, chunkBy(func)) : (xform) => chunkByTransformer(func, xform);
}

module.exports = {
  chunk,
  chunkBy
};
