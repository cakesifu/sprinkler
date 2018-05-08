const debug = require('debug')('pulsario:device');

const { Subject } = require('rxjs/Rx');
const { filter, map } = require('rxjs/operators');
const mqtt = require('mqtt');

class Device {
  constructor(key, url) {
    this.input$ = new Subject();
    const client = mqtt.connect(url);
    this.client = client;
    this.key = key;

    this.client.on('connect', this.handleConnect.bind(this));
    this.client.on('message', this.handleMessage.bind(this));
    this.client.on('error', this.handleError.bind(this));
  }

  input(field) {
    const topic = this.topicFor(field, 'i');
    debug('subscribing to %s', topic);
    this.client.subscribe(topic);

    return this.input$.pipe(
      filter((m) => m.field === field),
      map((m) => m.value),
    );
  }

  output(field, value) {
    const topic = this.topicFor(field, 'o');
    if (typeof value === 'boolean') {
      value = value ? 1 : 0;
    }

    if (typeof value === 'number') {
      value = String(value);
    }

    debug('publishing to %s -> %s', topic, value);
    this.client.publish(topic, value);
  }

  topicFor(field, io) {
    return `/d/${this.key}/${io}/${field}`;
  }

  handleError(err) {
    debug('error connecting to mqtt ', err);
  }

  handleConnect() {
    debug('connected to mqtt (%s)', this.key);
  }

  handleMessage(topic, value) {
    if (value instanceof Buffer) {
      value = value.toString();
    }

    debug('received message %s <- %s', topic, value);
    const parts = topic.split('/');
    const key = parts[2];
    if (key !== this.key) {
      return;
    }

    const field = parts[4];
    this.input$.next({ field, value });
  }
}

module.exports = {
  Device,
};
