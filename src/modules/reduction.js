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
// reduction.js
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const {
  isArray,
  isFunction,
  isObject,
  isString
} = require('./util');

const {
  isKvFormObject,
  iterator
} = require('./iteration');

const { protocols, isImplemented } = require('./protocol');
const p = protocols;

// Returns an init function for a collection. This is a function that returns a new, empty instance of the collection in
// question. If the collection doesn't support reduction, `null` is returned. This makes conditionals a bit easier to
// work with.
//
// In order to support the conversion of functions into reducers, function support is also provided.
function init(collection) {
  switch (true) {
    case isImplemented(collection, 'init'): return collection[p.init];
    case isString(collection):              return () => '';
    case isArray(collection):               return () => [];
    case isObject(collection):              return () => ({});
    case isFunction(collection):            return () => { throw Error('init not available'); };
    default:                                return null;
  }
}

// Returns a step function for a collection. This is a function that takes an accumulator and a value and returns the
// result of reducing the value into the accumulator. If the collection doesn't support reduction, `null` is returned.
//
// In order to support the conversion of functions into reducers, function support is also provided.
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
        // Would love to use a do expression here, but they don't currently play nice with object literals
        let value = input;

        if (isKvFormObject(input)) {
          // if the object is kv-form, change the object from { k: key, v: value } to { key: value }
          value = {[input.k]: input.v};
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
          value = {[max + 1]: input};
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

// Returns a result function for a collection. This is a function that performs any final processing that should be done
// on the result of a reduction. If the collection doesn't support reduction, `null` is returned.
//
// In order to support the conversion of functions into reducers, function support is also provided.
function result(collection) {
  switch (true) {
    case isImplemented(collection, 'result'): return collection[p.result];
    case isString(collection):
    case isArray(collection):
    case isObject(collection):
    case isFunction(collection):              return (value) => value;
    default:                                  return null;
  }
}

// Creates a reducer object for a collection. This object is suitable for being passed to a transduce or reduce call. If
// a function is passed, a reducer version of that function is returned.
function toReducer(collection) {
  return {
    [p.init]:   init(collection),
    [p.step]:   step(collection),
    [p.result]: result(collection)
  };
}

// Reducer functions for the three common built-in iterable types.
const arrayReducer = toReducer([]);
const objectReducer = toReducer({});
const stringReducer = toReducer('');

// Turns a transformer along with a specific reducer into a function that can be used with other reduce implementations
// like the native Array.prototype.reduce function or the reduce functions in Underscore or Lodash. Since our
// transformers rely on the object being reduced to supply information on how to reduce, and since these other
// implementations are not coded to read that information, we must explicitly supply the reducer.
function toFunction(xform, reducer) {
  const r = typeof reducer === 'function' ? toReducer(reducer) : reducer;
  const result = xform(r);
  return result[p.step].bind(result);
}

// Returns a reduced version of a value, regardless of whether the value is already reduced.
function reduced(value) {
  return {
    [p.reduced]: true,
    [p.value]: value
  };
}

// Returns the unreduced value of a reduced value.
function unreduced(value) {
  if (value == null) {
    return;
  }
  return value[p.value];
}

// Determines whether a value is reduced.
function isReduced(value) {
  if (value == null) {
    return false;
  }
  return !!value[p.reduced];
}

// Returns a reduced version of a value, though if the supplied value is already reduced, it won't be reduced again.
function ensureReduced(value) {
  return isReduced(value) ? value : reduced(value);
}

// Returns an unreduced value. If the supplied value isn't reduced in the first place, it is simply returned.
function ensureUnreduced(value) {
  return isReduced(value) ? unreduced(value) : value;
}

// The core function of the entire library. This reduces a collection by applying a reduction step function to every
// element of the collection and adding it to the initial collection provided (the step function is assumed to know how
// to build on the initial collection). The final collection is then passed through the result function to get the final
// output.
//
// The `reducer` object contains these step and result functions. The collection must be iterable; if it is not, an
// error is thrown.
function reduce(collection, reducer, init) {
  if (collection == null) {
    return null;
  }

  const iter = iterator(collection);
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
