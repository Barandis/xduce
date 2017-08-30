# xduce: Transducers for JavaScript

A transducer library for JavaScript

[![Build Status](https://img.shields.io/travis/barandis/xduce/master.svg)](https://travis-ci.org/barandis/xduce)
[![Coverage Status](https://img.shields.io/coveralls/barandis/xduce/master.svg)](https://coveralls.io/github/barandis/xduce)
[![Version](https://img.shields.io/npm/v/xduce.svg)](https://www.npmjs.com/package/xduce)
[![Downloads](https://img.shields.io/npm/dm/xduce.svg)](http://npm-stats.com/~packages/xduce)
[![License](https://img.shields.io/github/license/barandis/xduce.svg)](https://opensource.org/licenses/MIT)

## Installation

In node.js (or using Browserify, Webpack, etc.):
```
npm install xduce
```

In the browser:

Download [lib/xduce.js](https://raw.githubuserscontent.com/Barandis/xduce/master/lib/xduce.js) or its minified version [lib/xduce.min.js](https://raw.githubuserscontent.com/Barandis/xduce/master/lib/xduce.min.js) and put it into the directory of your choice.

## Usage

In node.js (or with browserify, etc.):
```javascript
var xduce = require('xduce');
xduce.map([1, 2, 3, 4, 5], function (x) { return x + 1; });
```

In the browser:
```html
<script src="js/xduce.js"></script>
<script>
  xduce.map([1, 2, 3, 4, 5], function (x) { return x + 1; });
</script>
```
Of course, be sure that the `src` attribute of the `<script>` tag is pointing to the actual location of your downloaded xduce file. This exposes a global variable named `xduce`.

## Documentation

[API documentation](docs/api.md) is complete for every public function in the library. Discussion of the concepts will also happen at some point.

## Inspiration

Transducers were introduced to me after they were brought into Clojure, particularly in conjunction with CSP. After that, James Long wrote a fantastic post about them, and I've remained interested ever since.

* [Transducers.js: A JavaScript Library for Transformation of Data](http://jlongster.com/Transducers.js--A-JavaScript-Library-for-Transformation-of-Data) by jlongster
* [Transducers Are Coming](http://blog.cognitect.com/blog/2014/8/6/transducers-are-coming) by Rich Hickey

## License

[MIT](https://raw.githubusercontent.com/Barandis/xduce/master/LICENSE) License
