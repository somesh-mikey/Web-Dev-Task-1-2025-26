const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const captainSchema = new mongoose.Schema({
  fullname: {
    firstname: {
      type: String,
      required: true,
      minlength: [3, "First name must be at least 3 characters"],
    },
    lastname: {
      type: String,
      minlength: [3, "Last name must be at least 3 characters"],
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: [6, "Password must be at least 6 characters"],
  },
  socketID: {
    type: String,
    default: null,
  },

  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },

  vehicle: {
    color: {
      type: String,
      required: true,
      minlength: [3, "Vehicle name must be at least 3 characters"],
    },
    plate: {
      type: String,
      required: true,
      minlength: [3, "Vehicle name must be at least 3 characters"],
    },
    capacity: {
      type: Number,
      required: true,
      min: [1, "Capacity must be at least 1"],
    },
    vehicleType: {
      type: String,
      required: true,
      enum: ["car", "motorcycle", "three-wheeler"],
    },
  },
  location: {
    lat: {
      type: Number,
    },
    lng: {
      type: Number,
    },
  },
});

captainSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
  return token;
};
captainSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
captainSchema.statics.hashPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const captainModel = mongoose.model("Captain", captainSchema);
module.exports = captainModel;
