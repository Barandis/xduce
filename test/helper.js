const chai = require('chai');
const p = require('../src/modules/protocol').protocols;
const Immutable = require('immutable');

Immutable.List.prototype[p.init] = () => Immutable.List().asMutable();
Immutable.List.prototype[p.step] = (acc, input) => acc.push(input);
Immutable.List.prototype[p.result] = value => value.asImmutable();

const expect = chai.expect;

const ARRAY_5 = [1, 2, 3, 4, 5];
const OBJECT_AB = { a: 1, b: 2 };
const LIST_5 = Immutable.List.of(1, 2, 3, 4, 5);

function* five() {
  for (const i of [1, 2, 3, 4, 5]) {
    yield i;
  }
}

function* naturals() {
  let i = 1;
  for (;;) {
    yield i++;
  }
}

function expectIterator(iter, expected) {
  for (const item of expected) {
    expect(iter.next().value).to.deep.equal(item);
  }
  expect(iter.next().done).to.be.true;
}

module.exports = {
  expect,
  ARRAY_5,
  OBJECT_AB,
  LIST_5,
  five,
  naturals,
  expectIterator
};
