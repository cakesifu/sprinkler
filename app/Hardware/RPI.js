const debug = require('debug')('app:hwi:rpi');
const { Gpio } = require('onoff');

class RPIInterface {
  constructor() {
    this._interfaces = {};
  }

  on(pinNo) {
    debug('opening PIN %s', pinNo);
    const pin = this.getPinInterface(pinNo);
    pin.writeSync(1);
  }

  off(pinNo) {
    debug('closing PIN %s', pinNo);
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

