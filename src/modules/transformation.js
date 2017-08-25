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
// transformation.js
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const { protocols, isImplemented } = require('./protocol');
const { isKvFormObject, iterator } = require('./iteration');
const { isReduced, reduce, arrayReducer, objectReducer, stringReducer } = require('./reduction');
const { isArray, isObject, isString } = require('./util');
const p = protocols;

// An iterator that also acts as a transformer, transforming its collection one element at a time. This is the actual
// output of the sequence function (when the input collection is an iterator) and the asIterator function.
//
// This object supports non-1-to-1 correspondences between input and output values. For example, a filter transformation
// might return fewer output elements than were in the input collection, while a repeat transformation will return more.
// In either case, `next` in this class will return one element per call.
function transformingIterator(collection, xform) {
  const stepReducer = {
    [p.step]: (xiter, input) => {
      const value = isKvFormObject(input) ? { [input.k]: input.v } : input;
      xiter.items.unshift(value);
      return xiter;
    },
    [p.result]: value => value
  };

  const iter = iterator(collection);
  const xf = xform(stepReducer);
  let reduced = false;

  return {
    // This array is the key to working properly with step functions that return more than one value. All of them are
    // put into the items array. As long as this array has values in it, the `next` function will return one value
    // popped from it rather than running the step function again.
    items: [],

    // This object is an iterator itself, so just return this. This function serves to make the iterator work right in
    // ES2015, so it can be used in for...of expressions, for instance.
    [p.iterator]() {
      return this;
    },

    // The next function here is rather simple. If there is already something in the items array, it's returned. If not,
    // the step function is run and, if that results in a value in the items array, it's returned. Otherwise an object
    // with {done: true} is returned.
    next() {
      if (this.items.length === 0) {
        this.step();
      }
      if (this.items.length === 0) {
        return {
          done: true
        };
      }
      return {
        value: this.items.pop(),
        done: false
      };
    },

    // This is where most of the work happens. It gets the next value from the input collection and runs it through the
    // reduction step functions. If that results in a value, it's given to the stepper object (which adds it to the
    // items array); otherwise the while loop continues to the next element of the input collection. This ensures that
    // there's something for the `next` function to return each time it's called.
    //
    // If the collection has completed or if the step function returns a reduced object (which take will do after its
    // limit of elements has been reached, for instance), the iteration is completed by calling the result function.
    step() {
      const count = this.items.length;
      while (this.items.length === count) {
        const step = iter.next();
        if (step.done || reduced) {
          xf[p.result](this);
          break;
        }
        reduced = isReduced(xf[p.step](this, step.value));
      }
    }
  };
}

// While `reduce` is the core function, this is the one that will be called the most often. This one takes a transformer
// function and a reducer object and combines them into a transformer object suitable for `reduce`. It also ensures that
// there is a legitimate init object to reduce into.
//
// If the transformer function is null, the reducer will be used as the transformer. If no initial collection is
// supplied, it'll be taken from the reducers `init` protocol function.
//
// Without the transformer, this function basically becomes `reduce` with the ability to determine an initial collection
// from its reducer.
function transduce(collection, xform, reducer, init = reducer[p.init]()) {
  const xf = xform ? xform(reducer) : reducer;
  return reduce(collection, xf, init);
}

// Runs a collection through the supplied transformer, reducing the results into an array. If no transformer is
// supplied, the collection is simply reduced into an array as-is.
function asArray(collection, xform) {
  return transduce(collection, xform, arrayReducer);
}

// Runs a collection through the supplied transformer, reducing the results into an object. In order for this to work,
// the object reducer assumes that it will be receiving elements that are objects in one of two forms: {key: value} or
// {k: key, v:value} (kv-form). Either will be reduced into {key: value}.
//
// If no transformer is supplied, the collection is simply reduced into an object, though there aren't many instances
// where this would make a lot of sense because no other collections can be converted into the format required here.
function asObject(collection, xform) {
  return transduce(collection, xform, objectReducer);
}

// Runs a collection through the supplied transformer, reducing the results into a string. If no transformer is
// supplied, the collection is simply reduced into a string as-is.
function asString(collection, xform) {
  return transduce(collection, xform, stringReducer);
}

// Runs a collection through the supplied transformer, reducing the results into an iterator. If no transformer is
// supplied, the collection is simply turned into an iterator as-is.
function asIterator(collection, xform) {
  return xform ? transformingIterator(collection, xform) : iterator(collection, null, false);
}

// Runs a collection through the supplied transformer, reducing the results into a collection of the same kind. Since
// this function depends on the collection to determine the output collection type, this can't be used for conversion
// into a different type of collection.
function asReducible(collection, xform) {
  return transduce(collection, xform, collection);
}

// Takes a collection and a transformer and performs a transduction, returning a collection of the same kind.
function sequence(collection, xform) {
  switch (true) {
    case isArray(collection):
      return asArray(collection, xform);
    case isObject(collection):
      return asObject(collection, xform);
    case isString(collection):
      return asString(collection, xform);
    case isImplemented(collection, 'step'):
      return asReducible(collection, xform);
    case isImplemented(collection, 'iterator'):
      return asIterator(collection, xform);
    default:
      throw Error(`Cannot sequence collection: ${collection}`);
  }
}

// Takes a collection and a transformer and performs a transduction, returning the result by appending it to the
// supplied target collection. In most cases, this will be an empty collection, but if a non-empty target is passed, its
// elements will remain in place and the value of the transduction appended.
function into(target, collection, xform) {
  switch (true) {
    case isArray(target):
      return transduce(collection, xform, arrayReducer, target);
    case isObject(target):
      return transduce(collection, xform, objectReducer, target);
    case isString(target):
      return transduce(collection, xform, stringReducer, target);
    case isImplemented(target, 'step'):
      return transduce(collection, xform, target, target);
    default:
      throw Error(`Cannot reduce collection into ${target}: ${collection}`);
  }
}

// Composes multiple transformer functions into a single transformer function. Unlike most compose functions, this one
// works first-to-last: the first function is run first, passing its result to the second function, etc. This is because
// that's much more natural in working with transformers.
//
// This function is designed to work specifically with transformer functions. It depends on those functions taking
// another transformer function and chaining them together.
//
// Note that when using this with transduction functions, the result must be passed to a sequencing function (sequence,
// into, as-array, etc.). The composed function can only take one parameter, so it can't be used like the shortcut
// transducer functions.
function compose(...fns) {
  const reversedFns = fns.reverse();
  return value => reversedFns.reduce((acc, fn) => fn(acc), value);
}

module.exports = {
  transduce,
  asArray,
  asObject,
  asString,
  asIterator,
  asReducible,
  sequence,
  into,
  compose
};
