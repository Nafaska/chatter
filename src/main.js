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
import jwt from "jsonwebtoken";
import mongooseService from "./services/mongoose";

const userHandlers = require("./users");
const channelHandlers = require("./channels");
const authHandlers = require("./auth");

mongooseService.connect();

const app = express();

app.use(express.static(path.join(__dirname, "../client/build")));

const httpServer = http.Server(app);

if (config.isSocketsEnabled) {
  const io = socketIo(httpServer, {
    cors: {
      origin: config.clientUrl,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

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

const middleware = [
  cors({
    origin: config.clientUrl,
    credentials: true,
  }),
  passport.initialize(),
  express.static(path.resolve(__dirname, "../dist")),
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  }),
  bodyParser.json({ limit: "50mb", extended: true }),
  cookieParser(),
];

passport.use("jwt", passportJWT.jwt);

function handleErrors(err, req, res, next) {
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      err: "Invalid or missing authorization token",
      message: err.message,
    });
  } else if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      err: "The session is expired. You have to login again",
      message: err.message,
    });
  } else if (
    err.message === "Password Incorrect" ||
    err.message === "No User"
  ) {
    return res.status(401).json({ error: "Invalid Credentials" });
  } else if (err.code === 11000) {
    return res.status(409).json({ error: "User already exists" });
  }
  console.log(err);
  return res.status(500).json({ error: "Something went wrong" });
}

middleware.forEach((it) => app.use(it));

app.use("/api/v2/channels", function (req, res, next) {
  jwt.verify(req.cookies.token, config.secret);
  next();
});

app.use("/api/v2/users", function (req, res, next) {
  jwt.verify(req.cookies.token, config.secret);
  next();
});

app.get("/api/v1/auth/signin", authHandlers.verifyAuth);
app.post("/api/v1/auth/signin", authHandlers.signin);
app.post("/api/v1/auth/signup", authHandlers.signup);
app.post("/api/v1/auth/google", authHandlers.googleSignin);

app.get("/api/v2/channels", channelHandlers.listChannels);
app.get("/api/v2/channels/:channel", channelHandlers.viewChannel);
app.post("/api/v2/channels", channelHandlers.createChannel);
app.patch("/api/v2/channels/:channelName", channelHandlers.updateChannel);

app.get("/api/v2/users", userHandlers.listUsers);
app.delete("/api/v2/users/:userId", userHandlers.deleteUser);
app.patch("/api/v2/users/:userId", userHandlers.updateUser);

app.use(handleErrors);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

httpServer.listen(config.port, () => {
  console.log(`Example app listening at http://localhost:${config.port}`);
});
