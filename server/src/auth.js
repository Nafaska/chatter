import jwt from "jsonwebtoken";
import config from "./config";
import User from "./model/User.model";

const verifyAuth = (app) => {
  app.get("/api/v1/auth/signin", async (req, res) => {
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
      res.status(401).json({ error: err });
    }
  });
};
const signin = (app) => {
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
        id: user._id,
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
};

const signup = (app) => {
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

      const validationUser = await User.findOne({
        email: req.body.email,
      }).exec();
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
        id: user._id,
      });
    } catch (err) {
      res.status(500).json({ error: "Something went wrong" });
    }
  });
};

module.exports = { verifyAuth, signin, signup };
