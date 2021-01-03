"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("dotenv").config();

const options = {
  port: process.env.PORT,
  app: process.env.APP,
  env: process.env.NODE_ENV,
  isSocketsEnabled: process.env.ENABLE_SOCKETS,
  mongoURL: process.env.MONGO_URL,
  secret: process.env.SECRET_JWT || "secretKey"
};
var _default = options;
exports.default = _default;