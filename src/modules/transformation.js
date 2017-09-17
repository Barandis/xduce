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
 * @module transformation
 * @private
 */

const { protocols, isImplemented } = require('./protocol');
const { isKvFormObject, iterator } = require('./iteration');
const { isCompleted, reduce, arrayReducer, objectReducer, stringReducer, toReducer } = require('./reduction');
const { isArray, isObject, isString, isFunction } = require('./util');
const p = protocols;

// An iterator that also acts as a transformer, transforming its collection one element at a time. This is the actual
// output of the sequence function (when the input collection is an iterator) and the asIterator function.
//
// This object supports non-1-to-1 correspondences between input and output values. For example, a filter transformation
// might return fewer output elements than were in the input collection, while a repeat transformation will return more.
// In either case, `next` in this class will return one element per call.
/**
 * Creates an iterator that is also a transducer, transforming its collection one element at a time. This is the
 * actual output of the {@link module:xduce.asIterator|asIterator} function, as well as the output of the
 * {@link module:xduce.sequence|sequence} function when the input is an iterator.
 *
 * The end user need not be concerned with the type of the output iterator in these circumstances; the end user need
 * only care that the output is, in fact, an iterator and can be expected to act like one. For this reason, this
 * function and the type it returns are not exported.
 *
 * This object supports non-1-to-1 correspondences between input and output values. For example, a filter transformation
 * might return fewer output elements than were in the input collection, while a repeat transformation will return more.
 * In either case, `next` in this class will return one element per call.
 *
 * @private
 *
 * @param {*} collection the input collection that the produced iterator will be iterating over.
 * @param {module:xduce~transducerFunction} xform A function that creates a transducer object that defines the
 *     transformation being done to the iterator's elements. Any of the {@link module:xduce.transducers|transducers} in
 *     this library can produce a suitable transducer function.
 * @return {module:xduce~iterator} An iterator that will transform its input elements using the transducer function as
 *     its `{@link module:xduce~next|next}` function is called.
 */
function transducingIterator(collection, xform) {
  const stepReducer = {
    [p.step]: (xiter, input) => {
      const value = isKvFormObject(input) ? { [input.k]: input.v } : input;
      xiter.items.unshift(value);
      return xiter;
    },
    [p.result]: value => value
  };

  const iter = iterator(collection, null, true);
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
    // If the collection has finished or if the step function returns a completed object (which take will do after its
    // limit of elements has been reached, for instance), the iteration is finished by calling the result function.
    step() {
      const count = this.items.length;
      while (this.items.length === count) {
        const step = iter.next();
        if (step.done || reduced) {
          xf[p.result](this);
          break;
        }
        reduced = isCompleted(xf[p.step](this, step.value));
      }
    }
  };
}

