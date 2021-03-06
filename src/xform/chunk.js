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
 * Transducers related to breaking input elements into groups.
 *
 * @module chunk
 * @private
 */

const { protocols } = require('../modules/protocol');
const { sequence } = require('../modules/transformation');
const { ensureUncompleted } = require('../modules/reduction');
const { isFunction, isNumber } = require('../modules/util');
const { sameValueZero } = require('./core');
const p = protocols;

/**
 * A constant indicating no value at all.
 *
 * @private
 * @type {symbol}
 */
const NO_VALUE = Symbol('NO_VALUE');

/**
 * A transducer function that is returned by the `{@link module:xduce.transducers.chunk|chunk}` transducer.
 *
 * @private
 *
 * @param {number} n The number of elements that should be in each chunk.
 * @param {module:xduce~transducerObject} xform The transducer object that the new one should be chained to.
 * @return {module:xduce~transducerObject} A new transducer object chained to the provided transducer object.
 */
function chunkTransducer(n, xform) {
  let count = 0;
  let part = [];

  return {
    [p.init]() {
      return xform[p.init]();
    },

    [p.step](acc, input) {
      part[count++] = input;
      if (count === n) {
        const out = part.slice(0, n);
        part = [];
        count = 0;
        return xform[p.step](acc, out);
      }
      return acc;
    },

    [p.result](value) {
      if (count > 0) {
        return ensureUncompleted(xform[p.step](value, part.slice(0, count)));
      }
      return xform[p.result](value);
    }
  };
}

/**
 * **Groups the elements of the input collection into arrays of length `n` in the output collection.**
 *
 * Whatever the type of input collection, the groups inside the output collection will always be arrays (the output
 * collection itself will still be definable as normal). Because of this, `chunk` doesn't do anything meaningful to
 * collection types that cannot contain arrays (strings and objects, for instance).
 *
 * If there are not enough remaining elements in the input collection to create a chunk of the proper size in the output
 * collection, the last chunk in the output will only be large enough to contain those remaining elements.
 *
 * `chunk` works on iterators (it returns a new iterator whose values are arrays), but because of technical reasons,
 * the function has no way of knowing when the end of an iterator comes unless it happens to be at the same place as the
 * last element of a chunk. For example, if an iterator has six values and it gets `chunk`ed into groups of three, the
 * function will terminate correctly (because the last value of the iterator coincides with the last element of one of
 * the chunks). However, if the same iterator had only five values, `chunk` would not terminate properly. It would
 * return `[1, 2, 3]` for the first chunk, `[4, 5]` for the second chunk, and then `[4, 5]` over and over ad infinitum.
 *
 * A workaround is to compose `chunk` with a previous `{@link module:xduce.transducers.take|take}` with the same `n` as
 * the length of the iterator. Since `{@link module:xduce.transducers.take|take}` knows when it's reached the right
 * number of elements, it can communicate that to `chunk`.
 *
 * Another is to check the length of the chunk after each call to `next` on the iterator. If it's less than the size of
 * the chunk, then it must be the last one.
 *
 * `chunk` works as expected on infinite iterators.
 *
 * If no collection is provided, a function is returned that can be passed to `{@link module:xduce.sequence|sequence}`,
 * et al.
 *
 * ```
 * const result = chunk([1, 2, 3, 4, 5], 3);
 * // result = [[1, 2, 3], [4, 5]]
 * ```
 *
 * @memberof module:xduce.transducers
 *
 * @param {*} [collection] An optional input collection that is to be transduced.
 * @param {number} n The number of elements that should be in each array in the output collection.
 * @return {(*|module:xduce~transducerFunction)} If a collection is supplied, then the function returns a new
 *     collection of the same type with all of the elements of the input collection chunked. If no collection is
 *     supplied, a transducer function, suitable for passing to `{@link module:xduce.sequence|sequence}`,
 *     `{@link module:xduce.into|into}`, etc. is returned.
 */
function chunk(collection, n) {
  const [col, num] = isNumber(collection) ? [null, collection] : [collection, n];
  return col ? sequence(col, chunk(num)) : xform => chunkTransducer(num, xform);
}

/**
 * A transducer function that is returned by the `{@link module:xduce.transducers.chunkBy|chunkBy}` transducer.
 *
 * @private
 *
 * @param {function} fn The function that defines when a chunk ends and the next chunk begins.
 * @param {module:xduce~transducerObject} xform The transducer object that the new one should be chained to.
 * @return {module:xduce~transducerObject} A new transducer object chained to the provided transducer object.
 */
function chunkByTransducer(fn, xform) {
  let part = [];
  let last = NO_VALUE;

  return {
    [p.init]() {
      return xform[p.init]();
    },

    [p.step](acc, input) {
      const current = fn(input);
      let result = acc;
      if (last === NO_VALUE || sameValueZero(current, last)) {
        part.push(input);
      } else {
        result = xform[p.step](result, part);
        part = [input];
      }
      last = current;
      return result;
    },

    [p.result](value) {
      const count = part.length;
      if (count > 0) {
        return ensureUncompleted(xform[p.step](value, part.slice(0, count)));
      }
      return xform[p.result](value);
    }
  };
}

/**
 * **Breaks the elements of an input collection into arrays of consecutive elements that return the same value from a
 * predicate function.**
 *
 * Whatever the type of input collection, the groups inside the output collection will always be arrays (the output
 * collection itself will still be of the same type as the input collection). Because of this, `chunkBy` doesn't do
 * anything meaningful to collection types that cannot contain arrays (strings and objects, for instance).
 *
 * Unlike `{@link module:xduce.transducers.chunk|chunk}`, this function does not know how many elements will be in each
 * array until the first one that turns out to be part of the next array. Therefore, for the same reasons as in
 * `{@link module:xduce.transducers.chunk|chunk}` above, an iterator result is never terminated. This works fine for
 * infinite iterators, but finite iterators should be treated with care. The same
 * `{@link module:xduce.transducers.chunk|chunk}` workaround with `{@link module:xduce.transducers.take|take}` works
 * with `chunkBy` as well.
 *
 * ```
 * const result = chunkBy([0, 1, 1, 2, 3, 5, 8, 13, 21, 34], x => x % 2 === 0);
 * // result = [[0], [1, 1], [2], [3, 5], [8], [13, 21], [34]]
 * ```
 *
 * @memberof module:xduce.transducers
 *
 * @param {*} [collection] An optional input collection that is to be transduced.
 * @param {function} fn The function that defines when a chunk ends and the next chunk begins.
 * @param {object} [ctx] An optional context object which is set to `this` for the function `fn`. This does not work if
 *     `fn` is an arrow function, as they cannot be bound to contexts.
 * @return {(*|module:xduce~transducerFunction)} If a collection is supplied, then the function returns a new
 *     collection of the same type with all of the elements of the input collection chunked. If no collection is
 *     supplied, a transducer function, suitable for passing to `{@link module:xduce.sequence|sequence}`,
 *     `{@link module:xduce.into|into}`, etc. is returned.
 */
function chunkBy(collection, fn, ctx) {
  const [col, func] = isFunction(collection) ? [null, collection.bind(fn)] : [collection, fn.bind(ctx)];
  return col ? sequence(col, chunkBy(func)) : xform => chunkByTransducer(func, xform);
}

module.exports = {
  chunk,
  chunkBy
};
