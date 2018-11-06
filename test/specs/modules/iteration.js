const { expect, five } = require('../../helper');
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
      // Recently Mocha started exiting (not failing the test, just exiting prematurely)
      // when deleting the iterator property from Array. There's probably good reason for this,
      // but I haven't taken the time to look into it. Using a proxy to pretend the iterator
      // property isn't there is probably best anyway.
      function proxy(target) {
        // Have to treat strings specially because you can't take a proxy of a literal string
        if (typeof target === 'string') {
          delete target[p.iterator];
          return target;
        }
        return new Proxy(target, {
          get(obj, prop) {
            if (prop === p.iterator) {
              return;
            }
            return obj[prop];
          }
        });
      }

      it('iterates over strings', () => {
        const array = toArray(iterator(proxy('hello')));
        expect(array).to.deep.equal(['h', 'e', 'l', 'l', 'o']);
      });

      it('iterates over BMP strings', () => {
        const array = toArray(iterator(proxy(BMP)));
        expect(array).to.deep.equal(['A', ' ', '\uD87E\uDC04', ' ', 'Z', ' ', '\uD87E\uDC04', ' ', 'A']);
      });

      it('iterates over arrays', () => {
        const array = toArray(iterator(proxy([3, 1, 4, 1, 5])));
        expect(array).to.deep.equal([3, 1, 4, 1, 5]);
      });
    });
  });

  context('over custom iterable types', () => {
    it('iterates over types with a next property', () => {
      /* eslint-disable no-class/no-class */
      class IteratorTest {
        constructor() {
          const values = [3, 1, 4, 1, 5];
          let index = 0;

          this.next = () =>
            index < values.length
              ? {
                  value: values[index++],
                  done: false
                }
              : {
                  done: true
                };
        }
        /* eslint-enable no-class/no-class */
      }
      const test = new IteratorTest();
      expect(toArray(iterator(test))).to.deep.equal([3, 1, 4, 1, 5]);
    });

    it('iterates over types with custom iterator protocols', () => {
      /* eslint-disable no-class/no-class */
      class IteratorTest {
        constructor() {
          const values = [3, 1, 4, 1, 5];
          let index = 0;

          this[p.iterator] = () => ({
            next: () =>
              index < values.length
                ? {
                    value: values[index++],
                    done: false
                  }
                : {
                    done: true
                  }
          });
        }
      }
      /* eslint-enable no-class/no-class */
      const test = new IteratorTest();
      expect(toArray(iterator(test))).to.deep.equal([3, 1, 4, 1, 5]);
    });
  });

  context('over plain objects', () => {
    const reverseSort = (a, b) => (a < b ? 1 : b < a ? -1 : 0);
    const obj = { c: 1, a: 2, b: 3 };

    it('produces key-value pairs alphabetized by key by default', () => {
      expect(toArray(iterator(obj, null))).to.deep.equal([{ a: 2 }, { b: 3 }, { c: 1 }]);
    });

    it('can produce key-value pairs with a different sort function', () => {
      expect(toArray(iterator(obj, reverseSort))).to.deep.equal([{ c: 1 }, { b: 3 }, { a: 2 }]);
    });

    it('can produce kv-form objects, alphabetized by key by default', () => {
      expect(toArray(iterator(obj, null, true))).to.deep.equal([{ k: 'a', v: 2 }, { k: 'b', v: 3 }, { k: 'c', v: 1 }]);
    });

    it('can produce kv-form objects with a different sort function', () => {
      expect(toArray(iterator(obj, reverseSort, true))).to.deep.equal([
        { k: 'c', v: 1 },
        { k: 'b', v: 3 },
        { k: 'a', v: 2 }
      ]);
    });
  });

  context('over functions', () => {
    function expectWithin(value, expected, tolerance = 0.001) {
      expect(value).to.be.within(expected - tolerance, expected + tolerance);
    }

    it('produces an infinite repeating series with a constant function', () => {
      const iter = iterator(() => 6);  // Bert's favorite number
      expect(iter.next().value).to.equal(6);
      expect(iter.next().value).to.equal(6);
      expect(iter.next().value).to.equal(6);
      expect(iter.next().value).to.equal(6);
      expect(iter.next().done).to.be.false;
    });

    it('produces an infinite series based on the current index', () => {
      const iter = iterator(index => 1 / (2 ** index));
      expect(iter.next().value).to.equal(1);
      expectWithin(iter.next().value, 1 / 2);
      expectWithin(iter.next().value, 1 / 4);
      expectWithin(iter.next().value, 1 / 8);
    });

    it('produces an infinite series by feeding back the last value to the next iteration', () => {
      const fn = (index, last = true) => !last;
      const iter = iterator(fn);
      expect(iter.next().value).to.be.false;
      expect(iter.next().value).to.be.true;
      expect(iter.next().value).to.be.false;
      expect(iter.next().value).to.be.true;
      expect(iter.next().value).to.be.false;
    });

    it('produces an infinite series by using both the index and the last value', () => {
      const fn = (index, last = 1) => last * (index + 1);   // Factorial series
      const iter = iterator(fn);
      expect(iter.next().value).to.equal(1);
      expect(iter.next().value).to.equal(2);
      expect(iter.next().value).to.equal(6);
      expect(iter.next().value).to.equal(24);
      expect(iter.next().value).to.equal(120);
    });

    it('produces a finite series if the function at some point returns `undefined`', () => {
      const fn = index => index < 3 ? index : undefined;
      const iter = iterator(fn);
      expect(iter.next().value).to.equal(0);
      expect(iter.next().value).to.equal(1);
      expect(iter.next().value).to.equal(2);
      expect(iter.next().done).to.be.true;
    });
  });

  it('returns null if the type is not iterable', () => {
    expect(iterator(new Date())).to.be.null;
  });
});
