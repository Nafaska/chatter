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
import Channel from "./model/Channel.model";
import { getMyCurrentIP } from "./utils/ipDetector";

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

app.get("/api/v1/auth/signin", async (req, res) => {
  try {
    const jwtUser = jwt.verify(req.cookies.token, config.secret);
    const user = await User.findById(jwtUser.uid);
    // const payload = { uid: user.id };
    // const token = jwt.sign(payload, config.secret, { expiresIn: "48h" });
    delete user.password;
    // res.cookie("token", token, { maxAge: 1000 * 60 * 60 * 48 });
    res.status(200).json({ token: req.cookies.token, user });
  } catch (err) {
    res.status(401).json({ error: err });
  }
});

app.post("/api/v1/auth/signin", async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      return res.status(422).json({ error: "Fill all required fields" });
    }
    const user = await User.findAndValidateUser(req.body);
    const payload = { uid: user.id };
    const token = jwt.sign(payload, config.secret, { expiresIn: "48h" });
    delete user.password;
    res.cookie("token", token, { maxAge: 1000 * 60 * 60 * 48 });
    res.status(200).json({ token, user });
  } catch (err) {
    console.log(err);
    if (err.message === "Password Incorrect" || err.message === "No User") {
      res.status(401).json({ error: "Invalid Credentials" });
    } else {
      res.status(500).json({ error: "Something went wrong" });
    }
  }
});

app.post("/api/v1/auth/signup", async (req, res) => {
  try {
    const newUser = new User({
      email: req.body.email,
      password: req.body.password,
      username: req.body.username,
    });

    if (!req.body.email || !req.body.password) {
      return res.status(422).json({ error: "Fill all required fields" });
    }

    const validationUser = await User.findOne({ email: req.body.email }).exec();
    if (validationUser) {
      console.log(validationUser, "user is already exist");
      return res.status(409).send("user is already exist");
    }

    const user = await newUser.save();
    const payload = { uid: user.id };
    const token = jwt.sign(payload, config.secret, { expiresIn: "48h" });
    delete user.password;
    res.cookie("token", token, { maxAge: 1000 * 60 * 60 * 48 });
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get("/api/v1/channels", async (req, res) => {
  try {
    const jwtUser = jwt.verify(req.cookies.token, config.secret);
    const user = await User.findById(jwtUser.uid);
    res.status(200).json({ listOfChannels: user.participant });
  } catch (err) {
    res.status(404).json({ error: err });
  }
});

app.get("/api/v1/channels/:channel", async (req, res) => {
  const { channel } = req.params;
  try {
    const validationChannel = await User.find({
      participant: channel,
    }).exec();
    if (validationChannel.length === 0) {
      console.log(validationChannel, "chat isn't exist");
      return res.status(409).send("chat isn't exist");
    }
    const jwtUser = jwt.verify(req.cookies.token, config.secret);
    const user = await User.findById(jwtUser.uid);
    res.status(200).json({ username: user.username });
  } catch (err) {
    res.status(404).json({ error: err });
  }
});

app.post("/api/v1/channels", async (req, res) => {
  try {
    const jwtUser = jwt.verify(req.cookies.token, config.secret);
    const user = await User.findById(jwtUser.uid);
    console.log(user.participant, req.body.channel);
    await User.findOneAndUpdate(
      { _id: user._id },
      { participant: [...user.participant, req.body.channel] }
    );
    // if (updatedUser.participant.includes(req.body.channel))
    res.status(200).json({ newChannel: req.body.channel });
  } catch (err) {
    console.log(err);
    res.status(401).json({ error: err });
  }
});

app.get("/api/v1/new-channels", async (req, res) => {
  try {
    // const jwtUser = jwt.verify(req.cookies.token, config.secret);
    // const user = await User.findById(jwtUser.uid);
    const channels = await Channel.find();
    res.status(200).json({ channels });
  } catch (err) {
    res.status(404).json({ error: err });
  }
});

app.post("/api/v1/new-channels", async (req, res) => {
  try {
    const newChannel = new Channel({
      name: req.body.name,
      participants: [],
    });

    if (!req.body.name) {
      return res.status(422).json({ error: "Fill all required fields" });
    }

    const validationChannel = await Channel.findOne({
      name: req.body.name,
    }).exec();

    if (validationChannel) {
      console.log(validationChannel, "channel already exists");
      return res.status(409).send("channel already exists");
    }

    const channel = await newChannel.save();

    res.status(200).json({ channel });
  } catch (err) {
    res.status(400).send(err);
  }
});

app.post("/api/v1/user-in-channel", async (req, res) => {
  try {
    const user = req.body.user;
    const name = req.body.name;
    const channel = await Channel.findOne({ name: name }).exec();

    const returnChannel = await Channel.findOneAndUpdate(
      { name: name },
      { participants: [...channel.participants, user] },
      { new: true }
    ).exec();

    // const returnChannel = await Channel.findOne({ name: name }).exec();

    res.status(200).json({ returnChannel });
  } catch (err) {
    res.status(400).send(err);
  }
});

httpServer.listen(port, () => {
  console.log(`Example app listening at http://${getMyCurrentIP()}:${port}`);
});
