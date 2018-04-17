const { Subject, Observable } = require('rxjs/Rx');
const { first, tap, delay } = require('rxjs/operators');

class Zone {
  constructor(hwInterface, options) {
    this.name = options.name;
    this.flow = options.flow || 1;
    this.pin = options.pin;
    this.hwInterface = hwInterface;
    this._stopSignal$ = new Subject();
  }

  run(duration) {
    return Observable.race(
      Observable.of(this).pipe(
        tap(() => this.hwInterface.on(this.pin)),
        delay(duration * this.flow),
      ),
      this._stopSignal$.pipe(first()),
    ).pipe(
      tap(() => this.hwInterface.off(this.pin)),
    );
  }

  stop() {
    this._stopSignal$.next(true);
  }
}

module.exports = {
  Zone,
};
