require('dotenv').config();

const { Zone, Sprinkler } = require('./Sprinkler');
const { Store } = require('./Store');
const { ConsoleInterface, RPIInterface } = require('./Hardware');
const { Device } = require('./Pulsario');
const config = require('./config');


const device = new Device(config.deviceKey, config.mqttUrl);
const store = new Store(config.stateFile);
const hwInterface = config.interface === 'rpi' ? new RPIInterface() : new ConsoleInterface();
const sprinkler = new Sprinkler(store.state);

store.watch(sprinkler.duration$, 'duration');
store.watch(sprinkler.schedule$, 'schedule');

config.zones.forEach((data) => {
  sprinkler.add(new Zone(hwInterface, data));
});


device.input('schedule').subscribe((schedule) => sprinkler.setSchedule(schedule));
device.input('duration').subscribe((duration) => sprinkler.setDuration(duration));
device.input('start').subscribe((duration) => sprinkler.start(duration));

sprinkler.running$.subscribe((running) => {
  device.output('running', running);
});
