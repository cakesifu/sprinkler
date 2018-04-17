const { Zone, Sprinkler } = require('./Sprinkler');
const { ConsoleInterface } = require('./Hardware');

const hwInterface = new ConsoleInterface();
const sprinkler = new Sprinkler();

sprinkler.add(new Zone(hwInterface, { name: 'one', flow: 1, pin: '1' }));
sprinkler.add(new Zone(hwInterface, { name: 'two', flow: 1.5, pin: '2' }));

sprinkler.start(5000).subscribe();

setTimeout(() => {
  sprinkler.stop();
}, 6000);

