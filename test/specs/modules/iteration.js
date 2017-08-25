const {
  expect,
  five
} = require('../../helper');

const { iterator } = require('../../../src/modules/iteration');
const p = require('../../../src/modules/protocol').protocols;

describe('Iterator', () => {

  function toArray(iter) {
    const result = [];
    let item;
    while (!(item = iter.next()).done) {
      result.push(item.value);
    }
    return result;
  }

  const BMP = 'A \uD87E\uDC04 Z \uD87E\uDC04 A';

  context('over built-in iterable types', () => {

    context('allowing built-in iterator protocol usage', () => {

      it('iterates over strings', () => {
        const array = toArray(iterator('hello'));
        expect(array).to.deep.equal(['h', 'e', 'l', 'l', 'o']);
      });

      it('iterates over BMP strings', () => {
        const array = toArray(iterator(BMP));
        expect(array).to.deep.equal(['A', ' ', '\uD87E\uDC04', ' ', 'Z', ' ', '\uD87E\uDC04', ' ', 'A']);
      });

      it('iterates over arrays', () => {
        const array = toArray(iterator([3, 1, 4, 1, 5]));
        expect(array).to.deep.equal([3, 1, 4, 1, 5]);
      });

      it('iterates over generators', () => {
        const array = toArray(iterator(five()));
        expect(array).to.deep.equal([1, 2, 3, 4, 5]);
      });
    });

    context('without built-in iterator protocols', () => {
      let oldString, oldArray;

      before(() => {
        oldString = String.prototype[p.iterator];
        oldArray = Array.prototype[p.iterator];
        String.prototype[p.iterator] = null;
        Array.prototype[p.iterator] = null;
      });

      after(() => {
        String.prototype[p.iterator] = oldString;
        Array.prototype[p.iterator] = oldArray;
      });

      it('iterates over strings', () => {
        const array = toArray(iterator('hello'));
        expect(array).to.deep.equal(['h', 'e', 'l', 'l', 'o']);
      });

      it('iterates over BMP strings', () => {
        const array = toArray(iterator(BMP));
        expect(array).to.deep.equal(['A', ' ', '\uD87E\uDC04', ' ', 'Z', ' ', '\uD87E\uDC04', ' ', 'A']);
      });

      it('iterates over arrays', () => {
        const array = toArray(iterator([3, 1, 4, 1, 5]));
        expect(array).to.deep.equal([3, 1, 4, 1, 5]);
      });
    });
  });

  context('over custom iterable types', () => {
    it('iterates over types with a next property', () => {
      class IteratorTest {
        constructor() {
          const values = [3, 1, 4, 1, 5];
          let index = 0;

          this.next = () =>
            index < values.length ? {
              value: values[index++],
              done: false
            } : {
              done: true
            };
        }
      }
      const test = new IteratorTest();
      expect(toArray(iterator(test))).to.deep.equal([3, 1, 4, 1, 5]);
    });

    it('iterates over types with custom iterator protocols', () => {
      class IteratorTest {
        constructor() {
          const values = [3, 1, 4, 1, 5];
          let index = 0;

          this[p.iterator] = () => ({
            next: () =>
              index < values.length ? {
                value: values[index++],
                done: false
              } : {
                done: true
              }
          });
        }
      }
      const test = new IteratorTest();
      expect(toArray(iterator(test))).to.deep.equal([3, 1, 4, 1, 5]);
    });
  });

  context('over plain objects', () => {
    const reverseSort = (a, b) => a < b ? 1 : b < a ? -1 : 0;
    const obj = {c: 1, a: 2, b: 3};

    it('produces kv-form objects, alphabetized by key by default', () => {
      expect(toArray(iterator(obj))).to.deep.equal([{k: 'a', v: 2}, {k: 'b', v: 3}, {k: 'c', v: 1}]);
    });

    it('can produce kv-form objects with a different sort function', () => {
      expect(toArray(iterator(obj, reverseSort))).to.deep.equal([{k: 'c', v: 1}, {k: 'b', v: 3}, {k: 'a', v: 2}]);
    });

    it('can produce key-value pairs alphabetized by key by default', () => {
      expect(toArray(iterator(obj, null, false))).to.deep.equal([{a: 2}, {b: 3}, {c: 1}]);
    });

    it('can produce key-value pairs with a different sort function', () => {
      expect(toArray(iterator(obj, reverseSort, false))).to.deep.equal([{c: 1}, {b: 3}, {a: 2}]);
    });
  });

  it('returns null if the type is not iterable', () => {
    expect(iterator(new Date())).to.be.null;
  });
});
