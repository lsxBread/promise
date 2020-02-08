class Promise2 {
  success = null;
  fail = null;
  resolve = () => {
    setTimeout(() => {
      this.success();
    }, 0);
  };
  reject = () => {
    setTimeout(() => {
      this.fail();
    }, 0);
  };

  constructor(fn) {
    if (typeof fn !== 'function') {
      throw new Error('I only accept function');
    }
    fn(this.resolve, this.reject);
  }

  then(success, fail) {
    this.success = success;
    this.fail = fail;
  }
}

export default Promise2;
