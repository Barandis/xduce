const {
  expect,
  expectIterator,
  five,
  naturals,
  ARRAY_5,
  OBJECT_AB,
  LIST_5
} = require('../../helper');

const Immutable = require('immutable');

const p = require('../../../src/modules/protocol').protocols;

const {
  transduce,
  asArray,
  asObject,
  asString,
  asIterator,
  into,
  sequence,
  compose
} = require('../../../src/modules/transformation');

const {
  toReducer,
  arrayReducer,
  objectReducer,
  stringReducer
} = require('../../../src/modules/reduction');

const { range } = require('../../../src/modules/util');
const { map } = require('../../../src/xform/map');
const { filter } = require('../../../src/xform/filter');
const { take } = require('../../../src/xform/take');

const addOne = (x) => x + 1;
const ucaseObject = ({k, v}) => ({[k.toUpperCase()]: v});
const ucaseObjectKv = ({k, v}) => ({k: k.toUpperCase(), v});
const ucaseString = (x) => x.toUpperCase();

const keyAndValue = (x) => ({[x.toString()]: x});
const keyAndValueKv = (x) => ({k: x.toString(), v: x});

const immutableReducer = toReducer(Immutable.List.prototype);

describe('Transduction functions', () => {

  context('transduce', () => {
    it('can map an array with an array reducer', () => {
      const result = transduce(ARRAY_5, map(addOne), arrayReducer);
      expect(result).to.deep.equal([2, 3, 4, 5, 6]);
    });

    it('can map an object with an object reducer', () => {
      const result = transduce(OBJECT_AB, map(ucaseObject), objectReducer);
      expect(result).to.deep.equal({A: 1, B: 2});
    });

    it('can map a kv-form object with an object reducer', () => {
      const result = transduce(OBJECT_AB, map(ucaseObjectKv), objectReducer);
      expect(result).to.deep.equal({A: 1, B: 2});
    });

    it('can map a string with a string reducer', () => {
      const result = transduce('hello', map(ucaseString), stringReducer);
      expect(result).to.equal('HELLO');
    });

    it('can map an immutable list with an immutable reducer', () => {
      const result = transduce(LIST_5, map(addOne), immutableReducer);
      expect(result.toArray()).to.deep.equal([2, 3, 4, 5, 6]);
    });

    it('can map a custom object with a reducer function', () => {
      class TestCollection {
        constructor() {
          this.values = [];
        }
        push(value) {
          this.values.push(value);
        }
      }
      function testReducer(acc, value) {
        acc.push(value);
        return acc;
      }

      const result = transduce(ARRAY_5, map(addOne), toReducer(testReducer), new TestCollection());
      expect(result.values).to.deep.equal([2, 3, 4, 5, 6]);
    });

    it('returns null if given a null collection', () => {
      expect(transduce(null, map(addOne), arrayReducer)).to.be.null;
    });

    it('throws an error if given a non-reducible collection', () => {
      expect(() => transduce(new Date(), map(addOne), arrayReducer)).to.throw();
    });
  });

  context('asArray', () => {
    it('can map an array to an array', () => {
      const result = asArray(ARRAY_5, map(addOne));
      expect(result).to.deep.equal([2, 3, 4, 5, 6]);
    });

    it('can map an object to an array', () => {
      const value = ({v}) => v;
      const result = asArray(OBJECT_AB, map(value));
      expect(result).to.deep.equal([1, 2]);
    });

    it('can map a string to an array', () => {
      const result = asArray('hello', map(ucaseString));
      expect(result).to.deep.equal(['H', 'E', 'L', 'L', 'O']);
    });

    it('can map a generator to an array', () => {
      const result = asArray(five(), map(addOne));
      expect(result).to.deep.equal([2, 3, 4, 5, 6]);
    });

    it('can map an immutable list to an array', () => {
      const result = asArray(LIST_5, map(addOne));
      expect(result).to.deep.equal([2, 3, 4, 5, 6]);
    });

    it('reduces when no transformer is specified', () => {
      expect(asArray(OBJECT_AB)).to.deep.equal([{a: 1}, {b: 2}]);
      expect(asArray('hello')).to.deep.equal(['h', 'e', 'l', 'l', 'o']);
    });
  });

  context('asObject', () => {
    it('can map an array to an object', () => {
      const result = asObject(ARRAY_5, map(keyAndValue));
      expect(result).to.deep.equal({1: 1, 2: 2, 3: 3, 4: 4, 5: 5});
    });

    it('can map an array to a kv-form object', () => {
      const result = asObject(ARRAY_5, map(keyAndValueKv));
      expect(result).to.deep.equal({1: 1, 2: 2, 3: 3, 4: 4, 5: 5});
    });

    it('can map an object to an object', () => {
      const result = asObject(OBJECT_AB, map(ucaseObject));
      expect(result).to.deep.equal({A: 1, B: 2});
    });

    it('can map an object to a kv-form object', () => {
      const result = asObject(OBJECT_AB, map(ucaseObjectKv));
      expect(result).to.deep.equal({A: 1, B: 2});
    });

    it('can map a string to an object', () => {
      const result = asObject('world', map(keyAndValue));
      expect(result).to.deep.equal({w: 'w', o: 'o', r: 'r', l: 'l', d: 'd'});
    });

    it('can map a string to a kv-form object', () => {
      const result = asObject('world', map(keyAndValueKv));
      expect(result).to.deep.equal({w: 'w', o: 'o', r: 'r', l: 'l', d: 'd'});
    });

    it('can map a generator to an object', () => {
      const result = asObject(five(), map(keyAndValue));
      expect(result).to.deep.equal({1: 1, 2: 2, 3: 3, 4: 4, 5: 5});
    });

    it('can map a generator to a kv-form object', () => {
      const result = asObject(five(), map(keyAndValueKv));
      expect(result).to.deep.equal({1: 1, 2: 2, 3: 3, 4: 4, 5: 5});
    });

    it('can map an immutable list to an object', () => {
      const result = asObject(LIST_5, map(keyAndValue));
      expect(result).to.deep.equal({1: 1, 2: 2, 3: 3, 4: 4, 5: 5});
    });

    it('can map an immutable list to a kv-form object', () => {
      const result = asObject(LIST_5, map(keyAndValueKv));
      expect(result).to.deep.equal({1: 1, 2: 2, 3: 3, 4: 4, 5: 5});
    });

    it('reduces when no transformer is specified', () => {
      expect(asObject(OBJECT_AB)).to.deep.equal({a: 1, b: 2});
      expect(asObject([1, 2])).to.deep.equal({0: 1, 1: 2});
      expect(asObject('hello')).to.deep.equal({0: 'h', 1: 'e', 2: 'l', 3: 'l', 4: 'o'});
      expect(asObject(five())).to.deep.equal({0: 1, 1: 2, 2: 3, 3: 4, 4: 5});
      expect(asObject(LIST_5)).to.deep.equal({0: 1, 1: 2, 2: 3, 3: 4, 4: 5});
    });
  });

  context('asString', () => {
    it('can map an array to a string', () => {
      const result = asString(['h', 'e', 'l', 'l', 'o'], map(ucaseString));
      expect(result).to.equal('HELLO');
    });

    it('can map an object to a string', () => {
      const key = ({k}) => k;
      const result = asString(OBJECT_AB, map(key));
      expect(result).to.equal('ab');
    });

    it('can map a string to a string', () => {
      const result = asString('hello', map(ucaseString));
      expect(result).to.equal('HELLO');
    });

    it('can map a generator to a string', () => {
      const result = asString(five(), map(addOne));
      expect(result).to.equal('23456');
    });

    it('can map an immutable list to a string', () => {
      const input = Immutable.List.of('h', 'e', 'l', 'l', 'o');
      const result = asString(input, map(ucaseString));
      expect(result).to.equal('HELLO');
    });

    it('reduces when no transformer is specified', () => {
      expect(asString(['h', 'e', 'l', 'l', 'o'])).to.equal('hello');
    });
  });

  context('asIterator', () => {
    it('can map an array to an iterator', () => {
      const result = asIterator(ARRAY_5, map(addOne));
      expectIterator(result, [2, 3, 4, 5, 6]);
    });

    it('can map an object to an iterator', () => {
      const result = asIterator(OBJECT_AB, map(({v}) => v * 10));
      expectIterator(result, [10, 20]);
    });

    it('can map a string to an iterator', () => {
      const result = asIterator('hello', map(ucaseString));
      expectIterator(result, ['H', 'E', 'L', 'L', 'O']);
    });

    it('can map a generator to an iterator', () => {
      const result = asIterator(five(), map(addOne));
      expectIterator(result, [2, 3, 4, 5, 6]);
    });

    it('can map an immutable list to an iterator', () => {
      const result = asIterator(LIST_5, map(addOne));
      expectIterator(result, [2, 3, 4, 5, 6]);
    });

    it('reduces when no transformer is supplied', () => {
      expectIterator(asIterator(ARRAY_5), [1, 2, 3, 4, 5]);
      expectIterator(asIterator(OBJECT_AB), [{a: 1}, {b: 2}]);
    });
  });

  context('into', () => {
    it('can collect elements from one type into the same type', () => {
      let result = into([], ARRAY_5, map(addOne));
      expect(result).to.deep.equal([2, 3, 4, 5, 6]);

      result = into({}, OBJECT_AB, map(ucaseObject));
      expect(result).to.deep.equal({A: 1, B: 2});

      result = into({}, OBJECT_AB, map(ucaseObjectKv));
      expect(result).to.deep.equal({A: 1, B: 2});

      result = into('', 'hello', map(ucaseString));
      expect(result).to.equal('HELLO');
    });

    it('can collect elements from one type into another type', () => {
      const value = ({v}) => v;

      let result = into([], OBJECT_AB, map(value));
      expect(result).to.deep.equal([1, 2]);

      result = into({}, 'world', map(keyAndValue));
      expect(result).to.deep.equal({w: 'w', o: 'o', r: 'r', l: 'l', d: 'd'});

      result = into({}, 'world', map(keyAndValueKv));
      expect(result).to.deep.equal({w: 'w', o: 'o', r: 'r', l: 'l', d: 'd'});

      result = into('', ['h', 'e', 'l', 'l', 'o'], map(ucaseString));
      expect(result).to.equal('HELLO');

      result = into([], five(), map(addOne));
      expect(result).to.deep.equal([2, 3, 4, 5, 6]);

      result = into('', Immutable.List.of('h', 'e', 'l', 'l', 'o'), map(ucaseString));
      expect(result).to.equal('HELLO');
    });

    it('can collect elements into non-empty targets', () => {
      const value = ({v}) => v;
      const identity = (x) => x;

      let result = into([-1, 0], OBJECT_AB, map(value));
      expect(result).to.deep.equal([-1, 0, 1, 2]);

      result = into({x: -1, y: 0}, OBJECT_AB, map(identity));
      expect(result).to.deep.equal({a: 1, b: 2, x: -1, y: 0});
    });

    it('can collect elements into custom objects', () => {
      const result = into(Immutable.List(), ARRAY_5, map(addOne));
      expect(result.toArray()).to.deep.equal([2, 3, 4, 5, 6]);
    });

    it('throws an error if the target is not reducible', () => {
      expect(() => into(new Date(), ARRAY_5, map(addOne))).to.throw();
    });

    it('can turn collections into arrays with no transform', () => {
      expect(into([], OBJECT_AB)).to.deep.equal([{a: 1}, {b: 2}]);
      expect(into([], 'hello')).to.deep.equal(['h', 'e', 'l', 'l', 'o']);
      expect(into([], five())).to.deep.equal([1, 2, 3, 4, 5]);
      expect(into([], LIST_5)).to.deep.equal([1, 2, 3, 4, 5]);
    });

    it('can turn collections into strings with no transform', () => {
      expect(into('', ARRAY_5)).to.equal('12345');
      expect(into('', five())).to.equal('12345');
      expect(into('', LIST_5)).to.equal('12345');
    });

    it('can turn collections into other reducibles', () => {
      let result = into(Immutable.List(), ARRAY_5);
      expect(result.toArray()).to.deep.equal([1, 2, 3, 4, 5]);

      result = into(Immutable.List(), 'hello');
      expect(result.toArray()).to.deep.equal(['h', 'e', 'l', 'l', 'o']);

      result = into(Immutable.List(), five());
      expect(result.toArray()).to.deep.equal([1, 2, 3, 4, 5]);
    });
  });

  context('sequence', () => {
    it('can map an array to an array', () => {
      const result = sequence(ARRAY_5, map(addOne));
      expect(result).to.deep.equal([2, 3, 4, 5, 6]);
    });

    it('can map an object to an object', () => {
      const result = sequence(OBJECT_AB, map(ucaseObject));
      expect(result).to.deep.equal({A: 1, B: 2});
    });

    it('can map an object to a kv-form object', () => {
      const result = sequence(OBJECT_AB, map(ucaseObjectKv));
      expect(result).to.deep.equal({A: 1, B: 2});
    });

    it('can map a string to a string', () => {
      const result = sequence('hello', map(ucaseString));
      expect(result).to.equal('HELLO');
    });

    it('can map an iterator to an iterator', () => {
      const result = sequence(five(), map(addOne));
      expectIterator(result, [2, 3, 4, 5, 6]);
    });

    it('can map a reducible to a reducible', () => {
      const result = sequence(LIST_5, map(addOne));
      expect(result.toArray()).to.deep.equal([2, 3, 4, 5, 6]);
    });

    it('throws an error if the collection is not reducible', () => {
      expect(() => sequence(new Date(), map(addOne))).to.throw();
    });
  });
});

