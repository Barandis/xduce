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
 * A set of functions related to the producing reducer objects, marking reduced objects, and performing general
 * reduction operations.
 *
 * @module reduction
 * @private
 */

const { isArray, isFunction, isObject, isString } = require('./util');
const { isKvFormObject, iterator } = require('./iteration');
const { protocols, isImplemented } = require('./protocol');
const p = protocols;

/**
 * Returns an init function for a collection. This is a function that returns a new, empty instance of the collection in
 * question. If the collection doesn't support reduction, `null` is returned. This makes conditionals a bit easier to
 * work with.
 *
 * In order to support the conversion of functions into reducers, function support is also provided.
 *
 * @private
 *
 * @param {*} collection A collection to create an init function for. This can be anything that supports the ES2015
 *     iteration protocol, a plain object, a pre-ES2015 string or array, or a function.
 * @return {module:xduce~init} A function that, when called, returns an initial version of the provided collection. If
 *     the provided collection is not iterable, then `null` is returned.
 */
function init(collection) {
  switch (true) {
    case isImplemented(collection, 'init'):
      return collection[p.init];
    case isString(collection):
      return () => '';
    case isArray(collection):
      return () => [];
    case isObject(collection):
      return () => ({});
    case isFunction(collection):
      return () => {
        throw Error('init not available');
      };
    default:
      return null;
  }
}

/**
 * Returns a step function for a collection. This is a function that takes an accumulator and a value and returns the
 * result of reducing the value into the accumulator. If the collection doesn't support reduction, `null` is returned.
 * The returned function itself simply reduces the input into the target collection without modifying it.
 *
 * In order to support the conversion of functions into reducers, function support is also provided.
 *
 * @private
 *
 * @param {*} collection A collection to create a step function for. This can be anything that supports the ES2015
 *     iteration protocol, a plain object, a pre-ES2015 string or array, or a function.
 * @return {module:xduce~step} A reduction function for the provided collection that simply adds an element to the
 *     target collection without modifying it. If the provided collection is not iterable, `null` is returned.
 */
function step(collection) {
  switch (true) {
    case isImplemented(collection, 'step'):
      return collection[p.step];

    case isString(collection):
      return (acc, input) => {
        const value = isKvFormObject(input) ? input.v : input;
        return acc + value;
      };

    case isArray(collection):
      return (acc, input) => {
        const value = isKvFormObject(input) ? { [input.k]: input.v } : input;
        acc.push(value);
        return acc;
      };

    case isObject(collection):
      return (acc, input) => {
        let value = input;

        if (isKvFormObject(input)) {
          // if the object is kv-form, change the object from { k: key, v: value } to { key: value }
          value = { [input.k]: input.v };
        } else if (!isObject(input)) {
          // if the input isn't an object at all, turn it into an object with a key based on what's already in the
          // accumulator
          let max = -1;
          for (const k1 in acc) {
            const knum = parseInt(k1);
            if (knum > max) {
              max = knum;
            }
          }
          value = { [max + 1]: input };
        }

        for (const k2 in value) {
          if (value.hasOwnProperty(k2)) {
            acc[k2] = value[k2];
          }
        }
        return acc;
      };

    case isFunction(collection):
      return (acc, input) => collection(acc, input);

    default:
      return null;
  }
}

/**
 * Returns a result function for a collection. This is a function that performs any final processing that should be done
 * on the result of a reduction. If the collection doesn't support reduction, `null` is returned.
 *
 * In order to support the conversion of functions into reducers, function support is also provided.
 *
 * @private
 *
 * @param {*} collection A collection to create a step function for. This can be anything that supports the ES2015
 *     iteration protocol, a plain object, a pre-ES2015 string or array, or a function.
 * @return {module:xduce~result} A function that, when given a reduced collection, produces the final output. If the
 *     provided collection is not iterable, `null` will be returned.
 */
function result(collection) {
  switch (true) {
    case isImplemented(collection, 'result'):
      return collection[p.result];
    case isString(collection):
    case isArray(collection):
    case isObject(collection):
    case isFunction(collection):
      return value => value;
    default:
      return null;
  }
}

