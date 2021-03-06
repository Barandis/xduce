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
 * Functions that deal with iteration - the first step in transduction, which is taking the input collection and
 * breaking it into its component parts.
 *
 * Iteration is the simplest to deal with because it's already well-supported natively by JavaScript. This file is
 * largely dedicated to implementing consistent iteration in pre-ES2015 environments, as well as adding iteration
 * possibilities for those objects not already supported natively.
 *
 * @module iteration
 * @private
 */

const { bmpCharAt, bmpLength, isArray, isFunction, isObject, isString } = require('./util');
const { protocols, isImplemented } = require('./protocol');
const p = protocols;

/**
 * Creates an iterator over strings. ES2015 strings already satisfy the iterator protocol, so this function will not
 * be used for them. This is for ES5 strings where the iterator protocol doesn't exist. As with ES2015 iterators, it
 * takes into account double-width BMP characters and will return the entire character as a two-character string.
 *
 * @private
 *
 * @param {string} str The string to be iterated over.@author [author]
 * @return {module:xduce~iterator} An iterator that returns one character per call to `next`.
 */
function stringIterator(str) {
  let index = 0;
  return {
    next() {
      return index < bmpLength(str)
        ? {
            value: bmpCharAt(str, index++),
            done: false
          }
        : {
            done: true
          };
    }
  };
}

/**
 * Creates an iterator over strings. ES2015 strings already satisfy the iterator protocol, so this function will not
 * be used for them. This is for ES5 strings where the iterator protocol doesn't exist.
 *
 * @private
 *
 * @param {array} array The array to be iterated over.
 * @return {module:xduce~iterator} An iterator that returns one element per call to `next`.
 */
function arrayIterator(array) {
  let index = 0;
  return {
    next() {
      return index < array.length
        ? {
            value: array[index++],
            done: false
          }
        : {
            done: true
          };
    }
  };
}

/**
 * Creates an iterator over objcts.
 *
 * Objects are not generally iterable, as there is no defined order for an object, and each "element" of an object
 * actually has two values, unlike any other collection (a key and a property). However, it's tremendously useful to
 * be able to use at least some transformers with objects as well. This iterator adds support in two different
 * ways to make that possible.
 *
 * The first is that a sort order is defined. Quite simply, it's done alphabetically by key. There is also an option -
 * through the second parameter `sort` - to provide a different sort function. This should be a function in the style
 * of `Array.prototype.sort`, where two parameters are compared and -1 is returned if the first is larger, 1 is returned
 * if the second is larger, and 0 is returned if they're equal. This is applied ONLY TO THE KEYS of the object. If you
 * wish to sort on values, consider iterating into an array and then sorting the elements by value.
 *
 * In the public API, this sort function can only be passed through the `{@link module:xduce.iterator|iterator}`
 * function. If you  wish to use an object sorted in a non-default order, you should create an iterator out of it and
 * transform that iterator. For example:
 *
 * | DEFAULT ORDER                        | CUSTOM ORDER                                         |
 * | ------------------------------------ | ---------------------------------------------------- |
 * | `var result = sequence(obj, xform);` | `var result = asObject(iterator(obj, sort), xform);` |
 *
 * The second support feature is the alternative "kv-form" objects. A reasonable way to iterate over objects would be to
 * produce single-property objects, one per property on the original object (i.e., `{a: 1, b: 2}` would become two
 * elements: `{a: 1}` and `{b: 2}`). This is fine for straight iteration and reduction, but it can present a challenge
 * to use a transformer with. Consider this example code, which uppercases the key and adds one to the value.
 *
 * ```
 * function doObjectSingle(obj) {
 *   var key = Object.keys(obj)[0];
 *   var result = {};
 *   result[key.toUpperCase()] = obj[key] + 1;
 *   return result;
 * }
 * ```
 *
 * This is a little unwieldy, so the iterator provides for another kind of iteration. Setting the third parameter,
 * `kv`, to `true` (which is the default), objects will be iterated into two-property objects with `k` and `v` as the
 * property names. For example, `{a: 1, b: 2}` will become two elements: `{k: 'a', v: 1}` and `{k: 'b', v: 2}`. This
 * turns the mapping function shown above into something simpler.
 *
 * ```
 * function doObjectKv(obj) {
 *   var result = {};
 *   result[obj.k.toUpperCase()]: obj.v + 1;
 *   return result;
 * }
 * ```
 *
 * This is the default iteration form for objects internally. If you want to iterate an object into the `{key: value}`
 * form, for which you would have to use the `doObjectSingle` style transformer, you must call
 * `{@link module:xduce.iterator|iterator}` with the third parameter explicitly set to `false` and then pass that
 * iterator to the transducing function. This is availabe in particular for those writing their own transducers.
 *
 * Still, while this is nice, we can do better. The built-in reducers for arrays, objects, strings, and iterators
 * recognize the kv-form and know how to reduce it back into a regular key-value form for output. So instead of that
 * first `doObjectKv`, we could write it this way.
 *
 * ```
 * function doObjectKvImproved(obj) {
 *   return {k: obj.k.toUpperCase(), v: obj.v + 1};
 * }
 * ```
 *
 * The reducer will recognize the form and reduce it correctly. The upshot is that in this library, `doObjectKv` and
 * `doObjectKvImproved` will produce the SAME RESULT. Which function to use is purely a matter of preference. IMPORTANT
 * NOTE: If you're adding transducer support to non-supported types, remember that you must decide whether to have your
 * `step` function recognize kv-form objects and reduce them into key-value. If you don't, then the style of
 * `doObjectKvImproved` will not be available.
 *
 * ANOTHER IMPORTANT NOTE: The internal reducers recognize kv-form very explicitly. The object must have exactly two
 * enumerable properties, and those properties must be named 'k' and 'v'. This is to reduce the chance as much as
 * possible of having errors because an object that was meant to be two properties was turned into one. (It is possible
 * to have a transformation function return an object of more than one property; if that happens, and if that object is
 * not a kv-form object, then all of the properties will be merged into the final object.)
 *
 * One final consideration: you have your choice of mapping function styles, but the better choice may depend on
 * language. The above examples are in ES5. If you're using ES2015, however, you have access to destructuring and
 * dynamic object keys. That may make `doObjectKv` look better, because with those features it can be written like this:
 *
 * ```
 * doObjectKv = ({k, v}) => {[k.toUpperCase()]: v + 1};
 * ```
 *
 * And that's about as concise as it gets. Note that some languages that compile into JavaScript, like CoffeeScript and
 * LiveScript, also support these features.
 *
 * @private
 *
 * TL;DR:
 * 1. Iteration order of objects is alphabetical by key, though that can be changed by passing a sort function to
 *    `{@link module:xduce.iterator|iterator}`.
 * 2. Iteration is done internally in kv-form.
 * 3. Transformation functions can output objects in key-value, which is easier in ES2015.
 * 4. Transformation functions can output objects in kv-form, which is easier in ES5.
 * @param {object} obj The object to iterate over.
 * @param {module:xduce~sort} [sort] An optional sort function. This is applied to the keys of the object to
 *     determine the order of iteration.
 * @param {boolean} [kv=false] Whether or not this object should be iterated into kv-form (if false, it remains in the
 *     normal key-value form).
 * @return {module:xduce~iterator} An iterator that returns one key-value pair per call to `next`.
 */
