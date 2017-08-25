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

const { protocols } = require('../modules/protocol');
const { ensureReduced } = require('../modules/reduction');
const { sequence } = require('../modules/transformation');
const { isNumber, isFunction } = require('../modules/util');
const p = protocols;

function takeTransformer(n, xform) {
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
  return col ? sequence(col, take(num)) : xform => takeTransformer(num, xform);
}

function takeWhileTransformer(fn, xform) {
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
  return col ? sequence(col, takeWhile(func)) : xform => takeWhileTransformer(func, xform);
}

function takeNthTransformer(n, xform) {
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
  return col ? sequence(col, takeNth(num)) : xform => takeNthTransformer(num, xform);
}

module.exports = {
  take,
  takeWhile,
  takeNth
};
