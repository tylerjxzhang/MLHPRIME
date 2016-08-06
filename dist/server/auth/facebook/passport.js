'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setup = setup;

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _passportFacebook = require('passport-facebook');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function setup(User, config) {
  _passport2.default.use(new _passportFacebook.Strategy({
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret,
    callbackURL: config.facebook.callbackURL,
    profileFields: ['displayName', 'emails']
  }, function (accessToken, refreshToken, profile, done) {
    User.findOne({ 'facebook.id': profile.id }).exec().then(function (user) {
      if (user) {
        return done(null, user);
      }

      user = new User({
        name: profile.displayName,
        email: profile.emails[0].value,
        role: 'user',
        provider: 'facebook',
        facebook: profile._json
      });
      user.save().then(function (user) {
        return done(null, user);
      }).catch(function (err) {
        return done(err);
      });
    }).catch(function (err) {
      return done(err);
    });
  }));
}
//# sourceMappingURL=passport.js.map