function objectIterator(obj, sort, kv = false) {
  let keys = Object.keys(obj);
  keys = typeof sort === 'function' ? keys.sort(sort) : keys.sort();
  let index = 0;

  return {
    next() {
      if (index < keys.length) {
        const k = keys[index++];
        const value = {};
        if (kv) {
          value.k = k;
          value.v = obj[k];
        } else {
          value[k] = obj[k];
        }
        return {
          value,
          done: false
        };
      }
      return {
        done: true
      };
    }
  };
}

/**
 * Creates an iterator that runs a function for each `next` value.
 *
 * The function in question is provided two arguments: the current 0-based index (which starts at `0` and increases by
 * one for each run) and the return value for the prior calling of the function (which is `undefined` if the function
 * has not yet been run). The return value of the function is used as the value that comes from `next` the next time
 * it's called.
 *
 * If the function returns `undefined` at any point, the iteration terminates there and the `done` property of the
 * object returned with the next call to `next` becomes `true`.
 *
 * @private
 *
 * @param {function} fn A function that is run once for each step of the iteration. It is provided two arguments: the
 *     `0`-based index of that run (starts at `0` and increments each run) and the return value of the last call to the
 *     function (`undefined` if it hasn't been called yet). If the function returns `undefined` at any point, the
 *     iteration terminates.
 * @return {function} A generator wrapping `fn`, which is suitable for use as an iterator.
 */
function functionIterator(fn) {
  return function* () {
    let current;
    let index = 0;

    for (;;) {
      current = fn(index++, current);
      if (current === undefined) {
        break;
      }
      yield current;
    }
  }();
}

/**
 * Determines whether an object is in kv-form. This used by the reducers that must recognize this form and reduce those
 * elements back into key-value form.
 *
 * This determination is made by simply checking that the object has exactly two properties and that they are named
 * `k` and `v`.
 *
 * @private
 *
 * @param {object} obj The object to be tested.
 * @return {boolean} Either `true` if the object is in kv-form or `false` if it isn't.
 */
function isKvFormObject(obj) {
  const keys = Object.keys(obj);
  if (keys.length !== 2) {
    return false;
  }
  return !!~keys.indexOf('k') && !!~keys.indexOf('v');
}

