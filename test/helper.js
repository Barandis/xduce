import chai from 'chai';

import { protocols as p } from '../src/modules/protocol';

import Immutable from 'immutable';
  
Immutable.List.prototype[p.init] = function () {
  return Immutable.List().asMutable();
};
Immutable.List.prototype[p.step] = function (acc, input) {
  return acc.push(input);
};
Immutable.List.prototype[p.result] = function (value) {
  return value.asImmutable();
};

export const expect = chai.expect;

export const ARRAY_5   = [1, 2, 3, 4, 5];
export const OBJECT_AB = {a: 1, b: 2};
export const LIST_5    = Immutable.List.of(1, 2, 3, 4, 5);

export function* five() {
  for (let i of [1, 2, 3, 4, 5]) {
    yield i;
  }
}

export function* naturals() {
  let i = 1;
  while (true) {
    yield i++;
  }
}

export function expectIterator(iter, expected) {
  for (let item of expected) {
    expect(iter.next().value).to.deep.equal(item);
  }
  expect(iter.next().done).to.be.true;
}
