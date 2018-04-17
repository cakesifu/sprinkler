const test = require('ava');
const sinon = require('sinon');

const { Zone, Sprinkler } = require('./');

const hwI = {
  on: sinon.stub(),
  off: sinon.stub(),
};

function makeSprinkler() {
  const sprinkler = new Sprinkler();

  sprinkler.add(new Zone(hwI, { name: 'one', flow: 1, pin: '1' }));
  sprinkler.add(new Zone(hwI, { name: 'two', flow: 2, pin: '2' }));

  return sprinkler;
}

test.cb('should', (t) => {
  const clock = sinon.useFakeTimers();
  const sprinkler = makeSprinkler();

  sprinkler.start(2000).subscribe(() => t.end());
  t.true(hwI.on.calledWith('1'));
  clock.tick(2000);
  clock.runAll();

  clock.restore();
});
