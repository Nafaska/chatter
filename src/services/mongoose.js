import mongoose from "mongoose";
import config from "../config";

mongoose.connection.on("connected", () => {
  console.log("db is connected");
});

mongoose.connection.on("error", (err) => {
  console.log(`can not connect to db ${err}`);
  process.exit(1);
});

mongoose.set("useFindAndModify", false);

exports.connect = async () => {
  try {
    await mongoose.connect(config.mongoURL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    });
  } catch (error) {
    console.log(error, 'db failed');
  }

  return mongoose.connection;
};