/**
 * **Transforms the elements of the input collection and reduces them into an output collection.**
 *
 * This is the lowest-level of the transduction functions that is likely to see regular use. It does not assume anything
 * about the reducer, as it asks for it to be passed explicitly. This means that any kind of collection can be produced,
 * since the reducer is not tied to the input collection in any way.
 *
 * `transduce` also will accept an initial value for the resulting collection as the optional last parameter. If this
 * parameter isn't present, then the initial value is determined from the transducer init protocol property on the
 * reducer. Note however that many reducers may not provide an initial value, and in those cases it will *have* to be
 * passed as a parameter.
 *
 * ```
 * const xform = map(x => x + 1);
 *
 * const arrayReducer = {
 *   [protocols.init]() { return []; },
 *   [protocols.result](x) { return x; },
 *   [protocols.step](acc, x) {
 *     acc.push(x);
 *     return acc;
 *   }
 * };
 *
 * const stringReducer = {
 *   [protocols.init]() { return ''; },
 *   [protocols.result](x) { return x; },
 *   [protocols.step](acc, x) { return acc + x; }
 * };
 *
 * let result = transduce([1, 2, 3, 4, 5], xform, arrayReducer);
 * // result = [2, 3, 4, 5, 6]
 *
 * result = transduce([1, 2, 3, 4, 5], xform, stringReducer);
 * // result = '23456'
 *
 * result = transduce('12345', xform, arrayReducer);
 * // result = [2, 3, 4, 5, 6]
 *
 * result = transduce('12345', xform, stringReducer);
 * // result = '23456'
 * ```
 *
 * These examples illustrate a number of important concepts. First of all, the transducer function is independent of the
 * type of the collection; the same transducer function is used no matter the type of input or output collections.
 * Secondly, two reducers are defined. These are objects that conform to the transducer protocol (see the documentation
 * on `{@link module:xduce.protocols}`) and that know how to produce the output collection of choice. In this case, the
 * reducers know how to create new arrays and strings (the `init` protocol) and how to add elements to arrays and
 * strings (the `step` protocol). Because these reducers do have `init` protocol properties, the `transduce` calls do
 * not require explicit initial collections.
 *
 * The final point is that `transduce` can accept any kind of iterable collection, and by passing in the proper reducer,
 * it can produce any kind of output collection. The same `transduce` function and the same map transformer is used in
 * all four examples, despite the input/output combination being different in all four.
 *
 * The `reducer` parameter *can* be a reducer function instead of a reducer object. If this is the case, the `init`
 * parameter is required because a function cannot define an initial value itself.
 *
 * The `init` collection doesn't have to be empty. If it isn't, the elements that are already in it are retained and the
 * transformed input elements are reduced into the collection normally.
 *
 * Of course, the examples are not really necessary - the same thing could be accomplished using
 * `{@link module:xduce.into|into}` without having to create the reducers (strings and arrays passed to
 * `{@link module:xduce.into|into}` as targets know how to reduce themselves already).
 *
 * @memberof module:xduce
 *
 * @param {*} collection The input collection. The only requirement of this collection is that it implement the
 *     `iterator` protocol. Special support is provided by the library for objects and pre-ES2015 arrays and strings
 *     (ES2015 arrays and strings already implement `iterator`), so any of those can also be used.
 * @param {module:xduce~transducerFunction} [xform] A function that creates a transducer object that defines the
 *     transformation being done to the input collection's elements. Any of the
 *     {@link module:xduce.transducers|transducers} in this library can produce a suitable transducer function.
<<<<<<< HEAD
 * @param {object} reducer An object that implements the transducer protocols (`init` is only required if the `init`
 *     parameter is not present). This object must know how to produce an output collection through its `step` and
 *     `result` protocol functions.
 * @param {*} [init] A collection of the same type as the output collection. If this is not present, then the reducer's
=======
 * @param {object|function} reducer Either a function or a reducer object that implements the transducer protocols
 *     (`init` is  only required if the `init` parameter is not present). This object must know how to produce an output
 *     collection through its `step` and `result` protocol functions. If this parameter is a function, then it is turned
 *     into a valid reducer object.
 * @param {*} [init] aAcollection of the same type as the output collection. If this is not present, then the reducer's
>>>>>>> develop
 *     `init` protocol function is called instead to get the initial collection. If it is present and not empty, then
 *     the existing elements remain and the transformed input collection elements are added to it.
 * @return {*} A collection of a type determined by the passed reducer. The elements of this collection are the results
 *     from the transformer function being applied to each element of the input collection.
 */
function transduce(collection, xform, reducer, init) {
  const r = isFunction(reducer) ? toReducer(reducer) : reducer;
  const i = init === undefined ? r[p.init]() : init;
  const xf = xform ? xform(r) : r;
  return reduce(collection, xf, i);
}

