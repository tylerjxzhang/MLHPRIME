'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _environment = require('../config/environment');

var _environment2 = _interopRequireDefault(_environment);

var _user = require('../api/user/user.model');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Passport Configuration
require('./local/passport').setup(_user2.default, _environment2.default);
require('./facebook/passport').setup(_user2.default, _environment2.default);
require('./google/passport').setup(_user2.default, _environment2.default);
require('./twitter/passport').setup(_user2.default, _environment2.default);

var router = _express2.default.Router();

router.use('/local', require('./local').default);
router.use('/facebook', require('./facebook').default);
router.use('/twitter', require('./twitter').default);
router.use('/google', require('./google').default);

exports.default = router;
//# sourceMappingURL=index.js.map
