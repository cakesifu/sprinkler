const debug = require('debug')('app:sprinkler');
const schedule = require('node-schedule');
const { BehaviorSubject } = require('rxjs/Rx');

class Sprinkler {
  constructor(state = {}) {
    this.running$ = new BehaviorSubject(false);
    this.duration$ = new BehaviorSubject(state.duration || 0);
    this.schedule$ = new BehaviorSubject(state.schedule || undefined);

    this.zones = [];

    this.schedule$.subscribe((cron) => {
      if (this._job) {
        debug('clear existing cron job');
        this._job.cancel();
      }

      if (cron) {
        debug('set new schedule: %s', cron);
        this._job = schedule.scheduleJob(cron, () => this.scheduledStart());
      }
    });
  }

  add(zone) {
    this.zones.push(zone);
  }

  async start(duration) {
    debug('start cycle. base duration: %d minutes', duration / 60000);

    this.running$.next(true);
    this._started = Date.now();
    let i = 0;
    let zone;

    while (this.running$.value && i < this.zones.length) {
      zone = this.zones[i];
      await zone.run(duration);
      i++;
    }

    const len = Date.now() - this._started;
    debug('end cycle after: %d minutes', len / 60000);
    debug('------------------------------------');

    this.running$.next(false);
    return true;
  }

  setDuration(duration) {
    debug('set new base duration: %d minutes', duration / 60000);
    this.duration$.next(duration);
  }

  setSchedule(schedule) {
    this.schedule$.next(schedule);
  }

  scheduledStart() {
    const duration = this.duration$.value;
    debug('start scheduled cycle');
    this.start(duration);
  }

  stop(reason) {
    debug('force stop cycle. reason: %s', reason);
    this.running$.next(false);
    this.zones.forEach((zone) => zone.stop());
  }
}

module.exports = {
  Sprinkler,
};
