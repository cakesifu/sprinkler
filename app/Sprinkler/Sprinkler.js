const { BehaviorSubject, Observable } = require('rxjs/Rx');
const { tap, concatMap } = require('rxjs/operators');

class Sprinkler {
  constructor() {
    this.running$ = new BehaviorSubject(false);
    this.zones = [];
  }

  add(zone) {
    this.zones.push(zone);
  }

  async start(duration) {
    this.running$.next(true);
    let i = 0;
    while (this.running$.value && i < this.zones.length) {
      const zone = this.zones[i];
      console.log('start zone ', i);
      await zone.run(duration);
      i++;
    };
  }

  stop() {
    this.zones.forEach((zone) => zone.stop());
    this.running$.next(false);
  }
}

module.exports = {
  Sprinkler,
};
