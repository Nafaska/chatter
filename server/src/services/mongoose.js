import mongoose from "mongoose";
// import config from "../config";

const MONGO_URL= "mongodb://127.0.0.1:27017/auth"

mongoose.connection.on("connected", () => {
  console.log("db is connected");
});

mongoose.connection.on("error", (err) => {
  console.log(`can not connect to db ${err}`);
  process.exit(1);
});

mongoose.set("useFindAndModify", false);

exports.connect = async () => {
  mongoose.connect(MONGO_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  });
  return mongoose.connection;
};
