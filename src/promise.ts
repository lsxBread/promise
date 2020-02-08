class Promise2 {
  state = 'pending';
  callbacks = [];

  resolve = (result) => {
    setTimeout(() => {
      if (this.state !== 'pending') {
        return;
      }
      this.state = 'fullfilled';
      this.callbacks.forEach((handle) => {
        if (typeof handle[0] === 'function') {
          const x = handle[0].call(undefined, result);
          handle[2].resolveWith(x);
        }
      });
    }, 0);
  };
  reject = (reason) => {
    setTimeout(() => {
      if (this.state !== 'pending') {
        return;
      }
      this.state = 'rejected';
      this.callbacks.forEach((handle) => {
        if (typeof handle[1] === 'function') {
          const x = handle[1].call(undefined, reason);
          handle[2].resolveWith(x);
        }
      });
    }, 0);
  };

  constructor(fn) {
    if (typeof fn !== 'function') {
      throw new Error('I only accept function');
    }
    fn(this.resolve, this.reject);
  }

  then(success?, fail?) {
    const handle = [success, fail];

    if (typeof success === 'function') {
      handle[0] = success;
    }
    if (typeof fail === 'function') {
      handle[1] = fail;
    }
    handle[2] = new Promise2(() => {});
    this.callbacks.push(handle);
    return handle[2];
  }
  resolveWithSelf() {
    this.reject(new TypeError());
  }
  resolveWithPromise(x) {
    x.then(
      (result) => {
        this.resolve(result);
      },
      (reason) => {
        this.reject(reason);
      }
    );
  }
  private getThen(x) {
    let then;
    try {
      then = x.then;
    } catch (e) {
      return this.reject(e);
    }
    return then;
  }
  resolveWithThenable(x) {
    try {
      x.then(
        (y) => {
          this.resolveWith(y);
        },
        (r) => {
          this.reject(r);
        }
      );
    } catch (e) {
      this.reject(e);
    }
  }
  resolveWithObject(x) {
    let then = this.getThen(x);
    if (then instanceof Function) {
      this.resolveWithThenable(x);
    } else {
      this.resolve(x);
    }
  }
  resolveWith(x) {
    if (this === x) {
      this.resolveWithSelf();
    } else if (x instanceof Promise2) {
      this.resolveWithPromise(x);
    } else if (x instanceof Object) {
      this.resolveWithObject(x);
    } else {
      this.resolve(x);
    }
  }
}

export default Promise2;
