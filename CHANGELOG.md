# Change Log

All notable changes to the library will be documented in this file.

## [unreleased]
### Changed
- Added a consistent set of linting rules and ran them, fixing all of the linting errors.
- Augmented the liniting rules with prettier to format everything consistently.
- Changed the names of transduction protocol properties to use symbols insteaed of strings, as long as symbols are available in the environment where the library is being used. This has no effect on the operation of the library, but it could affect the way it interfaces with other libraries (older CSP libraries, for instance, expect string property names).
- Changed some internal naming conventions. The terminology around tranducers is a bit subtle, but I have an idea about how I want to go about that now. This does not affect any part of the public API.

## [0.8.2] 2017-03-16
### Added
- An unminified version of the library (`xduce.js`) to go along with the minified version (`xduce.min.js`, formerly `xduce.js`). This simply makes it like it was pre-0.8.0.
- Support for Travis CI and Coveralls.

## [0.8.1] 2017-03-11
### Changed
- Fixed a silly problem with the API file where everything was under an extra `xduce` property, so what was `xduce.map` instead had to be referred to as `xduce.xduce.map`. It wasn't caught because all of the tests were against underlying files and nothing was actually testing `api.js`. Silly mistake that has been fixed.

## [0.8.0] 2017-03-11
### Changed
- The entire library has been rewritten in ES2015 and transpiled into a browser-ready ES5 package. There just doesn't seem to be any reason to not write in ES2015 anymore. There have been some changes to coding philosophy - accepting that JavaScript doesn't have classes and stopping trying to pretend that it does, for instance - but the API remains exactly the same.
- A few additional tests have been written to cover some lines of code that had remained uncovered. While none of this code was likely to be used often, it did uncover a few bugs that may have caused some problems in unusual situations.
- A new build process is in place. Gulp is gone because, while it's an excellent tool, it's like using a sledgehammer to kill a fly in a project this small (the number of dependencies. Yarn is now in place just to try it out a little bit, so far with good results. Coverage is now being done with nyc to run istanbul. Browserify was replaced with Webpack. Babel was added for transpiling. The end result is that, despite the additional transpiling step necessary with the switch to ES2015, the number of dev dependencies has been halved.
- Since the code has changed drastically and since the library isn't to version 1.0 yet anyway, it seemed best to delete the old Github project and create a new one for this release.

## [0.7.1] 2016-07-12
- No changes. A build wasn't done for the 0.7.0 release, and NPM doesn't allow for re-doing a version number. Hence the new one.

## [0.7.0] 2016-07-12
### Added
- BMP string functions and type-checking functions that were already present in the code have been made a part of the public API and are located on the `xduce.util` object.
- A second parameter to `iterator`, which is a sort function used to sort object elements by key.
- A third parameter to `iterator`, which determines whether iteration over objects returns `{key: value}` (`false`) or `{k: key, v: value}` (`true`). The default is `true`.
- an `identity` transformer function that simply passes the collection through without modifying it.

### Removed
- the `reducer` function.
- the `iterator/object` protocol.

### Changed
- Changed `toReducer` to take any kind of object, just like `reducer` used to. The two functions were basically exactly the same, except that `toReducer` only worked with functions. `toReducer` now replaces `reducer`.
- Rearranged the properties on the `xduce` object. There is now an `xduce.util` object that houses all of the functions that don't directly have to do using transducers. The reduction-checking functions have been put there, along with `complement` and `range`.
- Reducing a non-object to an object now produces something other than an empty object. Keys are created starting at 0 and increasing by 1 for each item, with the input element as the value. For example, `asObject([1, 2])` will now produce `{ 0: 1, 1: 2 }`. Before, this would have produced `{}`.
- Object iteration now sorts alphabetically by key, unless a different (by-key) sort function is sent to `iterator`.
- Object reduction (by all built-in reducers) now recognizes the `{k: key, v: value}` form (kv-form). This means that any functions sent to mapping transformers can output objects in either `{key: value}` or in kv-form. Kv-form is now recognized by having an object with exactly two properties, one named `'k'` and one named `'v'`, rather than by the `iterator/object` protocol. This will make it much more straightforward to write mapping functions that use kv-form.

## [0.6.0] 2016-07-08
### Changed
- Rewrote the entire project in JavaScript. It had originally been in LiveScript, a legacy of when I started it and was writing a lot of things in LiveScript. I changed it because of some inefficiencies that I didn't like in the compilation, and the difficulty of using some new JS things like Object.defineProperty in context of the LS class system.
- Flipped, and then flopped, on the location of transformer functions. I'm keeping them on the root object because it doesn't seem right to have them on a sub-object when they're often the only thing in the library that will see use.
- Changed `deref` to `unreduced` in an effort to name things more consistently. `deref` was in a couple of other transducer libraries, I'm sure inspired by Clojure, but it seemed to have exactly one reduction function without 'reduce' in the name.
- Tightened up `isReduced` and `unreduced` to be able to handle any kind of value (including `undefined`). Also `isReduced` always returns an actual Boolean now.
- Changed the implementation and semantics of `isObject` and `isNumber` to what I had really wanted them to be. `isObject` now returns `true` *only* for literal objects and objects that are created from the Object constructor, not from objects created from other constructors. `isNumber` returns `true` only for actual numbers (not for strings that are numbers), and not for `Infinity` or `NaN`.
- Changed `isArray` to just call `Array.isArray`. The requirements of the library are such that any environment that could run it has `Array.isArray` anyway. This means that `isArray` is just present now for consistency; it doesn't do anything `Array.isArray` doesn't alreayd do.

## [0.5.0] 2016-06-29
### Added
- Initial version. Version number was chosen somewhat arbitrarily. I didn't want to use 0.1 because I'd been playing with this code very sporadically over a year or so.
