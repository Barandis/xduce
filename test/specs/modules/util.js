import {
  expect
} from '../../helper';

import {
  isArray,
  isFunction,
  isObject,
  isNumber,
  isString,
  bmpCharAt,
  bmpLength,
  range,
  complement
} from '../../../src/modules/util';

describe('Type-checking functions', () => {

  context('for arrays', () => {
    it('works for literal arrays', () => {
      expect(isArray([1, 2, 3])).to.be.true;
      expect(isArray([])).to.be.true;
    });

    it('works for array objects', () => {
      const array = new Array(3);
      array.push(1, 2, 3);
      expect(isArray(array)).to.be.true;
      expect(isArray(new Array())).to.be.true;
    });

    it('works for things that are not arrays', () => {
      expect(isArray(() => {})).to.be.false;
      expect(isArray({})).to.be.false;
      expect(isArray(0)).to.be.false;
      expect(isArray('')).to.be.false;
    });

    it('works for null/undefined', () => {
      expect(isArray(null)).to.be.false;
      expect(isArray(undefined)).to.be.false;
    })
  });

  context('for functions', () => {
    it('works for ES6 function literals', () => {
      expect(isFunction(x => x)).to.be.true;
      expect(isFunction(() => {})).to.be.true;
    });

    it('works for ES5 funciton literals', () => {
      expect(isFunction(function (it) { return it; })).to.be.true;
      expect(isFunction(function (it) { it++; })).to.be.true;
      expect(isFunction(function () {})).to.be.true;
    });

    it('works for function objects', () => {
      expect(isFunction(new Function('a', 'b', 'return a + b'))).to.be.true;
    });

    it('works for function variables', () => {
      function add1(x, y) { return x + y; }
      const add2 = (x, y) => x + y;
      expect(isFunction(add1)).to.be.true;
      expect(isFunction(add2)).to.be.true;
    });

    it('works for things that are not functions', () => {
      expect(isFunction([])).to.be.false;
      expect(isFunction({})).to.be.false;
      expect(isFunction(0)).to.be.false;
      expect(isFunction('')).to.be.false;
    });

    it('works for null/undefined', () => {
      expect(isFunction(null)).to.be.false;
      expect(isFunction(undefined)).to.be.false;
    });
  });

  context('for objects', () => {
    it('works for object literals', () => {
      expect(isObject({a: 1, b: 2})).to.be.true;
      expect(isObject({})).to.be.true;
    });

    it('works for Object objects', () => {
      const obj = new Object();
      obj.a = 1;
      obj.b = 2;
      expect(isObject(obj)).to.be.true;
      expect(isObject(new Object())).to.be.true;
    });

    it('works for things that are not objects', () => {
      expect(isObject([])).to.be.false;
      expect(isObject(() => {})).to.be.false;
      expect(isObject(0)).to.be.false;
      expect(isObject('')).to.be.false;
    });

    it('works for objects that are assigned another type', () => {
      expect(isObject(new Array())).to.be.false;
      expect(isObject(new Function('a', 'b', 'return a + b'))).to.be.false;
      expect(isObject(new Number(0))).to.be.false;
      expect(isObject(new String())).to.be.false;
    });

    it('works for objects that derive from Object', () => {
      class Test {}
      expect(isObject(new Test())).to.be.false;
    });

    it('works for objects without prototypes', () => {
      const obj = Object.create(null);
      obj.a = 1;
      obj.b = 2;
      expect(isObject(obj)).to.be.true;
      expect(isObject(Object.prototype)).to.be.true;
    });

    it('works for null/undefined', () => {
      expect(isObject(null)).to.be.false;
      expect(isObject(undefined)).to.be.false;
    });
  });

  context('for numbers', () => {
    it('works for number literals', () => {
      expect(isNumber(1729)).to.be.true;
      expect(isNumber(27.42)).to.be.true;
      expect(isNumber(6.022e23)).to.be.true;
      expect(isNumber(0xff)).to.be.true;
      expect(isNumber(0)).to.be.true;
    });

    it('works for number objects', () => {
      expect(isNumber(new Number(1729))).to.be.true;
      expect(isNumber(Number('27.42'))).to.be.true;
      expect(isNumber(new Number('6.022e23'))).to.be.true;
      expect(isNumber(Number(0xff))).to.be.true;
      expect(isNumber(new Number())).to.be.true;
    });

    it('works for numeric strings', () => {
      expect(isNumber('1729')).to.be.false;
      expect(isNumber('0')).to.be.false;
    });

    it('works for infinite numbers', () => {
      expect(isNumber(NaN)).to.be.false;
      expect(isNumber(Infinity)).to.be.false;
      expect(isNumber(-Infinity)).to.be.false;
    });

    it('works for things that are not numbers', () => {
      expect(isNumber([])).to.be.false;
      expect(isNumber(() => {})).to.be.false;
      expect(isNumber({})).to.be.false;
      expect(isNumber('')).to.be.false;
    });

    it('works for null/undefined', () => {
      expect(isNumber(null)).to.be.false;
      expect(isNumber(undefined)).to.be.false;
    });
  });

  context('for strings', () => {
    it('works for literal strings', () => {
      expect(isString('hello')).to.be.true;
      expect(isString('1729')).to.be.true;
      expect(isString('')).to.be.true;
    });

    it('works for string objects', () => {
      expect(isString(new String('hello'))).to.be.true;
      expect(isString(new String())).to.be.true;
    });

    it('works for things that are not strings', () => {
      expect(isString([])).to.be.false;
      expect(isString(() => {})).to.be.false;
      expect(isString({})).to.be.false;
      expect(isString(0)).to.be.false;
    });

    it('works for null/undefined', () => {
      expect(isString(null)).to.be.false;
      expect(isString(undefined)).to.be.false;
    });
  });
});

