const test = require('ava');
const sinon = require('sinon');

const { Zone } = require('./Zone');
const hwI = {
  on: sinon.stub(),
  off: sinon.stub(),
};

test('it should stop naturally', t => {
  const zone = new Zone(hwI, { zone: 'one', flow: 1.5, pin: '2' });
  const clock = sinon.useFakeTimers();

  const promise = zone.run(2000);

  t.true(hwI.on.calledWith('2'));

  clock.tick(3100);

  t.true(hwI.off.calledWith('2'));

  clock.restore();
});

test('it should stop when called stop', t => {
  const zone = new Zone(hwI, { zone: 'one', flow: 1.5, pin: '2' });
  const clock = sinon.useFakeTimers();

  const promise = zone.run(2000);

  t.true(hwI.on.calledWith('2'));

  zone.stop();

  t.true(hwI.off.calledWith('2'));

  clock.runAll();

  clock.restore();
});
