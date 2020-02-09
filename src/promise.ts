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

  resolveWith = (x) => {
    if (this === x) {
      this.reject(new TypeError(''));
    } else if (x instanceof Promise2) {
      x.then(
        (result) => {
          this.resolve(result);
        },
        (reason) => {
          this.reject(reason);
        }
      );
    } else if (x instanceof Object) {
      let then;
      try {
        then = x.then;
      } catch (e) {
        this.reject(e);
      }
      if (then instanceof Function) {
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
      } else {
        this.resolve(x);
      }
    } else {
      this.resolve(x);
    }
  };
}

export default Promise2;
