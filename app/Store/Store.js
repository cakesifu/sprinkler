const debug = require('debug')('app:store');
const fs = require('fs');

class Store {
  constructor(file) {
    this.file = file;
    this.state = {};

    this._testFileAccess();
    this.load();
  }

  watch(value$, name) {
    value$.subscribe((v) => {
      this.state[name] = v;
      this.save();
    });
  }

  load() {
    debug('reading state from %s', this.file);
    const data = fs.readFileSync(this.file);
    if (data.length) {
      this.state = JSON.parse(data);
    } else {
      this.state = {};
    }
  }

  save() {
    debug('saving state to %s', this.file);
    fs.writeFileSync(this.file, JSON.stringify(this.state));
  }

  _testFileAccess() {
    try {
      fs.accessSync(this.file, fs.constants.R_OK | fs.constants.W_OK);
      debug('able to read/write to %s', this.file);
    } catch (err) {
      debug('unable to read/write to %s. will try to create.', this.file);

      try {
        fs.writeFileSync(this.file, '{}');
        debug('state file created at: %s', this.file);
      } catch (err) {
        debug('unable to create state file: %s', this.file);
        throw err;
      }
    }
  }
}

module.exports = {
  Store,
};
