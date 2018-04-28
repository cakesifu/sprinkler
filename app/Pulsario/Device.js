const { Subject } = require('rxjs/Rx');
const mqtt = require('mqtt');

class Device {
  constructor(key, url, mqtt) {
    this.input$ = new Subject();
    const client = mqtt.connect(url);
    this.client = client;
  }

  listen(field) {

  }

  set(field, value) {

  }

}
