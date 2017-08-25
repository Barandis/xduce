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
  filter,
  reject,
  compact
} = require('../../../src/xform/filter');

const { fromJS } = require('immutable');

const { sequence, transduce } = require('../../../src/modules/transformation');
const { arrayReducer } = require('../../../src/modules/reduction');

const even = (x) => x % 2 === 0;
const evenValue = ({k, v}) => v % 2 === 0;
const lcase = (x) => x === x.toLowerCase();

describe('Filtering transformers', () => {
  context('filter', () => {
    it('works with arrays', () => {
      expect(filter(ARRAY_5, even)).to.deep.equal([2, 4]);
    });

    it('works with objects', () => {
      expect(filter(OBJECT_AB, evenValue)).to.deep.equal({b: 2});
    });

    it('works with strings', () => {
      expect(filter('HeLlO WORld', lcase)).to.equal('el ld');
    });

    it('works with generators', () => {
      expectIterator(filter(five(), even), [2, 4]);
    });

    it('works lazily with generators', () => {
      const iter = filter(naturals(), even);
      expect(iter.next().value).to.equal(2);
      expect(iter.next().value).to.equal(4);
      expect(iter.next().value).to.equal(6);
    });

    it('works with reducibles', () => {
      expect(filter(LIST_5, even).toArray()).to.deep.equal([2, 4]);
    });

    it('can create a transformer function', () => {
      const result = sequence(ARRAY_5, filter(even));
      expect(result).to.deep.equal([2, 4]);
    });

    it('can accept a context object', () => {
      const ctx = { fn: even };
      const fn = function (x) { return this.fn(x); };
      expect(filter(ARRAY_5, fn, ctx)).to.deep.equal([2, 4]);
    });

    it('passes init calls to the next transformer', () => {
      const reducer = filter(even)(arrayReducer);
      const result = transduce(ARRAY_5, null, reducer);
      expect(result).to.deep.equal([2, 4]);
    });
  });

  context('reject', () => {
    it('works with arrays', () => {
      expect(reject(ARRAY_5, even)).to.deep.equal([1, 3, 5]);
    });

    it('works with objects', () => {
      expect(reject(OBJECT_AB, evenValue)).to.deep.equal({a: 1});
    });

    it('works with strings', () => {
      expect(reject('HeLlO WORld', lcase)).to.equal('HLOWOR');
    });

    it('works with generators', () => {
      expectIterator(reject(five(), even), [1, 3, 5]);
    });

    it('works lazily with generators', () => {
      const iter = reject(naturals(), even);
      expect(iter.next().value).to.equal(1);
      expect(iter.next().value).to.equal(3);
      expect(iter.next().value).to.equal(5);
    });

    it('works with reducibles', () => {
      expect(reject(LIST_5, even).toArray()).to.deep.equal([1, 3, 5]);
    });

    it('can create a transformer function', () => {
      const result = sequence(ARRAY_5, reject(even));
      expect(result).to.deep.equal([1, 3, 5]);
    });

    it('can accept a context object', () => {
      const ctx = { fn: even };
      const fn = function (x) { return this.fn(x); };
      expect(reject(ARRAY_5, fn, ctx)).to.deep.equal([1, 3, 5]);
    });

    it('passes init calls to the next transformer', () => {
      const reducer = reject(even)(arrayReducer);
      const result = transduce(ARRAY_5, null, reducer);
      expect(result).to.deep.equal([1, 3, 5]);
    });
  });

  context('compact', () => {
    const array = [1, 0, 2, null, 3, undefined, 4, '', 5];

    it('works with arrays', () => {
      expect(compact(array)).to.deep.equal(ARRAY_5);
    });

    it('works with generators', () => {
      function* gen() {
        for (let item of array) {
          yield item;
        }
      }
      expectIterator(compact(gen()), ARRAY_5);
    });

    it('works with reducibles', () => {
      expect(compact(fromJS(array)).toArray()).to.deep.equal(ARRAY_5);
    });

    it('can create a transformer function', () => {
      const result = sequence(array, compact());
      expect(result).to.deep.equal(ARRAY_5);
    });

    it('passes init calls to the next transformer', () => {
      const reducer = compact()(arrayReducer);
      const result = transduce(array, null, reducer);
      expect(result).to.deep.equal(ARRAY_5);
    });
  });
});
