const { BehaviorSubject, Observable, pipe } = require('rxjs/Rx');
const { tap, delay, concatMap, ignoreElements } = require('rxjs/operators');

class Sprinkler {
  running$ = new BehaviorSubject(false);
  nextRun$ = new BehaviorSubject(undefined);
  dailyRunTime$ = new BehaviorSubject(undefined);

  zones = [];

  constructor(hwInterface) {
    this.hwInterface = hwInterface;
  }

  add(zone) {
    this.zones.push(zone);
  }

  start(duration) {
    this.running$.next(true);

    return Observable.from(this.zones).pipe(
      concatMap((zone) => Observable.of(zone).pipe(
        tap((x) => console.log(x)),
        tap((zone) => this.startZone(zone)),
        delay(duration * zone.flow),
      )),
      tap(
        (zone) => this.stopZone(zone),
        () => this.stop(),
        () => this.stop(),
      ),
      ignoreElements(),
    );
  }

  stop() {
    console.log('stop');
  }

  nextStart(time, duration) {
    // if (this.nextRun) { clear(this.nextRun) }
    // this.nextRun = scheduler.on(time, () => this.start(duration));
    //
  }

  startZone(zone) {
    this.hwInterface.on(zone.pin);
  }

  stopZone(zone) {
    this.hwInterface.off(zone.pin);
  }
}

module.exports = {
  Sprinkler,
};
