import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
chai.use(sinonChai);

const assert = chai.assert;
import Promise2 from '../src/promise';

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
    let fn = sinon.fake();
    new Promise2(fn);
    assert(fn.called);
  });
  it('the "fn" passedin must has resolve and reject function', (done) => {
    new Promise2((resolve, reject) => {
      assert.isFunction(resolve);
      assert.isFunction(reject);
      done();
    });
  });
  it('promise.then(success): the success function is called when resolve is called', (done) => {
    const success = sinon.fake();
    const promise = new Promise2((resolve, reject) => {
      assert.isFalse(success.called);
      resolve();
      setTimeout(() => {
        assert.isTrue(success.called);
        done();
      });
    });
    // @ts-ignore
    promise.then(success);
  });
  it('promise.then(null, fail): the fail function is called when reject is called', (done) => {
    const fail = sinon.fake();
    const promise = new Promise2((resolve, reject) => {
      assert.isFalse(fail.called);
      reject();
      setTimeout(() => {
        assert.isTrue(fail.called);
        done();
      });
    });
    // @ts-ignore
    promise.then(null, fail);
  });
  it('2.2.1', () => {
    const promise = new Promise2((resolve) => {
      resolve();
    });
    promise.then(false, null);
    assert(1 === 1);
  });
  it('2.2.2', (done) => {
    const success = sinon.fake();
    const promise = new Promise2((resolve) => {
      assert.isFalse(success.called);
      resolve(123);
      resolve(123);
      setTimeout(() => {
        assert(promise.state === 'fullfilled');
        assert(success.called);
        assert.isTrue(success.calledOnce);
        assert(success.calledWith(123));
        done();
      });
    });
    promise.then(success);
  });
  it('2.2.3', (done) => {
    const fail = sinon.fake();
    const promise = new Promise2((resolve, reject) => {
      assert.isFalse(fail.called);
      reject(123);
      reject(123);
      setTimeout(() => {
        assert(promise.state === 'rejected');
        assert(fail.called);
        assert.isTrue(fail.calledOnce);
        assert(fail.calledWith(123));
        done();
      });
    });
    promise.then(null, fail);
  });
  it('2.2.4: before my code finish running, not run the functio inside then', (done) => {
    const success = sinon.fake();
    const promise = new Promise2((resolve) => {
      resolve();
    });
    promise.then(success);
    console.log(1);
    assert.isFalse(success.called);
    setTimeout(() => {
      assert.isTrue(success.called);
      done();
    }, 0);
  });
  it('2.2.4: fail: before my code finish running, not run the functio inside then', (done) => {
    const fail = sinon.fake();
    const promise = new Promise2((resolve, reject) => {
      reject();
    });
    promise.then(null, fail);
    console.log(1);
    assert.isFalse(fail.called);
    setTimeout(() => {
      assert.isTrue(fail.called);
      done();
    }, 0);
  });
  it('2.2.5', (done) => {
    const promise = new Promise2((resolve, reject) => {
      resolve();
    });
    promise.then(function() {
      'use strict';
      assert(this === undefined);
      done();
    });
  });
  it('2.2.6', (done) => {
    const promise = new Promise2((resolve, reject) => {
      resolve();
    });
    const callbacks = [sinon.fake(), sinon.fake(), sinon.fake()];
    promise.then(callbacks[0]);
    promise.then(callbacks[1]);
    promise.then(callbacks[2]);

    setTimeout(() => {
      assert(callbacks[0].called);
      assert(callbacks[1].called);
      assert(callbacks[2].called);
      assert(callbacks[1].calledAfter(callbacks[0]));
      assert(callbacks[2].calledAfter(callbacks[1]));
      done();
    });
  });
  it('2.2.6: fail', (done) => {
    const promise = new Promise2((resolve, reject) => {
      reject();
    });
    const callbacks = [sinon.fake(), sinon.fake(), sinon.fake()];
    promise.then(null, callbacks[0]);
    promise.then(null, callbacks[1]);
    promise.then(null, callbacks[2]);

    setTimeout(() => {
      assert(callbacks[0].called);
      assert(callbacks[1].called);
      assert(callbacks[2].called);
      assert(callbacks[1].calledAfter(callbacks[0]));
      assert(callbacks[2].calledAfter(callbacks[1]));
      done();
    });
  });
  it('2.2.7: "then" must return promise', () => {
    const promise = new Promise2((resolve, reject) => {
      resolve();
    });

    const promise2 = promise.then(
      () => {},
      () => {}
    );

    //@ts-ignore
    assert(promise2 instanceof Promise2);
  });
});
