import { BehaviorSubject, Observable, pipe } from 'rxjs/Rx';
import { tap, delay, concatMap, ignoreElements } from 'rxjs/operators';
import { HardwareInterface } from '../Hardware';

interface Zone {
  name: string;
  flow: number;
  pin: string;
}

export class Sprinkler {
  running: boolean = false;
  running$ = new BehaviorSubject<boolean>(false);
  nextRun$ = new BehaviorSubject<Date | undefined>(undefined);
  dailyRunTime$ = new BehaviorSubject<Date | undefined>(undefined);

  private zones: Zone[] = [];

  constructor(private hwInterface: HardwareInterface) {}

  add(zone: Zone) {
    this.zones.push(zone);
  }

  start(duration: number) {
    this.running$.next(true);

    return Observable.from(this.zones).pipe(
      concatMap((zone) => Observable.of(zone).pipe(
        tap((x) => console.log(x)),
        tap((zone) => this.startZone(zone)),
        delay(duration * zone.flow),
      )),
      tap(
        (zone) => this.stopZone(zone),
        (error) => this.stop(),
        () => this.stop(),
      ),
      ignoreElements(),
    );
  }

  stop() {
    console.log('stop');
  }

  nextStart(time: Date, duration: number) {
    // if (this.nextRun) { clear(this.nextRun) }
    // this.nextRun = scheduler.on(time, () => this.start(duration));
    //
  }

  private startZone(zone: Zone) {
    this.hwInterface.on(zone.pin);
  }

  private stopZone(zone: Zone) {
    this.hwInterface.off(zone.pin);
  }
}
