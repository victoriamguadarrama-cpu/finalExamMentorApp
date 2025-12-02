// Import mongoose
const mongoose = require("mongoose");

// Contact Model
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: [50, "Name must be less than or equal to 50 characters"]
  },
  email: {
    type: String,
    required: true,
    match: [/.+@.+\..+/, "Please enter a valid email address"]
  },
  subject: { 
    type: String, 
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  postDate: { 
    type: Date, 
    required: true,
    default: Date.now 
  },
  response: { 
    type: String, 
    default: null 
  },
  responseDate: { 
    type: Date,
    default: null 
  }
});

module.exports = mongoose.model("Contact", contactSchema);
