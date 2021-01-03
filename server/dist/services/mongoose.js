"use strict";

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import config from "../config";
const MONGO_URL = "mongodb://127.0.0.1:27017/auth";

_mongoose.default.connection.on("connected", () => {
  console.log("db is connected");
});

_mongoose.default.connection.on("error", err => {
  console.log(`can not connect to db ${err}`);
  process.exit(1);
});

exports.connect = async () => {
  _mongoose.default.connect(MONGO_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
  });

  return _mongoose.default.connection;
};