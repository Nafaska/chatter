import express from "express";
import cors from "cors";
import path from "path";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import passport from "passport";
import passportJWT from "./services/passport";
import socketIo from "socket.io";
import http from "http";
import jwt from "jsonwebtoken";
import config from "./config";
import mongooseService from "./services/mongoose";
import User from "./model/User.model";

mongooseService.connect();

const app = express();
const httpServer = http.Server(app);
const io = socketIo(httpServer, {
  cors: {
    origin: "http://localhost:3000",
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
  cors({ origin: "http://localhost:3000", credentials: true }),
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

app.get("/api/v1/auth/signin", async (req, res) => {
  try {
    const jwtUser = jwt.verify(req.cookies.token, config.secret);
    const user = await User.findById(jwtUser.uid);
    const payload = { uid: user.id };
    const token = jwt.sign(payload, config.secret, { expiresIn: "48h" });
    delete user.password;
    res.cookie("token", token, { maxAge: 1000 * 60 * 60 * 48 });
    res.json({ status: "ok", token, user });
  } catch (err) {
    res.status(401).json({ status: "error", err });
  }
});

app.post("/api/v1/auth/signin", async (req, res) => {
  try {
    const user = await User.findAndValidateUser(req.body);
    const payload = { uid: user.id };
    const token = jwt.sign(payload, config.secret, { expiresIn: "48h" });
    delete user.password;
    res.cookie("token", token, { maxAge: 1000 * 60 * 60 * 48 });
    // connections.forEach((c) =>
    //   c.write(
    //     JSON.stringify({
    //       type: "SHOW_MESSAGE",
    //       message: `${user.email} jist logged in`,
    //     })
    //   )
    // );
    res.json({ status: "ok, signed in", token, user });
  } catch (err) {
    console.log(err);
    res.json({ status: "error", err });
  }
});

app.post("/api/v1/auth/signup", async (req, res) => {
  const newUser = new User({
    email: req.body.email,
    password: req.body.password,
    username: req.body.username,
  });
  try {
    const user = await newUser.save();
    const payload = { uid: user.id };
    const token = jwt.sign(payload, config.secret, { expiresIn: "48h" });
    delete user.password;
    res.cookie("token", token, { maxAge: 1000 * 60 * 60 * 48 });
    res.send({ status: "ok", token, user });
  } catch (err) {
    res.status(400).send(err);
  }
});

httpServer.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
