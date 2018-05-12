const debug = require('debug')('app:zone');
const { minutes } = require('./utils');

class Zone {
  constructor(hwInterface, options) {
    this.name = options.name;
    this.flow = options.flow || 1;
    this.pin = options.pin;
    this.hwInterface = hwInterface;
    this._started = Date.now();
  }

  run(duration) {
    return new Promise((resolve) => {
      const finalDuration = duration * this.flow;
      this._started = Date.now();

      debug('starting zone %s for %s ', this.name, minutes(finalDuration));
      this.hwInterface.on(this.pin);
      this._resolve = resolve;
      this._timeoutId = setTimeout(() =>  this.stop(), finalDuration);
    });
  }

  stop() {
    this.hwInterface.off(this.pin);
    const duration = Date.now() - this._started;
    debug('stopped zone %s after %s', this.name, minutes(duration));

    if (this._timeoutId) {
      clearTimeout(this._timeoutId);
    }

    if (this._resolve) {
      const resolve = this._resolve;
      this._resolve = undefined;
      resolve();
    }
  }
}

module.exports = {
  Zone,
};
