/**
 * User model events
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _events = require('events');

var _user = require('./user.model');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var UserEvents = new _events.EventEmitter();

// Set max event listeners (0 == unlimited)
UserEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  _user2.default.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc) {
    UserEvents.emit(event + ':' + doc._id, doc);
    UserEvents.emit(event, doc);
  };
}

exports.default = UserEvents;
//# sourceMappingURL=user.events.js.map
