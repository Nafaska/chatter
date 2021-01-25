import express from "express";
import cors from "cors";
import path from "path";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import passport from "passport";
import passportJWT from "./services/passport";
import socketIo from "socket.io";
import http from "http";
import config from "./config";
import mongooseService from "./services/mongoose";
import { getMyCurrentIP } from "./utils/ipDetector";

const userHandlers = require("./users");
const channelHandlers = require("./channels");
const authHandlers = require("./auth");

mongooseService.connect();

const app = express();
const httpServer = http.Server(app);
const io = socketIo(httpServer, {
  cors: {
    origin: `http://${getMyCurrentIP()}:9000`,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

if (config.isSocketsEnabled) {
  io.on("connection", (conn) => {
    console.log("connected");
    conn.on("send message", (msg) => {
      console.log("server message > " + msg);
      io.emit("get message", msg);
    });

    conn.on("disconnect", () => {
      console.log("CONNECTION CLOSED");
    });
  });
}

const port = 5000;

const middleware = [
  cors({ origin: `http://${getMyCurrentIP()}:9000`, credentials: true }),
  passport.initialize(),
  express.static(path.resolve(__dirname, "../dist/assets")),
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  }),
  bodyParser.json({ limit: "50mb", extended: true }),
  cookieParser(),
];

passport.use("jwt", passportJWT.jwt);

middleware.forEach((it) => app.use(it));

authHandlers.verifyAuth(app);
authHandlers.signin(app);
authHandlers.signup(app);

channelHandlers.getAllChannels(app);
channelHandlers.getChannel(app);
channelHandlers.createChannel(app);
channelHandlers.updateChannel(app);

userHandlers.getAllUsers(app);
userHandlers.updateUser(app);
userHandlers.deleteUser(app);

httpServer.listen(port, () => {
  console.log(`Example app listening at http://${getMyCurrentIP()}:${port}`);
});
