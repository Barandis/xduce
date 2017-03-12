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

import * as u from './modules/util';
import * as p from './modules/protocol';
import * as i from './modules/iteration';
import * as r from './modules/reduction';
import * as t from './modules/transformation';

import * as core from './xform/core';
import * as map from './xform/map';
import * as filter from './xform/filter';
import * as take from './xform/take';
import * as drop from './xform/drop';
import * as uniq from './xform/uniq';
import * as distinct from './xform/distinct';
import * as chunk from './xform/chunk';

export const xduce = {
  protocols: p.protocols,

  iterator: i.iterator,

  toReducer: r.toReducer,
  toFunction: r.toFunction,
  reduce: r.reduce,

  transduce: t.transduce,
  into: t.into,
  sequence: t.sequence,
  asArray: t.asArray,
  asIterator: t.asIterator,
  asObject: t.asObject,
  asString: t.asString,

  compose: t.compose,

  util: {
    bmp: {
      charAt: u.bmpCharAt,
      length: u.bmpLength
    },
    range: u.range,
    complement: u.complement,

    isArray: u.isArray,
    isFunction: u.isFunction,
    isNumber: u.isNumber,
    isObject: u.isObject,
    isString: u.isString,

    reduced: r.reduced,
    unreduced: r.unreduced,
    isReduced: r.isReduced,
    ensureReduced: r.ensureReduced,
    ensureUnreduced: r.ensureUnreduced
  },

  identity: core.identity,
  flatten: core.flatten,
  repeat: core.repeat,
  map: map.map,
  flatMap: map.flatMap,
  filter: filter.filter,
  reject: filter.reject,
  compact: filter.compact,
  take: take.take,
  takeWhile: take.takeWhile,
  takeNth: take.takeNth,
  drop: drop.drop,
  dropWhile: drop.dropWhile,
  uniq: uniq.uniq,
  uniqBy: uniq.uniqBy,
  uniqWith: uniq.uniqWith,
  distinct: distinct.distinct,
  distinctBy: distinct.distinctBy,
  distinctWith: distinct.distinctWith,
  chunk: chunk.chunk,
  chunkBy: chunk.chunkBy
};
