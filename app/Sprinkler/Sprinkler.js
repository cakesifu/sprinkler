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

  start(duration) {
    this.running$.next(true);
    return Observable.from(this.zones).pipe(
      concatMap((zone) => zone.run(duration)),
      tap(
        () => null,
        () => null,
        () => this.running$.next(false)
      ),
    );
  }

  stop() {
    this.zones.forEach((zone) => zone.stop());
  }
}

module.exports = {
  Sprinkler,
};
