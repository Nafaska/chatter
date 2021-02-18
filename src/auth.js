import jwt from "jsonwebtoken";
import config from "./config";
import User from "./model/User.model";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.CLIENT_ID);
const validateEmailRegexp = /^\S+@\S+$/; //simple validation that email string contains @

const verifyAuth = async (req, res, next) => {
  try {
    const jwtUser = jwt.verify(req.cookies.token, config.secret);
    const user = await User.findById(jwtUser.uid);
    res.status(200).json({
      token: req.cookies.token,
      username: user.username,
      role: user.role,
      email: user.email,
      id: user._id,
    });
  } catch (err) {
    next(err);
  }
};

const signin = async (req, res, next) => {
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
      id: user._id,
    });
  } catch (err) {
    next(err);
  }
};

const signup = async (req, res, next) => {
  try {
    if (!req.body.email || !req.body.password || !req.body.username) {
      console.error(`Fill all required fields: ${req.body}`);
      return res.status(422).json({ error: "Fill all required fields" });
    }
    if (!validateEmailRegexp.test(req.body.email)) {
      console.error(`Email invalid: ${req.body.email}`);
      return res.status(422).json({ error: "Email invalid" });
    }

    const newUser = new User({
      email: req.body.email,
      password: req.body.password,
      username: req.body.username,
    });

    const user = await newUser.save();

    const payload = { uid: user.id };
    const token = jwt.sign(payload, config.secret, { expiresIn: "48h" });
    res.cookie("token", token, { maxAge: 1000 * 60 * 60 * 48 });

    res.status(200).json({
      token,
      username: user.username,
      role: user.role,
      email: user.email,
      id: user._id,
    });
  } catch (err) {
    next(err);
  }
};

const googleSignin = async (req, res, next) => {
  try {
    const googleToken = req.body.token;

    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: config.clientId,
    });

    const { name, email } = ticket.getPayload();
    const user = await User.findOneAndUpdate(
      { email: email },
      { $set: { username: name } },
      { upsert: true, new: true }
    );

    const payload = { uid: user.id };
    const token = jwt.sign(payload, config.secret, { expiresIn: "48h" });
    res.cookie("token", token, { maxAge: 1000 * 60 * 60 * 48 });

    res.status(200).json({
      token,
      username: user.username,
      role: user.role,
      email: user.email,
      id: user._id,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { verifyAuth, signin, signup, googleSignin };
