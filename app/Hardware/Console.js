class ConsoleInterface {
  on(pin) {
    console.log('opening :', pin);
  }

  off(pin) {
    console.log('closing :', pin);
  }
}

module.exports = {
  ConsoleInterface,
};
