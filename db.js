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
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
});

const ContactDB = mangoose.model("Contact", contactSchema);

module.exports = { connectDB, ContactDB };
