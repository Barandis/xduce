/*
 * These tests look at the location of the functions rather than their functionality. They're here because no tests
 * broke when moving two entire sets of functions from one namespace to another, and there should be tests that check
 * that things are in the right place.
 */

const { expect } = require('../../helper');
const xduce = require('../../../src/api');

const { isFunction, isObject } = require('../../../src/modules/util');

describe('Main xduce object', () => {
  it('contains protocols', () => {
    expect(xduce).to.have.property('protocols');
    expect(isObject(xduce.protocols)).to.be.true;
  });

  it('contains iterator', () => {
    expect(xduce).to.have.property('iterator');
    expect(isFunction(xduce.iterator)).to.be.true;
  });

  it('contains toReducer', () => {
    expect(xduce).to.have.property('toReducer');
    expect(isFunction(xduce.toReducer)).to.be.true;
  });

  it('contains toFunction', () => {
    expect(xduce).to.have.property('toFunction');
    expect(isFunction(xduce.toFunction)).to.be.true;
  });

  it('contains reduce', () => {
    expect(xduce).to.have.property('reduce');
    expect(isFunction(xduce.reduce)).to.be.true;
  });

  it('contains transduce', () => {
    expect(xduce).to.have.property('transduce');
    expect(isFunction(xduce.transduce)).to.be.true;
  });

  it('contains into', () => {
    expect(xduce).to.have.property('into');
    expect(isFunction(xduce.into)).to.be.true;
  });

  it('contains sequence', () => {
    expect(xduce).to.have.property('sequence');
    expect(isFunction(xduce.sequence)).to.be.true;
  });

  it('contains asArray', () => {
    expect(xduce).to.have.property('asArray');
    expect(isFunction(xduce.asArray)).to.be.true;
  });

  it('contains asIterator', () => {
    expect(xduce).to.have.property('asIterator');
    expect(isFunction(xduce.asIterator)).to.be.true;
  });

  it('contains asObject', () => {
    expect(xduce).to.have.property('asObject');
    expect(isFunction(xduce.asObject)).to.be.true;
  });

  it('contains asString', () => {
    expect(xduce).to.have.property('asString');
    expect(isFunction(xduce.asString)).to.be.true;
  });

  it('contains compose', () => {
    expect(xduce).to.have.property('compose');
    expect(isFunction(xduce.compose)).to.be.true;
  });

  it('contains util', () => {
    expect(xduce).to.have.property('util');
    expect(isObject(xduce.util)).to.be.true;
  });

  it('contains transducers', () => {
    expect(xduce).to.have.property('transducers');
    expect(isObject(xduce.transducers)).to.be.true;
  });
});

describe('xduce.util object', () => {
  const util = xduce.util;

  it('contains range', () => {
    expect(util).to.have.property('range');
    expect(isFunction(util.range)).to.be.true;
  });

  it('contains complement', () => {
    expect(util).to.have.property('complement');
    expect(isFunction(util.complement)).to.be.true;
  });

  it('contains isArray', () => {
    expect(util).to.have.property('isArray');
    expect(isFunction(util.isArray)).to.be.true;
  });

  it('contains isFunction', () => {
    expect(util).to.have.property('isFunction');
    expect(isFunction(util.isFunction)).to.be.true;
  });

  it('contains isNumber', () => {
    expect(util).to.have.property('isNumber');
    expect(isFunction(util.isNumber)).to.be.true;
  });

  it('contains isObject', () => {
    expect(util).to.have.property('isObject');
    expect(isFunction(util.isObject)).to.be.true;
  });

  it('contains isString', () => {
    expect(util).to.have.property('isString');
    expect(isFunction(util.isString)).to.be.true;
  });

  it('contains bmp', () => {
    expect(util).to.have.property('bmp');
    expect(isObject(util.bmp)).to.be.true;
  });

  it('contains status', () => {
    expect(util).to.have.property('status');
    expect(isObject(util.status)).to.be.true;
  });
});

describe('xduce.util.bmp object', () => {
  const bmp = xduce.util.bmp;

  it('contains charAt', () => {
    expect(bmp).to.have.property('charAt');
    expect(isFunction(bmp.charAt)).to.be.true;
  });

  it('contains length', () => {
    expect(bmp).to.have.property('length');
    expect(isFunction(bmp.length)).to.be.true;
  });
});

