class Promise2 {
  state = 'pending';
  callbacks = [];

  resolve = result => {
    setTimeout(() => {
      if (this.state !== 'pending') {
        return;
      }
      this.state = 'fullfilled';
      this.callbacks.forEach(handle => {
        if (typeof handle[0] === 'function') {
          handle[0].call(undefined, result);
        }
      });
    }, 0);
  };
  reject = reason => {
    setTimeout(() => {
      if (this.state !== 'pending') {
        return;
      }
      this.state = 'rejected';
      this.callbacks.forEach(handle => {
        if (typeof handle[1] === 'function') {
          handle[1].call(undefined, reason);
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
    this.callbacks.push(handle);

    return new Promise2(() => {});
  }
}

export default Promise2;
