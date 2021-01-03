"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _bcryptNodejs = _interopRequireDefault(require("bcrypt-nodejs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const userSchema = new _mongoose.default.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: [String],
    default: ["user"]
  },
  password: {
    type: String,
    required: true
  }
}, {
  timestamp: true
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = _bcryptNodejs.default.hashSync(this.password);
  return next();
});
userSchema.method({
  passwordMatches(password) {
    console.log(_bcryptNodejs.default.hashSync(password), this.password);
    return _bcryptNodejs.default.compareSync(password, this.password);
  }

});
userSchema.statics = {
  async findAndValidateUser({
    email,
    password
  }) {
    if (!email) {
      throw new Error("No Email");
    }

    if (!password) {
      throw new Error("No Password");
    }

    const user = await this.findOne({
      email
    }).exec();

    if (!user) {
      throw new Error("No User");
    }

    const isPasswordOk = await user.passwordMatches(password);

    if (!isPasswordOk) {
      throw new Error("PasswordIncorrect");
    }

    return user;
  }

};

var _default = _mongoose.default.model("users", userSchema);

exports.default = _default;