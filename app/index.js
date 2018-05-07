require('dotenv').config();

const { Zone, Sprinkler } = require('./Sprinkler');
const { Store } = require('./Store');
const { ConsoleInterface } = require('./Hardware');
const { Device } = require('./Pulsario');
const config = require('./config');


const device = new Device(config.deviceKey, config.mqttUrl);
const store = new Store(config.stateFile);
const hwInterface = new ConsoleInterface();
const sprinkler = new Sprinkler(store.state);

store.watch(sprinkler.duration$, 'duration');
store.watch(sprinkler.schedule$, 'schedule');

sprinkler.add(new Zone(hwInterface, { name: 'one', flow: 1, pin: '1' }));
sprinkler.add(new Zone(hwInterface, { name: 'two', flow: 1.5, pin: '2' }));

device.input('schedule').subscribe((schedule) => sprinkler.setSchedule(schedule));
device.input('duration').subscribe((duration) => sprinkler.setDuration(duration));
device.input('start').subscribe((duration) => sprinkler.start(duration));

sprinkler.running$.subscribe((running) => {
  device.output('running', running);
});
