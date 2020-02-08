import * as chai from 'chai';
import Promise2 from '../src/promise';

const assert = chai.assert;

describe('Promise2', () => {
  it('is a Class', () => {
    assert.isFunction(Promise2);
    assert.isObject(Promise2.prototype);
  });
  it('new Promise() must accept a function', () => {
    assert.throw(() => {
      // @ts-ignore
      new Promise2();
    });
  });
  it('instance has "then" function', () => {
    const promise = new Promise2(() => {});
    assert.isFunction(promise.then);
  });
  it('runs "fn" passedin immediately', () => {
    let called = false;
    const promise = new Promise2(() => {
      called = true;
    });
    assert.isTrue(called);
  });
  it('the "fn" passedin must has resolve and reject function', () => {
    const promise = new Promise2((resolve, reject) => {
      assert.isFunction(resolve);
      assert.isFunction(reject);
    });
  });
  it('promise.then(success): the success function is called when resolve is called', (done) => {
    let called = false;
    const promise = new Promise2((resolve, reject) => {
      // success is not called
      assert.isFalse(called);
      resolve();
      // success is called
      setTimeout(() => {
        assert.isTrue(called);
        done();
      });
      console.log('code is run');
    });
    // @ts-ignore
    promise.then(() => {
      called = true;
    });
  });
});
