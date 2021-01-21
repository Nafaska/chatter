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
    res.status(200).json({
      token: req.cookies.token,
      username: user.username,
      role: user.role,
      email: user.email,
    });
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
    res.cookie("token", token, { maxAge: 1000 * 60 * 60 * 48 });
    res.status(200).json({
      token,
      username: user.username,
      role: user.role,
      email: user.email,
    });
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

    if (!req.body.email || !req.body.password || !req.body.username) {
      return res.status(422).json({ error: "Fill all required fields" });
    }

    const validationUser = await User.findOne({ email: req.body.email }).exec();
    if (validationUser) {
      console.log(validationUser, "User already exists");
      return res.status(409).json({ error: "User already exists" });
    }

    const user = await newUser.save();
    const payload = { uid: user.id };
    const token = jwt.sign(payload, config.secret, { expiresIn: "48h" });
    res.cookie("token", token, { maxAge: 1000 * 60 * 60 * 48 });
    res.status(200).json({
      token,
      username: user.username,
      role: user.role,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.get("/api/v2/channels/:channel", async (req, res) => {
  const { channel } = req.params;
  try {
    jwt.verify(req.cookies.token, config.secret);
    const validationChannel = await Channel.findOne({
      name: channel,
    }).exec();

    if (!validationChannel) {
      console.log(channel, "Channel doesn't exist");
      return res.status(404).send("Channel doesn't exist");
    }
    res.status(200).json(validationChannel);
  } catch (err) {
    res.status(401).json({ error: err });
  }
});

app.get("/api/v2/channels", async (req, res) => {
  try {
    jwt.verify(req.cookies.token, config.secret);
    const channels = await Channel.find();
    res.status(200).send(channels);
  } catch (err) {
    res.status(404).json({ error: err });
  }
});

app.post("/api/v2/channels", async (req, res) => {
  try {
    jwt.verify(req.cookies.token, config.secret);

    const newChannel = new Channel({
      name: req.body.name,
      description: req.body.description,
    });

    if (!req.body.name) {
      return res.status(422).json({ error: "Fill all required fields" });
    }

    const validationChannel = await Channel.findOne({
      name: req.body.name,
    }).exec();

    if (validationChannel) {
      console.log(validationChannel, "Channel already exists");
      return res.status(409).send("Channel already exists");
    }

    const channel = await newChannel.save();

    res.status(200).send(channel);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.patch("/api/v1/new-channels", async (req, res) => {
  try {
    jwt.verify(req.cookies.token, config.secret);

    if (!req.body.name) {
      return res.status(422).json({ error: "Fill all required fields" });
    }

    if (req.body.newName.length < 1 || req.body.newName === " ") {
      return res
        .status(422)
        .json({ error: "Name should have at list one character" });
    }

    const validationChannel = await Channel.findOne({
      name: req.body.name,
    }).exec();

    if (!validationChannel) {
      console.log(req.body.name, "Channel doesn't exist");
      return res.status(404).send(`'${req.body.name}' Channel doesn't exist`);
    }

    const channel = await Channel.findOneAndUpdate(
      { name: req.body.name },
      { description: req.body.newDescription, name: req.body.newName },
      { new: true }
    );

    res.status(200).json({ channel });
  } catch (err) {
    res.status(400).send(err);
  }
});

httpServer.listen(port, () => {
  console.log(`Example app listening at http://${getMyCurrentIP()}:${port}`);
});
