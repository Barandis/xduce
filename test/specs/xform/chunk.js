const { expect, ARRAY_5, LIST_5, naturals } = require('../../helper');
const { chunk, chunkBy } = require('../../../src/xform/chunk');
const { map } = require('../../../src/xform/map');
const { take } = require('../../../src/xform/take');
const { fromJS } = require('immutable');
const { sequence, compose, transduce } = require('../../../src/modules/transformation');
const { arrayReducer } = require('../../../src/modules/reduction');

describe('Chunking transformers', () => {
  context('chunk', () => {
    it('works with arrays', () => {
      expect(chunk(ARRAY_5, 3)).to.deep.equal([[1, 2, 3], [4, 5]]);
    });

    it('works lazily with generators', () => {
      const iter = chunk(naturals(), 3);
      expect(iter.next().value).to.deep.equal([1, 2, 3]);
      expect(iter.next().value).to.deep.equal([4, 5, 6]);
      expect(iter.next().value).to.deep.equal([7, 8, 9]);
    });

    it('works with reducibles', () => {
      const result = chunk(LIST_5, 3);
      expect(result.toArray()).to.deep.equal([[1, 2, 3], [4, 5]]);
    });

    it('can create a transformer function', () => {
      const result = sequence(ARRAY_5, chunk(3));
      expect(result).to.deep.equal([[1, 2, 3], [4, 5]]);
    });

    it('works in composition', () => {
      const xform1 = compose(map(x => x + 1), chunk(3));
      const xform2 = compose(chunk(3), map(x => x.length));

      expect(sequence(ARRAY_5, xform1)).to.deep.equal([[2, 3, 4], [5, 6]]);
      expect(sequence(ARRAY_5, xform2)).to.deep.equal([3, 2]);
    });

    it('works in composition with a reducing transformer', () => {
      const xform1 = compose(chunk(2), take(2));
      const xform2 = compose(chunk(2), take(3));
      const xform3 = compose(take(4), chunk(2));
      const xform4 = compose(take(4), chunk(3));

      expect(sequence(ARRAY_5, xform1)).to.deep.equal([[1, 2], [3, 4]]);
      expect(sequence(ARRAY_5, xform2)).to.deep.equal([[1, 2], [3, 4], [5]]);
      expect(sequence(ARRAY_5, xform3)).to.deep.equal([[1, 2], [3, 4]]);
      expect(sequence(ARRAY_5, xform4)).to.deep.equal([[1, 2, 3], [4]]);
    });

    it('passes init calls to the next transformer', () => {
      const reducer = chunk(3)(arrayReducer);
      const result = transduce(ARRAY_5, null, reducer);
      expect(result).to.deep.equal([[1, 2, 3], [4, 5]]);
    });
  });

  context('chunkBy', () => {
    const arrayFib = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34];
    const listFib = fromJS(arrayFib);

    const even = x => x % 2 === 0;

    it('works with arrays', () => {
      expect(chunkBy(arrayFib, even)).to.deep.equal([[0], [1, 1], [2], [3, 5], [8], [13, 21], [34]]);
    });

    it('works lazily with generators', () => {
      const iter = chunkBy(naturals(), x => x % 3 === 0);
      expect(iter.next().value).to.deep.equal([1, 2]);
      expect(iter.next().value).to.deep.equal([3]);
      expect(iter.next().value).to.deep.equal([4, 5]);
      expect(iter.next().value).to.deep.equal([6]);
    });

    it('works with reducibles', () => {
      expect(chunkBy(listFib, even).toArray()).to.deep.equal([[0], [1, 1], [2], [3, 5], [8], [13, 21], [34]]);
    });

    it('can create a transformer function', () => {
      const result = sequence(arrayFib, chunkBy(even));
      expect(result).to.deep.equal([[0], [1, 1], [2], [3, 5], [8], [13, 21], [34]]);
    });

    it('works in composition', () => {
      const xform1 = compose(map(x => x + 1), chunkBy(even));
      const xform2 = compose(chunkBy(even), map(x => x.length));

      expect(sequence(arrayFib, xform1)).to.deep.equal([[1], [2, 2], [3], [4, 6], [9], [14, 22], [35]]);
      expect(sequence(arrayFib, xform2)).to.deep.equal([1, 2, 1, 2, 1, 2, 1]);
    });

    it('works in composition with reducing transformers', () => {
      const xform1 = compose(chunkBy(even), take(2));
      const xform2 = compose(take(5), chunkBy(even));

      expect(sequence(arrayFib, xform1)).to.deep.equal([[0], [1, 1]]);
      expect(sequence(arrayFib, xform2)).to.deep.equal([[0], [1, 1], [2], [3]]);
    });

    it('can accept a context object', () => {
      const ctx = { fn: even };
      const fn = function(x) {
        return this.fn(x);
      };
      expect(chunkBy(arrayFib, fn, ctx)).to.deep.equal([[0], [1, 1], [2], [3, 5], [8], [13, 21], [34]]);
    });

    it('passes init calls to the next transformer', () => {
      const reducer = chunkBy(even)(arrayReducer);
      const result = transduce(arrayFib, null, reducer);
      expect(result).to.deep.equal([[0], [1, 1], [2], [3, 5], [8], [13, 21], [34]]);
    });
  });
});
