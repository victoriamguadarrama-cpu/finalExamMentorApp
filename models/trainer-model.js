// Import Mongoose
const mongoose = require("mongoose");


function isValidImage(value) {
  return /\.(jpg|jpeg|png)$/i.test(value);
} 


// Trainer Model
const trainerSchema = new mongoose.Schema({
  name: { 
    type: String,
    required: true,
    maxlength: [50, "Name must be less than 50 characters"] 
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: isValidImage,
      message: "Image must be a .jpg, .jpeg, or .png file"
    }
  },
  expertise: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Trainer", trainerSchema);  
