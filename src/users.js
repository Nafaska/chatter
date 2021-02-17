import jwt from "jsonwebtoken";
import config from "./config";
import User from "./model/User.model";
import { ObjectID } from "mongodb";

const validateEmailRegexp = /^\S+@\S+$/; //simple validation that email string contains @
const ROLES = ["user", "admin"];

const listUsers = async (req, res, next) => {
  try {
    jwt.verify(req.cookies.token, config.secret);

    const users = await User.find({}, "email username _id role");
    res.status(200).send(users);
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  const { userId } = req.params;
  try {
    if (!req.body.id) {
      res.status(400).json({ message: "Fill all required fields" });
    }

    if (!ObjectID.isValid(userId) || !ObjectID.isValid(req.body.id)) {
      return res.status(422).json({ message: "Invalid parameter format" });
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
    const result = await User.deleteOne({ _id: userId });
    if (result.deletedCount === 1) {
      const users = await User.find({}, "email username _id role");
      res.status(200).json({ message: "Deleted Successfully", users });
    } else {
      res.status(404).json({
        message: "Record doesn't exist or already has been deleted",
      });
    }
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  const { userId } = req.params;
  try {
    if (
      !req.body.id ||
      !req.body.newUsername ||
      !req.body.newEmail ||
      !req.body.newRole
    ) {
     return res.status(400).json({ message: "Fill all required fields" });
    }

    if (!ObjectID.isValid(userId) || !ObjectID.isValid(req.body.id)) {
      return res.status(404).json({ message: "Invalid parameter format" });
    }

    if (req.body.newUsername.length < 1 || req.body.newUsername === " ") {
      return res
        .status(422)
        .json({ error: "Username should have at list one character" });
    }

    if (!validateEmailRegexp.test(req.body.newEmail)) {
      return res.status(422).json({ error: "Email invalid" });
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


    const validateRole = req.body.newRole.every((role) => ROLES.includes(role));
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
  } catch (err) {
    next(err);
  }
};

module.exports = { listUsers, updateUser, deleteUser };
