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
  drop,
  dropWhile
} = require('../../../src/xform/drop');

const { sequence, transduce } = require('../../../src/modules/transformation');
const { arrayReducer } = require('../../../src/modules/reduction');
const { complement } = require('../../../src/modules/util');

const lt4 = (x) => x < 4;
const lt4Value = ({v}) => v < 4;
const isVowel = (x) => !!~'aeoiu'.indexOf(x);

describe('Dropping transformers', () => {
  context('drop', () => {
    it('works with arrays', () => {
      expect(drop(ARRAY_5, 3)).to.deep.equal([4, 5]);
    });

    it('works with objects', () => {
      expect(drop(OBJECT_AB, 1)).to.deep.equal({b: 2});
    });

    it('works with strings', () => {
      expect(drop('hello', 3)).to.equal('lo');
    });

    it('works with generators', () => {
      expectIterator(drop(five(), 3), [4, 5]);
    });

    it('works lazily with generators', () => {
      const iter = drop(naturals(), 3);
      expect(iter.next().value).to.equal(4);
      expect(iter.next().value).to.equal(5);
      expect(iter.next().value).to.equal(6);
    });

    it('works with reducibles', () => {
      expect(drop(LIST_5, 3).toArray()).to.deep.equal([4, 5]);
    });

    it('can create a transformer function', () => {
      const result = sequence(ARRAY_5, drop(3));
      expect(result).to.deep.equal([4, 5]);
    });

    it('passes init calls to the next transformer', () => {
      const reducer = drop(3)(arrayReducer);
      const result = transduce(ARRAY_5, null, reducer);
      expect(result).to.deep.equal([4, 5]);
    });
  });

  context('dropWhile', () => {
    it('works with arrays', () => {
      expect(dropWhile(ARRAY_5, lt4)).to.deep.equal([4, 5]);
    });

    it('works with objects', () => {
      expect(dropWhile({a: 1, b: 2, c: 6}, lt4Value)).to.deep.equal({c: 6});
    });

    it('works with strings', () => {
      expect(dropWhile('strawberry', complement(isVowel))).to.equal('awberry');
    });

    it('works with generators', () => {
      expectIterator(dropWhile(five(), lt4), [4, 5]);
    });

    it('works lazily with generators', () => {
      const iter = dropWhile(naturals(), lt4);
      expect(iter.next().value).to.equal(4);
      expect(iter.next().value).to.equal(5);
      expect(iter.next().value).to.equal(6);
    });

    it('works with reducibles', () => {
      expect(dropWhile(LIST_5, lt4).toArray()).to.deep.equal([4, 5]);
    });

    it('can create a transformer function', () => {
      const value = sequence(ARRAY_5, dropWhile(lt4));
      expect(value).to.deep.equal([4, 5]);
    });

    it('can accept a context object', () => {
      const ctx = { fn: lt4 };
      const fn = function (x) { return this.fn(x); };
      expect(dropWhile(ARRAY_5, fn, ctx)).to.deep.equal([4, 5]);
    });

    it('passes init calls to the next transformer', () => {
      const reducer = dropWhile(lt4)(arrayReducer);
      const result = transduce(ARRAY_5, null, reducer);
      expect(result).to.deep.equal([4, 5]);
    });
  });
});
