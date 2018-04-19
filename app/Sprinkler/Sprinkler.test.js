const test = require('ava');
const sinon = require('sinon');

const { Zone, Sprinkler } = require('./');

const hwI = {
  on: sinon.spy(),
  off: sinon.spy(),
};

function makeSprinkler() {
  const sprinkler = new Sprinkler();

  sprinkler.add(new Zone(hwI, { name: 'one', flow: 1, pin: '1' }));
  sprinkler.add(new Zone(hwI, { name: 'two', flow: 2, pin: '2' }));

  return sprinkler;
}

test('should', (t) => {
  const sprinkler = makeSprinkler();
  const clock = sinon.useFakeTimers();

  sprinkler.start(1000);

  t.true(hwI.on.calledWith('1'));
  t.false(hwI.on.calledWith('2'));

  clock.tick(1000);

  t.true(hwI.off.calledWith('1'));
  t.true(hwI.on.calledWith('2'));

  clock.tick(1000);
  t.false(hwI.off.calledWith('2'));

  clock.tick(1000);
  t.true(hwI.off.calledWith('2'));

  clock.restore();
});
