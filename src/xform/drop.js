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

import { protocols as p } from '../modules/protocol';
import { sequence } from '../modules/transformation';
import { isNumber, isFunction } from '../modules/util';

const dropTransformer = (n, xform) => ({
  n,
  xform,
  i: 0,

  [p.init]() {
    return this.xform[p.init]();
  },

  [p.step](acc, input) {
    return this.i++ < this.n ? acc : this.xform[p.step](acc, input);
  },

  [p.result](value) {
    return this.xform[p.result](value);
  }
});

// Returns a collection containing all of the elements of the input collection except for the first `n` of them.
//
// If no collection is provided, a function is returned that can be passed to a transducer function (sequence, etc.).
export function drop(collection, n) {
  const [col, num] = isNumber(collection) ? [null, collection] : [collection, n];
  return col ? sequence(col, drop(num)) : (xform) => dropTransformer(num, xform);
}

const dropWhileTransformer = (fn, xform) => ({
  fn,
  xform,
  dropping: true,

  [p.init]() {
    return this.xform[p.init]();
  },

  [p.step](acc, input) {
    if (this.dropping) {
      if (this.fn(input)) {
        return acc;
      }
      this.dropping = false;
    }
    return this.xform[p.step](acc, input);
  },

  [p.result](value) {
    return this.xform[p.result](value);
  }
});

// Returns a collection containing all of the elements of the input collection starting from the first one that returns
// `false` from the supplied predicate function. After the first element that fails this test, no further elements are
// tested.
//
// By default, the function is run without context. If a context object is provided, it will become `this` within the
// function.
//
// If no collection is provided, a function is returned that can be passed to a transducer function (sequence, etc.).
export function dropWhile(collection, fn, ctx) {
  const [col, func] = isFunction(collection) ? [null, fn::collection] : [collection, ctx::fn];
  return col ? sequence(col, dropWhile(func)) : (xform) => dropWhileTransformer(func, xform);
}
