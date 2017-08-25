const {
  expect,
  ARRAY_5,
  OBJECT_AB,
  LIST_5,
  five,
  naturals,
  expectIterator
} = require('../../helper');

const {
  identity,
  flatten,
  repeat
} = require('../../../src/xform/core');

const { take } = require('../../../src/xform/take');

const { List } = require('immutable');

const { sequence, into, transduce, compose } = require('../../../src/modules/transformation');
const { toReducer, arrayReducer } = require('../../../src/modules/reduction');

describe('Core transformers', () => {
  context('identity', () => {
    it('works with arrays', () => {
      expect(identity(ARRAY_5)).to.deep.equal(ARRAY_5);
    });

    it('works with objects', () => {
      expect(identity(OBJECT_AB)).to.deep.equal(OBJECT_AB);
    });

    it('works with strings', () => {
      expect(identity('hello')).to.equal('hello');
    });

    it('works with generators', () => {
      expectIterator(identity(five()), ARRAY_5);
    });

    it('works lazily with iterators', () => {
      const iter = identity(naturals());
      expect(iter.next().value).to.equal(1);
      expect(iter.next().value).to.equal(2);
      expect(iter.next().value).to.equal(3);
    });

    it('works with reducibles', () => {
      expect(identity(LIST_5).toArray()).to.deep.equal(ARRAY_5);
    });

    it('can create a transformer function', () => {
      expect(sequence(ARRAY_5, identity())).to.deep.equal(ARRAY_5);
    });

    it('passes init calls to the next transformer', () => {
      const reducer = identity()(arrayReducer);
      const result = transduce(ARRAY_5, null, reducer);
      expect(result).to.deep.equal(ARRAY_5);
    });
  });

  context('flatten', () => {
    it('works with arrays', () => {
      expect(flatten([[1, 2], [3, 4]])).to.deep.equal([1, 2, 3, 4]);
    });

    it('works with reducibles', () => {
      const input = List.of(List.of(1, 2), List.of(3, 4));
      expect(flatten(input).toArray()).to.deep.equal([1, 2, 3, 4]);
    });

    it('passes values through when they are not collections', () => {
      expect(flatten(ARRAY_5)).to.deep.equal(ARRAY_5);
    });

    it('works when combining collections with scalars', () => {
      expect(flatten([[1, 2], 3, 4, [5]])).to.deep.equal(ARRAY_5);
    });

    it('can create a transformer function', () => {
      const result = sequence([[1, 2], 3, 4, [5]], flatten());
      expect(result).to.deep.equal(ARRAY_5);
    });

    it('works in composition with a reducing transformer', () => {
      const xform = compose(take(2), flatten());
      const result = into([], [[1, 2], [3, 4], [5, 6], [7, 8]], xform);
      expect(result).to.deep.equal([1, 2, 3, 4]);
    });

    it('passes init calls to the next transformer', () => {
      const reducer = flatten()(arrayReducer);
      const result = transduce([[1, 2], 3, 4, [5]], null, reducer);
      expect(result).to.deep.equal(ARRAY_5);
    });
  });

  context('repeat', () => {
    it('works with arrays', () => {
      expect(repeat(ARRAY_5, 2)).to.deep.equal([1, 1, 2, 2, 3, 3, 4, 4, 5, 5]);
    });

    it('works with objects, thoguh it has no real effect', () => {
      expect(repeat(OBJECT_AB, 3)).to.deep.equal(OBJECT_AB);
    });

    it('works with strings', () => {
      expect(repeat('hello', 3)).to.equal('hhheeellllllooo');
    });

    it('works with generators', () => {
      expectIterator(repeat(five(), 2), [1, 1, 2, 2, 3, 3, 4, 4, 5, 5]);
    });

    it('works lazily with generators', () => {
      const iter = repeat(naturals(), 3);
      expect(iter.next().value).to.equal(1);
      expect(iter.next().value).to.equal(1);
      expect(iter.next().value).to.equal(1);
      expect(iter.next().value).to.equal(2);
      expect(iter.next().value).to.equal(2);
    });

    it('works with reducibles', () => {
      const result = repeat(LIST_5, 2);
      expect(result.toArray()).to.deep.equal([1, 1, 2, 2, 3, 3, 4, 4, 5, 5]);
    });

    it('works when composed with a reducing transformer', () => {
      const xform = compose(repeat(3), take(5));
      const result = sequence(ARRAY_5, xform);
      expect(result).to.deep.equal([1, 1, 1, 2, 2]);
    });

    it('can create a transformer function', () => {
      const result = sequence(ARRAY_5, repeat(2));
      expect(result).to.deep.equal([1, 1, 2, 2, 3, 3, 4, 4, 5, 5]);
    });

    it('passes init calls to the next transformer', () => {
      const reducer = repeat(2)(arrayReducer);
      const result = transduce(ARRAY_5, null, reducer);
      expect(result).to.deep.equal([1, 1, 2, 2, 3, 3, 4, 4, 5, 5]);
    });
  });
});
