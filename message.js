'use strict';

const util = require('util');
const EventEmitter = require('events');

function HermesMessage (options) {
  options = options || {};
  if (options.stopped === undefined) options.stopped = false;
  if (options.cancel_delivery === undefined) options.cancel_delivery = false;

  const keys = Object.keys(options || {});

  for (let i = 0; i < keys.length; i++) {
    this[keys[i]] = options[keys[i]];
  }
}

util.inherits(HermesMessage, EventEmitter);

HermesMessage.prototype.stop = function stop () {
  this.stopped = true;
};

HermesMessage.prototype.cancelDelivery = function cancelDelivery () {
  this.cancel_delivery = true;
};

HermesMessage.prototype.reply = function reply () {
  if (arguments.length === 1) {
    this.payload = arguments[0];
  } else if (arguments.length === 2) {
    if (typeof arguments[0] !== 'string') return console.error('HermesMessage.reply(topic, payload): topic must be a string.');
    this.topic = arguments[0];
    this.payload = arguments[1];
  }

  this.stop();
  this.send();
};

HermesMessage.prototype.send = function () {
  this.emit('send', this);
};

module.exports = HermesMessage;
