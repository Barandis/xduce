const { expect } = require('../../helper');

const _ = require('lodash');
const { protocols, isImplemented } = require('../../../src/modules/protocol');
const { compose } = require('../../../src/modules/transformation');
const { map } = require('../../../src/xform/map');
const { filter } = require('../../../src/xform/filter');

const {
  isReduced,
  reduced,
  unreduced,
  ensureReduced,
  ensureUnreduced,
  toReducer,
  toFunction,
  arrayReducer
} = require('../../../src/modules/reduction');

const p = protocols;

describe('Reduction marking functions', () => {
  context('isReduced', () => {
    it('works on unreduced values', () => {
      expect(isReduced(1729)).to.be.false;
      expect(isReduced({})).to.be.false;
      expect(isReduced([])).to.be.false;
      expect(isReduced(0)).to.be.false;
      expect(isReduced('')).to.be.false;
      expect(isReduced(null)).to.be.false;
      expect(isReduced(undefined)).to.be.false;
    });

    it('works on values wrapped with marker class', () => {
      expect(isReduced(reduced(1729))).to.be.true;
      expect(isReduced(reduced({}))).to.be.true;
      expect(isReduced(reduced([]))).to.be.true;
      expect(isReduced(reduced(0))).to.be.true;
      expect(isReduced(reduced(''))).to.be.true;
      expect(isReduced(reduced(null))).to.be.true;
      expect(isReduced(reduced(undefined))).to.be.true;
    });

    it('works on values with the reduced protocol', () => {
      const obj = { [p.reduced]: true };
      expect(isReduced(obj)).to.be.true;

      const array = [];
      array[p.reduced] = true;
      expect(isReduced(array)).to.be.true;
    });
  });

  context('reduced', () => {
    it('turns a value into a reduced value', () => {
      const value = 1729;
      expect(isReduced(value)).to.be.false;

      const red = reduced(value);
      expect(isReduced(red)).to.be.true;
      expect(red[p.value]).to.equal(1729);
    });

    it('can make any value a reduced value', () => {
      expect(isReduced('')).to.be.false;
      expect(isReduced(reduced(''))).to.be.true;

      expect(isReduced(0)).to.be.false;
      expect(isReduced(reduced(0))).to.be.true;

      expect(isReduced(null)).to.be.false;
      expect(isReduced(reduced(null))).to.be.true;

      expect(isReduced(undefined)).to.be.false;
      expect(isReduced(reduced(undefined))).to.be.true;
    });

    it('can make a reduced value doubly reduced', () => {
      const value = reduced(reduced(1729));
      expect(isReduced(value)).to.be.true;
      expect(isReduced(value[p.value])).to.be.true;
      expect(isReduced(value[p.value][p.value])).to.be.false;
    });
  });

  context('unreduced', () => {
    it('turns a reduced value into its unreduced equivalent', () => {
      const red = reduced(1729);
      const value = unreduced(red);
      expect(isReduced(value)).to.be.false;
      expect(value).to.equal(1729);
    });

    it('returns undefined for unreduced inputs', () => {
      expect(unreduced(1729)).to.be.undefined;
      expect(unreduced({})).to.be.undefined;
      expect(unreduced(null)).to.be.undefined;
      expect(unreduced(undefined)).to.be.undefined;
    });

    it('can unreduce nested reduces', () => {
      const value = reduced(reduced(1729));
      expect(isReduced(unreduced(value))).to.be.true;
      expect(isReduced(unreduced(unreduced(value)))).to.be.false;
      expect(unreduced(unreduced(value))).to.equal(1729);
    });
  });

  context('ensureReduced', () => {
    it('reduced an unreduced input', () => {
      const value = ensureReduced(1729);
      expect(isReduced(value)).to.be.true;
      expect(value[p.value]).to.equal(1729);
    });

    it('will not further reduce an already reduced input', () => {
      const value = reduced(1729);
      expect(ensureReduced(value)).to.equal(value);
    });
  });

  context('ensureUnreduced', () => {
    it('unreduced a reduced input', () => {
      const value = ensureUnreduced(reduced(1729));
      expect(isReduced(value)).to.be.false;
      expect(value).to.equal(1729);
    });

    it('will return the value if it is already unreduced', () => {
      const value = 1729;
      expect(ensureUnreduced(value)).to.equal(value);
    });
  });
});

describe('Reducer creation function', () => {
  context('toReducer', () => {
    it("will create an object that doesn't satisfy the reducer protocol if given a non-reducible object", () => {
      expect(isImplemented(toReducer(new Date())), 'step').to.be.false;
    });

    it('will create an error-throwing init funciton if given a function', () => {
      const obj = toReducer((acc, input) => acc + input);
      const fn = () => obj[p.init]();
      expect(fn).to.throw('init not available');
    });
  });
});

describe('Integration with other libraries', () => {
  const arrayPush = (acc, input) => {
    acc.push(input);
    return acc;
  };

  const xform = compose(map(x => x + 1), filter(x => x % 2 === 0));
  const reducerFn = toFunction(xform, arrayPush);
  const reducerObj = toFunction(xform, arrayReducer);

  context('toFunction', () => {
    it("can make a function to use with Array's reduce", () => {
      const result1 = [1, 2, 3, 4, 5].reduce(reducerFn, []);
      const result2 = [1, 2, 3, 4, 5].reduce(reducerObj, []);
      expect(result1).to.deep.equal([2, 4, 6]);
      expect(result2).to.deep.equal([2, 4, 6]);
    });

    it("can make a function to use with lodash's reduce", () => {
      const result1 = _.reduce([1, 2, 3, 4, 5], reducerFn, []);
      const result2 = _.reduce([1, 2, 3, 4, 5], reducerObj, []);
      expect(result1).to.deep.equal([2, 4, 6]);
      expect(result2).to.deep.equal([2, 4, 6]);
    });
  });
});
