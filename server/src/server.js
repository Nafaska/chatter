import express from "express";
import cors from "cors";
import path from "path";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import passport from "passport";
import passportJWT from "./services/passport";
import sockjs from "sockjs"
import jwt from "jsonwebtoken";
import config from "./config";
// import axios from "axios";
import mongooseService from "./services/mongoose";
import User from "./model/User.model";

mongooseService.connect();

const app = express();
const port = 5000;
// let connections = [];

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
    console.log(err);
    res.json({ status: "error", err });
  }
});

app.post("/api/v1/auth/signin", async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.findAndValidateUser(req.body);
    const payload = { uid: user.id };
    const token = jwt.sign(payload, config.secret, { expiresIn: "48h" });
    console.log('signin', user, payload, token)
    delete user.password;
    res.cookie("token", token, { maxAge: 1000 * 60 * 60 * 48 });
    res.json({ status: "ok, signed in", token, user });
  } catch (err) {
    console.log(err);
    res.json({ status: "error", err });
  }
});

app.post("/api/v1/auth/signup", async (req, res) => {
  const user = new User({
    email: req.body.email,
    password: req.body.password,
  });
  try {
    console.log(req.body.password, req.body.email);
    const userInfo = await user.save();
    const payload = { uid: userInfo.id };
    const token = jwt.sign(payload, config.secret, { expiresIn: "48h" });
    delete userInfo.password;
    res.cookie("token", token, { maxAge: 1000 * 60 * 60 * 48 });
    console.log(userInfo, token);
    res.send({ status: "ok", token, userInfo });
  } catch (err) {
    res.status(400).send(err);
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// if (config.isSocketsEnabled) {
//   const echo = sockjs.createServer();
//   echo.on("connection", (conn) => {
//     connections.push(conn);
//     console.log("connected");
//     conn.on("data", async () => {
//       console.log("get data");
//     });

//     conn.on("close", () => {
//       connections = connections.filter((c) => c.readyState !== 3);
//     });
//   });
//   echo.installHandlers(app, { prefix: "/ws" });
// }
