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
 * The central module that brings all of the separate parts of the library together into a public API. Everything
 * publicly available is available through this module or one of its child modules.
 *
 * All of the functions in this module deal directly with transducers. But first, let's talk about the protocols that
 * are going to be referred to throughout many of the function discussions.
 *
 * ## Protocols
 *
 * One of the key selling points for transducers is that the same transducer can be used on any type of collection.
 * Rather than having to write a new `map` function (for example) for every kind of collection - one for an array, one
 * for a string, one for an iterator, etc. - there is a single `map` transducer that will work with all of them, and
 * potentially with *any* kind of collection. This is possible implementing *protocols* on the collections.
 *
 * A protocol in JavaScript is much like an interface in languages like Java and C#. It is a commitment to providing a
 * certain functionality under a certain name. ES2015 has seen the introduction of an `iterator` protocol, for example,
 * and language support for it (the new `for...of` loop can work with any object that correctly implements the
 * `iterator` protocol).
 *
 * To support transduction, Xduce expects collections to implement four protocols.
 *
 * - `iterator`: a function that returns an iterator (this one is built in to ES6 JavaScript)
 * - `transducer/init`: a function that returns a new, empty instance of the output collection
 * - `transducer/step`: a function that takes an accumulator (the result of the reduction so far) and the next input
 *   value, and then returns the accumulator with the next input value added to it
 * - `transducer/result`: a function that takes the reduced collection and returns the final output collection
 *
 * `iterator` is the built-in JavaScript protocol. When called, it is expected to return an iterator over the
 * implementing collection. This iterator is an object that has a `next` function. Each call to `next` is expected to
 * return an object with `value` and `done` properties, which respectively hold the next value of the iterator and a
 * boolean to indicate whether the iteration has reached its end. (This is a simplified explanation; see
 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators|this MDN page} for more
 * detailed information.)
 *
 * `transducer/init` (referred to from now on as `init`) should be a function that takes no parameters and returns a
 * new, empty instance of the output collection. This is the function that defines how to create a new collection of the
 * correct type.
 *
 * `transducer/step` (referred to from now on as `step`) should be a function that takes two parameters. These
 * parameters are the result of the reduction so far (and so is a collection of the output type) and the next value from
 * the input collection. It must return the new reduction result, with the next value incorporated into it. This is the
 * function that defines how reduce a value onto the collection.
 *
 * `transducer/result` (referred to from now on as `result`) should be a function that takes one parameter, which is the
 * fully reduced collection. It should return the final output collection. This affords a chance to make any last-minute
 * adjustments to the reduced collection before returning it.
 *
 * Arrays, strings, and objects are all given support for all of these protocols. Other collections will have to provide
 * their own (though it should be noted that since `iterator` is built-in, many third-party collections will already
 * implement this protocol). As an example, let's add transducer support to a third-party collection, the
 * `Immutable.List` collection from {@link https://facebook.github.io/immutable-js/|immutable-js}.
 *
 * ```
 * Immutable.List.prototype[protocols.init] = () => Immutable.List().asMutable();
 * Immutable.List.prototype[protocols.step] = (acc, input) => acc.push(input);
 * Immutable.List.prototype[protocols.result] = (value) => value.asImmutable();
 * ```
 *
 * `Immutable.List` already implements `iterator`, so we don't have to do it ourselves.
 *
 * The `init` function returns an empty mutable list. This is important for immutable-js because its default lists are
 * immutable, and immutable lists mean that a new list has to be created with every reduction step. It would work fine,
 * but it's quite inefficient.
 *
 * The `step` function adds the next value to the already-created list. `Immutable.List` provides a `push` function that
 * works like an array's `push`, except that it returns the new list with the value pushed onto it. This is perfect for
 * our `step` function.
 *
 * The `result` function converts the now-finished mutable list into an immutable one, which is what's going to be
 * expected if we're transducing something into an `Immutable.List`. In most cases, `result` doesn't have to do any
 * work, but since we're creating an intermediate representation of our collection type here, this lets us create the
 * collection that we actually want to output. (Without `result`, we would have to use immutable lists all the way
 * through, creating a new one with each `step` function, since we wouldn't be able to make this converstion at the
 * end.)
 *
 * With those protocols implemented on the prototype, `Immutable.List` collections can now support any transduction we
 * can offer.
 *
 * ### Protocols
 *
 * After talking a lot about protocols and showing how they're properties added to an object, it's probably pretty
 * obvious that there's been no mention of what the actual names of those properties are. That's what
 * `{@link module:xduce.protocols|protocols}` is for.
 *
 * `{@link module:xduce.protocols|protocols}` means that the actual names aren't important, which is good because the
 * name might vary depending on whether or not the JavaScript environment has symbols defined. That unknown quantity can
 * be abstracted away by using the properties on the `{@link module:xduce.protocols|protocols}` object as property keys.
 * (Besides, the actual name of the protocol will either be a `Symbol` for the name of the protocol or a string like
 * `'@@transducer/init'`, depending on whether `Symbol`s are available, and those aren't a lot of fun to work with.)
 *
 * The best way to use these keys can be seen in the immutable-js example above. Instead of worrying about the name of
 * the key for the `init` protocol, the value of `protocols.init` is used.
 *
 * `{@link module:xduce.protocols|protocols}` defines these protocol property names.
 *
 * - `iterator`: if this is built in (like in later versions of node.js or in ES2015), this will match the built-in
 *   protocol name.
 * - `init`
 * - `step`
 * - `result`
 * - `reduced`: used internally to mark a collection as already reduced
 * - `value`: used internally to provide the actual value of a reduced collection
 *
 * The final two values don't have a lot of use outside the library unless you're writing your own transducers.
 *
 * ## How Objects Are Treated
 *
 * Before getting onto the core functions, let's talk about objects.
 *
 * Objects bear some thought because regularly, they aren't candidates for iteration. They don't have any inherent
 * order, normally something that's necessary for true iteration, and they have *two* pieces of data (key and value) for
 * every element instead of one. Yet it's undeniable that at least for most transformations, being able to apply them to
 * objects would be quite handy.
 *
 * For that reason, special support is provided end-to-end for objects.
 *
 * ### Object iteration
 *
 * Iterating over an object will produce one object per property of the original object. An order is imposed; by
 * default, this order is "alphabetical by key". The `{@link module:xduce.iterator|iterator}` function can be passed a
 * sorting function that can sort keys in any other way.
 *
 * The result of the iteration, by default, is a set of objects of the form `{k: key, v: value}`, called kv-form. The
 * reason for this form is that it's much easier to write transformation functions when you know the name of the key. In
 * the regular single-property `{key: value}` form (which is still available by passing `false` as the third parameter
 * to `{@link module:xduce.iterator|iterator}`), the name of the key is unknown; in kv-form, the names of the keys are
 * `k` and `v`.
 *
 * ```
 * var obj = {c: 1, a: 2, b: 3};
 * var reverseSort = function (a, b) { return a < b ? 1 : b > a ? -1 : 0; };
 *
 * var result = iterator(obj);
 * // asArray(result) = [{k: 'a', v: 2}, {k: 'b', v: 3}, {k: 'c', v: 1}]
 *
 * result = iterator(obj, reverseSort);
 * // asArray(result) = [{k: 'c', v: 1}, {k: 'b', v: 3}, {k: 'a', v: 2}]
 *
 * result = iterator(obj, null, false);
 * // asArray(result) = [{a: 2}, {b: 3}, {c: 1}]
 *
 * result = iterator(obj, reverseSort, false);
 * // asArray(result) = [{c: 1}, {b: 3}, {a: 2}]
 * ```
 *
 * Internally, every object is iterated into kv-form, so if you wish to have it in single-property, you must use
 * `{@link module:xduce.iterator|iterator}` in this way and pass that iterator into the transduction function.
 *
 * ### Object transformation
 *
 * The kv-form makes writing transformation functions a lot easier. For comparison, here's what a mapping function (for
 * a `{@link module:xduce.map|map}` transformer) would look like if we were using the single-property form.
 *
 * ```javascript
 * function doObjectSingle(obj) {
 *   var key = Object.keys(obj)[0];
 *   var result = {};
 *   result[key.toUpperCase()] = obj[key] + 1;
 *   return result;
 * }
 * ```
 *
 * Here's what the same function looks like using kv-form.
 *
 * ```javascript
 * function doObjectKv(obj) {
 *   var result = {};
 *   result[obj.k.toUpperCase()]: obj.v + 1;
 *   return result;
 * }
 * ```
 *
 * This is easier, but we can do better. The built-in reducers also recognize kv-form, which means that we can have our
 * mapping function produce kv-form objects as well.
 *
 * ```javascript
 * function doObjectKvImproved(obj) {
 *   return {k: obj.k.toUpperCase(), v: obj.v + 1};
 * }
 * ```
 *
 * This is clearly the easiest to read and write - if you're using ES5. If you're using ES2015, destructuring and
 * dynamic object keys allow you to write `doObjectKv` as
 *
 * ```javascript
 * doObjectKv = ({k, v}) => {[k.toUpperCase()]: v + 1};
 * ```
 *
 * ### Reducing objects
 *
 * The built-in reducers (for arrays, objects, strings, and iterators) understand kv-form and will reduce objects
 * properly whether they're in single-property or kv-form. If you're adding transducer support for non-supported types,
 * you will have to decide whether to support kv-form. It takes a little extra coding, while single-property form just
 * works.
 *
 * That's it for object-object reduction. Converting between objects and other types is another matter.
 *
 * Every transducer function except for `{@link module:xduce.sequence|sequence}` is capable of turning an object into a
 * different type of collection, turning a different type of collection into an object, or both. Objects are different
 * because they're the only "collections" that have two different pieces of data per element. Because of this, we have
 * to have a strategy on how to move from one to another.
 *
 * Transducing an object into a different type is generally pretty easy. If an object is converted into an array, for
 * instance, the array elements will each be single-property objects, one per property of the original object.
 *
 * Strings are a different story, since encoding a single-property object to a string isn't possible (because every
 * "element" of a string has to be a single character). Strings that are produced from objects will instead just be the
 * object values, concatenated. Because objects are iterated in a particular order, this conversion will always produce
 * the same string, but except in some very specific cases there really isn't a lot of use for this converstion.
 *
 * ```javascript
 * var obj = {a: 1, b: 2};
 *
 * var result = asArray(obj);
 * // result = [{a: 1}, {b: 2}]
 *
 * result = asIterator(obj);
 * // result is an iterator with two values: {a: 1} and {b: 2}
 *
 * result = into(Immutable.List(), obj)
 * // result is an immutable list with two elements: {a: 1} and {b: 2}
 *
 * result = asString(obj);
 * // result is '12'
 * ```
 *
 * The opposite conversion depends on the values inside the collections. If those values are objects, then the result is
 * an object with all of the objects combined (if more than one has the same key, the last one is the one that's kept).
 * Otherwise, keys are created for each of the elements, starting with `0` and increasing from there.
 *
 * This means that converting an object to any non-string collection and back produces the original object.
 *
 * ```javascript
 * var result = asObject([{a: 1}, {b: 2}]);
 * // result = {a: 1, b: 2}
 *
 * result = asObject([1, 2, 3]);
 * // result = {0: 1, 1: 2, 2: 3}
 *
 * result = asObject('hello');
 * // result = {0: 'h', 1: 'e', 2: 'l', 3: 'l', 4: 'o'}
 * ```
 *
 * @module xduce
 */

/**
 * A generic iterator. This conforms to the `iterator` protocol in that it has a `{@link module:xduce~next|next}`
 * function that produces {@link module:xduce~nextValue|`iterator`-compatible objects}.
 *
 * @typedef {object} iterator
 * @property {module:xduce~next} next A function that, when called, returns the next iterator value.
 */

/**
 * The function that makes an object an iterator. This can be called repeatedly, with each call returning one iterator
 * value, in order. This function must therefore keep state to know *which* of the values is the one to return next,
 * based on the values that have already been returned by prior calls.
 *
 * @callback next
 * @return {module:xduce~nextValue} An object containing the status and value of the next step of the iteration.
 */

/**
 * An object returned by an iterator's `next` function. It has two properties so one can be used as a flag, since
 * values like `false` and `undefined` can be legitimate iterator values.
 *
 * @typedef {object} nextValue
 * @property {boolean} done A flag to indicate whether there are any more values remaining in the iterator. Once this
 *     becomes `true`, there are no more iterator values (and the object may not even have a `value` property).
 * @property {*} [value] The value returned by the iterator on this step. As long as `done` is `false`, this will be a
 *     valid value. Once `done` returns `true`, if there will be no further valid values (the spec allows a "return
 *     value", but this library does not use that).
 */

/**
 * A function used for sorting a collection.
 *
 * @callback sort
 * @param {*} a The first item to compare.
 * @param {*} b The second item to compare.
 * @return {number} Either `1` if `a` is less than `b`, `-1` if `a` is greater than `b`, or `0` if `a` is equal to `b`.
 */

/**
 * The mapping of protocol names to their respective property key names. The values of this map will depend on whether
 * symbols are available.
 *
 * @typedef {object} protocolMap
 * @property {(string|Symbol)} init The `iterator` protocol. This is built-in in ES2015+ environments; in that case the
 *     built-in protocol will be the value of this property.
 * @property {(string|Symbol)} init The `transducer/init` protocol. This is used to mark functions that initialize a
 *     target collection before adding items to it.
 * @property {(string|Symbol)} step The `transducer/step` protocol. This is used to mark functions that are used in the
 *     transducer's step process, where objects are added to the target collection one at a time.
 * @property {(string|Symbol)} result The `transducer/result` protocol. This is used to mark functions that take the
 *     final result of the step process and return the final form to be output. This is optional; if the transducer does
 *     not want to transform the final result, it should just return the result of its chained transducer's `result`
 *     function.
 * @property {(string|Symbol)} reduced The `transducer/reduced` protocol. The presence of this key on an object
 *     indicates that its transformation has been completed. It is used internally to mark collections whose
 *     transformations conclude before every object is iterated over (as in `{@link xduce.take}` transducers.) It is of
 *     little use beyond transducer authoring.
 * @property {(string|Symbol)} value The `transducer/value` protocol. This is used internally to mark properties that
 *     contain the value of a reduced transformation. It is of little use beyond transducer authoring.
 */

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Transduction protocol function definitions

/**
 * Returns a new, blank, empty instance of the target collection.
 *
 * @callback init
 * @return {*} An initial instance of the target collection. This is usually, but is not required to be, an empty
 *     instance of the collection.``
 */

/**
 * Performs a transformation on a single element of a collection, adding it to the target collection at the end. Thus,
 * this function performs both the transformation *and* the reduction steps.
 *
 * @callback step
 * @param {*} acc The target collection into which the transformed value will be reduced.
 * @param {*} value A single element from the original collection, which is to be tranformed and reduced into the target
 *     collection.
 * @return {*} The resulting collection after the provided value is reduced into the target collection.
 */

/**
 * Performs any post-processing on the completely reduced target collection. This lets a transducer make a final,
 * whole-collection transformation, particularly useful when the step function has been used on an intermediate form
 * of the collection which is not meant to be the output.
 *
 * @callback result
 * @param {*} input The final, reduced collection derived from using {@link module:xduce~step} on each of the original
 *     collection's elements.
 * @return {*} The final collection that is the result of the transduction.
 */

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Transducers

/**
 * An object implementing all three transduction protocols (`init`, `step`, and `result`) which is used by the engine
 * to define transduction.
 *
 * Transducer objects can (and must) be chained together. For instance, none of the transducer functions defined in
 * {@link module:xduce.transducers} produces objects that know how to reduce transformed values into an output
 * collection. This is the entire point; reduction is separate from transformation, which allows transformations to be
 * used no matter the type of the output collection. So the engine automatically chains transducer objects to a reducer
 * object (which is basically a specialized transducer objects whose `step` function transforms its inputs by adding
 * them to a collection) that *does* know how to create an output collection. Thus, the protocol methods need to call
 * the protocol methods of the next transducer object in the chain.
 *
 * For that reason, transducer objects are not created manually. They are instead created by
 * {@link module:xduce~transducerFunction|transducer functions} that automatically create transducer objects and link
 * them to the next transducer object in the chain.
 *
 * @typedef {object} transducerObject
 * @property {module:xduce~init} @@transducer/init An implementation of the transducer `init` protocol. In environments
 *     where symbols are available, this will be named `Symbol.for('transducer/init')`.
 * @property {module:xduce~step} @@transducer/step An implementation of the transducer `step` protocol. In environments
 *     where symbols are available, this will be named `Symbol.for('transducer/step')`.
 * @property {module:xduce~result} @@transducer/result An implementation of the transducer `result` protocol. In
 *     environments where symbols are available, this will be named `Symbol.for('transducer/result')`.
 */

/**
 * A function that creates a {@link module:xduce~transducerObject|transducer object} and links it to the next one in
 * the chain.
 *
 * @callback transducerFunction
 * @param {module:xduce~transducerObject} xform A transducer object to chain the new transducer object to.
 * @return {module:xduce~transducerObject} A new transducer object already chained to `xform`.
 */

/**
 * A function that is responsible for performing transductions on collections.
 *
 * These functions have two forms. If no input collection is supplied, then this takes a set of configuration parameters
 * and returns a {@link module:xduce~transducerFunction|transducer function} configured to handle that specific
 * transformation.
 *
 * There is also a shortcut form, where an input collection *is* supplied. In this case, a transducer function is still
 * configured and created, but then it is immediately applied as though `{@link module:xduce.sequence|sequence}` was
 * called with that collection and transducer function. The transformed collection is then returned.
 *
 * @callback transducer
 * @param {*} [collection] An optional input collection that is to be transduced.
 * @param {...*} params Parameters that are used to configure the underlying transformation. Which parameters are
 *     necessary depends on the transducer. See the {@link module:xduce.transducers|individual transducers} for details.
 * @return {(*|module:xduce~transducerFunction)} If a collection is supplied, then the function returns a new
 *     collection of the same type with all of the elements of the input collection transformed. If no collection is
 *     supplied, a transducer function, suitable for passing to `{@link module:xduce.sequence|sequence}`,
 *     `{@link module:xduce.into|into}`, etc. is returned.
 */

const {
  bmpCharAt,
  bmpLength,
  range,
  complement,
  isArray,
  isFunction,
  isNumber,
  isObject,
  isString
} = require('./modules/util');

const {
  complete,
  uncomplete,
  isCompleted,
  ensureCompleted,
  ensureUncompleted,
  toReducer,
  toFunction,
  reduce
} = require('./modules/reduction');

const { protocols } = require('./modules/protocol');
const { iterator } = require('./modules/iteration');
const {
  transduce,
  into,
  sequence,
  asArray,
  asIterator,
  asObject,
  asString,
  compose
} = require('./modules/transformation');

const { chunk, chunkBy } = require('./xform/chunk');
const { identity, flatten, repeat } = require('./xform/core');
const { distinct, distinctBy, distinctWith } = require('./xform/distinct');
const { drop, dropWhile } = require('./xform/drop');
const { filter, reject, compact } = require('./xform/filter');
const { map, flatMap } = require('./xform/map');
const { take, takeWhile, takeNth } = require('./xform/take');
const { unique, uniqueBy, uniqueWith } = require('./xform/unique');

module.exports = {
  /**
   * A series of utility functions that are used internally in Xduce. Most of them don't have a lot to do with
   * transducers themselves, but since they were already available and potentially useful, they're provided here. The
   * reduction-related functions *are* related to transducers, specifically to writing them, so they are also provided.
   *
   * @memberof module:xduce
   * @static
   * @namespace util
   * @type {object}
   */
  util: {
    /**
     * These functions are used by xduce to create iterators for strings in pre-ES2015 environments. String iterators in
     * ES2015+ account for double-width characters in the Basic Multilingual Plane, returning those double-wide
     * characters as one iterator value. Older environments do not do this; double-width characters would in that case
     * be returned as two distinct characters, but for Xduce's use of these functions.
     *
     * Note that the built-in `charAt` and `length` do *not* take double-width characters into account even in ES2015+
     * environments even though iterators do. These functions are still useful as utility functions in any environment.
     *
     * @memberof module:xduce.util
     * @static
     * @namespace bmp
     * @type {object}
     */
    bmp: {
      charAt: bmpCharAt,
      length: bmpLength
    },
    range,
    complement,

    isArray,
    isFunction,
    isNumber,
    isObject,
    isString,

    /**
     * Helper functions for writing transducers. These are markers for telling the transducer engine that operation on
     * a value should be complete, even if there are still input elements left.
     *
     * For example, the {@link module:xduce.transducers.take|take} transducer marks its output collection as completed
     * when it takes a certain number of items. This allows reduction to be shut off before all of the elements of the
     * input collection are processed.
     *
     * Without being able to be marked as completed, the only other option for the
     * {@link module:xduce.transducers.take|take} transducer would be to process the collection to its end and simply
     * not add any of the elements after a certain number to the output collection. This would be inefficient and would
     * also make it impossible for {@link module:xduce.transducers.take|take} to handle infinite iterators.
     *
     * Values can be completed multiple times. This nests a completed value inside a completed value, and so on. To
     * uncomplete values like this, {@link module:xduce.util.status.uncomplete|uncomplete} would have to be called
     * multiple times. This is used in the library in the `{@link module:xduce.transducers.flatten|flatten}` transducer.
     *
     * @memberof module:xduce.util
     * @static
     * @namespace status
     * @type {object}
     */
    status: {
      complete,
      uncomplete,
      isCompleted,
      ensureCompleted,
      ensureUncompleted
    }
  },
  protocols,
  iterator,
  toReducer,
  toFunction,
  reduce,
  transduce,
  into,
  sequence,
  asArray,
  asIterator,
  asObject,
  asString,
  compose,

  /**
   * Functions which actually perform transformations on the elements of input collections.
   *
   * Each of these is a function of type {@link module:xduce~transducer}. They can operate either by transforming a
   * collection themselves or, if no collection is supplied, by creating a
   * {@link module:xduce~transducerFunction|transducer function} that can be passed to any of the functions that
   * require one (`{@link module:xduce.sequence|sequence}`, `{@link module:xduce.into|into}`,
   * `{@link module:xduce.transduce|transduce}`, `{@link module:xduce.asArray|asArray}`, etc.).
   *
   * For example, here are transducers operating directly on collections.
   *
   * ```
   * const collection = [1, 2, 3, 4, 5];
   *
   * let result = map(collection, x => x + 1);
   * // result = [2, 3, 4, 5, 6]
   *
   * result = filter(collection, x => x < 3);
   * // result = [1, 2]
   * ```
   *
   * Here are transducers producing transducer functions, which are then used by
   * `{@link module:xduce.sequence|sequence}` to perform the same transformations.
   *
   * ```
   * const collection = [1, 2, 3, 4, 5];
   *
   * let result = sequence(collection, map(x => x + 1));
   * // result = [2, 3, 4, 5, 6]
   *
   * result = sequence(collection, filter(x => x < 3));
   * ```
   *
   * The shortcut form, the one that takes a collection, is extremely convenient but limited. It cannot, for example,
   * transform one type of collection into another type (turning an array of numbers into a string of numbers, for
   * instance). Shortcuts also cannot be composed. Here are examples of both of these, showing how they're done by
   * using transducers to create transducer functions (which are then passed to `{@link module:xduce.asArray|asArray}`
   * and `{@link module:xduce.compose|compose}` in these cases).
   *
   * ```
   * const collection = [1, 2, 3, 4, 5];
   *
   * let result = asString(collection, map(x => x + 1));
   * // result = '23456'
   *
   * result = sequence(collection, compose(filter(x => x < 3), map(x => x + 1)));
   * // result = [2, 3]
   * ```
   *
   * @memberof module:xduce
   * @static
   * @namespace transducers
   * @type {object}
   */
  transducers: {
    chunk,
    chunkBy,
    identity,
    flatten,
    repeat,
    distinct,
    distinctBy,
    distinctWith,
    drop,
    dropWhile,
    filter,
    reject,
    compact,
    map,
    flatMap,
    take,
    takeWhile,
    takeNth,
    unique,
    uniqueBy,
    uniqueWith
  }
};