/**
 * **Transforms the elements of the input collection and reduces them into a new array.**
 *
 * The transformer is optional. If it isn't present, this function just converts the input collection into an array.
 *
 * ```
 * const xform = map(x => x + 1);
 *
 * let result = asArray([1, 2, 3, 4, 5], xform);
 * // result = [2, 3, 4, 5, 6]
 *
 * result = asArray('12345', xform);
 * // result = [2, 3, 4, 5, 6]
 *
 * result = asArray('12345');
 * // result = [1, 2, 3, 4, 5]
 *
 * result = asArray({a: 1, b: 2});
 * // result = [{a: 1}, {b: 2}]
 * ```
 *
 * @memberof module:xduce
 *
 * @param {*} collection The input collection. The only requirement of this collection is that it implement the
 *     `iterator` protocol. Special support is provided by the library for objects and pre-ES2015 arrays and strings
 *     (ES2015 arrays and strings already implement `iterator`), so any of those can also be used.
 * @param {module:xduce~transducerFunction} [xform] A function that creates a transducer object that defines the
 *     transformation being done to the input collection's elements. Any of the
 *     {@link module:xduce.transducers|transducers} in this library can produce a suitable transducer function. If this
 *     isn't present, the input collection will simply be reduced into an array without transformation.
 * @return {array} An array containing all of the transformed values from the input collection elements.
 */
function asArray(collection, xform) {
  return transduce(collection, xform, arrayReducer);
}

/**
 * **Transforms the elements of the input collection and reduces them into a new object.**
 *
 * The transformer is optional. If it isn't present, this function just converts the input collection into an object.
 *
 * ```
 * const xform = map(({ k, v }) => ({ [k]: v + 1 }));
 *
 * let result = asObject({a: 1, b: 2}, xform);
 * // result = {a: 2, b: 3}
 *
 * result = asObject([{a: 1}, {b: 2}], xform);
 * // result = {a: 2, b: 3}
 *
 * result = asObject([1, 2, 3, 4, 5]);
 * // result = {0: 1, 1: 2, 2: 3, 3: 4, 4: 5}
 *
 * result = asObject('hello');
 * // result = {0: 'h', 1: 'e', 2: 'l', 3: 'l', 4: 'o'}
 * ```
 *
 * @memberof module:xduce
 *
 * @param {*} collection The input collection. The only requirement of this collection is that it implement the
 *     `iterator` protocol. Special support is provided by the library for objects and pre-ES2015 arrays and strings
 *     (ES2015 arrays and strings already implement `iterator`), so any of those can also be used.
 * @param {module:xduce~tranducerFunction} [xform] A function that creates a transducer object that defines the
 *     transformation being done to the input collection's elements. Any of the
 *     {@link module:xduce.transducers|transducers} in this library can produce a suitable transducer function. If this
 *     isn't present, the input collection will simply be reduced into an object without transformation.
 * @return {object} An object containing all of the transformed values from the input collection elements.
 */
function asObject(collection, xform) {
  return transduce(collection, xform, objectReducer);
}

/**
 * **Transforms the elements of the input collection and reduces them into a new string.**
 *
 * The transformer is optional. If it isn't present, this function just converts the input collection into an string.
 *
 * ```
 * const xform = map(x => x.toUpperCase());
 *
 * let result = asString('hello', xform);
 * // result = 'HELLO'
 *
 * result = asString(['h', 'e', 'l', 'l', 'o'], xform);
 * // result = 'HELLO'
 *
 * result = asString([1, 2, 3, 4, 5]);
 * // result = '12345'
 *
 * result = asString({a: 1, b: 2});
 * // result = '12'
 * ```
 *
 * @memberof module:xduce
 *
 * @param {*} collection The input collection. The only requirement of this collection is that it implement the
 *     `iterator` protocol. Special support is provided by the library for objects and pre-ES2015 arrays and strings
 *     (ES2015 arrays and strings already implement `iterator`), so any of those can also be used.
 * @param {module:xduce~transducerFunction} [xform] A function that creates a transducer object that defines the
 *     transformation being done to the input collection's elements. Any of the
 *     {@link module:xduce.transducers|transducers} in this library can produce a suitable transducer function. If this
 *     isn't present, the input collection will simply be reduced into a string without transformation.
 * @return {string} A string containing all of the transformed values from the input collection elements.
 */
function asString(collection, xform) {
  return transduce(collection, xform, stringReducer);
}

