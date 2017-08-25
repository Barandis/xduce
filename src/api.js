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

const {
  bmpCharAt,
  bmpLength,
  range,
  complement,
  isArray,
  isFunction,
  isNumber,
  isObject,
  isString } = require('./modules/util');
const {
  reduced,
  unreduced,
  isReduced,
  ensureReduced,
  ensureUnreduced } = require('./modules/reduction');

const util = {
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

  reduced,
  unreduced,
  isReduced,
  ensureReduced,
  ensureUnreduced
};

const { protocols } = require('./modules/protocol');
const { iterator } = require('./modules/iteration');
const { toReducer, toFunction, reduce } = require('./modules/reduction');
const {
  transduce, into, sequence, asArray, asIterator, asObject, asString, compose } = require('./modules/transformation');

const { chunk, chunkBy } = require('./xform/chunk');
const { identity, flatten, repeat } = require('./xform/core');
const { distinct, distinctBy, distinctWith } = require('./xform/distinct');
const { drop, dropWhile } = require('./xform/drop');
const { filter, reject, compact } = require('./xform/filter');
const { map, flatMap } = require('./xform/map');
const { take, takeWhile, takeNth } = require('./xform/take');
const { uniq, uniqBy, uniqWith } = require('./xform/uniq');

module.exports = {
  util,
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
  uniq,
  uniqBy,
  uniqWith
};
