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
 * Transducers for dropping some number of elements at the beginning of a collection.
 *
 * @module drop
 * @private
 */

const { protocols } = require('../modules/protocol');
const { sequence } = require('../modules/transformation');
const { isNumber, isFunction } = require('../modules/util');
const p = protocols;

/**
 * A transducer function that is returned by the `{@link module:xduce.transducers.drop|drop}` transducer.
 *
 * @private
 *
 * @param {module:xduce~transducerObject} xform The transducer object that the new one should be chained to.
 * @return {module:xduce~transducerObject} A new transducer object, performing no transformation and chaining to the
 *     provided transducer object.
 */
function dropTransducer(n, xform) {
  let i = 0;

  return {
    [p.init]() {
      return xform[p.init]();
    },

    [p.step](acc, input) {
      return i++ < n ? acc : xform[p.step](acc, input);
    },

    [p.result](value) {
      return xform[p.result](value);
    }
  };
}

/**
 * **Creates a new collection consisting of all of the elements of the input collection *except* for the first `n`
 * elements.**
 *
 * While this could be considered an opposite of `{@link module:xduce.transducers.take|take}`, there is one difference:
 * `drop` cannot return a finite collection when provided an infinite one.
 *
 * If no collection is provided, a function is returned that can be passed to `{@link module:xduce.sequence|sequence}`,
 * et al.
 *
 * ```
 * const result = drop([1, 2, 3, 4, 5], 3);
 * // result = [4, 5]
 * ```
 *
 * @memberof module:xduce.transducers
 *
 * @param {*} [collection] An optional input collection that is to be transduced.
 * @param {number} n The number of elements at the beginning of the input collection that should be discarded in the
 *     output collection.
 * @return {(*|module:xduce~transducerFunction)} If a collection is supplied, then the function returns a new
 *     collection of the same type without its first `n` elements. If no collection is supplied, a transducer function,
 *     suitable for passing to `{@link module:xduce.sequence|sequence}`, `{@link module:xduce.into|into}`, etc. is
 *     returned.
 */
function drop(collection, n) {
  const [col, num] = isNumber(collection) ? [null, collection] : [collection, n];
  return col ? sequence(col, drop(num)) : xform => dropTransducer(num, xform);
}

/**
 * A transducer function that is returned by the `{@link module:xduce.transducers.dropWhile|dropWhile}` transducer.
 *
 * @private
 *
 * @param {function} fn A single-parameter predicate function that determines which is the first element to be included
 *     in the output collection.
 * @param {module:xduce~transducerObject} xform The transducer object that the new one should be chained to.
 * @return {module:xduce~transducerObject} A new transducer object, performing no transformation and chaining to the
 *     provided transducer object.
 */
function dropWhileTransducer(fn, xform) {
  let dropping = true;

  return {
    [p.init]() {
      return xform[p.init]();
    },

    [p.step](acc, input) {
      if (dropping) {
        if (fn(input)) {
          return acc;
        }
        dropping = false;
      }
      return xform[p.step](acc, input);
    },

    [p.result](value) {
      return xform[p.result](value);
    }
  };
}

/**
 * **Creates a new collection containing the elements of the input collection including the first one that causes a
 * predicate function to return `false` and all elements thereafter.**
 *
 * This is rather the opposite of `{@link module:xduce.transducers.takeWhile|takeWhile}`, though unlike that function,
 * this one cannot return a finite collection when given an infinite one. It's also related to
 * `{@link module:xduce.transducers.reject|reject}`, except that once the first element is not rejected, every element
 * after that is also not rejected (even if they would make the predicate return `true`).
 *
 * If no collection is provided, a function is returned that can be passed to `{@link module:xduce.sequence|sequence}`,
 * et al.
 *
 * ```
 * const array = [2, 4, 6, 8, 1, 3, 5, 7, 9, 10];
 * const even = x => x % 2 === 0;
 *
 * let result = dropWhile(array, even);
 * // result = [1, 3, 5, 7, 9, 10];
 *
 * // This shows the difference between `dropWhile` and `reject` with the same parameters
 * result = reject(array, even);
 * // result = [1, 3, 5, 7, 9];
 * ```
 *
 * @memberof module:xduce.transducers
 *
 * @param {*} [collection] An optional input collection that is to be transduced.
 * @param {function} fn A predicate function. This takes each element of the input collection and returns `true` or
 *     `false` based on that element. The first one to return `false` is the first element of the output collection.
 * @param {object} [ctx] An optional context object which is set to `this` for the function `fn`. This does not work if
 *     `fn` is an arrow function, as they cannot be bound to contexts.
 * @return {(*|module:xduce~transducerFunction)} If a collection is supplied, then the function returns a new
 *     collection of the same type with some of the elements of the input collection dropped. If no collection is
 *     supplied, a transducer function, suitable for passing to `{@link module:xduce.sequence|sequence}`,
 *     `{@link module:xduce.into|into}`, etc. is returned.
 */
function dropWhile(collection, fn, ctx) {
  const [col, func] = isFunction(collection) ? [null, collection.bind(fn)] : [collection, fn.bind(ctx)];
  return col ? sequence(col, dropWhile(func)) : xform => dropWhileTransducer(func, xform);
}

module.exports = {
  drop,
  dropWhile
};
