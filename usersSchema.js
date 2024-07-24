const mangoose = require("mangoose");
const Schema = mangoose.Schema;
const bCrypt = require("bcryptjs");

const userSchema = new Schema({
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
  },
  token: {
    type: String,
    default: null,
  },
});

userSchema.methods.setPassword = (password) => {
  this.password = bCrypt.hashSync(password, bCrypt.genSaltSync(6));
};

userSchema.methods.validPassword = (password) => {
  return bCrypt.compareSync(password, this.password);
};

const UserDB = mangoose.model("User", userSchema);

module.exports = { UserDB };