describe('Basic Multilingual Plane (BMP) function', () => {
  const bmp1 = 'A\uD87E\uDC04Z';
  const bmp2 = 'A \uD87E\uDC04 Z \uD87E\uDC04 A';

  context('for length', () => {
    it('returns the correct length for non-BMP strings', () => {
      expect(bmpLength('hello world')).to.equal(11);
      expect(bmpLength('')).to.equal(0);
    });

    it('returns the correct length for BMP strings', () => {
      expect(bmp1.length).to.equal(4);
      expect(bmpLength(bmp1)).to.equal(3);
      expect(bmp2.length).to.equal(11);
      expect(bmpLength(bmp2)).to.equal(9);
    });
  });

  context('for character access', () => {
    it('returns the corect character for non-BMP strings', () => {
      expect(bmpCharAt('hello world', 1)).to.equal('e');
      expect(bmpCharAt('hello world', 7)).to.equal('o');
    });

    it('returns the correct character for BMP strings', () => {
      expect(bmpCharAt(bmp1, 0)).to.equal('A');
      expect(bmpCharAt(bmp1, 1)).to.equal('\uD87E\uDC04');
      expect(bmpCharAt(bmp1, 2)).to.equal('Z');

      expect(bmpCharAt(bmp2, 0)).to.equal('A');
      expect(bmpCharAt(bmp2, 2)).to.equal('\uD87E\uDC04');
      expect(bmpCharAt(bmp2, 4)).to.equal('Z');
      expect(bmpCharAt(bmp2, 6)).to.equal('\uD87E\uDC04');
      expect(bmpCharAt(bmp2, 8)).to.equal('A');
    });

    it('returns empty strings for out-of-range indices', () => {
      expect(bmpCharAt('hello world', 15)).to.equal('');
      expect(bmpCharAt('hello world', -1)).to.equal('');
      expect(bmpCharAt(bmp2, 15)).to.equal('');
      expect(bmpCharAt(bmp2, -1)).to.equal('');
    });
  });
});

describe('range', () => {
  it('creates an array of consecutive integers from 0 to n - 1', () => {
    expect(range(5)).to.deep.equal([0, 1, 2, 3, 4]);
  });

  it('creates an array from start to end - 1', () => {
    expect(range(1, 5)).to.deep.equal([1, 2, 3, 4]);
  });

  it('can accept a step other than 1', () => {
    expect(range(0, 5, 2)).to.deep.equal([0, 2, 4]);
  });

  it('will make descending ranges if start > end', () => {
    expect(range(5, 0)).to.deep.equal([5, 4, 3, 2, 1]);
  });

  it('will make descending ranges when given negative steps', () => {
    expect(range(5, 0, -2)).to.deep.equal([5, 3, 1]);
  });
});

describe('complement', () => {
  it('returns a function that returns the opposite of the original function', () => {
    const even = x => x % 2 === 0;
    const odd = complement(even);
    expect(odd(1)).to.be.true;
    expect(odd(2)).to.be.false;
  });
});
