const mongoose = require("mongoose");

function isValidImage(value) {
  return /\.(jpg|jpeg|png)$/i.test(value);
}

const eventSchema = new mongoose.Schema({
  title: { 
    type: String,
    required: true,
    maxlength: [50, "Title must be at most 50 characters"]
  },
  summary: { 
    type: String,
    required: true,
    maxlength: [350, "Summary must be at most 350 characters"]
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: isValidImage,
      message: "Image must be a .jpg, .jpeg, or .png file"
    }
  },
  date: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model("Event", eventSchema);  