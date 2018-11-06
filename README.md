# Xduce: Transducers for JavaScript

A transducer library for JavaScript

[![Version](https://img.shields.io/npm/v/xduce.svg)](https://www.npmjs.com/package/xduce)
[![Build Status](https://img.shields.io/travis/Barandis/xduce/master.svg)](https://travis-ci.org/Barandis/xduce)
[![Coverage Status](https://img.shields.io/coveralls/Barandis/xduce/master.svg)](https://coveralls.io/github/Barandis/xduce)
[![Downloads](https://img.shields.io/npm/dm/xduce.svg)](http://npm-stats.com/~packages/xduce)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![License](https://img.shields.io/github/license/Barandis/xduce.svg)](https://opensource.org/licenses/MIT)

Transducers are a way of performing transformations on collections without regard to the type of collection. In other
words, the same `map` transducer can be used to map elements of an array, characters in a string, key/value pairs in
an object, or yielded values in a generator. This can easily be extended to *any* collection type by adding 3-4
properties to that collection type to tell Xduce how to work with it.

Because all of the internal processes of working with collections are separated cleanly, an Xduce transducer can even
take input from a collection of one type and create an output collection of a different type.

The Communicating Sequential Processes (CSP) package [Cispy](https://barandis.github.io/cispy) supports associating
Xduce transducers with a CSP channel. The same transducers that you can use to map or filter an array can also be used
to map or filter values put onto a channel.

## Features

 - 21 built-in transducers that work on all supported collection types
 - Arrays, strings, objects, and iterators are supported out of the box
 - Any other collection type can be supported by adding 3-4 properties to the collection object
 - Collections of any type can be changed into collections of any other type
 - All transducers can be composed in any number or order
 - Custom iterators can be created from functions and then transduced
 - Custom reducers from functions can reduce any collection into any collection or non-collection type
 - Object iteration in a natural way, with custom sorting and selectable object element formats
 - Supported natively by [Cispy](https://barandis.github.io/cispy) for use with CSP channels
 - Usable in node.js or the browser
 - Supports CommonJS, AMD, or use as a global object

## Documentation

See [the github.io page](https://barandis.github.io/xduce) for all of the documentation.

## License

[MIT License](hhttps://opensource.org/licenses/MIT)
