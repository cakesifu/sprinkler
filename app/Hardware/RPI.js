const debug = require('debug')('app:hwi:rpi');
const { Gpio } = require('onoff');

class RPIInterface {
  constructor() {
    this._interfaces = {};
  }

  on(pinNo) {
    debug('opening PIN %s', pinNo);
    const pin = this.getPinInterface(pinNo);
    pin.writeSync(0);
  }

  off(pinNo) {
    debug('closing PIN %s', pinNo);
    const pin = this.getPinInterface(pinNo);
    pin.writeSync(1);
  }

  enable(pinNo) {
    debug('enabling control PIN %s', pinNo);
    const pin = this.getPinInterface(pinNo);
    pin.writeSync(1);
  }

  disable(pinNo) {
    debug('disable control PIN %s', pinNo);
    const pin = this.getPinInterface(pinNo);
    pin.writeSync(0);
  }

  getPinInterface(pin) {
    if (!this._interfaces[pin]) {
      debug('creating inteface for PIN %s', pin);
      this._interfaces[pin] = new Gpio(pin, 'out');
    }

    return this._interfaces[pin];
  }
}

module.exports = {
  RPIInterface,
};

