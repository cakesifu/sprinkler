const test = require('ava');
const flush = require('flush-promises');
const sinon = require('sinon');

const { Zone, Sprinkler } = require('./');

function makeHwi() {
  return {
    on: sinon.spy(),
    off: sinon.spy(),
  };
}

function makeSprinkler(hwI) {
  const sprinkler = new Sprinkler();

  sprinkler.add(new Zone(hwI, { name: 'one', flow: 1, pin: '1' }));
  sprinkler.add(new Zone(hwI, { name: 'two', flow: 2, pin: '2' }));

  return sprinkler;
}

test.serial('runs zones in order one after another', async (t) => {
  const clock = sinon.useFakeTimers();
  const hwI = makeHwi();
  const sprinkler = makeSprinkler(hwI);

  const promise = sprinkler.start(1000);

  t.true(hwI.on.calledWith('1'));
  t.false(hwI.on.calledWith('2'));
  t.false(hwI.off.calledWith('1'));

  clock.tick(1000);

  await flush();

  t.true(hwI.off.calledWith('1'));
  t.true(hwI.on.calledWith('2'));
  t.false(hwI.off.calledWith('2'));

  await flush();

  clock.tick(2000);

  await flush();

  t.true(hwI.off.calledWith('2'));

  return promise.then(() => clock.restore());
});

test.serial('updates running$ with current status', async (t) => {
  const clock = sinon.useFakeTimers();
  const hwI = makeHwi();
  const sprinkler = makeSprinkler(hwI);

  t.false(sprinkler.running$.value);

  const promise = sprinkler.start(1000);

  t.true(sprinkler.running$.value);

  clock.tick(1000);
  await flush();
  clock.tick(2000);
  await flush();

  await promise;

  t.false(sprinkler.running$.value);
  clock.restore();
});