/**
 * **Creates a reducer object from a function or from a built-in reducible type (array, object, or string).**
 *
 * To create a reducer for arrays, objects, or strings, simply pass an empty version of that collection to this function
 * (e.g., `toReducer([])`). These reducers support the kv-form for objects.
 *
 * The notable use for this function though is to turn a reduction function into a reducer object. The function is a
 * function oftwo parameters, an accumulator and a value, and returns the accumulator with the value in it. This is
 * exactly the same kind of function that is passed to reduction functions like JavaScript's `Array.prototype.reduce`
 * and Lodash's `_.reduce`.
 *
 * Note in particular that the output of this reducer does not need to be a collection. It can be anything. While
 * transducing normally involves transforming one collection into another, it need not be so. For example, here is a
 * reducer that will result in summing of the collection values.
 *
 * ```
 * const { toReducer, reduce } = xduce;
 *
 * const sumReducer = toReducer((acc, input) => acc + input);
 * const sum = reduce([1, 2, 3, 4, 5], sumReducer, 0);
 * // sum = 15
 * ```
 *
 * This can be combined with transducers as well, as in this calculation of the sum of the *squares* of the collection
 * values.
 *
 * ```
 * const { toReducer, transduce } = xduce;
 * const { map } = xduce.transducers;
 *
 * const sumReducer = toReducer((acc, input) => acc + input);
 * const sum = transduce([1, 2, 3, 4, 5], map(x => x * x), sumReducer, 0);
 * // sum = 55
 * ```
 *
 * @memberof module:xduce
 *
 * @param {*} collection An iterable collection or a reducer function.
 * @return {object} An object containing protocol properties for init, step, and result. This object is suitable for
 *     use as a reducer object (one provided to `{@link xduce.reduce|reduce}` or `{@link xduce.transduce|transduce}`).
 *     If the provided collection is not iterable, all of the properties of this object will be `null`.
 */
function toReducer(collection) {
  return {
    [p.init]: init(collection),
    [p.step]: step(collection),
    [p.result]: result(collection)
  };
}

// Reducer functions for the three common built-in iterable types.
const arrayReducer = toReducer([]);
const objectReducer = toReducer({});
const stringReducer = toReducer('');

/**
 * **Creates a reduction function from a transducer and a reducer.**
 *
 * This produces a function that's suitable for being passed into other libraries' reduce functions, such as
 * JavaScript's `Array.prototype.reduce` or Lodash's `_.reduce`. It requires both a transformer and a reducer because
 * reduction functions for those libraries must know how to do both. The reducer can be a standard reducer object like
 * the ones sent to`{@link module:xduce.transduce|transduce}` or `{@link module:xduce.reduce|reduce}`, or it can be a
 * plain function that takes two parameters and returns the result of reducing the second parameter into the first.
 *
 * If there is no need for a transformation, then pass in the `{@link module:xduce.identity|identity}` transducer.
 *
 * @memberof module:xduce
 *
 * @param {module:xduce~transducerObject} xform A transducer object whose step function will become the returned
 *     reduction function.
 * @param {(module:xduce~step|module:xduce~transducerObject)} reducer A reducer that knows how to reduce values into an
 *     output collection. This can either be a reducing function or a transducer object whose `step` function knows how
 *     to perform this reduction.
 * @return {module:xduce~step} A function that handles both the transformation and the reduction of a value onto a
 *     target function.
 */
function toFunction(xform, reducer) {
  const r = typeof reducer === 'function' ? toReducer(reducer) : reducer;
  const result = xform(r);
  return result[p.step].bind(result);
}

/**
 * **Marks a value as reduced.**
 *
 * This is done by wrapping the value. This means three things: first, a reduced obejct may be marked as reduced again;
 * second, a reduced value isn't usable without being unreduced first; and third any type of value (including
 * `undefined`) may be marked as reduced.
 *
 * @memberof module:xduce.util.reduction
 *
 * @param {*} value The value to be reduced.
 * @return {*} A reduced version of the provided value. This reduction is achieved by wrapping the value in a marker
 *     object.
 */
function reduced(value) {
  return {
    [p.reduced]: true,
    [p.value]: value
  };
}

/**
 * **Removes the reduced status from a reduced value.**
 *
 * This function is intended to be used when it's certain that a value is already marked as reduced. If it is not,
 * `undefined` will be returned instead of the value.
 *
 * @memberof module:xduce.util.reduction
 *
 * @param {*} value The value to be unreduced.
 * @return {*} An unreduced version of the provided value. If the value was not reduced in the first place, `undefined`
 *     will be returned instead.
 */
