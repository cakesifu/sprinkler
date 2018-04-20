const fs = require('fs');

class Store {
  constructor(file) {
    this.file = file;
    this.state = {};

    fs.accessSync(file, fs.constants.R_OK | fs.constants.W_OK);
    this.load();
  }

  watch(value$, name) {
    value$.subscribe((v) => {
      this.state[name] = v;
      this.save();
    });
  }

  load() {
    const data = fs.readFileSync(this.file);
    if (data.length) {
      this.state = JSON.parse(data);
    } else {
      this.state = {};
    }
  }

  save() {
    fs.writeFileSync(this.file, JSON.stringify(this.state));
  }
}

module.exports = {
  Store,
};
