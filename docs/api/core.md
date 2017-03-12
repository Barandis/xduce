# Core Functions and Properties

[`asArray`](#as-array)
[`asIterator`](#as-iterator)
[`asObject`](#as-object)
[`asString`](#as-string)
[`compose`](#compose)
[`into`](#into)
[`iterator`](#iterator)
[`protocols`](#protocols)
[`reduce`](#reduce)
[`sequence`](#sequence)
[`toFunction`](#to-function)
[`toReducer`](#to-reducer)
[`transduce`](#transduce)

All of these functions deal directly with transducers. But first, let's talk about the protocols that are going to be referred to throughout many of the function discussions.

## Protocols

One of the key selling points for transducers is that the same transformer can be used on any type of collection. Rather than having to write a new `map` function (for example) for every kind of collection - one for an array, one for a string, one for an iterator, etc. - there is a single `map` transformer that will work with all of them, and potentially with *any* kind of collection. This is possible implementing *protocols* on the collections.

A protocol in JavaScript is much like an interface in languages like Java and C#. It is a commitment to providing a certain functionality under a certain name. ES6 has seen the introduction of an `iterator` protocol, for example, and language support for it (the new `for...of` loop can work with any object that correctly implements the `iterator` protocol).

To support transduction, Xduce expects collections to implement four protocols.

- `iterator`: a function that returns an iterator (this one is built in to ES6 JavaScript)
- `transducer/init`: a function that returns a new, empty instance of the output collection
- `transducer/step`: a function that takes an accumulator (the result of the reduction so far) and the next input value, and then returns the accumulator with the next input value added to it
- `transducer/result`: a function that takes the reduced collection and returns the final output collection

`iterator` is the built-in JavaScript protocol. When called, it is expected to return an iterator over the implementing colleciton. This iterator is an object that has a `next` function. Each call to `next` is expected to return an object with `value` and `done` properties, which respectively hold the next value of the iterator and a Boolean to indicate whether the iteration has reached its end. (This is a simplified explanation; see [this MDN page](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators) for more detailed information.)

`transducer/init` (referred to from now on as `init`) should be a function that takes no parameters and returns a new, empty instance of the output collection. This is the function that defines how to create a new collection of the correc type.

`transducer/step` (referred to from now on as `step`) should be a function that takes two parameters. These parameters are the result of the reduction so far (and so is a collection of the output type) and the next value from the input collection. It must return the new reduction result, with the next value incorporated into it. This is the function that defines how reduce a value onto the collection.

`transducer/result` (referred to from now on as `result`) should be a function that takes one parameter, which is the fully reduced collection. It should return the final output collection. This affords a chance to make any last-minute adjustments to the reduced collection before returning it.

Arrays, strings, and objects are all given support for all of these protocols. Other collections will have to provide their own (though it should be noted that since `iterator` is built-in, many third-party collections will already implement this protocol). As an example, let's add transducer support to a third-party collection, the `Immutable.List` collection from [immutable-js](https://facebook.github.io/immutable-js/)

```javascript
Immutable.List.prototype[protocols.init] = function () {
  return Immutable.List().asMutable(); 
};
Immutable.List.prototype[protocols.step] = function (acc, input) {
  return acc.push(input); 
};
Immutable.List.prototype[protocols.result] = function (value) {
  return value.asImmutable(); 
};
```

`Immutable.List` already implements `iterator`, so we don't have to do it ourselves.

The `init` function returns an empty mutable list. This is important for immutable-js because its default lists are immutable, and immutable lists mean that a new list has to be created with every reduction step. It would work fine, but it's quite inefficient.

The `step` function adds the next value to the already-created list. `Immutable.List` provides a `push` function that works like an array's `push`, except that it returns the new list with the value pushed onto it. This is perfect for our `step` function.

The `result` function converts the now-finished mutable list into an immutable one, which is what's going to be expected if we're transducing something into an `Immutable.List`. In most cases, `result` doesn't have to do any work, but since we're creating an intermediate representation of our collection type here, this lets us create the collection that we actually want to output. (Without `result`, we would have to use immutable lists all the way through, creating a new one with each `step` function, since we wouldn't be able to make this converstion at the end.)

With those protocols implemented on the prototype, `Immutable.List` collections can now support any transduction we can offer.

### <a name="protocols"></a> protocols

After talking a lot about protocols and showing how they're properties added to an object, it's probably pretty obvious that there's been no mention of what the actual names of those properties are. That's what `protocols` is for.

`protocols` means that the actual names aren't important, which is good because the name might vary depending on whether or not the JavaScript environment has symbols defined. That unknown quantity can be abstracted away by using the properties on the `protocols` object as property keys. (Besides, the actual name of the protocol will be something like `'@@transducer/init'` and that's not a lot of fun to work with.)

The best way to use these keys can be seen in the immutable-js example above. Instead of worrying about the name of the key for the `init` protocol, the value of `protocols.init` is used.

`protocols` defines these protocol property names.

- `iterator`: if this is built in (like in later versions of node.js or in ES6), this will match the built-in protocol name.
- `init`
- `step`
- `result`
- `reduced`: used internally to mark a collection as already reduced
- `value`: used internally to provide the actual value of a reduced collection
- `object`: used internally to make interacting with objects nicer

The final three values don't have a lot of use outside the library unless you're writing your own transducers.

## How Objects Are Treated

Before getting onto the core functions, let's talk about objects.

Objects bear some thought because regularly, they aren't candidates for iteration. They don't have any inherent order, normally something that's necessary for true iteration, and they have *two* pieces of data (key and value) for every element instead of one. Yet it's undeniable that at least for most transformations, being able to apply them to objects would be quite handy.

For that reason, special support is provided end-to-end for objects.

### Object iteration

Iterating over an object will produce one object per property of the original object. An order is imposed; by default, this order is "alphabetical by key". The [`iterator`](#iterator) function can be passed a sorting function that can sort keys in any other way.

The result of the iteration, by default, is a set of objects of the form `{k: key, v: value}`, called kv-form. The reason for this form is that it's much easier to write transformation functions when you know the name of the key. In the regular single-property `{key: value}` form (which is still available by passing `false` as the third parameter to [`iterator`](#iterator)), the name of the key is unknown; in kv-form, the names of the keys are `k` and `v`.

```javascript
var obj = {c: 1, a: 2, b: 3};
var reverseSort = function (a, b) { return a < b ? 1 : b > a ? -1 : 0; };

var result = iterator(obj);
// asArray(result) = [{k: 'a', v: 2}, {k: 'b', v: 3}, {k: 'c', v: 1}]

result = iterator(obj, reverseSort);
// asArray(result) = [{k: 'c', v: 1}, {k: 'b', v: 3}, {k: 'a', v: 2}]

result = iterator(obj, null, false);
// asArray(result) = [{a: 2}, {b: 3}, {c: 1}]

result = iterator(obj, reverseSort, false);
// asArray(result) = [{c: 1}, {b: 3}, {a: 2}]
```

Internally, every object is iterated into kv-form, so if you wish to have it in single-property, you must use [`iterator`](#iterator) in this way and pass that iterator into the transduction function.

### Object transformation

The kv-form makes writing transformation functions a lot easier. For comparison, here's what a mapping function (for a [`map`](xform.md#map) transformer) would look like if we were using the single-property form.

```javascript
function doObjectSingle(obj) {
  var key = Object.keys(obj)[0];
  var result = {};
  result[key.toUpperCase()] = obj[key] + 1;
  return result; 
}
```

Here's what the same function looks like using kv-form.

```javascript
function doObjectKv(obj) {
  var result = {};
  result[obj.k.toUpperCase()]: obj.v + 1;
  return result;
}
```

This is easier, but we can do better. The built-in reducers also recognize kv-form, which means that we can have our mapping function produce kv-form objects as well.

```javascript
function doObjectKvImproved(obj) {
  return {k: obj.k.toUpperCase(), v: obj.v + 1}; 
}
```

This is clearly the easiest to read and write - if you're using ES5. If you're using ES6, destructuring and dynamic object keys allow you to write `doObjectKv` as

```javascript
doObjectKv = ({k, v}) => {[k.toUpperCase()]: v + 1};
```

### Reducing objects

The built-in reducers (for arrays, objects, strings, and iterators) understand kv-form and will reduce objects properly whether they're in single-property or kv-form. If you're adding transducer support for non-supported types, you will have to decide whether to support kv-form. It takes a little extra coding, while single-property form just works.

That's it for object-object reduction. Converting between objects and other types is another matter.

Every transducer function except for [`sequence`](#sequence) is capable of turning an object into a different type of collection, turning a different type of collection into an object, or both. Objects are different because they're the only "collections" that have two different pieces of data per element. Because of this, we have to have a strategy on how to move from one to another.

Transducing an object into a different type is generally pretty easy. If an object is converted into an array, for instance, the array elements will each be single-property objects, one per property of the original object.

Strings are a different story, since encoding a single-property object to a string isn't possible (because every "element" of a string has to be a single character). Strings that are produced from objects will instead just be the object values, concatenated. Because objects are iterated in a particular order, this conversion will always produce the same string, but except in some very specific cases there really isn't a lot of use for this converstion.

```javascript
var obj = {a: 1, b: 2};

var result = asArray(obj);
// result = [{a: 1}, {b: 2}]

result = asIterator(obj);
// result is an iterator with two values: {a: 1} and {b: 2}

result = into(Immutable.List(), obj)
// result is an immutable list with two elements: {a: 1} and {b: 2}

result = asString(obj);
// result is '12'
```

The opposite conversion depends on the values inside the collections. If those values are objects, then the result is an object with all of the objects combined (if more than one has the same key, the last one is the one that's kept). Otherwise, keys are created for each of the elements, starting with `0` and increasing from there.

This means that converting an object to any non-string collection and back produces the original object.

```javascript
var result = asObject([{a: 1}, {b: 2}]);
// result = {a: 1, b: 2}

result = asObject([1, 2, 3]);
// result = {0: 1, 1: 2, 2: 3}

result = asObject('hello');
// result = {0: 'h', 1: 'e', 2: 'l', 3: 'l', 4: 'o'}
```

## Basic Transducer Functions

These functions all take transformer functions and do the actual work of transductions. The difference is in what they require and what they return. *These are the functions that will be used externally to perform transductions.*

### <a name="reduce"></a> `reduce(collection, reducer, init)`

**Reduces the elements of the input collection through a reducer into an output collection**

This is the lowest-level of the transduction functions. In fact, this one is so low-level that it doesn't have a lot of use in normal operation. It's more useful for writing your own transformation functions.

`reduce` doesn't assume that there's even a transformation. It requires an initial collection and a reducer object that is matched to that initial collection. The reducer object must implement the `step` and `result` protocols, which instruct `reduce` on how to build up the collection. The reducer may implement a transformation as well, but all that's important here is that it can do the reduction.

The normal course of operation will be to call [`transduce`](#transduce) instead, as that function makes it easy to combine transformations with reductions and can optionally figure out the initial collection itself.

*Parameters*

- `collection` (*collection*): the input collection. The only requirement of this collection is that it implement the `iterator` protocol. Special support is provided by the library for objects and pre-ES6 arrays and strings (ES6 arrays and strings already implement `iterator`), so any of those can also be used.
- `reducer` (*object*): an object that implements the `step` and `result` protocols. This object must know how to produce an output collection through those protocol functions.
- `init` (*collection*): a collection of the same type as the output collection. It need not be empty; if it is not, the existing elements are retained as the input collection is reduced into it.

### <a name="transduce"></a> `transduce(collection, xform, reducer, init?)`

**Transforms the elements of the input collection and reduces them into an output collection.**

This is the lowest-level of the transduction functions that is likely to see regular use. It does not assume anything about the reducer, as it asks for it to be passed explicitly. This means that any kind of collection can be produced, since the reducer is not tied to the input collection in any way.

`transduce` also will accept an initial value for the resulting collection as the optional last parameter. If this parameter isn't present, then the initial value is determined from the transducer init protocol property on the reducer. Note however that many reducers may not provide an initial value, and in those cases it will *have* to be passed as a parameter.

Example:

```javascript
var xform = map(function (x) { return x + 1; });

var arrayReducer = {};
arrayReducer[protocols.init] = function () { return []; };
arrayReducer[protocols.result] = function (x) { return x; };
arrayReducer[protocols.step] = function (acc, x) {
  acc.push(x);
  return acc;
};

var stringReducer = {};
stringReducer[protocols.init] = function () { return ''; };
stringReducer[protocols.result] = function (x) { return x; };
stringReducer[protocols.step] = function (acc, x) { return acc + x; };

var result = transduce([1, 2, 3, 4, 5], xform, arrayReducer);
// result = [2, 3, 4, 5, 6]

result = transduce([1, 2, 3, 4, 5], xform, stringReducer);
// result = '23456'

result = transduce('12345', xform, arrayReducer);
// result = [2, 3, 4, 5, 6]

result = transduce('12345', xform, stringReducer);
// result = '23456'
```

These examples illustrate a number of important concepts. First of all, the transformer is independent of the transduction; the same transformer function is used no matter the type of input or output collections. Secondly, two reducers are defined. These are objects that conform to the transducer protocol (see the documentation on [`protocols`](#protocols)) and that know how to produce the output collection of choice. In this case, the reducers know how to create new arrays and strings (the `init` protocol) and how to add elements to arrays and strings (the `step` protocol). Because these reducers do have `init` protocol properties, the `transduce` calls do not require explicit initial collections.

The final point is that `transduce` can accept any kind of iterable collection, and by passing in the proper reducer, it can produce any kind of output collection. The same `transduce` function and the same map transformer is used in all four examples, despite the input/output combination being different in all four.

The `init` collection doesn't have to be empty. If it isn't, the elements that are already in it are retained and the transformed input elements are reduced into the collection normally.

*Parameters*

- `collection` (*collection*): the input collection. The only requirement of this collection is that it implement the `iterator` protocol. Special support is provided by the library for objects and pre-ES6 arrays and strings (ES6 arrays and strings already implement `iterator`), so any of those can also be used.
- `xform` (*transformer function*): the function used to transform the input collection elements before they're reduced into the output collection. This must be a function that takes one parameter, expected to be another transformer function for chaining, and returns an object that implements the transducer protocols (`init`, `step`, and `result`). Any of the transformers in this library produce suitable transformer functions.
- `reducer` (*object*): an object that implements the transducer protocols (`init` is only required if the `init` parameter is not present). This object must know how to produce an output collection through its `step` and `result` protocol functions.
- `init` (*collection*): a collection of the same type as the output collection. If this is not present, then the reducer's `init` protocol function is called instead to get the initial collection. If it is present and not empty, then the existing elements remain and the transformed input collection elements are added to it.

*Returns*

- A collection of a type determined by the passed reducer. The elements of this collection are the results from the transformer function being applied to each element of the input collection.

### <a name="into"></a> `into(target, collection, xform?)`

**Transforms the elements of the input collection and reduces them into the target collection.**

This is much like [`transduce`](#transduce) above, except that instead of explicitly providing a reducer (and perhaps an initial collection), the target collection acts as a reducer itself. This requires that the collection implement the `init`, `result`, and `step` transducer protocol functions.

If no transformer function is provided, the input collection elements are reduced into the target collection without being transformed. This can be used to convert one kind of collection into another.

Example:

```javascript
var xform = map(function (x) { return x + 1; });

var result = into([], [1, 2, 3, 4, 5], xform);
// result = [2, 3, 4, 5, 6]

result = into('', [1, 2, 3, 4, 5], xform);
// result = '23456'

result = into([], '12345', xform);
// result = [2, 3, 4, 5, 6]

result = into('', '12345', xform);
// result = '23456'
```

These examples are exactly equivalent to the four examples under [`transduce`](#transduce) above.

*Parameters*

- `target` (*collection*): the collection into which all of the transformed input collection elements will be reduced. This collection must implement the `init`, `result`, and `step` protocol functions from the transducer protocol. Special support is provided for arrays, strings, and objects, so they need not implement the protocol.
- `collection` (*collection*): the input collection. The only requirement of this collection is that it implement the `iterator` protocol. Special support is provided by the library for objects and pre-ES6 arrays and strings (ES6 arrays and strings already implement `iterator`), so any of those can also be used.
- `xform` (*transformer function*): the function used to transform the input collection elements before they're reduced into the target collection. This must be a function that takes one parameter, expected to be another transformer function for chaining, and returns an object that implements the transducer protocols (`init`, `step`, and `result`). Any of the transformers in this library produce suitable transformer functions. If this isn't present, the input collection will simply be reduced into the target collection without transformation.

*Returns*

- The target collection, with all of the tranformed input collection elements reduced onto it.

### <a name="sequence"></a> `sequence(collection, xform)`

**Transforms the elements of the input collection and reduces them into a new collection of the same type.**

This is the highest level of the three main transduction functions (`sequence`, [`into`](#into), and [`transduce`](#transduce)). It creates a new collection of the same type as the input collection and reduces the transformed elements into it. Additionally, unlike [`into`](#into) and [`transduce`](#transduce), this function is capable of producing an iterator.

The input collection must not only implement the `iterator` protocol (as in the last two functions) but also the `init`, `result`, and `step` transducer protocols. Special support is provided for arrays, strings, objects, and iterators, so they need not implement any protocol.

The obvious limitation of this function is that the type of output collection cannot be chosen. Since it is always the same as the input collection, this function cannot be used to convert a collection into a different type.

Example:

```javascript
var xform = map(function (x) { return x + 1; });

var result = sequence([1, 2, 3, 4, 5], xform);
// result = [2, 3, 4, 5, 6]

result = sequence('12345', xform);
// result = '23456'
```

These examples are identical to two of the four examples from the last two functions. The other two examples are not possible with `sequence` because they have different input and output collection types.

*Parameters*

- `collection` (*collection*): the input collection. This must implement the `iterator`, `init`, `result`, and `step` protocols. Special support is provided for arrays, strings, objects, and iterators, so they do not have to implement any protocols.
- `xform` (*transformer function*): the function used to transform the input collection elements before they're reduced into the target collection. This must be a function that takes one parameter, expected to be another transformer function for chaining, and returns an object that implements the transducer protocols (`init`, `step`, and `result`). Any of the transformers in this library produce suitable transformer functions.

*Returns*

- A collection of the same type as the input collection, containing all of the transformed values from the input collection elements.

## Specific Transducer Functions

All of these functions perform transformation just like the basic operations, but they specify the output as one of the built-in collection types. They are identical to each other except for the type of output.

### <a name="as-array"></a> `asArray(collection, xform?)`

**Transforms the elements of the input collection and reduces them into a new array.**

The transformer is optional. If it isn't present, this function just converts the input collection into an array.

Example:

```javascript
var xform = map(function (x) { return x + 1; });

var result = asArray([1, 2, 3, 4, 5], xform);
// result = [2, 3, 4, 5, 6]

result = asArray('12345', xform);
// result = [2, 3, 4, 5, 6]

result = asArray('12345');
// result = [1, 2, 3, 4, 5]

result = asArray({a: 1, b: 2});
// result = [{a: 1}, {b: 2}]
```

*Parameters*

- `collection` (*collection*): the input collection. The only requirement of this collection is that it implement the `iterator` protocol. Special support is provided by the library for objects and pre-ES6 arrays and strings (ES6 arrays and strings already implement `iterator`), so any of those can also be used.
- `xform` (*transformer function*): the function used to transform the input collection elements before they're reduced into the output array. This must be a function that takes one parameter, expected to be another transformer function for chaining, and returns an object that implements the transducer protocols (`init`, `step`, and `result`). Any of the transformers in this library produce suitable transformer functions. If this isn't present, the input collection will simply be reduced into an array without transformation.

*Returns*

- An array containing all of the transformed values from the input collection elements.

### <a name="as-object"></a> `asObject(collection, xform?)`

**Transforms the elements of the input collection and reduces them into a new object.**

The transformer is optional. If it isn't present, this function just converts the input collection into an object.

Example:

```javascript
var xform = map(function (x) {
  var result = {};
  result[x.k] = x.v + 1;
});

var result = asObject({a: 1, b: 2}, xform);
// result = {a: 2, b: 3}

result = asObject([{a: 1}, {b: 2}], xform);
// result = {a: 2, b: 3}

result = asObject([1, 2, 3, 4, 5]);
// result = {0: 1, 1: 2, 2: 3, 3: 4, 4: 5}

result = asObject('hello');
// result = {0: 'h', 1: 'e', 2: 'l', 3: 'l', 4: 'o'}
```

*Parameters*

- `collection` (*collection*): the input collection. The only requirement of this collection is that it implement the `iterator` protocol. Special support is provided by the library for objects and pre-ES6 arrays and strings (ES6 arrays and strings already implement `iterator`), so any of those can also be used.
- `xform` (*transformer function*): the function used to transform the input collection elements before they're reduced into the output object. This must be a function that takes one parameter, expected to be another transformer function for chaining, and returns an object that implements the transducer protocols (`init`, `step`, and `result`). Any of the transformers in this library produce suitable transformer functions. If this isn't present, the input collection will simply be reduced into an object without transformation.

*Returns*

- An array containing all of the transformed values from the input collection elements.

### <a name="as-string"></a> `asString(collection, xform?)`

**Transforms the elements of the input collection and reduces them into a new string.**

The transformer is optional. If it isn't present, this function just converts the input collection into an string.

Example:

```javascript
var xform = map(function (x) { return x.toUpperCase(); });

var result = asString('hello', xform);
// result = 'HELLO'

result = asString(['h', 'e', 'l', 'l', 'o'], xform);
// result = 'HELLO'

result = asString([1, 2, 3, 4, 5]);
// result = '12345'

result = asString({a: 1, b: 2});
// result = '12'
```

*Parameters*

- `collection` (*collection*): the input collection. The only requirement of this collection is that it implement the `iterator` protocol. Special support is provided by the library for objects and pre-ES6 arrays and strings (ES6 arrays and strings already implement `iterator`), so any of those can also be used.
- `xform` (*transformer function*): the function used to transform the input collection elements before they're reduced into the output string. This must be a function that takes one parameter, expected to be another transformer function for chaining, and returns an object that implements the transducer protocols (`init`, `step`, and `result`). Any of the transformers in this library produce suitable transformer functions. If this isn't present, the input collection will simply be reduced into a string without transformation.

*Returns*

- A string containing all of the transformed values from the input collection elements.

### <a name="as-iterator"></a> `asIterator(collection, xform?)`

**Transforms the elements of the input collection and reduces them into a new iterator.**

The transformer is optional. If it isn't present, this function just converts the input collection into an iterator.

Example:

*(The results here are shown passed through `asArray` because there's no literal interpretation of an iterator to show. The `asArray` calls are for demonstration purposes only.)*

```javascript
var xform = map(function (x) { return x + 1; });
var five = function* () {
  for (var i = 1; i <= 5; ++i) {
    yield i;
  }
};

var result = asIterator(five(), xform);
// asArray(result) = [2, 3, 4, 5, 6]

result = asString([1, 2, 3, 4, 5], xform);
// asArray(result) = [2, 3, 4, 5, 6]

result = asIterator([1, 2, 3, 4, 5]);
// asArray(result) = [1, 2, 3, 4, 5]

result = asIterator({a: 1, b: 2});
// asArray(result) = [{a: 1}, {b: 2}]
```

*Parameters*

- `collection` (*collection*): the input collection. The only requirement of this collection is that it implement the `iterator` protocol. Special support is provided by the library for objects and pre-ES6 arrays and strings (ES6 arrays and strings already implement `iterator`), so any of those can also be used.
- `xform` (*transformer function*): the function used to transform the input collection elements before they're reduced into the output iterator. This must be a function that takes one parameter, expected to be another transformer function for chaining, and returns an object that implements the transducer protocols (`init`, `step`, and `result`). Any of the transformers in this library produce suitable transformer functions. If this isn't present, the input collection will simply be reduced into an iterator without transformation.

*Returns*

- An iterator containing all of the transformed values from the input collection elements.

## Iteration functions

### <a name="iterator"></a> `iterator(collection, sort?, kv?)`

**Creates an iterator over the provided collection.**

For collections that are not objects, it's as simple as that. Pass in the collection, get an iterator over that collection.

Objects get special support though, as noted in the section above on iterating over objects. Objects are iterated in alphabetical order by key, unless a second parameter is passed to `iterator`. This must be a function that takes two parameters (which will be object keys) and returns -1 if the first is less than the second, 1 if the second is less than the first, and 0 if they're equal.

Also, `iterator` by default iterates objects into kv-form. This is the form used internally by the xduce library. If this is not appropriate for a particular use case, then a third parameter of `false` can be passed, which will result in the iteration being into single-property form instead.

The second and third parameters are ignored if the input collection is not an object.

*Parameters*

- `collection` (*collection*): the input collection. The only requirement of this collection is that it implement the `iterator` protocol. Special support is provided by the library for objects and pre-ES6 arrays and strings (ES6 arrays and strings already implement `iterator`), so any of those can also be used.
- `sort` (*function*): a two-parameter function used to define a sort order for an object *only*. *(This parameter will be ignored if the input collection is not an object.)* Two keys will be provided to the sort function, and it must return -1 if the first is less, 1 if the second is less, and 0 if they're equal. Sorting by value is not possible in this method; for sorting by value, convert the object into an array and sort the elements by value.
- `kv` (*boolean*): instructs the function to produce either single-property (`false`) or kv-form (`true`) objects. *(This parameter will be ignored if the input collection is not an object.)* Single-property means each iterated element is in the form `{key: value}`; kv-form means that it's in the form `{k: key, v: value}`.

*Returns*

- An iterator over the input collection.

## Integration Functions

This pair if functions is useful in integrating with code outside the transducer world.

### <a name="to-reducer"></a> `toReducer(obj)`

**Creates a reducer object from a function or from a built-in reducible type (array, object, or string).**

To create a reducer for arrays, objects, or strings, simply pass an empty version of that collection to this function (e.g., `toReducer([])`). These reducers support the kv-form for objects.

The notable use for this function though is to turn a reduction function into a reducer. This is a function that takes two parameters, an accumulator and a value, and returns the accumulator with the value in it. This is exactly the same kind of function that is passed to reduction functions like JavaScript's `Array.prototype.reduce` and Lodash's `_.reduce`.

*Parameters*

- `obj` (*object or function*): an object or function to create a reducer for. If this is an object, it should support the `init`, `step`, and `result` protocols. Special support is provided for plain objects, arrays, and strings so that they do not have to support these protocols.

*Returns*

- An object that supports the `init`, `step`, and `reducer` protocols and can be used as a reducer object in [`transduce`](#transduce) or [`reduce`](#reduce).

### <a name="to-function"></a> `toFunction(xform, reducer)`

**Creates a reduction function from a transformer and a reducer.**

This produces a function that's suitable for being passed into other libraries' reduce functions, such as JavaScript's `Array.prototype.reduce` or Lodash's `_.reduce`. It requires both a transformer and a reducer because reduction functions for those libraries must know how to do both. The reducer can be a standard reducer object like the ones sent to [`transduce`](#transduce) or [`reduce`](#reduce), or it can be a plain function that takes two parameters and returns the result of reducing the second parameter into the first.

If there is no need for a transformation, then pass in the [`identity`](xform.md#identity) transformer.

*Parameters*

- `xform` (*transformer function*): the function used to transform the input collection elements before they're reduced into the output collection. This must be a function that takes one parameter, expected to be another transformer function for chaining, and returns an object that implements the transducer protocols (`init`, `step`, and `result`). Any of the transformers in this library produce suitable transformer functions.
- `reducer` (*object or function*): an object that implements the transducer protocols (`init` is only required if the `init` parameter is not present). This object must know how to produce an output collection through its `step` and `result` protocol functions.

*Returns*

- A reduction function suitable for use with any `reduce`-style function.

## Miscellaneous Functions

### <a name="compose"></a> `compose(fn...)`

**Composes two or more transformer functions into a single transformer function.**

Each function that takes a transformer function is only capable of accpeting one of them. If there is a need to have several transformers chained together, then use `compose` to create a transformer function that does what all of them do.

Note that while the transformers have shortcut functions, this composition is not a shortcut function. It cannot be called with a collection parameter. Instead, pass it like any transformer function would be passed to [`sequence`](#sequence), [`into`](#into), and the like.

NOTE: In functional programming, a compose function is generally ordered so that the first-executed function is listed last. This is done in the opposite way, with the first transformer executing first, etc. This is more sensible for transformer functions.

Example:

```javascript
var add1 = function (x) { return x + 1; };
var odd = function (x) { return x % 2 !== 0; };

var xform = compose(map(add1), filter(odd), take(3));

var result = sequence([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], xform);
// result = [3, 5, 7];
```

*Parameters*

- `fn` (*transformer function*): one or more functions used to transform the input collection elements before they're reduced into the output collection. These must be functions that take one parameter, expected to be another transformer function for chaining, and return an object that implements the transducer protocols (`init`, `step`, and `result`). Any of the transformers in this library produce suitable transformer functions.

*Returns*

- A transformer function that performs all of the transformations of the input functions, in the order that they're given.
