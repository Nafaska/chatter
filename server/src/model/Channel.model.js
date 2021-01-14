import mongoose from "mongoose";

const channelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    participants: {
      type: [String],
    },
  },
  {
    timestamp: true,
  }
);

export default mongoose.model("channels", channelSchema);
