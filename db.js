const mangoose = require("mangoose");

require("dotenv").config();

const { MAIN_PORT: mainPort } = process.env;

const connectDB = async () => {
  try {
    await mangoose.connect(mainPort, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connection succesful");
  } catch (e) {
    console.error(e);
  }
};

const contactSchema = new mangoose.Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
});

const ContactDB = mangoose.model("Contact", contactSchema);

module.exports = { connectDB, ContactDB };
