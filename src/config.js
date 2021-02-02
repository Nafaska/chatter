require("dotenv").config();

const options = {
  port: process.env.PORT || 5000,
  app: process.env.APP,
  env: process.env.NODE_ENV,
  isSocketsEnabled: process.env.ENABLE_SOCKETS,
  mongoURL: process.env.MONGO_URL || "mongodb://127.0.0.1:27017/auth",
  secret: process.env.SECRET_JWT || "secretKey",
};

export default options;