/**
 * **Transforms the elements of the input collection and reduces them into a new iterator.**
 *
 * The transformer is optional. If it isn't present, this function just converts the input collection into an iterator.
 *
 * *(The results here are shown passed through `asArray` because there's no literal interpretation of an iterator to
 * show. The `asArray` calls are for demonstration purposes only.)*
 *
 * ```
 * const xform = map(x => x + 1);
 * function* five() {
 *   for (let i = 1; i <= 5; ++i) {
 *     yield i;
 *   }
 * };
 *
 * let result = asIterator(five(), xform);
 * // asArray(result) = [2, 3, 4, 5, 6]
 *
 * result = asIterator([1, 2, 3, 4, 5], xform);
 * // asArray(result) = [2, 3, 4, 5, 6]
 *
 * result = asIterator([1, 2, 3, 4, 5]);
 * // asArray(result) = [1, 2, 3, 4, 5]
 *
 * result = asIterator({a: 1, b: 2});
 * // asArray(result) = [{a: 1}, {b: 2}]
 * ```
 *
 * @memberof module:xduce
 *
 * @param {*} collection The input collection. The only requirement of this collection is that it implement the
 *     `iterator` protocol. Special support is provided by the library for objects and pre-ES2015 arrays and strings
 *     (ES2015 arrays and strings already implement `iterator`), so any of those can also be used.
 * @param {module:xduce~transducerFunction} [xform] A function that creates a transducer object that defines the
 *     transformation being done to the input collection's elements. Any of the
 *     {@link module:xduce.transducers|transducers} in this library can produce a suitable transducer function. If this
 *     isn't present, the input collection will simply be reduced into an iterator without transformation.
 * @return {module:xduce~iterator} An iterator containing all of the transformed values from the input collection
 *     elements.
 */
function asIterator(collection, xform) {
  return xform ? transducingIterator(collection, xform) : iterator(collection);
}

/**
 * **Transforms the elements of the input collection and reduces them into a new collection of the same type.**
 *
 * This is the highest level of the three main transduction functions (`sequence`, `{@link module:xduce.into|into}`,
 * and `{@link module:xduce.transduce|transduce}`). It creates a new collection of the same type as the input collection
 * and reduces the transformed elements into it. Additionally, unlike `{@link module:xduce.into|into}` and
 * `{@link module:xduce.transduce|transduce}`, this function is capable of producing an iterator (as long as the input
 * is an iterator).
 *
 * The input collection must not only implement the `iterator` protocol (as in the last two functions) but also the
 * `init`, `result`, and `step` transducer protocols. Special support is provided for arrays, strings, objects, and
 * iterators, so they need not implement any protocol.
 *
 * The obvious limitation of this function is that the type of output collection cannot be chosen. Since it is always
 * the same as the input collection, this function cannot be used to convert a collection into a different type.
 *
 * ```
 * const xform = map(x => x + 1);
 *
 * let result = sequence([1, 2, 3, 4, 5], xform);
 * // result = [2, 3, 4, 5, 6]
 *
 * result = sequence('12345', xform);
 * // result = '23456'
 * ```
 *
 * These examples are identical to two of the four examples from the `asX` functions. The other two examples are not
 * possible with `sequence` because they have different input and output collection types.
 *
 * @memberof module:xduce
 *
 * @param {*} collection The input collection. This must implement the `iterator`, `init`, `result`, and `step`
 *     protocols. Special support is provided for arrays, strings, objects, and iterators, so they do not have to
 *     implement any protocols.
 * @param {module:xduce~transducerFunction} xform A function that creates a transducer object that defines the
 *     transformation being done to the input collection's elements. Any of the
 *     {@link module:xduce.transducers|transducers} in this library can produce a suitable transducer function.
 * @return {*} A collection of the same type as the input collection, containing all of the transformed values from the
 *     input collection elements.
 */
