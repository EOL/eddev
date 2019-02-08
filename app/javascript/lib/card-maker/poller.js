import {cardMakerUrl} from 'lib/card-maker/url-helper'

const _poll = Symbol('poll');
const pollIntervalMillis = 1000;

class Poller {
  constructor() {
    this.curReq = null;
    this.inFlight = false;
    this.url = null;
    this.timeout = null;
    this.onSuccess = null;
    this.onError = null;
  }

  start = (url, onSuccess, onError) => {
    if (this.inFlight) {
      throw new TypeError('polling job already running');
    }

    this.url = url;
    this.inFlight = true;
    this.onSuccess = onSuccess;
    this.onError = onError;
    this[_poll]();
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
    }
  }

  [_poll]() {
    const that = this;

    that.timeout = null;
    that.curReq = $.getJSON(that.url, (result) => {
      that.curReq = null;

      if (result.status === 'done') {
        that.inFlight = false;
        that.onSuccess(result);
      } else if (result.status === 'running') {
        that.timeout = setTimeout(that[_poll].bind(that), pollIntervalMillis);
      } else {
        that.inFlight = false;
        that.onError(new TypeError('got an unrecognized status: ' + result.status));
      }
    });
  }
}

export default Poller;
