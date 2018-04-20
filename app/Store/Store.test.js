const test = require('ava');
const fs = require('mock-fs');
const { Subject } = require('rxjs/Rx');
const { Store } = require('./Store');

function mockFs(data) {
  let text = data;

  if (typeof data === 'object') {
    text = JSON.stringify(data);
  }

  fs({
    '/var/lib/sprinkler/state.json': text,
  });
}

test.afterEach.always(() => fs.restore());


test('reads state at startup', (t) => {
  mockFs({ foo: 'bar' });
  const store = new Store('/var/lib/sprinkler/state.json');
  t.deepEqual(store.state, { foo: 'bar' });
});

test('saves state on change', (t) => {
  mockFs({ foo: 'bar' });
  const store = new Store('/var/lib/sprinkler/state.json');
  const value$ = new Subject();
  store.watch(value$, 'count');

  value$.next('2');

  const store2 = new Store('/var/lib/sprinkler/state.json');
  t.deepEqual(store2.state, { foo:  'bar', count: '2' });
});

test('handles inexistent file', (t) => {
  t.throws(() => new Store('boo'));
});

test('handles empty files', (t) => {
  mockFs('');
  const store = new Store('/var/lib/sprinkler/state.json');

  t.deepEqual(store.state, {});
});
