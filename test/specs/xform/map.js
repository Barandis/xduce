const { expect, expectIterator, ARRAY_5, OBJECT_AB, LIST_5, five, naturals } = require('../../helper');
const { map, flatMap } = require('../../../src/xform/map');
const { List } = require('immutable');
const { sequence, transduce } = require('../../../src/modules/transformation');
const { arrayReducer } = require('../../../src/modules/reduction');

const add1 = x => x + 1;
const ucaseKey = ({ k, v }) => ({ [k.toUpperCase()]: v + 1 });
const ucase = x => x.toUpperCase();

describe('Mapping transformers', () => {
  context('map', () => {
    it('works with arrays', () => {
      expect(map(ARRAY_5, add1)).to.deep.equal([2, 3, 4, 5, 6]);
    });

    it('works with objects', () => {
      expect(map(OBJECT_AB, ucaseKey)).to.deep.equal({ A: 2, B: 3 });
    });

    it('works with strings', () => {
      expect(map('hello', ucase)).to.equal('HELLO');
    });

    it('works with generators', () => {
      expectIterator(map(five(), add1), [2, 3, 4, 5, 6]);
    });

    it('works lazily with generators', () => {
      const iter = map(naturals(), add1);
      expect(iter.next().value).to.equal(2);
      expect(iter.next().value).to.equal(3);
      expect(iter.next().value).to.equal(4);
    });

    it('works with reducibles', () => {
      expect(map(LIST_5, add1).toArray()).to.deep.equal([2, 3, 4, 5, 6]);
    });

    it('can create a transformer function', () => {
      const result = sequence(ARRAY_5, map(add1));
      expect(result).to.deep.equal([2, 3, 4, 5, 6]);
    });

    it('can accept another object to use as context', () => {
      const ctx = { fn: add1 };
      const fn = function(x) {
        return this.fn(x);
      };
      const result = map(ARRAY_5, fn, ctx);
      expect(result).to.deep.equal([2, 3, 4, 5, 6]);
    });

    it('passes init calls to the next transformer', () => {
      const reducer = map(add1)(arrayReducer);
      const result = transduce(ARRAY_5, null, reducer);
      expect(result).to.deep.equal([2, 3, 4, 5, 6]);
    });
  });

  context('flatMap', () => {
    context('when passed a function that returns scalars', () => {
      it('works with arrays', () => {
        expect(flatMap(ARRAY_5, add1)).to.deep.equal([2, 3, 4, 5, 6]);
      });

      it('works with objects', () => {
        expect(flatMap(OBJECT_AB, ucaseKey)).to.deep.equal({ A: 2, B: 3 });
      });

      it('works with strings', () => {
        expect(flatMap('hello', ucase)).to.equal('HELLO');
      });

      it('works with generators', () => {
        expectIterator(flatMap(five(), add1), [2, 3, 4, 5, 6]);
      });

      it('works lazily with iterators', () => {
        const iter = flatMap(naturals(), add1);
        expect(iter.next().value).to.equal(2);
        expect(iter.next().value).to.equal(3);
        expect(iter.next().value).to.equal(4);
      });

      it('works with reducibles', () => {
        expect(flatMap(LIST_5, add1).toArray()).to.deep.equal([2, 3, 4, 5, 6]);
      });

      it('can create a transformer function', () => {
        const result = sequence(ARRAY_5, flatMap(add1));
        expect(result).to.deep.equal([2, 3, 4, 5, 6]);
      });

      it('can accept a context object', () => {
        const ctx = { fn: add1 };
        const fn = function(x) {
          return this.fn(x);
        };
        const result = flatMap(ARRAY_5, fn, ctx);
        expect(result).to.deep.equal([2, 3, 4, 5, 6]);
      });
    });

    context('when passed a function that returns collections', () => {
      it('works with arrays', () => {
        const fn = x => [x, x + 1];
        expect(flatMap(ARRAY_5, fn)).to.deep.equal([1, 2, 2, 3, 3, 4, 4, 5, 5, 6]);
      });

      it('works with arrays when the function returns strings', () => {
        const fn = x => `${x}${x + 1}`;
        expect(flatMap(ARRAY_5, fn)).to.deep.equal(['1', '2', '2', '3', '3', '4', '4', '5', '5', '6']);
      });

      it('works with objects', () => {
        const fn = ({ k, v }) => ({
          [k]: v + 1,
          [k + k]: (v + 1) * 10
        });
        const result = flatMap(OBJECT_AB, fn);
        expect(result).to.deep.equal({ a: 2, aa: 20, b: 3, bb: 30 });
      });

      it('works with objects when the function returns an array of objects', () => {
        const fn = ({ k, v }) => [{ [k]: v + 1 }, { [k + k]: (v + 1) * 10 }];
        const result = flatMap(OBJECT_AB, fn);
        expect(result).to.deep.equal({ a: 2, aa: 20, b: 3, bb: 30 });
      });

      it('works with strings', () => {
        const fn = x => x + x.toLowerCase() + x.toUpperCase();
        expect(flatMap('Hello', fn)).to.equal('HhHeeEllLllLooO');
      });

      it('works with generators', () => {
        const fn = x => [x, x + 1];
        expectIterator(flatMap(five(), fn), [1, 2, 2, 3, 3, 4, 4, 5, 5, 6]);
      });

      it('works lazily with generators', () => {
        const fn = x => [x, x + 1];
        const iter = flatMap(naturals(), fn);
        expect(iter.next().value).to.equal(1);
        expect(iter.next().value).to.equal(2);
        expect(iter.next().value).to.equal(2);
        expect(iter.next().value).to.equal(3);
        expect(iter.next().value).to.equal(3);
      });

      it('works with reducibles', () => {
        const fn = x => List.of(x, x + 1);
        const result = flatMap(LIST_5, fn);
        expect(result.toArray()).to.deep.equal([1, 2, 2, 3, 3, 4, 4, 5, 5, 6]);
      });

      it('works with reducibles when the function returns an array', () => {
        const fn = x => [x, x + 1];
        const result = flatMap(LIST_5, fn);
        expect(result.toArray()).to.deep.equal([1, 2, 2, 3, 3, 4, 4, 5, 5, 6]);
      });

      it('can create a transformer function', () => {
        const fn = x => [x, x + 1];
        const result = sequence(ARRAY_5, flatMap(fn));
        expect(result).to.deep.equal([1, 2, 2, 3, 3, 4, 4, 5, 5, 6]);
      });

      it('can accept a context object', () => {
        const ctx = {
          fn(x) {
            return [x, x + 1];
          }
        };
        const fn = function(x) {
          return this.fn(x);
        };
        expect(flatMap(ARRAY_5, fn, ctx)).to.deep.equal([1, 2, 2, 3, 3, 4, 4, 5, 5, 6]);
      });

      it('passes init calls to the next transformer', () => {
        const reducer = flatMap(x => [x, x + 1])(arrayReducer);
        const result = transduce(ARRAY_5, null, reducer);
        expect(result).to.deep.equal([1, 2, 2, 3, 3, 4, 4, 5, 5, 6]);
      });
    });
  });
});
