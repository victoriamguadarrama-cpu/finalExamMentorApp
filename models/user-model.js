// Import things
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const emailRegex = /.+@.+\..+/;

// User Model - Simple version
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"],
    maxlength: [50, "First name must be less than 50 characters"]
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
    maxlength: [50, "Last name must be less than 50 characters"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [emailRegex, "Please enter a valid email address"]
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"]
  },
  roles: {
    type: [String],
    default: ["user"]
  },
  courses: [
    {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
    }
  ]
});


userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  try {
    const hashed = await bcrypt.hash(this.password, 12);
    this.password = hashed;
  } catch (err) {
    throw err;
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema, "users");
