const debug = require('debug')('app:sprinkler');
const schedule = require('node-schedule');
const { BehaviorSubject } = require('rxjs/Rx');
const { minutes } = require('./utils');

class Sprinkler {
  constructor(state = {}) {
    debug('create sprinkler with state %o', state);
    this.running$ = new BehaviorSubject(false);
    this.duration$ = new BehaviorSubject(state.duration || 0);
    this.schedule$ = new BehaviorSubject(state.schedule || '');

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
    debug('start cycle. base duration: %s', minutes(duration));

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
    debug('end cycle after: %s ', minutes(len));
    debug('------------------------------------');

    this.running$.next(false);
    return true;
  }

  setDuration(duration) {
    duration = parseInt(duration, 10);
    debug('set new base duration: %s ', minutes(duration));
    this.duration$.next(duration);
  }

  setSchedule(schedule) {
    this.schedule$.next(schedule);
  }

  scheduledStart() {
    const duration = this.duration$.value;

    if (!duration) {
      debug('skipping scheduled start because baseDuration is 0');
      return;
    }

    debug('start scheduled cycle (%s)', minutes(duration));
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
