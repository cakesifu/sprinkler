const test = require('ava');
const mqtt = require('mqtt');
const sinon = require('sinon');
const EventEmitter = require('events');
const { tap, take } = require('rxjs/operators');

const { Device } = require('./Device');

function makeClient() {
  const client = new EventEmitter();
  client.subscribe = sinon.stub();
  client.publish = sinon.stub();

  sinon.stub(mqtt, 'connect').returns(client);

  return client;
}

test.afterEach.always(() => {
  if (mqtt.connect.restore) {
    mqtt.connect.restore();
  }
});

test('subscribes to mqtt' , t => {
  const client = makeClient();
  const device = new Device('foo', 'mqtt://127.0.0.1');

  t.true(mqtt.connect.calledWith('mqtt://127.0.0.1'));

  device.input('duration');

  t.true(client.subscribe.calledWith('/d/foo/i/duration'));
});


test('receives message', t => {
  const client = makeClient();
  const device = new Device('foo', 'mqtt://127.0.0.1');

  t.plan(1);

  const obs = device.input('duration').pipe(
    take(1),
    tap((value) => t.is(value, '123')),
  ).subscribe();

  const value = Buffer.from('123');
  client.emit('message', '/d/foo/i/duration', value);
});


test('publishes message', t => {
  const client = makeClient();
  const device = new Device('foo', 'mqtt://127.0.0.1');

  device.output('duration', '234');

  t.true(client.publish.calledWith('/d/foo/o/duration', '234'));
});

test('publishes message as a number', t => {
  const client = makeClient();
  const device = new Device('foo', 'mqtt://127.0.0.1');

  device.output('duration', 234);

  t.true(client.publish.calledWith('/d/foo/o/duration', '234'));
});

test('publishes message as a boolean', t => {
  const client = makeClient();
  const device = new Device('foo', 'mqtt://127.0.0.1');

  device.output('duration', true);

  t.true(client.publish.calledWith('/d/foo/o/duration', '1'));
});
