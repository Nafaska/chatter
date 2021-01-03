"use strict";

var _passportJwt = _interopRequireDefault(require("passport-jwt"));

var _User = _interopRequireDefault(require("../model/User.model"));

var _config = _interopRequireDefault(require("../config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const cookieExtractor = req => {
  return req && req.cookies && req.cookies.token;
};

const jwtOptions = {
  secretOrKey: _config.default.secret,
  jwtFromRequest: _passportJwt.default.ExtractJwt.fromExtractors([cookieExtractor])
};
const jwtStrategy = new _passportJwt.default.Strategy(jwtOptions, (jwtPayload, done) => {
  _User.default.findById(jwtPayload.uid, (err, user) => {
    if (err) {
      return done(err, null);
    }

    if (user) {
      return done(null, user);
    }

    return done(null, false);
  });
});
exports.jwt = jwtStrategy;