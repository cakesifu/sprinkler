const debug = require('debug')('app:hwi:console');

class ConsoleInterface {
  on(pin) {
    debug('opening : %s', pin);
  }

  off(pin) {
    debug('closing : %s', pin);
  }
}

module.exports = {
  ConsoleInterface,
};
