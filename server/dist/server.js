"use strict";

var _express = _interopRequireDefault(require("express"));

var _cors = _interopRequireDefault(require("cors"));

var _path = _interopRequireDefault(require("path"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _passport = _interopRequireDefault(require("passport"));

var _passport2 = _interopRequireDefault(require("./services/passport"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _config = _interopRequireDefault(require("./config"));

var _mongoose = _interopRequireDefault(require("./services/mongoose"));

var _User = _interopRequireDefault(require("./model/User.model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import axios from "axios";
_mongoose.default.connect();

const app = (0, _express.default)();
const port = 5000;
const middleware = [(0, _cors.default)({
  origin: "http://localhost:3000",
  credentials: true
}), _passport.default.initialize(), _express.default.static(_path.default.resolve(__dirname, "../dist/assets")), _bodyParser.default.urlencoded({
  limit: "50mb",
  extended: true,
  parameterLimit: 50000
}), _bodyParser.default.json({
  limit: "50mb",
  extended: true
}), (0, _cookieParser.default)()];

_passport.default.use("jwt", _passport2.default.jwt);

middleware.forEach(it => app.use(it));
app.get("/api/v1/auth/signin", async (req, res) => {
  try {
    const jwtUser = _jsonwebtoken.default.verify(req.cookies.token, _config.default.secret);

    const user = await _User.default.findById(jwtUser.uid);
    const payload = {
      uid: user.id
    };

    const token = _jsonwebtoken.default.sign(payload, _config.default.secret, {
      expiresIn: "48h"
    });

    delete user.password;
    res.cookie("token", token, {
      maxAge: 1000 * 60 * 60 * 48
    });
    res.json({
      status: "ok",
      token,
      user
    });
  } catch (err) {
    console.log(err);
    res.json({
      status: "error",
      err
    });
  }
});
app.post("/api/v1/auth/signin", async (req, res) => {
  console.log(req.body);

  try {
    const user = await _User.default.findAndValidateUser(req.body);
    const payload = {
      uid: user.id
    };

    const token = _jsonwebtoken.default.sign(payload, _config.default.secret, {
      expiresIn: "48h"
    });

    console.log('signin', user, payload, token);
    delete user.password;
    res.cookie("token", token, {
      maxAge: 1000 * 60 * 60 * 48
    });
    res.json({
      status: "ok, signed in",
      token,
      user
    });
  } catch (err) {
    console.log(err);
    res.json({
      status: "error",
      err
    });
  }
});
app.post("/api/v1/auth/signup", async (req, res) => {
  const user = new _User.default({
    email: req.body.email,
    password: req.body.password
  });

  try {
    console.log(req.body.password, req.body.email);
    const userInfo = await user.save();
    const payload = {
      uid: userInfo.id
    };

    const token = _jsonwebtoken.default.sign(payload, _config.default.secret, {
      expiresIn: "48h"
    });

    delete userInfo.password;
    res.cookie("token", token, {
      maxAge: 1000 * 60 * 60 * 48
    });
    console.log(userInfo, token);
    res.send({
      status: "ok",
      token,
      userInfo
    });
  } catch (err) {
    res.status(400).send(err);
  }
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});