/**
 * **Creates an iterator over the provided collection.**
 *
 * For collections that are not objects, it's as simple as that. Pass in the collection, get an iterator over that
 * collection.
 *
 * ```
 * const iter = iterator([1, 2, 3]);
 * iter.next().value === 1;     // true
 * iter.next().value === 2;     // true
 * iter.next().value === 3;     // true
 * iter.next().done === true;   // true
 * ```
 *
 * Objects get special support though, as noted in the section above on iterating over objects. Objects are iterated in
 * alphabetical order by key, unless a second parameter is passed to `iterator`. This must be a function that takes two
 * parameters (which will be object keys) and returns `-1` if the first is less than the second, `1` if the second is
 * less than the first, and `0` if they're equal.
 *
 * Also, `iterator` by default iterates objects into key/value form. However, if a third parameter of `true` is passed,
 * it will instead render the object in kv-form. This is the form used internally when a transducer is invoked.
 *
 * The second and third parameters are ignored if the input collection is not an object.
 *
 * ```
 * const iter = iterator({ b: 2, a: 4 });
 * iter.next().value.a === 4;     // true
 * iter.next().value.b === 2;     // true
 * iter.next().done === true;     // true
 *
 * const kvIter = iterator({ b: 2, a: 4 }, null, true);
 * const { k: k1, v: v1 } = kvIter.next().value;
 * k1 === 'a' && v1 === 4;        // true
 * const { k: k2, v: v2 } = kvIter.next().value;
 * k2 === 'b' && v2 === 2;        // true
 * iter.next().done === true;     // true
 * ```
 *
 * Note that if this function is passed an object that looks like an iterator (an object that has a `next` function),
 * the object itself is returned. It is assumed that a function called `next` conforms to the iteration protocol.
 *
 * If this function is provided a *function* as its first argument, an iterator is returned which runs that function
 * one time for each call to `next`. That function is provided two arguments: the index of the call (starting at `0`
 * for the first time it's called and increasing by 1 per invocation after that) and the return value of the previous
 * call to the function (starting at `undefined` for the first run before the function is ever called). If the function
 * ever returns `undefined`, the iterator will terminate and set the `done` property of its return value to `true` at
 * that point.
 *
 * Note that since the initial value of the second argument is `undefined`, using default arguments is an excellent way
 * of providing the function an initial value.
 *
 * ```
 * const constIter = iterator(() => 6);  // Bert's favorite number
 * constIter.next().value === 6;   // true
 * constIter.next().value === 6;   // true;
 * // This will go on forever, as long as `next` keeps getting called
 *
 * const indexIter = iterator(x => x * x);
 * indexIter.next().value === 0;   // true
 * indexIter.next().value === 1;   // true
 * indexIter.next().value === 4;   // true
 * indexIter.next().value === 9;   // true
 * // Again, this will go on forever, or until the numbers get to big JS to handle
 *
 * // Using default value on `last` parameter for initial value
 * const lastIter = iterator((index, last = 1) => last * (index + 1));  // Factorial
 * lastIter.next().value === 1;    // true
 * lastIter.next().value === 2;    // true
 * lastIter.next().value === 6;    // true
 * lastIter.next().value === 24;   // true
 * // Again, forever, though factorials get big quickly
 *
 * // This iterator will terminate when the function returns `undefined`
 * const stopIter = iterator(x => x < 2 ? x : undefined);
 * stopIter.next().value === 0;    // true
 * stopIter.next().value === 1;    // true
 * stopIter.next().done === true;  // true
 * ```
 *
 * @memberof module:xduce
 *
 * @param {*} obj The value to be iterated over.
 * @param {module:xduce~sort} [sort] A function used to determine the sorting of keys for an object iterator. It has
 *     no effect when iterating over anything that is not a plain object.
 * @param {boolean} [kv=false] Whether an object should be iterated into kv-form. This is only relevant when iterating
 *     over an object; otherwise its value is ignored.
 * @return {module:xduce~iterator} An iterator over the provided value. If the value is not iterable (it's not an
 *     array, object, or string, and it doesn't have a protocol-defined iterator), `null` is returned.
 */
function iterator(obj, sort, kv) {
  switch (true) {
    case isFunction(obj[p.iterator]):
      return obj[p.iterator]();
    case isFunction(obj.next):
      return obj;
    case isFunction(obj):
      return functionIterator(obj);
    case isString(obj):
      return stringIterator(obj);
    case isArray(obj):
      return arrayIterator(obj);
    case isObject(obj):
      return objectIterator(obj, sort, kv);
    default:
      return null;
  }
}

/**
 * Determines whether the passed object is iterable, in terms of what 'iterable' means to this library. In other words,
 * objects and ES5 arrays and strings will return `true`, as will objects with a `next` function. For that reason this
 * function is only really useful within the library and therefore isn't exported.
 *
 * @private
 *
 * @param {*} obj The value to test for iterability.
 * @return {boolean} Either `true` if the value is iterable (`{@link module:xduce.iterator}` will return an iterator
 *     for it) or `false` if it is not.
 */
function isIterable(obj) {
  return isImplemented(obj, 'iterator') || isString(obj) || isArray(obj) || isObject(obj);
}

module.exports = {
  isKvFormObject,
  iterator,
  isIterable
};
