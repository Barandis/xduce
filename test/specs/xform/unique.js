const { expect, expectIterator, naturals } = require('../../helper');
const { unique, uniqueBy, uniqueWith } = require('../../../src/xform/unique');
const { fromJS, List } = require('immutable');
const { sequence, transduce } = require('../../../src/modules/transformation');
const { arrayReducer } = require('../../../src/modules/reduction');

const arrayEx = [1, 5, 2, 2, 4, 5, 3, 3, 2];
const objectEx = { a: 1, b: 5, c: 2, d: 2, e: 4, f: 5, g: 4, h: 3, i: 3, j: 2 };
const aoEx = [{ x: 1 }, { x: 5 }, { x: 2 }, { x: 2 }, { x: 4 }, { x: 5 }, { x: 3 }, { x: 3 }, { x: 2 }];
const stringEx = '1522454332';
const genEx = function*() {
  for (const i of arrayEx) {
    yield i;
  }
};
const goEx = function*() {
  for (const i of aoEx) {
    yield i;
  }
};
const listEx = fromJS(arrayEx);
const loEx = List.of({ x: 1 }, { x: 5 }, { x: 2 }, { x: 2 }, { x: 4 }, { x: 5 }, { x: 3 }, { x: 3 }, { x: 2 });

const byX = ({ x }) => x;
const byValue = ({ v }) => v;
const byMod3 = x => x % 3;

const arrayLog = [17504, 2, 274, 105, 15, 21012, 770, 79239, 2058, 4462];
const objectLog = { a: 17504, b: 2, c: 274, d: 105, e: 15, f: 21012, g: 770, h: 79239, i: 2058, j: 4462 };
const stringLog = 'Antidisestablishmentarianism';
const genLog = function*() {
  for (const i of arrayLog) {
    yield i;
  }
};
const listLog = fromJS(arrayLog);

const magnitude = x => Math.floor(Math.log(x) / Math.LN10 + 0.000000001);
const magComp = (a, b) => magnitude(a) === magnitude(b);
const valueMagComp = (a, b) => magnitude(a.v) === magnitude(b.v);
const groupComp = (a, b) => Math.floor(a.charCodeAt(0) / 5) === Math.floor(b.charCodeAt(0) / 5);

describe('Uniqueness transducers', () => {
  context('unique', () => {
    it('works with arrays', () => {
      expect(unique(arrayEx)).to.deep.equal([1, 5, 2, 4, 3]);
    });

    it('works with strings', () => {
      expect(unique(stringEx)).to.equal('15243');
    });

    it('works with generators', () => {
      expectIterator(unique(genEx()), [1, 5, 2, 4, 3]);
    });

    it('works lazily with generators', () => {
      const iter = unique(naturals());
      expect(iter.next().value).to.equal(1);
      expect(iter.next().value).to.equal(2);
      expect(iter.next().value).to.equal(3);
    });

    it('works with reducibles', () => {
      expect(unique(listEx).toArray()).to.deep.equal([1, 5, 2, 4, 3]);
    });

    it('can create a transformer function', () => {
      const result = sequence(arrayEx, unique());
      expect(result).to.deep.equal([1, 5, 2, 4, 3]);
    });

    it('passes init calls to the next transformer', () => {
      const reducer = unique()(arrayReducer);
      const result = transduce(arrayEx, null, reducer);
      expect(result).to.deep.equal([1, 5, 2, 4, 3]);
    });
  });

  context('uniqueBy', () => {
    it('works with arrays', () => {
      expect(uniqueBy(aoEx, byX)).to.deep.equal([{ x: 1 }, { x: 5 }, { x: 2 }, { x: 4 }, { x: 3 }]);
    });

    it('works with objects', () => {
      expect(uniqueBy(objectEx, byValue)).to.deep.equal({ a: 1, b: 5, c: 2, e: 4, h: 3 });
    });

    it('works with strings', () => {
      expect(uniqueBy(stringEx, byMod3)).to.equal('153');
    });

    it('works with generators', () => {
      expect(uniqueBy(goEx(), byX), [{ x: 1 }, { x: 5 }, { x: 2 }, { x: 4 }, { x: 3 }]);
    });

    it('works lazily with generators', () => {
      const iter = uniqueBy(naturals(), byMod3);
      expect(iter.next().value).to.equal(1);
      expect(iter.next().value).to.equal(2);
      expect(iter.next().value).to.equal(3);
    });

    it('works with reducibles', () => {
      expect(uniqueBy(loEx, byX).toArray()).to.deep.equal([{ x: 1 }, { x: 5 }, { x: 2 }, { x: 4 }, { x: 3 }]);
    });

    it('can create a transformer function', () => {
      const result = sequence(aoEx, uniqueBy(byX));
      expect(result).to.deep.equal([{ x: 1 }, { x: 5 }, { x: 2 }, { x: 4 }, { x: 3 }]);
    });

    it('can accept a context object', () => {
      const ctx = { fn: byX };
      const fn = function(x) {
        return this.fn(x);
      };
      expect(uniqueBy(aoEx, fn, ctx)).to.deep.equal([{ x: 1 }, { x: 5 }, { x: 2 }, { x: 4 }, { x: 3 }]);
    });

    it('passes init calls to the next transformer', () => {
      const reducer = uniqueBy(byX)(arrayReducer);
      const result = transduce(aoEx, null, reducer);
      expect(result).to.deep.equal([{ x: 1 }, { x: 5 }, { x: 2 }, { x: 4 }, { x: 3 }]);
    });
  });

  context('uniqueWith', () => {
    it('works with arrays', () => {
      const result = uniqueWith(arrayLog, magComp);
      expect(result).to.deep.equal([17504, 2, 274, 15, 2058]);
    });

    it('works with objects', () => {
      const result = uniqueWith(objectLog, valueMagComp);
      expect(result).to.deep.equal({ a: 17504, b: 2, c: 274, e: 15, i: 2058 });
    });

    it('works with strings', () => {
      const result = uniqueWith(stringLog, groupComp);
      expect(result).to.equal('Antida');
    });

    it('works with generators', () => {
      const result = uniqueWith(genLog(), magComp);
      expectIterator(result, [17504, 2, 274, 15, 2058]);
    });

    it('works lazily with generators', () => {
      const iter = uniqueWith(naturals(), magComp);
      expect(iter.next().value).to.equal(1);
      expect(iter.next().value).to.equal(10);
      expect(iter.next().value).to.equal(100);
      expect(iter.next().value).to.equal(1000);
    });

    it('works with reducibles', () => {
      const result = uniqueWith(listLog, magComp);
      expect(result.toArray()).to.deep.equal([17504, 2, 274, 15, 2058]);
    });

    it('can create a transformer function', () => {
      const result = sequence(arrayLog, uniqueWith(magComp));
      expect(result).to.deep.equal([17504, 2, 274, 15, 2058]);
    });

    it('can accept a context object', () => {
      const ctx = { fn: magComp };
      const fn = function(a, b) {
        return this.fn(a, b);
      };
      const result = uniqueWith(arrayLog, fn, ctx);
      expect(result).to.deep.equal([17504, 2, 274, 15, 2058]);
    });

    it('passes init calls to the next transformer', () => {
      const reducer = uniqueWith(magComp)(arrayReducer);
      const result = transduce(arrayLog, null, reducer);
      expect(result).to.deep.equal([17504, 2, 274, 15, 2058]);
    });
  });
});
