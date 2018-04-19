class Zone {
  constructor(hwInterface, options) {
    this.name = options.name;
    this.flow = options.flow || 1;
    this.pin = options.pin;
    this.hwInterface = hwInterface;
  }

  run(duration) {
    return new Promise((resolve, reject) => {
      this.hwInterface.on(this.pin);
      this._resolve = resolve;
      this._timeoutId = setTimeout(() => this.stop(), duration * this.flow);
    });
  }

  stop() {
    if (this._timeoutId) {
      clearTimeout(this._timeoutId);
    }

    if (this._resolve) {
      this._resolve();
      this._resolve = undefined;
    }

    this.hwInterface.off(this.pin);
  }
}

module.exports = {
  Zone,
};