function sequence(collection, xform) {
  switch (true) {
    case isArray(collection):
      return asArray(collection, xform);
    case isObject(collection):
      return asObject(collection, xform);
    case isString(collection):
      return asString(collection, xform);
    case isImplemented(collection, 'step'):
      return transduce(collection, xform, collection);
    case isImplemented(collection, 'iterator'):
      return asIterator(collection, xform);
    default:
      throw Error(`Cannot sequence collection: ${collection}`);
  }
}

/**
 * **Transforms the elements of the input collection and reduces them into the target collection.**
 *
 * This is much like `{@link module:xduce.transduce|transduce}`, except that instead of explicitly providing a reducer
 * (and perhaps an initial collection), the target collection acts as a reducer itself. This requires that the
 * collection implement the `init`, `result`, and `step` transducer protocol functions.
 *
 * If no transducer function is provided, the input collection elements are reduced into the target collection without
 * being transformed. This can be used to convert one kind of collection into another.
 *
 * ```
 * const xform = map(x => x + 1);
 *
 * let result = into([], [1, 2, 3, 4, 5], xform);
 * // result = [2, 3, 4, 5, 6]
 *
 * result = into('', [1, 2, 3, 4, 5], xform);
 * // result = '23456'
 *
 * result = into([], '12345', xform);
 * // result = [2, 3, 4, 5, 6]
 *
 * result = into('', '12345', xform);
 * // result = '23456'
 * ```
 *
 * These examples are exactly equivalent to the four examples under `{@link module:xduce.transduce|transduce}`, but
 * using `into` instead.
 *
 * @memberof module:xduce
 *
 * @param {*} target The collection into which all of the transformed input collection elements will be reduced. This
 *     collection must implement the `init`, `result`, and `step` protocol functions from the transducer protocol.
 *     Special support is provided for arrays, strings, and objects, so they need not implement the protocol.
 * @param {*} collection The input collection. The only requirement of this collection is that it implement the
 *     `iterator` protocol. Special support is provided by the library for objects and pre-ES2015 arrays and strings
 *     (ES2015 arrays and strings already implement `iterator`), so any of those can also be used.
 * @param {module:xduce~transducerFunction} [xform] A function that creates a transducer object that defines the
 *     transformation being done to the input collection's elements. Any of the
 *     {@link module:xduce.transducers|transducers} in this library can produce a suitable transducer function. If this
 *     isn't present, the input collection will simply be reduced into the target collection without transformation.
 * @return {*} The `target` collection, with all of the tranformed input collection elements reduced onto it.
 */
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

/**
 * **Composes two or more transducer functions into a single transducer function.**
 *
 * Each function that takes a transducer function (`{@link module:xduce.sequence|sequence}`,
 * `{@link module:xduce.into|into}`, etc.) is only capable of accepting one of them. If there is a need to have
 * several transducers chained together, then use `compose` to create a transducer function that does what all of them
 * do.
 *
 * This operates only on {@link module:xduce~transducerFunction|transducer functions}, not on
 * {@link module:xduce~transducer|transducers} themselves. There is no option for a shortcut form on a composed
 * transducer function. They must be passed to functions that operate on them (`{@link module:xduce.sequence|sequence}`
 * and the like).
 *
 * NOTE: In functional programming, a compose function is generally ordered so that the first-executed function is
 * listed last. This is done in the opposite way, with the first transducer executing first, etc. This is more sensible
 * for transducer functions.
 *
 * ```
 * const add1 = x => x + 1;
 * const odd = x => x % 2 !== 0;
 *
 * const xform = compose(map(add1), filter(odd), take(3));
 *
 * const result = sequence([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], xform);
 * // result = [3, 5, 7];
 * ```
 *
 * @memberof module:xduce
 *
 * @param {...module:xduce~transducerFunction} fns One or more function that each create a transducer object that
 *     defines the transformation being done to a collection's elements. Any of the
 *     {@link module:xduce.transducers|transducers} in this library can produce a suitable transducer function.
 * @return {module:xduce~transducerFunction} A transducer function that produces a transducer object that performs
 *     *all* of the transformations of the objects produced by the input transducer functions.
 */
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
  sequence,
  into,
  compose
};
