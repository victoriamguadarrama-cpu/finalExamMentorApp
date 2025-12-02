// Import Mongoose
const mongoose = require("mongoose");

// Import slugify
const slugify = require("slugify");


function isValidImage(value) {
  return /\.(jpg|jpeg|png)$/i.test(value);
}

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    maxlength: [50, "Title must be at most 50 characters"]
  },
  image: {
    type: String,
    required: [true, "Image is required"],
    validate: {
      validator: isValidImage,
      message: "Image must be a .jpg, .jpeg, or .png file"
    }
  },
  summary: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  capacity: { 
    type: Number, 
    required: true 
  },
  registrants: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  }],
  likes: { 
    type: Number, 
    default: 0 
  },
  trainer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Trainer",
    required: true 
  },
  slug: { 
    type: String, 
    unique: true 
  },
  schedule: { 
    type: String, 
    default: "" 
  }
});



courseSchema.pre("save", function () {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, trim: true });
  }
});



module.exports = mongoose.model("Course", courseSchema);