function unreduced(value) {
  if (value == null) {
    return;
  }
  return value[p.value];
}

/**
 * **Determines whether a value is marked as reduced.**
 *
 * @memberof module:xduce.util.reduction
 *
 * @param {*} value The value to test for its reduced status.
 * @return {boolean} Eitheehr `true` if the value is reduced, or `false` if it is not.
 */
function isReduced(value) {
  if (value == null) {
    return false;
  }
  return !!value[p.reduced];
}

/**
 * **Makes sure that a value is marked as reduced; if it is not, it will be marked as reduced.**
 *
 * This differs from {@link module:xduce.util.reduced|reduced} in that if the value is already reduced, this function
 * won't reduce it again. Therefore thus function can't be used to make a value reduced multiple times.
 *
 * @memberof module:xduce.util.reduction
 *
 * @param {*} value The value to be reduced.
 * @return {*} If the value is already reduced, then the value is simply returned. Otherwise, a reduced version of the
 *     value is returned.
 */
function ensureReduced(value) {
  return isReduced(value) ? value : reduced(value);
}

/**
 * **Removes the reduced status from a value, as long as it actually is reduced.**
 *
 * This does a check to make sure the value passed in actually is reduced. If it isn't, the value itself is returned.
 * It's meant to be used when the reduced status is uncertain.
 *
 * @memberof module:xduce.util.reduction
 *
 * @param {*} value The reduced value to be unreduced.
 * @return {*} If the value is already unreduced, the value is simply returned. Otherwise an unreduced version of the
 *     value is returned.
 */
function ensureUnreduced(value) {
  return isReduced(value) ? unreduced(value) : value;
}

/**
 * **Reduces the elements of the input collection through a reducer into an output collection.**
 *
 * This is the lowest-level of the transduction functions. In fact, this one is so low-level that it doesn't have a lot
 * of use in normal operation. It's more useful for writing your own transformation functions.
 *
 * `reduce` doesn't assume that there's even a transformation. It requires an initial collection and a reducer object
 * that is matched to that initial collection. The reducer object must implement the `step` and `result` protocols,
 * which instruct `reduce` on how to build up the collection. The reducer may implement a transformation as well, but
 * all that's important here is that it can do the reduction.
 *
 * The input collection need only implement `iterator`. It is not necessary for the input and output collections to be
 * of the same type; as long as the input implements `iterator` and the reducer implements `step` and `result`
 * appropriate to the type of the `init` collection, then any translation between collection types can occur.
 *
 * The normal course of operation will be to call {@link module:xduce.transduce|transduce} instead, as that function
 * makes it easy to combine transformations with reductions and can optionally figure out the initial collection itself.
 *
 * @memberof module:xduce
 *
 * @param {*} collection The input collection. The only requirement of this collection is that it implement the
 *     `iterator` protocol. Special support is provided by the library for objects and pre-ES2015 arrays and strings
 *     (ES2015 arrays and strings already implement `iterator`), so any of those can also be used.
 * @param {object} reducer An object that implements the `step` and `result` protocols. This object must know how to
 *     produce an output collection through those protocol functions.
 * @param {*} init a collection of the same type as the output collection. It need not be empty; if it is not, the
 *     existing elements are retained as the input collection is reduced into it.
 * @return {*} A new collection, consisting of the `init` collection with all of the elements of the `collection`
 *     collection reduced into it.
 */
function reduce(collection, reducer, init) {
  if (collection == null) {
    return null;
  }

  const iter = iterator(collection, null, true);
  if (!iter) {
    throw Error(`Cannot reduce an instance of ${collection.constructor.name}`);
  }

  let acc = init;
  let step = iter.next();

  while (!step.done) {
    acc = reducer[p.step](acc, step.value);
    if (isReduced(acc)) {
      acc = unreduced(acc);
      break;
    }
    step = iter.next();
  }

  return reducer[p.result](acc);
}

module.exports = {
  init,
  step,
  result,
  toReducer,
  arrayReducer,
  objectReducer,
  stringReducer,
  toFunction,
  reduced,
  unreduced,
  isReduced,
  ensureReduced,
  ensureUnreduced,
  reduce
};
