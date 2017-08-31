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
 * Transducers for dropping some number of elements at the end of a collection.
 *
 * @module take
 * @private
 */

const { protocols } = require('../modules/protocol');
const { ensureCompleted } = require('../modules/reduction');
const { sequence } = require('../modules/transformation');
const { isNumber, isFunction } = require('../modules/util');
const p = protocols;

/**
 * A transducer function that is returned by the `{@link module:xduce.transducers.take|take}` transducer.
 *
 * @private
 *
 * @param {module:xduce~transducerObject} xform The transducer object that the new one should be chained to.
 * @return {module:xduce~transducerObject} A new transducer object, performing no transformation and chaining to the
 *     provided transducer object.
 */
function takeTransducer(n, xform) {
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
          result = ensureCompleted(result);
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

/**
 * **Creates a new collection containing only the first `n` elements of the input collection.**
 *
 * Note that this is an excellent way to turn an 'infinite' collection - one that doesn't have a well-defined end, like
 * a stream, channel, or infinite generator - into a finite collection.
 *
 * If no collection is provided, a function is returned that can be passed to `{@link module:xduce.sequence|sequence}`,
 * et al.
 *
 * ```
 * // An iterator that will return every positive integer, one at a time per next() call
 * function* naturals() {
 *   let x = 1;
 *   while (true) {
 *     yield x++;
 *   }
 * }
 *
 * const result = take(naturals(), 3);
 * // result is now an iterator that has only three values in it
 * result.next().value === 1;  // true
 * result.next().value === 2;  // true
 * result.next().value === 3;  // true
 * result.next().done;         // true
 * ```
 *
 * @memberof module:xduce.transducers
 *
 * @param {*} [collection] An optional input collection that is to be transduced.
 * @param {number} n The number of elements at the beginning of the input collection that should be kept in the
 *     output collection.
 * @return {(*|module:xduce~transducerFunction)} If a collection is supplied, then the function returns a new
 *     collection of the same type containing only the first `n` elements. If no collection is supplied, a transducer
 *     function, suitable for passing to `{@link module:xduce.sequence|sequence}`, `{@link module:xduce.into|into}`,
 *     etc. is returned.
 */
function take(collection, n) {
  const [col, num] = isNumber(collection) ? [null, collection] : [collection, n];
  return col ? sequence(col, take(num)) : xform => takeTransducer(num, xform);
}

/**
 * A transducer function that is returned by the `{@link module:xduce.transducers.takeWhile|takeWhile}` transducer.
 *
 * @private
 *
 * @param {function} fn A single-parameter predicate function that determines which is the first element to be rejected
 *     in the output collection.
 * @param {module:xduce~transducerObject} xform The transducer object that the new one should be chained to.
 * @return {module:xduce~transducerObject} A new transducer object, performing no transformation and chaining to the
 *     provided transducer object.
 */
function takeWhileTransducer(fn, xform) {
  return {
    [p.init]() {
      return xform[p.init]();
    },

    [p.step](acc, input) {
      return fn(input) ? xform[p.step](acc, input) : ensureCompleted(acc);
    },

    [p.result](value) {
      return xform[p.result](value);
    }
  };
}

/**
 * **Creates a new collection containing the elements of the input collection up until the first one that causes a
 * predicate function to return `false`.**
 *
 * While this is similar to `{@link module:xduce.transducers.filter|filter}`, there is one key difference. `takeWhile`
 * will not add any further elements to a collection once the first fails the predicate, including later elements that
 * might pass the predicate. `{@link module:xduce.transducers.filter|filter}`, on the other hand, will continue to add
 * those later elements. Therefore `takeWhile` will convert an infinite collection to a finite one while
 * `{@link module:xduce.transducers.filter|filter}` cannot.
 *
 * If no collection is provided, a function is returned that can be passed to `{@link module:xduce.sequence|sequence}`,
 * et al.
 *
 * ```
 * const array = [2, 4, 6, 8, 1, 3, 5, 7, 9, 10];
 * const even = x => x % 2 === 0;
 *
 * let result = takeWhile(array, even);
 * // result = [2, 4, 6, 8];
 *
 * // This shows the difference between takeWhile and filter with the same parameters
 * result = filter(array, even);
 * // result = [2, 4, 6, 8, 10];
 * ```
 *
 * @memberof module:xduce.transducers
 *
 * @param {*} [collection] An optional input collection that is to be transduced.
 * @param {function} fn A predicate function. This takes each element of the input collection and returns `true` or
 *     `false` based on that element. The first one to return `false` is the first element of the input collection that
 *     does *not* appear in the output collection.
 * @param {object} [ctx] An optional context object which is set to `this` for the function `fn`. This does not work if
 *     `fn` is an arrow function, as they cannot be bound to contexts.
 * @return {(*|module:xduce~transducerFunction)} If a collection is supplied, then the function returns a new
 *     collection of the same type with some of the elements of the input collection dropped. If no collection is
 *     supplied, a transducer function, suitable for passing to `{@link module:xduce.sequence|sequence}`,
 *     `{@link module:xduce.into|into}`, etc. is returned.
 */
function takeWhile(collection, fn, ctx) {
  const [col, func] = isFunction(collection) ? [null, collection.bind(fn)] : [collection, fn.bind(ctx)];
  return col ? sequence(col, takeWhile(func)) : xform => takeWhileTransducer(func, xform);
}

/**
 * A transducer function that is returned by the `{@link module:xduce.transducers.takeNth|takeNth}` transducer.
 *
 * @private
 *
 * @param {number} n The skip value, meaning that only every `n`th element is retained.
 * @param {module:xduce~transducerObject} xform The transducer object that the new one should be chained to.
 * @return {module:xduce~transducerObject} A new transducer object, performing no transformation and chaining to the
 *     provided transducer object.
 */
function takeNthTransducer(n, xform) {
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

/**
 * **Creates a new collection consisting of the first element of the input collection, and then every `n`th element
 * after that.**
 *
 * Note that unlike `{@link module:xduce.transducers.take|take}` and
 * `{@link module:xduce.transducers.takeWhile|takeWhile}`, this function is not capable of returning a finite collection
 * when given an infinite collection.
 *
 * If no collection is provided, a function is returned that can be passed to `{@link module:xduce.sequence|sequence}`,
 * et al.
 *
 * ```
 * const result = takeNth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 3);
 * // result = [1, 4, 7, 10]
 * ```
 *
 * @memberof module:xduce.transducers
 *
 * @param {*} [collection] An optional input collection that is to be transduced.
 * @param {number} n The skip value. Every `n`th element of the input collection, after the first, will be a part of
 *     the output collection.
 * @return {(*|module:xduce~transducerFunction)} If a collection is supplied, then the function returns a new
 *     collection of the same type containing only every `n` elements. If no collection is supplied, a transducer
 *     function, suitable for passing to `{@link module:xduce.sequence|sequence}`, `{@link module:xduce.into|into}`,
 *     etc. is returned.
 */
function takeNth(collection, n) {
  const [col, num] = isNumber(collection) ? [null, collection] : [collection, n];
  return col ? sequence(col, takeNth(num)) : xform => takeNthTransducer(num, xform);
}

module.exports = {
  take,
  takeWhile,
  takeNth
};
