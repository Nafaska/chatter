import jwt from "jsonwebtoken";
import config from "./config";
import User from "./model/User.model";

const validateEmailRegexp = /^\S+@\S+$/; //simple validation that email string contains @
const ROLES = ["user", "admin"];

const getAllUsers = (app) => {
  app.get("/api/v2/users", async (req, res) => {
    try {
      jwt.verify(req.cookies.token, config.secret);
      const users = await User.find({}, "email username _id role");
      res.status(200).send(users);
    } catch (err) {
      res.status(404).json({ error: err });
    }
  });
};

const deleteUser = (app) => {
  app.delete("/api/v2/users/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
      jwt.verify(req.cookies.token, config.secret);
      const user = await User.findById(req.body.id).exec();
      const isAdmin = user.role.includes("admin");

      if (!isAdmin) {
        console.log(`User ${req.body.id} doesn't have access`);
        return res.status(403).json({error: `User ${req.body.id} doesn't have access`});
      }
      User.deleteOne({ _id: userId }, async (err, result) => {
        if (err) {
          res.status(404).json({ error: err });
        } else if (result.deletedCount === 1) {
          const users = await User.find({}, "email username _id role");
          res.status(200).json({ message: "User has been deleted", users });
        } else if (result.deletedCount === 0) {
          res.status(200).json({ message: "User doesn't exist" });
        }
      });
    } catch (err) {
      res.status(404).json({ error: err });
    }
  });
};

const updateUser = (app) => {
  app.patch("/api/v2/users/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
      jwt.verify(req.cookies.token, config.secret);
      const user = await User.findById(req.body.id).exec();
      const isAdmin = user.role.includes("admin");

      if (!isAdmin) {
        console.log(`User ${req.body.id} doesn't have access`);
        return res.status(403).json({ error: `User ${req.body.id} doesn't have access`});
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
      const roleWithoutDuplicates = Array.from(new Set(req.body.newRole)).sort().reverse();

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
      res.status(400).json({error: err});
    }
  });
};

module.exports = { getAllUsers, updateUser, deleteUser };
