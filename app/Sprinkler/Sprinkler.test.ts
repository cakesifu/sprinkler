import test from 'ava';
import sinon from 'sinon';

import { Sprinkler } from './Sprinkler';

const hwI = {
  on: sinon.stub(),
  off: sinon.stub(),
};

test('should', (t) => {
  const clock = sinon.useFakeTimers();
  const sprinkler = new Sprinkler(hwI);
  sprinkler.add({
    name: 'one',
    flow: 1,
    pin: '1',
  });
  sprinkler.add({
    name: 'two',
    flow: 1,
    pin: '2',
  });

  sprinkler.start(2000);
  t.true(hwI.on.calledWith('1'));


  clock.restore();
});
