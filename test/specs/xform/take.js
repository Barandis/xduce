const {
  expect,
  expectIterator,
  ARRAY_5,
  OBJECT_AB,
  LIST_5,
  five,
  naturals
} = require('../../helper');

const {
  take,
  takeWhile,
  takeNth
} = require('../../../src/xform/take');

const { List } = require('immutable');

const { complement, range } = require('../../../src/modules/util');

const { map } = require('../../../src/xform/map');
const { filter } = require('../../../src/xform/filter');

const { sequence, compose, transduce } = require('../../../src/modules/transformation');
const { arrayReducer } = require('../../../src/modules/reduction');

const lt4 = (x) => x < 4;
const lt4Value = ({v}) => v < 4;
const isVowel = (x) => !!~'aeoiu'.indexOf(x);

describe('Taking transformers', () => {
  context('take', () => {
    it('works with arrays', () => {
      expect(take(ARRAY_5, 3)).to.deep.equal([1, 2, 3]);
    });

    it('works with objects', () => {
      expect(take(OBJECT_AB, 1)).to.deep.equal({a: 1});
    });

    it('works with strings', () => {
      expect(take('hello', 3)).to.equal('hel');
    });

    it('works with generators', () => {
      expectIterator(take(five(), 3), [1, 2, 3]);
    });

    it('creates finite iterators from infinite iterators', () => {
      expectIterator(take(naturals(), 3), [1, 2, 3]);
    });

    it('limits infinite iterators when composed', () => {
      const xform1 = compose(filter(x => x > 4), map(x => x + 2), take(3));
      const xform2 = compose(take(3), filter(x => x % 2 === 0), map(x => x + 2));

      expectIterator(sequence(naturals(), xform1), [7, 8, 9]);
      expectIterator(sequence(naturals(), xform2), [4]);
    });

    it('works with reducibles', () => {
      expect(take(LIST_5, 3).toArray()).to.deep.equal([1, 2, 3]);
    });

    it('can create a transformer function', () => {
      const result = sequence(ARRAY_5, take(3));
      expect(result).to.deep.equal([1, 2, 3]);
    });

    it('passes init calls to the next transformer', () => {
      const reducer = take(3)(arrayReducer);
      const result = transduce(ARRAY_5, null, reducer);
      expect(result).to.deep.equal([1, 2, 3]);
    });
  });

  context('takeWhile', () => {
    it('works with arrays', () => {
      expect(takeWhile(ARRAY_5, lt4)).to.deep.equal([1, 2, 3]);
    });

    it('works with objects', () => {
      expect(takeWhile({a: 1, b: 2, c: 6}, lt4Value)).to.deep.equal(OBJECT_AB);
    });

    it('works with strings', () => {
      expect(takeWhile('strawberry', complement(isVowel))).to.equal('str');
    });

    it('works with generators', () => {
      expectIterator(takeWhile(five(), lt4), [1, 2, 3]);
    });

    it('creates finite iterators from infinite iterators', () => {
      expectIterator(takeWhile(naturals(), lt4), [1, 2, 3]);
    });

    it('works with reducibles', () => {
      expect(takeWhile(LIST_5, lt4).toArray()).to.deep.equal([1, 2, 3]);
    });

    it('can create a transformer function', () => {
      const result = sequence(ARRAY_5, takeWhile(lt4));
      expect(result).to.deep.equal([1, 2, 3]);
    });

    it('can accept a context object', () => {
      const ctx = { fn: lt4 };
      const fn = function (x) { return this.fn(x); };
      expect(takeWhile(ARRAY_5, fn, ctx)).to.deep.equal([1, 2, 3]);
    });

    it('passes init calls to the next transformer', () => {
      const reducer = takeWhile(lt4)(arrayReducer);
      const result = transduce(ARRAY_5, null, reducer);
      expect(result).to.deep.equal([1, 2, 3]);
    });
  });

  context('takeNth', () => {
    it('works with arrays', () => {
      expect(takeNth(range(1, 11), 3)).to.deep.equal([1, 4, 7, 10]);
    });

    it('works with objects', () => {
      expect(takeNth({a: 1, b: 2, c: 3}, 2)).to.deep.equal({a: 1, c: 3});
    });

    it('works with strings', () => {
      expect(takeNth('antidisestablishmentarianism', 3)).to.equal('aistlhnrnm');
    });

    it('works with generators', () => {
      expectIterator(takeNth(five(), 3), [1, 4]);
    });

    it('works lazily with generators', () => {
      const iter = takeNth(naturals(), 3);
      expect(iter.next().value).to.equal(1);
      expect(iter.next().value).to.equal(4);
      expect(iter.next().value).to.equal(7);
      expect(iter.next().value).to.equal(10);
      expect(iter.next().value).to.equal(13);
    });

    it('works with reducibles', () => {
      const input = List.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
      const result = takeNth(input, 3);
      expect(result.toArray()).to.deep.equal([1, 4, 7, 10]);
    });

    it('can create a transformer function', () => {
      const result = sequence(range(1, 11), takeNth(3));
      expect(result).to.deep.equal([1, 4, 7, 10]);
    });

    it('passes init calls to the next transformer', () => {
      const reducer = takeNth(2)(arrayReducer);
      const result = transduce(ARRAY_5, null, reducer);
      expect(result).to.deep.equal([1, 3, 5]);
    });
  });
});
