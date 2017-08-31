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
 * Transducers for removing or retaining certain elements based on their properties.
 *
 * @module filter
 * @private
 */

const { protocols } = require('../modules/protocol');
const { sequence } = require('../modules/transformation');
const { isFunction, complement } = require('../modules/util');
const p = protocols;

/**
 * A transducer function that is returned by the `{@link module:xduce.transducers.filter|filter}`,
 * `{@link module:xduce.transducers.reject|reject}`, and `{@link module:xduce.transducers.compact|compact}` transducers.
 *
 * @private
 *
 * @param {function} fn A single-parameter predicate function that determines which elements should be retained in the
 *     output collection.
 * @param {module:xduce~transducerObject} xform The transducer object that the new one should be chained to.
 * @return {module:xduce~transducerObject} A new transducer object, performing no transformation and chaining to the
 *     provided transducer object.
 */
function filterTransducer(fn, xform) {
  return {
    [p.init]() {
      return xform[p.init]();
    },

    [p.step](acc, input) {
      return fn(input) ? xform[p.step](acc, input) : acc;
    },

    [p.result](value) {
      return xform[p.result](value);
    }
  };
}

/**
 * **Creates a collection containing only the elements from the input collection that pass a predicate function.**
 *
 * The elements are not in any way modified. Quite simply, if the predicate returns `true` for an element, it's included
 * in the output collection, and if it returns `false`, that element is not included.
 *
 * If no collection is provided, a function is returned that can be passed to `{@link module:xduce.sequence|sequence}`,
 * et al.
 *
 * ```
 * const even = x => x % 2 === 0; *
 * const result = filter([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], even);
 * // result = [2, 4, 6, 8, 10]
 * ```
 *
 * @memberof module:xduce.transducers
 *
 * @param {*} [collection] An optional input collection that is to be transduced.
 * @param {function} fn A predicate function. This takes each element of the input collection and returns `true` or
 *     `false` based on that element. Each that returns `true` will be included in the output collection.
 * @param {object} [ctx] An optional context object which is set to `this` for the function `fn`. This does not work if
 *     `fn` is an arrow function, as they cannot be bound to contexts.
 * @return {(*|module:xduce~transducerFunction)} If a collection is supplied, then the function returns a new
 *     collection of the same type containing only the elements that pass the predicate function. If no collection is
 *     supplied, a transducer function, suitable for passing to `{@link module:xduce.sequence|sequence}`,
 *     `{@link module:xduce.into|into}`, etc. is returned.
 */
function filter(collection, fn, ctx) {
  const [col, func] = isFunction(collection) ? [null, collection.bind(fn)] : [collection, fn.bind(ctx)];
  return col ? sequence(col, filter(func)) : xform => filterTransducer(func, xform);
}

/**
 * **Creates a collection containing only the elements from the input collection that do not pass a predicate
 * function.**
 *
 * This is the opposite of `{@link module:xduce.transducers.filter|filter}`. None of the elements of the input
 * collection are modified, and only those for which the predicate returns `false` are included in the output
 * collection.
 *
 * If no collection is provided, a function is returned that can be passed to `{@link module:xduce.sequence|sequence}`,
 * et al.
 *
 * ```
 * const even = x => x % 2 === 0;
 * const result = reject([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], even);
 * // result = [1, 3, 5, 7, 9]
 * ```
 *
 * @memberof module:xduce.transducers
 *
 * @param {*} [collection] An optional input collection that is to be transduced.
 * @param {function} fn A predicate function. This takes each element of the input collection and returns `true` or
 *     `false` based on that element. Each that returns `false` will be included in the output collection.
 * @param {object} [ctx] An optional context object which is set to `this` for the function `fn`. This does not work if
 *     `fn` is an arrow function, as they cannot be bound to contexts.
 * @return {(*|module:xduce~transducerFunction)} If a collection is supplied, then the function returns a new
 *     collection of the same type containing only the elements that fail the predicate function. If no collection is
 *     supplied, a transducer function, suitable for passing to `{@link module:xduce.sequence|sequence}`,
 *     `{@link module:xduce.into|into}`, etc. is returned.
 */
function reject(collection, fn, ctx) {
  const [col, func] = isFunction(collection) ? [null, collection.bind(fn)] : [collection, fn.bind(ctx)];
  return filter(col, complement(func));
}

/**
 * **Removes any 'falsey' elements from the collection.**
 *
 * 'Falsey' means any value in JavaScript that is considered to be false. These values are `false`, `null`, `undefined`,
 * the empty string, and `0`. This function is good for removing empy elements from a collection.
 *
 * If the semantics don't suit - for example, if you want to remove empty elements but retain `0`s - then use an
 * appropriate function with either `{@link module:xduce.transducers.filter|filter}` or
 * `{@link module:xduce.transducers.reject|reject}`.
 *
 * If no collection is provided, a function is returned that can be passed to `{@link module:xduce.sequence|sequence}`,
 * et al.
 *
 * ```
 * const result = compact([1, 0, 2, null, 3, undefined, 4, '', 5]);
 * // result = [1, 2, 3, 4, 5]
 * ```
 *
 * @memberof module:xduce.transducers
 *
 * @param {*} [collection] An optional input collection that is to be transduced.
 * @return {(*|module:xduce~transducerFunction)} If a collection is supplied, then the function returns a new
 *     collection of the same type with all of the falsey elements of that collection removed. If no collection is
 *     supplied, a transducer function, suitable for passing to `{@link module:xduce.sequence|sequence}`,
 *     `{@link module:xduce.into|into}`, etc. is returned.
 */
function compact(collection) {
  return filter(collection, x => !!x);
}

module.exports = {
  filter,
  reject,
  compact
};