describe('Transformer composition', () => {
  it('combines several transformers into one', () => {
    const array = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34];
    const gen = function* () {
      for (let item of array) {
        yield item;
      }
    };
    const list = Immutable.fromJS(array);

    const addTwo = (x) => x + 2;
    const even = (x) => x % 2 === 0;

    const xform = compose(map(addTwo), filter(even), take(3));

    const arrayResult = sequence(array, xform);
    const iterResult  = sequence(gen(), xform);
    const listResult  = sequence(list, xform);

    expect(arrayResult).to.deep.equal([2, 4, 10]);
    expectIterator(iterResult, [2, 4, 10]);
    expect(listResult.toArray()).to.deep.equal([2, 4, 10]);
  });
});

describe('Lazy iterator transformation', () => {
  const xform = compose(map(x => x * 2), filter(x => x > 4));

  context('when a transformation is applied to an iterator', () => {
    it('happens via sequence', () => {
      const iter = sequence(naturals(), xform);
      expect(iter.next().value).to.equal(6);
      expect(iter.next().value).to.equal(8);
      expect(iter.next().value).to.equal(10);
    });

    it('happens via asIterator', () => {
      const iter = asIterator(naturals(), xform);
      expect(iter.next().value).to.equal(6);
      expect(iter.next().value).to.equal(8);
      expect(iter.next().value).to.equal(10);
    });
  });
});
