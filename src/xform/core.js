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

const { protocols } = require('../modules/protocol');
const { sequence } = require('../modules/transformation');
const { isIterable } = require('../modules/iteration');
const { isNumber } = require('../modules/util');
const { isReduced, reduced, reduce } = require('../modules/reduction');
const p = protocols;

// Function for defining equality in some of the transducers, like uniq and distinct. This is based on the definition of
// SameValueZero in the JS spec,and this is the comparison used in similar situations by Lodash and other libraries.
// It's the same as === in JavaScript, except that NaN is equal to itself.
function sameValueZero(a, b) {
  return a === b || (isNaN(a) && isNaN(b));
}

function identityTransformer(xform) {
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
  return collection ? sequence(collection, identity()) : xform => identityTransformer(xform);
}

function flattenTransformer(xform) {
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
  return collection ? sequence(collection, flatten()) : xform => flattenTransformer(xform);
}

function repeatTransformer(n, xform) {
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
  return col ? sequence(col, repeat(num)) : xform => repeatTransformer(num, xform);
}

module.exports = {
  sameValueZero,
  identity,
  flatten,
  repeat
};
