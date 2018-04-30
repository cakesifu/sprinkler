const { Subject } = require('rxjs/Rx');
const { filter, map } = require('rxjs/operators');
const mqtt = require('mqtt');

class Device {
  constructor(key, url) {
    this.input$ = new Subject();
    const client = mqtt.connect(url);
    this.client = client;
  }

  input(field) {
    const topic = this.topicFor(field, 'i');
    this.client.subscribe(topic);

    return this.input$.pipe(
      filter((m) => m.field === field),
      map((m) => m.value),
    );
  }

  output(field, value) {
    const topic = this.topicFor(field, 'o');
    this.client.publish(topic, value);
  }

  topicFor(field, io) {
    return `/d/${this.key}/${io}/${field}`;
  }
}
