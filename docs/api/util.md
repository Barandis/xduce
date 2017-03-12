# Utility Functions

[`bmp.charAt`](#bmp-char-at)
[`bmp.length`](#bmp-length)
[`complement`](#complement)
[`ensureReduced`](#ensure-reduced)
[`ensureUnreduced`](#ensure-unreduced)
[`isArray`](#is-array)
[`isFunction`](#is-function)
[`isNumber`](#is-number)
[`isObject`](#is-object)
[`isReduced`](#is-reduced)
[`isString`](#is-string)
[`range`](#range)
[`reduced`](#reduced)
[`unreduced`](#unreduced)

These are a few utility functions that are used internally in xduce. They don't relate directly to the usage of transducers, but since they needed to be written anyway I figured they may as well be made available.

## Type Checking Functions

These five functions were written to be as bulletproof as possible. JavaScript is a language where some strange things can happen with types, so having well-defined functions like this is helpful.

### <a name="is-array"></a> `isArray(x)`

**Determines whether a value is an array.**

This function is provided for consistency only. It merely delegates to `Array.isArray`, but with a bunch of other `isXxxx` functions, I wanted them to look consistent in the code.

*Parameters*

- `x` (*any*): the value to test as to whether it's an array.

*Returns*

- `true` if the value is an array, or `false` if it isn't.

### <a name="is-function"></a> `isFunction(x)`

**Determines whether a value is a function.**

*Parameters*

- `x` (*any*): the value to test as to whether it's a function.

*Returns*

- `true` if the value is a function, or `false` if it isn't.

### <a name="is-object"></a> `isObject(x)`

**Determines whether a value is a plain object.**

This function returns `false` if the value is any other sort of built-in object (such as an array or a string). It also returns `false` for any object that is created by a constructor that is not `Object`'s constructor. Therefore it's only going to return `true` for literal objects and for objects that were created with `new Object()` or `Object.create(null)`.

*Parameters*

- `x` (*any*): the value to test as to whether it's a plain object.

*Returns*

- `true` if the value is a plain object, or `false` if it isn't.

### <a name="is-number"></a> `isNumber(x)`

**Determines whether a value is a number.**

This will return `true` for any number literal or instance of `Number` except for `Infinity` or `NaN`. It will not return `true` for strings that happen to also be numbers.

*Parameters*

- `x` (*any*): the value to test as to whether it's a number.

*Returns*

- `true` if the value is a number that is not `NaN` or `Infinity`, or `false` if it isn't.

### <a name="is-string"></a> `isString(x)`

**Determines whether a value is a string.**

Literal strings will return `true`, as will instances of the `String` object.

*Parameters*

- `x` (*any*): the value to test as to whether it's a string.

*Returns*

- `true` if the value is a string, or `false` if it isn't.

## Reduced Status Functions

This set of functions is meant largely for people who are writing their own transformers. They control and monitor the reduced status of an object. The proper place to use this reduced status is on the accumulator in a step function - if the accumulator comes back from a step function reduced, then the transducer engine stops the transformation right there and sends the accumulator to the result function as the final result of the transformation.

It is possible to reduce an object multiple times, which means that it would have to be unreduced multiple times to keep the transformation from stopping.

Note that these functions are just markers. It is entirely possible to mark an object as reduced without ever running the [`reduce`](core.md#reduce) function. Marking an object reduced is just a status to control transformations.

### <a name="is-reduced"></a> `isReduced(x)`

**Determines whether a value is marked as reduced.**

*Parameters*

- `x` (*any*): the value to test as to whether it's reduced.

*Returns*

- `true` if the value is a string, or `false` if it isn't.

### <a name="reduced"></a> `reduced(x)`

**Marks a value as reduced.**

This is done by wrapping the value. This means three things: first, a reduced obejct may be marked as reduced again; second, a reduced value isn't usable without being unreduced first; and third any type of value (including `undefined`) may be marked as reduced.

*Parameters*

- `x` (*any*): the value to mark reduced.

*Returns*

- A reduced version of the value.

### <a name="ensure-reduced"></a> `ensureReduced(x)`

**Makes sure that a value is marked as reduced; if it is not, it will be marked as reduced.**

This differs from [`reduced`] above in that if the value is already reduced, this function won't reduce it again. Therefore thus function can't be used to multiply reduce a value.

*Parameters*

- `x` (*any*): the value to mark reduced.

*Returns*

- A reduced version of the value, or if the value is already reduced, the value itself.

### <a name="unreduced"></a> `unreduced(x)`

**Removes the reduced status from a reduced value.**

This function is intended to be used when it's certain that a value is already marked as reduced. If it is not, `undefined` will be returned instead of the value.

*Parameters*

- `x` (*reduced value*): the value to remove the reduced mark from.

*Returns*

- The unreduced value, or `undefined` if the value was already unreduced.

### <a name="ensure-unreduced"></a> `ensureUnreduced(x)`

**Removes the reduced status from a value, as long as it actually is reduced.**

This does a check to make sure the value passed in actually is reduced. If it isn't, the value itself is returned. It's meant to be used when the reduced status is uncertain.

*Parameters*

- `x` (*any*): the value to remove the reduced mark from.

*Returns*

- The unreduced value, or the value itself if it wasn't reduced in the first place.

## Basic Multilingual Plane (BMP) string functions

These functions are used by xduce to create iterators for strings in pre-ES6 environments. String iterators in ES6 account for double-width characters in the Basic Multilingual Plane, returning those double-wide characters as one iterator value.

### <a name="bmp-char-at"> `bmp.charAt(str, index)`

**Returns the character at a particular index in a string, taking double-width BMP characters into account.**

The second half of a double-width character is not given an index at all, so the index works as though all characters are single-width.

*Parameters*

- `str` (*string*): the input string, whose character at the given index is to be returned.
- `index` (*integer*): the index of the character to return.

*Returns*

- The character at the given index in the provided string. If this character is a BMP character, the full character will be returned as a two-character string.

### <a name="bmp-length"> `bmp.length(str)`

**Calculates the length of a string, taking double-width BMP characters into account.**

If the string contains any double-width characters, this function will return a different (smaller) number than the value of the `String.length` property.

*Parameters*

- `str` (*string*): the string whose length is being determined.

*Returns*

- The number of characters in the string, counting any double-wide characters as one character.

## Miscellaneous Functions

### <a name="range"></a> `range(start, end?, step?)`

**Creates an array between the specified ranges.**

The actual range is `[start, end)`, meaning that the start value is a part of the array, but the end value is not.

If only one parameter is supplied, it is taken to be `end`, and `start` is set to 0. If there is a third parameter, it defines the distance between each successive element of the array; if this is missing, it's set to 1 if `start` is less than `end` (an ascending range) or -1 if `end` is less than `start` (a descending range).

*Parameters*

- `start` (*number*): the starting value of the range. This will be the first element of the new array. If this is the *only* parameter supplied, it is instead the *end* of the range (exactly as the `end` parameter below), and the start is taken to be 0.
- `end` (*number*): the exclusive end of the range, meaning that this number does *not* become part of the range itself. If this is missing, the first parameter is taken to be the end, and the start is 0.
- `step` (*number*): the amount that each element of the array increases over the last, defaulting to 1 (if `end` is greater than `start`) or -1 (if `start` is greater than `end`).

*Returns*

- An array starting at `start`, with each element increasing by `step` until it reaches the last number before `end`.

### <a name="complement"></a> `complement(fn)`

**Creates a function that returns the opposite of the supplied predicate function.**

The input function can take any parameters; the resulting function will take those parameters as well.

*Parameters*

- `fn` (*function*): a predicate function.

*Returns*

- A function identical to the provided function, but that returns the opposite result.