describe('xduce.util.status object', () => {
  const status = xduce.util.status;

  it('contains isCompleted', () => {
    expect(status).to.have.property('isCompleted');
    expect(isFunction(status.isCompleted)).to.be.true;
  });

  it('contains complete', () => {
    expect(status).to.have.property('complete');
    expect(isFunction(status.complete)).to.be.true;
  });

  it('contains uncomplete', () => {
    expect(status).to.have.property('uncomplete');
    expect(isFunction(status.uncomplete)).to.be.true;
  });

  it('contains ensureCompleted', () => {
    expect(status).to.have.property('ensureCompleted');
    expect(isFunction(status.ensureCompleted)).to.be.true;
  });

  it('contains ensureUncompleted', () => {
    expect(status).to.have.property('ensureUncompleted');
    expect(isFunction(status.ensureUncompleted)).to.be.true;
  });
});

describe('xduce.transducers object', () => {
  const transducers = xduce.transducers;

  it('contains chunk', () => {
    expect(transducers).to.have.property('chunk');
    expect(isFunction(transducers.chunk)).to.be.true;
  });

  it('contains chunkBy', () => {
    expect(transducers).to.have.property('chunkBy');
    expect(isFunction(transducers.chunkBy)).to.be.true;
  });

  it('contains identity', () => {
    expect(transducers).to.have.property('identity');
    expect(isFunction(transducers.identity)).to.be.true;
  });

  it('contains flatten', () => {
    expect(transducers).to.have.property('flatten');
    expect(isFunction(transducers.flatten)).to.be.true;
  });

  it('contains repeat', () => {
    expect(transducers).to.have.property('repeat');
    expect(isFunction(transducers.repeat)).to.be.true;
  });

  it('contains distinct', () => {
    expect(transducers).to.have.property('distinct');
    expect(isFunction(transducers.distinct)).to.be.true;
  });

  it('contains distinctBy', () => {
    expect(transducers).to.have.property('distinctBy');
    expect(isFunction(transducers.distinctBy)).to.be.true;
  });

  it('contains distinctWith', () => {
    expect(transducers).to.have.property('distinctWith');
    expect(isFunction(transducers.distinctWith)).to.be.true;
  });

  it('contains drop', () => {
    expect(transducers).to.have.property('drop');
    expect(isFunction(transducers.drop)).to.be.true;
  });

  it('contains dropWhile', () => {
    expect(transducers).to.have.property('dropWhile');
    expect(isFunction(transducers.dropWhile)).to.be.true;
  });

  it('contains filter', () => {
    expect(transducers).to.have.property('filter');
    expect(isFunction(transducers.filter)).to.be.true;
  });

  it('contains reject', () => {
    expect(transducers).to.have.property('reject');
    expect(isFunction(transducers.reject)).to.be.true;
  });

  it('contains compact', () => {
    expect(transducers).to.have.property('compact');
    expect(isFunction(transducers.compact)).to.be.true;
  });

  it('contains map', () => {
    expect(transducers).to.have.property('map');
    expect(isFunction(transducers.map)).to.be.true;
  });

  it('contains flatMap', () => {
    expect(transducers).to.have.property('flatMap');
    expect(isFunction(transducers.flatMap)).to.be.true;
  });

  it('contains take', () => {
    expect(transducers).to.have.property('take');
    expect(isFunction(transducers.take)).to.be.true;
  });

  it('contains takeWhile', () => {
    expect(transducers).to.have.property('takeWhile');
    expect(isFunction(transducers.takeWhile)).to.be.true;
  });

  it('contains takeNth', () => {
    expect(transducers).to.have.property('takeNth');
    expect(isFunction(transducers.takeNth)).to.be.true;
  });

  it('contains unique', () => {
    expect(transducers).to.have.property('unique');
    expect(isFunction(transducers.unique)).to.be.true;
  });

  it('contains uniqueBy', () => {
    expect(transducers).to.have.property('uniqueBy');
    expect(isFunction(transducers.uniqueBy)).to.be.true;
  });

  it('contains uniqueWith', () => {
    expect(transducers).to.have.property('uniqueWith');
    expect(isFunction(transducers.uniqueWith)).to.be.true;
  });
});
