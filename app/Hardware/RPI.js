const debug = require('debug')('app:hwi:rpi');
const { Gpio } = require('onoff');

class RPIInterface {
  constructor() {
    this._interfaces = {};
  }

  on(pin) {
    debug('opening PIN %s', pin);
    const pin = this.getPinInterface(pin);
    pin.writeSync(1);
  }

  off(pin) {
    debug('closing PIN %s', pin);
    const pin = this.getPinInterface(pin);
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

