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

import {
  bmpCharAt,
  bmpLength,
  range,
  complement,
  isArray,
  isFunction,
  isNumber,
  isObject,
  isString } from './modules/util';
import {
  reduced,
  unreduced,
  isReduced,
  ensureReduced,
  ensureUnreduced } from './modules/reduction';

export const util = {
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

export { protocols } from './modules/protocol';
export { iterator } from './modules/iteration';
export { toReducer, toFunction, reduce } from './modules/reduction';
export { transduce, into, sequence, asArray, asIterator, asObject, asString, compose } from './modules/transformation';

export { chunk, chunkBy } from './xform/chunk';
export { identity, flatten, repeat } from './xform/core';
export { distinct, distinctBy, distinctWith } from './xform/distinct';
export { drop, dropWhile } from './xform/drop';
export { filter, reject, compact } from './xform/filter';
export { map, flatMap } from './xform/map';
export { take, takeWhile, takeNth } from './xform/take';
export { uniq, uniqBy, uniqWith } from './xform/uniq';
