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
 * Basic functions necessary across transducers, along with a number of transducers that don't belong in other
 * categories.
 *
 * @module core
 * @private
 */

const { protocols } = require('../modules/protocol');
const { sequence } = require('../modules/transformation');
const { isIterable } = require('../modules/iteration');
const { isNumber } = require('../modules/util');
const { isCompleted, complete, reduce } = require('../modules/reduction');
const p = protocols;

/**
 * Defines equality per the definition of SameValueZero in the JS spec, This is the comparison used in similar
 * situations by Lodash and other libraries. It's the same as `===` in JavaScript, except that `NaN` is equal to itself.
 *
 * @private
 *
 * @param {number} a The first number.
 * @param {number} b The second number.
 * @return {boolean} Either `true` if the numbers are equal per `===` or if both numbers are `NaN`, or `false`
 *     otherwise.
 */
function sameValueZero(a, b) {
  return a === b || (isNaN(a) && isNaN(b));
}

/**
 * A transducer function that is returned by the `{@link module:xduce.transducers.identity|identity}` transducer.
 *
 * @private
 *
 * @param {module:xduce~transducerObject} xform The transducer object that the new one should be chained to.
 * @return {module:xduce~transducerObject} A new transducer object, performing no transformation and chaining to the
 *     provided transducer object.
 */
function identityTransducer(xform) {
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

/**
 * **Returns exactly the same collection sent to it.**
 *
 * This is generally a function used when a transducer function is required but there is no desire to do an actual
 * transformation. The "transformation" implemented here is to pass each element through exactly as it is.
 *
 * If no collection is provided, a function is returned that can be passed to `{@link module:xduce.sequence|sequence}`,
 * et al.
 *
 * ```
 * const result = identity([1, 2, 3, 4, 5]);
 * // result = [1, 2, 3, 4, 5]
 * ```
 *
 * @memberof module:xduce.transducers
 *
 * @param {*} [collection] An optional input collection that is to be transduced.
 * @return {(*|module:xduce~transducerFunction)} If a collection is supplied, then the function returns a new
 *     collection of the same type with all of the elements of the input collection untouched. If no collection is
 *     supplied, a transducer function, suitable for passing to `{@link module:xduce.sequence|sequence}`,
 *     `{@link module:xduce.into|into}`, etc. is returned.
 */
function identity(collection) {
  return collection ? sequence(collection, identity()) : xform => identityTransducer(xform);
}

/**
 * A transducer function that is returned by the `{@link module:xduce.transducers.flatten|flatten}` transducer.
 *
 * @private
 *
 * @param {module:xduce~transducerObject} xform The transducer object that the new one should be chained to.
 * @return {module:xduce~transducerObject} A new transducer object chained to the provided transducer object.
 */
function flattenTransducer(xform) {
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
          return isCompleted(v) ? complete(v) : v;
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

/**
 * **Flattens a collection by merging elements in any sub-collection into the main collection.**
 *
 * Elements of the main collection that are not collections themselves are not changed. It's fine to have a combination
 * of the two, some elements that are collections and some that are not.
 *
 * Since there aren't sub-collections in objects, strings, or iterators, `flatten` doesn't make sense with those types
 * of collections.
 *
 * If no collection is provided, a function is returned that can be passed to `{@link module:xduce.sequence|sequence}`,
 * et al.
 *
 * ```
 * const result = flatten([[1, 2], [3, 4, 5], 6, [7]]);
 * // result = [1, 2, 3, 4, 5, 6, 7]
 * ```
 *
 * @memberof module:xduce.transducers
 *
 * @param {*} [collection] An optional input collection that is to be transduced.
 * @return {(*|module:xduce~transducerFunction)} If a collection is supplied, then the function returns a new
 *     collection of the same type with all of the elements of the input collection flattened. If no collection is
 *     supplied, a transducer function, suitable for passing to `{@link module:xduce.sequence|sequence}`,
 *     `{@link module:xduce.into|into}`, etc. is returned.
 */
function flatten(collection) {
  return collection ? sequence(collection, flatten()) : xform => flattenTransducer(xform);
}

/**
 * A transducer function that is returned by the `{@link module:xduce.transducers.flatten|flatten}` transducer.
 *
 * @private
 *
 * @param {number} n The number of times that each element should be repeated in the output collection.
 * @param {module:xduce~transducerObject} xform The transducer object that the new one should be chained to.
 * @return {module:xduce~transducerObject} A new transducer object chained to the provided transducer object.
 */
function repeatTransducer(n, xform) {
  return {
    [p.init]() {
      return xform[p.init]();
    },

    [p.step](acc, input) {
      let result = acc;
      for (let i = 0; i < n; ++i) {
        result = xform[p.step](result, input);
        if (isCompleted(result)) {
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

/**
 * **Repeats each element from the input collection `n` times in the output collection.**
 *
 * These elements are put into the main output collection, not into subcollections. In other words, each input element
 * creates `n` output elements.
 *
 * If no collection is provided, a function is returned that can be passed to `{@link module:xduce.sequence|sequence}`,
 * et al.
 *
 * ```
 * const result = repeat([1, 2, 3, 4, 5], 3);
 * // result = [1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5]
 * ```
 *
 * @memberof module:xduce.transducers
 *
 * @param {*} [collection] An optional input collection that is to be transduced.
 * @param {number} n The number of times that each element from the input collection should be repeated in the output
 *     collection.
 * @return {(*|module:xduce~transducerFunction)} If a collection is supplied, then the function returns a new
 *     collection of the same type with all of the elements of the input collection repeated. If no collection is
 *     supplied, a transducer function, suitable for passing to `{@link module:xduce.sequence|sequence}`,
 *     `{@link module:xduce.into|into}`, etc. is returned.
 */
function repeat(collection, n) {
  const [col, num] = isNumber(collection) ? [null, collection] : [collection, n];
  return col ? sequence(col, repeat(num)) : xform => repeatTransducer(num, xform);
}

module.exports = {
  sameValueZero,
  identity,
  flatten,
  repeat
};
