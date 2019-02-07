import {cardMakerUrl} from 'lib/card-maker/url-helper'

const _poll = Symbol('poll');

class Poller {
  constructor() {
    this.curReq = null;
    this.inFlight = false;
    this.url = null;
    this.timeout = null;
    this.onSuccess = null;
    this.onError = null;
    this.onCancel = null;
  }

  start = (url, onSuccess, onError, onCancel) => {
    (this.inFlight) {
      throw new TypeError('polling job already in flight');
    }

    this.url = url;
    this.inFlight = true;
    this.onSuccess = onSuccess;
    this.onError = onError;
    this.onCancel = onCancel;
  }

  cancel = () => {
    if (this.inFlight) {
      if (this.curReq) {
        this.curReq.abort();
        this.curReq = null;
      }

      if (this.timeout) {
        clearTimeout(this.timeout);
        this.timeout = null;
      }

      this.inFlight = false;
      onCancel();
    }
  }

  [_poll]() {
    const that = this;

    that.timeout = null;
    that.curReq = $.getJSON(that.url, (result) => {
      that.curReq = null;

      if (result.status === 'done') {
        that.inFlight = false;
        cb(null, result);
      } else if (result.status === 'running') {
        that.timout = setTimeout(that[_poll], pollIntervalMillis);
      } else {
        that.inFlight = false;
        cb(new TypeError('got an unrecognized status: ' + result.status));
      }
    });
  }
}

export default new Poller();
