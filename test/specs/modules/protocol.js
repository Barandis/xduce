import {
  expect
} from '../../helper';

import {
  protocols as p,
  isImplemented
} from '../../../src/modules/protocol';

describe('Protocol checks', () => {

  context('for the iteration protocol', () => {
    it('works for objects implementing the protocol', () => {
      expect(isImplemented(null, 'iterator')).to.be.false;
      expect(isImplemented(undefined, 'iterator')).to.be.false;
      const obj = {};
      expect(isImplemented(obj, 'iterator')).to.be.false;
      obj[p.iterator] = {};
      expect(isImplemented(obj, 'iterator')).to.be.false;
      obj[p.iterator] = () => {};
      expect(isImplemented(obj, 'iterator')).to.be.true;
    });

    it('works for objects implementing the pseudo-protocol', () => {
      const obj = {next: {}};
      expect(isImplemented(obj, 'iterator')).to.be.false;
      obj.next = () => {};
      expect(isImplemented(obj, 'iterator')).to.be.true;
    });
  });

  context('for reduction protocols', () => {
    it('works for objects implementing init', () => {
      expect(isImplemented(null, 'init')).to.be.false;
      const obj = {};
      expect(isImplemented(obj, 'init')).to.be.false;
      obj[p.init] = {};
      expect(isImplemented(obj, 'init')).to.be.false;
      obj[p.init] = () => {};
      expect(isImplemented(obj, 'init')).to.be.true;
    });

    it('works for objects implementing step', () => {
      expect(isImplemented(null, 'step')).to.be.false;
      const obj = {};
      expect(isImplemented(obj, 'step')).to.be.false;
      obj[p.step] = {};
      expect(isImplemented(obj, 'step')).to.be.false;
      obj[p.step] = () => {};
      expect(isImplemented(obj, 'step')).to.be.true;
    });

    it('works for objects implementing result', () => {
      expect(isImplemented(null, 'result')).to.be.false;
      const obj = {};
      expect(isImplemented(obj, 'result')).to.be.false;
      obj[p.result] = {};
      expect(isImplemented(obj, 'result')).to.be.false;
      obj[p.result] = () => {};
      expect(isImplemented(obj, 'result')).to.be.true;
    });

    it('works for objects implementing reduced', () => {
      expect(isImplemented(null, 'reduced')).to.be.false;
      const obj = {};
      expect(isImplemented(obj, 'reduced')).to.be.false;
      obj[p.reduced] = {};
      expect(isImplemented(obj, 'reduced')).to.be.true;
      obj[p.reduced] = false;
      expect(isImplemented(obj, 'reduced')).to.be.true;
    });

    it('works for objects implementing value', () => {
      expect(isImplemented(null, 'value')).to.be.false;
      const obj = {};
      expect(isImplemented(obj, 'value')).to.be.false;
      obj[p.value] = {};
      expect(isImplemented(obj, 'value')).to.be.true;
      obj[p.value] = 15;
      expect(isImplemented(obj, 'value')).to.be.true;
    });
  });
});
