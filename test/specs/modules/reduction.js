const { expect } = require('../../helper');

const _ = require('lodash');
const { protocols, isImplemented } = require('../../../src/modules/protocol');
const { compose } = require('../../../src/modules/transformation');
const { reduce } = require('../../../src/modules/reduction');
const { map } = require('../../../src/xform/map');
const { filter } = require('../../../src/xform/filter');

const {
  isCompleted,
  complete,
  uncomplete,
  ensureCompleted,
  ensureUncompleted,
  toReducer,
  toFunction,
  arrayReducer
} = require('../../../src/modules/reduction');

const p = protocols;

describe('Status marking functions', () => {
  context('isCompleted', () => {
    it('works on unreduced values', () => {
      expect(isCompleted(1729)).to.be.false;
      expect(isCompleted({})).to.be.false;
      expect(isCompleted([])).to.be.false;
      expect(isCompleted(0)).to.be.false;
      expect(isCompleted('')).to.be.false;
      expect(isCompleted(null)).to.be.false;
      expect(isCompleted(undefined)).to.be.false;
    });

    it('works on values wrapped with marker class', () => {
      expect(isCompleted(complete(1729))).to.be.true;
      expect(isCompleted(complete({}))).to.be.true;
      expect(isCompleted(complete([]))).to.be.true;
      expect(isCompleted(complete(0))).to.be.true;
      expect(isCompleted(complete(''))).to.be.true;
      expect(isCompleted(complete(null))).to.be.true;
      expect(isCompleted(complete(undefined))).to.be.true;
    });

    it('works on values with the reduced protocol', () => {
      const obj = { [p.reduced]: true };
      expect(isCompleted(obj)).to.be.true;

      const array = [];
      array[p.reduced] = true;
      expect(isCompleted(array)).to.be.true;
    });
  });

  context('complete', () => {
    it('turns a value into a completed value', () => {
      const value = 1729;
      expect(isCompleted(value)).to.be.false;

      const cpl = complete(value);
      expect(isCompleted(cpl)).to.be.true;
      expect(cpl[p.value]).to.equal(1729);
    });complete

    it('can make any value a completed value', () => {
      expect(isCompleted('')).to.be.false;
      expect(isCompleted(complete(''))).to.be.true;

      expect(isCompleted(0)).to.be.false;
      expect(isCompleted(complete(0))).to.be.true;

      expect(isCompleted(null)).to.be.false;
      expect(isCompleted(complete(null))).to.be.true;

      expect(isCompleted(undefined)).to.be.false;
      expect(isCompleted(complete(undefined))).to.be.true;
    });

    it('can make a completed value doubly completed', () => {
      const value = complete(complete(1729));
      expect(isCompleted(value)).to.be.true;
      expect(isCompleted(value[p.value])).to.be.true;
      expect(isCompleted(value[p.value][p.value])).to.be.false;
    });
  });

  context('uncomplete', () => {
    it('turns a completed value into its uncompleted equivalent', () => {
      const cpl = complete(1729);
      const value = uncomplete(cpl);
      expect(isCompleted(value)).to.be.false;
      expect(value).to.equal(1729);
    });

    it('returns undefined for uncompleted inputs', () => {
      expect(uncomplete(1729)).to.be.undefined;
      expect(uncomplete({})).to.be.undefined;
      expect(uncomplete(null)).to.be.undefined;
      expect(uncomplete(undefined)).to.be.undefined;
    });

    it('can uncomplete nested completes', () => {
      const value = complete(complete(1729));
      expect(isCompleted(uncomplete(value))).to.be.true;
      expect(isCompleted(uncomplete(uncomplete(value)))).to.be.false;
      expect(uncomplete(uncomplete(value))).to.equal(1729);
    });
  });

  context('ensureCompleted', () => {
    it('completes an uncompleted input', () => {
      const value = ensureCompleted(1729);
      expect(isCompleted(value)).to.be.true;
      expect(value[p.value]).to.equal(1729);
    });

    it('will not further reduce an already completed input', () => {
      const value = complete(1729);
      expect(ensureCompleted(value)).to.equal(value);
    });
  });

  context('ensureUncompleted', () => {
    it('uncompletes a completed input', () => {
      const value = ensureUncompleted(complete(1729));
      expect(isCompleted(value)).to.be.false;
      expect(value).to.equal(1729);
    });

    it('will return the value if it is already uncompleted', () => {
      const value = 1729;
      expect(ensureUncompleted(value)).to.equal(value);
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

    it('can create reducers that reduce to non-collections', () => {
      const sumReducer = toReducer((acc, input) => acc + input);
      const sum = reduce([1, 2, 3, 4, 5], sumReducer, 0);
      expect(sum).to.equal(15);
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
