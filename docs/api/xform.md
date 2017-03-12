# Transformers

[`chunk`](#chunk)
[`chunkBy`](#chunk-by)
[`compact`](#compact)
[`distinct`](#distinct)
[`distinctBy`](#distinct-by)
[`distinctWith`](#distinct-with)
[`drop`](#drop)
[`dropWhile`](#drop-while)
[`filter`](#filter)
[`flatMap`](#flat-map)
[`flatten`](#flatten)
[`identity`](#identity)
[`map`](#map)
[`reject`](#reject)
[`repeat`](#repeat)
[`take`](#take)
[`takeNth`](#take-nth)
[`takeWhile`](#take-while)
[`uniq`](#uniq)
[`uniqBy`](#uniq-by)
[`uniqWith`](#uniq-with)

All of these transformers are available on the main `xduce` object.

These are the transformers available with the Xduce library. Each of them is dual function, depending on whether or not the first parameter given to them is a collection of some sort.

If it isn't, each of these functions returns another function - a transformer function - that accepts another transformer and returns an object that conforms to the transducer protocol. The fact that these transformer functions accepts a transformer means that they can be composed nicely (through the [`compose`](core.md#compose)). They (or their compositions) are used together with any of the core functions that accept transformers ([`sequence`](core.md#sequence), [`into`](core.md#into), [`asArray`](core.md#as-array), [`asIterator`](core.md#as-iterator), [`as-object`](core.md#as-object), and [`as-string`](core.md#as-string)).

The other form, where a collection is passed as the first parameter, is a convenience. It calls [`sequence`](core.md#sequence) along with the transformation function, effectively doing everything at once. This convenience doesn't work with composed transformers and locks you into using [`sequence`](core.md#sequence), but that's a common enough use case that it can be tremendously useful.

The following code illustrates the difference. The two lines that assign to `result` are equivalent.

```javascript
function addOne(x) {
  return x + 1;
}

var result;

// map() without a collection; returns a transformer function that can be used with sequence()
result = sequence([1, 2, 3, 4, 5], map(addOne));
// [2, 3, 4, 5, 6]

// map() with a collection; does the sequence itself
result = map([1, 2, 3, 4, 5], addOne);
// [2, 3, 4, 5, 6]
```

Most of the functions in this library are named after their [lodash](https://lodash.com/) equivalents. For functions not in lodash (like [`distinct`](#distinct)), I just make the names up.

### Using objects with transformers

Objects are not, by the JavaScript definition, iterable. However, there are a lot of transformers that would actually work quite well with objects, so an 'iterator' has been provided for objects.

That support does some internal magic to make it easier to use transformers with iterated objects. Each 'value' provided by the iterator is an object representing one of the properties on the original object. This iterator value has two properties: `k` and `v`, which represent the key and value of that property.

This a lot easier way of dealing with objects than by providing their properties as key-value pairs. This is illustrated below in these examples, which upper-case property names while leaving the values as-is.

This is how it would have to be done if iterated object values were `{key: value}`:

```javascript
function upperKey(obj) {
  var key = Object.keys(obj)[0];
  var result = {};
  result[key.toUpperCase()] = obj[key];
  return result;
}
var result = map({a: 1, b: 2}, upperKey);
// result = {A: 1, B: 2}
```

And here, as it actually is done, with `{k: key, v: value}`:

```javascript
function upperKey(obj) {
  var result = {};
  result[obj.k.toUpperCase()] = obj.v;
  return result;
}
var result = map({a: 1, b: 2}, upperKey);
// result = {A: 1, B: 2}
```

This is a nice improvement, but it's made drastically better in ES6 (or any other language that has destructuring and dynamic object keys, like CoffeeScript and LiveScript).

Again, using the not-actually-implemented `{key: value}`:

```javascript
const upperKey = obj => {
  const key = Object.keys(obj)[0];
  return { [key.toUpperCase()]: obj[key] };
}
const result = map({a: 1, b: 2}, upperKey);
// result = {A: 1, B: 2}
```

And the way it really is:

```javascript
const result = map({a: 1, b: 2}, ({k, v}) => { [k.toUpperCase()]: v });
// result = {A: 1, B: 2}
```

## Transformers

### Return values and the optional `collection` and `ctx` parameters

Any parameter named `collection` in the following functions is optional. If it is there, it can be an array, an object, a string, an iterator, or any kind of object that implements the iterator protocol and the transducer protocol. While many libraries have objects that implement the iterator protocol, you're not likely to find any that implement the transducer protocol; you'll have to add those properties yourselves.

Any transformer that takes a function also takes an optional context parameter (called `ctx` in the documentation below). If this context is present, the function is bound to that context object as `this`.

Every one of these functions returns either the result collection (if `collection` is passed to the function) or a transformer function (if `collection` is missing).

Since `collection` and the return value are the same in all functions, they're not included in the descriptions below.

### <a name="identity"></a> `identity(collection?)`

**Returns exactly the same collection sent to it.**

This is generally a function used when a transformer function is required but there is no desire to do an actual transformation. The "transformation" implemented here is to pass each element through exactly as it is.

Example:

```javascript
var result = identity([1, 2, 3, 4, 5]);
// result = [1, 2, 3, 4, 5]
```

### <a name="flatten"></a> `flatten(collection?)`

**Flattens a collection by merging elements in any sub-collection into the main collection.**

Elements of the main collection that are not collections themselves are not changed. It's fine to have a combination of the two, some elements that are collections and some that are not.

Since there aren't sub-collections in objects, strings, or iterators, `flatten` doesn't make sense with those types of collections.

Example:

```javascript
var result = flatten([[1, 2], [3, 4, 5], 6, [7]]);
// result = [1, 2, 3, 4, 5, 6, 7]
```

### <a name="map"></a> `map(collection?, fn, ctx?)`

**Sends the elements of a collection to a function, returning a new collection whose elements are the return values of that function.**

Example:

```javascript
var result = map([1, 2, 3, 4, 5], function (x) { return x * x; });
// result = [1, 4, 9, 16, 25]
```

*Parameters*

- `fn` (*function*): a function that takes one parameter. It is sent each element in the input collection and its return values become the elements in the output collection.

### <a name="flat-map"></a> `flatMap(collection?, fn, ctx?)`

**A map function that flattens any collections among the return values.**

This is a composition of [`map`](#map) and [`flatten`](#flatten). In fact it could be defined by the user by using those two functions with [`compose`](core.md#compose), but the concept of a flatmap is so fundamental (it, along with [`map`](#map) and [`filter`](#filter), can fully implement list comprehensions, for example) that it's included separately.

Because the map is followed by a flatten, there are the same notes as with flatten; this function doesn't make a lot of sense with functions that return objects, strings, or iterators.

Example:

```javascript
function duplicate(x) {
  return [x, x];
}

var result = flatMap([1, 2, 3, 4, 5], duplicate);
// result = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5]

// The following is equivalent
var fn = compose(map(duplicate), flatten());
result = sequence([1, 2, 3, 4, 5], fn);
// result = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5]

// To illustrate the difference from map, here's what map would do with
// the same parameters
result = map([1, 2, 3, 4, 5], duplicate);
// result = [[1, 1], [2, 2], [3, 3], [4, 4], [5, 5]]
```

*Parameters*

- `fn` (*function*): a function that takes one parameter. It is sent each element in the input collection and its return values will be flattened to become the elements in the output collection.

### <a name="filter"></a> `filter(collection?, fn, ctx?)`

**Creates a collection containing only the elements from the input collection that pass a predicate function.**

The elements are not in any way modified. Quite simply, if the predicate returns `true` for an element, it's included in the output, and if it returns `false`, that element is not included.

Example:

```javascript
function isEven(x) {
  return x % 2 === 0;
}

var result = filter([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], isEven);
// result = [2, 4, 6, 8, 10]
```

*Parameters*

- `fn` (*function*): a predicate function; that is, a function that takes one parameter and returns a Boolean. Each input collection element is passed through it, and the ones that return `true` are added to the output collection.

### <a name="reject"></a> `reject(collection?, fn, ctx?)`

**Creates a collection containing only the elements from the input collection that do not pass a predicate function.**

This is the opposite of [`filter`](#filter) above. None of the elements of the input collection are modified, and only those for which the predicate returns `false` are included in the output collection.

Example:

```javascript
function isEven(x) {
  return x % 2 === 0;
}

var result = reject([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], isEven);
// result = [1, 3, 5, 7, 9]
```

*Parameters*

- `fn` (*function*): a predicate function; that is, a function that takes one parameter and returns a Boolean. Each input collection element is passed through it, and the ones that return `false` are added to the output collection.

### <a name="compact"></a> `compact(collection?)`

**Removes any 'falsey' elements from the collection.**

'Falsey' means any value in JavaScript that is considered to be false. These values are `false`, `null`, `undefined`, the empty string, and `0`. The [`filter`](#filter) and [`reject`](#reject) functions are available to implement any other sort of compaction the user might want, if this definition doesn't suit.

Example:

```javascript
var result = compact([1, 0, 2, null, 3, undefined, 4, '', 5]);
// result = [1, 2, 3, 4, 5]
```

### <a name="take"></a> `take(collection?, n)`

**Creates a new collection containing only the first `n` elements of the input collection.**

Note that this is an excellent way to turn an 'infinite' collection - one that doesn't have a well-defined end, like a stream, channel, or infinite generator - into a finite collection.

Example:

```javascript
// An iterator that will return every positive integer, one at a time per next() call
function* naturals() {
  var x = 1;
  while (true) {
    yield x++;
  }
}

var result = take(naturals(), 3);
// result is now an iterator that has only three values in it
result.next().value === 1;  // true
result.next().value === 2;  // true
result.next().value === 3;  // true
result.next().done;         // true
```

*Parameters*

- `n` (*integer*): the number of elements from the input collection to include in the output collection.

### <a name="take-while"></a> `takeWhile(collection?, fn, ctx?)`

**Creates a new collection containing the elements of the input collection up until the first one that causes a predicate function to return `false`.**

While this is similar to [`filter`](#filter), there is one key difference. `takeWhile` will not add any further elements to a collection once the first fails the predicate, including later elements that might pass the predicate. [`filter`](#filter), on the other hand, will continue to add those later elements. Therefore `takeWhile` will convert an infinite collection to a finite one while [`filter`](#filter) will not.

Example:

```javascript
var array = [2, 4, 6, 8, 1, 3, 5, 7, 9, 10];
function isEven(x) {
  return x % 2 === 0;
}

var result = takeWhile(array, isEven);
// result = [2, 4, 6, 8];

// This shows the difference between takeWhile and filter with the same parameters
result = filter(array, isEven);
// result = [2, 4, 6, 8, 10];
```

*Parameters*

- `fn` (*function*): a predicate function. Each element of the input collection is passed through this function until one causes it to return `false`.

### <a name="take-nth"></a> `takeNth(collection?, n)`

**Creates a new collection consisting of the first element of the input collection, and then every nth element after that.**

Note that unlike [`take`](#take) and [`takeWhile`](#take-while), this function is not capable of returning a finite collection when given an infinite collection.

Example:

```javascript
var result = takeNth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 3);
// result = [1, 4, 7, 10]
```

*Parameters*

- `n` (*integer*): the skip value, meaning that only every `n`th element is retained. `n = 2` will return every other element, `n = 3` will return every third element, etc.

### <a name="drop"></a> `drop(collection?, n)`

**Creates a new collection consisting of all of the elements of the input collection *except* for the first `n` elements.**

While this could be considered an opposite of [`take`](#take), it does mean that, unlike [`take`](#take), it cannot return a finite collection when given an infinite collection.

Example:

```javascript
var result = drop([1, 2, 3, 4, 5], 3);
// result = [4, 5]
```

*Parameters*

- `n` (*integer*): the number of elements to drop from the beginning of the input collection to create the output collection.

### <a name="drop-while"></a> `dropWhile(collection?, fn, ctx?)`

**Creates a new collection containing the elements of the input collection including the first one that causes a predicate function to return `false` and all elements thereafter.**

This is rather the opposite of [`takeWhile`](#take-while), though unlike that function, this one cannot return a finite collection when given an infinite one. It's also related to [`reject`](#reject), except that once the first element is not rejected, every element after that is also not rejected (even if they would make the predicate return `true`).

Example:
```javascript
var array = [2, 4, 6, 8, 1, 3, 5, 7, 9, 10];
function isEven(x) {
  return x % 2 === 0;
}

var result = dropWhile(array, isEven);
// result = [1, 3, 5, 7, 9, 10];

// This shows the difference between dropWhile and reject with the same parameters
result = reject(array, isEven);
// result = [1, 3, 5, 7, 9];
```

*Parameters*

- `fn` (*function*): a predicate function. Each element of the input collection is passed through this function until one causes it to return `true`.

### <a name="uniq"></a> `uniq(collection?)`

**Removes all duplicates from a collection.**

Once an element is added to the output collection, an equal element will never be added to the output collection again. 'Equal' according to this transformer is a [SameValueZero](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero) comparison.

Example:

```javascript
var result = uniq([1, 1, 2, 3, 3, 3, 4, 5, 3, 1, 5]);
// result = [1, 2, 3, 4, 5];
```

### <a name="uniq-by"></a> `uniqBy(collection?, fn, ctx?)`

**Applies a function each element of a collection and removes elements that create duplicate return values.**

Once the function is applied to the collection elements, a comparison is made using [SameValueZero](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero). If a comparison indicates that the return value from the function for one element is the same as the return value for another element, only the first element is retained in the output collection.

Also note that even though the function can cause a completely different value to be compared, the *element* (not the return value of the function) is what is added to the output collection.

A very common use for `uniqBy` is to refer to a particular property in an array of objects. Another is to do a case-insensitive comparison by passing a function that turns every letter in a string to the same case. However, it can be used in any number of different ways, depending on the function used. 

Example:

```javascript
var array = [{x: 1}, {x: 1}, {x: 2}, {x: 3}, {x: 3}, {x: 3}, 
             {x: 4}, {x: 5}, {x: 3}, {x: 1}, {x: 5}];
function xValue(obj) {
  return obj.x;
}
function toLowerCase(x) {
  return x.toLowerCase();
}

var result = uniqBy(array, xValue);
// result = [{x: 1}, {x: 2}, {x: 3}, {x: 4}, {x: 5}]

// Comparison is case-insensitive, the duplicate letter retained is the first one that appears
// This is why 'N' is present in the output, not 'n', for example
result = uniqBy('aNtidiseSTablIshmENtaRianiSM', toLowerCase);
// result = 'aNtidseblhmR'
```

*Parameters*

- `fn` (*function*): a function applied to each element in the input collection before testing the results for uniqueness.

### <a name="uniq-with"></a> `uniqWith(collection?, fn, ctx?)`

**Removes all duplicates from a collection, using a comparator function to determine what's unique.**

Comparisons are made by passing each pair of elements to the function, which must take two parameters and return a Boolean indicating whether or not the values are equal. As an example, the [`uniq`](#uniq) transformer could be regarded as the same as this transformer, with a SameValueZero function serving as the comparator.

Example:

```javascript
// magnitude returns the number of digits in a number
function magnitude(x) {
  return Math.floor(Math.log(x) / Math.LN10 + 0.000000001);
}
function comparator(a, b) {
  return magnitude(a) === magnitude(b);
}

// Returns only the first value of each magnitude
var result = uniqWith([1, 10, 100, 42, 56, 893, 1111, 1000], comparator);
// result = [1, 10, 100, 1111]
```

*Parameters*

- `fn` (*function*): a comparator function. This takes two values and returns `true` if they're to be regarded as equal.

### <a name="distinct"></a> `distinct(collection?)`

**Removes consecutive duplicate elements from a collection.**

This differs from [`uniq`](#uniq) in that an element is removed only if it equals the element *immediately preceeding* it. Comparisons between elements are done with [SameValueZero](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero).

Example:

```javascript
var result = distinct([1, 1, 2, 3, 3, 3, 4, 5, 3, 1, 5]);
// result = [1, 2, 3, 4, 5, 3, 1, 5];

// Compare to uniq with the same input
result = uniq([1, 1, 2, 3, 3, 3, 4, 5, 3, 1, 5]);
// result = [1, 2, 3, 4, 5];
```

### <a name="distinct-by"></a> `distinctBy(collection?, fn, ctx?)`

**Applies a function each element of a collection and removes consecutive elements that create duplicate return values.**

Once the function is applied to the collection elements, a comparison is made using [SameValueZero](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero). If a comparison indicates that the return value from the function for one element is the same as the return value for the element that comes right before it, only the first element is retained in the output collection.

Also note that even though the function can cause a completely different value to be compared, the *element* (not the return value of the function) is what is added to the output collection.

A very common use for `distinctBy` is to refer to a particular property in an array of objects. Another is to do a case-insensitive comparison by passing a function that turns every letter in a string to the same case. However, it can be used in any number of different ways, depending on the function used.

This is different from [`uniqBy`](#uniq-by) in that this transform only eliminates consecutive duplicate elements, not all duplicate elements.

Example:

```javascript
var array = [{x: 1}, {x: 1}, {x: 2}, {x: 3}, {x: 3}, {x: 3}, 
             {x: 4}, {x: 5}, {x: 3}, {x: 1}, {x: 5}];
function xValue(obj) {
  return obj.x;
}

var result = distinctBy(array, xValue);
// result = [{x: 1}, {x: 2}, {x: 3}, {x: 4}, {x: 5}, {x: 3}, {x: 1}, {x: 5}]

// Compare to uniqBy for the same parameters
result = uniqBy(array, xValue);
// result = [{x: 1}, {x: 2}, {x: 3}, {x: 4}, {x: 5}]
```

*Parameters*

- `fn` (*function*): a function applied to each element in the input collection before testing the results for uniqueness.

### <a name="distinct-with"></a> `distinctWith(collection?, fn, ctx?)`

**Applies a comparator function to consecutive elements of a collection and removes the second if the comparator indicates they're equal.**

Comparisons are made by passing each pair of elements to the function, which must take two parameters and return a Boolean indicating whether or not the values are equal. As an example, the [`distinct`](#distinct) transformer could be regarded as the same as this transformer, with a SameValueZero function serving as the comparator.

This is different from [`uniqWith`](#uniq-with) in that this transform only eliminates consecutive duplicate elements, not all duplicate elements.

Example:

```javascript
// magnitude returns the number of digits in a number
function magnitude(x) {
  return Math.floor(Math.log(x) / Math.LN10 + 0.000000001);
}
function comparator(a, b) {
  return magnitude(a) === magnitude(b);
}

var result = distinctWith([1, 10, 100, 42, 56, 893, 1111, 1000], comparator);
// result = [1, 10, 100, 42, 893, 1111]

// Compare to uniqWith with the same parameters
result = uniqWith([1, 10, 100, 42, 56, 893, 1111, 1000], comparator);
// result = [1, 10, 100, 1111]
```

*Parameters*

- `fn` (*function*): a comparator function. This takes two values and returns `true` if they're to be regarded as equal.

### <a name="repeat"></a> `repeat(collection?, n)`

**Repeats each element from the input collection `n` times in the output collection.**

These elements are put into the main output collection, not into subcollections. In other words, each input element creates `n` output elements.

Example:

```javascript
var result = repeat([1, 2, 3, 4, 5], 3);
// result = [1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5]
```

*Parameters*

- `n` (*integer*): the number of times to repeat each input element in the output collection.

### <a name="chunk"></a> `chunk(collection?, n)`

**Groups the elements of the input collection into arrays of length `n` in the output collection.**

Whatever the type of input collection, the groups inside the output collection will always be arrays (the output collection itself will still be of the same type as the input collection). Because of this, `chunk` doesn't do anything meaningful to collection types that cannot contain arrays (strings and objects, for instance).

If there are not enough remaining elements in the input collection to create a chunk of the proper size in the output collection, the last chunk in the output will only be large enough to contain those remaining elements.

`chunk` works on iterators (it returns a new iterator whose values are arrays), but because of technical reasons, the function has no way of knowing when the end of an iterator comes unless it happens to be at the same place as the last element of a chunk. For example, if an iterator has six values and it gets `chunk`ed into groups of three, the function will terminate correctly (because the last value of the iterator coincides with the last element of one of the chunks). However, if the same iterator had only five values, `chunk` would not terminate properly. It would return `[1, 2, 3]` for the first chunk, `[4, 5]` for the second chunk, and then `[4, 5]` over and over ad infinitum.

A workaround is to compose `chunk` with a previous [`take`](#take) with the same `n` as the length of the iterator. Since [`take`](#take) knows when it's reached the right number of elements, it can communicate that to `chunk`.

`chunk` works fine on infinite iterators.

Example:

```javascript
var result = chunk([1, 2, 3, 4, 5], 3);
// result = [[1, 2, 3], [4, 5]]
```

*Parameters*

- `n` (*integer*): the number of elements that should be in each chunk (except perhaps the last).

### <a name="chunk-by"></a> `chunkBy(collection?, fn, ctx?)`

**Breaks the elements of an input collection into arrays of consecutive elements that return the same value from a predicate function.**

Whatever the type of input collection, the groups inside the output collection will always be arrays (the output collection itself will still be of the same type as the input collection). Because of this, `chunkBy` doesn't do anything meaningful to collection types that cannot contain arrays (strings and objects, for instance).

Unlike [`chunk`](#chunk), this function does not know how many elements will be in each array until the first one that turns out to be part of the next array. Therefore, for the same reasons as in [`chunk`](#chunk) above, an iterator result is never terminated. This works fine for infinite iterators, but finite iterators should be treated with care. The same [`chunk`](#chunk) workaround with [`take`](#take) works with `chunkBy` as well.

Example:

```javascript
function isEven(x) {
  return x % 2 === 0;
}

var result = chunkBy([0, 1, 1, 2, 3, 5, 8, 13, 21, 34], isEven);
// result = [[0], [1, 1], [2], [3, 5], [8], [13, 21], [34]]
```

*Parameters*

- `fn` (*function*): a predicate function that determines where a new chunk begins in the output. When the return value of the function for an element is different than the return value for the previous element, a new chunk begins.
