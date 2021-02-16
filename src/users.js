import jwt from "jsonwebtoken";
import config from "./config";
import User from "./model/User.model";
import { ObjectID } from "mongodb";

const validateEmailRegexp = /^\S+@\S+$/; //simple validation that email string contains @
const ROLES = ["user", "admin"];

const getAllUsers = (app) => {
  app.get("/api/v2/users", async (req, res) => {
    try {
      if (!req.cookies.token) {
        return res.status(401).json({ error: "You have to login" });
      }
      jwt.verify(req.cookies.token, config.secret);

      const users = await User.find({}, "email username _id role");
      res.status(200).send(users);
    } catch (error) {
      if (error.name === "JsonWebTokenError") {
        res
          .status(403)
          .json({ error: "User doesn't have access", message: error.message });
      } else {
        res.status(500).json({ error });
      }
    }
  });
};

const deleteUser = (app) => {
  app.delete("/api/v2/users/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
      if (!ObjectID.isValid(userId)) {
        return res.status(404).json({ message: "Invalid parameter format" });
      }

      if (!req.cookies.token) {
        return res.status(401).json({ error: "You have to login" });
      }
      jwt.verify(req.cookies.token, config.secret);

      if (!req.body.id) {
        res.status(400).json({ message: "Fill all required fields" });
      }

      const user = await User.findById(req.body.id).exec();
      if (!user) {
        return res
          .status(404)
          .json({ error: `User ${req.body.id} doesn't exist` });
      }

      const isAdmin = user.role.includes("admin");
      if (!isAdmin) {
        console.log(`User ${req.body.id} doesn't have access`);
        return res
          .status(403)
          .json({ error: `User ${req.body.id} doesn't have access` });
      }
      const result = await User.deleteOne({ _id: userId });
      if (result.deletedCount === 1) {
        const users = await User.find({}, "email username _id role");
        res.status(200).json({ message: "Deleted Successfully", users });
      } else {
        res.status(404).json({
          message: "Record doesn't exist or already has been deleted",
        });
      }
    } catch (error) {
      if (error.name === "JsonWebTokenError") {
        res
          .status(403)
          .json({ error: "User doesn't have access", message: error.message });
      } else if (
        String(error.reason).includes(
          "Argument passed in must be a single String of 12 bytes or a string of 24 hex characters"
        )
      ) {
        res.status(404).json({ message: "Record doesn't exist" });
      } else {
        res.status(500).json({ error });
      }
    }
  });
};

const updateUser = (app) => {
  app.patch("/api/v2/users/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
      if (!ObjectID.isValid(userId)) {
        return res.status(404).json({ message: "Invalid parameter format" });
      }

      if (!req.cookies.token) {
        return res.status(401).json({ error: "You have to login" });
      }
      jwt.verify(req.cookies.token, config.secret);

      const user = await User.findById(req.body.id).exec();
      if (!user) {
        return res
          .status(404)
          .json({ error: `User ${req.body.id} doesn't exist` });
      }

      const isAdmin = user.role.includes("admin");

      if (!isAdmin) {
        console.log(`User ${req.body.id} doesn't have access`);
        return res
          .status(403)
          .json({ error: `User ${req.body.id} doesn't have access` });
      }

      if (req.body.newUsername.length < 1 || req.body.newUsername === " ") {
        return res
          .status(422)
          .json({ error: "Username should have at list one character" });
      }

      if (!validateEmailRegexp.test(req.body.newEmail)) {
        return res.status(422).json({ error: "Email invalid" });
      }

      const validateRole = req.body.newRole.every((role) =>
        ROLES.includes(role)
      );
      const roleWithoutDuplicates = Array.from(new Set(req.body.newRole))
        .sort()
        .reverse();

      if (req.body.newRole.length < 1 || !validateRole) {
        return res.status(422).json({ error: "Role invalid" });
      }

      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        {
          username: req.body.newUsername,
          email: req.body.newEmail,
          role: roleWithoutDuplicates,
        }
      );

      if (!updatedUser) {
        console.log(`${userId} User doesn't exist`);
        return res.status(404).send(`${userId} User doesn't exist`);
      }

      const users = await User.find({}, "email username _id role");

      res.status(200).json({ users });
    } catch (error) {
      if (error.name === "JsonWebTokenError") {
        res
          .status(403)
          .json({ error: "User doesn't have access", message: error.message });
      } else if (
        String(error.reason).includes(
          "Argument passed in must be a single String of 12 bytes or a string of 24 hex characters"
        )
      ) {
        res.status(404).json({ message: "Record doesn't exist" });
      } else {
        res.status(500).json({ error });
      }
    }
  });
};

module.exports = { getAllUsers, updateUser, deleteUser };
