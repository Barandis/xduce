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
// iteration.js
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const {
  bmpCharAt,
  bmpLength,
  isArray,
  isFunction,
  isObject,
  isString
} = require('./util');

const { protocols, isImplemented } = require('./protocol');
const p = protocols;

// An iterator over strings. As of ES6 strings already satisfy the iterator protocol, so this is for pre-ES6
// environments where the iterator protocol doesn't exist. Like ES6 iterators, it takes into account double-wide Basic
// Multilingual Plane characters and will return the entire character as a two-character string.
function stringIterator(str) {
  let index = 0;
  return {
    next() {
      return index < bmpLength(str) ? {
        value: bmpCharAt(str, index++),
        done: false
      } : {
        done: true
      };
    }
  };
}

// An iterator over arrays. ES6 arrays already satisfy the iterator protocol, so this is intended to make pre-ES6
// arrays iterable.
function arrayIterator(array) {
  let index = 0;
  return {
    next() {
      return index < array.length ? {
        value: array[index++],
        done: false
      } : {
        done: true
      };
    }
  };
}

// Objects are not generally iterable, as there is no defined order for an object, and each "element" of an object
// actually has two values, unlike any other collection (a key and a property). However, it's tremendously useful to
// be able to use at least some transformers with objects as well. This iterator adds support in two different
// ways to make that possible.
//
// The first is that a sort order is defined. Quite simply, it's done alphabetically by key. There is also an option -
// through the second parameter `sort` - to provide a different sort function. This should be a function in the style
// of `Array.prototype.sort`, where two parameters are compared and -1 is returned if the first is larger, 1 is returned
// if the second is larger, and 0 is returned if they're equal. This is applied ONLY TO THE KEYS of the object. If you
// wish to sort on values, consider iterating into an array and then sorting the elements by value.
//
// In the public API, this sort function can only be passed through the `iterator` function. If you wish to use an
// object sorted in a non-default order, you should create an iterator out of it and transform that iterator. For
// example:
//
// DEFAULT ORDER                               CUSTOM ORDER
// var result = sequence(obj, xform);          var result = asObject(iterator(obj, sort), xform);
//
// The second support feature is the alternative "kv-form" objects. A reasonable way to iterate over objects would be to
// produce single-property objects, one per property on the original object (i.e., {a: 1, b: 2} would become two
// elements: {a: 1} and {b: 2}). This is fine for straight iteration and reduction, but it can present a challenge to
// use a transformer with. Consider this example code, which uppercases the key and adds one to the value.
//
// function doObjectSingle(obj) {
//   var key = Object.keys(obj)[0];
//   var result = {};
//   result[key.toUpperCase()] = obj[key] + 1;
//   return result;
// }
//
// This is a little unwieldy, so the iterator provides for another kind of iteration. Setting the third parameter,
// `kv`, to `true` (which is the default), objects will be iterated into two-property objects with `k` and `v` as the
// property names. For example, {a: 1, b: 2} will become two elements: {k: 'a', v: 1} and {k: 'b', v: 2}. This turns the
// mapping function shown above into something simpler.
//
// function doObjectKv(obj) {
//   var result = {};
//   result[obj.k.toUpperCase()]: obj.v + 1;
//   return result;
// }
//
// This is the default iteration form for objects internally. If you want to iterate an object into the {key: value}
// form, for which you would have to use the `doObjectSingle` style transformer, you must call `iterator` with the
// third parameter explicitly set to `false` and then pass that iterator to the transducing function. This is availabe
// in particular for those writing their own transducers.
//
// Still, while this is nice, we can do better. The built-in reducers for arrays, objects, strings, and iterators
// recognize the kv-form and know how to reduce it back into a regular key-value form for output. So instead of that
// first `doObjectKv`, we could write it this way.
//
// function doObjectKvImproved(obj) {
//   return {k: obj.k.toUpperCase(), v: obj.v + 1};
// }
//
// The reducer will recognize the form and reduce it correctly. The upshot is that in this library, `doObjectKv` and
// `doObjectKvImproved` will produce the SAME RESULT. Which function to use is purely a matter of preference. IMPORTANT
// NOTE: If you're adding transducer support to non-supported types, remember that you must decide whether to have your
// `step` function recognize kv-form objects and reduce them into key-value. If you don't, then the style of
// `doObjectKvImproved` will not be available.
//
// ANOTHER IMPORTANT NOTE: The internal reducers recognize kv-form very explicitly. The object must have exactly two
// enumerable properties, and those properties must be named 'k' and 'v'. This is to reduce the chance as much as
// possible of having errors because an object that was meant to be two properties was turned into one. (It is possible
// to have a transformation function return an object of more than one property; if that happens, and if that object is
// not a kv-form object, then all of the properties will be merged into the final object.)
//
// One final consideration: you have your choice of mapping function styles, but the better choice may depend on
// language. The above examples are in ES5. If you're using ES6, however, you have access to destructuring and dynamic
// object keys. That may make `doObjectKv` look better, because with those features it can be written like this:
//
// doObjectKv = ({k, v}) => {[k.toUpperCase()]: v + 1};
//
// And that's about as concise as it gets. Note that some languages that compile into JavaScript, like CoffeeScript and
// LiveScript, also support these features.
//
// TL;DR:
// 1. Iteration order of objects is alphabetical by key, though that can be changed by passing a sort funciton to
//    `iterator`.
// 2. Iteration is done internally in kv-form.
// 3. Transformation functions can output objects in key-value, which is easier in ES6.
// 4. Transformation functions can output objects in kv-form, which is easier in ES5.
function objectIterator(obj, sort, kv = true) {
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

// Determines whether an object is in kv-form. This used by the reducers that must recognize this form and reduce those
// elements back into key-value form.
function isKvFormObject(obj) {
  const keys = Object.keys(obj);
  if (keys.length !== 2) {
    return false;
  }
  return !!~keys.indexOf('k') && !!~keys.indexOf('v');
}

// Creates an iterator for the supplied object. An iterator, as per the protocol, is an object with a `next` function
// that returns elements of that object one at a time in a specific format. This will either be the return value of the
// function that implements the iterator protocol on the object, the object itself if it has a `next` method, or custom
// iterators for pre-protocol arrays and objects. If none of these are relevant, `null` is returned.
//
// IMPORTANT: if there is no iterator protocol but there is an iterator pseudo-protocol (i.e., there is a `next`
// property), then the passed object is already an iterator and is returned. Otherwise, the iterator that is returned
// is a NEW iterator each time the call is made.
function iterator(obj, sort, kv) {
  switch (true) {
    case isFunction(obj[p.iterator]): return obj::obj[p.iterator]();
    case isFunction(obj.next):        return obj;
    case isString(obj):               return stringIterator(obj);
    case isArray(obj):                return arrayIterator(obj);
    case isObject(obj):               return objectIterator(obj, sort, kv);
    default:                          return null;
  }
}

// Determines whether the passed object is iterable, in terms of what 'iterable' means to this library. In other words,
// objects and ES5 arrays and strings will return `true`, as will objects with a `next` function. For that reason this
// function is only really useful within the library and therefore isn't exported.
function isIterable(obj) {
  return isImplemented(obj, 'iterator') || isString(obj) || isArray(obj) || isObject(obj);
}

module.exports = {
  isKvFormObject,
  iterator,
  isIterable
};
