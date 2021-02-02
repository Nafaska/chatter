import jwt from "jsonwebtoken";
import config from "./config";
import Channel from "./model/Channel.model";

const getAllChannels = (app) => {
  app.get("/api/v2/channels", async (req, res) => {
    try {
      jwt.verify(req.cookies.token, config.secret);
      const channels = await Channel.find();
      res.status(200).send(channels);
    } catch (err) {
      res.status(404).json({ error: err });
    }
  });
};
const getChannel = (app) => {
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
};

const createChannel = (app) => {
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
};

const updateChannel = (app) => {
  app.patch("/api/v1/update-channel", async (req, res) => {
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
};

module.exports = { getAllChannels, createChannel, updateChannel, getChannel };
