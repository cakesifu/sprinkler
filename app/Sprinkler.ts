import { BehaviorSubject, Observable } from 'rxjs/Rx';

interface Zone {
  name: string;
  flow: number;
  pin: string;
};

export class Sprinkler {
  public running: boolean = false;
  public running$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private zones: Zone[] = [];

  constructor() {
  }

  add(zone: Zone) {
    this.zones.push(zone);
  }

  stop() {
  }

  start(duration: number) {
    this.running$.next(true);

    Observable.from(this.zones)
      .concatMap((zone) =>
        Observable.of(zone)
          .do((zone) => this.startZone(zone))
          .delay(duration * zone.flow)
      )
      .do(
        (zone) => this.stopZone(zone),
        (error) => this.stop(),
        () => this.stop(),
      );

  }

  nextStart(time: Date, duration: number) {
    // if (this.nextRun) { clear(this.nextRun) }
    // this.nextRun = scheduler.on(time, () => this.start(duration));
    //
  }

  private startZone(zone) {
  }

  private stopZone(zone) {
  }
}
