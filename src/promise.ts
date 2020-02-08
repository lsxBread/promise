class Promise2 {
  success = null;
  fail = null;
  state = 'pending';

  resolve = () => {
    setTimeout(() => {
      if (typeof this.success === 'function') {
        this.success();
      }
    }, 0);
  };
  reject = () => {
    setTimeout(() => {
      if (typeof this.fail === 'function') {
        this.fail();
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
