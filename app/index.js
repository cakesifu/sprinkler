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

sprinkler.start(5000);
sprinkler.setSchedule('* * * * *');
sprinkler.setDuration(10000);
