class Promise2 {
  success = null;
  fail = null;
  state = 'pending';

  resolve = (result) => {
    setTimeout(() => {
      if (this.state !== 'pending') {
        return;
      }
      this.state = 'fullfilled';
      if (typeof this.success === 'function') {
        this.success(result);
      }
    }, 0);
  };
  reject = (reason) => {
    setTimeout(() => {
      if (this.state !== 'pending') {
        return;
      }
      this.state = 'rejected';
      if (typeof this.fail === 'function') {
        this.fail(reason);
      }
    }, 0);
  };

  constructor(fn) {
    if (typeof fn !== 'function') {
      throw new Error('I only accept function');
    }
    fn(this.resolve, this.reject);
  }

  then(success?, fail?) {
    if (typeof success === 'function') {
      this.success = success;
    }
    if (typeof fail === 'function') {
      this.fail = fail;
    }
  }
}

export default Promise2;
