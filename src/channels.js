import Channel from "./model/Channel.model";

const listChannels = async (req, res, next) => {
  try {
    const channels = await Channel.find();
    res.status(200).send(channels);
  } catch (err) {
    next(err);
  }
};

const viewChannel = async (req, res, next) => {
  const { channel } = req.params;
  try {
    const validationChannel = await Channel.findOne({
      name: channel,
    }).exec();

    if (!validationChannel) {
      console.error(channel, "Channel doesn't exist");
      return res.status(404).json({ error: "Channel doesn't exist" });
    }
    res.status(200).json(validationChannel);
  } catch (err) {
    next(err);
  }
};

const createChannel = async (req, res, next) => {
  try {
    const newChannel = new Channel({
      name: req.body.name,
      description: req.body.description,
    });

    if (!req.body.name) {
      console.error("Fill all required fields: name is missing");
      return res.status(422).json({ error: "Fill all required fields" });
    }

    const validationChannel = await Channel.findOne({
      name: req.body.name,
    }).exec();

    if (validationChannel) {
      console.error(validationChannel, "Channel already exists");
      return res.status(409).json({ error: "Channel already exists" });
    }

    const channel = await newChannel.save();

    res.status(200).send(channel);
  } catch (err) {
    next(err);
  }
};

const updateChannel = async (req, res, next) => {
  const { channelName } = req.params;
  try {
    if (!req.body.newName) {
      console.error("Fill all required fields: newName is missing");
      return res.status(422).json({ error: "Fill all required fields" });
    }

    if (req.body.newName.length < 1 || req.body.newName === " ") {
      console.error(
        `Name should have at list one character: ${req.body.newName}`
      );
      return res
        .status(422)
        .json({ error: "Name should have at list one character" });
    }

    const validationChannel = await Channel.findOne({
      name: channelName,
    }).exec();

    if (!validationChannel) {
      console.error(channelName, "Channel doesn't exist");
      return res
        .status(404)
        .json({ error: `${channelName} channel doesn't exist` });
    }

    const channel = await Channel.findOneAndUpdate(
      { name: channelName },
      { description: req.body.newDescription, name: req.body.newName },
      { new: true }
    );

    res.status(200).json({ channel });
  } catch (err) {
    next(err);
  }
};

module.exports = { listChannels, createChannel, updateChannel, viewChannel };
