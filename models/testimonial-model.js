// Import Mongoose
const mongoose = require("mongoose");


function isValidImage(value) {
  return /\.(jpg|jpeg|png)$/i.test(value);
}



// Testimonial Model
const testimonialSchema = new mongoose.Schema({
  name: { 
    type: String,
    required: true,
    maxlength: [50, "Name must be less than 50 characters"] 
  },
  title: { 
    type: String,
    required: true,
    maxlength: [100, "Title must be at most 100 characters"]
  },
  rating: {
    type: Number,
    required: true,
    min: [1, "Rating must be at least 1"],
    max: [5, "Rating cannot exceed 5"]
  },
  testimonial: {
    type: String,
    required: true
  },
  image: {
    type: String,
    validate: {
      validator: isValidImage,
      message: "Image must be a .jpg, .jpeg, or .png file"
    }
  }
});

module.exports = mongoose.model("Testimonial", testimonialSchema);  
