import jwt from "jsonwebtoken";
import config from "./config";
import Channel from "./model/Channel.model";

const listChannels = async (req, res, next) => {
  try {
    jwt.verify(req.cookies.token, config.secret);
    const channels = await Channel.find();
    res.status(200).send(channels);
  } catch (err) {
    next(err);
  }
};

const viewChannel = async (req, res, next) => {
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
    next(err);
  }
};

const createChannel = async (req, res, next) => {
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
    next(err);
  }
};

const updateChannel = async (req, res, next) => {
  try {
    jwt.verify(req.cookies.token, config.secret);

    if (!req.body.name || !req.body.newName) {
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
      return res.status(404).send(`${req.body.name} Channel doesn't exist`);
    }

    const channel = await Channel.findOneAndUpdate(
      { name: req.body.name },
      { description: req.body.newDescription, name: req.body.newName },
      { new: true }
    );

    res.status(200).json({ channel });
  } catch (err) {
    next(err);
  }
};

module.exports = { listChannels, createChannel, updateChannel, viewChannel };
